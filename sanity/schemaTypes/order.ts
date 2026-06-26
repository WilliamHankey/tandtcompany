import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "reference",
      title: "Payment Reference",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Fulfilled", value: "fulfilled" },
          { title: "Refunded", value: "refunded" },
        ],
      },
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        { name: "fullName", title: "Full Name", type: "string" },
        { name: "email", title: "Email", type: "string" },
        { name: "phone", title: "Phone", type: "string" },
      ],
    }),
    defineField({
      name: "shipping",
      title: "Shipping Details",
      type: "object",
      fields: [
        { name: "delivery", title: "Delivery Method", type: "string" },
        { name: "country", title: "Country", type: "string" },
        { name: "address", title: "Address", type: "text" },
        { name: "city", title: "City", type: "string" },
        { name: "postcode", title: "Postcode", type: "string" },
        { name: "shippingCost", title: "Shipping Cost", type: "number" },
      ],
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", title: "Product ID", type: "string" },
            { name: "name", title: "Product Name", type: "string" },
            { name: "price", title: "Unit Price", type: "number" },
            { name: "qty", title: "Quantity", type: "number" },
            { name: "lineTotal", title: "Line Total", type: "number" },
          ],
        },
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    }),
    defineField({
      name: "tax",
      title: "Tax",
      type: "number",
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "ZAR",
    }),
    defineField({
      name: "paystack",
      title: "Paystack",
      type: "object",
      fields: [
        { name: "accessCode", title: "Access Code", type: "string" },
        { name: "authorizationUrl", title: "Authorization URL", type: "url" },
        { name: "paidAt", title: "Paid At", type: "datetime" },
        { name: "rawVerifyResponse", title: "Raw Verify Response", type: "text" },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});