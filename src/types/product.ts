export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  gallery?: string[];
  tagline: string;
  description: string;
  meaning: string;
  details: string[];
  badge?: string;
  category?: string;
  featured?: boolean;
  inStock?: boolean;
};

export const formatZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
