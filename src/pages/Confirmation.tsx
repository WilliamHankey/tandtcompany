import { Link, useLocation, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const Confirmation = () => {
  const { state } = useLocation() as { state?: { ref?: string; email?: string } };
  if (!state?.ref) return <Navigate to="/" replace />;

  return (
    <Layout>
      <section className="container-prose pt-40 pb-32 max-w-2xl text-center">
        <p className="eyebrow">Thank you</p>
        <div className="hairline mx-auto mt-6 mb-8" />
        <h1 className="font-serif text-5xl md:text-6xl leading-tight">Your order is in.</h1>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          We're grateful you chose to wear something made with intention. A confirmation has been sent to{" "}
          <span className="text-foreground">{state.email}</span>.
        </p>
        <div className="mt-10 inline-block px-8 py-6 bg-secondary/60">
          <p className="eyebrow">Order reference</p>
          <p className="font-serif text-2xl mt-2 tracking-wider">{state.ref}</p>
        </div>
        <p className="mt-10 text-sm text-muted-foreground leading-relaxed">
          Your order will be fulfilled via WhatsApp or email. We'll reach out shortly with the secure PaySharp payment link and delivery details.
        </p>
        <Button asChild variant="navy" size="lg" className="mt-10"><Link to="/shop">Continue browsing</Link></Button>
      </section>
    </Layout>
  );
};

export default Confirmation;
