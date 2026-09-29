import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

export default defineConfig({
  plugins: [
    // MDX must run before the React plugin.
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }),
    },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
    tailwindcss(),
  ],
  server: {
    // The original site has a Node/Express backend. Proxy it (and the
    // images/audio it serves) to the live site so everything loads in dev.
    proxy: {
      "/api": { target: "https://example.com", changeOrigin: true },
      "/assets": { target: "https://example.com", changeOrigin: true },
    },
  },
});
