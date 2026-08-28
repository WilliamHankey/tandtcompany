import { defineField, defineType } from "sanity";
import SkuInput from "./components/SkuInput";

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
    defineField({
      name: "sku",
      title: "SKU / ID",
      type: "string",
      description: "Auto-generated in format TTC-XXX-000. Click 'Generate SKU' after entering the product title.",
      validation: (r) =>
        r
          .required()
          .custom(async (sku, context) => {
            // `unique()` is not supported on string fields in Sanity, so we
            // enforce uniqueness manually. Allow the document's own current
            // value (editing other fields must not fail), and only reject a
            // SKU that already belongs to a *different* product.
            const docId = (context.document as { _id?: string } | undefined)?._id;
            const client = context.getClient({ apiVersion: "2024-05-22" });
            const params = { sku, id: docId };
            const collidingId = await client.fetch<string | null>(
              `*[_type == "product" && sku == $sku && _id != $id][0]._id`,
              params
            );
            return collidingId ? "This SKU is already used by another product. Regenerate or pick a unique value." : true;
          }),
      components: { input: SkuInput },
    }),
    defineField({ name: "price", title: "Price (ZAR)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({
      name: "sale",
      title: "Sale / Discount",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Enable Sale",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "discountPercent",
          title: "Discount Percentage",
          type: "number",
          description: "Example: 20 means 20% off the normal price.",
          validation: (r) => r.min(0).max(100),
        }),
        defineField({
          name: "startsAt",
          title: "Sale Starts At",
          type: "datetime",
        }),
        defineField({
          name: "endsAt",
          title: "Sale Ends At",
          type: "datetime",
        }),
      ],
    }),
    defineField({
      name: "sizes",
      title: "Sizes & Stock",
      type: "array",
      description: "Select available sizes and set stock quantity for each size.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "reference",
              to: [{ type: "productSize" }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "customSize",
              title: "Custom Size Override",
              type: "string",
              description:
                "Optional. Use only if this product needs a one-off size label.",
            }),
            defineField({
              name: "stock",
              title: "Stock Quantity",
              type: "number",
              initialValue: 0,
              validation: (r) => r.required().integer().min(0),
            }),
          ],
          preview: {
            select: {
              size: "size.label",
              customSize: "customSize",
              stock: "stock",
            },
            prepare({ size, customSize, stock }) {
              return {
                title: customSize || size || "Size",
                subtitle: `${stock ?? 0} in stock`,
              };
            },
          },
        },
      ],
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "meaning", title: "Meaning / Story", type: "text", rows: 3 }),
    defineField({ name: "details", title: "Details", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "materials", title: "Materials", type: "text", rows: 2, description: "Describe the materials used in this product." }),
    defineField({ name: "careInstructions", title: "Care Instructions", type: "text", rows: 2, description: "How to care for this product (washing, drying, ironing, etc.)." }),
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
