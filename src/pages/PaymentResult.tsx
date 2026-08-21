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
  const checkoutId = searchParams.get("checkout_id");
  const status = searchParams.get("status");

  useEffect(() => {
    const handleResult = async () => {
      if (!checkoutId) {
        toast.error("Missing checkout reference");
        navigate("/confirmation");
        return;
      }

      try {
        // Try to verify the checkout status
        await verifyCheckout(checkoutId);
        toast.success("Payment successful!");
        navigate("/confirmation", { state: { verified: true } });
      } catch {
        if (status === "cancelled") {
          toast.info("Payment was cancelled");
        } else if (status === "failed") {
          toast.error("Payment failed");
        } else {
          toast.error("Could not verify payment");
        }
        navigate("/confirmation");
      }
    };

    handleResult();
  }, [checkoutId, status, navigate]);

  const getIcon = () => {
    if (status === "success") return <CheckCircle2 className="h-8 w-8 text-green-600" />;
    if (status === "cancelled") return <XCircle className="h-8 w-8 text-yellow-600" />;
    if (status === "failed") return <AlertCircle className="h-8 w-8 text-red-600" />;
    return <Loader2 className="h-8 w-8 text-navy animate-spin" />;
  };

  const getTitle = () => {
    if (status === "success") return "Payment Successful";
    if (status === "cancelled") return "Payment Cancelled";
    if (status === "failed") return "Payment Failed";
    return "Verifying Payment...";
  };

  const getMessage = () => {
    if (status === "success") return "Your payment was processed successfully. Redirecting to confirmation...";
    if (status === "cancelled") return "You cancelled the payment. Redirecting...";
    if (status === "failed") return "The payment could not be completed. Redirecting...";
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