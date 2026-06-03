import { defineField, defineType } from "sanity";

export const shopPage = defineType({
  name: "shopPage",
  title: "Shop Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string" }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 2 }),
    defineField({
      name: "heroSlides",
      title: "Hero Carousel Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "image", type: "image", title: "Image", options: { hotspot: true } },
            { name: "alt", type: "string", title: "Alt Text" },
          ],
        },
      ],
    }),
    defineField({
      name: "founderQuote",
      title: "Founder Quote Band",
      type: "object",
      fields: [
        { name: "quote", type: "text", title: "Quote", rows: 2 },
        { name: "attribution", type: "string", title: "Attribution" },
      ],
    }),
  ],
});
