/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}

declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const frontmatter: Record<string, string>;
  const Component: ComponentType;
  export default Component;
}
