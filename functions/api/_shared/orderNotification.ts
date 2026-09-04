import type { OrderConfirmation } from "./orderConfirmation";
import { formatDispatchDate } from "./dispatch";

const NTFY_TOPIC_URL = "https://ntfy.meiflume.com/TandT_Orders";
const NTFY_ICON_URL = "https://meiflume.com/TandTCompany/TandTBrandmarkSymbol.svg";

export type OrderNotificationEnv = {
  NTFY_ACCESS_TOKEN?: string;
  SANITY_STUDIO_HANDLE?: string;
  SANITY_STUDIO_PROJECT_ID?: string;
  SANITY_STUDIO_DATASET?: string;
};

const cleanEnv = (value?: string) =>
  value?.trim().replace(/^["']|["']$/g, "").replace(/^https?:\/\//i, "") || "";

const waLink = (phone?: string) => {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "—";
  const normalized = digits.replace(/^0/, "27");
  return `https://wa.me/${normalized}`;
};

const studioOrderUrl = (env: OrderNotificationEnv, order: OrderConfirmation) => {
  const handle = cleanEnv(env.SANITY_STUDIO_HANDLE);
  const projectId = cleanEnv(env.SANITY_STUDIO_PROJECT_ID);
  const dataset = cleanEnv(env.SANITY_STUDIO_DATASET);
  if (!handle || !projectId || !dataset) return undefined;
  return `https://www.sanity.io/${handle}/studio/${projectId}/${dataset}/structure/order;${order._id}`;
};

export async function sendOrderNotification(
  env: OrderNotificationEnv,
  order: OrderConfirmation
) {
  const itemLines = (order.items || [])
    .map((i) => `  - ${i.name}${i.size ? ` (${i.size})` : ""} x${i.qty}`)
    .join("\n");

  const shipping = order.shipping;
  const customer = order.customer;
  const orderUrl = studioOrderUrl(env, order);

  const message = [
    `New T AND T order — ${order.reference}`,
    "",
    `Total: R ${order.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
    `Delivery: ${shipping.delivery || "Not specified"}`,
    "",
    "Customer:",
    `  Name: ${customer.fullName || "—"}`,
    `  Phone: ${customer.phone || "—"} ${customer.phone ? `(${waLink(customer.phone)})` : ""}`,
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
    orderUrl ? `Open this order in Sanity Studio: ${orderUrl}` : "Open Sanity Studio to view and fulfil the order.",
    "Dispatch runs Tuesdays & Thursdays.",
    `Estimated dispatch: ${formatDispatchDate()}`,
  ].join("\n");

  const token = env.NTFY_ACCESS_TOKEN?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/^Bearer\s+/i, "");
  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Icon": NTFY_ICON_URL,
  };

  if (orderUrl) {
    headers["X-Click"] = orderUrl;
  }

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
