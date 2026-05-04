import Layout from "@/components/Layout";

const sections: { title: string; body: string[] }[] = [
  { title: "1. General Information", body: ["T AND T Company (\"we\", \"us\", \"our\") is a faith-led lifestyle and apparel brand. By accessing or using our website, placing an order, or engaging with our services, you agree to be bound by the terms outlined below."] },
  { title: "2. Products & Availability", body: [
    "All products are subject to availability.",
    "We reserve the right to limit quantities or discontinue products at any time.",
    "Product images are for illustrative purposes; actual products may vary slightly in colour or appearance.",
  ]},
  { title: "3. Pricing", body: [
    "All prices are displayed in South African Rand (ZAR), unless stated otherwise.",
    "Prices may change without prior notice.",
    "Any applicable delivery fees will be clearly communicated before checkout.",
  ]},
  { title: "4. Orders & Payments", body: [
    "Orders are only confirmed once full payment is received.",
    "Payments are processed securely via PaySharp, a third-party payment gateway.",
    "T AND T Company does not store or have access to your card or banking details.",
  ]},
  { title: "5. Payment Processing (PaySharp)", body: [
    "All transactions are handled securely by PaySharp.",
    "By proceeding to checkout, you agree to PaySharp's terms and conditions.",
    "T AND T Company is not responsible for payment errors, delays, or issues caused by the payment provider.",
  ]},
  { title: "6. Order Fulfillment", body: [
    "Once payment is confirmed, order fulfilment will be coordinated via WhatsApp or email.",
    "Production and delivery timelines will be communicated after order confirmation.",
    "We aim to fulfil all orders promptly, but timelines may vary.",
  ]},
  { title: "7. Shipping & Delivery", body: [
    "Shipping costs and delivery timelines will be shared during order confirmation.",
    "T AND T Company is not liable for delays caused by courier services or unforeseen circumstances.",
  ]},
  { title: "8. Returns & Exchanges", body: [
    "Due to the nature of apparel and limited production, returns or exchanges may be limited.",
    "Any issues must be reported within 7 days of receiving the item.",
    "Items must be unused and in original condition.",
    "Refunds or exchanges are handled at our discretion.",
  ]},
  { title: "9. Cancellations", body: [
    "Orders cannot be cancelled once payment has been processed and production has begun.",
    "Please contact us immediately if you need assistance.",
  ]},
  { title: "10. Intellectual Property", body: [
    "All content, logos, designs, and materials on this website are the property of T AND T Company.",
    "You may not copy, reproduce, or use any content without written permission.",
  ]},
  { title: "11. Privacy Policy", body: [
    "We respect your privacy and are committed to protecting your personal information.",
    "Customer information is used solely for order processing and communication.",
    "We do not sell or share customer data with third parties, except where required for payment processing or delivery.",
  ]},
  { title: "12. Limitation of Liability", body: [
    "T AND T Company will not be held liable for any indirect, incidental, or consequential damages arising from the use of our website or products.",
  ]},
  { title: "13. Changes to These Terms", body: ["We reserve the right to update or modify these terms at any time. Changes will be posted on this page."] },
  { title: "14. Contact Information", body: [
    "For any questions regarding these terms or your order, please contact us via:",
    "Email: [hello@tandt.co]",
    "WhatsApp: [+27 ___ ___ ____]",
  ]},
];

const Terms = () => (
  <Layout>
    <section className="container-prose pt-36 pb-12 max-w-3xl">
      <p className="eyebrow">Legal</p>
      <h1 className="font-serif text-5xl md:text-6xl mt-4">Terms &amp; Policies</h1>
      <p className="mt-6 text-muted-foreground">Last updated: [Insert date]</p>
    </section>
    <section className="container-prose pb-32 max-w-3xl space-y-12">
      {sections.map((s) => (
        <div key={s.title}>
          <h2 className="font-serif text-2xl text-navy">{s.title}</h2>
          <div className="hairline mt-3 mb-5" />
          <div className="space-y-3 text-foreground/80 leading-relaxed">
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      ))}
    </section>
  </Layout>
);

export default Terms;
