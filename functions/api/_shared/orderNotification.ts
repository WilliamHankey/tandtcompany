import type { OrderConfirmation } from "./orderConfirmation";

const NTFY_BASE_URL = "https://ntfy.meiflume.com";
const NTFY_TOPIC = "TandT_Orders";

export type OrderNotificationEnv = {
  NTFY_ACCESS_TOKEN?: string;
};

export async function sendOrderNotification(
  env: OrderNotificationEnv,
  order: OrderConfirmation
) {
  const itemCount = (order.items || []).reduce((sum, item) => sum + item.qty, 0);
  const message = [
    `Order: ${order.reference}`,
    `Total: R ${order.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
    `Items: ${itemCount}`,
    `Delivery: ${order.shipping?.delivery || "Not specified"}`,
    "Open Sanity Studio to view and fulfil the order.",
  ].join("\n");

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (env.NTFY_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${env.NTFY_ACCESS_TOKEN}`;
  }

  const response = await fetch(NTFY_BASE_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      topic: NTFY_TOPIC,
      title: `New T AND T order - ${order.reference}`,
      message,
      priority: 4,
      tags: ["shopping_cart", "tada"],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `ntfy rejected the order notification (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`
    );
  }
}
