type Env = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
  PAYSTACK_SECRET_KEY: string;
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

async function sanityPatch(env: Env, id: string, set: Record<string, unknown>) {
  const url = `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/mutate/${env.VITE_SANITY_DATASET}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mutations: [{ patch: { id, set } }],
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error?.description || "Sanity patch failed");
  }
}

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const { reference } = (await request.json()) as { reference?: string };

    if (!reference) {
      return json({ error: "reference is required" }, 400);
    }

    if (!env.PAYSTACK_SECRET_KEY) {
      return json({ error: "PAYSTACK_SECRET_KEY is not configured" }, 500);
    }

    const order = await sanityFetch<{
      _id: string;
      reference: string;
      total: number;
      currency?: string;
      customer: { email: string };
    }>(
      env,
      `*[_type == "order" && reference == $reference][0]{
        _id,
        reference,
        total,
        currency,
        customer
      }`,
      { reference }
    );

    if (!order) {
      return json({ error: "Order not found" }, 404);
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: order.customer.email,
        amount: Math.round(order.total * 100),
        reference: order.reference,
        currency: order.currency || "ZAR",
        metadata: {
          orderId: order._id,
          reference: order.reference,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return json({ error: data.message || "Paystack error" }, 400);
    }

    await sanityPatch(env, order._id, {
      "paystack.accessCode": data.data.access_code,
      "paystack.authorizationUrl": data.data.authorization_url,
    });

    return json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to initialize payment",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}