type StockEnv = {
  VITE_SANITY_PROJECT_ID: string;
  VITE_SANITY_DATASET: string;
  VITE_SANITY_API_VERSION: string;
  SANITY_API_TOKEN: string;
};

type StockItem = {
  productId?: string;
  qty: number;
  size?: string;
  color?: string;
};

type SanitySizeEntry = {
  _key: string;
  stock?: number;
  customSize?: string | null;
  size?: { label?: string } | null;
};

type SanityColorEntry = {
  _key: string;
  name?: string;
  stock?: number;
};

type SanityProductStock = {
  _id: string;
  sizes?: SanitySizeEntry[];
  colors?: SanityColorEntry[];
};

const sanityApiUrl = (
  env: StockEnv,
  path: "query" | "mutate"
) =>
  `https://${env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v${env.VITE_SANITY_API_VERSION}/data/${path}/${env.VITE_SANITY_DATASET}`;

async function sanityFetch<T>(
  env: StockEnv,
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(sanityApiUrl(env, "query"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, params }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.description || "Sanity query failed");
  return data.result as T;
}

async function sanityPatch(env: StockEnv, id: string, set: Record<string, unknown>) {
  const res = await fetch(sanityApiUrl(env, "mutate"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SANITY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations: [{ patch: { id, set } }] }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.description || "Sanity patch failed");
}

/**
 * Decrement product size stock after a payment succeeds.
 *
 * For each line item we look up the product by SKU, find the matching size
 * entry, and subtract the purchased quantity (floored at 0).
 */
export async function decrementStockForOrder(
  env: StockEnv,
  items: StockItem[]
): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = [];
  let updated = 0;

  for (const item of items || []) {
    const sku = item.productId;
    if (!sku) {
      errors.push("missing productId on an item");
      continue;
    }
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty <= 0) {
      errors.push(`invalid quantity for ${sku}`);
      continue;
    }

    const product = await sanityFetch<SanityProductStock>(
      env,
      `*[_type == "product" && sku == $sku][0]{
        _id,
        sizes[]{ _key, stock, customSize, size->{ label } },
        colors[]{ _key, name, stock }
      }`,
      { sku }
    );

    if (!product?._id) {
      errors.push(`product ${sku} not found for stock update`);
      continue;
    }

    const sizeLabel = item.size || "";
    const colorLabel = item.color || "";

    if (!sizeLabel && !colorLabel) {
      // No variant selected for this product. If the product has no sizes or
      // colours at all, we cannot know which stock to decrement — leave it.
      continue;
    }

    let patched = false;

    if (sizeLabel) {
      const target = (product.sizes || []).find(
        (s) => s.size?.label === sizeLabel
      );
      if (target) {
        const before = target.stock ?? 0;
        const after = Math.max(0, before - qty);
        await sanityPatch(env, product._id, {
          [`sizes[_key=="${target._key}"].stock`]: after,
        });
        patched = true;
      } else {
        errors.push(`size "${sizeLabel}" not found on ${sku}`);
      }
    }

    if (colorLabel) {
      const target = (product.colors || []).find(
        (c) => c.name === colorLabel
      );
      if (target) {
        const before = target.stock ?? 0;
        const after = Math.max(0, before - qty);
        await sanityPatch(env, product._id, {
          [`colors[_key=="${target._key}"].stock`]: after,
        });
        patched = true;
      } else {
        errors.push(`colour "${colorLabel}" not found on ${sku}`);
      }
    }

    if (patched) updated += 1;
  }

  return { updated, errors };
}