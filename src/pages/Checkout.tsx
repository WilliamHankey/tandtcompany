import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { formatZAR } from "@/types/product";
import { useSiteSettings } from "@/hooks/useSanityContent";
import { payWithPaystack } from "@/lib/paystack";
import { toast } from "sonner";
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  country: z.string().trim().min(2).max(100),
  address: z.string().trim().min(5).max(500),
  city: z.string().trim().min(2).max(100),
  postcode: z.string().trim().min(3).max(20),
});

const defaultDelivery = [
  { id: "pickup" as const, name: "Pick-up", price: 0, sub: "Collect from our primary location." },
  { id: "pudo" as const, name: "Pudo", price: 80, sub: "Secure locker-to-locker delivery." },
  { id: "courier" as const, name: "Courier Guy", price: 100, sub: "Door-to-door delivery across the region." },
];

type DeliveryOpt = "pickup" | "pudo" | "courier";

const SectionHeader = ({ n, title }: { n: string; title: string }) => (
  <div className="flex items-baseline gap-3 mb-6">
    <span className="font-serif text-gold text-sm">{n}</span>
    <h2 className="font-serif text-2xl text-navy">{title}</h2>
  </div>
);

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "South Africa",
    address: "",
    city: "",
    postcode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [delivery, setDelivery] = useState<DeliveryOpt>("pickup");
  const [submitting, setSubmitting] = useState(false);

  const deliveryOptions =
    settings?.shippingOptions?.length
      ? settings.shippingOptions.map((d: { id: string; name: string; price: number; description?: string }) => ({
          id: d.id as DeliveryOpt,
          name: d.name,
          price: d.price,
          sub: d.description || "",
        }))
      : defaultDelivery;

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-prose pt-40 pb-32 text-center">
          <h1 className="font-serif text-3xl">Your bag is empty</h1>
          <Button asChild variant="navy" className="mt-8">
            <Link to="/shop">Visit the shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const shippingCost = deliveryOptions.find((d) => d.id === delivery)?.price ?? 0;
  const taxRate = settings?.taxRate ?? 0.08;
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + shippingCost + tax;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const ref = "TT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    const completeOrder = (paymentRef: string) => {
      clear();
      toast.success("Payment received", { description: `Reference ${paymentRef}` });
      navigate("/confirmation", {
        state: { ref: paymentRef, email: form.email },
      });
    };

    if (!paystackKey) {
      setTimeout(() => {
        completeOrder(ref);
        setSubmitting(false);
      }, 800);
      return;
    }

    try {
      await payWithPaystack({
        email: form.email,
        amountZar: total,
        reference: ref,
        metadata: {
          fullName: form.fullName,
          phone: form.phone,
          delivery,
          items: items.map((i) => ({ id: i.product.id, qty: i.qty })),
        },
        onSuccess: (paymentRef) => {
          completeOrder(paymentRef);
          setSubmitting(false);
        },
        onCancel: () => {
          setSubmitting(false);
          toast.info("Payment cancelled");
        },
      });
    } catch (err) {
      setSubmitting(false);
      toast.error("Payment failed", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    }
  };

  return (
    <Layout>
      <section className="container-prose pt-32 pb-24">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-navy">Checkout</h1>
          <div className="hairline mx-auto mt-6 bg-gold" />
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-3 gap-12" noValidate>
          <div className="lg:col-span-2 space-y-14">
            <div>
              <SectionHeader n="01" title="Delivery Details" />
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullName" className="eyebrow">Full Name</Label>
                  <Input id="fullName" placeholder="Enter your full name" className="mt-2" value={form.fullName} onChange={set("fullName")} />
                  {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="eyebrow">Email Address</Label>
                  <Input id="email" type="email" placeholder="email@example.com" className="mt-2" value={form.email} onChange={set("email")} />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="eyebrow">Phone Number</Label>
                  <Input id="phone" placeholder="+27 (00) 000-0000" className="mt-2" value={form.phone} onChange={set("phone")} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="eyebrow">Country / Region</Label>
                  <Input id="country" placeholder="South Africa" className="mt-2" value={form.country} onChange={set("country")} />
                  {errors.country && <p className="text-destructive text-xs mt-1">{errors.country}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address" className="eyebrow">Street Address</Label>
                  <Input id="address" placeholder="House number and street name" className="mt-2" value={form.address} onChange={set("address")} />
                  {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="city" className="eyebrow">Town / City</Label>
                  <Input id="city" placeholder="City" className="mt-2" value={form.city} onChange={set("city")} />
                  {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="postcode" className="eyebrow">Postcode / ZIP</Label>
                  <Input id="postcode" placeholder="00000" className="mt-2" value={form.postcode} onChange={set("postcode")} />
                  {errors.postcode && <p className="text-destructive text-xs mt-1">{errors.postcode}</p>}
                </div>
              </div>
            </div>

            <div>
              <SectionHeader n="02" title="Delivery Option" />
              <div className="grid sm:grid-cols-3 gap-4">
                {deliveryOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDelivery(opt.id)}
                    className={`text-left border p-5 transition-all ${
                      delivery === opt.id ? "border-gold bg-cream shadow-elegant" : "border-border hover:border-navy"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-serif text-navy">{opt.name}</p>
                        <p className="font-serif text-gold mt-1">{opt.price === 0 ? "Free" : formatZAR(opt.price)}</p>
                      </div>
                      <span className={`h-4 w-4 rounded-full border ${delivery === opt.id ? "border-gold bg-gold" : "border-border"}`} />
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader n="03" title="Payment Method" />
              <div className="border border-border p-6 bg-cream">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <ShieldCheck className="h-5 w-5 text-navy" />
                  <p className="font-serif text-navy">Secure payment via Paystack</p>
                </div>
                <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                  When you click Complete Purchase, a secure Paystack window opens to pay by card, bank transfer, or mobile money. Your order is confirmed once payment succeeds.
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>256-bit encrypted · PCI DSS compliant</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 h-fit border-t-2 border-gold bg-cream border border-border p-8 shadow-elegant">
            <h3 className="font-serif text-2xl text-navy">Order Summary</h3>
            <ul className="mt-6 space-y-5">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-serif text-navy leading-tight">{product.name}</p>
                    <p className="text-muted-foreground mt-1 text-xs">Qty {qty}</p>
                    <p className="text-gold font-serif mt-1 tabular-nums">{formatZAR(product.price * qty)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border my-6" />
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{formatZAR(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="tabular-nums">{shippingCost === 0 ? "Free" : formatZAR(shippingCost)}</span></div>
              <div className="flex justify-between"><span>Taxes (Est.)</span><span className="tabular-nums">{formatZAR(tax)}</span></div>
            </div>
            <div className="border-t border-border my-6" />
            <div className="flex justify-between items-baseline">
              <span className="font-serif text-2xl text-navy">Total</span>
              <span className="font-serif text-2xl text-gold tabular-nums">{formatZAR(total)}</span>
            </div>
            <Button type="submit" variant="gold" size="lg" disabled={submitting} className="w-full mt-8">
              {submitting ? "Opening payment…" : "Complete Purchase"}
            </Button>
            <div className="mt-6 flex items-center justify-center gap-5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <Truck className="h-4 w-4" />
              <RotateCcw className="h-4 w-4" />
            </div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground text-center mt-3">
              Secure checkout · Global shipping · 30-day returns
            </p>
          </aside>
        </form>
      </section>
    </Layout>
  );
};

export default Checkout;
