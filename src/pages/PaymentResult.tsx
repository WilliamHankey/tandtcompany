import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { verifyCheckout } from "@/lib/yoco";
import { useCart } from "@/context/CartContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clear } = useCart();

  // Check multiple possible parameter names that Yoco might use
  const urlCheckoutId = searchParams.get("checkout_id") ||
                        searchParams.get("id") ||
                        searchParams.get("reference") ||
                        searchParams.get("session_id") ||
                        searchParams.get("checkoutId") ||
                        searchParams.get("checkout_reference");

  // Fall back to sessionStorage (set before redirect in payWithYoco)
  const sessionCheckoutId = sessionStorage.getItem("yoco_checkout_id");
  const sessionReference = sessionStorage.getItem("yoco_checkout_reference");

  // Also check localStorage as a last resort (persists across tabs)
  const localCheckoutId = localStorage.getItem("yoco_checkout_id");
  const localReference = localStorage.getItem("yoco_checkout_reference");

  // Use the first available checkout ID
  const checkoutId = urlCheckoutId || sessionCheckoutId || sessionReference || localCheckoutId || localReference;

  // Check for status from URL or sessionStorage
  const urlStatus = searchParams.get("status") || searchParams.get("result");
  const sessionStatus = sessionStorage.getItem("yoco_checkout_status");

  // Determine final status
  const status = urlStatus || sessionStatus || (checkoutId ? "pending" : "unknown");

  useEffect(() => {
    const handleResult = async () => {
      // Debug: log all search params and storage for troubleshooting
      console.log("=== Yoco Redirect Debug ===");
      console.log("URL search params:", Object.fromEntries(searchParams.entries()));
      console.log("sessionStorage yoco_checkout_id:", sessionStorage.getItem("yoco_checkout_id"));
      console.log("sessionStorage yoco_checkout_reference:", sessionStorage.getItem("yoco_checkout_reference"));
      console.log("localStorage yoco_checkout_id:", localStorage.getItem("yoco_checkout_id"));
      console.log("localStorage yoco_checkout_reference:", localStorage.getItem("yoco_checkout_reference"));
      console.log("Resolved checkoutId:", checkoutId);
      console.log("Resolved status:", status);
      console.log("=============================");

      if (!checkoutId) {
        // No checkout reference at all — go back to cart, not confirmation
        toast.error("Missing checkout reference. Please check your order status or contact support.");
        navigate("/checkout");
        return;
      }

      try {
              // Try to verify the checkout status with Yoco
              const result = await verifyCheckout(checkoutId);
              console.log("Yoco verification result:", result);
        
              // Yoco uses "completed" for successful payments (not "succeeded")
              const isSuccess = result.status === "succeeded" || result.status === "completed";
        
              if (isSuccess) {
                // Clear cart on successful payment
                clear();
          
                toast.success("Payment successful!");
                // Get the order reference from sessionStorage (stored as yoco_checkout_reference)
                const orderRef = sessionStorage.getItem("yoco_checkout_reference") || checkoutId;
                // Try to get email from sessionStorage or use a default
                const email = sessionStorage.getItem("yoco_customer_email") || "";
                navigate("/confirmation", {
                  state: { ref: orderRef, email: email, verified: true },
                });
              } else {
                console.error("Yoco verification failed - status not succeeded/completed:", result);
                throw new Error(`Payment status: ${result.status}`);
              }
            } catch (err) {
              console.error("Yoco verification error:", err);
              if (status === "cancelled" || urlStatus === "cancelled") {
                toast.info("Payment was cancelled");
              } else if (status === "failed" || urlStatus === "failed") {
                toast.error("Payment failed");
              } else {
                toast.error("Could not verify payment status. Please contact support with your order reference.");
              }
              // Payment not verified — go back to cart/checkout, not confirmation
              navigate("/checkout");
            }
    };

    handleResult();
      }, [checkoutId, status, navigate, searchParams, urlStatus, sessionCheckoutId, sessionReference, localCheckoutId, localReference, clear]);
    };

    export default PaymentResult;