import { Truck, ShieldCheck, RotateCcw, Sparkles, type LucideIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanityContent";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  rotate: RotateCcw,
  sparkles: Sparkles,
};

const defaultItems = [
  { icon: "truck", title: "Nationwide Delivery", text: "Tracked shipping across South Africa, 2–4 working days." },
  { icon: "shield", title: "Secure Checkout", text: "Encrypted payments via Paystack & EFT." },
  { icon: "rotate", title: "Easy Returns", text: "14-day exchanges on unworn pieces." },
  { icon: "sparkles", title: "Crafted to Last", text: "Premium fabrics, considered construction." },
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
