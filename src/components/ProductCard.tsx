import { Link } from "react-router-dom";
import { Product, formatZAR } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";

type Props = {
  product: Pick<
    Product,
    "slug" | "name" | "price" | "image" | "originalPrice" | "isOnSale"
  > & {
    tagline?: string;
    badge?: string;
  };
  full?: Product; // pass full product for add-to-cart, optional
};

const ProductCard = ({ product, full }: Props) => {
  const { add } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!full) return;
    add(full, 1);
    toast.success("Added to bag", { description: full.name });
  };

  return (
    <Link to={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-cream/95 text-navy-deep text-[0.6rem] tracking-[0.2em] uppercase px-2.5 py-1 font-medium">
            {product.badge}
          </span>
        )}
        {product.isOnSale && (
          <span className="absolute top-3 right-3 z-10 bg-gold text-navy-deep text-[0.6rem] tracking-[0.2em] uppercase px-2.5 py-1 font-medium">
            Sale
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />
        {full && (
          <button
            onClick={handleAdd}
            className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-navy-deep text-cream text-[0.7rem] uppercase tracking-[0.22em] py-3 flex items-center justify-center gap-2 hover:bg-gold hover:text-navy-deep"
            aria-label={`Quick add ${full.name}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Quick add
          </button>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h4 className="font-serif text-lg leading-tight">{product.name}</h4>
          {product.tagline && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {product.tagline}
            </p>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p className="font-serif text-gold">{formatZAR(product.price)}</p>

          {product.isOnSale && product.originalPrice && (
            <p className="text-xs text-muted-foreground line-through">
              {formatZAR(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
