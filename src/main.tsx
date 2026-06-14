import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Handle stale Vite chunks after deployment
window.addEventListener("vite:preloadError", () => {
  if (!sessionStorage.getItem("vite-reloaded")) {
    sessionStorage.setItem("vite-reloaded", "true");
    location.reload();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
