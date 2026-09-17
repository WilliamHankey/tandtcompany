import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../../.env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId || !token) {
  console.error("Missing SANITY credentials in .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-05-22",
  token,
  useCdn: false,
});

const TOPS = "sizeChart-tops";
const PANTS = "sizeChart-pants";

const chartDocs = [
  {
    _id: TOPS,
    _type: "sizeChart",
    name: "Tops Size Chart",
    productType: "tops",
    sizes: [
      { label: "XS", measurements: [{ type: "Shoulder", value: "56" }, { type: "Bust", value: "116" }, { type: "Waist", value: "124" }] },
      { label: "S", measurements: [{ type: "Shoulder", value: "59" }, { type: "Bust", value: "120" }, { type: "Waist", value: "128" }] },
      { label: "M", measurements: [{ type: "Shoulder", value: "62" }, { type: "Bust", value: "124" }, { type: "Waist", value: "132" }] },
      { label: "L", measurements: [{ type: "Shoulder", value: "65" }, { type: "Bust", value: "128" }, { type: "Waist", value: "136" }] },
      { label: "XL", measurements: [{ type: "Shoulder", value: "68" }, { type: "Bust", value: "132" }, { type: "Waist", value: "140" }] },
      { label: "XXL", measurements: [{ type: "Shoulder", value: "71" }, { type: "Bust", value: "136" }, { type: "Waist", value: "144" }] },
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    _id: PANTS,
    _type: "sizeChart",
    name: "Pants Size Chart",
    productType: "pants",
    sizes: [
      { label: "XS", measurements: [{ type: "Waist", value: "72-74" }, { type: "Waist Extended", value: "92" }, { type: "Length", value: "102" }] },
      { label: "S", measurements: [{ type: "Waist", value: "77-79" }, { type: "Waist Extended", value: "100" }, { type: "Length", value: "102" }] },
      { label: "M", measurements: [{ type: "Waist", value: "82-84" }, { type: "Waist Extended", value: "108" }, { type: "Length", value: "105" }] },
      { label: "L", measurements: [{ type: "Waist", value: "87-89" }, { type: "Waist Extended", value: "116" }, { type: "Length", value: "105" }] },
      { label: "XL", measurements: [{ type: "Waist", value: "92-94" }, { type: "Waist Extended", value: "124" }, { type: "Length", value: "108" }] },
      { label: "XXL", measurements: [{ type: "Waist", value: "97-99" }, { type: "Waist Extended", value: "132" }, { type: "Length", value: "108" }] },
    ],
    isActive: true,
    sortOrder: 2,
  },
];

const doesHaveChart = (title = "") =>
  /\bset\b/i.test(title) ||
  /\b(track pant|pants?|shorts?|jogger|sweatpant|legging|trouser|bottom)\b/i.test(title) ||
  /\b(hoodie|hooded|hood|coat|t.?shirt|shirt|track top|fleece top|crew neck|sweater|sweatshirt|top)\b/i.test(title);

const classify = (title = "") => {
  const t = title.toLowerCase();

  // A set (e.g. tracksuit/retro fit) is both a top and bottoms.
  if (/\bset\b/.test(t)) {
    return [TOPS, PANTS];
  }

  const isPants = /\b(track pant|pants?|shorts?|jogger|sweatpant|legging|trouser|bottom)\b/.test(t);
  const isTops = /\b(hoodie|hooded|hood|coat|t.?shirt|shirt|track top|fleece top|crew neck|sweater|sweatshirt|top)\b/.test(t);

  if (isTops && isPants) {
    return [TOPS, PANTS];
  }
  if (isPants) {
    return [PANTS];
  }
  if (isTops) {
    return [TOPS];
  }
  return [];
};

async function run() {
  const tx = client.transaction();
  for (const doc of chartDocs) {
    tx.createOrReplace(doc);
  }
  await tx.commit();
  console.log("Size chart documents ready.");

  const products = await client.fetch(
    `*[_type == "product"]{ _id, title, sku, sizeCharts } | order(title asc)`
  );
  console.log(`Found ${products.length} products.`);

  const changes = [];
  for (const p of products) {
    if (!doesHaveChart(p.title)) {
      continue;
    }

    const refs = classify(p.title).map((ref) => ({ _type: "reference", _ref: ref }));
    const current = (p.sizeCharts || []).map((c) => c._ref).sort().join(",");
    const next = refs.map((r) => r._ref).sort().join(",");

    if (current === next) {
      console.log(`=  ${p.sku} (${p.title}) -> unchanged${refs.length ? ` [${refs.map((r) => r._ref).join(", ")}]` : ""}`);
      continue;
    }

    changes.push({ id: p._id, sku: p.sku, title: p.title, refs });
    await client.patch(p._id).set({ sizeCharts: refs }).commit();
    console.log(`✓  ${p.sku} (${p.title}) -> ${refs.map((r) => r._ref).join(", ") || "none"}`);
  }

  console.log(`\nDone. Updated ${changes.length} product(s).`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});