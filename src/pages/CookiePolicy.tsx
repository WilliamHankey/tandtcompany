import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <article id={id} className="scroll-mt-32 space-y-4">
    <h2 className="font-serif text-2xl text-navy">{title}</h2>
    <div className="hairline mt-3 mb-5 bg-border" />
    <div className="space-y-4 text-foreground/85 leading-relaxed text-sm">{children}</div>
  </article>
);

const CookiePolicy = () => (
  <Layout>
    <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
      <div className="relative container-prose text-center">
        <p className="eyebrow !text-gold mb-4">How We Use Cookies</p>
        <h1 className="font-serif text-5xl md:text-6xl">Cookie Policy</h1>
        <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
          This policy explains what cookies are, how we use them, and how you can manage your preferences.
        </p>
        <p className="mt-4 text-cream/50 text-xs">Last updated: 19 July 2026</p>
      </div>
    </section>

    <section className="container-prose py-20 max-w-3xl">
      <div className="space-y-16">
        <Section id="what-are-cookies" title="1. What Are Cookies?">
          <div className="flex items-start gap-4 bg-cream border border-border p-5 shadow-soft">
            <Cookie className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember information about your visit, such as your preferences and settings, to provide a better experience.
              </p>
            </div>
          </div>
        </Section>

        <Section id="how-we-use" title="2. How We Use Cookies">
          <p>T AND T COMPANY uses cookies for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Essential functionality:</strong> To enable core features such as the shopping cart, checkout process, and session management</li>
            <li><strong>Remember preferences:</strong> To remember your settings, language preferences, and display choices</li>
            <li><strong>Analytics:</strong> To understand how visitors use our Website, which pages are most popular, and how to improve our services</li>
            <li><strong>Security:</strong> To help protect our Website against fraud and unauthorised access</li>
          </ul>
        </Section>

        <Section id="types-of-cookies" title="3. Types of Cookies We Use">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-secondary/60">
                <tr>
                  <th className="text-left p-3 font-medium text-navy">Cookie Type</th>
                  <th className="text-left p-3 font-medium text-navy">Purpose</th>
                  <th className="text-left p-3 font-medium text-navy">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 font-medium">Strictly Necessary</td>
                  <td className="p-3">Required for the Website to function (cart, checkout, security)</td>
                  <td className="p-3">Session / 30 days</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Functional</td>
                  <td className="p-3">Remember your preferences and settings</td>
                  <td className="p-3">Up to 1 year</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Analytics</td>
                  <td className="p-3">Help us understand Website usage and improve performance</td>
                  <td className="p-3">Up to 2 years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="third-party" title="4. Third-Party Cookies">
          <p>Some cookies are set by third-party services that appear on our pages:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Google Analytics:</strong> Helps us understand how visitors interact with our Website. Google's privacy policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold link-underline">policies.google.com/privacy</a></li>
            <li><strong>Paystack:</strong> Payment processing may set cookies during the checkout process. Paystack's privacy policy: <a href="https://paystack.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold link-underline">paystack.com/privacy</a></li>
          </ul>
        </Section>

        <Section id="managing" title="5. Managing Your Cookie Preferences">
          <p>You can control and manage cookies through your browser settings:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
          </ul>
          <p className="mt-4">
            Please note that disabling certain cookies may affect the functionality of our Website. Specifically, disabling essential cookies will prevent you from using the shopping cart and checkout features.
          </p>
        </Section>

        <Section id="do-not-track" title="6. Do Not Track (DNT) Signals">
          <p>
            Our Website currently does not respond to "Do Not Track" browser signals. However, you can manage your tracking preferences through the cookie controls described above.
          </p>
        </Section>

        <Section id="updates" title="7. Updates to This Policy">
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. Any changes will be posted on this page with an updated "Last updated" date.
          </p>
        </Section>

        <Section id="contact" title="8. Contact Us">
          <p>If you have any questions about our use of cookies, please contact us:</p>
          <div className="mt-4 bg-cream border border-border p-5 shadow-soft space-y-3">
            <p className="flex items-center gap-2">
              <span className="text-gold">Email:</span> stewardship@tandtcompany.com
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gold">WhatsApp:</span> +27 (0) 61 485 2498
            </p>
          </div>
        </Section>

        <div className="border-t border-border pt-10 mt-10">
          <p className="text-sm text-muted-foreground">
            Related policies:{" "}
            <Link to="/privacy-policy" className="text-gold link-underline">Privacy Policy</Link> ·{" "}
            <Link to="/terms" className="text-gold link-underline">Terms & Conditions</Link> ·{" "}
            <Link to="/shipping-policy" className="text-gold link-underline">Shipping Policy</Link> ·{" "}
            <Link to="/returns-policy" className="text-gold link-underline">Returns Policy</Link> ·{" "}
            <Link to="/refund-policy" className="text-gold link-underline">Refund Policy</Link>
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default CookiePolicy;
