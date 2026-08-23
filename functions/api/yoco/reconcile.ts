import { sendOrderConfirmation } from "../_shared/orderConfirmation";
import { sendOrderNotification } from "../_shared/orderNotification";

type Env = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
  YOCO_SECRET_KEY: string;
  YOCO_WEBHOOK_REGISTRATION_TOKEN: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
};

type FunctionContext = {
  request: Request;
  env: Env;
};

type OrderItem = Record<string, unknown> & { _key?: string };

type Order = {
  _id: string;
  reference: string;
  status: string;
  total: number;
  tax?: number;
  subtotal: number;
  currency: string;
  items?: OrderItem[];
  customer: { fullName: string; email: string };
  shipping: { delivery: string; shippingCost: number };
  yoco?: {
    checkoutId?: string;
    confirmationEmailSentAt?: string;
    orderNotificationSentAt?: string;
  };
};

type YocoCheckout = {
  id?: string;
  status?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
  message?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function sanityFetch<T>(
  env: Env,
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
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
  if (!response.ok) {
    throw new Error(data?.error?.description || "Sanity query failed");
  }
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
  if (!response.ok) {
    throw new Error(data?.error?.description || "Sanity patch failed");
  }
}

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    if (!env.YOCO_WEBHOOK_REGISTRATION_TOKEN) {
      return json({ error: "YOCO_WEBHOOK_REGISTRATION_TOKEN is not configured" }, 500);
    }

    if (
      request.headers.get("authorization") !==
      `Bearer ${env.YOCO_WEBHOOK_REGISTRATION_TOKEN}`
    ) {
      return json({ error: "Unauthorized" }, 401);
    }

    if (!env.YOCO_SECRET_KEY || !env.SANITY_API_TOKEN) {
      return json({ error: "Yoco or Sanity credentials are not configured" }, 500);
    }

    const { reference } = (await request.json().catch(() => ({}))) as {
      reference?: string;
    };
    if (!reference) {
      return json({ error: "reference is required" }, 400);
    }

    const order = await sanityFetch<Order | null>(
      env,
      `*[_type == "order" && reference == $reference][0]{
        _id, reference, status, total, tax, subtotal, currency,
        customer, shipping, items, yoco
      }`,
      { reference }
    );

    if (!order) {
      return json({ error: "Order not found" }, 404);
    }

    const checkoutId = order.yoco?.checkoutId;
    if (!checkoutId) {
      return json({ error: "Order has no Yoco checkout ID" }, 409);
    }

    const yocoResponse = await fetch(
      `https://payments.yoco.com/api/checkouts/${encodeURIComponent(checkoutId)}`,
      {
        headers: {
          Authorization: `Bearer ${env.YOCO_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const checkout = (await yocoResponse.json().catch(() => ({}))) as YocoCheckout;

    if (!yocoResponse.ok) {
      return json({ error: checkout.message || "Yoco checkout lookup failed" }, 502);
    }

    const checkoutStatus = String(checkout.status || "").toLowerCase();
    if (!["completed", "succeeded", "successful", "paid"].includes(checkoutStatus)) {
      return json(
        { error: "Yoco has not confirmed this checkout as paid", status: checkout.status },
        409
      );
    }

    const expectedAmount = Math.round(order.total * 100);
    if (
      checkout.amount !== expectedAmount ||
      String(checkout.currency || "").toUpperCase() !== order.currency.toUpperCase()
    ) {
      return json({ error: "Payment amount or currency does not match order" }, 409);
    }

    const repairedItems = (order.items || []).map((item) => ({
      ...item,
      _key: item._key || crypto.randomUUID(),
    }));

    await sanityPatch(env, order._id, {
      status: "paid",
      items: repairedItems,
      "yoco.rawVerifyResponse": JSON.stringify(checkout),
      "yoco.paidAt": new Date().toISOString(),
    });

    let emailSent = Boolean(order.yoco?.confirmationEmailSentAt);
    let emailError: string | undefined;

    if (!emailSent) {
      try {
        await sendOrderConfirmation(env, {
          ...order,
          items: repairedItems as { name: string; price: number; qty: number }[],
        });
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
        await sendOrderNotification({
          ...order,
          items: repairedItems as { name: string; price: number; qty: number }[],
        });
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
      reconciled: true,
      reference: order.reference,
      status: "paid",
      repairedItemKeys: repairedItems.filter((_, index) => !order.items?.[index]?._key)
        .length,
      checkoutStatus: checkout.status,
      emailSent,
      notificationSent,
      ...(emailError ? { emailError } : {}),
      ...(notificationError ? { notificationError } : {}),
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Reconciliation failed" },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
