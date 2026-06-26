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
      return json({ error: "Payment reference is required" }, 400);
    }

    const order = await sanityFetch<{
      _id: string;
      reference: string;
      status: string;
      total: number;
      currency: string;
    }>(
      env,
      `*[_type == "order" && reference == $reference][0]{
        _id,
        reference,
        status,
        total,
        currency
      }`,
      { reference }
    );

    if (!order) {
      return json({ error: "Order not found" }, 404);
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return json({ error: data.message || "Could not verify payment" }, 400);
    }

    const tx = data.data;
    const expectedAmount = Math.round(order.total * 100);

    if (tx.status !== "success") {
      return json({ error: "Payment was not successful" }, 400);
    }

    if (tx.amount !== expectedAmount) {
      return json({ error: "Payment amount mismatch" }, 400);
    }

    if (tx.currency !== order.currency) {
      return json({ error: "Payment currency mismatch" }, 400);
    }

    await sanityPatch(env, order._id, {
      status: "paid",
      "paystack.paidAt": tx.paid_at,
      "paystack.rawVerifyResponse": JSON.stringify(data),
    });

    return json({
      status: "success",
      reference: tx.reference,
      orderId: order._id,
    });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error ? error.message : "Payment verification failed",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}