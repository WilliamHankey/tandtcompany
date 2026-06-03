import type { Product } from "@/types/product";

// Static fallbacks when Sanity is not configured or empty
import teeImg from "@/assets/product-tee.jpg";
import capImg from "@/assets/product-cap.jpg";
import hoodieImg from "@/assets/product-hoodie.jpg";
import journalImg from "@/assets/product-journal.jpg";

export const products: Product[] = [
  {
    id: "tee-navy",
    slug: "essential-tee-navy",
    name: "The Essential Tee — Navy",
    price: 549,
    image: teeImg,
    tagline: "Cut for stillness. Made for movement.",
    description:
      "A heavyweight cotton tee in deep navy. Quiet construction, considered fit, made to be worn for years.",
    meaning:
      "A reminder that integrity is built in the unseen seams — what holds, holds quietly.",
    details: ["240 GSM combed cotton", "Reinforced collar", "Pre-shrunk", "Ethically produced"],
    category: "Apparel",
    badge: "BEST SELLER",
    featured: true,
  },
  {
    id: "cap-emblem",
    slug: "emblem-cap",
    name: "Emblem Cap",
    price: 399,
    image: capImg,
    tagline: "A small mark. A steady centre.",
    description: "Six-panel cotton twill cap in navy, finished with a subtle gold emblem.",
    meaning: "A quiet anchor for the day ahead.",
    details: ["100% brushed cotton twill", "Gold thread emblem", "Adjustable strap"],
    category: "Accessories",
  },
  {
    id: "hoodie-cream",
    slug: "atelier-hoodie-cream",
    name: "Atelier Hoodie — Cream",
    price: 1299,
    image: hoodieImg,
    tagline: "Warmth with weight.",
    description:
      "A boxy, oversized hoodie in heavyweight loop-back cotton. Soft hand, structured silhouette.",
    meaning: "Comfort that does not ask for attention.",
    details: ["480 GSM French terry", "Boxy oversized fit", "Twin-needle stitched"],
    category: "Apparel",
    featured: true,
  },
  {
    id: "journal-gilded",
    slug: "gilded-journal",
    name: "The Gilded Journal",
    price: 449,
    image: journalImg,
    tagline: "Pages for what matters.",
    description: "Full-grain leather journal with gold-foil emblem. Lay-flat binding, 192 cream pages.",
    meaning: "A space to slow down — to write, pray, plan, remember.",
    details: ["Full-grain leather", "Smyth-sewn binding", "Ribbon marker"],
    category: "Lifestyle",
    badge: "NEW",
    featured: true,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
