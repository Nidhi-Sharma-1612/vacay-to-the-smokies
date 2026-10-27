import { format } from "date-fns";

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  cabins: string[];
  publishedAt: string | null;
};

export type BlogPost = BlogPostSummary & {
  body: string;
  heroImage: string | null;
};

export const formatPostDate = (date: string | null) => (date ? format(new Date(date), "MMMM d, yyyy") : "");

/** Section headings double as the table of contents; ids are derived from their text. */
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** `## `-level headings, in order, for the "In this story" sidebar nav. */
export function extractHeadings(markdown: string): string[] {
  return Array.from(markdown.matchAll(/^##\s+(.+)$/gm)).map((m) => m[1].trim());
}

/** ~200 words/minute, rounded up to the nearest minute (minimum 1). */
export function estimateReadMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
