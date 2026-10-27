import "server-only";

import { cache } from "react";
import { cmsFetch } from "@/lib/cms";
import type { BlogPost, BlogPostSummary } from "@/lib/blog";

export const getPosts = cache(async (): Promise<BlogPostSummary[]> => {
  const data = await cmsFetch<{ posts: BlogPostSummary[] }>("/blog");
  return data?.posts ?? [];
});

export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  const data = await cmsFetch<{ post: BlogPost | null }>(`/blog/${encodeURIComponent(slug)}`);
  return data?.post ?? null;
});

/** Other posts to suggest after reading one: same category first, then newest. */
export async function relatedPosts(slug: string, category: string | null, count = 3): Promise<BlogPostSummary[]> {
  const posts = await getPosts();
  return posts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, count);
}
