import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAboutPage } from "@/hooks/useSanityContent";
import { imageUrl } from "@/lib/sanity";

const foundersFallback = "/assets/founders.png";

type AboutPage = {
  foundersImage?: unknown;
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubtext?: string;
  ctaText?: string;
};

const About = () => {
  const { data } = useAboutPage();
  const page = data as AboutPage | undefined;

  const foundersImg = page?.foundersImage
    ? imageUrl(page.foundersImage, 1200)
    : foundersFallback;

  return (
    <Layout>
      {/* Founders Story */}
      <section className="bg-cream  pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container-prose grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <p className="eyebrow !text-gold">
              {page?.heroEyebrow || "Founder’s Story"}
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-4 text-navy">
              {page?.heroHeadline || "Tersha & Tyrone"}
            </h1>

            <p className="mt-8 leading-relaxed">
              T AND T COMPANY began not in a boardroom, but in prayer. Founders
              Tersha and Tyrone sought to create a brand that mirrored their own
              walk with God — one that didn’t scream for attention but spoke
              with a quiet, undeniable authority.
            </p>

            <p className="mt-6  leading-relaxed">
              Their journey has been one of intentionality, moving away from the
              conventional to find beauty in the minimalist. It was a vision
              born from the desire to integrate their faith into their lifestyle
              without compromising on modern luxury or editorial excellence.
            </p>

            <blockquote className="mt-8 border-l-2 border-gold pl-5 text-navy italic">
              “We don’t just build products; we cultivate a lifestyle of focused
              purpose and spiritual depth.”
            </blockquote>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="/assets/about-hero.png"
                alt="Tersha and Tyrone"
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-navy-deep/40" />

              <div className="absolute inset-0 flex items-center justify-center text-center px-28">
                <div>
                  <p className="text-gold text-3xl mb-3">✦</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-cream">
                    A Covenant of Quality
                  </h2>
                  <p className="mt-3 text-sm text-cream/70 max-w-sm px-2">
                    An unwavering commitment to excellence as an act of worship.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-8 w-40 h-28 bg-cream/90 backdrop-blur-sm hidden md:block" />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-secondary/40 py-24 md:py-28">
        <div className="container-prose text-center">
          <p className="eyebrow !text-gold">The Philosophy</p>

          <h2 className="font-serif text-4xl md:text-5xl mt-4 text-navy">
            Faith, Expressed Differently.
          </h2>

          <div className="grid md:grid-cols-3 gap-12 text-left mt-16">
            {[
              {
                title: "Subtle Influence",
                body: "We believe faith is most powerful when it is lived, not just spoken. Our designs are infused with spiritual themes — strength, peace, and covenant — without relying on overt iconography.",
              },
              {
                title: "Intentional Silence",
                body: "In a world of noise, we choose silence. Our minimalist approach allows the message of each piece to emerge slowly, rewarding those who value depth over volume.",
              },
              {
                title: "Intentional Silence",
                body: "It is faith for the discerning soul — refined, restrained, and deeply meaningful.",
              },
            ].map((item) => (
              <div key={item.title}>
                <p className="eyebrow mb-4">{item.title}</p>
                <div className="hairline mb-5" />
                <p className="text-sm leading-relaxed text-foreground/70">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-navy-deep text-cream py-24 md:py-28">
        <div className="container-prose flex items-center justify-between gap-12">
          <div className="max-w-xl">
            <p className="eyebrow !text-gold">Forward Motion</p>

            <h2 className="font-serif text-4xl md:text-5xl mt-4">The Vision</h2>

            <p className="mt-6 text-cream/70 leading-relaxed">
              Our goal is to become the global standard for faith-centered
              luxury. We envision a community where style and spirit coexist
              seamlessly, providing the modern believer with the tools to live a
              beautifully curated, God-honoring life.
            </p>

            <Button
              asChild
              className="mt-8 !text-cream"
              variant="gold"
              size="lg"
            >
              <Link to="/shop">Explore the Collection</Link>
            </Button>
          </div>

          <div className="hidden lg:block text-cream/5 text-[180px] font-serif">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="full"
              height="full"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-eye-icon lucide-eye"
            >
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream text-cream py-24 md:py-32">
        <div className="container-prose">
          <p className="eyebrow !text-gold">Our Foundation</p>

          <div className="flex items-center gap-6 mt-4">
            <h2 className="font-serif text-4xl md:text-5xl text-navy whitespace-nowrap">
              Values in Practice
            </h2>
            <div className="h-px bg-gold flex-1" />
          </div>

          <div className="grid md:grid-cols-4 gap-5 mt-14">
            {[
              {
                n: "01",
                title: "Integrity",
                body: "Honesty is the baseline of our craft. From ethical sourcing to transparent pricing, we honor God by honoring our word.",
              },
              {
                n: "02",
                title: "Purpose",
                body: "Every detail is intentional. We do not create for the sake of consumption, but for the sake of meaningful conviction.",
              },
              {
                n: "03",
                title: "Quality",
                body: "We believe excellence is a form of stewardship. Our materials are chosen to endure, mirroring the eternal nature of our faith.",
              },
              {
                n: "04",
                title: "Community",
                body: "T AND T is more than a company; it is a fellowship. We exist to support and inspire those walking their own path of faith.",
              },
            ].map((value) => (
              <div
                key={value.n}
                className="border border-gold/70 p-8 min-h-[260px]"
              >
                <p className="eyebrow !text-gold">{value.n}</p>
                <h3 className="font-serif text-2xl text-navy mt-10">
                  {value.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-black">
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
