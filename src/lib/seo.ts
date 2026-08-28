export const SITE_NAME = "T AND T COMPANY";
export const SITE_URL = "https://tandtcompany.vercel.app";
export const SITE_DESCRIPTION =
  "A faith-led lifestyle brand by Tersha & Tyrone. Premium Christian apparel and accessories, made with intention.";
export const SITE_KEYWORDS =
  "T AND T Company, Christian apparel, faith clothing, Christian lifestyle brand, faith-led fashion, purpose-driven apparel, Christian streetwear, Cape Town apparel, Christian t-shirts, faith-based clothing";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/open-graph-image.png`;
export const SITE_TWITTER = "@tandtcompany";
export const SITE_LOGO = `${SITE_URL}/assets/logo.png`;

export const DEFAULT_TITLE = "T AND T COMPANY — Faith. Purpose. Style.";
export const DEFAULT_DESCRIPTION = SITE_DESCRIPTION;

export const pageMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "About Us — T AND T COMPANY",
    description: "Meet Tersha & Tyrone, founders of T AND T COMPANY. A faith-led lifestyle brand rooted in Christian values, premium quality, and purposeful design.",
  },
  "/shop": {
    title: "Shop — T AND T COMPANY",
    description: "Browse our collection of premium Christian apparel and accessories. Faith-led fashion designed with intention.",
  },
  "/cart": {
    title: "Your Bag — T AND T COMPANY",
    description: "Review your selection of faith-led apparel and accessories.",
  },
  "/checkout": {
    title: "Checkout — T AND T COMPANY",
    description: "Complete your order of premium Christian apparel.",
  },
  "/contact": {
    title: "Contact Us — T AND T COMPANY",
    description: "Get in touch with T AND T COMPANY. We'd love to hear from you.",
  },
  "/faq": {
    title: "FAQ — T AND T COMPANY",
    description: "Frequently asked questions about ordering, shipping, returns, and care for your T AND T COMPANY apparel.",
  },
  "/terms": {
    title: "Terms & Conditions — T AND T COMPANY",
    description: "Terms and conditions for purchasing from T AND T COMPANY.",
  },
  "/privacy-policy": {
    title: "Privacy Policy — T AND T COMPANY",
    description: "Privacy policy for T AND T COMPANY. How we handle your data.",
  },
  "/shipping-policy": {
    title: "Shipping Policy — T AND T COMPANY",
    description: "Shipping policy for T AND T COMPANY. Nationwide delivery across South Africa.",
  },
  "/returns-policy": {
    title: "Returns Policy — T AND T COMPANY",
    description: "Returns and exchange policy for T AND T COMPANY. 7-day return window.",
  },
  "/refund-policy": {
    title: "Refund Policy — T AND T COMPANY",
    description: "Refund policy for T AND T COMPANY. How refunds are processed.",
  },
  "/cookie-policy": {
    title: "Cookie Policy — T AND T COMPANY",
    description: "Cookie policy for T AND T COMPANY. How we use cookies.",
  },
  "/confirmation": {
    title: "Order Confirmation — T AND T COMPANY",
    description: "Your order has been confirmed. Thank you for shopping with T AND T COMPANY.",
  },
};

export function getPageMeta(path: string): { title: string; description: string } {
  return pageMeta[path] || { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
}
