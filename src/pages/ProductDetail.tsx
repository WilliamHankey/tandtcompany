import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { formatZAR } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useProduct, useResolvedProducts } from "@/hooks/useSanityContent";
import { toast } from "sonner";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck, Star } from "lucide-react";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const { products: allProducts } = useResolvedProducts();

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [product?.image]);

  const galleryImages = useMemo(() => {
    if (!product?.gallery) return [];
    return product.gallery.filter(Boolean);
  }, [product?.gallery]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container-prose pt-40 pb-32 text-center">Loading…</div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-prose pt-40 pb-32 text-center">
          <h1 className="font-serif text-3xl">Piece not found</h1>
          <Button asChild variant="navy" className="mt-8">
            <Link to="/shop">Back to shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const mainImage = selectedImage || product.image;

  return (
    <Layout>
      <section className="container-prose pt-28 md:pt-36 pb-24 grid lg:grid-cols-2 gap-10 lg:gap-20">
        <div className="space-y-4">
          <div className="relative overflow-hidden bg-secondary aspect-square">
            <span className="absolute left-4 top-4 z-10 bg-gold px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-navy-deep">
              Limited Release
            </span>

            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {galleryImages.length > 0 && (
            <div
              className={
                galleryImages.length === 1
                  ? "grid grid-cols-1 gap-3"
                  : galleryImages.length === 2
                    ? "grid grid-cols-2 gap-3"
                    : "grid grid-cols-3 gap-3"
              }
            >
              {galleryImages.slice(0, 3).map((image: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square overflow-hidden border transition ${
                    mainImage === image ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            ← The Collection
          </Link>

          <h1 className="mt-5 font-serif text-4xl md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-3 italic text-muted-foreground">{product.tagline}</p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">128 reviews</span>
          </div>

          <div className="mt-7 flex items-baseline gap-3">
            <p className="font-serif text-3xl text-gold">
              {formatZAR(product.price)}
            </p>

            {product.isOnSale && product.originalPrice && (
              <p className="text-lg text-muted-foreground line-through">
                {formatZAR(product.originalPrice)}
              </p>
            )}

            {product.isOnSale && (
              <span className="bg-gold text-navy-deep px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                Sale
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            Tax included. Shipping calculated at checkout.
          </p>

          <p className="mt-8 leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <div className="mt-10 border-l-2 border-gold pl-5">
            <p className="eyebrow mb-3">The Meaning</p>
            <p className="italic font-serif text-lg">{product.meaning}</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <div className="flex border border-border h-14">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-14 grid place-items-center"
              >
                <Minus size={16} />
              </button>

              <div className="w-14 grid place-items-center">{qty}</div>

              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-14 grid place-items-center"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button
              variant="navy"
              size="lg"
              className="w-full"
              onClick={() => {
                add(product, qty);
                toast.success("Added to bag", { description: product.name });
              }}
            >
              Add to Bag · {formatZAR(product.price * qty)}
            </Button>
          </div>

          <Button
            variant="gold"
            size="lg"
            className="mt-3 w-full"
            onClick={() => {
              add(product, qty);
              navigate("/checkout");
            }}
          >
            Buy It Now
          </Button>

          <div className="mt-10 grid grid-cols-3 gap-5 py-8 border-y">
            <div className="text-center">
              <Truck className="mx-auto h-5 w-5 text-gold mb-2" />
              <p className="text-[10px] uppercase">Free Over R1000</p>
            </div>

            <div className="text-center">
              <RotateCcw className="mx-auto h-5 w-5 text-gold mb-2" />
              <p className="text-[10px] uppercase">14 Day Returns</p>
            </div>

            <div className="text-center">
              <ShieldCheck className="mx-auto h-5 w-5 text-gold mb-2" />
              <p className="text-[10px] uppercase">Secure Checkout</p>
            </div>
          </div>

          <div className="mt-10">
            <p className="eyebrow mb-4">Details</p>

            <ul className="space-y-3">
              {product.details?.map((d: string) => (
                <li key={d} className="flex gap-3 text-muted-foreground">
                  <span>—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-prose pb-40">
        <p className="eyebrow">You may also like</p>

        <h2 className="font-serif text-3xl mt-3 mb-10">
          Pieces in the same spirit
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts
            .filter((p) => p.slug !== product.slug)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} full={p} />
            ))}
        </div>
      </section>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream border-t p-3">
        <Button
          variant="navy"
          className="w-full"
          onClick={() => {
            add(product, qty);
            toast.success("Added to bag");
          }}
        >
          Add To Bag · {formatZAR(product.price * qty)}
        </Button>
      </div>
    </Layout>
  );
};

export default ProductDetail;
