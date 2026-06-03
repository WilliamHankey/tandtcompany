import { useEffect, useState } from "react";
import { Truck, ShieldCheck, MessageCircle, type LucideIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanityContent";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  message: MessageCircle,
};

const defaultMessages = [
  { icon: "truck" as const, text: "Complimentary shipping on orders over R1 000" },
  { icon: "shield" as const, text: "Secure checkout · 14-day easy returns" },
  { icon: "message" as const, text: "Need help? Chat with us on WhatsApp" },
];

const AnnouncementBar = () => {
  const { data: settings } = useSiteSettings();
  const messages =
    settings?.announcements?.length
      ? settings.announcements.map((m: { icon?: string; text?: string }) => ({
          icon: (m.icon || "truck") as keyof typeof iconMap,
          text: m.text || "",
        }))
      : defaultMessages;

  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, [messages.length]);

  const key = messages[i]?.icon || "truck";
  const Active = iconMap[key] || Truck;

  return (
    <div className="bg-navy-deep text-cream/90 text-[0.7rem] tracking-[0.18em] uppercase">
      <div className="container-prose h-9 flex items-center justify-center gap-2">
        <Active className="h-3.5 w-3.5 text-gold" />
        <span className="animate-fade-in" key={i}>
          {messages[i]?.text}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
