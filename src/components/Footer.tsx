import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MessageCircle, Phone, MapPin } from "lucide-react";
import Newsletter from "./Newsletter";
import { useSiteSettings } from "@/hooks/useSanityContent";

const Footer = () => {
  const { data: s } = useSiteSettings();
  const email = s?.email || "stewardship@tandtcompany.com";
  const phone = s?.phone || "+27 (0) 61 485 2498";
  const address = s?.address || "South Africa";
  const paymentText =
    s?.paymentMethodsText || "VISA · MASTERCARD · EFT · PAYSTACK";

  return (
    <footer className="bg-navy-deep text-cream mt-24">
      <div className="container-prose pt-20 pb-12 grid gap-14 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <div className="font-serif text-2xl tracking-[0.25em]">
            T <span className="text-accent">&amp;</span> T
          </div>
          <p className="mt-4 max-w-sm text-cream/70 leading-relaxed">
            {s?.tagline ||
              "Faith. Purpose. Style. A quiet brand for those building something that lasts."}
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

        {/* Shop */}
        <div className="md:col-span-2">
          <h4 className="eyebrow !text-cream/60 mb-4">Shop</h4>
          <ul className="space-y-2 text-cream/80 text-sm">
            <li><Link to="/shop" className="link-underline">All Products</Link></li>
            <li><Link to="/shop" className="link-underline">New Arrivals</Link></li>
            <li><Link to="/shop" className="link-underline">Best Sellers</Link></li>
            <li><Link to="/cart" className="link-underline">Your Bag</Link></li>
          </ul>
        </div>

        {/* Brand */}
        <div className="md:col-span-2">
          <h4 className="eyebrow !text-cream/60 mb-4">Company</h4>
          <ul className="space-y-2 text-cream/80 text-sm">
            <li><Link to="/about" className="link-underline">About Us</Link></li>
            <li><Link to="/contact" className="link-underline">Contact</Link></li>
            <li><Link to="/faq" className="link-underline">FAQ</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div className="md:col-span-2">
          <h4 className="eyebrow !text-cream/60 mb-4">Policies</h4>
          <ul className="space-y-2 text-cream/80 text-sm">
            <li><Link to="/terms" className="link-underline">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="link-underline">Privacy Policy</Link></li>
            <li><Link to="/shipping-policy" className="link-underline">Shipping Policy</Link></li>
            <li><Link to="/returns-policy" className="link-underline">Returns Policy</Link></li>
            <li><Link to="/refund-policy" className="link-underline">Refund Policy</Link></li>
            <li><Link to="/cookie-policy" className="link-underline">Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-2">
          <h4 className="eyebrow !text-cream/60 mb-4">Reach Us</h4>
          <ul className="space-y-3 text-cream/80 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold shrink-0" />
              <a href={`mailto:${email}`} className="link-underline">{email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold shrink-0" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="link-underline">{phone}</a>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <a
                href={s?.whatsappUrl || "https://wa.me/27614852498"}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>{address}</span>
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

      {/* Business hours */}
      <div className="border-t border-cream/10">
        <div className="container-prose py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>Business Hours: Mon–Fri, 08:00–17:00 SAST</span>
              <span className="hidden md:inline">·</span>
              <span>Support: stewardship@tandtcompany.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="container-prose py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <span>
            © {new Date().getFullYear()} T AND T COMPANY (Pty) Ltd · All rights reserved
          </span>
          <div className="flex items-center gap-4">
            <span className="tracking-[0.2em] uppercase text-cream/40">
              We accept
            </span>
            <span className="text-cream/70 text-[0.7rem] tracking-wider">
              {paymentText}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
