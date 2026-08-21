type Env = {
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

/**
 * Registers a webhook endpoint with Yoco.
 *
 * Yoco's current Checkout API does NOT expose a webhook URL field in the
 * dashboard. Registration is done server-side via the API:
 *   POST https://payments.yoco.com/api/webhooks
 *   { "name": "...", "url": "https://<site>/api/yoco/webhook" }
 *
 * The response contains `secret` (a `whsec_...` value) which is shown ONLY
 * ONCE. Save it immediately as the YOCO_WEBHOOK_SECRET env variable.
 *
 * NOTE: This endpoint is intended to be called once (e.g. via a secure admin
 * script or curl). It should not be publicly exposed in production.
 */
export async function onRequestPost({ request, env }: FunctionContext) {
  try {
    if (!env.YOCO_SECRET_KEY) {
      return json({ error: "YOCO_SECRET_KEY is not configured" }, 500);
    }

    const { url, name } = (await request.json().catch(() => ({}))) as {
      url?: string;
      name?: string;
    };

    if (!url) {
      return json({ error: "url is required" }, 400);
    }

    const res = await fetch("https://payments.yoco.com/api/webhooks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.YOCO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name || "tandt-store-webhook",
        url,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return json({ error: data?.message || "Yoco webhook registration failed" }, res.status);
    }

    // IMPORTANT: `secret` is only returned this one time.
    return json({
      message:
        "Webhook registered. Copy `secret` now and set it as YOCO_WEBHOOK_SECRET in your environment.",
      id: data.id,
      name: data.name,
      url: data.url,
      secret: data.secret,
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      500
    );
  }
}

export function onRequest() {
  return json({ error: "Method not allowed" }, 405);
}
