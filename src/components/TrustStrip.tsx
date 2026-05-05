import { Truck, ShieldCheck, RotateCcw, Sparkles } from "lucide-react";

const items = [
  { icon: Truck, title: "Nationwide Delivery", text: "Tracked shipping across South Africa, 2–4 working days." },
  { icon: ShieldCheck, title: "Secure Checkout", text: "Encrypted payments via PaySharp & EFT." },
  { icon: RotateCcw, title: "Easy Returns", text: "14-day exchanges on unworn pieces." },
  { icon: Sparkles, title: "Crafted to Last", text: "Premium fabrics, considered construction." },
];

const TrustStrip = () => (
  <section className="border-y border-border bg-secondary/40">
    <div className="container-prose grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-navy-deep font-medium">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TrustStrip;
