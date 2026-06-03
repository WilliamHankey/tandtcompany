/**
 * Seeds Sanity with initial T & T Company content.
 * Requires SANITY_API_TOKEN (write) and SANITY_STUDIO_PROJECT_ID in ../.env
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../../.env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId || !token) {
  console.error("Set SANITY_STUDIO_PROJECT_ID and SANITY_API_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-05-22",
  token,
  useCdn: false,
});

const block = (text) => [
  {
    _type: "block",
    _key: Math.random().toString(36).slice(2),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "s1", text, marks: [] }],
  },
];

async function seed() {
  console.log("Seeding Sanity…");

  const categories = [
    { _id: "category-apparel", _type: "productCategory", title: "Apparel", slug: { _type: "slug", current: "apparel" } },
    { _id: "category-accessories", _type: "productCategory", title: "Accessories", slug: { _type: "slug", current: "accessories" } },
    { _id: "category-lifestyle", _type: "productCategory", title: "Lifestyle", slug: { _type: "slug", current: "lifestyle" } },
  ];

  const products = [
    {
      _id: "product-tee-navy",
      _type: "product",
      title: "The Essential Tee — Navy",
      slug: { _type: "slug", current: "essential-tee-navy" },
      sku: "tee-navy",
      price: 549,
      tagline: "Cut for stillness. Made for movement.",
      description: "A heavyweight cotton tee in deep navy. Quiet construction, considered fit.",
      meaning: "A reminder that integrity is built in the unseen seams.",
      details: ["240 GSM combed cotton", "Reinforced collar", "Pre-shrunk"],
      category: { _type: "reference", _ref: "category-apparel" },
      badge: "BEST SELLER",
      featured: true,
      inStock: true,
      sortOrder: 1,
    },
    {
      _id: "product-cap",
      _type: "product",
      title: "Emblem Cap",
      slug: { _type: "slug", current: "emblem-cap" },
      sku: "cap-emblem",
      price: 399,
      tagline: "A small mark. A steady centre.",
      description: "Six-panel cotton twill cap in navy.",
      meaning: "A quiet anchor for the day ahead.",
      details: ["100% brushed cotton twill", "Gold thread emblem"],
      category: { _type: "reference", _ref: "category-accessories" },
      featured: true,
      inStock: true,
      sortOrder: 2,
    },
    {
      _id: "product-hoodie",
      _type: "product",
      title: "Atelier Hoodie — Cream",
      slug: { _type: "slug", current: "atelier-hoodie-cream" },
      sku: "hoodie-cream",
      price: 1299,
      tagline: "Warmth with weight.",
      description: "Boxy, oversized hoodie in heavyweight loop-back cotton.",
      meaning: "Comfort that does not ask for attention.",
      details: ["480 GSM French terry", "Boxy oversized fit"],
      category: { _type: "reference", _ref: "category-apparel" },
      featured: true,
      inStock: true,
      sortOrder: 3,
    },
    {
      _id: "product-journal",
      _type: "product",
      title: "The Gilded Journal",
      slug: { _type: "slug", current: "gilded-journal" },
      sku: "journal-gilded",
      price: 449,
      tagline: "Pages for what matters.",
      description: "Full-grain leather journal with gold-foil emblem.",
      meaning: "A space to slow down — to write, pray, plan, remember.",
      details: ["Full-grain leather", "Smyth-sewn binding"],
      category: { _type: "reference", _ref: "category-lifestyle" },
      badge: "NEW",
      featured: true,
      inStock: true,
      sortOrder: 4,
    },
  ];

  const shipping = [
    { _id: "ship-pickup", _type: "shippingOption", id: "pickup", name: "Pick-up", price: 0, description: "Collect from our primary location.", sortOrder: 1 },
    { _id: "ship-pudo", _type: "shippingOption", id: "pudo", name: "Pudo", price: 80, description: "Secure locker-to-locker delivery.", sortOrder: 2 },
    { _id: "ship-courier", _type: "shippingOption", id: "courier", name: "Courier Guy", price: 100, description: "Door-to-door delivery.", sortOrder: 3 },
  ];

  const testimonials = [
    { _id: "test-1", _type: "testimonial", name: "Naledi M.", quote: "Every detail feels considered. Worth every rand.", piece: "Atelier Hoodie", order: 1 },
    { _id: "test-2", _type: "testimonial", name: "Sipho K.", quote: "Quiet luxury that actually means something.", piece: "Essential Tee", order: 2 },
    { _id: "test-3", _type: "testimonial", name: "Lerato D.", quote: "Feels like a brand that respects its customers.", piece: "Gilded Journal", order: 3 },
  ];

  const docs = [
    ...categories,
    ...products,
    ...shipping,
    ...testimonials,
    {
      _id: "siteSettings",
      _type: "siteSettings",
      siteName: "T & T Company",
      tagline: "Faith. Purpose. Style.",
      email: "hello@tandt.co",
      stewardshipEmail: "stewardship@tandtcompany.com",
      phone: "+27 ___ ___ ____",
      whatsappUrl: "https://wa.me/27000000000",
      paymentMethodsText: "VISA · MASTERCARD · EFT · PAYSTACK",
      taxRate: 0.08,
      announcements: [
        { icon: "truck", text: "Complimentary shipping on orders over R1 000" },
        { icon: "shield", text: "Secure checkout · 14-day easy returns" },
        { icon: "message", text: "Need help? Chat with us on WhatsApp" },
      ],
      trustItems: [
        { icon: "truck", title: "Nationwide Delivery", text: "Tracked shipping, 2–4 working days." },
        { icon: "shield", title: "Secure Checkout", text: "Encrypted payments via Paystack & EFT." },
        { icon: "rotate", title: "Easy Returns", text: "14-day exchanges on unworn pieces." },
        { icon: "sparkles", title: "Crafted to Last", text: "Premium fabrics, considered construction." },
      ],
      shippingOptions: shipping.map((s) => ({ _type: "reference", _ref: s._id, _key: s._id })),
    },
    {
      _id: "homePage",
      _type: "homePage",
      heroEyebrow: "T & T Company · New Season",
      heroHeadline: "Faith. Purpose. Style.",
      heroSubtext: "Premium pieces, made with intention. Now shipping across South Africa.",
      heroCtaPrimary: "Shop the Collection",
      heroCtaSecondary: "Our Story",
      heroSocialProof: "Loved by 1 200+ customers",
      statementEyebrow: "Our Why",
      statementHeadline: "Craft is a quiet form of devotion.",
      statementBody: "T AND T Company was founded by Tersha & Tyrone as an answer to noise.",
      collectionEyebrow: "The Collection",
      collectionTitle: "Considered essentials",
      collectionSubtext: "Hand-picked pieces, ready to ship.",
      featuredProducts: products.map((p) => ({ _type: "reference", _ref: p._id, _key: p._id })),
    },
    {
      _id: "aboutPage",
      _type: "aboutPage",
      heroEyebrow: "Our Story",
      heroHeadline: "Built quietly, on purpose.",
      heroSubtext: "A brand whose values you could feel in the seams.",
      ctaText: "See the collection",
      sections: [
        { eyebrow: "Tersha & Tyrone", body: "We're a husband-and-wife studio building with faithfulness and craft." },
        { eyebrow: "Why faith, why quietly", body: "Our faith shapes how we work — slowly, with care." },
        { eyebrow: "Who it's for", body: "For anyone building something meaningful." },
      ],
    },
    {
      _id: "shopPage",
      _type: "shopPage",
      heroEyebrow: "The Collection",
      heroHeadline: "Crafted for a meaningful journey.",
      heroSubtext: "Premium pieces, ready to ship across South Africa.",
      founderQuote: { quote: "Luxury is not in the excess, but in the truth of the craftsmanship.", attribution: "Founder's Note" },
    },
    {
      _id: "contactPage",
      _type: "contactPage",
      heroHeadline: "Let's Connect",
      heroSubtext: "Our doors are always open for meaningful conversation.",
      whatsappLabel: "Message on WhatsApp",
    },
    {
      _id: "termsPage",
      _type: "termsPage",
      heroHeadline: "Terms & Policies",
      heroSubtext: "Our commitment to excellence and integrity.",
      sections: [
        { id: "general", title: "General Information", body: block("Welcome to T AND T COMPANY. By using our site you agree to these terms.") },
        { id: "orders", title: "Orders & Payments", body: block("Payments are processed securely via Paystack.") },
        { id: "returns", title: "Returns & Exchanges", body: block("Returns within 30 days on unworn items in original condition.") },
      ],
    },
  ];

  const tx = client.transaction();
  for (const doc of docs) {
    tx.createOrReplace(doc);
  }
  await tx.commit();

  console.log("Done. Open Studio to upload product images and publish.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
