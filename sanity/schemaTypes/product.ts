import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "sku", title: "SKU / ID", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price (ZAR)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "meaning", title: "Meaning / Story", type: "text", rows: 3 }),
    defineField({ name: "details", title: "Details", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "image",
      title: "Primary Image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      options: {
        list: [
          { title: "None", value: "" },
          { title: "Best Seller", value: "BEST SELLER" },
          { title: "New", value: "NEW" },
          { title: "Limited", value: "LIMITED" },
        ],
      },
    }),
    defineField({ name: "featured", title: "Featured on Home", type: "boolean", initialValue: false }),
    defineField({ name: "inStock", title: "In Stock", type: "boolean", initialValue: true }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Sort Order", name: "sortOrderAsc", by: [{ field: "sortOrder", direction: "asc" }] }],
  preview: {
    select: { title: "title", media: "image", subtitle: "price" },
    prepare: ({ title, media, subtitle }) => ({
      title,
      media,
      subtitle: subtitle ? `R${subtitle}` : "",
    }),
  },
});
