import type { OrderConfirmation } from "./orderConfirmation";
import { formatDispatchDate } from "./dispatch";

const NTFY_TOPIC_URL = "https://ntfy.meiflume.com/TandT_Orders";

export type OrderNotificationEnv = {
  NTFY_ACCESS_TOKEN?: string;
};

export async function sendOrderNotification(
  env: OrderNotificationEnv,
  order: OrderConfirmation
) {
  const itemLines = (order.items || [])
    .map((i) => `  - ${i.name}${i.size ? ` (${i.size})` : ""} x${i.qty}`)
    .join("\n");

  const shipping = order.shipping || {};
  const customer = order.customer || {};

  const message = [
    `New T AND T order — ${order.reference}`,
    "",
    `Total: R ${order.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
    `Delivery: ${shipping.delivery || "Not specified"}`,
    "",
    "Customer:",
    `  Name: ${customer.fullName || "—"}`,
    `  Phone: ${customer.phone || "—"}`,
    `  Email: ${customer.email || "—"}`,
    "",
    "Ship to:",
    `  ${shipping.address || "—"}`,
    `  ${shipping.city || ""}${shipping.postcode ? ` ${shipping.postcode}` : ""}`,
    `  ${shipping.country || ""}`,
    "",
    "Items:",
    itemLines || "  —",
    "",
    "Open Sanity Studio to view and fulfil the order.",
    "Dispatch runs Tuesdays & Thursdays.",
    `Estimated dispatch: ${formatDispatchDate()}`,
  ].join("\n");

  const token = env.NTFY_ACCESS_TOKEN?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^Bearer\s+/i, "");
  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(NTFY_TOPIC_URL, {
    method: "POST",
    headers,
    body: message,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `ntfy rejected the order notification (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`
    );
  }
}
