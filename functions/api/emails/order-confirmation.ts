import { Resend } from "resend";

type Env = {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
};

type OrderItem = {
  name: string;
  price: number;
  qty: number;
};

type OrderEmailRequestBody = {
  customerEmail: string;
  customerName: string;
  reference: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  deliveryMethod: string;
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

function formatZAR(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

function buildItemsRows(items: OrderItem[]) {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">
          ${item.name} &times; ${item.qty}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; color: #333;">
          ${formatZAR(item.price * item.qty)}
        </td>
      </tr>`
    )
    .join("");
}

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const body = (await request.json()) as OrderEmailRequestBody;

    if (!body.customerEmail || !body.reference || !body.items?.length) {
      return json({ error: "Missing required order email fields" }, 400);
    }

    const resend = new Resend(env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: body.customerEmail,
      subject: `Order Confirmed — ${body.reference}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #071726; margin-bottom: 4px;">Order Confirmed</h2>
          <p style="color: #888; margin-top: 0;">Thank you, ${body.customerName}!</p>

          <p style="color: #555;">
            We are honoured to be part of your story. Your order has been received
            and is being processed.
          </p>

          <div style="background: #f9f7f3; padding: 16px 20px; margin: 24px 0; border-left: 4px solid #c5a55a;">
            <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Order Reference</p>
            <p style="margin: 4px 0 0; color: #071726; font-size: 20px; font-weight: 600;">#${body.reference}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr>
                <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; color: #071726; font-weight: 600;">Item</td>
                <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; text-align: right; color: #071726; font-weight: 600;">Total</td>
              </tr>
            </thead>
            <tbody>
              ${buildItemsRows(body.items)}
            </tbody>
          </table>

          <div style="margin: 16px 0; padding-top: 8px; border-top: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
              <span>Subtotal</span>
              <span>${formatZAR(body.subtotal)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
              <span>Shipping (${body.deliveryMethod})</span>
              <span>${body.shippingCost === 0 ? "Free" : formatZAR(body.shippingCost)}</span>
            </div>
            ${body.tax ? `
            <div style="display: flex; justify-content: space-between; padding: 4px 0; color: #555;">
              <span>VAT</span>
              <span>${formatZAR(body.tax)}</span>
            </div>` : ""}
            <div style="display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 8px; border-top: 2px solid #071726; font-size: 18px; font-weight: 600; color: #071726;">
              <span>Total</span>
              <span>${formatZAR(body.total)}</span>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />

          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            You will receive a dispatch notification once your order ships. If you
            have any questions, reply to this email or reach out via
            <a href="mailto:stewardship@tandtcompany.com" style="color: #c5a55a;">stewardship@tandtcompany.com</a>.
          </p>

          <p style="color: #888; font-size: 12px; margin-top: 32px;">
            T AND T COMPANY (Pty) Ltd — A faith-led lifestyle brand.
          </p>
        </div>
      `,
    });

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({ success: true });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send order confirmation email",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
