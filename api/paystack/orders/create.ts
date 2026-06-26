import { createClient } from "@sanity/client";

type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
};

type CartItem = {
  id: string; // this is the product SKU from the frontend
  qty: number;
};

const sanity = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID!,
  dataset: process.env.VITE_SANITY_DATASET!,
  apiVersion: process.env.VITE_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { customer, shipping, items } = req.body as {
      customer: {
        fullName: string;
        email: string;
        phone: string;
      };
      shipping: {
        delivery: string;
        country: string;
        address: string;
        city: string;
        postcode: string;
      };
      items: CartItem[];
    };

    if (!customer?.email || !items?.length) {
      return res.status(400).json({ error: "Invalid order" });
    }

    const cleanItems = items
      .filter((item) => item.id && Number.isInteger(item.qty) && item.qty > 0)
      .map((item) => ({
        id: item.id,
        qty: Math.min(item.qty, 20),
      }));

    if (!cleanItems.length) {
      return res.status(400).json({ error: "Invalid cart items" });
    }

    const skus = cleanItems.map((item) => item.id);

    const products = await sanity.fetch(
      `
      *[_type == "product" && sku in $skus]{
        _id,
        sku,
        title,
        price,
        inStock
      }
      `,
      { skus }
    );

    if (products.length !== cleanItems.length) {
      return res.status(400).json({
        error: "One or more products could not be found",
      });
    }

    const orderItems = products.map((product: any) => {
      const cart = cleanItems.find((item) => item.id === product.sku);

      if (!cart) {
        throw new Error(`Cart item not found for SKU ${product.sku}`);
      }

      if (!product.inStock) {
        throw new Error(`${product.title} is currently out of stock`);
      }

      return {
        productId: product.sku,
        sanityProductId: product._id,
        name: product.title,
        price: product.price,
        qty: cart.qty,
        lineTotal: product.price * cart.qty,
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.lineTotal,
      0
    );

    const shippingCost =
      shipping.delivery === "pickup" ? 0 : shipping.delivery === "pudo" ? 80 : 100;

    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shippingCost + tax;

    const reference = `TT-${Date.now().toString(36).toUpperCase()}`;

    const order = await sanity.create({
      _type: "order",
      reference,
      status: "pending",
      customer,
      shipping: {
        ...shipping,
        shippingCost,
      },
      items: orderItems,
      subtotal,
      tax,
      total,
      currency: "ZAR",
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({
      orderId: order._id,
      reference,
      total,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create order",
    });
  }
}