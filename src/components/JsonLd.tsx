import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_NAME, SITE_LOGO } from "@/lib/seo";

export const OrganizationSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ClothingStore",
        name: SITE_NAME,
        url: SITE_URL,
        logo: SITE_LOGO,
        image: SITE_LOGO,
        description:
          "A faith-led lifestyle brand by Tersha & Tyrone. Premium Christian apparel and accessories, made with intention.",
        foundingDate: "2024",
        founder: [
          { "@type": "Person", name: "Tersha" },
          { "@type": "Person", name: "Tyrone" },
        ],
        address: { "@type": "PostalAddress", addressCountry: "ZA" },
        sameAs: [
          "https://www.instagram.com/tandtcompany",
          "https://www.facebook.com/tandtcompany",
        ],
      })}
    </script>
  </Helmet>
);

type ProductSchemaProps = {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  currency?: string;
  availability?: string;
  url: string;
};

export const ProductSchema = ({
  name,
  description,
  image,
  sku,
  price,
  currency = "ZAR",
  availability = "https://schema.org/InStock",
  url,
}: ProductSchemaProps) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image,
        sku,
        mpn: sku,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: currency,
          availability,
          url,
          seller: { "@type": "Organization", name: SITE_NAME },
        },
      })}
    </script>
  </Helmet>
);

type BreadcrumbProps = {
  items: { name: string; url: string }[];
};

export const BreadcrumbSchema = ({ items }: BreadcrumbProps) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${SITE_URL}${item.url}`,
        })),
      })}
    </script>
  </Helmet>
);

type FAQPageSchemaProps = {
  items: { question: string; answer: string }[];
};

export const FAQPageSchema = ({ items }: FAQPageSchemaProps) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      })}
    </script>
  </Helmet>
);

export const WebPageSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "A faith-led lifestyle brand. Considered apparel and goods, made with intention.",
      })}
    </script>
  </Helmet>
);
