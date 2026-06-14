import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "piece",
      title: "Product Mentioned",
      type: "string",
    }),
    defineField({
      name: "avatar",
      title: "Avatar Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      initialValue: 5,
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: "testimonialType",
      title: "Testimonial Type",
      type: "string",
      initialValue: "text",
      options: {
        list: [
          { title: "Text Testimonial", value: "text" },
          { title: "TikTok Video", value: "tiktok" },
          { title: "Instagram Video", value: "instagram" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "embedUrl",
      title: "TikTok / Instagram Embed URL",
      type: "url",
      description:
        "Paste the embed URL for TikTok or Instagram here. Example: https://www.tiktok.com/embed/VIDEO_ID",
      hidden: ({ parent }) => parent?.testimonialType === "text",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});