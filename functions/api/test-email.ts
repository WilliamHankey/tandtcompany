import { sendOrderConfirmation } from "../_shared/orderConfirmation";

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

    const testOrder = {
      _id: "test-order-123",
      reference: "TEST-" + Date.now(),
      total: 129900,
      subtotal: 109900,
      tax: 20000,
      currency: "ZAR",
      createdAt: new Date().toISOString(),
      customer: { fullName: "Test Customer", email: to },
      shipping: { delivery: "standard", shippingCost: 0 },
      items: [
        {
          name: "Test Product",
          price: 109900,
          qty: 1,
          size: "M",
          lineTotal: 109900,
          imageUrl: "https://cdn.sanity.io/images/test/project/image-abc123.jpg",
          productId: "test-product-1",
        },
      ],
      paymentMethod: "Yoco",
    };

    console.log("[Test Email] Sending to:", to);
    console.log("[Test Email] Template ID:", templateId);
    console.log("[Test Email] RESEND_TEMPLATE_ID from env:", env.RESEND_TEMPLATE_ID);

    // Temporarily override env for this call
    const testEnv = { ...env, RESEND_TEMPLATE_ID: templateId };

    const emailId = await sendOrderConfirmation(testEnv, testOrder as any);

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