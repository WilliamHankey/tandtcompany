import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import founders from "@/assets/founders.jpg";

const About = () => (
  <Layout>
    <section className="bg-navy-gradient text-cream pt-40 pb-28">
      <div className="container-prose max-w-3xl">
        <p className="eyebrow">Our Story</p>
        <div className="hairline mt-4 mb-8" />
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-balance">
          Built quietly, on purpose.
        </h1>
        <p className="mt-8 text-cream/75 text-lg leading-relaxed max-w-2xl">
          T AND T Company began as a conversation between two people who wanted to build something honest — a brand whose values you could feel in the seams.
        </p>
      </div>
    </section>

    <section className="container-prose py-24 md:py-32 grid md:grid-cols-12 gap-12">
      <div className="md:col-span-5">
        <div className="aspect-[4/5] overflow-hidden">
          <img src={founders} alt="Tersha and Tyrone" loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="md:col-span-7 md:pt-12 space-y-10 text-lg leading-relaxed text-foreground/85">
        <div>
          <p className="eyebrow mb-3">Tersha &amp; Tyrone</p>
          <p>
            We're a husband-and-wife studio. Our days are spent chasing two things: faithfulness in the small, and craft in the visible. T AND T is where those two meet.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Why faith, why quietly</p>
          <p>
            Our faith shapes how we work — slowly, with care, with people in mind. But this is not a brand that preaches. It's a brand that practices. Every piece we make is built to last, to be passed on, to outlive a season.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Who it's for</p>
          <p>
            For believers and non-believers alike. For anyone tired of disposable. For anyone building something meaningful — a family, a calling, a quiet life of consequence.
          </p>
        </div>
        <Button asChild variant="navy" size="lg"><Link to="/shop">See the collection</Link></Button>
      </div>
    </section>
  </Layout>
);

export default About;
