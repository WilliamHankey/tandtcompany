import { sendOrderConfirmation } from "../_shared/orderConfirmation";
import { sendOrderNotification } from "../_shared/orderNotification";

type Env = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
  YOCO_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_TEMPLATE_ID?: string;
  NTFY_ACCESS_TOKEN?: string;
};

type FunctionContext = {
  request: Request;
  env: Env;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// --- Yoco webhook signature verification ---------------------------------
// Scheme (from Yoco Checkout API docs):
//   signedContent = `${webhook-id}.${webhook-timestamp}.${rawBody}`
//   secret = base64decode( whsec_xxx.split("_")[1] )
//   expectedSig = base64( HMAC-SHA256(secret, signedContent) )
//   header `webhook-signature` = "v1,<base64sig> [v1,<base64sig> ...]"

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function constantTimeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  let mismatch = aBytes.length ^ bBytes.length;
  const length = Math.max(aBytes.length, bBytes.length);

  for (let i = 0; i < length; i++) {
    mismatch |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }

  return mismatch === 0;
}

async function verifyYocoSignature(
  secret: string,
  id: string,
  timestamp: string,
  rawBody: string,
  headerSig: string
): Promise<boolean> {
  const signedContent = `${id}.${timestamp}.${rawBody}`;

  const encodedSecret = secret.startsWith("whsec_")
    ? secret.slice("whsec_".length)
    : secret;
  const keyBytes = b64ToBytes(encodedSecret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedContent)
  );
  const expected = btoa(
    String.fromCharCode(...new Uint8Array(sigBuf))
  );

  // header may contain multiple "v1,<sig>" entries separated by spaces
  const candidates = headerSig
    .split(" ")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.replace(/^v\d+,/, ""));

  return candidates.some((candidate) => constantTimeEqual(candidate, expected));
}

async function sanityFetch<T>(
  env: Env,
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const url = `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/query/${env.VITE_SANITY_DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, params }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.description || "Sanity query failed");
  return data.result as T;
}

async function sanityPatch(env: Env, id: string, set: Record<string, unknown>) {
  const url = `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/mutate/${env.VITE_SANITY_DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations: [{ patch: { id, set } }] }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.description || "Sanity patch failed");
}

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const id = request.headers.get("webhook-id");
    const timestamp = request.headers.get("webhook-timestamp");
    const signature = request.headers.get("webhook-signature");

    if (!id || !timestamp || !signature) {
      return json({ error: "Missing Yoco webhook headers" }, 401);
    }

    if (!env.YOCO_WEBHOOK_SECRET) {
      return json({ error: "YOCO_WEBHOOK_SECRET is not configured" }, 500);
    }

    const rawBody = await request.text();

    // Replay protection: timestamp within 3 minutes
    const ts = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - ts) > 180) {
      return json({ error: "Webhook timestamp out of range" }, 401);
    }

    const ok = await verifyYocoSignature(
      env.YOCO_WEBHOOK_SECRET,
      id,
      timestamp,
      rawBody,
      signature
    );
    if (!ok) {
      return json({ error: "Invalid Yoco signature" }, 401);
    }

    const event = JSON.parse(rawBody) as {
      id?: string;
      type?: string;
      createdDate?: string;
      payload?: {
        id?: string;
        type?: string;
        status?: string;
        amount?: number;
        currency?: string;
        createdDate?: string;
        mode?: "test" | "live";
        metadata?: {
          checkoutId?: string;
          orderId?: string;
          reference?: string;
        };
      };
    };

    if (event.type !== "payment.succeeded" && event.type !== "payment.completed") {
          return json({ received: true, ignored: true });
        }

        if (!event.id || !event.payload || (event.payload.status !== "succeeded" && event.payload.status !== "completed")) {
          return json({ error: "Invalid payment succeeded payload" }, 400);
        }

    // The order is identified by either the Yoco checkout id or the Sanity
    // order id. `initialize.ts` stores both `yoco.checkoutId` (from Yoco's
    // create response) and sends `orderId` in the checkout metadata, so we
    // match on whichever the event provides.
    const checkoutId = event.payload.metadata?.checkoutId;
    const orderId = event.payload.metadata?.orderId;

    if (!checkoutId && !orderId) {
      return json({ error: "Missing checkoutId/orderId in metadata" }, 400);
    }

    const order = await sanityFetch<{
      _id: string;
      reference: string;
      status: string;
      total: number;
      currency: string;
      yoco?: {
        paymentId?: string;
        webhookEventId?: string;
        confirmationEmailSentAt?: string;
        orderNotificationSentAt?: string;
      };
    }>(
      env,
      `*[_type == "order" && (yoco.checkoutId == $checkoutId || _id == $orderId)][0]{
        _id, reference, status, total, currency, yoco
      }`,
      { checkoutId: checkoutId ?? "", orderId: orderId ?? "" }
    );

    if (!order) {
      return json({ error: "Order not found for checkout" }, 404);
    }

    // Yoco retries failed deliveries and can send the same payment under more
    // than one event id (e.g. `payment.succeeded` then `payment.completed`, or
    // a redelivery with a fresh event id). Deduplicate on the stable payment id
    // as well as the event id so a second delivery never re-sends the ntfy
    // notification. Each channel (email + ntfy) is tracked independently so a
    // partial failure on one delivery can be healed on the next without
    // double-sending the other.
    const isDuplicatePayment = order.yoco?.paymentId === event.payload.id;
    const isDuplicateEvent = order.yoco?.webhookEventId === event.id;
    const isDuplicate = isDuplicateEvent || isDuplicatePayment;
    const emailAlreadySent = Boolean(order.yoco?.confirmationEmailSentAt);
    const notificationAlreadySent = Boolean(order.yoco?.orderNotificationSentAt);

    if (isDuplicate && emailAlreadySent && notificationAlreadySent) {
      return json({ received: true, duplicate: true });
    }

    // For duplicate deliveries, skip each already-sent channel independently.
    if (isDuplicate && emailAlreadySent) {
      console.log("[Webhook] Skipping email - already sent for this payment");
    }
    if (isDuplicate && notificationAlreadySent) {
      console.log("[Webhook] Skipping notification - already sent for this payment");
    }

    const expectedAmount = Math.round(order.total * 100);
    if (
      event.payload.amount !== expectedAmount ||
      event.payload.currency !== order.currency
    ) {
      return json({ error: "Payment amount or currency does not match order" }, 400);
    }

    await sanityPatch(env, order._id, {
      status: "paid",
      "yoco.paymentId": event.payload.id,
      "yoco.webhookEventId": event.id,
      "yoco.mode": event.payload.mode,
      "yoco.paidAt": event.payload.createdDate || event.createdDate,
      "yoco.rawVerifyResponse": rawBody,
    });

    const fullOrder = await sanityFetch<{
          _id: string;
          reference: string;
          total: number;
          tax: number;
          subtotal: number;
          currency: string;
          createdAt: string;
          customer: { fullName: string; email: string; phone?: string };
          shipping: { delivery: string; shippingCost: number; address?: string; city?: string; postcode?: string; country?: string };
          items: { productId: string; sanityProductId?: string; name: string; price: number; qty: number; size?: string; lineTotal: number }[];
        }>(
          env,
          `*[_type == "order" && _id == $orderId][0]{
              _id, reference, total, tax, subtotal, currency, createdAt, customer, shipping, items
            }`,
          { orderId: order._id }
        );

        // Fetch product images for order items
        let itemsWithImages = fullOrder?.items || [];
        if (itemsWithImages.length > 0) {
          const productIds = itemsWithImages
            .flatMap((item) => [item.sanityProductId, item.productId])
            .filter((id): id is string => Boolean(id));
          if (productIds.length > 0) {
            const products = await sanityFetch<Array<{
              _id: string;
              sku?: string;
              imageUrl?: string | null;
            }>>(
              env,
              `*[_type == "product" && (_id in $ids || sku in $ids)]{
                _id,
                sku,
                "imageUrl": image.asset->url
              }`,
              { ids: productIds }
            );
            const productImages = new Map<string, string>();
            products.forEach((product) => {
              if (!product.imageUrl) return;
              productImages.set(product._id, product.imageUrl);
              if (product.sku) productImages.set(product.sku, product.imageUrl);
            });
            itemsWithImages = itemsWithImages.map((item) => ({
              ...item,
              imageUrl:
                (item.sanityProductId
                  ? productImages.get(item.sanityProductId)
                  : undefined) ||
                productImages.get(item.productId) ||
                null,
            }));
          }
        }

        let emailSent = emailAlreadySent;
                    let emailError: string | undefined;

                    if (fullOrder?.customer?.email && !emailSent) {
              try {
                console.log("[Webhook] Sending confirmation email via Resend...");
                console.log("[Webhook] Template ID:", env.RESEND_TEMPLATE_ID);
                console.log("[Webhook] To:", fullOrder.customer.email);
                console.log("[Webhook] Order ref:", fullOrder.reference);
        
                await sendOrderConfirmation(env, {
                  ...fullOrder,
                  items: itemsWithImages,
                  paymentMethod: "Yoco",
                });
                emailSent = true;
                console.log("[Webhook] Email sent successfully");
                await sanityPatch(env, order._id, {
                  "yoco.confirmationEmailSentAt": new Date().toISOString(),
                  "yoco.confirmationEmailError": null,
                });
              } catch (error) {
                emailError = error instanceof Error ? error.message : "Email failed";
                console.error("[Webhook] Email failed:", emailError);
                await sanityPatch(env, order._id, {
                  "yoco.confirmationEmailError": emailError,
                });
              }
            } else {
              console.log("[Webhook] Skipping email - emailSent:", emailSent, "customerEmail:", fullOrder?.customer?.email);
            }

    let notificationSent = notificationAlreadySent;
        let notificationError: string | undefined;

        if (fullOrder && !notificationSent) {
      try {
        await sendOrderNotification(env, fullOrder);
        notificationSent = true;
        await sanityPatch(env, order._id, {
          "yoco.orderNotificationSentAt": new Date().toISOString(),
          "yoco.orderNotificationError": null,
        });
      } catch (error) {
        notificationError = error instanceof Error ? error.message : "ntfy failed";
        await sanityPatch(env, order._id, {
          "yoco.orderNotificationError": notificationError,
        });
      }
    }

    return json({
      received: true,
      emailSent,
      notificationSent,
      ...(emailError ? { emailError } : {}),
      ...(notificationError ? { notificationError } : {}),
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
