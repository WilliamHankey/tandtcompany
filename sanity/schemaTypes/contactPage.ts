import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string" }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string" }),
    defineField({ name: "heroSubtext", title: "Hero Subtext", type: "text", rows: 2 }),
    defineField({ name: "formIntro", title: "Form Introduction", type: "text", rows: 2 }),
    defineField({ name: "whatsappLabel", title: "WhatsApp Button Label", type: "string" }),
  ],
});
