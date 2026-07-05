import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://by-xin.github.io",
  integrations: [sitemap()],
});
