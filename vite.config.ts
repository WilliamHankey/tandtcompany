import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function paystackDevApi(): Plugin {
  return {
    name: "paystack-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/paystack/initialize", async (req, res, next) => {
        if (req.method !== "POST") return next();
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "PAYSTACK_SECRET_KEY is not configured" }));
          return;
        }
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const { email, amount, reference, metadata } = JSON.parse(body);
            const response = await fetch("https://api.paystack.co/transaction/initialize", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${secret}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, amount, reference, currency: "ZAR", metadata }),
            });
            const data = await response.json();
            res.setHeader("Content-Type", "application/json");
            if (!data.status) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: data.message }));
              return;
            }
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                authorization_url: data.data.authorization_url,
                access_code: data.data.access_code,
                reference: data.data.reference,
              })
            );
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Failed to initialize payment" }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), paystackDevApi(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
