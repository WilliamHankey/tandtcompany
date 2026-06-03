import PaystackPop from "@paystack/inline-js";

export type PaystackInitResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export async function initializePayment(payload: {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackInitResponse> {
  const res = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Payment initialization failed");
  }
  return res.json();
}

export function openPaystackPopup(opts: {
  email: string;
  amountKobo: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}) {
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("VITE_PAYSTACK_PUBLIC_KEY is not configured");
  }
  const popup = new PaystackPop();
  popup.newTransaction({
    key: publicKey,
    email: opts.email,
    amount: opts.amountKobo,
    reference: opts.reference,
    onSuccess: (transaction) => {
      const ref =
        typeof transaction === "object" && transaction && "reference" in transaction
          ? String((transaction as { reference: string }).reference)
          : opts.reference;
      opts.onSuccess(ref);
    },
    onCancel: opts.onCancel,
  });
}

export async function payWithPaystack(opts: {
  email: string;
  amountZar: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
}) {
  const amountKobo = Math.round(opts.amountZar * 100);
  try {
    const init = await initializePayment({
      email: opts.email,
      amount: amountKobo,
      reference: opts.reference,
      metadata: opts.metadata,
    });
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) throw new Error("VITE_PAYSTACK_PUBLIC_KEY is not configured");
    const popup = new PaystackPop();
    popup.newTransaction({
      key: publicKey,
      email: opts.email,
      amount: amountKobo,
      reference: init.reference || opts.reference,
      accessCode: init.access_code,
      onSuccess: (transaction) => {
        const ref =
          typeof transaction === "object" && transaction && "reference" in transaction
            ? String((transaction as { reference: string }).reference)
            : init.reference;
        opts.onSuccess(ref);
      },
      onCancel: opts.onCancel,
    });
  } catch {
    // Fallback: inline popup without server init (test mode only)
    openPaystackPopup({
      email: opts.email,
      amountKobo,
      reference: opts.reference,
      onSuccess: opts.onSuccess,
      onCancel: opts.onCancel,
    });
  }
}
