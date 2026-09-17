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

const tops = {
  _id: "sizeChart-tops",
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
};

const pants = {
  _id: "sizeChart-pants",
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
};

async function run() {
  const tx = client.transaction();
  tx.createOrReplace(tops);
  tx.createOrReplace(pants);
  await tx.commit();
  console.log("Size charts created.");

  const products = await client.fetch(`*[_type == "product" && sku in ["tee-navy", "hoodie"]]{ _id, sku }`);
  for (const p of products) {
    await client.patch(p._id).set({ sizeChart: { _type: "reference", _ref: "sizeChart-tops" } }).commit();
    console.log("Linked", p.sku, "-> sizeChart-tops");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});