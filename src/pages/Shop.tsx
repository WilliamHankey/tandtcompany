import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

import rackHero from "@/assets/shop-hero-rack.jpg";
import teeFolded from "@/assets/product-tee-folded.jpg";
import capImg from "@/assets/product-cap.jpg";
import hoodieImg from "@/assets/product-hoodie.jpg";
import journalImg from "@/assets/product-journal.jpg";
import mugImg from "@/assets/product-mug.jpg";
import bandImg from "@/assets/product-band.jpg";
import keychainImg from "@/assets/product-keychain.jpg";
import bucketFaith from "@/assets/product-bucket-faith.jpg";
import bucketHope from "@/assets/product-bucket-hope.jpg";
import crewFaith from "@/assets/product-crew-faith.jpg";
import giftbox from "@/assets/product-giftbox.jpg";

const heroSlides = [
  { src: rackHero, alt: "T AND T cream tee on rack" },
  { src: teeFolded, alt: "Folded navy essential tee" },
  { src: capImg, alt: "Emblem cap" },
  { src: hoodieImg, alt: "Atelier hoodie" },
  { src: journalImg, alt: "Gilded journal" },
];

type Category = "All" | "Apparel" | "Accessories" | "Lifestyle";

type DisplayItem = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  category: Category;
  badge?: string;
  full?: typeof products[number];
};

const baseProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

const collection: DisplayItem[] = [
  { slug: "essential-tee-navy", name: "The Essential Tee", tagline: "Cut for stillness. Made for movement.", price: 549, image: teeFolded, category: "Apparel", badge: "BEST SELLER", full: baseProductBySlug("essential-tee-navy") },
  { slug: "atelier-hoodie-cream", name: "Atelier Hoodie", tagline: "Warmth with weight.", price: 1299, image: hoodieImg, category: "Apparel", full: baseProductBySlug("atelier-hoodie-cream") },
  { slug: "emblem-cap", name: "Emblem Cap", tagline: "A small mark. A steady centre.", price: 399, image: capImg, category: "Accessories", full: baseProductBySlug("emblem-cap") },
  { slug: "gilded-journal", name: "The Gilded Journal", tagline: "Pages for what matters.", price: 449, image: journalImg, category: "Lifestyle", badge: "NEW", full: baseProductBySlug("gilded-journal") },
  { slug: "essential-tee-navy", name: "Faith Crew", tagline: "Soft cotton, heavy meaning.", price: 1499, image: crewFaith, category: "Apparel" },
  { slug: "emblem-cap", name: "Foundation Bucket", tagline: "A staple built for lasting faith.", price: 699, image: bucketFaith, category: "Accessories" },
  { slug: "emblem-cap", name: "Hope Bucket", tagline: "Soft cotton, heavy meaning.", price: 699, image: bucketHope, category: "Accessories" },
  { slug: "gilded-journal", name: "Pray Wait Trust Box", tagline: "Curated for the steady journey.", price: 899, image: giftbox, category: "Lifestyle", badge: "LIMITED" },
  { slug: "essential-tee-navy", name: "Purpose Mug", tagline: "Mornings made meaningful.", price: 249, image: mugImg, category: "Lifestyle" },
  { slug: "emblem-cap", name: "Legacy Bands", tagline: "An outer shell for inner strength.", price: 399, image: bandImg, category: "Accessories" },
  { slug: "emblem-cap", name: "Cross Keychain Set", tagline: "Tailored for the steady path.", price: 449, image: keychainImg, category: "Accessories" },
];

const categories: Category[] = ["All", "Apparel", "Accessories", "Lifestyle"];
type Sort = "Featured" | "Price: Low to High" | "Price: High to Low";
const sortOptions: Sort[] = ["Featured", "Price: Low to High", "Price: High to Low"];

const Shop = () => {
  const [active, setActive] = useState(0);
  const [cat, setCat] = useState<Category>("All");
  const [sort, setSort] = useState<Sort>("Featured");

  const filtered = useMemo(() => {
    let list = cat === "All" ? collection : collection.filter((p) => p.category === cat);
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [cat, sort]);

  return (
    <Layout>
      {/* HERO with carousel */}
      <section className="relative bg-navy-deep text-cream pt-20">
        <div className="relative h-[58vh] md:h-[68vh] overflow-hidden">
          {heroSlides.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-out ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-transparent to-navy-deep/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,hsl(var(--navy-deep))_100%)]" />

          {/* Hero copy overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-prose text-cream">
              <p className="eyebrow !text-gold">The Collection</p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mt-4 leading-[1.05] max-w-2xl text-balance">
                Crafted for a meaningful journey.
              </h1>
              <p className="mt-5 text-cream/75 max-w-md leading-relaxed">
                Premium pieces, ready to ship across South Africa. Quiet design. Quality you can feel.
              </p>
            </div>
          </div>
        </div>

        <div className="container-prose -mt-24 md:-mt-28 relative z-10 pb-16">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5">
            {heroSlides.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setActive(i)}
                aria-label={`Show ${s.alt}`}
                className={`group aspect-[4/3] overflow-hidden bg-navy border transition-all duration-500 ${
                  i === active
                    ? "border-gold shadow-elegant scale-[1.02]"
                    : "border-cream/15 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={s.src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
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
            {sortOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="container-prose pt-12 pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-10">
          {filtered.map((p, i) => (
            <ProductCard
              key={`${p.slug}-${i}`}
              product={{ slug: p.slug, name: p.name, price: p.price, image: p.image, tagline: p.tagline, badge: p.badge }}
              full={p.full}
            />
          ))}
        </div>
      </section>

      {/* QUOTE BAND */}
      <section className="bg-navy-deep text-cream">
        <div className="container-prose py-24 md:py-28 text-center">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed max-w-3xl mx-auto text-balance">
            "Luxury is not in the excess, but in the truth of the craftsmanship and the weight of
            the message behind it."
          </p>
          <div className="hairline mt-10 mx-auto bg-gold" />
          <p className="eyebrow mt-6 !text-gold">Founder's Note</p>
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
