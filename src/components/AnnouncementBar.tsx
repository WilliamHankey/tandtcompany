import { useEffect, useState } from "react";
import { Truck, ShieldCheck, MessageCircle, type LucideIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanityContent";

const iconMap: Record<string, LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  message: MessageCircle,
};

const AnnouncementBar = () => {
  const { data: settings } = useSiteSettings();
  const raw = (settings as { announcements?: { icon?: string; text?: string }[] } | undefined);
  const messages = raw?.announcements?.filter((m) => m.text) || [];

  const [i, setI] = useState(0);
  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, [messages.length]);

  if (messages.length === 0) return null;

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
