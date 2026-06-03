import { defineField, defineType } from "sanity";

export const shippingOption = defineType({
  name: "shippingOption",
  title: "Shipping Option",
  type: "document",
  fields: [
    defineField({ name: "id", title: "ID (pickup | pudo | courier)", type: "string", validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price (ZAR)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "sortOrder", title: "Sort Order", type: "number", initialValue: 0 }),
  ],
});
