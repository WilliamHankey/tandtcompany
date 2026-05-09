import { Link, useLocation, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Ticket, MailCheck } from "lucide-react";

const Confirmation = () => {
  const { state } = useLocation() as { state?: { ref?: string; email?: string } };
  if (!state?.ref) return <Navigate to="/" replace />;

  return (
    <Layout>
      <section className="container-prose pt-32 pb-24 max-w-3xl">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl leading-tight text-navy">
            Thank you for joining the journey.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            We are honored to be part of your story. Your commitment to a life rooted in faith and crafted for purpose inspires everything we do at T AND T COMPANY.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 border border-border bg-cream shadow-elegant">
          <div className="p-10 text-center border-b sm:border-b-0 sm:border-r border-border">
            <Ticket className="h-7 w-7 text-gold mx-auto" />
            <p className="eyebrow mt-4">Order Reference</p>
            <p className="font-serif text-2xl mt-3 text-navy tracking-wider">#{state.ref}</p>
          </div>
          <div className="p-10 text-center">
            <MailCheck className="h-7 w-7 text-gold mx-auto" />
            <p className="eyebrow mt-4">Confirmation Sent</p>
            <p className="mt-3 text-foreground/80">Check your inbox for a detailed summary and receipt.</p>
          </div>
        </div>
        <div className="h-1 bg-border/60 max-w-[92%] mx-auto" />

        <div className="mt-16 border-l-2 border-gold pl-8">
          <h2 className="font-serif text-2xl text-navy">What happens next?</h2>
          <ol className="mt-8 space-y-7">
            <li className="flex gap-5">
              <span className="font-serif text-gold border border-gold/40 w-10 h-10 grid place-items-center shrink-0">01</span>
              <p className="text-foreground/80 leading-relaxed pt-1.5">
                Your order will be fulfilled personally via{" "}
                <a href="#" className="text-gold link-underline">WhatsApp</a> or{" "}
                <a href={`mailto:${state.email}`} className="text-gold link-underline">email</a> within the next 24 hours.
              </p>
            </li>
            <li className="flex gap-5">
              <span className="font-serif text-gold border border-gold/40 w-10 h-10 grid place-items-center shrink-0">02</span>
              <p className="text-foreground/80 leading-relaxed pt-1.5">
                You will receive a tracking link and a direct line to our concierge for any bespoke requests.
              </p>
            </li>
          </ol>
          <div className="mt-10 border-t border-border pt-8 flex flex-wrap gap-4">
            <Button asChild variant="navy" size="lg"><Link to="/shop">Continue shopping</Link></Button>
            <Button asChild variant="outlineNavy" size="lg"><Link to="/contact">View order status</Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Confirmation;
