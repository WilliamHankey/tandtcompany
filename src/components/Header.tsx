import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Our Story" },
  { to: "/shop", label: "Shop" },
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

  const onHome = pathname === "/";
  const transparent = onHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        transparent
          ? "bg-transparent text-cream"
          : "bg-background/85 backdrop-blur-md text-foreground border-b border-border/60"
      )}
    >
      <div className="container-prose flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-serif text-lg md:text-xl tracking-[0.2em]">
          T <span className="text-accent">&amp;</span> T
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.22em]">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn("link-underline transition-opacity", isActive ? "opacity-100" : "opacity-70 hover:opacity-100")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/cart" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] link-underline">
          <ShoppingBag className="h-4 w-4" />
          <span>Bag {count > 0 && <span className="text-accent">({count})</span>}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
