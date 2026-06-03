type Req = { method?: string; body?: unknown };
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
};

/**
 * Vercel serverless handler — initializes a Paystack transaction.
 * Set PAYSTACK_SECRET_KEY in Vercel project env (never expose to the client).
 */
export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: "PAYSTACK_SECRET_KEY is not configured" });
  }

  const { email, amount, reference, metadata } = req.body as {
    email?: string;
    amount?: number;
    reference?: string;
    metadata?: Record<string, unknown>;
  };

  if (!email || !amount || !reference) {
    return res.status(400).json({ error: "email, amount, and reference are required" });
  }

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        reference,
        currency: "ZAR",
        metadata,
      }),
    });

    const data = await response.json();
    if (!data.status) {
      return res.status(400).json({ error: data.message || "Paystack error" });
    }

    return res.status(200).json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to initialize payment" });
  }
}
