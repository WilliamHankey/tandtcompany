import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ruler } from "lucide-react";
import { useSizeCharts } from "@/hooks/useSanityContent";
import SizeChartTable from "@/components/size-chart/SizeChartTable";
import { SITE_URL } from "@/lib/seo";

const SizeGuide = () => {
  const { data: charts, isLoading } = useSizeCharts();
  const active = (charts || []).filter((c) => c?.sizes?.length);

  return (
    <Layout>
      <SEO
        title="Size Guide — T AND T COMPANY"
        description="Find your perfect fit with the T AND T COMPANY size charts for tops and pants. Measurements in centimetres."
        canonical={`${SITE_URL}/size-guide`}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Size Guide", url: "/size-guide" },
        ]}
      />

      <section className="container-prose pb-24 pt-10">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Size Guide</p>
          <h1 className="font-serif text-4xl md:text-5xl text-navy-deep">
            Find your perfect fit
          </h1>
          <p className="mt-6 text-foreground/80 leading-relaxed">
            Our pieces are designed with a relaxed, considered fit. Use the
            charts below to find your size — measurements are given in
            centimetres (cm).
          </p>
        </div>

        {isLoading ? (
          <p className="mt-16 text-muted-foreground">Loading size charts…</p>
        ) : active.length === 0 ? (
          <p className="mt-16 text-muted-foreground">
            Our size charts are being updated. Please check back soon.
          </p>
        ) : (
          <div className="mt-16 space-y-20">
            {active.map((chart) => (
              <SizeChartTable
                key={chart._id || chart.name || chart.productType}
                chart={chart}
              />
            ))}
          </div>
        )}

        <div className="mt-20 grid gap-10 border-t border-border pt-12 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-4">How to measure</p>
            <ul className="space-y-3 text-sm text-foreground/80 leading-relaxed">
              <li className="flex gap-3">
                <span className="text-gold">—</span>
                <span>
                  <strong className="font-medium text-navy-deep">Shoulder:</strong>{" "}
                  measure across the back from shoulder point to shoulder point.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold">—</span>
                <span>
                  <strong className="font-medium text-navy-deep">Bust:</strong>{" "}
                  measure around the fullest part of your chest, keeping the tape
                  level.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold">—</span>
                <span>
                  <strong className="font-medium text-navy-deep">Waist:</strong>{" "}
                  measure around the narrowest part of your waist, or where you
                  prefer the waistband to sit.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-gold">—</span>
                <span>
                  <strong className="font-medium text-navy-deep">Length:</strong>{" "}
                  measure from the top of the waistband straight down to the hem.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div className="flex items-start gap-3 bg-cream border border-border p-5">
              <Ruler className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/80 leading-relaxed">
                Measurements are approximate and in centimetres (cm). If you're
                between sizes, we recommend sizing up for a relaxed fit. Unsure?
                Reach out and we'll happily help you choose.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="navy" size="lg">
                <Link to="/shop">Shop the collection</Link>
              </Button>
              <Button asChild variant="outlineNavy" size="lg">
                <Link to="/contact">Ask a question</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SizeGuide;
