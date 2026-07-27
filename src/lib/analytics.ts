const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function loadGtagScript(id: string) {
  if (document.querySelector(`script[src*="${id}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
}

export function initGA(measurementId?: string) {
  const id = measurementId || GA_MEASUREMENT_ID;
  if (!id || typeof window === "undefined") return;
  loadGtagScript(id);
}

export function pageView(url: string) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: url });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", name, params);
}
