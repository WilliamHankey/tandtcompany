import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import ScrollToTop from "@/components/ScrollToTop";
import { useSiteSettings } from "@/hooks/useSanityContent";
import { initGA, pageView } from "@/lib/analytics";
import Index from "./pages/Index.tsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function Analytics() {
  const { data: settings } = useSiteSettings();
  const location = useLocation();

  useEffect(() => {
    if (settings?.enableAnalytics) {
      initGA();
    }
  }, [settings?.enableAnalytics]);

  useEffect(() => {
    if (settings?.enableAnalytics) {
      pageView(location.pathname + location.search);
    }
  }, [location.pathname, location.search, settings?.enableAnalytics]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Analytics />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/returns-policy" element={<ReturnsPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/_placeholder" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
