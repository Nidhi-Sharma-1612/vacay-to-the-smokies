import { format, parseISO } from "date-fns";
import { blogPosts } from "@/data/blog-posts";

export type BlogText = { text: string; bold?: boolean };

export type BlogBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; parts: BlogText[] }
  | { type: "list"; ordered: boolean; items: BlogText[][] }
  | { type: "image"; src: string; alt: string };

export type BlogPost = {
  slug: string;
  legacySlug: string;
  title: string;
  excerpt: string;
  date: string; // yyyy-MM-dd
  minutes: number;
  category: string;
  /** Cabin slugs promoted under the post. */
  cabins: string[];
  cover: string;
  hero: string;
  blocks: BlogBlock[];
};

export const getPost = (slug: string) => blogPosts.find((p) => p.slug === slug);

export const blogCategories = [...new Set(blogPosts.map((p) => p.category))];

export const formatPostDate = (date: string) => format(parseISO(date), "MMMM d, yyyy");

/** Other posts to suggest after reading one: same category first, then newest. */
export function relatedPosts(slug: string, count = 3) {
  const post = getPost(slug);
  return blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === post?.category) - Number(a.category === post?.category))
    .slice(0, count);
}

/** Section headings double as the table of contents; ids are derived from their text. */
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
