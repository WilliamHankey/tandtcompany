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
    return res.status(400).json({ error: "Payment reference is required" });
  }

  try {
    const order = await sanity.fetch(
      `*[_type == "order" && reference == $reference][0]{
        _id,
        reference,
        status,
        total,
        currency,
        customer
      }`,
      { reference }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return res.status(400).json({ error: data.message || "Could not verify payment" });
    }

    const tx = data.data;
    const expectedAmount = Math.round(order.total * 100);

    if (tx.status !== "success") {
      return res.status(400).json({ error: "Payment was not successful" });
    }

    if (tx.amount !== expectedAmount) {
      return res.status(400).json({ error: "Payment amount mismatch" });
    }

    if (tx.currency !== order.currency) {
      return res.status(400).json({ error: "Payment currency mismatch" });
    }

    await sanity
      .patch(order._id)
      .set({
        status: "paid",
        "paystack.paidAt": tx.paid_at,
        "paystack.rawVerifyResponse": JSON.stringify(data),
      })
      .commit();

    return res.status(200).json({
      status: "success",
      reference: tx.reference,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
}