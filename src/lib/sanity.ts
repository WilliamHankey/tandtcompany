import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "";
export const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-05-22";

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function imageUrl(source: SanityImageSource | undefined, width = 800) {
  if (!source) return "";
  return urlFor(source).width(width).auto("format").url();
}
