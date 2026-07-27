import { Truck, ShieldCheck, RotateCcw, Sparkles, Star, type LucideIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanityContent";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  rotate: RotateCcw,
  sparkles: Sparkles,
  star: Star,
};

const defaultItems = [
  { icon: "truck", title: "Nationwide Delivery", text: "Tracked shipping across South Africa, 2–7 working days." },
  { icon: "shield", title: "Secure Checkout", text: "PCI DSS Level 1 certified. 256-bit SSL encryption via Paystack." },
  { icon: "rotate", title: "30-Day Returns", text: "Hassle-free returns on unworn items within 30 days." },
  { icon: "sparkles", title: "Crafted to Last", text: "Premium fabrics, considered construction, ethically made." },
];

const TrustStrip = () => {
  const { data: settings } = useSiteSettings();
  const items =
    settings?.trustItems?.length
      ? settings.trustItems
      : defaultItems;

  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="container-prose grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
        {items.map((item: { icon?: string; title: string; text: string }) => {
          const Icon = iconMap[item.icon || "truck"] || Truck;
          return (
            <div key={item.title} className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-navy-deep font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustStrip;
