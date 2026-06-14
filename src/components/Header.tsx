import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { count } = useCart();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-9 left-0 right-0 z-50 transition-all duration-500 text-cream",
          scrolled
            ? "bg-navy-deep/95 backdrop-blur-md shadow-soft"
            : "bg-navy-deep/80 backdrop-blur-sm",
        )}
      >
        <div className="w-full px-6 grid grid-cols-[auto_1fr_auto] items-center h-16 md:h-20 gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="md:hidden opacity-90 hover:opacity-100 transition-opacity"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/brandmark-wordmar-horizontal.svg"
                alt="T & T Company"
                className="h-10 md:h-12"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-10 text-[0.7rem] uppercase tracking-[0.28em]">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "link-underline transition-opacity",
                    isActive
                      ? "text-gold opacity-100"
                      : "opacity-75 hover:opacity-100",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex justify-end items-center gap-5 text-cream">
            <button
              aria-label="Search"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              aria-label="Account"
              className="opacity-80 hover:opacity-100 transition-opacity hidden sm:inline-flex"
            >
              <User className="h-4 w-4" />
            </button>

            <Link
              to="/cart"
              aria-label="Bag"
              className="relative opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-navy-deep text-[0.6rem] font-medium rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Overlay Menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-navy-deep text-cream transition-all duration-500 md:hidden",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between px-6 h-20">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/brandmark-wordmar-horizontal.svg"
              alt="T & T Company"
              className="h-10"
            />
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="opacity-90 hover:opacity-100 transition-opacity"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-6 pt-16 flex flex-col gap-8">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "font-serif text-5xl leading-none transition-colors",
                  isActive ? "text-gold" : "text-cream",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-10 left-6 right-6 border-t border-cream/15 pt-6">
          <p className="eyebrow !text-gold">T AND T COMPANY</p>
          <p className="mt-3 text-sm text-cream/60">
            Faith. Purpose. Style.
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;