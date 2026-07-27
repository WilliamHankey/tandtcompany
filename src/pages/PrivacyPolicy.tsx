import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <article id={id} className="scroll-mt-32 space-y-4">
    <h2 className="font-serif text-2xl text-navy">{title}</h2>
    <div className="hairline mt-3 mb-5 bg-border" />
    <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">{children}</div>
  </article>
);

const PrivacyPolicy = () => (
  <Layout>
    <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
      <div className="relative container-prose text-center">
        <p className="eyebrow !text-gold mb-4">Legal</p>
        <h1 className="font-serif text-5xl md:text-6xl">Privacy Policy</h1>
        <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
          Your privacy matters to us. This policy explains how T AND T COMPANY collects, uses, and protects your personal information.
        </p>
        <p className="mt-4 text-cream/50 text-xs">Last updated: 19 July 2026</p>
      </div>
    </section>

    <section className="container-prose py-20 max-w-3xl">
      <div className="space-y-16">
        <Section id="introduction" title="1. Introduction">
          <p>
            T AND T COMPANY (Pty) Ltd ("we", "us", "our") is committed to protecting your privacy in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and other applicable South African data protection laws.
          </p>
          <p>
            This Privacy Policy describes how we collect, use, store, share, and protect your personal information when you visit our website at <strong>tandtcompany.store</strong> (the "Website"), make a purchase, or interact with our services.
          </p>
          <p>
            By using our Website, you consent to the practices described in this policy. If you do not agree, please do not use our Website.
          </p>
        </Section>

        <Section id="information-collected" title="2. Information We Collect">
          <p>We may collect the following categories of personal information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Identity Information:</strong> Full name, date of birth (if provided)</li>
            <li><strong>Contact Information:</strong> Email address, phone number, physical/delivery address</li>
            <li><strong>Transaction Information:</strong> Order history, payment details (processed securely via Paystack — we do not store card numbers)</li>
            <li><strong>Technical Information:</strong> IP address, browser type, device information, operating system</li>
            <li><strong>Usage Information:</strong> Pages visited, time spent on pages, navigation patterns, referring URLs</li>
            <li><strong>Communication Information:</strong> Any information you provide when contacting us via email, WhatsApp, or our contact form</li>
          </ul>
        </Section>

        <Section id="how-we-use" title="3. How We Use Your Information">
          <p>We use your personal information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>To process and fulfil your orders, including delivery and payment processing</li>
            <li>To communicate with you about your orders, account, or enquiries</li>
            <li>To send order confirmations, shipping updates, and receipts</li>
            <li>To improve our Website, products, and services</li>
            <li>To detect and prevent fraud, unauthorised transactions, and other illegal activities</li>
            <li>To comply with legal obligations under South African law</li>
            <li>To send marketing communications (only with your explicit opt-in consent)</li>
          </ul>
        </Section>

        <Section id="legal-basis" title="4. Legal Basis for Processing">
          <p>We process your personal information based on:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Contractual necessity:</strong> To fulfil our obligations under a sale or service agreement with you</li>
            <li><strong>Legitimate interest:</strong> To operate and improve our business, prevent fraud, and ensure security</li>
            <li><strong>Consent:</strong> Where you have given explicit consent (e.g., marketing emails)</li>
            <li><strong>Legal obligation:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </Section>

        <Section id="cookies" title="5. Cookies and Tracking Technologies">
          <p>
            Our Website uses cookies and similar technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us understand how you use our Website.
          </p>
          <p>We use the following types of cookies:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Essential Cookies:</strong> Required for the Website to function (e.g., shopping cart, checkout)</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our Website (e.g., Google Analytics)</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Disabling essential cookies may affect Website functionality.
          </p>
        </Section>

        <Section id="analytics" title="6. Analytics">
          <p>
            We may use Google Analytics or similar services to collect anonymised data about Website usage. This information helps us improve our content and user experience. Analytics data does not directly identify you personally.
          </p>
          <p>
            Google's privacy policy governs how Google Analytics collects and processes data: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold link-underline">https://policies.google.com/privacy</a>
          </p>
        </Section>

        <Section id="payment-processing" title="7. Payment Processing">
          <p>
            All payments are processed securely through Paystack, a PCI DSS Level 1 compliant payment service provider. T AND T COMPANY does not store customers' full card details, CVV or banking credentials.
          </p>
          <p>
            Paystack collects and processes payment information in accordance with their own privacy policy. For more information, visit <a href="https://paystack.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold link-underline">https://paystack.com/privacy</a>.
          </p>
          <p>We accept the following payment methods:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Credit and debit cards (Visa, Mastercard)</li>
          </ul>
        </Section>

        <Section id="data-retention" title="8. Data Retention">
          <p>
            We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements.
          </p>
          <p>Specifically:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Order, invoice and transaction records: retained for at least five years, or longer where required for tax, accounting, legal, fraud-prevention or dispute-resolution purposes.</li>
              <li>Marketing preferences: retained until consent is withdrawn or the information is no longer required.</li>
              <li>Google Analytics user-level and event-level data: retained according to our configured Google Analytics retention setting, currently up to 14 months.</li>
              <li>Customer enquiries: retained only for as long as reasonably necessary to respond to the enquiry, maintain support records and resolve related disputes.</li>
            </ul>
        </Section>

        <Section id="third-party" title="9. Third-Party Services">
          <p>We share your information with the following third-party service providers, solely for the purposes outlined in this policy:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Paystack:</strong> Payment processing</li>
            <li><strong>Sanity:</strong> Content management (order data stored as part of order fulfilment)</li>
            <li><strong>Cloudflare:</strong> Website hosting</li>
            <li><strong>Google Analytics:</strong> Website analytics (anonymised data)</li>
            <li><strong>Courier services:</strong> Delivery of orders (name, address, phone number)</li>
          </ul>
          <p>
            We require all third-party service providers to protect your personal information and use it only for the purposes we specify.
          </p>
        </Section>

        <Section id="your-rights" title="10. Your Rights Under POPIA">
          <p>Under POPIA, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
            <li><strong>Objection:</strong> Object to the processing of your personal information for certain purposes</li>
            <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator of South Africa if you believe your rights have been infringed</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the details below. We will respond to your request within a reasonable period and in any event within 30 days.
          </p>
        </Section>

        <Section id="security" title="11. Data Security">
          <p>
            We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
            <li>PCI DSS compliant payment processing through Paystack</li>
            <li>Regular security assessments and updates</li>
            <li>Limited access to personal information on a need-to-know basis</li>
          </ul>
          <p>
            While we take reasonable precautions, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
          </p>
        </Section>

        <Section id="children" title="12. Children's Privacy">
          <p>
            Our Website is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </Section>

        <Section id="changes" title="13. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
          </p>
          <p>
            Material changes will be communicated via email or a prominent notice on our Website.
          </p>
        </Section>

        <Section id="contact" title="14. Contact Information">
          <p>
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
          </p>
          <div className="mt-6 bg-cream border border-border p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold shrink-0" />
              <span>stewardship@tandtcompany.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold shrink-0" />
              <span>+27 (0) 61 485 2498</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>T AND T COMPANY (Pty) Ltd</span>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            You may also contact the Information Regulator of South Africa:<br />
            Website: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-gold link-underline">inforegulator.org.za</a>
          </p>
        </Section>

        <div className="border-t border-border pt-10 mt-10">
          <p className="text-sm text-muted-foreground">
            Related policies:{" "}
            <Link to="/terms" className="text-gold link-underline">Terms & Conditions</Link> ·{" "}
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

export default PrivacyPolicy;
