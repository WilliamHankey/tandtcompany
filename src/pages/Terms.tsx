import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { CheckCircle2, Mail, MapPin } from "lucide-react";
import hero from "@/assets/hero.jpg";

type Section = {
  id: string;
  title: string;
  render: () => JSX.Element;
};

const sections: Section[] = [
  {
    id: "general",
    title: "General Information",
    render: () => (
      <>
        <p>Welcome to T AND T COMPANY. By accessing our website and services, you agree to be bound by the following terms and conditions. Our mission is to provide premium, faith-led lifestyle products that embody purpose and quality.</p>
        <p>These terms apply to all visitors, users, and others who access or use our Service. We reserve the right to update these terms at any time, reflecting our evolving commitment to our community and legal requirements.</p>
      </>
    ),
  },
  {
    id: "products",
    title: "Products & Availability",
    render: () => (
      <>
        <p>All products shown on our site are subject to availability. We strive to provide the most accurate representation of our items, yet slight variations in colour and texture may occur due to the artisanal nature of certain collections and digital display differences.</p>
        <div className="mt-6 bg-secondary/50 border-l-2 border-gold p-5">
          <p className="font-serif text-navy">Limited Editions</p>
          <p className="mt-2 text-sm">Exclusive collections marked as 'Limited Edition' will not be restocked once sold out, maintaining the unique value of each piece for our patrons.</p>
        </div>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Pricing",
    render: () => (
      <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. All prices are listed in ZAR unless otherwise specified.</p>
    ),
  },
  {
    id: "orders",
    title: "Orders & Payments",
    render: () => (
      <>
        <p>We utilize <span className="font-serif text-navy">PaySharp</span> for secure, encrypted payment processing. By placing an order, you represent that you are authorized to use the designated payment method.</p>
        <ul className="mt-5 space-y-3">
          <li className="flex gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />Order confirmation emails are sent immediately upon successful transaction.</li>
          <li className="flex gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />We reserve the right to refuse any order you place with us for security or inventory reasons.</li>
        </ul>
      </>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    render: () => (
      <>
        <p>T AND T COMPANY ships worldwide with a focus on sustainable packaging. Standard processing time is 2–4 business days. Delivery times vary by location:</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="border border-border p-5 border-l-2 border-l-gold">
            <p className="eyebrow !text-gold">Domestic</p>
            <p className="font-serif text-navy mt-2">5–7 Business Days</p>
          </div>
          <div className="border border-border p-5 border-l-2 border-l-gold">
            <p className="eyebrow !text-gold">International</p>
            <p className="font-serif text-navy mt-2">10–15 Business Days</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "returns",
    title: "Returns & Exchanges",
    render: () => (
      <>
        <p>We want you to be completely satisfied with your purchase. If you are not happy with your item, you may return it within 30 days of delivery.</p>
        <p>Items must be in original condition, unworn, and with all tags attached. Returns that do not meet these criteria may be denied at our discretion.</p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    render: () => (
      <>
        <p>Your privacy is of utmost importance to us. We collect only the information necessary to process your orders and provide a personalized experience. We do not sell or share your data with third parties for marketing purposes.</p>
        <div className="mt-6 bg-secondary/50 border-l-2 border-gold p-5 italic text-sm">
          "Our commitment to your privacy reflects our commitment to stewardship and respect for every individual in our community."
        </div>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Information",
    render: () => (
      <>
        <p>For inquiries regarding these terms or any order concerns, please reach out to our dedicated support team.</p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold" />stewardship@tandtcompany.com</li>
          <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold" />[TODO: City] | Global Operations</li>
        </ul>
      </>
    ),
  },
];

const Terms = () => {
  const [active, setActive] = useState(sections[0].id);

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
      {/* HERO */}
      <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative container-prose text-center">
          <h1 className="font-serif text-5xl md:text-6xl">Terms & Policies</h1>
          <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
            Establishing our commitment to excellence, integrity, and the shared values that define T AND T COMPANY.
          </p>
        </div>
      </section>

      <section className="container-prose py-20 grid lg:grid-cols-[220px_1fr] gap-14">
        {/* Sidebar */}
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

        {/* Content */}
        <div className="space-y-16 max-w-2xl">
          {sections.map((s) => (
            <article key={s.id} id={s.id} className="scroll-mt-32">
              <h2 className="font-serif text-3xl text-navy">{s.title}</h2>
              <div className="hairline mt-4 mb-6 bg-border" />
              <div className="space-y-4 text-foreground/85 leading-relaxed">{s.render()}</div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
