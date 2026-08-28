import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { CreditCard, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <article id={id} className="scroll-mt-32 space-y-4">
    <h2 className="font-serif text-2xl text-navy">{title}</h2>
    <div className="hairline mt-3 mb-5 bg-border" />
    <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">{children}</div>
  </article>
);

const RefundPolicy = () => (
  <Layout>
    <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
      <div className="relative container-prose text-center">
        <p className="eyebrow !text-gold mb-4">Your Money, Protected</p>
        <h1 className="font-serif text-5xl md:text-6xl">Refund Policy</h1>
        <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
          We stand behind the quality of our products. If you're not satisfied, here's how our refund process works.
        </p>
        <p className="mt-4 text-cream/50 text-xs">Last updated: 19 July 2026</p>
      </div>
    </section>

    <section className="container-prose py-20 max-w-3xl">
      <div className="space-y-16">
        <Section id="refund-timeframe" title="1. Refund Timeframe">
          <div className="flex items-start gap-4 bg-cream border border-border p-5 shadow-soft">
            <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-navy text-lg">5–7 business days processing</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Once we receive and approve your returned item, your refund will be processed within 5–7 business days.
              </p>
            </div>
          </div>
          <p className="mt-4">
            Please allow an additional 3–5 business days for the refund to reflect in your account, depending on your bank or payment provider.
          </p>
        </Section>

        <Section id="refund-method" title="2. Refund Method">
          <p>Refunds are issued using the same payment method used for the original purchase:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Card payments:</strong> Refunded to the original card used for purchase</li>
            <li><strong>EFT / Bank transfer:</strong> Refunded to the bank account used for the original payment</li>
            <li><strong>Mobile money:</strong> Refunded to the mobile money account used for the original payment</li>
          </ul>
          <p>
            If the original payment method is no longer available (e.g., expired card), we will work with you to arrange an alternative refund method.
          </p>
        </Section>

        <Section id="inspection" title="3. Inspection Process">
          <p>Upon receiving your returned item, we will:</p>
          <ol className="list-decimal pl-6 space-y-3 mt-3">
            <li>Verify the item matches the return request</li>
            <li>Inspect the item's condition (unworn, tags attached, original packaging)</li>
            <li>Confirm eligibility for a full refund</li>
            <li>Process the refund within 5–7 business days</li>
          </ol>
          <p>
            We will notify you via email once the inspection is complete and the refund has been initiated. If the item does not meet our return conditions, we will contact you to discuss options.
          </p>
        </Section>

        <Section id="partial" title="4. Partial Refunds">
          <p>Partial refunds may be issued in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Items returned with visible signs of wear, use, or damage not caused by us</li>
            <li>Items returned without original tags or packaging</li>
            <li>Items returned after the 7-day return window (subject to approval)</li>
          </ul>
          <p>
            The partial refund amount will be determined based on the item's condition and will be communicated to you before processing.
          </p>
        </Section>

        <Section id="shipping-refunds" title="5. Shipping Refunds">
          <p>
            Original shipping costs are non-refundable unless the return is due to our error (wrong item sent, defective product, or damaged in transit).
          </p>
          <p>
            In cases where we are responsible for the return, we will refund:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>The full purchase price of the item</li>
            <li>Original shipping costs</li>
            <li>Return shipping costs (we will provide a prepaid return label)</li>
          </ul>
        </Section>

        <Section id="chargebacks" title="6. Chargebacks and Disputes">
          <div className="flex items-start gap-3 bg-cream border border-border p-4">
            <AlertCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p className="text-sm">
              We encourage you to contact us directly before initiating a chargeback or payment dispute with your bank. We are committed to resolving any issues promptly and fairly. Initiating a chargeback without first contacting us may delay the resolution of your concern.
            </p>
          </div>
          <p className="mt-4">
            If a chargeback is filed, we will provide all relevant documentation to the payment provider to demonstrate that the order was fulfilled in accordance with our policies.
          </p>
        </Section>

        <Section id="exceptions" title="7. Exceptions">
          <p>Refunds will not be issued for:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Items marked as "Final Sale" at the time of purchase</li>
            <li>Gift cards</li>
            <li>Personalised or custom-made items (unless defective)</li>
            <li>Items that have been worn, washed, altered, or damaged by the customer</li>
            <li>Return requests made after 7 days from delivery</li>
          </ul>
        </Section>

        <Section id="order-cancellation" title="8. Order Cancellation">
          <p>
            If you wish to cancel your order before it has been dispatched, please contact us immediately. Orders that have not yet been processed can be cancelled for a full refund.
          </p>
          <p>
            Once an order has been dispatched, it cannot be cancelled. You will need to follow the standard return process upon receipt of the order.
          </p>
        </Section>

        <Section id="contact" title="9. Contact Us">
          <p>For any refund-related questions, please reach out:</p>
          <div className="mt-4 bg-cream border border-border p-5 shadow-soft space-y-3">
            <p className="flex items-center gap-2">
              <span className="text-gold">Email:</span> stewardship@tandtcompany.com
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gold">WhatsApp:</span> +27 (0) 61 485 2498
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gold">Response time:</span> Within 24 business hours
            </p>
          </div>
        </Section>

        <div className="border-t border-border pt-10 mt-10">
          <p className="text-sm text-muted-foreground">
            Related policies:{" "}
            <Link to="/terms" className="text-gold link-underline">Terms & Conditions</Link> ·{" "}
            <Link to="/shipping-policy" className="text-gold link-underline">Shipping Policy</Link> ·{" "}
            <Link to="/returns-policy" className="text-gold link-underline">Returns Policy</Link> ·{" "}
            <Link to="/privacy-policy" className="text-gold link-underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default RefundPolicy;
