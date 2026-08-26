type Env = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
  YOCO_SECRET_KEY: string;
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

export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    const { checkoutId } = (await request.json()) as {
      checkoutId?: string;
    };

    if (!checkoutId) {
      return json({ error: "checkoutId is required" }, 400);
    }

    if (!env.YOCO_SECRET_KEY) {
      return json({ error: "YOCO_SECRET_KEY is not configured" }, 500);
    }

    const response = await fetch(
      `https://payments.yoco.com/api/checkouts/${checkoutId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.YOCO_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      return json({ error: data.message || "Yoco error" }, 400);
    }

    return json({
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      reference: data.id,
      metadata: data.metadata,
    });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to verify checkout",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}