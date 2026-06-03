import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import Newsletter from "./Newsletter";
import { useSiteSettings } from "@/hooks/useSanityContent";

const defaultShopLinks = [
  { label: "All pieces", href: "/shop" },
  { label: "New arrivals", href: "/shop" },
  { label: "Best sellers", href: "/shop" },
  { label: "Your bag", href: "/cart" },
];

const defaultBrandLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms & Policies", href: "/terms" },
  { label: "Shipping & Returns", href: "/terms" },
];

const Footer = () => {
  const { data: s } = useSiteSettings();
  const shopLinks = s?.footerShopLinks?.length ? s.footerShopLinks : defaultShopLinks;
  const brandLinks = s?.footerBrandLinks?.length ? s.footerBrandLinks : defaultBrandLinks;
  const email = s?.email || "hello@tandt.co";
  const phone = s?.phone || "+27 ___ ___ ____";
  const paymentText = s?.paymentMethodsText || "VISA · MASTERCARD · EFT · PAYSTACK";

  return (
    <footer className="bg-navy-gradient text-cream mt-24">
      <div className="container-prose pt-20 pb-12 grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-2xl tracking-[0.25em]">
            T <span className="text-accent">&amp;</span> T
          </div>
          <p className="mt-4 max-w-sm text-cream/70 leading-relaxed">
            {s?.tagline || "Faith. Purpose. Style. A quiet brand for those building something that lasts."}
          </p>
          <div className="mt-8">
            <p className="eyebrow !text-cream/60 mb-3">
              {s?.footerNewsletterTitle || "Join the inner circle"}
            </p>
            <Newsletter variant="dark" />
            <p className="mt-3 text-[0.7rem] text-cream/50">
              {s?.footerNewsletterSubtext ||
                "Early access to drops, founder notes & 10% off your first order."}
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <h4 className="eyebrow !text-cream/60 mb-4">Shop</h4>
          <ul className="space-y-2 text-cream/80 text-sm">
            {shopLinks.map((l: { label: string; href: string }) => (
              <li key={l.label}>
                <Link to={l.href} className="link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="eyebrow !text-cream/60 mb-4">Brand</h4>
          <ul className="space-y-2 text-cream/80 text-sm">
            {brandLinks.map((l: { label: string; href: string }) => (
              <li key={l.label}>
                <Link to={l.href} className="link-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h4 className="eyebrow !text-cream/60 mb-4">Reach Us</h4>
          <ul className="space-y-3 text-cream/80 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" /> {email}
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gold" /> {phone}
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-4">
            {s?.instagramUrl && (
              <a
                href={s.instagramUrl}
                aria-label="Instagram"
                className="opacity-80 hover:opacity-100 hover:text-gold transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {s?.facebookUrl && (
              <a
                href={s.facebookUrl}
                aria-label="Facebook"
                className="opacity-80 hover:opacity-100 hover:text-gold transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-prose py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <span>© {new Date().getFullYear()} T AND T COMPANY · All rights reserved</span>
          <div className="flex items-center gap-4">
            <span className="tracking-[0.2em] uppercase text-cream/40">We accept</span>
            <span className="text-cream/70 text-[0.7rem] tracking-wider">{paymentText}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
