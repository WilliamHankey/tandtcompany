import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { verifyCheckout } from "@/lib/yoco";

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clear } = useCart();
  const handledRef = useRef(false);

  const urlCheckoutId =
    searchParams.get("checkout_id") ||
    searchParams.get("id") ||
    searchParams.get("reference") ||
    searchParams.get("session_id") ||
    searchParams.get("checkoutId") ||
    searchParams.get("checkout_reference");

  const sessionCheckoutId = sessionStorage.getItem("yoco_checkout_id");
  const sessionReference = sessionStorage.getItem("yoco_checkout_reference");
  const localCheckoutId = localStorage.getItem("yoco_checkout_id");
  const localReference = localStorage.getItem("yoco_checkout_reference");
  const checkoutId =
    urlCheckoutId ||
    sessionCheckoutId ||
    sessionReference ||
    localCheckoutId ||
    localReference;

  const urlStatus =
    searchParams.get("status") || searchParams.get("result");
  const sessionStatus = sessionStorage.getItem("yoco_checkout_status");
  const status =
    urlStatus || sessionStatus || (checkoutId ? "pending" : "unknown");

  useEffect(() => {
    // Clearing the cart rerenders this page before navigation completes. This
    // prevents a second verification request, toast and confirmation redirect.
    if (handledRef.current) return;
    handledRef.current = true;

    const handleResult = async () => {
      if (!checkoutId) {
        toast.error(
          "Missing checkout reference. Please check your order status or contact support.",
        );
        navigate("/checkout", { replace: true });
        return;
      }

      try {
        const result = await verifyCheckout(checkoutId);
        const isSuccess =
          result.status === "succeeded" || result.status === "completed";

        if (!isSuccess) {
          throw new Error(`Payment status: ${result.status}`);
        }

        const orderRef = sessionReference || checkoutId;
        const email = sessionStorage.getItem("yoco_customer_email") || "";

        clear();
        toast.success("Payment successful!", {
          id: `payment-success-${checkoutId}`,
        });

        sessionStorage.removeItem("yoco_checkout_id");
        sessionStorage.removeItem("yoco_checkout_reference");
        sessionStorage.removeItem("yoco_checkout_status");
        sessionStorage.removeItem("yoco_customer_email");

        navigate("/confirmation", {
          replace: true,
          state: { ref: orderRef, email, verified: true },
        });
      } catch (error) {
        console.error("Yoco verification error:", error);

        if (status === "cancelled") {
          toast.info("Payment was cancelled");
        } else if (status === "failed") {
          toast.error("Payment failed");
        } else {
          toast.error(
            "Could not verify payment status. Please contact support with your order reference.",
          );
        }

        navigate("/checkout", { replace: true });
      }
    };

    void handleResult();
  }, [checkoutId, clear, navigate, sessionReference, status]);

  return (
    <Layout>
      <SEO title="Verifying payment" noindex />
      <section className="container-prose flex min-h-[60vh] flex-col items-center justify-center pt-32 pb-24 text-center">
        <Loader2 className="mb-5 h-8 w-8 animate-spin text-gold" />
        <h1 className="font-serif text-3xl text-navy">
          Verifying your payment
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please wait while we confirm your order.
        </p>
      </section>
    </Layout>
  );
};

export default PaymentResult;
