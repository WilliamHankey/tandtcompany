import { defineField, defineType } from "sanity";

export const termsPage = defineType({
  name: "termsPage",
  title: "Terms & Policies",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string" }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 2 }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "sections",
      title: "Policy Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "id", type: "string", title: "Anchor ID", validation: (r) => r.required() },
            { name: "title", type: "string", title: "Title", validation: (r) => r.required() },
            { name: "body", type: "blockContent", title: "Body" },
            {
              name: "callout",
              type: "object",
              title: "Optional Callout",
              fields: [
                { name: "title", type: "string", title: "Title" },
                { name: "text", type: "text", title: "Text", rows: 2 },
              ],
            },
          ],
          preview: {
            select: { title: "title", subtitle: "id" },
          },
        },
      ],
    }),
    defineField({
      name: "contactBlock",
      title: "Contact Block",
      type: "object",
      fields: [
        { name: "title", type: "string", title: "Title" },
        { name: "body", type: "text", title: "Body", rows: 2 },
      ],
    }),
  ],
});
