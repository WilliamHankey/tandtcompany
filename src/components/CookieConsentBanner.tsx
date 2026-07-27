import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "tandt_cookie_consent";

type Consent = "accepted" | "declined" | null;

export function getCookieConsent(): Consent {
  const val = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (val === "accepted" || val === "declined") return val;
  return null;
}

export function setCookieConsent(value: "accepted" | "declined") {
  localStorage.setItem(STORAGE_KEY, value);
}

const CookieConsentBanner = () => {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    setConsent(getCookieConsent());
  }, []);

  if (consent !== null) return null;

  const accept = () => {
    setCookieConsent("accepted");
    setConsent("accepted");
  };

  const decline = () => {
    setCookieConsent("declined");
    setConsent("declined");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy-deep text-cream p-4 md:p-6 shadow-2xl border-t border-cream/10">
      <div className="container-prose flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-2xl">
          <Cookie className="h-5 w-5 text-gold shrink-0 mt-0.5" />
          <div className="text-sm text-cream/80 leading-relaxed">
            <p>
              We use essential cookies for the shopping cart and checkout to function. With your consent, we also use analytics cookies to improve your experience.
            </p>
            <p className="mt-1">
              <Link to="/cookie-policy" className="text-gold link-underline text-xs">
                Learn more in our Cookie Policy
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outlineCream" size="sm" onClick={decline}>
            Decline
          </Button>
          <Button variant="gold" size="sm" onClick={accept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
