import { sendOrderConfirmation } from "../_shared/orderConfirmation";

type Env = {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_TEMPLATE_ID?: string;
};

type OrderItem = {
  name: string;
  price: number;
  qty: number;
  size?: string;
  lineTotal?: number;
  imageUrl?: string | null;
};

type OrderEmailRequestBody = {
  customerEmail: string;
  customerName: string;
  reference: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  deliveryMethod: string;
  paymentMethod?: string;
  createdAt?: string;
};

type FunctionContext = {
  request: Request;
  env: Env;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const body = (await request.json()) as OrderEmailRequestBody;

    if (!body.customerEmail || !body.reference || !body.items?.length) {
      return json({ error: "Missing required order email fields" }, 400);
    }

    const id = await sendOrderConfirmation(env, {
      _id: body.reference,
      reference: body.reference,
      customer: {
        fullName: body.customerName,
        email: body.customerEmail,
      },
      shipping: {
        delivery: body.deliveryMethod,
        shippingCost: body.shippingCost,
      },
      items: body.items.map((item) => ({
        ...item,
        lineTotal: item.lineTotal ?? item.price * item.qty,
      })),
      subtotal: body.subtotal,
      tax: body.tax,
      total: body.total,
      currency: "ZAR",
      createdAt: body.createdAt || new Date().toISOString(),
      paymentMethod: body.paymentMethod,
    });

    return json({ success: true, id });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send order confirmation email",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
