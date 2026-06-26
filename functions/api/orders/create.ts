type Env = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
};

type CartItem = {
  id: string;
  qty: number;
};

type OrderRequestBody = {
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

type FunctionContext = {
  request: Request;
  env: Env;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function sanityFetch<T>(
  env: Env,
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const url = `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/query/${env.VITE_SANITY_DATASET}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, params }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.description || "Sanity query failed");
  }

  return data.result as T;
}

async function sanityCreate(env: Env, document: Record<string, unknown>) {
  const url = `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/mutate/${env.VITE_SANITY_DATASET}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ create: document }],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.description || "Sanity create failed");
  }

  return data.results?.[0]?.document;
}

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const { customer, shipping, items } =
      (await request.json()) as OrderRequestBody;

    if (!customer?.email || !items?.length) {
      return json({ error: "Invalid order" }, 400);
    }

    const cleanItems = items
      .filter((item) => item.id && Number.isInteger(item.qty) && item.qty > 0)
      .map((item) => ({
        id: item.id,
        qty: Math.min(item.qty, 20),
      }));

    if (!cleanItems.length) {
      return json({ error: "Invalid cart items" }, 400);
    }

    const skus = cleanItems.map((item) => item.id);

    const products = await sanityFetch<
  {
    _id: string;
    sku: string;
    title: string;
    price: number;
    inStock?: boolean;
  }[]
>(
  env,
  `*[_type == "product" && sku in $skus]{
    _id,
    sku,
    title,
    price,
    inStock
  }`,
  { skus }
);

    if (products.length !== cleanItems.length) {
      return json(
        {
          error: "One or more products could not be found",
          sentSkus: skus,
          foundProducts: products.map((p) => ({
            _id: p._id,
            sku: p.sku,
            title: p.title,
          })),
          sanityProjectId: env.VITE_SANITY_PROJECT_ID,
          sanityDataset: env.VITE_SANITY_DATASET,
        },
        400
      );
    }

    const orderItems = products.map((product) => {
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

    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

    const shippingCost =
      shipping.delivery === "pickup" ? 0 : shipping.delivery === "pudo" ? 80 : 100;

    const tax = Math.round(subtotal * 0.08);
    const total = subtotal + shippingCost + tax;

    const reference = `TT-${Date.now().toString(36).toUpperCase()}`;

    const order = await sanityCreate(env, {
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

    return json({
      orderId: order?._id,
      reference,
      total,
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}