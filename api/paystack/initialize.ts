import { createClient } from "@sanity/client";

type Req = { method?: string; body?: unknown };
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

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: "PAYSTACK_SECRET_KEY is not configured" });
  }

  const { reference } = req.body as { reference?: string };

  if (!reference) {
    return res.status(400).json({ error: "reference is required" });
  }

  const order = await sanity.fetch(
    `*[_type == "order" && reference == $reference][0]{
      _id,
      reference,
      total,
      currency,
      customer
    }`,
    { reference }
  );

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: order.customer.email,
      amount: Math.round(order.total * 100),
      reference: order.reference,
      currency: order.currency || "ZAR",
      metadata: {
        orderId: order._id,
        reference: order.reference,
      },
    }),
  });

  const data = await response.json();

  if (!data.status) {
    return res.status(400).json({ error: data.message || "Paystack error" });
  }

  await sanity
    .patch(order._id)
    .set({
      "paystack.accessCode": data.data.access_code,
      "paystack.authorizationUrl": data.data.authorization_url,
    })
    .commit();

  return res.status(200).json({
    authorization_url: data.data.authorization_url,
    access_code: data.data.access_code,
    reference: data.data.reference,
  });
}