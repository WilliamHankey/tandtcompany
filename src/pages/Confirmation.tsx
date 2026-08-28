import { Link, useLocation, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Ticket, MailCheck, Truck, Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { formatDispatchDate } from "@/lib/dispatch";

const Confirmation = () => {
  const { state } = useLocation() as { state?: { ref?: string; email?: string } };
  if (!state?.ref) return <Navigate to="/" replace />;

  return (
    <Layout>
      <SEO title="Order Confirmation" description="Your order has been confirmed. Thank you for shopping with T AND T COMPANY." noindex />
      <section className="container-prose pt-32 pb-24 max-w-3xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight text-navy">
            Order Confirmed
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Thank you for your order. We are honoured to be part of your story. Your commitment to a life rooted in faith and crafted for purpose inspires everything we do at T AND T COMPANY.
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
            <p className="mt-3 text-foreground/80">A receipt and order summary have been sent to <strong>{state.email}</strong>.</p>
          </div>
        </div>

        <div className="h-1 bg-border/60 max-w-[92%] mx-auto" />

        <div className="mt-16 border-l-2 border-gold pl-8">
          <h2 className="font-serif text-2xl text-navy">What happens next?</h2>
          <p className="mt-3 text-foreground/80 leading-relaxed">
            We dispatch orders on <strong>Tuesdays and Thursdays</strong>. Your order will be sent out on <strong>{formatDispatchDate()}</strong>.
          </p>
          <ol className="mt-8 space-y-7">
            <li className="flex gap-5">
              <span className="font-serif text-gold border border-gold/40 w-10 h-10 grid place-items-center shrink-0">01</span>
              <div className="pt-1.5">
                <p className="font-medium text-navy">Order Processing</p>
                <p className="text-foreground/80 leading-relaxed mt-1">
                  Your order will be processed within 2–4 business days. You will receive a dispatch notification via email.
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="font-serif text-gold border border-gold/40 w-10 h-10 grid place-items-center shrink-0">02</span>
              <div className="pt-1.5">
                <p className="font-medium text-navy">Shipping & Tracking</p>
                <p className="text-foreground/80 leading-relaxed mt-1">
                  Once dispatched, you will receive a tracking number and delivery estimates via email. You can also contact us for updates.
                </p>
              </div>
            </li>
            <li className="flex gap-5">
              <span className="font-serif text-gold border border-gold/40 w-10 h-10 grid place-items-center shrink-0">03</span>
              <div className="pt-1.5">
                <p className="font-medium text-navy">Delivery</p>
                <p className="text-foreground/80 leading-relaxed mt-1">
                  Your order will be delivered to the address provided. Please ensure someone is available to receive the package.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-12 bg-cream border border-border p-6">
            <p className="eyebrow !text-gold mb-3">Need Help?</p>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about your order, we're here to help.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outlineNavy" size="sm" className="!border-gold !text-gold hover:!bg-gold hover:!text-cream">
                <a href="https://wa.me/27614852498" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-3.5 w-3.5 mr-2" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outlineNavy" size="sm" className="!border-gold !text-gold hover:!bg-gold hover:!text-cream">
                <a href="mailto:stewardship@tandtcompany.com">
                  <MailCheck className="h-3.5 w-3.5 mr-2" />
                  Email Support
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-10 border-t border-border pt-8 flex flex-wrap gap-4">
            <Button asChild variant="navy" size="lg"><Link to="/shop">Continue shopping</Link></Button>
            <Button asChild variant="outlineNavy" size="lg"><Link to="/contact">Contact us</Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Confirmation;
