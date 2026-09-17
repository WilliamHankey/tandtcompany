import { defineField, defineType } from "sanity";

export const sizeChart = defineType({
  name: "sizeChart",
  title: "Size Chart",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Chart Name",
      type: "string",
      description: "Example: Tops Size Chart, Pants Size Chart, Kids Sizes",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "productType",
      title: "Product Type",
      type: "string",
      description: "Example: hoodie, cap, tee, pants",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      description: "Size labels and measurements",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Size Label",
              type: "string",
              description: "Example: XS, S, M, L, XL, One Size",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "measurements",
              title: "Measurements",
              type: "array",
              description: "Chest, waist, hip, length, etc.",
              of: { type: "object", fields: [
                defineField({
                  name: "type",
                  title: "Measurement Type",
                  type: "string",
                  description: "Example: chest, waist, hip, inseam, length",
                  validation: (r) => r.required(),
                }),
                defineField({
                  name: "value",
                  title: "Value",
                  type: "string",
                  description: "Measurement in cm. Supports ranges, e.g. 72-74",
                  validation: (r) => r.required(),
                }),
              ]},
            }),
          ],
          validation: (r) => r.min(1),
        },
      ],
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
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
      title: "name",
      productType: "productType",
    },
    prepare({ title, productType }) {
      return {
        title,
        subtitle: productType ? `Product type: ${productType}` : "",
      };
    },
  },
});
