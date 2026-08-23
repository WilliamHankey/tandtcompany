export type YocoInitResponse = {
  id: string;
  redirectUrl: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  reference: string;
};

export async function initializeCheckout(payload: {
  reference: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
}): Promise<YocoInitResponse> {
  const res = await fetch("/api/yoco/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "Checkout initialization failed"
    );
  }

  return data as YocoInitResponse;
}

export async function verifyCheckout(checkoutId: string): Promise<{
  status: string;
  amount: number;
  currency: string;
  reference: string;
  emailSent: boolean;
  emailError?: string;
}> {
  const res = await fetch("/api/yoco/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checkoutId }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "Checkout verification failed"
    );
  }

  return data as {
    status: string;
    amount: number;
    currency: string;
    reference: string;
    emailSent: boolean;
    emailError?: string;
  };
}

export async function payWithYoco(opts: {
  email: string;
  amountZar: number;
  reference: string;
  onSuccess: (reference: string) => void | Promise<void>;
  onCancel?: () => void;
  onFailure?: () => void;
}) {
  const currentOrigin = window.location.origin;
  const successUrl = `${currentOrigin}/checkout/success`;
  const cancelUrl = `${currentOrigin}/checkout/cancel`;
  const failureUrl = `${currentOrigin}/checkout/failure`;

  try {
    const init = await initializeCheckout({
      reference: opts.reference,
      successUrl,
      cancelUrl,
      failureUrl,
    });

    // Store the checkout ID for potential verification
    sessionStorage.setItem("yoco_checkout_id", init.id);
    sessionStorage.setItem("yoco_checkout_reference", init.reference);
    sessionStorage.setItem("yoco_customer_email", opts.email);

    // Redirect to Yoco's hosted payment page
    window.location.href = init.redirectUrl;
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to initialize Yoco checkout"
    );
  }
}
