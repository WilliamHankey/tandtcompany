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
  tagline?: string;
  description?: string;
  meaning?: string;
  details?: string[];
  image?: SanityImageSource | string;
  badge?: string;
  category?: string;
};

export function mapSanityProduct(raw: SanityProductRaw): Product {
  const img =
    typeof raw.image === "string"
      ? raw.image
      : raw.image
        ? imageUrl(raw.image, 900)
        : "";

  return {
    id: raw.id || raw._id || "",
    slug: raw.slug || "",
    name: raw.name || raw.title || "",
    price: raw.price ?? 0,
    image: img,
    tagline: raw.tagline || "",
    description: raw.description || "",
    meaning: raw.meaning || "",
    details: raw.details || [],
    badge: raw.badge || undefined,
    category: raw.category,
    featured: raw.featured,
    inStock: raw.inStock !== false,
  };
}
