import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID || "";
const dataset = import.meta.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "tandtcompany",
  title: "T & T Company",
  projectId,
  dataset,
  studioHost: import.meta.env.SANITY_STUDIO_HOSTNAME || "tandtcompany",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
