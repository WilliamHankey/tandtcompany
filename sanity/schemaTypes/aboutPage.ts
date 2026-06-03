import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "text", rows: 2 }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 3 }),
    defineField({ name: "foundersImage", title: "Founders Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "sections",
      title: "Story Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "eyebrow", type: "string", title: "Eyebrow" },
            { name: "body", type: "text", title: "Body", rows: 4 },
          ],
        },
      ],
    }),
    defineField({ name: "ctaText", title: "CTA Button Text", type: "string" }),
  ],
});
