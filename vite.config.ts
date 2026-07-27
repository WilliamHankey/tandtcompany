import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function readBody(req: import("http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: string) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: import("http").ServerResponse, data: unknown, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

async function parseJson<T = unknown>(res: globalThis.Response): Promise<T> {
  return res.json() as Promise<T>;
}

function createSanityHelpers(env: Record<string, string>) {
  const sanityFetch = async <T>(query: string, params: Record<string, unknown> = {}): Promise<T> => {
    const projectId = env.VITE_SANITY_PROJECT_ID;
    const dataset = env.VITE_SANITY_DATASET || "production";
    const apiVersion = env.VITE_SANITY_API_VERSION || "2024-05-22";
    const token = env.SANITY_API_TOKEN;

    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
    console.log("[sanityFetch] env vars", { projectId, dataset, apiVersion, hasToken: !!token, tokenPrefix: token?.slice(0, 10) });
    console.log("[sanityFetch] POST", url, { query, params });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, params }),
    });
    console.log("[sanityFetch] response status", res.status, res.statusText);
    const data = await parseJson<{ result: T; error?: { description?: string } }>(res);
    console.log("[sanityFetch] response body", JSON.stringify(data));
    if (!res.ok) throw new Error(data?.error?.description || "Sanity query failed");
    return data.result as T;
  };

  const sanityCreate = async (document: Record<string, unknown>) => {
    const projectId = env.VITE_SANITY_PROJECT_ID;
    const dataset = env.VITE_SANITY_DATASET || "production";
    const apiVersion = env.VITE_SANITY_API_VERSION || "2024-05-22";
    const token = env.SANITY_API_TOKEN;

    const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
    console.log("[sanityCreate] POST", url);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations: [{ create: document }] }),
    });
    console.log("[sanityCreate] response status", res.status, res.statusText);
    const data = await parseJson<{ results?: { document: { _id: string } }[]; error?: { description?: string } }>(res);
    console.log("[sanityCreate] response body", JSON.stringify(data));
    if (!res.ok) throw new Error(data?.error?.description || "Sanity create failed");
    return data.results?.[0]?.document;
  };

  return { sanityFetch, sanityCreate };
}

function paystackDevApi(env: Record<string, string>): Plugin {
  const { sanityFetch } = createSanityHelpers(env);
  return {
    name: "paystack-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/paystack/initialize", async (req, res, next) => {
        if (req.method !== "POST") return next();
        const secret = env.PAYSTACK_SECRET_KEY;
        if (!secret) {
          return sendJson(res, { error: "PAYSTACK_SECRET_KEY is not configured" }, 500);
        }
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const { reference } = JSON.parse(body) as { reference?: string };
            if (!reference) {
              return sendJson(res, { error: "reference is required" }, 400);
            }

            const order = await sanityFetch<{
              _id: string;
              reference: string;
              total: number;
              currency?: string;
              customer: { email: string };
            }>(
              `*[_type == "order" && reference == $reference][0]{ _id, reference, total, currency, customer }`,
              { reference }
            );

            if (!order) {
              return sendJson(res, { error: "Order not found" }, 404);
            }

            const response = await fetch("https://api.paystack.co/transaction/initialize", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${secret}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: order.customer.email,
                amount: Math.round(order.total * 100),
                reference: order.reference,
                currency: order.currency || "ZAR",
                metadata: { orderId: order._id, reference: order.reference },
              }),
            });
            const data = await parseJson<{ status: boolean; message?: string; data?: { authorization_url: string; access_code: string; reference: string } }>(response);
            if (!data.status) {
              return sendJson(res, { error: data.message }, 400);
            }
            sendJson(res, {
              authorization_url: data.data!.authorization_url,
              access_code: data.data!.access_code,
              reference: data.data!.reference,
            });
          } catch (err) {
            sendJson(res, { error: err instanceof Error ? err.message : "Failed to initialize payment" }, 500);
          }
        });
      });
    },
  };
}

function ordersCreateApi(env: Record<string, string>): Plugin {
  const { sanityFetch, sanityCreate } = createSanityHelpers(env);
  return {
    name: "orders-create-api",
    configureServer(server) {
      server.middlewares.use("/api/orders/create", async (req, res, next) => {
        console.log("[/api/orders/create] received request", req.method);
        if (req.method !== "POST") return next();
        try {
          const body = JSON.parse(await readBody(req)) as {
            customer: { email: string; fullName: string; phone: string };
            shipping: { delivery: string; country: string; address: string; city: string; postcode: string };
            items: { id: string; qty: number }[];
          };
          console.log("[/api/orders/create] parsed body", JSON.stringify(body));
          const { customer, shipping, items } = body;

          if (!customer?.email || !items?.length) {
            console.log("[/api/orders/create] invalid: missing email or items");
            return sendJson(res, { error: "Invalid order" }, 400);
          }

          const cleanItems = items
            .filter((i) => i.id && Number.isInteger(i.qty) && i.qty > 0)
            .map((i) => ({ id: i.id, qty: Math.min(i.qty, 20) }));
          console.log("[/api/orders/create] cleanItems", cleanItems);

          if (!cleanItems.length) {
            console.log("[/api/orders/create] no valid items after cleaning");
            return sendJson(res, { error: "Invalid cart items" }, 400);
          }

          const skus = cleanItems.map((i) => i.id);
          console.log("[/api/orders/create] querying Sanity for skus", skus);
          const products = await sanityFetch<{ _id: string; sku: string; title: string; price: number; inStock?: boolean }[]>(
            `*[_type == "product" && sku in $skus]{ _id, sku, title, price, inStock }`,
            { skus }
          );
          console.log("[/api/orders/create] sanityFetch returned", products?.length, "products", JSON.stringify(products));

          if (products.length !== cleanItems.length) {
            console.log("[/api/orders/create] mismatch: cleanItems", cleanItems, "products", products);
            return sendJson(res, { error: "One or more products could not be found" }, 400);
          }

          const orderItems = products.map((product) => {
            const cart = cleanItems.find((i) => i.id === product.sku);
            if (!cart) throw new Error(`Cart item not found for SKU ${product.sku}`);
            if (!product.inStock) throw new Error(`${product.title} is currently out of stock`);
            return {
              productId: product.sku,
              sanityProductId: product._id,
              name: product.title,
              price: product.price,
              qty: cart.qty,
              lineTotal: product.price * cart.qty,
            };
          });
          console.log("[/api/orders/create] orderItems", orderItems);

          const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
          const shippingCost = shipping.delivery === "pickup" ? 0 : shipping.delivery === "pudo" ? 80 : 100;
          const tax = Math.round(subtotal * 0.08);
          const total = subtotal + shippingCost + tax;
          const reference = `TT-${Date.now().toString(36).toUpperCase()}`;
          console.log("[/api/orders/create] totals", { subtotal, shippingCost, tax, total, reference });

          console.log("[/api/orders/create] creating Sanity order doc");
          const order = await sanityCreate({
            _type: "order",
            reference,
            status: "pending",
            customer,
            shipping: { ...shipping, shippingCost },
            items: orderItems,
            subtotal,
            tax,
            total,
            currency: "ZAR",
            createdAt: new Date().toISOString(),
          });
          console.log("[/api/orders/create] sanityCreate returned", order);

          sendJson(res, { orderId: order?._id, reference, total });
        } catch (err) {
          console.log("[/api/orders/create] caught error", err);
          sendJson(res, { error: err instanceof Error ? err.message : "Failed to create order" }, 500);
        }
      });
    },
  };
}

function emailsDevApi(env: Record<string, string>): Plugin {
  return {
    name: "emails-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/emails/contact", async (req, res, next) => {
        if (req.method !== "POST") return next();
        const apiKey = env.RESEND_API_KEY;
        const fromEmail = env.RESEND_FROM_EMAIL || "orders@tandtcompany.com";
        if (!apiKey) {
          return sendJson(res, { error: "RESEND_API_KEY is not configured" }, 500);
        }
        try {
          const { name, email, message } = JSON.parse(await readBody(req)) as { name: string; email: string; message: string };
          if (!name || !email || !message) {
            return sendJson(res, { error: "Name, email, and message are required" }, 400);
          }
          const { Resend } = await import("resend");
          const resend = new Resend(apiKey);
          const { error } = await resend.emails.send({
            from: fromEmail,
            to: "stewardship@tandtcompany.com",
            replyTo: email,
            subject: `New Contact Form Submission from ${name}`,
            html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;"><h2 style="color:#071726;">New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/><p style="white-space:pre-wrap;">${message}</p></div>`,
          });
          if (error) return sendJson(res, { error: error.message }, 500);
          sendJson(res, { success: true });
        } catch (err) {
          sendJson(res, { error: err instanceof Error ? err.message : "Failed to send email" }, 500);
        }
      });

      server.middlewares.use("/api/paystack/verify", async (req, res, next) => {
        if (req.method !== "POST") return next();
        const secret = env.PAYSTACK_SECRET_KEY;
        if (!secret) {
          return sendJson(res, { error: "PAYSTACK_SECRET_KEY is not configured" }, 500);
        }
        try {
          const { reference } = JSON.parse(await readBody(req)) as { reference: string };
          if (!reference) return sendJson(res, { error: "reference is required" }, 400);
          const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${secret}` },
          });
          const data = await parseJson<{ status: boolean; message?: string; data?: unknown }>(response);
          if (!data.status) return sendJson(res, { error: data.message }, 400);
          sendJson(res, data.data);
        } catch (err) {
          sendJson(res, { error: err instanceof Error ? err.message : "Verification failed" }, 500);
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
      watch: { ignored: ["**/.env"] },
    },
    plugins: [react(), paystackDevApi(env), ordersCreateApi(env), emailsDevApi(env), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
