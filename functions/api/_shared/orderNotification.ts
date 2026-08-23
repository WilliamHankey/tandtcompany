import type { OrderConfirmation } from "./orderConfirmation";

const ORDER_TOPIC_URL = "https://ntfy.meiflume.com/TandT_Orders";

export async function sendOrderNotification(order: OrderConfirmation) {
  const itemCount = (order.items || []).reduce((sum, item) => sum + item.qty, 0);
  const message = [
    `Order: ${order.reference}`,
    `Total: R ${order.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
    `Items: ${itemCount}`,
    `Delivery: ${order.shipping?.delivery || "Not specified"}`,
    "Open Sanity Studio to view and fulfil the order.",
  ].join("\n");

  const response = await fetch(ORDER_TOPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Title": `New T AND T order — ${order.reference}`,
      "X-Priority": "high",
      "X-Tags": "shopping_cart,tada",
    },
    body: message,
  });

  if (!response.ok) {
    throw new Error(`ntfy rejected the order notification (${response.status})`);
  }
}
