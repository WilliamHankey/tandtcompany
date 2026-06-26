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

async function sha512HmacHex(secret: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body)
  );

  return [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return json({ error: "Missing Paystack signature" }, 401);
    }

    const rawBody = await request.text();
    const hash = await sha512HmacHex(env.PAYSTACK_SECRET_KEY, rawBody);

    if (hash !== signature) {
      return json({ error: "Invalid Paystack signature" }, 401);
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: {
        status?: string;
        reference?: string;
        amount?: number;
        currency?: string;
        paid_at?: string;
      };
    };

    if (event.event !== "charge.success") {
      return json({ received: true });
    }

    const tx = event.data;

    if (!tx?.reference) {
      return json({ error: "Missing payment reference" }, 400);
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
      { reference: tx.reference }
    );

    if (!order) {
      return json({ error: "Order not found" }, 404);
    }

    const expectedAmount = Math.round(order.total * 100);

    if (
      tx.status === "success" &&
      tx.amount === expectedAmount &&
      tx.currency === order.currency
    ) {
      await sanityPatch(env, order._id, {
        status: "paid",
        "paystack.paidAt": tx.paid_at,
        "paystack.rawVerifyResponse": rawBody,
      });
    }

    return json({ received: true });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}