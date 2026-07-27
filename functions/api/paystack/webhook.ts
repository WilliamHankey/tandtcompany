import { Resend } from "resend";

type Env = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
  PAYSTACK_SECRET_KEY: string;
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

async function sha512HmacHex(secret: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body)
  );

  return [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

  if (!res.ok) {
    throw new Error(data?.error?.description || "Sanity query failed");
  }

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
    body: JSON.stringify({
      mutations: [{ patch: { id, set } }],
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error?.description || "Sanity patch failed");
  }
}

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return json({ error: "Missing Paystack signature" }, 401);
    }

    const rawBody = await request.text();
    const hash = await sha512HmacHex(env.PAYSTACK_SECRET_KEY, rawBody);

    if (hash !== signature) {
      return json({ error: "Invalid Paystack signature" }, 401);
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        status?: string;
        reference?: string;
        amount?: number;
        currency?: string;
        paid_at?: string;
      };
    };

    if (event.event !== "charge.success") {
      return json({ received: true });
    }

    const tx = event.data;

    if (!tx?.reference) {
      return json({ error: "Missing payment reference" }, 400);
    }

    const order = await sanityFetch<{
      _id: string;
      reference: string;
      status: string;
      total: number;
      currency: string;
    }>(
      env,
      `*[_type == "order" && reference == $reference][0]{
        _id,
        reference,
        status,
        total,
        currency
      }`,
      { reference: tx.reference }
    );

    if (!order) {
      return json({ error: "Order not found" }, 404);
    }

    const expectedAmount = Math.round(order.total * 100);

    if (
      tx.status === "success" &&
      tx.amount === expectedAmount &&
      tx.currency === order.currency
    ) {
      await sanityPatch(env, order._id, {
        status: "paid",
        "paystack.paidAt": tx.paid_at,
        "paystack.rawVerifyResponse": rawBody,
      });

      const fullOrder = await sanityFetch<{
        _id: string;
        reference: string;
        status: string;
        total: number;
        tax: number;
        subtotal: number;
        currency: string;
        customer: { fullName: string; email: string };
        shipping: { delivery: string; shippingCost: number };
        items: { name: string; price: number; qty: number }[];
      }>(
        env,
        `*[_type == "order" && reference == $reference][0]{
          _id, reference, status, total, tax, subtotal, currency,
          customer,
          shipping,
          items
        }`,
        { reference: tx.reference }
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
                  <thead>
                    <tr>
                      <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; color: #071726; font-weight: 600;">Item</td>
                      <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; text-align: right; color: #071726; font-weight: 600;">Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    ${(fullOrder.items || []).map((item: { name: string; price: number; qty: number }) => `
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${item.name} &times; ${item.qty}</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; color: #333;">R ${(item.price * item.qty).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
                <div style="margin: 16px 0; padding-top: 8px; border-top: 1px solid #eee;">
                  <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
                    <span>Subtotal</span><span>R ${(fullOrder.subtotal || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
                    <span>Shipping (${fullOrder.shipping?.delivery || "standard"})</span>
                    <span>${(fullOrder.shipping?.shippingCost || 0) === 0 ? "Free" : "R " + (fullOrder.shipping?.shippingCost || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
                    <span>VAT</span><span>R ${(fullOrder.tax || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 8px; border-top: 2px solid #071726; font-size: 18px; font-weight: 600; color: #071726;">
                    <span>Total</span><span>R ${fullOrder.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                  You will receive a dispatch notification once your order ships. If you have any questions, reply to this email or reach out via
                  <a href="mailto:stewardship@tandtcompany.com" style="color: #c5a55a;">stewardship@tandtcompany.com</a>.
                </p>
                <p style="color: #888; font-size: 12px; margin-top: 32px;">T AND T COMPANY (Pty) Ltd — A faith-led lifestyle brand.</p>
              </div>
            `,
          });
        } catch {
          // Email failure should not block webhook processing
        }
      }
    }

    return json({ received: true });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}