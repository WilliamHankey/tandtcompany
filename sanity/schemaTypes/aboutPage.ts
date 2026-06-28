import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "founderStoryParagraphs",
      title: "Founder Story Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
    }),
    defineField({
      name: "founderQuote",
      title: "Founder Quote",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "foundersImage",
      title: "Founders Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "imageOverlayTitle",
      title: "Image Overlay Title",
      type: "string",
    }),
    defineField({
      name: "imageOverlayText",
      title: "Image Overlay Text",
      type: "text",
      rows: 2,
    }),

    defineField({
      name: "philosophyEyebrow",
      title: "Philosophy Eyebrow",
      type: "string",
    }),
    defineField({
      name: "philosophyHeadline",
      title: "Philosophy Headline",
      type: "string",
    }),
    defineField({
      name: "philosophyCards",
      title: "Philosophy Cards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "body", title: "Body", type: "text", rows: 3 },
          ],
        },
      ],
    }),

    defineField({
      name: "visionEyebrow",
      title: "Vision Eyebrow",
      type: "string",
    }),
    defineField({
      name: "visionHeadline",
      title: "Vision Headline",
      type: "string",
    }),
    defineField({
      name: "visionBody",
      title: "Vision Body",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "ctaText",
      title: "CTA Button Text",
      type: "string",
    }),

    defineField({
      name: "valuesEyebrow",
      title: "Values Eyebrow",
      type: "string",
    }),
    defineField({
      name: "valuesHeadline",
      title: "Values Headline",
      type: "string",
    }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "number", title: "Number", type: "string" },
            { name: "title", title: "Title", type: "string" },
            { name: "body", title: "Body", type: "text", rows: 3 },
          ],
        },
      ],
    }),
  ],
});