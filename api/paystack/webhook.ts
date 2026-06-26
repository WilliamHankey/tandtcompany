import crypto from "crypto";
import { createClient } from "@sanity/client";

type Req = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
};

const sanity = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID!,
  dataset: process.env.VITE_SANITY_DATASET!,
  apiVersion: process.env.VITE_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function getHeader(
  headers: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = headers[key] || headers[key.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    return res.status(500).json({ error: "PAYSTACK_SECRET_KEY is not configured" });
  }

  const signature = getHeader(req.headers, "x-paystack-signature");

  if (!signature) {
    return res.status(401).json({ error: "Missing Paystack signature" });
  }

  const rawBody =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});

  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    return res.status(401).json({ error: "Invalid Paystack signature" });
  }

  const event =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  const paystackEvent = event as {
    event?: string;
    data?: {
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
      paid_at?: string;
    };
  };

  if (paystackEvent.event !== "charge.success") {
    return res.status(200).json({ received: true });
  }

  const tx = paystackEvent.data;

  if (!tx?.reference) {
    return res.status(400).json({ error: "Missing payment reference" });
  }

  try {
    const order = await sanity.fetch(
      `*[_type == "order" && reference == $reference][0]{
        _id,
        reference,
        status,
        total,
        currency
      }`,
      { reference: tx.reference }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const expectedAmount = Math.round(order.total * 100);

    if (
      tx.status === "success" &&
      tx.amount === expectedAmount &&
      tx.currency === order.currency
    ) {
      await sanity
        .patch(order._id)
        .set({
          status: "paid",
          "paystack.paidAt": tx.paid_at,
          "paystack.rawVerifyResponse": JSON.stringify(event),
        })
        .commit();
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}