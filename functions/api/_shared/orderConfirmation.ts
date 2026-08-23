export type OrderConfirmationEnv = {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
};

export type OrderConfirmation = {
  _id: string;
  reference: string;
  total: number;
  tax?: number;
  subtotal: number;
  customer: { fullName: string; email: string };
  shipping: { delivery: string; shippingCost: number };
  items: { name: string; price: number; qty: number }[];
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const zar = (amount: number) =>
  `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

export async function sendOrderConfirmation(
  env: OrderConfirmationEnv,
  order: OrderConfirmation
) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  if (!env.RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL is not configured");
  if (!order.customer?.email) throw new Error("Order has no customer email");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `order-confirmation/${order._id}`,
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [order.customer.email],
      reply_to: "tandtcompany525@gmail.com",
      subject: `Order Confirmed — ${order.reference}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #071726; margin-bottom: 4px;">Order Confirmed</h2>
          <p style="color: #888; margin-top: 0;">Thank you, ${escapeHtml(order.customer.fullName)}!</p>
          <p style="color: #555;">We are honoured to be part of your story. Your order has been received and is being processed.</p>
          <div style="background: #f9f7f3; padding: 16px 20px; margin: 24px 0; border-left: 4px solid #c5a55a;">
            <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Order Reference</p>
            <p style="margin: 4px 0 0; color: #071726; font-size: 20px; font-weight: 600;">#${escapeHtml(order.reference)}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead><tr>
              <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; color: #071726; font-weight: 600;">Item</td>
              <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; text-align: right; color: #071726; font-weight: 600;">Total</td>
            </tr></thead>
            <tbody>
              ${(order.items || []).map((item) => `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${escapeHtml(item.name)} &times; ${item.qty}</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; color: #333;">${zar(item.price * item.qty)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
          <div style="margin: 16px 0; padding-top: 8px; border-top: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>Subtotal</span><span>${zar(order.subtotal || 0)}</span></div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>Shipping (${escapeHtml(order.shipping?.delivery || "standard")})</span><span>${(order.shipping?.shippingCost || 0) === 0 ? "Free" : zar(order.shipping.shippingCost)}</span></div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>VAT</span><span>${zar(order.tax || 0)}</span></div>
            <div style="display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 8px; border-top: 2px solid #071726; font-size: 18px; font-weight: 600; color: #071726;"><span>Total</span><span>${zar(order.total)}</span></div>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #555; font-size: 14px; line-height: 1.6;">You will receive a dispatch notification once your order ships. Questions? Email <a href="mailto:stewardship@tandtcompany.com" style="color: #c5a55a;">stewardship@tandtcompany.com</a>.</p>
          <p style="color: #888; font-size: 12px; margin-top: 32px;">T AND T COMPANY (Pty) Ltd — A faith-led lifestyle brand.</p>
        </div>`,
    }),
  });

  const responseText = await response.text();
  const result = (() => {
    try {
      return JSON.parse(responseText) as {
        id?: string;
        message?: string;
        error?: { message?: string } | string;
      };
    } catch {
      return {};
    }
  })();

  const resultError = typeof result.error === "string"
    ? result.error
    : result.error?.message;

  if (!response.ok) {
    throw new Error(
      result.message || resultError || responseText.slice(0, 500) || `Resend rejected the email (${response.status})`
    );
  }

  return result.id;
}
