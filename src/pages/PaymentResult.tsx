import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { verifyCheckout } from "@/lib/yoco";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check multiple possible parameter names that Yoco might use
  const checkoutId = searchParams.get("checkout_id") ||
                     searchParams.get("id") ||
                     searchParams.get("reference") ||
                     searchParams.get("session_id") ||
                     sessionStorage.getItem("yoco_checkout_id");

  // Also check for status from URL or sessionStorage
  const urlStatus = searchParams.get("status") || searchParams.get("result");
  const sessionStatus = sessionStorage.getItem("yoco_checkout_status");

  // Determine final status: URL status > session status > infer from checkoutId presence
  const status = urlStatus || sessionStatus || (checkoutId ? "pending" : "unknown");

  useEffect(() => {
    const handleResult = async () => {
      // Debug: log all search params for troubleshooting
      console.log("Yoco redirect params:", Object.fromEntries(searchParams.entries()));
      console.log("SessionStorage yoco_checkout_id:", sessionStorage.getItem("yoco_checkout_id"));
      console.log("SessionStorage yoco_checkout_reference:", sessionStorage.getItem("yoco_checkout_reference"));

      if (!checkoutId) {
        toast.error("Missing checkout reference. Please check your order status.");
        navigate("/confirmation");
        return;
      }

      try {
        // Try to verify the checkout status with Yoco
        await verifyCheckout(checkoutId);
        toast.success("Payment successful!");
        navigate("/confirmation", { state: { verified: true } });
      } catch {
        if (status === "cancelled" || urlStatus === "cancelled") {
          toast.info("Payment was cancelled");
        } else if (status === "failed" || urlStatus === "failed") {
          toast.error("Payment failed");
        } else {
          toast.error("Could not verify payment status. Please contact support.");
        }
        navigate("/confirmation");
      }
    };

    handleResult();
  }, [checkoutId, status, navigate, searchParams]);

  const getIcon = () => {
    if (status === "success" || urlStatus === "success") return <CheckCircle2 className="h-8 w-8 text-green-600" />;
    if (status === "cancelled" || urlStatus === "cancelled") return <XCircle className="h-8 w-8 text-yellow-600" />;
    if (status === "failed" || urlStatus === "failed") return <AlertCircle className="h-8 w-8 text-red-600" />;
    return <Loader2 className="h-8 w-8 text-navy animate-spin" />;
  };

  const getTitle = () => {
    if (status === "success" || urlStatus === "success") return "Payment Successful";
    if (status === "cancelled" || urlStatus === "cancelled") return "Payment Cancelled";
    if (status === "failed" || urlStatus === "failed") return "Payment Failed";
    return "Verifying Payment...";
  };

  const getMessage = () => {
    if (status === "success" || urlStatus === "success") return "Your payment was processed successfully. Redirecting to confirmation...";
    if (status === "cancelled" || urlStatus === "cancelled") return "You cancelled the payment. Redirecting...";
    if (status === "failed" || urlStatus === "failed") return "The payment could not be completed. Redirecting...";
    return "Please wait while we verify your payment...";
  };

  return (
    <Layout>
      <SEO title={getTitle()} noindex />
      <section className="container-prose pt-32 pb-24">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream">
            {getIcon()}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-navy">{getTitle()}</h1>
          <p className="mt-4 text-muted-foreground">{getMessage()}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild variant="navy">
              <Link to="/confirmation">Go to Confirmation</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentResult;