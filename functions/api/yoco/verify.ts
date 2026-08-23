import {
  sendOrderConfirmation,
  type OrderConfirmation,
  type OrderConfirmationEnv,
} from "../_shared/orderConfirmation";
import { sendOrderNotification } from "../_shared/orderNotification";

type Env = OrderConfirmationEnv & {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
  YOCO_SECRET_KEY: string;
  NTFY_ACCESS_TOKEN?: string;
};

type FunctionContext = { request: Request; env: Env };

type Order = OrderConfirmation & {
  status: string;
  currency: string;
  yoco?: {
    confirmationEmailSentAt?: string;
    orderNotificationSentAt?: string;
  };
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function sanityFetch<T>(env: Env, query: string, params: Record<string, unknown>) {
  const url = `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/query/${env.VITE_SANITY_DATASET}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, params }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.description || "Sanity query failed");
  return data.result as T;
}

async function sanityPatch(env: Env, id: string, set: Record<string, unknown>) {
  const url = `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/mutate/${env.VITE_SANITY_DATASET}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations: [{ patch: { id, set } }] }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.description || "Sanity patch failed");
}

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const { checkoutId } = (await request.json()) as { checkoutId?: string };
    if (!checkoutId) return json({ error: "checkoutId is required" }, 400);
    if (!env.YOCO_SECRET_KEY) return json({ error: "YOCO_SECRET_KEY is not configured" }, 500);

    const response = await fetch(
      `https://payments.yoco.com/api/checkouts/${encodeURIComponent(checkoutId)}`,
      { headers: { Authorization: `Bearer ${env.YOCO_SECRET_KEY}` } }
    );
    const checkout = await response.json().catch(() => ({}));

    if (!response.ok || checkout.status === "error") {
      return json({ error: checkout.message || "Yoco checkout lookup failed" }, 400);
    }

    const checkoutStatus = String(checkout.status || "").toLowerCase();
    if (!["completed", "succeeded", "successful", "paid"].includes(checkoutStatus)) {
      return json({ error: "Payment has not been completed", status: checkout.status }, 409);
    }

    const order = await sanityFetch<Order | null>(
      env,
      `*[_type == "order" && yoco.checkoutId == $checkoutId][0]{
        _id, reference, status, total, tax, subtotal, currency,
        customer, shipping, items, yoco
      }`,
      { checkoutId }
    );

    if (!order) return json({ error: "Order not found for checkout" }, 404);

    if (
      checkout.amount !== Math.round(order.total * 100) ||
      String(checkout.currency || "").toUpperCase() !== order.currency.toUpperCase()
    ) {
      return json({ error: "Payment amount or currency does not match order" }, 409);
    }

    await sanityPatch(env, order._id, {
      status: "paid",
      "yoco.rawVerifyResponse": JSON.stringify(checkout),
      "yoco.paidAt": new Date().toISOString(),
    });

    let emailSent = Boolean(order.yoco?.confirmationEmailSentAt);
    let emailError: string | undefined;

    if (!emailSent) {
      try {
        await sendOrderConfirmation(env, order);
        emailSent = true;
        await sanityPatch(env, order._id, {
          "yoco.confirmationEmailSentAt": new Date().toISOString(),
          "yoco.confirmationEmailError": null,
        });
      } catch (error) {
        emailError = error instanceof Error ? error.message : "Email failed";
        await sanityPatch(env, order._id, {
          "yoco.confirmationEmailError": emailError,
        });
      }
    }

    let notificationSent = Boolean(order.yoco?.orderNotificationSentAt);
    let notificationError: string | undefined;

    if (!notificationSent) {
      try {
        await sendOrderNotification(env, order);
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
      status: checkout.status,
      amount: checkout.amount,
      currency: checkout.currency,
      reference: order.reference,
      emailSent,
      notificationSent,
      ...(emailError ? { emailError } : {}),
      ...(notificationError ? { notificationError } : {}),
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Failed to verify checkout" },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
