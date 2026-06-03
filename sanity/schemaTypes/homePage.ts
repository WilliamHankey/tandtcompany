import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "text", rows: 2 }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 2 }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "heroCtaPrimary", title: "Hero CTA Primary", type: "string" }),
    defineField({ name: "heroCtaSecondary", title: "Hero CTA Secondary", type: "string" }),
    defineField({ name: "heroSocialProof", title: "Hero Social Proof", type: "string" }),
    defineField({ name: "statementEyebrow", title: "Statement Eyebrow", type: "string" }),
    defineField({ name: "statementHeadline", title: "Statement Headline", type: "text", rows: 3 }),
    defineField({ name: "statementBody", title: "Statement Body", type: "text", rows: 3 }),
    defineField({ name: "collectionEyebrow", title: "Collection Eyebrow", type: "string" }),
    defineField({ name: "collectionTitle", title: "Collection Title", type: "string" }),
    defineField({ name: "collectionSubtext", title: "Collection Subtext", type: "string" }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "moreThanClothing",
      title: "More Than Clothing Section",
      type: "object",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        { name: "headline", type: "text", title: "Headline", rows: 2 },
        { name: "body", type: "text", title: "Body", rows: 4 },
        { name: "image", type: "image", title: "Image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "qualitySection",
      title: "Quality as Worship Section",
      type: "object",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        { name: "headline", type: "text", title: "Headline", rows: 2 },
        { name: "body", type: "text", title: "Body", rows: 4 },
        { name: "pillars", type: "array", title: "Pillars", of: [{ type: "object", fields: [{ name: "title", type: "string" }, { name: "text", type: "string" }] }] },
      ],
    }),
    defineField({
      name: "communitySection",
      title: "Community Section",
      type: "object",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        { name: "headline", type: "text", title: "Headline", rows: 2 },
        { name: "values", type: "array", title: "Values", of: [{ type: "object", fields: [{ name: "title", type: "string" }, { name: "text", type: "string" }] }] },
      ],
    }),
    defineField({
      name: "ctaSection",
      title: "CTA Section",
      type: "object",
      fields: [
        { name: "headline", type: "string", title: "Headline" },
        { name: "body", type: "text", title: "Body", rows: 2 },
        { name: "buttonText", type: "string", title: "Button Text" },
      ],
    }),
    defineField({
      name: "foundersTeaser",
      title: "Founders Teaser",
      type: "object",
      fields: [
        { name: "eyebrow", type: "string", title: "Eyebrow" },
        { name: "headline", type: "text", title: "Headline", rows: 2 },
        { name: "body", type: "text", title: "Body", rows: 3 },
        { name: "image", type: "image", title: "Image", options: { hotspot: true } },
        { name: "linkText", type: "string", title: "Link Text" },
      ],
    }),
  ],
});
