import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ProductSchema } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { formatZAR } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useProduct, useResolvedProducts } from "@/hooks/useSanityContent";
import { toast } from "sonner";
import { Minus, Plus, Truck, RotateCcw, ShieldCheck, Package, Shirt } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const { products: allProducts } = useResolvedProducts();

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const { add } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [product?.image]);

  useEffect(() => {
    if (product?.sizes?.length && !selectedSize) {
      const inStock = product.sizes.find((s) => s.inStock);
      if (inStock) setSelectedSize(inStock.label);
    }
  }, [product?.sizes, selectedSize]);

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
  const hasSizes = product.sizes && product.sizes.length > 0;
  const productUrl = `${SITE_URL}/shop/${product.slug}`;
  const inStock = product.inStock !== false;

  return (
    <Layout>
      <SEO
        title={product.name}
        description={product.tagline || product.description?.slice(0, 160)}
        canonical={productUrl}
        ogImage={product.image}
        ogType="product"
      />
      <ProductSchema
        name={product.name}
        description={product.description || product.tagline || ""}
        image={product.image}
        sku={product.sku || product._id}
        price={product.price}
        url={productUrl}
        availability={inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: product.name, url: `/shop/${product.slug}` },
        ]}
      />
      <section className="container-prose pb-24 grid lg:grid-cols-2 gap-10 lg:gap-20">
        <div className="space-y-4">
          <div className="relative overflow-hidden bg-secondary aspect-square">
            {product.badge && (
              <span className="absolute left-4 top-4 z-10 bg-gold px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-navy-deep">
                {product.badge}
              </span>
            )}

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

          <div className="mt-5 flex items-baseline gap-3">
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
            Prices in South African rand. Delivery calculated at checkout.
          </p>

          <p className="mt-8 leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <div className="mt-10 border-l-2 border-gold pl-5">
            <p className="eyebrow mb-3">The Meaning</p>
            <p className="italic font-serif text-lg">{product.meaning}</p>
          </div>

          {/* Sizes */}
          {hasSizes && (
            <div className="mt-10">
              <p className="eyebrow mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes!.map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    disabled={!size.inStock}
                    onClick={() => setSelectedSize(size.label)}
                    className={`px-4 py-2 border text-sm font-medium transition ${
                      selectedSize === size.label
                        ? "border-gold bg-gold text-navy-deep"
                        : size.inStock
                          ? "border-border hover:border-navy"
                          : "border-border opacity-40 cursor-not-allowed line-through"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              disabled={product.inStock === false}
              onClick={() => {
                add(product, qty, selectedSize || undefined);
                toast.success("Added to bag", { description: product.name });
              }}
            >
              {product.inStock === false ? "Out of Stock" : `Add to Bag · ${formatZAR(product.price * qty)}`}
            </Button>
          </div>

          <Button
            variant="gold"
            size="lg"
            className="mt-3 w-full"
            disabled={product.inStock === false}
            onClick={() => {
              add(product, qty, selectedSize || undefined);
              navigate("/checkout");
            }}
          >
            Buy It Now
          </Button>

          {/* Fulfilment info */}
          <div className="mt-8 bg-cream border border-border p-4 space-y-2 text-sm text-foreground/80">
            <p className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gold shrink-0" />
              <span>In stock and fulfilled from Cape Town.</span>
            </p>
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold shrink-0" />
              <span>Orders processed within 2–4 business days. Nationwide delivery 2–5 business days after dispatch.</span>
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gold shrink-0" />
              <span>30-day returns. Exchanges available for sizing — see our <Link to="/returns-policy" className="text-gold link-underline">Returns Policy</Link>.</span>
            </p>
          </div>

          {/* Product Details */}
          <div className="mt-10">
            <p className="eyebrow mb-4">Details</p>
            <ul className="space-y-3">
              {product.sku && (
                <li className="flex gap-3 text-muted-foreground text-sm">
                  <Package className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span>SKU: {product.sku}</span>
                </li>
              )}
              <li className="flex gap-3 text-muted-foreground text-sm">
                <ShieldCheck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>
                  Stock:{" "}
                  {product.inStock === false ? (
                    <span className="text-red-600">Out of Stock</span>
                  ) : (
                    <span className="text-green-700">In Stock</span>
                  )}
                </span>
              </li>
              {product.details?.map((d: string) => (
                <li key={d} className="flex gap-3 text-muted-foreground text-sm">
                  <span className="text-gold">—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          {product.materials && (
            <div className="mt-8">
              <p className="eyebrow mb-3">Materials</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{product.materials}</p>
            </div>
          )}

          {/* Care Instructions */}
          {product.careInstructions && (
            <div className="mt-8">
              <p className="eyebrow mb-3">Care Instructions</p>
              <div className="flex items-start gap-3 bg-cream border border-border p-4">
                <Shirt className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 leading-relaxed">{product.careInstructions}</p>
              </div>
            </div>
          )}
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
              <ProductCard key={p._id} product={p} full={p} />
            ))}
        </div>
      </section>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream border-t p-3">
        <Button
          variant="navy"
          className="w-full"
          disabled={product.inStock === false}
          onClick={() => {
            add(product, qty, selectedSize || undefined);
            toast.success("Added to bag");
          }}
        >
          {product.inStock === false ? "Out of Stock" : `Add To Bag · ${formatZAR(product.price * qty)}`}
        </Button>
      </div>
    </Layout>
  );
};

export default ProductDetail;
