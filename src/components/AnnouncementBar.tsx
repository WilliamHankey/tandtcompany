import { useEffect, useState } from "react";
import { Truck, ShieldCheck, MessageCircle } from "lucide-react";

const messages = [
  { icon: Truck, text: "Complimentary shipping on orders over R1 000" },
  { icon: ShieldCheck, text: "Secure checkout · 14-day easy returns" },
  { icon: MessageCircle, text: "Need help? Chat with us on WhatsApp" },
];

const AnnouncementBar = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, []);
  const Active = messages[i].icon;
  return (
    <div className="bg-navy-deep text-cream/90 text-[0.7rem] tracking-[0.18em] uppercase">
      <div className="container-prose h-9 flex items-center justify-center gap-2">
        <Active className="h-3.5 w-3.5 text-gold" />
        <span className="animate-fade-in" key={i}>{messages[i].text}</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
