import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "piece", title: "Product Mentioned", type: "string" }),
    defineField({ name: "rating", title: "Rating (1-5)", type: "number", initialValue: 5 }),
    defineField({ name: "order", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});
