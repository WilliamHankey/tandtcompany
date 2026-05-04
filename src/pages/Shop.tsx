import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { products, formatZAR } from "@/data/products";

const Shop = () => (
  <Layout>
    <section className="container-prose pt-36 pb-12">
      <p className="eyebrow">The Shop</p>
      <div className="hairline mt-4 mb-6" />
      <h1 className="font-serif text-5xl md:text-6xl max-w-2xl">A small, considered collection.</h1>
      <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
        Each piece is made in limited quantities, designed to be worn and re-worn. No drops. No noise.
      </p>
    </section>

    <section className="container-prose pb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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
            <div className="mt-6">
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground italic">{p.tagline}</p>
              <p className="mt-3 text-sm tabular-nums">{formatZAR(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </Layout>
);

export default Shop;
