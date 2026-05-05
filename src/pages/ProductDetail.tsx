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
          <p className="mt-6 text-2xl font-serif tabular-nums">{formatZAR(product.price)}</p>

          <p className="mt-8 leading-relaxed text-foreground/85">{product.description}</p>

          <div className="mt-8 border-l-2 border-accent/60 pl-5">
            <p className="eyebrow mb-2">The meaning</p>
            <p className="font-serif text-lg italic text-foreground/80">{product.meaning}</p>
          </div>

          <div className="mt-10 flex items-center gap-6">
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
              Add to bag
            </Button>
          </div>
          <Button
            variant="outlineNavy"
            size="lg"
            className="mt-3 w-full"
            onClick={() => { add(product, qty); navigate("/cart"); }}
          >
            Buy now
          </Button>

          <div className="mt-14">
            <p className="eyebrow mb-4">Details</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {product.details.map((d) => (
                <li key={d} className="flex gap-3"><span className="text-accent">—</span>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
