import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { products, formatZAR } from "@/data/products";
import hero from "@/assets/hero.jpg";
import founders from "@/assets/founders.jpg";

const Home = () => (
  <Layout>
    {/* HERO */}
    <section className="relative min-h-screen flex items-end overflow-hidden bg-navy-deep">
      <img
        src={hero}
        alt="A figure in deep navy, lit by warm window light"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-navy-deep/30" />
      <div className="relative container-prose pb-24 md:pb-32 pt-32 text-cream animate-fade-up">
        <div className="hairline mb-8" />
        <p className="eyebrow mb-6">T &amp; T Company</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-3xl">
          Faith. <em className="text-gold-soft not-italic">Purpose.</em> Style.
        </h1>
        <p className="mt-8 max-w-md text-cream/75 leading-relaxed">
          A quiet brand for those building something that lasts. Crafted with intention, worn with conviction.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild variant="hero" size="lg"><Link to="/shop">Explore the Collection</Link></Button>
          <Button asChild variant="outlineCream" size="lg"><Link to="/about">Our Story</Link></Button>
        </div>
      </div>
    </section>

    {/* STATEMENT */}
    <section className="container-prose py-28 md:py-40">
      <div className="grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-4">
          <p className="eyebrow">Our Why</p>
          <div className="hairline mt-4" />
        </div>
        <div className="md:col-span-8">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-balance">
            We believe craft is a quiet form of devotion — that what you wear can carry meaning without saying a word.
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
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="eyebrow">The Collection</p>
            <h3 className="font-serif text-4xl md:text-5xl mt-3">Considered essentials</h3>
          </div>
          <Link to="/shop" className="hidden md:inline-block text-xs uppercase tracking-[0.22em] link-underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {products.map((p) => (
            <Link key={p.id} to={`/shop/${p.slug}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-2">
                <h4 className="font-serif text-lg leading-tight">{p.name}</h4>
                <span className="text-sm text-muted-foreground tabular-nums">{formatZAR(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* FOUNDERS TEASE */}
    <section className="container-prose py-28 md:py-40 grid md:grid-cols-2 gap-16 items-center">
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
  </Layout>
);

export default Home;
