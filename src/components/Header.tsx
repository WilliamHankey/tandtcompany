import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Collections" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { count } = useCart();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-9 left-0 right-0 z-50 transition-all duration-500 text-cream",
        scrolled ? "bg-navy-deep/95 backdrop-blur-md shadow-soft" : "bg-navy-deep/80 backdrop-blur-sm"
      )}
    >
      <div className="container-prose grid grid-cols-[auto_1fr_auto] items-center h-16 md:h-20 gap-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="font-serif text-2xl tracking-[0.15em] text-gold-soft">
            T<span className="text-gold">T</span>
          </span>
          <span className="hidden sm:block text-[0.65rem] uppercase tracking-[0.3em] leading-tight">
            T and T<br />Company
          </span>
        </Link>
        <nav className="hidden md:flex items-center justify-center gap-10 text-[0.7rem] uppercase tracking-[0.28em]">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "link-underline transition-opacity",
                  isActive && pathname === l.to ? "text-gold opacity-100" : "opacity-75 hover:opacity-100"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-5 text-cream">
          <button aria-label="Search" className="opacity-80 hover:opacity-100 transition-opacity">
            <Search className="h-4 w-4" />
          </button>
          <button aria-label="Account" className="opacity-80 hover:opacity-100 transition-opacity hidden sm:inline-flex">
            <User className="h-4 w-4" />
          </button>
          <Link to="/cart" aria-label="Bag" className="relative opacity-90 hover:opacity-100 transition-opacity">
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
  );
};

export default Header;
