import type { OrderConfirmation } from "./orderConfirmation";

const NTFY_TOPIC_URL = "https://ntfy.meiflume.com/TandT_Orders";

export type OrderNotificationEnv = {
  NTFY_ACCESS_TOKEN?: string;
};

export async function sendOrderNotification(
  env: OrderNotificationEnv,
  order: OrderConfirmation
) {
  const itemCount = (order.items || []).reduce((sum, item) => sum + item.qty, 0);
  const message = [
    `New T AND T order - ${order.reference}`,
    `Order: ${order.reference}`,
    `Total: R ${order.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
    `Items: ${itemCount}`,
    `Delivery: ${order.shipping?.delivery || "Not specified"}`,
    "Open Sanity Studio to view and fulfil the order.",
  ].join("\n");

  const token = env.NTFY_ACCESS_TOKEN?.trim().replace(/^Bearer\s+/i, "");
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
