import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import TrustStrip from "@/components/TrustStrip";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import { products } from "@/data/products";
import hero from "@/assets/hero.jpg";
import founders from "@/assets/founders.jpg";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Naledi M.", text: "The fabric, the cut, the meaning behind it — every detail feels considered. Worth every rand.", piece: "Atelier Hoodie" },
  { name: "Sipho K.", text: "I bought the tee for myself and ended up gifting two more. Quiet luxury that actually means something.", piece: "Essential Tee" },
  { name: "Lerato D.", text: "Shipping was fast, packaging was beautiful. Feels like a brand that respects its customers.", piece: "Gilded Journal" },
];

const Home = () => (
  <Layout>
    {/* HERO */}
    <section className="relative min-h-screen flex items-end overflow-hidden bg-navy-deep">
      <img
        src={hero}
        alt="A figure in deep navy, lit by warm window light"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-navy-deep/30" />
      <div className="relative container-prose pb-24 md:pb-32 pt-32 text-cream animate-fade-up">
        <div className="hairline mb-8" />
        <p className="eyebrow mb-6">T &amp; T Company · New Season</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-3xl">
          Faith. <em className="text-gold-soft not-italic">Purpose.</em> Style.
        </h1>
        <p className="mt-8 max-w-md text-cream/80 leading-relaxed">
          Premium pieces, made with intention. Now shipping across South Africa — direct to your door, with care.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild variant="hero" size="lg"><Link to="/shop">Shop the Collection</Link></Button>
          <Button asChild variant="outlineCream" size="lg"><Link to="/about">Our Story</Link></Button>
        </div>
        <div className="mt-10 flex items-center gap-6 text-cream/70 text-xs uppercase tracking-[0.22em]">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
          </div>
          <span>Loved by 1 200+ customers</span>
        </div>
      </div>
    </section>

    {/* TRUST STRIP */}
    <TrustStrip />

    {/* STATEMENT */}
    <section className="container-prose py-24 md:py-32">
      <div className="grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-4">
          <p className="eyebrow">Our Why</p>
          <div className="hairline mt-4" />
        </div>
        <div className="md:col-span-8">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-balance">
            Craft is a quiet form of devotion. What you wear can carry meaning without saying a word.
          </h2>
          <p className="mt-8 text-muted-foreground max-w-2xl leading-relaxed">
            T AND T Company was founded by Tersha &amp; Tyrone as an answer to noise. Pieces designed to be worn for years, not seasons. Rooted in faith. Open to all.
          </p>
        </div>
      </div>
    </section>

    {/* FEATURED PRODUCTS */}
    <section className="bg-secondary/50 py-24 md:py-32">
      <div className="container-prose">
        <div className="flex items-end justify-between mb-14 gap-6">
          <div>
            <p className="eyebrow">The Collection</p>
            <h3 className="font-serif text-4xl md:text-5xl mt-3">Considered essentials</h3>
            <p className="mt-3 text-muted-foreground max-w-md">Hand-picked pieces, ready to ship. Quick add — straight to your bag.</p>
          </div>
          <Link to="/shop" className="hidden md:inline-block text-xs uppercase tracking-[0.22em] link-underline shrink-0">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} full={p} />
          ))}
        </div>
        <div className="mt-12 text-center md:hidden">
          <Button asChild variant="navy" size="lg"><Link to="/shop">View all pieces</Link></Button>
        </div>
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="container-prose py-24 md:py-32">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <p className="eyebrow">Worn With Conviction</p>
        <h3 className="font-serif text-3xl md:text-5xl mt-4">From our community</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <figure key={t.name} className="bg-secondary/40 p-8 border border-border relative">
            <Quote className="h-6 w-6 text-gold/60 absolute top-6 right-6" />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
            </div>
            <blockquote className="font-serif text-lg leading-relaxed text-foreground/85">"{t.text}"</blockquote>
            <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t.name} · <span className="text-gold">{t.piece}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>

    {/* FOUNDERS TEASE */}
    <section className="container-prose pb-24 md:pb-32 grid md:grid-cols-2 gap-16 items-center">
      <div className="aspect-[4/5] overflow-hidden">
        <img src={founders} alt="The founders, Tersha and Tyrone" loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="eyebrow">Founders</p>
        <h3 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">Tersha &amp; Tyrone</h3>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          A husband-and-wife studio building a brand around the things they couldn't find — pieces that feel honest, that age beautifully, that mean something.
        </p>
        <Button asChild variant="outlineNavy" size="lg" className="mt-10"><Link to="/about">Read our story</Link></Button>
      </div>
    </section>

    {/* NEWSLETTER CTA */}
    <section className="bg-navy-deep text-cream">
      <div className="container-prose py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="eyebrow !text-gold">The Inner Circle</p>
          <h3 className="font-serif text-3xl md:text-5xl mt-4 leading-tight">
            10% off your first order.
          </h3>
          <p className="mt-4 text-cream/70 max-w-md">
            Join our list for early access to drops, founder notes, and quiet moments worth keeping.
          </p>
        </div>
        <div>
          <Newsletter variant="dark" />
          <p className="mt-3 text-[0.7rem] text-cream/50">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Home;
