import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";

import { useSiteSettings } from "@/hooks/useSanityContent";

type SiteSettings = {
  siteName?: string;
  tagline?: string;
  email?: string;
  stewardshipEmail?: string;
  phone?: string;
  whatsappUrl?: string;
  address?: string;
  companyName?: string;
  companyRegNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  footerShopLinks?: { label?: string; href?: string }[];
  footerBrandLinks?: { label?: string; href?: string }[];
  paymentMethodsText?: string;
  businessHours?: string;
};

const Footer = () => {
  const { data: raw } = useSiteSettings();
  const s = raw as SiteSettings | undefined;

  const shopLinks = s?.footerShopLinks?.filter((l) => l.label && l.href) || [];
  const brandLinks =
    s?.footerBrandLinks?.filter((l) => l.label && l.href) || [];

  return (
    <footer className="bg-navy-deep text-cream">
      <div className="container-prose pt-20 pb-12 grid gap-14 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <div className="font-serif text-2xl tracking-[0.25em]">
            T <span className="text-accent">&amp;</span> T
          </div>
          {s?.tagline && (
            <p className="mt-4 max-w-sm text-cream/70 leading-relaxed">
              {s.tagline}
            </p>
          )}
        </div>

        {/* Shop Links */}
        {shopLinks.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="eyebrow !text-cream/60 mb-4">Shop</h4>
            <ul className="space-y-2 text-cream/80 text-sm">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href!} className="link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Brand Links */}
        {brandLinks.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="eyebrow !text-cream/60 mb-4">Company</h4>
            <ul className="space-y-2 text-cream/80 text-sm">
              {brandLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href!} className="link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Policies */}
        <div className="md:col-span-2">
          <h4 className="eyebrow !text-cream/60 mb-4">Policies</h4>
          <ul className="space-y-2 text-cream/80 text-sm">
            <li>
              <Link to="/terms" className="link-underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="link-underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="link-underline">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/returns-policy" className="link-underline">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="link-underline">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/cookie-policy" className="link-underline">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        {(s?.email || s?.phone || s?.whatsappUrl || s?.address) && (
          <div className="md:col-span-2">
            <h4 className="eyebrow !text-cream/60 mb-4">Reach Us</h4>
            <ul className="space-y-3 text-cream/80 text-sm">
              {s?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gold shrink-0" />
                  <a href={`mailto:${s.email}`} className="link-underline">
                    {s.email}
                  </a>
                </li>
              )}
              {s?.phone && (
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  <a
                    href={`tel:${s.phone.replace(/\s/g, "")}`}
                    className="link-underline"
                  >
                    {s.phone}
                  </a>
                </li>
              )}
              {s?.whatsappUrl && (
                <li className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <a
                    href={s.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {s?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>{s.address}</span>
                </li>
              )}
            </ul>
            {(s?.instagramUrl || s?.facebookUrl) && (
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
            )}
          </div>
        )}

        {/* Contact (fallback column when no contact info exists — keeps layout) */}
        {!(s?.email || s?.phone || s?.whatsappUrl || s?.address) && (
          <div className="md:col-span-2" />
        )}
      </div>

      {/* Business hours + support email */}
      {(s?.businessHours || s?.stewardshipEmail) && (
        <div className="border-t border-cream/10">
          <div className="container-prose py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                {s?.businessHours && (
                  <span>Business Hours: {s.businessHours}</span>
                )}
                {s?.businessHours && s?.stewardshipEmail && (
                  <span className="hidden md:inline">·</span>
                )}
                {s?.stewardshipEmail && (
                  <span>Support: {s.stewardshipEmail}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="container-prose py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <span>
            © {new Date().getFullYear()} {s?.companyName || "T AND T COMPANY (Pty) Ltd"}
            {s?.companyRegNumber ? ` · Reg No: ${s.companyRegNumber}` : ""} · All rights
            reserved
          </span>
          {s?.paymentMethodsText && (
            <div className="flex items-center gap-4">
              <span className="tracking-[0.2em] uppercase text-cream/40">
                We accept
              </span>
              <span className="text-cream/70 text-[0.7rem] tracking-wider">
                {s.paymentMethodsText}
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
