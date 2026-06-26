import { defineField, defineType } from "sanity";

export const productSize = defineType({
  name: "productSize",
  title: "Product Size",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Size Label",
      type: "string",
      description: "Example: XS, S, M, L, XL, One Size, Kids 3-4, 500ml",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "sortOrder",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle !== undefined ? `Sort order: ${subtitle}` : "",
      };
    },
  },
});