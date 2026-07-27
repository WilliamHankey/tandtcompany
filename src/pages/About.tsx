import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAboutPage } from "@/hooks/useSanityContent";
import { imageUrl } from "@/lib/sanity";
import { Mail, MessageCircle } from "lucide-react";

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
      {/* Hero / Founder Story */}
      <section className="bg-cream pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-prose grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <p className="eyebrow !text-gold">
              {page?.heroEyebrow || "Founder's Story"}
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
                "{page.founderQuote}"
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

      {/* Mission & Vision */}
      <section className="bg-navy-deep text-cream py-24 md:py-28">
        <div className="container-prose">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="eyebrow !text-gold">
                {page?.visionEyebrow || "Our Mission"}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl mt-4">
                {page?.visionHeadline || "Purpose-Driven Living"}
              </h2>
              <p className="mt-6 text-cream/70 leading-relaxed whitespace-pre-line">
                {page?.visionBody ||
                  "At T AND T COMPANY, our mission is to create premium lifestyle apparel and accessories that serve as quiet declarations of faith, purpose, and intentionality. We believe that what you wear should reflect the depth of your soul and the clarity of your calling."}
              </p>
            </div>
            <div>
              <p className="eyebrow !text-gold">Our Vision</p>
              <h2 className="font-serif text-4xl md:text-5xl mt-4">
                A Kingdom Legacy
              </h2>
              <p className="mt-6 text-cream/70 leading-relaxed">
                We envision a world where faith-driven individuals have access
                to premium products that honour their values without compromise.
                T AND T COMPANY aspires to be a global symbol of quiet luxury
                rooted in spiritual conviction — building a community united by
                excellence, communion, and unity.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Button asChild className="!text-cream" variant="gold" size="lg">
              <Link to="/shop">
                {page?.ctaText || "Explore the Collection"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story / Business History */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-prose">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="eyebrow !text-gold">Our Journey</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 text-navy">
              How It All Began
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-foreground/85 leading-relaxed">
            <p>
              T AND T COMPANY was born from a conversation between Tersha and
              Tyrone at their kitchen table — a shared frustration with the lack
              of premium apparel that represented their values without
              compromising on modern aesthetic. They saw a gap in the market for
              clothing that spoke to the soul, not just the eye.
            </p>
            <p>
              What started as a dream quickly became a calling. The couple
              invested their savings, designed their first collection, and
              launched T AND T COMPANY with a simple belief: that faith-led
              fashion could stand shoulder-to-shoulder with any premium brand in
              the world.
            </p>
            <p>
              Every piece in the collection is designed with intentionality —
              from the fabric selection to the final stitch. The name "T AND T"
              represents the partnership between Tersha and Tyrone, but also
              stands for the twin pillars that anchor everything they create:{" "}
              <strong>Truth</strong> and <strong>Trust</strong>.
            </p>
            <p>
              Today, T AND T COMPANY serves a growing community of
              purpose-driven individuals across South Africa who believe that
              what you wear can carry meaning without saying a word.
            </p>
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="font-serif text-4xl text-gold">2024</p>
              <p className="text-sm text-muted-foreground mt-2">Founded</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-4xl text-gold">🇿🇦</p>
              <p className="text-sm text-muted-foreground mt-2">
                Proudly South African
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-4xl text-gold">✝️</p>
              <p className="text-sm text-muted-foreground mt-2">
                Faith-Led Apparel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="bg-secondary/40 py-24 md:py-28">
        <div className="container-prose text-center">
          <p className="eyebrow !text-gold">
            {page?.philosophyEyebrow || "The Philosophy"}
          </p>

          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-navy">
            {page?.philosophyHeadline || "Faith, Expressed Differently."}
          </h2>

          <div className="grid md:grid-cols-3 gap-12 text-left mt-16">
            {(
              page?.philosophyCards || [
                {
                  title: "Intentionality",
                  body: "Every design decision is deliberate. From fabric weight to stitch density, nothing is accidental.",
                },
                {
                  title: "Excellence",
                  body: "We pursue the highest standard in everything we create — not for perfection, but as an act of devotion.",
                },
                {
                  title: "Community",
                  body: "T AND T COMPANY is more than a brand. It is an invitation to live out faith with grace and lead with purpose.",
                },
              ]
            ).map((item, index) => (
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

      {/* CTA */}
      <section className="bg-navy-deep text-cream py-24 md:py-28">
        <div className="container-prose text-center max-w-3xl">
          <h2 className="font-serif text-4xl md:text-5xl">Join the Journey</h2>
          <p className="mt-6 text-cream/70 leading-relaxed max-w-xl mx-auto">
            T AND T COMPANY is an open invitation. We serve a diverse, global
            community united by a desire to live out their faith with
            excellence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="gold" size="lg">
              <Link to="/shop">Shop the Collection</Link>
            </Button>
            <Button
              asChild
              variant="outlineNavy"
              size="lg"
              className="!border-gold !text-gold hover:!bg-gold hover:!text-cream"
            >
              <a href="mailto:stewardship@tandtcompany.com">
                <Mail className="h-4 w-4 mr-2" />
                Get in Touch
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Values in Practice */}
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
            {(
              page?.values || [
                {
                  number: "01",
                  title: "Faith",
                  body: "Rooted in Christian conviction. Every thread and label serves a higher narrative.",
                },
                {
                  number: "02",
                  title: "Integrity",
                  body: "Transparent in our business practices, honest in our marketing, and ethical in our sourcing.",
                },
                {
                  number: "03",
                  title: "Excellence",
                  body: "Premium fabrics, considered construction, and attention to every detail — no compromises.",
                },
                {
                  number: "04",
                  title: "Community",
                  body: "Building a kingdom community united by purpose, not just product. Everyone is welcome.",
                },
              ]
            ).map((value, index) => (
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

      {/* Meet the Team */}
      <section className="bg-secondary/40 py-24 md:py-28">
        <div className="container-prose text-center max-w-3xl">
          <p className="eyebrow !text-gold">Meet the Founders</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-navy">
            Tersha & Tyrone
          </h2>
          <p className="mt-6 text-foreground/75 leading-relaxed">
            We are husband and wife, co-founders, and the creative force behind
            T AND T COMPANY. Our partnership is built on shared faith, mutual
            respect, and a relentless drive to create something meaningful.
            Every product that leaves our hands carries a piece of our story —
            and we hope it becomes part of yours.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-8 text-left max-w-xl mx-auto">
            <div className="bg-cream border border-border p-6 shadow-soft">
              <p className="eyebrow !text-gold mb-2">Tersha</p>
              <p className="font-serif text-xl text-navy">
                Co-Founder & Creative Director
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The visionary behind our design aesthetic. Tersha brings warmth,
                elegance, and intentionality to every collection.
              </p>
            </div>
            <div className="bg-cream border border-border p-6 shadow-soft">
              <p className="eyebrow !text-gold mb-2">Tyrone</p>
              <p className="font-serif text-xl text-navy">
                Co-Founder & Operations Lead
              </p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                The structural mind behind our operations. Tyrone ensures every
                order is fulfilled with care and precision.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
