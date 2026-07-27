export type Product = {
  _id: string;
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  isOnSale?: boolean;
  sale?: {
    enabled?: boolean;
    discountPercent?: number;
    startsAt?: string;
    endsAt?: string;
  };
  image: string;
  gallery?: string[];
  tagline: string;
  description: string;
  meaning: string;
  details: string[];
  materials?: string;
  careInstructions?: string;
  sku?: string;
  sizes?: { label: string; inStock: boolean; stock?: number }[];
  badge?: string;
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  currency?: string;
};

export const formatZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
