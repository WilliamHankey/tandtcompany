import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { FAQPageSchema } from "@/components/JsonLd";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FAQItem = {
  question: string;
  answer: string;
};

const faqData: FAQItem[] = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept Visa, Mastercard, bank transfers (EFT), and mobile money payments. All transactions are securely processed through Paystack, a PCI DSS Level 1 certified payment gateway. Your card details are never stored on our servers.",
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. All payments are processed through Paystack with 256-bit SSL encryption. Paystack is PCI DSS Level 1 certified, which is the highest level of payment security certification. We never see or store your card details.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard processing takes 2–4 business days. Once dispatched, delivery within major South African centres takes 2–4 business days via Courier Guy, or 3–5 business days via Pudo locker-to-locker. Outlying areas may take 4–7 business days.",
  },
  {
    question: "How much does shipping cost?",
    answer: "Shipping costs depend on your selected delivery method: Pick-up is free, Pudo locker-to-locker starts at R80, and Courier Guy door-to-door starts at R100. Exact costs are calculated at checkout based on your delivery address.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we ship within South Africa only. We are working to expand our delivery options in the future. If you are located outside South Africa, please contact us at stewardship@tandtcompany.com to discuss potential arrangements.",
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is dispatched, you will receive an email with a tracking number and a direct link to track your parcel. You can also contact us at any time for a tracking update.",
  },
  {
    question: "What is your return policy?",
    answer: "You have 7 days from the date of delivery to return unworn items in their original condition with tags attached. Please contact us at stewardship@tandtcompany.com or via WhatsApp to initiate a return. Return shipping costs are the customer's responsibility unless the item was defective or incorrectly sent.",
  },
  {
    question: "How long do refunds take?",
    answer: "Once we receive and approve your returned item, refunds are processed within 5–7 business days. Please allow an additional 3–5 business days for the refund to reflect in your account, depending on your bank or payment provider.",
  },
  {
    question: "Can I exchange an item?",
    answer: "Yes, we offer exchanges for items of equal value, subject to availability. Contact us within the 7-day return window with your order number and preferred replacement. We will reserve the item and provide return instructions.",
  },
  {
    question: "What if I receive a damaged or incorrect item?",
    answer: "Please contact us within 48 hours of delivery with photographic evidence. We will arrange a prepaid return label and either reship the correct item or issue a full refund including shipping costs.",
  },
  {
    question: "Do your prices include tax?",
    answer: "All prices are displayed in South African rand. Any applicable taxes will be calculated and shown at checkout.",
  },
  {
    question: "Can I cancel my order?",
    answer: "You can cancel your order before it has been dispatched by contacting us immediately. Once an order has been dispatched, it cannot be cancelled and you will need to follow the standard return process.",
  },
  {
    question: "How do I care for my T AND T products?",
    answer: "For best results: Machine wash cold with similar colours, do not bleach, tumble dry low or hang to dry, and iron on medium heat. Do not dry clean. Specific care instructions are included on the label of each product.",
  },
  {
    question: "Are your products ethically made?",
    answer: "Yes. We are committed to ethical production practices. Our materials are carefully sourced for quality and sustainability, and our manufacturing partners adhere to fair labour standards.",
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us via email at stewardship@tandtcompany.com, WhatsApp at +27 (0) 61 485 2498, or through the contact form on our Contact page. We aim to respond within 24 business hours.",
  },
];

const FAQItem = ({ item }: { item: FAQItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border bg-cream">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-serif text-navy text-lg pr-4">{item.question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gold shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 pb-5 text-sm text-foreground/80 leading-relaxed border-t border-border pt-4">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

const faqStructured = faqData.map(({ question, answer }) => ({ question, answer }));

const FAQ = () => (
  <Layout>
    <FAQPageSchema items={faqStructured} />
    <section className="relative bg-navy-deep text-cream pt-32 pb-20 overflow-hidden">
      <div className="relative container-prose text-center">
        <p className="eyebrow !text-gold mb-4">Got Questions?</p>
        <h1 className="font-serif text-5xl md:text-6xl">Frequently Asked Questions</h1>
        <p className="mt-6 text-cream/75 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about shopping with T AND T COMPANY — from payments and shipping to returns and care.
        </p>
      </div>
    </section>

    <section className="container-prose py-20 max-w-3xl">
      <div className="space-y-4">
        {faqData.map((item) => (
          <FAQItem key={item.question} item={item} />
        ))}
      </div>

      <div className="mt-20 text-center space-y-6">
        <p className="text-muted-foreground">
          Still have questions? We'd love to help.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="gold" size="lg">
            <a
              href="https://wa.me/27614852498"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Us
            </a>
          </Button>
          <Button asChild variant="outlineNavy" size="lg">
            <a href="mailto:stewardship@tandtcompany.com">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          We aim to respond within 24 business hours.
        </p>
      </div>

      <div className="border-t border-border pt-10 mt-16">
        <p className="text-sm text-muted-foreground text-center">
          Helpful links:{" "}
          <Link to="/shipping-policy" className="text-gold link-underline">Shipping Policy</Link> ·{" "}
          <Link to="/returns-policy" className="text-gold link-underline">Returns Policy</Link> ·{" "}
          <Link to="/refund-policy" className="text-gold link-underline">Refund Policy</Link> ·{" "}
          <Link to="/terms" className="text-gold link-underline">Terms & Conditions</Link>
        </p>
      </div>
    </section>
  </Layout>
);

export default FAQ;
