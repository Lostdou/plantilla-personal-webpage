import type { ComponentType } from "react";
import { dateKey } from "./dates";

export type BlogFrontmatter = {
  slug: string;
  title: string;
  date: string; // DD/MM/YYYY
  category: string;
  banner: string;
  background: string;
};

export type BlogPost = BlogFrontmatter & { Component: ComponentType };

type MdxModule = { default: ComponentType; frontmatter: BlogFrontmatter };

const modules = import.meta.glob<MdxModule>("../content/blog/**/*.mdx", { eager: true });

export const posts: BlogPost[] = Object.values(modules)
  .map(({ default: Component, frontmatter }) => ({ ...frontmatter, Component }))
  .sort((a, b) => dateKey(b.date) - dateKey(a.date));

export const latestPosts = posts.slice(0, 3);

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
