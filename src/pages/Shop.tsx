import { Link } from "react-router-dom";
import { useState } from "react";
import Layout from "@/components/Layout";
import { formatZAR } from "@/data/products";
import { ArrowRight } from "lucide-react";

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

type Item = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  badge?: string;
};

const collection: Item[] = [
  { slug: "essential-tee-navy", name: "The Purpose Tee", tagline: "Crafted for a meaningful journey.", price: 1299, image: mugImg, badge: "LIMITED" },
  { slug: "atelier-hoodie-cream", name: "Refined Hoodie", tagline: "Weighted with intention and warmth.", price: 2599, image: crewFaith },
  { slug: "essential-tee-navy", name: "Legacy Bands", tagline: "An outer shell for inner strength.", price: 399, image: bandImg },
  { slug: "emblem-cap", name: "Cross Keychain Set", tagline: "Tailored for the steady path.", price: 449, image: keychainImg },
  { slug: "emblem-cap", name: "Foundation Bucket", tagline: "A staple built for lasting faith.", price: 699, image: bucketFaith, badge: "BEST SELLER" },
  { slug: "emblem-cap", name: "Hope Bucket", tagline: "Soft cotton, heavy meaning.", price: 699, image: bucketHope },
  { slug: "essential-tee-navy", name: "Faith Crew", tagline: "Soft cotton, heavy meaning.", price: 1499, image: teeFolded },
  { slug: "gilded-journal", name: "Pray Wait Trust Box", tagline: "Soft silk, heavy meaning.", price: 899, image: giftbox },
];

const Shop = () => {
  const [active, setActive] = useState(0);

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
          {/* Vignette so elements work together with surrounding navy */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-transparent to-navy-deep/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,hsl(var(--navy-deep))_100%)]" />
        </div>

        {/* Thumbnail strip overlapping */}
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

      {/* COLLECTION INTRO */}
      <section className="container-prose pt-20 md:pt-28 pb-12 text-center">
        <p className="eyebrow">The Collection</p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mt-5">
          Crafted for a Meaningful Journey
        </h1>
        <div className="hairline mt-6 mx-auto" />
        <p className="mt-8 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
          T AND T COMPANY was founded on the principle that what we wear should reflect the depth of
          our walk. Each piece in this collection is designed with intentionality — a quiet
          testament to faith and purpose. We move away from the noise of trend, choosing instead the
          refined silence of premium materials and subtle messaging that resonates with the soul.
        </p>
      </section>

      {/* PRODUCT GRID */}
      <section className="container-prose pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 md:gap-x-10">
          {collection.map((p, i) => (
            <Link key={i} to={`/shop/${p.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden bg-secondary">
                {p.badge && (
                  <span className="absolute top-3 right-3 z-10 bg-gold text-navy-deep text-[0.6rem] tracking-[0.2em] uppercase px-2.5 py-1 font-medium">
                    {p.badge}
                  </span>
                )}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-xl text-navy-deep">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm tabular-nums text-foreground">{formatZAR(p.price)}</span>
                  <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.22em] text-gold link-underline">
                    View details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* QUOTE BAND */}
      <section className="bg-navy-deep text-cream">
        <div className="container-prose py-24 md:py-32 text-center">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed max-w-3xl mx-auto text-balance">
            "Luxury is not in the excess, but in the truth of the craftsmanship and the weight of
            the message behind it."
          </p>
          <div className="hairline mt-10 mx-auto bg-gold" />
          <p className="eyebrow mt-6 !text-gold">Founder's Note</p>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
