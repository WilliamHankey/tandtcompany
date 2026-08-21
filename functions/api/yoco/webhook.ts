import { Resend } from "resend";

type Env = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
  YOCO_SECRET_KEY: string;
  YOCO_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
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

async function verifyYocoSignature(
  secret: string,
  id: string,
  timestamp: string,
  rawBody: string,
  headerSig: string
): Promise<boolean> {
  const signedContent = `${id}.${timestamp}.${rawBody}`;

  const keyBytes = b64ToBytes(secret.replace(/^whsec_/, "").replace(/=$/, ""));
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

  let matched = false;
  for (const cand of candidates) {
    if (cand.length === expected.length) {
      const a = new TextEncoder().encode(cand);
      const b = new TextEncoder().encode(expected);
      if (crypto.subtle.timingSafeEqual(a, b)) matched = true;
    }
  }
  return matched;
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
      event?: string;
      data?: {
        id?: string;
        status?: string;
        amount?: number;
        currency?: string;
        paidAt?: string;
        metadata?: { checkoutId?: string; orderId?: string; reference?: string };
      };
    };

    const evtName = event.event || "";
    const isPaid =
      event.data?.status === "successful" ||
      /(succeeded|completed|paid)/i.test(evtName);

    if (!isPaid) {
      return json({ received: true });
    }

    const checkoutId =
      event.data?.metadata?.checkoutId || event.data?.metadata?.orderId;
    if (!checkoutId) {
      return json({ error: "Missing checkoutId in metadata" }, 400);
    }

    const order = await sanityFetch<{
      _id: string;
      reference: string;
      status: string;
      total: number;
      currency: string;
    }>(
      env,
      `*[_type == "order" && yoco.checkoutId == $checkoutId][0]{
        _id, reference, status, total, currency
      }`,
      { checkoutId }
    );

    if (!order) {
      return json({ error: "Order not found for checkout" }, 404);
    }

    const expectedAmount = Math.round(order.total * 100);
    if (
      event.data?.amount === expectedAmount &&
      event.data?.currency === order.currency
    ) {
      await sanityPatch(env, order._id, {
        status: "paid",
        "yoco.paidAt": event.data?.paidAt,
        "yoco.rawVerifyResponse": rawBody,
      });

      const fullOrder = await sanityFetch<{
        _id: string;
        reference: string;
        total: number;
        tax: number;
        subtotal: number;
        currency: string;
        customer: { fullName: string; email: string };
        shipping: { delivery: string; shippingCost: number };
        items: { name: string; price: number; qty: number }[];
      }>(
        env,
        `*[_type == "order" && _id == $orderId][0]{
          _id, reference, total, tax, subtotal, currency, customer, shipping, items
        }`,
        { orderId: order._id }
      );

      if (fullOrder?.customer?.email && env.RESEND_API_KEY) {
        try {
          const resend = new Resend(env.RESEND_API_KEY);
          await resend.emails.send({
            from: env.RESEND_FROM_EMAIL,
            to: fullOrder.customer.email,
            subject: `Order Confirmed — ${fullOrder.reference}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #071726; margin-bottom: 4px;">Order Confirmed</h2>
                <p style="color: #888; margin-top: 0;">Thank you, ${fullOrder.customer.fullName}!</p>
                <p style="color: #555;">We are honoured to be part of your story. Your order has been received and is being processed.</p>
                <div style="background: #f9f7f3; padding: 16px 20px; margin: 24px 0; border-left: 4px solid #c5a55a;">
                  <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Order Reference</p>
                  <p style="margin: 4px 0 0; color: #071726; font-size: 20px; font-weight: 600;">#${fullOrder.reference}</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                  <thead><tr>
                    <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; color: #071726; font-weight: 600;">Item</td>
                    <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; text-align: right; color: #071726; font-weight: 600;">Total</td>
                  </tr></thead>
                  <tbody>
                    ${(fullOrder.items || []).map((item) => `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${item.name} &times; ${item.qty}</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; color: #333;">R ${(item.price * item.qty).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</td>
                      </tr>`).join("")}
                  </tbody>
                </table>
                <div style="margin: 16px 0; padding-top: 8px; border-top: 1px solid #eee;">
                  <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;"><span>Subtotal</span><span>R ${(fullOrder.subtotal || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span></div>
                  <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;"><span>Shipping (${fullOrder.shipping?.delivery || "standard"})</span><span>${(fullOrder.shipping?.shippingCost || 0) === 0 ? "Free" : "R " + (fullOrder.shipping?.shippingCost || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span></div>
                  <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;"><span>VAT</span><span>R ${(fullOrder.tax || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span></div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 8px; border-top: 2px solid #071726; font-size: 18px; font-weight: 600; color: #071726;"><span>Total</span><span>R ${fullOrder.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span></div>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
                <p style="color: #555; font-size: 14px; line-height: 1.6;">You will receive a dispatch notification once your order ships. If you have any questions, reply to this email or reach out via <a href="mailto:stewardship@tandtcompany.com" style="color: #c5a55a;">stewardship@tandtcompany.com</a>.</p>
                <p style="color: #888; font-size: 12px; margin-top: 32px;">T AND T COMPANY (Pty) Ltd — A faith-led lifestyle brand.</p>
              </div>`,
          });
        } catch {
          // Email failure should not block webhook processing
        }
      }
    }

    return json({ received: true });
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
