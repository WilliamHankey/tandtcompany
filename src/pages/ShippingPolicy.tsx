import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Truck, Clock, MapPin, Package, AlertCircle, Globe } from "lucide-react";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <article id={id} className="scroll-mt-32 space-y-4">
    <h2 className="font-serif text-2xl text-navy">{title}</h2>
    <div className="hairline mt-3 mb-5 bg-border" />
    <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">{children}</div>
  </article>
);

const ShippingPolicy = () => (
  <Layout>
    <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
      <div className="relative container-prose text-center">
        <p className="eyebrow !text-gold mb-4">Delivery Information</p>
        <h1 className="font-serif text-5xl md:text-6xl">Shipping Policy</h1>
        <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about how we get your order to you — safely, securely, and on time.
        </p>
        <p className="mt-4 text-cream/50 text-xs">Last updated: 19 July 2026</p>
      </div>
    </section>

    <section className="container-prose py-20 max-w-3xl">
      <div className="space-y-16">
        <Section id="processing" title="1. Order Processing Time">
          <div className="flex items-start gap-4 bg-cream border border-border p-5 shadow-soft">
            <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-navy text-lg">Standard processing: 2–4 business days</p>
              <p className="mt-2 text-sm text-muted-foreground">
                All orders are processed Monday to Friday, excluding South African public holidays. Orders placed after 14:00 SAST will begin processing the next business day.
              </p>
            </div>
          </div>
          <p>
            During peak periods (seasonal sales, holidays, new releases), processing may take up to 5 business days. We will notify you via email if there are any delays.
          </p>
        </Section>

        <Section id="delivery-estimates" title="2. Delivery Estimates">
          <p>Once dispatched, estimated delivery times within South Africa are:</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="text-left p-3 font-medium text-navy">Shipping Method</th>
                  <th className="text-left p-3 font-medium text-navy">Estimated Time</th>
                  <th className="text-left p-3 font-medium text-navy">Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3">Pick-up (Primary Location)</td>
                  <td className="p-3">Same day / next business day</td>
                  <td className="p-3">By arrangement</td>
                </tr>
                <tr>
                  <td className="p-3">Pudo (Locker-to-Locker)</td>
                  <td className="p-3">3–5 business days</td>
                  <td className="p-3">Nationwide</td>
                </tr>
                <tr>
                  <td className="p-3">Courier Guy (Door-to-Door)</td>
                  <td className="p-3">2–4 business days</td>
                  <td className="p-3">Major centres</td>
                </tr>
                <tr>
                  <td className="p-3">Courier Guy (Regional)</td>
                  <td className="p-3">4–7 business days</td>
                  <td className="p-3">Outlying areas</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-muted-foreground">
            All delivery estimates are working days and commence from the date of dispatch, not the date the order is placed.
          </p>
        </Section>

        <Section id="shipping-costs" title="3. Shipping Costs">
          <p>Shipping costs are calculated at checkout based on your selected delivery method and delivery address:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Pick-up:</strong> Free</li>
            <li><strong>Pudo (Locker-to-Locker):</strong> From R80</li>
            <li><strong>Courier Guy (Door-to-Door):</strong> From R100</li>
          </ul>
          <p>
            Free shipping may be offered on orders above a certain value at our discretion. Any such promotions will be clearly communicated on the Website.
          </p>
        </Section>

        <Section id="courier" title="4. Courier Services">
          <p>We primarily use the following courier services for delivery:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Courier Guy</strong> — Door-to-door delivery across South Africa</li>
            <li><strong>Pudo</strong> — Locker-to-locker collection from convenient pick-up points</li>
          </ul>
          <p>
            Delivery partners may vary depending on your location and the selected shipping method. We will always communicate your designated courier and tracking details via email.
          </p>
        </Section>

        <Section id="tracking" title="5. Order Tracking">
          <p>
            Once your order has been dispatched, you will receive an email containing:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>A tracking number for your shipment</li>
            <li>A direct link to track your parcel's progress</li>
            <li>Estimated delivery date</li>
          </ul>
          <p>
            You can also contact us at any time at <strong>stewardship@tandtcompany.com</strong> or via WhatsApp for a tracking update.
          </p>
        </Section>

        <Section id="delays" title="6. Delays">
          <p>
            While we endeavour to ensure timely delivery, occasional delays may occur due to factors beyond our control, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Adverse weather conditions</li>
            <li>High-volume periods (Black Friday, festive season)</li>
            <li>Courier service disruptions</li>
            <li>Remote or outlying delivery locations</li>
            <li>Public holidays</li>
          </ul>
          <div className="flex items-start gap-3 bg-cream border border-border p-4 mt-4">
            <AlertCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p className="text-sm">
              If your order is significantly delayed (more than 10 business days beyond the estimated delivery window), please contact us immediately and we will investigate and resolve the matter.
            </p>
          </div>
        </Section>

        <Section id="lost-parcels" title="7. Lost or Damaged Parcels">
          <p>
            In the unlikely event that your parcel is lost or arrives damaged:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Contact us within 48 hours of the expected delivery date</li>
            <li>Provide your order number and any photographic evidence of damage</li>
            <li>We will investigate with the courier and either reship your order or issue a full refund</li>
          </ul>
          <p>
            We take responsibility for items until they are delivered to you. Risk of loss transfers to you upon delivery.
          </p>
        </Section>

        <Section id="international" title="8. International Shipping">
          <div className="flex items-start gap-3 bg-cream border border-border p-4">
            <Globe className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p className="text-sm">
              <strong>Currently, we ship within South Africa only.</strong> International shipping is not available at this time. We are working to expand our delivery options in the future.
            </p>
          </div>
          <p>
            If you are located outside South Africa and wish to place an order, please contact us at <strong>stewardship@tandtcompany.com</strong> to discuss potential arrangements.
          </p>
        </Section>

        <Section id="contact" title="9. Shipping Enquiries">
          <p>For any shipping-related questions or concerns, please reach out:</p>
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
            <Link to="/privacy-policy" className="text-gold link-underline">Privacy Policy</Link> ·{" "}
            <Link to="/returns-policy" className="text-gold link-underline">Returns Policy</Link> ·{" "}
            <Link to="/refund-policy" className="text-gold link-underline">Refund Policy</Link>
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default ShippingPolicy;
