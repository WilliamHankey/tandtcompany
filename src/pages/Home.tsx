import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import TrustStrip from "@/components/TrustStrip";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import {
  useHomePage,
  useTestimonials,
  useResolvedProducts,
} from "@/hooks/useSanityContent";
import { imageUrl } from "@/lib/sanity";
import heroFallback from "@/assets/hero.png";
const foundersFallback = "/assets/founders.png";
import { Star, Quote } from "lucide-react";

type HomePage = {
  featuredProducts?: any[];
  heroImage?: unknown;
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  heroSocialProof?: string;
  statementEyebrow?: string;
  statementHeadline?: string;
  statementBody?: string;
  collectionEyebrow?: string;
  collectionTitle?: string;
  collectionSubtext?: string;
  foundersTeaser?: {
    image?: unknown;
  };
};

type Testimonial = {
  name: string;
  quote?: string;
  text?: string;
  piece?: string;
  avatar?: unknown;
  rating?: number;
  testimonialType?: "text" | "tiktok" | "instagram";
  embedUrl?: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    name: "Naledi M.",
    text: "The fabric, the cut, the meaning behind it — every detail feels considered. Worth every rand.",
    piece: "Atelier Hoodie",
  },
  {
    name: "Sipho K.",
    text: "I bought the tee for myself and ended up gifting two more. Quiet luxury that actually means something.",
    piece: "Essential Tee",
  },
  {
    name: "Lerato D.",
    text: "Shipping was fast, packaging was beautiful. Feels like a brand that respects its customers.",
    piece: "Gilded Journal",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const Home = () => {
  const { data: homePageData } = useHomePage();
  const { data: rawTestimonials } = useTestimonials();

  const page = homePageData as HomePage | undefined;
  const testimonialData = rawTestimonials as Testimonial[] | undefined;
  const { products } = useResolvedProducts();
  const featured = page?.featuredProducts?.length
    ? page.featuredProducts
    : products.filter((p) => p.featured).length
      ? products.filter((p) => p.featured)
      : products;
  const testimonials = testimonialData?.length
    ? testimonialData
    : defaultTestimonials;
  const heroImg = page?.heroImage
    ? imageUrl(page.heroImage, 1600)
    : heroFallback;
  const foundersImg = page?.foundersTeaser?.image
    ? imageUrl(page.foundersTeaser.image, 900)
    : foundersFallback;

  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-navy-deep">
        <img
          src={heroImg}
          alt="A figure in deep navy, lit by warm window light"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-navy-deep/30" />
        <div className="relative px-6 pb-24 align-middle md:align-top md:pb-32 pt-12 text-cream animate-fade-up self-center">
          <div className="flex items-center gap-8 md:gap-12 text-cream">
            <div>
              <p className="eyebrow mb-6">
                {page?.heroEyebrow || "T & T Company · New Season"}
              </p>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-3xl">
                {page?.heroHeadline ? (
                  page.heroHeadline
                ) : (
                  <>
                    Faith.{" "}
                    <em className="text-gold-soft not-italic">Purpose.</em>{" "}
                    Style.
                  </>
                )}
              </h1>
              <p className="mt-8 max-w-md text-cream/80 leading-relaxed">
                {page?.heroSubtext ||
                  "Premium pieces, made with intention. Now shipping across South Africa — direct to your door, with care."}
              </p>
            </div>
            <div className="h-28 w-px bg-gold/50" />
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="hero" size="lg">
                <Link to="/shop">Shop the Collection</Link>
              </Button>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-6 text-cream/70 text-xs uppercase tracking-[0.22em]">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
            <span>{page?.heroSocialProof || "Loved by 1 200+ customers"}</span>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <TrustStrip />

      {/* STATEMENT */}
      {/* <section className="container-prose py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4">
            <p className="eyebrow">{page?.statementEyebrow || "Our Why"}</p>
            <div className="hairline mt-4" />
          </div>
          <div className="md:col-span-8">
            <h2 className="font-serif text-3xl md:text-5xl leading-tight text-balance">
              {page?.statementHeadline ||
                "Craft is a quiet form of devotion. What you wear can carry meaning without saying a word."}
            </h2>
            <p className="mt-8 text-muted-foreground max-w-2xl leading-relaxed">
              {page?.statementBody ||
                "T AND T Company was founded by Tersha & Tyrone as an answer to noise. Pieces designed to be worn for years, not seasons. Rooted in faith. Open to all."}
            </p>
          </div>
        </div>
      </section> */}

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-32">
        <div className="container-prose">
          <div className="flex items-end justify-between mb-14 gap-6">
            <div>
              <p className="eyebrow">
                {page?.collectionEyebrow || "The Collection"}
              </p>
              <h3 className="font-serif text-4xl md:text-5xl mt-3">
                {page?.collectionTitle || "Considered essentials"}
              </h3>
              <p className="mt-3 text-muted-foreground max-w-md">
                {page?.collectionSubtext ||
                  "Hand-picked pieces, ready to ship. Quick add — straight to your bag."}
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-block text-xs uppercase tracking-[0.22em] link-underline shrink-0"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} full={p} />
            ))}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Button asChild variant="navy" size="lg">
              <Link to="/shop">View all pieces</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* MORE THAN CLOTHING */}
      <section className=" container-prose py-24 md:py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="eyebrow !text-gold">Our Foundation</p>
          <h3 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">
            More Than Clothing
          </h3>
          <div className="hairline mt-8" />
        </div>
        <div className="md:col-span-7 space-y-6 text-foreground/85 leading-relaxed">
          <p className="font-serif text-xl text-navy italic">
            "We believe that what you wear should reflect the depth of your soul
            and the clarity of your calling."
          </p>
          <p>
            At T AND T COMPANY, we don't just design garments; we architect
            vessels of intentionality. Our brand is rooted in the belief that
            modern life deserves a spiritual anchor. Every fabric we use, every
            stitch we make, and every piece we craft is for those who walk
            through the world with grace and lead with unwavering purpose.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-border">
            <div>
              <p className="eyebrow !text-gold mb-2">Ethos</p>
              <p className="text-sm text-muted-foreground">
                Quiet conviction expressed in every prayer and stitch in
                excellence.
              </p>
            </div>
            <div>
              <p className="eyebrow !text-gold mb-2">Intention</p>
              <p className="text-sm text-muted-foreground">
                Every thread, cut, and label serves a higher narrative.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-[1.65fr_0.8fr] gap-8 lg:gap-12 items-stretch">
            {/* Image Card */}
            <div className="relative min-h-[520px] overflow-hidden shadow-elegant">
              <img
                src={foundersImg}
                alt="Tersha and Tyrone, the founders of T AND T COMPANY"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-cream/95 via-cream/70 to-transparent" />

              <div className="absolute left-8 bottom-8">
                <h3 className="font-serif text-2xl md:text-3xl text-navy">
                  Tersha & Tyrone
                </h3>
                <p className="eyebrow !text-gold mt-2">The Visionaries</p>
              </div>
            </div>

            {/* Text Card */}
            <div className="bg-secondary/60 px-8 py-14 md:px-12 lg:px-16 flex items-center">
              <div className="max-w-md">
                <p className="eyebrow !text-gold mb-6">Our Journey</p>

                <h3 className="font-serif text-3xl md:text-4xl leading-tight text-navy">
                  Rooted in Shared <br />
                  Purpose
                </h3>

                <p className="mt-8 text-foreground/75 leading-relaxed">
                  The journey of T AND T COMPANY began with a simple
                  conversation at the kitchen table about the lack of premium
                  apparel that represented our values without compromising on
                  modern aesthetic.
                </p>

                <blockquote className="mt-8 border-l-2 border-gold/40 pl-6 italic text-foreground/75 leading-relaxed">
                  "We wanted to build something that wouldn't just sit in a
                  closet, but would accompany a life well-lived in Christ."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVER THE COLLECTION CTA */}
      <section className="py-20 bg-navy-deep">
        <div className="max-w-xl mx-auto border border-gold/40 p-10 md:p-14 text-center">
          <p className=" text-cream">Curated for Purpose</p>
          <h3 className="font-serif text-3xl md:text-4xl text-cream/70 mt-4">
            Discover the Collection
          </h3>
          <Button
            asChild
            variant="outlineNavy"
            size="lg"
            className="mt-8 !border-gold !text-gold hover:!bg-gold hover:!text-cream"
          >
            <Link to="/shop">View All Products</Link>
          </Button>
        </div>
      </section>

      {/* QUALITY AS WORSHIP */}
      <section className="bg-secondary/40 py-24 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-16">
            <p className="eyebrow !text-gold">The Architecture of Craft</p>
            <h3 className="font-serif text-4xl md:text-5xl mt-4">
              Quality as Worship
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ul className="space-y-8">
              {[
                {
                  n: "01",
                  t: "Sourcing with Integrity",
                  d: "We hand-select materials that offer longevity and superior tactile experience. Every fabric must meet our rigorous standards for sustainability and ethical production.",
                },
                {
                  n: "02",
                  t: "Meticulous Craftsmanship",
                  d: "Our silhouettes are engineered for timelessness. We avoid fleeting trends, focusing instead on structural integrity and refined finishes that honor the wearer.",
                },
                {
                  n: "03",
                  t: "Considered Detail",
                  d: "From subtle emblems to gilded thread, every detail is a deliberate statement of reverence — quiet luxury that whispers rather than shouts.",
                },
              ].map((it) => (
                <li key={it.n} className="flex gap-5">
                  <span className="font-serif text-gold border border-gold/40 w-12 h-12 grid place-items-center shrink-0">
                    {it.n}
                  </span>
                  <div>
                    <p className="font-serif text-xl text-navy">{it.t}</p>
                    <p className="mt-2 text-sm text-foreground/75 leading-relaxed">
                      {it.d}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="aspect-square bg-navy-deep grid place-items-center shadow-elegant">
              <img
                src="/assets/brandmark.svg"
                alt="T AND T Company"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* KINGDOM COMMUNITY */}
      <section className="bg-cream py-24 md:py-28">
        <div className="container-prose text-center max-w-3xl">
          <h3 className="font-serif text-4xl md:text-5xl text-navy">
            A Kingdom Community
          </h3>
          <p className="mt-6 text-foreground/75 leading-relaxed">
            T AND T COMPANY is an open invitation. We serve a diverse, global
            community united by a desire to live out their faith with
            excellence. Our inclusivity is born from our conviction that every
            person is crafted with divine intention.
          </p>
          <div className="mt-14 grid sm:grid-cols-3 gap-10">
            {[
              { i: "✦", t: "Excellence" },
              { i: "♡", t: "Communion" },
              { i: "✧", t: "Unity" },
            ].map((p) => (
              <div key={p.t} className="flex flex-col items-center">
                <span className="text-gold text-2xl">{p.i}</span>
                <p className="eyebrow mt-4">{p.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-prose py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow">Worn With Conviction</p>
          <h3 className="font-serif text-3xl md:text-5xl mt-4">
            From our community
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-secondary/40 p-8 border border-border relative"
            >
              <Quote className="h-6 w-6 text-gold/60 absolute top-6 right-6" />

              <div className="flex items-center gap-4 mb-6">
                {t.avatar ? (
                  <img
                    src={t.avatar ? imageUrl(t.avatar, 160) : undefined}
                    alt={t.name}
                    className="h-12 w-12 rounded-full object-cover border border-gold/30"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-navy-deep text-cream grid place-items-center font-serif text-sm border border-gold/30">
                    {getInitials(t.name)}
                  </div>
                )}

                <div>
                  <p className="font-serif text-lg text-navy">{t.name}</p>
                  {t.piece && (
                    <p className="text-xs uppercase tracking-[0.18em] text-gold">
                      {t.piece}
                    </p>
                  )}
                </div>
              </div>

              {t.embedUrl ? (
                <div className="aspect-[9/16] w-full overflow-hidden bg-navy-deep">
                  <iframe
                    src={t.embedUrl}
                    title={`${t.name} testimonial`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              ) : (
                <>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-gold text-gold"
                      />
                    ))}
                  </div>

                  <blockquote className="font-serif text-lg leading-relaxed text-foreground/85">
                    "{t.quote || t.text}"
                  </blockquote>
                </>
              )}
            </figure>
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      {/* <section className="bg-navy-deep text-cream">
        <div className="container-prose py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow !text-gold">The Inner Circle</p>
            <h3 className="font-serif text-3xl md:text-5xl mt-4 leading-tight">
              10% off your first order.
            </h3>
            <p className="mt-4 text-cream/70 max-w-md">
              Join our list for early access to drops, founder notes, and quiet
              moments worth keeping.
            </p>
          </div>
          <div>
            <Newsletter variant="dark" />
            <p className="mt-3 text-[0.7rem] text-cream/50">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default Home;
