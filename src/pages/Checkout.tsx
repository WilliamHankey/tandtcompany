import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { formatZAR } from "@/data/products";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  address: z.string().trim().min(5, "Please enter a delivery address").max(500),
});

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-prose pt-40 pb-32 text-center">
          <h1 className="font-serif text-3xl">Your bag is empty</h1>
          <Button asChild variant="navy" className="mt-8"><Link to="/shop">Visit the shop</Link></Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const ref = "TT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setTimeout(() => {
      clear();
      toast.success("Order received", { description: "Reference " + ref });
      navigate("/confirmation", { state: { ref, email: form.email } });
    }, 900);
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <Layout>
      <section className="container-prose pt-36 pb-24">
        <p className="eyebrow">Checkout</p>
        <h1 className="font-serif text-5xl md:text-6xl mt-4">Almost there.</h1>

        <div className="mt-12 grid lg:grid-cols-5 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6" noValidate>
            <h2 className="font-serif text-2xl">Your details</h2>
            <div>
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={form.fullName} onChange={set("fullName")} className="mt-2" />
              {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={set("email")} className="mt-2" />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={set("phone")} className="mt-2" />
                {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="address">Delivery address</Label>
              <Textarea id="address" value={form.address} onChange={set("address")} className="mt-2" rows={4} />
              {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="font-serif text-2xl">Payment</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Payments are processed securely via PaySharp. After placing your order, we'll be in touch via WhatsApp or email with the secure payment link and fulfilment details.
              </p>
            </div>

            <Button type="submit" variant="navy" size="lg" disabled={submitting} className="w-full">
              {submitting ? "Placing order…" : "Place order"}
            </Button>
          </form>

          <aside className="lg:col-span-2 bg-secondary/60 p-8 h-fit lg:sticky lg:top-28">
            <h3 className="font-serif text-2xl">Order summary</h3>
            <ul className="mt-6 space-y-4">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-serif text-base leading-tight">{product.name}</p>
                    <p className="text-muted-foreground mt-1">Qty {qty}</p>
                  </div>
                  <span className="text-sm tabular-nums">{formatZAR(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border my-6" />
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="tabular-nums">{formatZAR(subtotal)}</span></div>
            <div className="flex justify-between text-sm text-muted-foreground mt-2"><span>Shipping</span><span>Confirmed at fulfilment</span></div>
            <div className="border-t border-border my-6" />
            <div className="flex justify-between font-serif text-xl"><span>Total</span><span className="tabular-nums">{formatZAR(subtotal)}</span></div>
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
