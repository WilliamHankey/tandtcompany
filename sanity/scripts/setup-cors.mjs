/**
 * Adds CORS origins for the Sanity project (required for browser API access).
 */
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
const origins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3333",
  "https://tandtcompany.sanity.studio",
];

if (!projectId || !token) {
  console.error("Missing SANITY_STUDIO_PROJECT_ID or SANITY_API_TOKEN in .env");
  process.exit(1);
}

for (const origin of origins) {
  const res = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ origin, allowCredentials: true }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok) console.log(`✓ CORS added: ${origin}`);
  else if (body?.message?.includes?.("already") || res.status === 409)
    console.log(`· CORS exists: ${origin}`);
  else console.warn(`✗ ${origin}:`, body?.message || res.status);
}

console.log("Done.");
