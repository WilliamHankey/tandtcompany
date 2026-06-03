import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({ name: "siteName", title: "Site Name", type: "string", initialValue: "T & T Company" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "email", title: "Primary Email", type: "string" }),
    defineField({ name: "stewardshipEmail", title: "Stewardship Email", type: "string" }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({ name: "whatsappUrl", title: "WhatsApp URL", type: "url" }),
    defineField({ name: "address", title: "Address", type: "text", rows: 2 }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook URL", type: "url" }),
    defineField({
      name: "announcements",
      title: "Announcement Bar Messages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", title: "Icon", type: "string", options: { list: ["truck", "shield", "message"] } },
            { name: "text", title: "Text", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "trustItems",
      title: "Trust Strip Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", title: "Icon", type: "string", options: { list: ["truck", "shield", "rotate", "sparkles"] } },
            { name: "title", title: "Title", type: "string" },
            { name: "text", title: "Text", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "footerShopLinks",
      title: "Footer — Shop Links",
      type: "array",
      of: [{ type: "object", fields: [{ name: "label", type: "string" }, { name: "href", type: "string" }] }],
    }),
    defineField({
      name: "footerBrandLinks",
      title: "Footer — Brand Links",
      type: "array",
      of: [{ type: "object", fields: [{ name: "label", type: "string" }, { name: "href", type: "string" }] }],
    }),
    defineField({ name: "footerNewsletterTitle", title: "Footer Newsletter Title", type: "string" }),
    defineField({ name: "footerNewsletterSubtext", title: "Footer Newsletter Subtext", type: "string" }),
    defineField({ name: "paymentMethodsText", title: "Payment Methods Text", type: "string" }),
    defineField({ name: "taxRate", title: "Tax Rate (decimal, e.g. 0.08)", type: "number", initialValue: 0.08 }),
    defineField({
      name: "shippingOptions",
      title: "Shipping Options (override documents)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "shippingOption" }] }],
    }),
  ],
});
