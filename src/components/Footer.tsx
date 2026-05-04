import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-navy-gradient text-cream mt-24">
    <div className="container-prose py-20 grid gap-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-serif text-2xl tracking-[0.25em]">
          T <span className="text-accent">&amp;</span> T
        </div>
        <p className="mt-4 max-w-sm text-cream/70 leading-relaxed">
          Faith. Purpose. Style. A quiet brand for those building something that lasts.
        </p>
      </div>
      <div>
        <h4 className="eyebrow !text-cream/60 mb-4">Explore</h4>
        <ul className="space-y-2 text-cream/80 text-sm">
          <li><Link to="/about" className="link-underline">Our Story</Link></li>
          <li><Link to="/shop" className="link-underline">Shop</Link></li>
          <li><Link to="/contact" className="link-underline">Contact</Link></li>
          <li><Link to="/terms" className="link-underline">Terms &amp; Policies</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="eyebrow !text-cream/60 mb-4">Reach Us</h4>
        <ul className="space-y-2 text-cream/80 text-sm">
          <li>Email: <span className="text-cream">[hello@tandt.co]</span></li>
          <li>WhatsApp: <span className="text-cream">[+27 ___ ___ ____]</span></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-cream/10">
      <div className="container-prose py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-cream/50">
        <span>© {new Date().getFullYear()} T AND T COMPANY</span>
        <span className="tracking-[0.25em] uppercase">Made with intention</span>
      </div>
    </div>
  </footer>
);

export default Footer;
