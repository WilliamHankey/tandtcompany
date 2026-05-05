import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import Newsletter from "./Newsletter";

const Footer = () => (
  <footer className="bg-navy-gradient text-cream mt-24">
    <div className="container-prose pt-20 pb-12 grid gap-14 md:grid-cols-12">
      <div className="md:col-span-5">
        <div className="font-serif text-2xl tracking-[0.25em]">
          T <span className="text-accent">&amp;</span> T
        </div>
        <p className="mt-4 max-w-sm text-cream/70 leading-relaxed">
          Faith. Purpose. Style. A quiet brand for those building something that lasts.
        </p>
        <div className="mt-8">
          <p className="eyebrow !text-cream/60 mb-3">Join the inner circle</p>
          <Newsletter variant="dark" />
          <p className="mt-3 text-[0.7rem] text-cream/50">
            Early access to drops, founder notes & 10% off your first order.
          </p>
        </div>
      </div>
      <div className="md:col-span-2">
        <h4 className="eyebrow !text-cream/60 mb-4">Shop</h4>
        <ul className="space-y-2 text-cream/80 text-sm">
          <li><Link to="/shop" className="link-underline">All pieces</Link></li>
          <li><Link to="/shop" className="link-underline">New arrivals</Link></li>
          <li><Link to="/shop" className="link-underline">Best sellers</Link></li>
          <li><Link to="/cart" className="link-underline">Your bag</Link></li>
        </ul>
      </div>
      <div className="md:col-span-2">
        <h4 className="eyebrow !text-cream/60 mb-4">Brand</h4>
        <ul className="space-y-2 text-cream/80 text-sm">
          <li><Link to="/about" className="link-underline">Our Story</Link></li>
          <li><Link to="/contact" className="link-underline">Contact</Link></li>
          <li><Link to="/terms" className="link-underline">Terms & Policies</Link></li>
          <li><Link to="/terms" className="link-underline">Shipping & Returns</Link></li>
        </ul>
      </div>
      <div className="md:col-span-3">
        <h4 className="eyebrow !text-cream/60 mb-4">Reach Us</h4>
        <ul className="space-y-3 text-cream/80 text-sm">
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@tandt.co</li>
          <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-gold" /> +27 ___ ___ ____</li>
        </ul>
        <div className="mt-6 flex items-center gap-4">
          <a href="#" aria-label="Instagram" className="opacity-80 hover:opacity-100 hover:text-gold transition"><Instagram className="h-4 w-4" /></a>
          <a href="#" aria-label="Facebook" className="opacity-80 hover:opacity-100 hover:text-gold transition"><Facebook className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
    <div className="border-t border-cream/10">
      <div className="container-prose py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream/50">
        <span>© {new Date().getFullYear()} T AND T COMPANY · All rights reserved</span>
        <div className="flex items-center gap-4">
          <span className="tracking-[0.2em] uppercase text-cream/40">We accept</span>
          <span className="text-cream/70 text-[0.7rem] tracking-wider">VISA · MASTERCARD · EFT · PAYSHARP</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
