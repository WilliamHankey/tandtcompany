import PaystackPop from "@paystack/inline-js";

export type PaystackInitResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export async function initializePayment(payload: {
  reference: string;
}): Promise<PaystackInitResponse> {
  const res = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "Payment initialization failed"
    );
  }

  return data as PaystackInitResponse;
}

export async function verifyPayment(reference: string) {
  const res = await fetch("/api/paystack/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "Payment verification failed"
    );
  }

  return data;
}

export async function payWithPaystack(opts: {
  email: string;
  amountZar: number;
  reference: string;
  onSuccess: (reference: string) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error("VITE_PAYSTACK_PUBLIC_KEY is not configured");
  }

  const init = await initializePayment({
    reference: opts.reference,
  });

  const popup = new PaystackPop();

  popup.newTransaction({
    key: publicKey,
    email: opts.email,
    amount: Math.round(opts.amountZar * 100),
    reference: init.reference,
    accessCode: init.access_code,

    onSuccess: async (transaction) => {
      const paymentRef =
        typeof transaction === "object" && transaction && "reference" in transaction
          ? String((transaction as { reference: string }).reference)
          : init.reference;

      await verifyPayment(paymentRef);
      await opts.onSuccess(paymentRef);
    },

    onCancel: opts.onCancel,
  });
}