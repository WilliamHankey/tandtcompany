import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";

const sections = [
  { id: "company", title: "Company Details" },
  { id: "definitions", title: "Definitions" },
  { id: "orders", title: "Orders" },
  { id: "pricing", title: "Pricing" },
  { id: "payment", title: "Payment" },
  { id: "shipping", title: "Shipping & Delivery" },
  { id: "returns", title: "Returns & Exchanges" },
  { id: "refunds", title: "Refunds" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "privacy", title: "Privacy" },
  { id: "intellectual", title: "Intellectual Property" },
  { id: "governing", title: "Governing Law" },
  { id: "contact", title: "Contact" },
];

const Terms = () => {
  const [active, setActive] = useState(sections[0]?.id || "company");

  useEffect(() => {
    const onScroll = () => {
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          setActive(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Layout>
      <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
        <div className="relative container-prose text-center">
          <p className="eyebrow !text-gold mb-4">Legal</p>
          <h1 className="font-serif text-5xl md:text-6xl">Terms & Conditions</h1>
          <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using our website or placing an order.
          </p>
          <p className="mt-4 text-cream/50 text-xs">Last updated: 19 July 2026</p>
        </div>
      </section>

      <section className="container-prose py-20 grid lg:grid-cols-[220px_1fr] gap-14">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-3 text-sm">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`block transition-colors ${
                  active === s.id ? "text-gold" : "text-muted-foreground hover:text-navy"
                }`}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-16 max-w-2xl">
          {/* 1. Company Details */}
          <article id="company" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Company Details</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p><strong>Company Name:</strong> T AND T COMPANY (Pty) Ltd</p>
              <p><strong>Trading Name:</strong> T & T Company</p>
              <p><strong>Website:</strong> tandtcompany.store</p>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> stewardship@tandtcompany.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +27 (0) 61 485 2498</div>
            </div>
          </article>

          {/* 2. Definitions */}
          <article id="definitions" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Definitions</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>In these Terms, the following definitions apply:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>"Company", "we", "us", "our"</strong> refers to T AND T COMPANY (Pty) Ltd.</li>
                <li><strong>"Website"</strong> refers to tandtcompany.store and all associated pages.</li>
                <li><strong>"Customer", "you", "your"</strong> refers to any individual or entity placing an order through the Website.</li>
                <li><strong>"Products"</strong> refers to any items available for purchase on the Website.</li>
                <li><strong>"Order"</strong> refers to a request to purchase Products submitted through the Website.</li>
              </ul>
            </div>
          </article>

          {/* 3. Orders */}
          <article id="orders" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Orders</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>By placing an Order, you confirm that:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>You are at least 18 years of age.</li>
                <li>All information provided during the Order process is accurate and complete.</li>
                <li>You are authorised to use the payment method specified.</li>
              </ul>
              <p className="mt-4">An Order constitutes an offer to purchase. We reserve the right to accept or decline any Order at our sole discretion. An Order is only confirmed once you receive an Order Confirmation email.</p>
              <p>If a Product is unavailable after an Order is placed, we will notify you and offer a full refund or an alternative.</p>
            </div>
          </article>

          {/* 4. Pricing & Taxes */}
          <article id="pricing" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Pricing</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>All prices displayed on the Website are in <strong>South African Rand (ZAR)</strong>. The full amount payable, including any delivery costs, is shown at checkout before you complete your order.</p>
              <p>We reserve the right to change prices at any time without prior notice. However, price changes will not affect Orders that have already been confirmed.</p>
              <p>In the event of a pricing error, we reserve the right to cancel the Order and issue a full refund.</p>
            </div>
          </article>

          {/* 5. Payment */}
          <article id="payment" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Payment</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>Payments are processed securely through <strong>Paystack</strong>, a PCI DSS Level 1 compliant payment service provider. We accept the following payment methods:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Credit and debit cards (Visa, Mastercard)</li>
              </ul>
              <p className="mt-4">We do not store your credit card details, CVV, or banking credentials. All payment information is handled exclusively by Paystack.</p>
              <p>Order confirmation will be sent via email once payment has been successfully processed.</p>
            </div>
          </article>

          {/* 6. Shipping & Delivery */}
          <article id="shipping" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Shipping & Delivery</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>Orders are processed within 2–4 business days. Delivery times vary by shipping method and location:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Pick-up:</strong> By arrangement, free of charge.</li>
                <li><strong>Pudo (Locker-to-Locker):</strong> 3–5 business days, nationwide.</li>
                <li><strong>Courier Guy (Door-to-Door):</strong> 2–4 business days for major centres, 4–7 for outlying areas.</li>
              </ul>
              <p className="mt-4">We currently ship within South Africa only. International shipping is not available at this time.</p>
              <p>For full details, please refer to our <Link to="/shipping-policy" className="text-gold link-underline">Shipping Policy</Link>.</p>
            </div>
          </article>

          {/* 7. Returns & Exchanges */}
          <article id="returns" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Returns & Exchanges</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>You may return unworn items within <strong>7 days</strong> of delivery, provided they are in their original condition with tags attached.</p>
              <p>Items that have been worn, washed, altered, or are missing tags are not eligible for return.</p>
              <p>For full details on the return process, eligible items, and non-returnable items, please refer to our <Link to="/returns-policy" className="text-gold link-underline">Returns Policy</Link>.</p>
            </div>
          </article>

          {/* 8. Refunds */}
          <article id="refunds" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Refunds</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>Approved refunds are processed within 5–7 business days using the original payment method. Please allow an additional 3–5 business days for the refund to reflect in your account.</p>
              <p>Original shipping costs are non-refundable unless the return is due to our error.</p>
              <p>For full details, please refer to our <Link to="/refund-policy" className="text-gold link-underline">Refund Policy</Link>.</p>
            </div>
          </article>

          {/* 9. Limitation of Liability */}
          <article id="liability" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Limitation of Liability</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>To the maximum extent permitted by law:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>The Website and Products are provided "as is" without warranties of any kind, express or implied.</li>
                <li>We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Website or Products.</li>
                <li>Our total liability for any claim shall not exceed the purchase price of the Product giving rise to the claim.</li>
              </ul>
              <p className="mt-4">Nothing in these Terms excludes or limits liability for fraud, gross negligence, or any liability that cannot be excluded under South African law.</p>
            </div>
          </article>

          {/* 10. Privacy */}
          <article id="privacy" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Privacy</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>Your privacy is important to us. We collect, use, and protect your personal information in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA).</p>
              <p>For full details on how we handle your data, please refer to our <Link to="/privacy-policy" className="text-gold link-underline">Privacy Policy</Link> and <Link to="/cookie-policy" className="text-gold link-underline">Cookie Policy</Link>.</p>
            </div>
          </article>

          {/* 11. Intellectual Property */}
          <article id="intellectual" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Intellectual Property</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>All content on the Website — including but not limited to text, graphics, logos, images, product designs, and software — is the intellectual property of T AND T COMPANY (Pty) Ltd and is protected by South African and international copyright and trademark laws.</p>
              <p>You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.</p>
            </div>
          </article>

          {/* 12. Governing Law */}
          <article id="governing" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Governing Law</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>These Terms are governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of South Africa.</p>
            </div>
          </article>

          {/* 13. Contact */}
          <article id="contact" className="scroll-mt-32 space-y-4">
            <h2 className="font-serif text-3xl text-navy">Contact</h2>
            <div className="hairline mt-4 mb-6 bg-border" />
            <div className="space-y-3 text-foreground/85 leading-relaxed text-sm">
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="mt-4 bg-cream border border-border p-5 shadow-soft space-y-3">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> stewardship@tandtcompany.com</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +27 (0) 61 485 2498</div>
                <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-gold mt-0.5" /> South Africa</div>
              </div>
            </div>
          </article>

          <div className="border-t border-border pt-10">
            <p className="text-sm text-muted-foreground">
              Related policies:{" "}
              <Link to="/privacy-policy" className="text-gold link-underline">Privacy Policy</Link> ·{" "}
              <Link to="/shipping-policy" className="text-gold link-underline">Shipping Policy</Link> ·{" "}
              <Link to="/returns-policy" className="text-gold link-underline">Returns Policy</Link> ·{" "}
              <Link to="/refund-policy" className="text-gold link-underline">Refund Policy</Link> ·{" "}
              <Link to="/cookie-policy" className="text-gold link-underline">Cookie Policy</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
