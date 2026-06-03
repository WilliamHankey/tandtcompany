const productFragment = `{
  _id, "id": sku, "slug": slug.current, "name": title, price, tagline, description, meaning, details,
  "image": image, badge, featured, inStock, "category": category->title
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteName, tagline, email, stewardshipEmail, phone, whatsappUrl, address,
  instagramUrl, facebookUrl, announcements, trustItems,
  footerShopLinks, footerBrandLinks, footerNewsletterTitle, footerNewsletterSubtext,
  paymentMethodsText, taxRate,
  "shippingOptions": shippingOptions[]-> | order(sortOrder asc) { _id, id, name, price, description, sortOrder }
}`;

export const productsQuery = `*[_type == "product"] | order(sortOrder asc) {
  _id, "id": sku, "slug": slug.current, "name": title, price, tagline, description, meaning, details,
  "image": image, gallery, badge, featured, inStock, sortOrder,
  "category": category->title
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0] {
  _id, "id": sku, "slug": slug.current, "name": title, price, tagline, description, meaning, details,
  "image": image, gallery, badge, featured, inStock,
  "category": category->title
}`;

export const homePageQuery = `*[_type == "homePage"][0]{
  heroEyebrow, heroHeadline, heroSubtext, heroImage, heroCtaPrimary, heroCtaSecondary, heroSocialProof,
  statementEyebrow, statementHeadline, statementBody,
  collectionEyebrow, collectionTitle, collectionSubtext,
  "featuredProducts": featuredProducts[]->${productFragment},
  moreThanClothing, qualitySection, communitySection, ctaSection, foundersTeaser
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  heroEyebrow, heroHeadline, heroSubtext, foundersImage, sections, ctaText
}`;

export const shopPageQuery = `*[_type == "shopPage"][0]{
  heroEyebrow, heroHeadline, heroSubtext, heroSlides, founderQuote
}`;

export const contactPageQuery = `*[_type == "contactPage"][0]{
  heroEyebrow, heroHeadline, heroSubtext, formIntro, whatsappLabel
}`;

export const termsPageQuery = `*[_type == "termsPage"][0]{
  heroEyebrow, heroHeadline, heroSubtext, heroImage, sections, contactBlock
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(order asc) { _id, name, "text": quote, piece, rating, order }`;
