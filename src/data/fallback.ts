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
    materials: "100% combed cotton, 240 GSM heavyweight jersey. Pre-shrunk for consistent fit.",
    careInstructions: "Machine wash cold with similar colours. Do not bleach. Tumble dry low or hang to dry. Iron on medium heat. Do not dry clean.",
    sku: "TT-TEE-001-NV",
    sizes: [
      { label: "XS", inStock: true, stock: 10 },
      { label: "S", inStock: true, stock: 15 },
      { label: "M", inStock: true, stock: 20 },
      { label: "L", inStock: true, stock: 18 },
      { label: "XL", inStock: true, stock: 12 },
      { label: "XXL", inStock: true, stock: 8 },
    ],
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
    materials: "100% brushed cotton twill. Gold thread embroidered emblem.",
    careInstructions: "Spot clean only. Do not machine wash. Air dry away from direct sunlight.",
    sku: "TT-CAP-001-NV",
    sizes: [
      { label: "One Size", inStock: true, stock: 25 },
    ],
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
    materials: "480 GSM French terry cotton. Loop-back interior for softness and warmth.",
    careInstructions: "Machine wash cold with similar colours. Do not bleach. Tumble dry low. Iron on low heat. Do not dry clean.",
    sku: "TT-HOD-001-CR",
    sizes: [
      { label: "S", inStock: true, stock: 10 },
      { label: "M", inStock: true, stock: 15 },
      { label: "L", inStock: true, stock: 12 },
      { label: "XL", inStock: true, stock: 8 },
      { label: "XXL", inStock: true, stock: 5 },
    ],
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
    materials: "Full-grain leather cover. 192 pages of acid-free cream paper (80 GSM). Smyth-sewn binding.",
    careInstructions: "Wipe clean with a soft, dry cloth. Store in a cool, dry place away from direct sunlight.",
    sku: "TT-LIF-001-GL",
    sizes: [
      { label: "One Size", inStock: true, stock: 20 },
    ],
    category: "Lifestyle",
    badge: "NEW",
    featured: true,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
