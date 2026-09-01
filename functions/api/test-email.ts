import { Resend } from "resend";
import { formatDispatchDate } from "../_shared/dispatch";

type Env = {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_TEMPLATE_ID?: string;
};

type FunctionContext = { request: Request; env: Env };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const cleanSecret = (value: string) =>
  value.trim().replace(/^["']|["']$/g, "");

const zar = (amount: number) =>
  `R ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

// Inlined sendOrderConfirmation logic to avoid module resolution issues
async function sendTestEmail(env: Env, to: string, templateId: string) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  if (!env.RESEND_FROM_EMAIL) throw new Error("RESEND_FROM_EMAIL is not configured");

  const apiKey = cleanSecret(env.RESEND_API_KEY).replace(/^Bearer\s+/i, "");
  const fromEmail = cleanSecret(env.RESEND_FROM_EMAIL);

  const resend = new Resend(apiKey);

  const variables = {
    customer_name: "Test Customer",
    order_ref: "TEST-" + Date.now(),
    order_total: zar(129900),
    subtotal: zar(109900),
    delivery_method: "standard",
    shipping_cost: "Free",
    tax: zar(20000),
    dispatch_date: formatDispatchDate(),
    order_date: new Date().toISOString(),
    payment_method: "Yoco",
    order_items: [
      {
        name: "Test Product",
        qty: 1,
        size: "M",
        lineTotal: zar(109900),
        imageUrl: "https://cdn.sanity.io/images/test/project/image-abc123.jpg",
      },
    ],
  };

  console.log("[Test Email] Sending to:", to);
  console.log("[Test Email] Template ID:", templateId);
  console.log("[Test Email] RESEND_TEMPLATE_ID from env:", env.RESEND_TEMPLATE_ID);
  console.log("[Resend] Variables:", JSON.stringify(variables, null, 2));

  const result = await resend.emails.send({
    from: fromEmail,
    to: [to],
    reply_to: "tandtcompany525@gmail.com",
    subject: `Order Confirmed — TEST-${Date.now()}`,
    template: templateId,
    variables,
  });

  if (result.error) {
    console.error("[Resend] Error:", result.error);
    throw new Error(`Resend rejected the email: ${result.error.message}`);
  }

  console.log("[Resend] Email sent successfully, ID:", result.data?.id);
  return result.data?.id;
}

// GET /api/test-email?to=your@email.com&templateId=76d7a2d5-c036-4606-9e64-4384dd9671f5
export async function onRequestGet({ request, env }: FunctionContext) {
  try {
    const url = new URL(request.url);
    const to = url.searchParams.get("to");
    const templateId = url.searchParams.get("templateId") || env.RESEND_TEMPLATE_ID;

    if (!to) {
      return json({ error: "Query param 'to' (email) is required" }, 400);
    }

    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
      return json({ error: "Resend env vars not configured" }, 500);
    }

    const emailId = await sendTestEmail(env, to, templateId);

    return json({
      success: true,
      message: "Test email sent",
      emailId,
      templateUsed: templateId,
    });
  } catch (error) {
    console.error("[Test Email] Error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}