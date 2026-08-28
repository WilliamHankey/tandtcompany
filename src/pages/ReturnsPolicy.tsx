import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { RotateCcw, Package, AlertCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <article id={id} className="scroll-mt-32 space-y-4">
    <h2 className="font-serif text-2xl text-navy">{title}</h2>
    <div className="hairline mt-3 mb-5 bg-border" />
    <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">{children}</div>
  </article>
);

const ReturnsPolicy = () => (
  <Layout>
    <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
      <div className="relative container-prose text-center">
        <p className="eyebrow !text-gold mb-4">Hassle-Free Returns</p>
        <h1 className="font-serif text-5xl md:text-6xl">Returns Policy</h1>
        <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
          We want you to love every piece. If something isn't right, we'll make it right.
        </p>
        <p className="mt-4 text-cream/50 text-xs">Last updated: 19 July 2026</p>
      </div>
    </section>

    <section className="container-prose py-20 max-w-3xl">
      <div className="space-y-16">
        <Section id="return-period" title="1. Return Period">
          <div className="flex items-start gap-4 bg-cream border border-border p-5 shadow-soft">
            <RotateCcw className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-navy text-lg">7-day return window</p>
              <p className="mt-2 text-sm text-muted-foreground">
                You have 7 calendar days from the date of delivery to request a return. Returns requested after 7 days will not be accepted.
              </p>
            </div>
          </div>
        </Section>

        <Section id="eligible" title="2. Eligible Items">
          <p>The following items are eligible for return:</p>
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 p-4 mt-3">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Eligible for return:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-green-800">
                <li>Apparel (tees, hoodies, caps) in unworn condition</li>
                <li>Accessories (keychains, mugs) in unused condition</li>
                <li>Journals and lifestyle items in original packaging</li>
                <li>Items with original tags still attached</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="non-returnable" title="3. Non-Returnable Items">
          <p>The following items cannot be returned:</p>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 mt-3">
            <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Not eligible for return:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-red-800">
                <li>Items that have been worn, washed, or altered</li>
                <li>Items without original tags or packaging</li>
                <li>Items with perfume, deodorant, or makeup stains</li>
                <li>Items purchased during final sale or clearance promotions (marked as "Final Sale")</li>
                <li>Gift cards</li>
                <li>Personalised or custom-made items</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="return-process" title="4. Return Process">
          <p>To initiate a return, follow these steps:</p>
          <ol className="list-decimal pl-6 space-y-4 mt-3">
            <li>
              <strong>Contact us:</strong> Email <strong>stewardship@tandtcompany.com</strong> or message us on WhatsApp with your order number and reason for return.
            </li>
            <li>
              <strong>Receive confirmation:</strong> We will respond within 24 business hours with return instructions and the appropriate return address.
            </li>
            <li>
              <strong>Pack the item:</strong> Ensure the item is in its original condition, with tags attached, and securely packaged to prevent damage in transit.
            </li>
            <li>
              <strong>Ship the item:</strong> Send the item using a tracked shipping service. Please note that return shipping costs are the responsibility of the customer unless the item was defective or incorrectly sent.
            </li>
            <li>
              <strong>Receive your refund/exchange:</strong> Once we receive and inspect the returned item, we will process your refund or exchange within 5–7 business days.
            </li>
          </ol>
        </Section>

        <Section id="exchanges" title="5. Exchanges">
          <p>
            We offer exchanges for items of equal value, subject to availability. If you wish to exchange for a different size or colour:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Contact us within the 7-day return window</li>
            <li>Specify the item you'd like to exchange and your preferred alternative</li>
            <li>We will reserve the replacement item and provide return instructions</li>
            <li>If the replacement item is of higher value, we will provide a payment link for the difference</li>
          </ul>
        </Section>

        <Section id="damaged" title="6. Damaged or Defective Goods">
          <div className="flex items-start gap-3 bg-cream border border-border p-4">
            <AlertCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p className="text-sm">
              If you receive a damaged or defective item, please contact us within <strong>48 hours</strong> of delivery with photographic evidence. We will arrange a prepaid return label and either reship the item or issue a full refund including shipping costs.
            </p>
          </div>
        </Section>

        <Section id="incorrect" title="7. Incorrect Products">
          <p>
            If you receive an incorrect item (wrong size, colour, or product), please contact us immediately. We will:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Arrange a prepaid return for the incorrect item</li>
            <li>Ship the correct item to you at no additional cost</li>
            <li>Or issue a full refund if you prefer not to wait for a replacement</li>
          </ul>
        </Section>

        <Section id="condition" title="8. Item Condition Requirements">
          <p>All returned items must meet the following conditions:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Unworn, unwashed, and unused</li>
            <li>Free from stains, odours, or signs of wear</li>
            <li>Original tags and labels still attached</li>
            <li>In original packaging where applicable</li>
            <li>No alterations or modifications have been made</li>
          </ul>
          <p>
            Items that do not meet these conditions may be rejected, and the customer will be responsible for the return shipping cost of the rejected item.
          </p>
        </Section>

        <Section id="contact" title="9. Contact Us">
          <p>For any returns-related questions, please reach out:</p>
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
            <Link to="/refund-policy" className="text-gold link-underline">Refund Policy</Link> ·{" "}
            <Link to="/privacy-policy" className="text-gold link-underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default ReturnsPolicy;
