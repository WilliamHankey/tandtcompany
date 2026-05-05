import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getProduct, formatZAR, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const navigate = useNavigate();

  if (!product) {
    return (
      <Layout>
        <div className="container-prose pt-40 pb-32 text-center">
          <h1 className="font-serif text-3xl">Piece not found</h1>
          <Button asChild variant="navy" className="mt-8"><Link to="/shop">Back to shop</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-prose pt-32 pb-24 grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="aspect-[4/5] bg-muted overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:pt-8">
          <Link to="/shop" className="text-xs uppercase tracking-[0.22em] text-muted-foreground link-underline">
            ← The collection
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl mt-6 leading-tight">{product.name}</h1>
          <p className="mt-3 italic text-muted-foreground">{product.tagline}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
            </div>
            <span className="text-xs text-muted-foreground">128 reviews</span>
          </div>
          <p className="mt-6 text-2xl font-serif tabular-nums">{formatZAR(product.price)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Tax included. Shipping calculated at checkout.</p>

          <p className="mt-8 leading-relaxed text-foreground/85">{product.description}</p>

          <div className="mt-8 border-l-2 border-accent/60 pl-5">
            <p className="eyebrow mb-2">The meaning</p>
            <p className="font-serif text-lg italic text-foreground/80">{product.meaning}</p>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center border border-border">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-12 w-12 grid place-items-center hover:bg-secondary"
              ><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center tabular-nums">{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="h-12 w-12 grid place-items-center hover:bg-secondary"
              ><Plus className="h-4 w-4" /></button>
            </div>
            <Button
              variant="navy"
              size="lg"
              className="flex-1"
              onClick={() => {
                add(product, qty);
                toast.success("Added to bag", { description: product.name });
              }}
            >
              Add to bag · {formatZAR(product.price * qty)}
            </Button>
          </div>
          <Button
            variant="gold"
            size="lg"
            className="mt-3 w-full"
            onClick={() => { add(product, qty); navigate("/checkout"); }}
          >
            Buy it now
          </Button>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center border-y border-border py-5">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="h-4 w-4 text-gold" />
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Free over R1 000</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw className="h-4 w-4 text-gold" />
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">14-day returns</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Secure checkout</span>
            </div>
          </div>

          <div className="mt-10">
            <p className="eyebrow mb-4">Details</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {product.details.map((d) => (
                <li key={d} className="flex gap-3"><span className="text-accent">—</span>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* You may also like */}
      <section className="container-prose pb-32">
        <div className="mb-10">
          <p className="eyebrow">You may also like</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-3">Pieces in the same spirit</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {products.filter((p) => p.slug !== product.slug).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} full={p} />
          ))}
        </div>
      </section>

      {/* Sticky mobile buy bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream border-t border-border p-3 flex items-center gap-3 shadow-elegant">
        <div className="flex-1">
          <p className="font-serif text-sm leading-tight">{product.name}</p>
          <p className="text-xs tabular-nums text-muted-foreground">{formatZAR(product.price)}</p>
        </div>
        <Button
          variant="navy"
          size="default"
          onClick={() => {
            add(product, qty);
            toast.success("Added to bag", { description: product.name });
          }}
        >
          Add to bag
        </Button>
      </div>
    </Layout>
  );
};

export default ProductDetail;
