import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { imageUrl } from "./sanity";
import type { Product } from "@/types/product";

type SanityProductRaw = {
  _id?: string;
  id?: string;
  slug?: string;
  name?: string;
  title?: string;
  price?: number;
  sale?: {
    enabled?: boolean;
    discountPercent?: number;
    startsAt?: string;
    endsAt?: string;
  };
  tagline?: string | null;
  description?: string | null;
  meaning?: string | null;
  details?: string[] | null;
  image?: SanityImageSource | string | null;
  gallery?: SanityImageSource[] | null;
  badge?: string | null;
  category?: string | null;
  featured?: boolean;
  inStock?: boolean;
};

const safeImageUrl = (image?: SanityImageSource | string | null) => {
  try {
    if (!image) return "";
    if (typeof image === "string") return image;
    return imageUrl(image, 1200);
  } catch {
    return "";
  }
};

export function mapSanityProduct(raw: SanityProductRaw): Product {
  const now = new Date();

  const saleStarts = raw.sale?.startsAt ? new Date(raw.sale.startsAt) : null;
  const saleEnds = raw.sale?.endsAt ? new Date(raw.sale.endsAt) : null;

  const originalPrice = raw.price ?? 0;

  const isSaleActive =
    Boolean(raw.sale?.enabled) &&
    typeof raw.sale?.discountPercent === "number" &&
    raw.sale.discountPercent > 0 &&
    (!saleStarts || now >= saleStarts) &&
    (!saleEnds || now <= saleEnds);

  const salePrice = isSaleActive
    ? Math.round(originalPrice * (1 - raw.sale!.discountPercent! / 100))
    : undefined;

  return {
    id: raw.id || raw._id || "",
    slug: raw.slug || "",
    name: raw.name || raw.title || "Untitled product",
    price: salePrice ?? originalPrice,
    originalPrice,
    salePrice,
    isOnSale: isSaleActive,
    sale: raw.sale,
    image: safeImageUrl(raw.image),
    gallery: raw.gallery?.map(safeImageUrl).filter(Boolean) || [],
    tagline: raw.tagline || "",
    description: raw.description || "",
    meaning: raw.meaning || "",
    details: raw.details || [],
    badge: raw.badge || undefined,
    category: raw.category || "",
    featured: Boolean(raw.featured),
    inStock: raw.inStock !== false,
  };
}