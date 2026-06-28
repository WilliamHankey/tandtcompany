import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAboutPage } from "@/hooks/useSanityContent";
import { imageUrl } from "@/lib/sanity";

const foundersFallback = "/assets/about-hero.png";

type PhilosophyCard = {
  title?: string;
  body?: string;
};

type ValueCard = {
  number?: string;
  title?: string;
  body?: string;
};

type AboutPage = {
  heroEyebrow?: string;
  heroHeadline?: string;
  founderStoryParagraphs?: string[];
  founderQuote?: string;
  foundersImage?: unknown;
  imageOverlayTitle?: string;
  imageOverlayText?: string;
  philosophyEyebrow?: string;
  philosophyHeadline?: string;
  philosophyCards?: PhilosophyCard[];
  visionEyebrow?: string;
  visionHeadline?: string;
  visionBody?: string;
  ctaText?: string;
  valuesEyebrow?: string;
  valuesHeadline?: string;
  values?: ValueCard[];
};

const About = () => {
  const { data } = useAboutPage();
  const page = data as AboutPage | undefined;

  const foundersImg = page?.foundersImage
    ? imageUrl(page.foundersImage, 1200)
    : foundersFallback;

  return (
    <Layout>
      <section className="bg-cream pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-prose grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <p className="eyebrow !text-gold">
              {page?.heroEyebrow || "Founder’s Story"}
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-4 text-navy whitespace-pre-line">
              {page?.heroHeadline || "Tersha & Tyrone"}
            </h1>

            {(page?.founderStoryParagraphs || []).map((paragraph, index) => (
              <p
                key={index}
                className={`${index === 0 ? "mt-8" : "mt-6"} leading-relaxed whitespace-pre-line`}
              >
                {paragraph}
              </p>
            ))}

            {page?.founderQuote && (
              <blockquote className="mt-8 border-l-2 border-gold pl-5 text-navy italic whitespace-pre-line">
                “{page.founderQuote}”
              </blockquote>
            )}
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={foundersImg}
                alt="Tersha and Tyrone"
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-navy-deep/40" />

              <div className="absolute inset-0 flex items-center justify-center text-center px-10 md:px-28">
                <div>
                  <p className="text-gold text-3xl mb-3">✦</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-cream">
                    {page?.imageOverlayTitle || "A Covenant of Quality"}
                  </h2>
                  <p className="mt-3 text-sm text-cream/70 max-w-sm px-2 whitespace-pre-line">
                    {page?.imageOverlayText ||
                      "An unwavering commitment to excellence as an act of worship."}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-8 w-40 h-28 bg-cream/90 backdrop-blur-sm hidden md:block" />
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-24 md:py-28">
        <div className="container-prose text-center">
          <p className="eyebrow !text-gold">
            {page?.philosophyEyebrow || "The Philosophy"}
          </p>

          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-navy">
            {page?.philosophyHeadline || "Faith, Expressed Differently."}
          </h2>

          <div className="grid md:grid-cols-3 gap-12 text-left mt-16">
            {(page?.philosophyCards || []).map((item, index) => (
              <div key={`${item.title}-${index}`}>
                <p className="eyebrow mb-4">{item.title}</p>
                <div className="hairline mb-5" />
                <p className="text-sm leading-relaxed text-foreground/70 whitespace-pre-line">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-deep text-cream py-24 md:py-28">
        <div className="container-prose flex items-center justify-between gap-12">
          <div className="max-w-xl">
            <p className="eyebrow !text-gold">
              {page?.visionEyebrow || "Forward Motion"}
            </p>

            <h2 className="font-serif text-4xl md:text-5xl mt-4">
              {page?.visionHeadline || "The Vision"}
            </h2>

            <p className="mt-6 text-cream/70 leading-relaxed whitespace-pre-line">
              {page?.visionBody}
            </p>

            <Button
              asChild
              className="mt-8 !text-cream"
              variant="gold"
              size="lg"
            >
              <Link to="/shop">
                {page?.ctaText || "Explore the Collection"}
              </Link>
            </Button>
          </div>

          <div className="hidden lg:block text-cream/5 text-[180px] font-serif">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-eye-icon lucide-eye"
            >
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="container-prose">
          <p className="eyebrow !text-gold">
            {page?.valuesEyebrow || "Our Foundation"}
          </p>

          <div className="flex items-center gap-6 mt-4">
            <h2 className="font-serif text-4xl md:text-5xl text-navy whitespace-nowrap">
              {page?.valuesHeadline || "Values in Practice"}
            </h2>
            <div className="h-px bg-gold flex-1" />
          </div>

          <div className="grid md:grid-cols-4 gap-5 mt-14">
            {(page?.values || []).map((value, index) => (
              <div
                key={`${value.number}-${value.title}-${index}`}
                className="border border-gold/70 p-8 min-h-[260px]"
              >
                <p className="eyebrow !text-gold">
                  {value.number || String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl text-navy mt-10">
                  {value.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-black whitespace-pre-line">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
