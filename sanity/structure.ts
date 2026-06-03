import type { StructureResolver } from "sanity/structure";

const singletons = [
  { id: "siteSettings", title: "Site Settings" },
  { id: "homePage", title: "Home Page" },
  { id: "aboutPage", title: "About Page" },
  { id: "shopPage", title: "Shop Page" },
  { id: "contactPage", title: "Contact Page" },
  { id: "termsPage", title: "Terms & Policies" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(
              singletons
                .filter((s) => s.id !== "siteSettings")
                .map((s) =>
                  S.listItem()
                    .title(s.title)
                    .id(s.id)
                    .child(S.document().schemaType(s.id).documentId(s.id))
                )
            )
        ),
      S.divider(),
      S.documentTypeListItem("product").title("Products"),
      S.documentTypeListItem("productCategory").title("Categories"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("shippingOption").title("Shipping Options"),
    ]);
