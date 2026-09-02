export type OrderConfirmationEnv = {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_TEMPLATE_ID?: string;
};

export type OrderConfirmation = {
  _id: string;
  reference: string;
  total: number;
  tax?: number;
  subtotal: number;
  customer: { fullName: string; email: string; phone?: string };
  shipping: {
    delivery: string;
    shippingCost: number;
    address?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  items: { 
    name: string; 
    price: number; 
    qty: number; 
    size?: string; 
    lineTotal: number;
    imageUrl?: string | null;
    productId?: string;
  }[];
  currency: string;
  createdAt: string;
  paymentMethod?: string;
};

import { Resend } from "resend";
import { formatDispatchDate } from "./dispatch";

const cleanSecret = (value: string) =>
  value.trim().replace(/^["']|["']$/g, "");

const zar = (amount: number) =>
  `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

export const formatOrderDate = (createdAt: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  }).format(new Date(createdAt));

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const renderOrderItem = (item: OrderConfirmation["items"][number]) => {
  const image = item.imageUrl
    ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" width="90" height="90" class="product-image" style="display:block;width:90px;height:90px;object-fit:cover;border-radius:4px;background:#e5e5e2;">`
    : `<table role="presentation" width="90" height="90" cellpadding="0" cellspacing="0" border="0" bgcolor="#e5e5e2" style="width:90px;height:90px;background:#e5e5e2;border-radius:4px;"><tr><td align="center" valign="middle" style="font-size:9px;line-height:14px;color:#858585;text-transform:uppercase;">No Image</td></tr></table>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr><td width="100" valign="top" style="width:100px;padding:0 14px 18px 0;">${image}</td><td valign="top" style="padding:3px 10px 18px 0;"><p style="margin:0 0 8px;padding:0;font-size:13px;line-height:18px;font-weight:700;color:#222a31;">${escapeHtml(item.name)}</p><p style="margin:0 0 4px;padding:0;font-size:11px;line-height:16px;color:#666b70;">Size: <span style="color:#30363b;">${escapeHtml(item.size || "—")}</span></p><p style="margin:0;padding:0;font-size:11px;line-height:16px;color:#666b70;">Quantity: <span style="color:#30363b;">${escapeHtml(item.qty)}</span></p></td><td width="115" align="right" valign="top" style="width:115px;padding:3px 0 18px 8px;font-size:13px;line-height:18px;font-weight:700;color:#30363b;white-space:nowrap;">${escapeHtml(zar(item.lineTotal))}</td></tr></table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;"><tr><td height="1" bgcolor="#d8d8d5" style="height:1px;line-height:1px;font-size:1px;background:#d8d8d5;">&nbsp;</td></tr></table>`;
};

const buildTemplateVariables = (order: OrderConfirmation) => {
  const itemVariables = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [
      `order_item_${index + 1}_html`,
      order.items?.[index] ? renderOrderItem(order.items[index]) : "",
    ]),
  );

  return {
    customer_name: order.customer.fullName,
    order_ref: order.reference,
    order_total: zar(order.total),
    subtotal: zar(order.subtotal || 0),
    delivery_method: order.shipping?.delivery || "standard",
    shipping_cost:
      (order.shipping?.shippingCost || 0) === 0
        ? "Free"
        : zar(order.shipping.shippingCost),
    tax: zar(order.tax || 0),
    dispatch_date: formatDispatchDate(),
    order_date: formatOrderDate(order.createdAt),
    payment_method: order.paymentMethod || "—",
    ...itemVariables,
  };
};

export async function sendOrderConfirmation(
  env: OrderConfirmationEnv,
  order: OrderConfirmation
) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  if (!env.RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL is not configured");
  if (!order.customer?.email) throw new Error("Order has no customer email");

  const apiKey = cleanSecret(env.RESEND_API_KEY).replace(/^Bearer\s+/i, "");
  const fromEmail = cleanSecret(env.RESEND_FROM_EMAIL);

  const resend = new Resend(apiKey);
  // Yoco can deliver more than one success event for the same payment, and
  // webhook retries can overlap. Resend uses this key to return the original
  // send result instead of delivering another copy of the same order email.
  const idempotencyKey = `order-confirmation-${order._id}`.slice(0, 256);

  if (env.RESEND_TEMPLATE_ID) {
    const variables = buildTemplateVariables(order);
    const templateId = cleanSecret(env.RESEND_TEMPLATE_ID);

    console.log("[Resend] Sending email with template:", templateId);

    const result = await resend.emails.send(
      {
        from: fromEmail,
        to: [order.customer.email],
        replyTo: "tandtcompany525@gmail.com",
        subject: `Order Confirmed — ${order.reference}`,
        template: {
          id: templateId,
          variables,
        },
      },
      { idempotencyKey },
    );

    if (result.error) {
      console.error("[Resend] Error:", result.error);
      throw new Error(`Resend rejected the email: ${result.error.message}`);
    }

    console.log("[Resend] Email sent successfully, ID:", result.data?.id);
    return result.data?.id;
  }

  // Fallback: inline HTML (kept for backward compatibility if template not configured)
  const html = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <h2 style="color: #071726; margin-bottom: 4px;">Order Confirmed</h2>
    <p style="color: #888; margin-top: 0;">Thank you, ${order.customer.fullName}!</p>
    <p style="color: #555;">We are honoured to be part of your story. Your order has been received and is being processed.</p>
    <div style="background: #f9f7f3; padding: 16px 20px; margin: 24px 0; border-left: 4px solid #c5a55a;">
      <p style="margin: 0; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Order Reference</p>
      <p style="margin: 4px 0 0; color: #071726; font-size: 20px; font-weight: 600;">#${order.reference}</p>
    </div>
    <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
      <thead><tr>
        <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; color: #071726; font-weight: 600;">Item</td>
        <td style="padding: 0 0 8px; border-bottom: 2px solid #071726; text-align: right; color: #071726; font-weight: 600;">Total</td>
      </tr></thead>
      <tbody>
        ${(order.items || []).map((item) => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">${item.name} &times; ${item.qty}${item.size ? ` (${item.size})` : ""}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; color: #333;">${zar(item.lineTotal)}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <div style="margin: 16px 0; padding-top: 8px; border-top: 1px solid #eee;">
      <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>Subtotal</span><span>${zar(order.subtotal || 0)}</span></div>
      <div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>Shipping (${order.shipping?.delivery || "standard"})</span><span>${(order.shipping?.shippingCost || 0) === 0 ? "Free" : zar(order.shipping.shippingCost)}</span></div>
      ${order.tax ? `<div style="display: flex; justify-content: space-between; padding: 4px 0;"><span>VAT</span><span>${zar(order.tax)}</span></div>` : ""}
      <div style="display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 8px; border-top: 2px solid #071726; font-size: 18px; font-weight: 600; color: #071726;"><span>Total</span><span>${zar(order.total)}</span></div>
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0" />
    <p style="color: #555; font-size: 14px; line-height: 1.6;">We dispatch orders on <strong>Tuesdays and Thursdays</strong>. Your estimated dispatch date is <strong>${formatDispatchDate()}</strong>.</p>
    <p style="color: #555; font-size: 14px; line-height: 1.6;">You will receive a dispatch notification once your order ships. Questions? Email <a href="mailto:stewardship@tandtcompany.com" style="color: #c5a55a;">stewardship@tandtcompany.com</a>.</p>
    <p style="color: #888; font-size: 12px; margin-top: 32px;">T AND T COMPANY (Pty) Ltd — A faith-led lifestyle brand.</p>
  </div>`;

  const result = await resend.emails.send(
    {
      from: fromEmail,
      to: [order.customer.email],
      replyTo: "tandtcompany525@gmail.com",
      subject: `Order Confirmed — ${order.reference}`,
      html,
    },
    { idempotencyKey },
  );

  if (result.error) {
    throw new Error(`Resend rejected the email: ${result.error.message}`);
  }

  return result.data?.id;
}
