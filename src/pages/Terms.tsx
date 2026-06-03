import type { ReactNode } from "react";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { CheckCircle2, Mail, MapPin } from "lucide-react";
import { useTermsPage, useSiteSettings } from "@/hooks/useSanityContent";
import { PortableTextBlock } from "@/components/PortableTextBlock";
import { imageUrl } from "@/lib/sanity";
import heroFallback from "@/assets/hero.jpg";

type FallbackSection = {
  id: string;
  title: string;
  content: ReactNode;
};

const fallbackSections: FallbackSection[] = [
  {
    id: "general",
    title: "General Information",
    content: (
      <>
        <p>Welcome to T AND T COMPANY. By accessing our website and services, you agree to be bound by the following terms and conditions.</p>
        <p>These terms apply to all visitors, users, and others who access or use our Service.</p>
      </>
    ),
  },
  {
    id: "products",
    title: "Products & Availability",
    content: (
      <p>All products shown on our site are subject to availability. We strive to provide accurate representations of our items.</p>
    ),
  },
  {
    id: "pricing",
    title: "Pricing",
    content: <p>All prices are listed in ZAR unless otherwise specified.</p>,
  },
  {
    id: "orders",
    title: "Orders & Payments",
    content: (
      <>
        <p>We utilize <span className="font-serif text-navy">Paystack</span> for secure, encrypted payment processing.</p>
        <ul className="mt-5 space-y-3">
          <li className="flex gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />Order confirmation emails are sent upon successful transaction.</li>
        </ul>
      </>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    content: <p>T AND T COMPANY ships across South Africa. Standard processing time is 2–4 business days.</p>,
  },
  {
    id: "returns",
    title: "Returns & Exchanges",
    content: <p>You may return unworn items within 30 days of delivery in original condition.</p>,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    content: <p>We collect only information necessary to process orders. We do not sell your data for marketing.</p>,
  },
  {
    id: "contact",
    title: "Contact Information",
    content: (
      <ul className="mt-6 space-y-3 text-sm">
        <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold" />stewardship@tandtcompany.com</li>
        <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-gold" />South Africa | Global Operations</li>
      </ul>
    ),
  },
];

const Terms = () => {
  const { data: page } = useTermsPage();
  const { data: settings } = useSiteSettings();
  const cmsSections = page?.sections;
  const sections = cmsSections?.length
    ? cmsSections.map((s: { id: string; title: string }) => ({ id: s.id, title: s.title }))
    : fallbackSections.map((s) => ({ id: s.id, title: s.title }));

  const [active, setActive] = useState(sections[0]?.id || "general");
  const heroImg = page?.heroImage ? imageUrl(page.heroImage, 1600) : heroFallback;

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
  }, [sections]);

  return (
    <Layout>
      <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative container-prose text-center">
          <h1 className="font-serif text-5xl md:text-6xl">{page?.heroHeadline || "Terms & Policies"}</h1>
          <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
            {page?.heroSubtext ||
              "Establishing our commitment to excellence, integrity, and the shared values that define T AND T COMPANY."}
          </p>
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
          {cmsSections?.length
            ? cmsSections.map((s: { id: string; title: string; body?: unknown[]; callout?: { title?: string; text?: string } }) => (
                <article key={s.id} id={s.id} className="scroll-mt-32">
                  <h2 className="font-serif text-3xl text-navy">{s.title}</h2>
                  <div className="hairline mt-4 mb-6 bg-border" />
                  <PortableTextBlock value={s.body as never} />
                  {s.callout?.title && (
                    <div className="mt-6 bg-secondary/50 border-l-2 border-gold p-5">
                      <p className="font-serif text-navy">{s.callout.title}</p>
                      {s.callout.text && <p className="mt-2 text-sm">{s.callout.text}</p>}
                    </div>
                  )}
                </article>
              ))
            : fallbackSections.map((s) => (
                <article key={s.id} id={s.id} className="scroll-mt-32">
                  <h2 className="font-serif text-3xl text-navy">{s.title}</h2>
                  <div className="hairline mt-4 mb-6 bg-border" />
                  <div className="space-y-4 text-foreground/85 leading-relaxed">{s.content}</div>
                </article>
              ))}

          {page?.contactBlock && (
            <article className="border-t border-border pt-12">
              <h2 className="font-serif text-2xl text-navy">{page.contactBlock.title}</h2>
              <p className="mt-4 text-muted-foreground">{page.contactBlock.body}</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gold" />
                  {settings?.stewardshipEmail || settings?.email || "hello@tandt.co"}
                </li>
              </ul>
            </article>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
