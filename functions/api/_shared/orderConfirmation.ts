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
  subtotal: number;
  total: number;
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

  if (env.RESEND_TEMPLATE_ID) {
    // Use the stored Resend template (ID: 76d7a2d5-c036-4606-9e64-4384dd9671f5)
    const result = await resend.emails.send({
      from: fromEmail,
      to: [order.customer.email],
      reply_to: "tandtcompany525@gmail.com",
      subject: `Order Confirmed — ${order.reference}`,
      template: env.RESEND_TEMPLATE_ID,
      variables: {
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
        order_date: order.createdAt,
        payment_method: order.paymentMethod || "—",
        order_items: (order.items || []).map((i) => ({
          name: i.name,
          qty: i.qty,
          size: i.size || "—",
          lineTotal: zar(i.lineTotal),
          imageUrl: i.imageUrl || "",
        })),
      },
    });

    if (result.error) {
      throw new Error(`Resend rejected the email: ${result.error.message}`);
    }

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

  const result = await resend.emails.send({
    from: fromEmail,
    to: [order.customer.email],
    reply_to: "tandtcompany525@gmail.com",
    subject: `Order Confirmed — ${order.reference}`,
    html,
  });

  if (result.error) {
    throw new Error(`Resend rejected the email: ${result.error.message}`);
  }

  return result.data?.id;
}