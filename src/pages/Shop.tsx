import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useShopPage, useResolvedProducts } from "@/hooks/useSanityContent";
import { imageUrl } from "@/lib/sanity";
import rackHero from "@/assets/shop-hero-rack.png";

type Category = "All" | "Apparel" | "Accessories" | "Lifestyle";
type Sort = "Featured" | "Price: Low to High" | "Price: High to Low";

const categories: Category[] = ["All", "Apparel", "Accessories", "Lifestyle"];
const sortOptions: Sort[] = ["Featured", "Price: Low to High", "Price: High to Low"];

const defaultSlides = [{ src: rackHero, alt: "T AND T collection on rack" }];

const Shop = () => {
  const { data: page } = useShopPage();
  const { products, isLoading } = useResolvedProducts();
  const [active, setActive] = useState(0);
  const [cat, setCat] = useState<Category>("All");
  const [sort, setSort] = useState<Sort>("Featured");

  const heroSlides = useMemo(() => {
    if (page?.heroSlides?.length) {
      return page.heroSlides.map((s: { image?: unknown; alt?: string }) => ({
        src: imageUrl(s.image, 1200),
        alt: s.alt || "",
      }));
    }
    return defaultSlides;
  }, [page]);

  const filtered = useMemo(() => {
    let list =
      cat === "All"
        ? products
        : products.filter((p) => (p.category || "Apparel") === cat);
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, cat, sort]);

  return (
    <Layout>
      <section className="relative bg-navy-deep text-cream pt-20">
        <div className="relative h-[58vh] md:h-[68vh] overflow-hidden">
          {heroSlides.map((s, i) => (
            <img
              key={`${s.src}-${i}`}
              src={s.src}
              alt={s.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-transparent to-navy-deep/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,hsl(var(--navy-deep))_100%)]" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-prose text-cream">
              <p className="eyebrow !text-gold">{page?.heroEyebrow || "The Collection"}</p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mt-4 leading-[1.05] max-w-2xl text-balance">
                {page?.heroHeadline || "Crafted for a meaningful journey."}
              </h1>
              <p className="mt-5 text-cream/75 max-w-md leading-relaxed">
                {page?.heroSubtext ||
                  "Premium pieces, ready to ship across South Africa. Quiet design. Quality you can feel."}
              </p>
            </div>
          </div>
        </div>

        <div className="container-prose -mt-24 md:-mt-28 relative z-10 pb-16">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5">
            {heroSlides.map((s, i) => (
              <button
                key={`thumb-${i}`}
                onClick={() => setActive(i)}
                aria-label={`Show ${s.alt}`}
                className={`group aspect-[4/3] overflow-hidden bg-navy border transition-all duration-500 ${
                  i === active
                    ? "border-gold shadow-elegant scale-[1.02]"
                    : "border-cream/15 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={s.src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-prose pt-12 pb-8 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 text-[0.7rem] uppercase tracking-[0.22em] transition-colors border ${
                cat === c
                  ? "bg-navy-deep text-cream border-navy-deep"
                  : "bg-transparent text-foreground/70 border-border hover:border-navy-deep"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{filtered.length} pieces</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="bg-transparent border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] focus:outline-none focus:border-navy-deep"
          >
            {sortOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="container-prose pt-12 pb-24">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-20">Loading collection…</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-10">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} full={p} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-navy-deep text-cream">
        <div className="container-prose py-24 md:py-28 text-center">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed max-w-3xl mx-auto text-balance">
            {page?.founderQuote?.quote ||
              '"Luxury is not in the excess, but in the truth of the craftsmanship and the weight of the message behind it."'}
          </p>
          <div className="hairline mt-10 mx-auto bg-gold" />
          <p className="eyebrow mt-6 !text-gold">
            {page?.founderQuote?.attribution || "Founder's Note"}
          </p>
          <Link
            to="/contact"
            className="inline-block mt-10 text-xs uppercase tracking-[0.22em] text-cream/80 link-underline"
          >
            Need help choosing? Chat with us →
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
