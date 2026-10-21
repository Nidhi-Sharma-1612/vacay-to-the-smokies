import "server-only";

import { cache } from "react";

// Fetches editable copy (cabin descriptions, page sections, FAQs, settings)
// from the Design by Dial admin panel. Every call site has a hardcoded
// fallback — usually the exact copy already in data/cabins.ts,
// data/cabin-details.ts or the section's own component — so the live site
// keeps working even if the admin panel or its database is unreachable.
//
// Deliberately uncached across requests (`cache: "no-store"`): this is a
// low-traffic marketing site, so a fresh request per page load is cheap, and
// it means an edit in the admin panel shows up on the very next page load
// with zero cache-invalidation complexity. `cache()` below only de-duplicates
// identical calls *within* one render (e.g. the layout/footer and a page
// both reading the same settings).
const CMS_URL = process.env.ADMIN_PANEL_API_URL;
const CMS_API_KEY = process.env.ADMIN_PANEL_API_KEY;
const CMS_SITE_SLUG = "vacaytothesmokies";

const cmsFetch = cache(async function cmsFetch<T>(path: string): Promise<T | null> {
  if (!CMS_URL || !CMS_API_KEY) return null;

  try {
    const res = await fetch(`${CMS_URL}/api/public/${CMS_SITE_SLUG}${path}`, {
      headers: { "x-api-key": CMS_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
});

export type Section = Record<string, unknown>;

// Cached per request+pageSlug: the cabin detail page, the footer and the
// homepage can all ask for the same page's sections without re-fetching.
export const getPageSections = cache(async (pageSlug: string): Promise<Record<string, Section>> => {
  const data = await cmsFetch<{ sections: Record<string, Section> }>(`/pages/${pageSlug}`);
  return data?.sections ?? {};
});

export async function getCmsFaqs(): Promise<{ question: string; answer: string }[] | null> {
  const data = await cmsFetch<{ faqs: { question: string; answer: string }[] }>("/faqs");
  return data?.faqs?.length ? data.faqs : null;
}

export type CmsSettings = {
  siteName?: string;
  logoUrl?: string | null;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  responseTimeNote?: string;
  footerTagline?: string;
  copyrightName?: string;
  socialLinks?: Record<string, string>;
};

export const getSiteSettings = cache(async (): Promise<CmsSettings | null> => {
  const data = await cmsFetch<{ settings: CmsSettings | null }>("/settings");
  return data?.settings ?? null;
});

// A single string field off a section's content, or the fallback when it is
// missing/blank.
export function str(section: Section, key: string, fallback: string): string {
  const value = section[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

// Like `str`, but an empty string is a valid, deliberate value (e.g. an
// optional note someone cleared on purpose) — only a genuinely missing key
// falls back.
export function strOrNull(section: Section, key: string, fallback: string | null): string | null {
  const value = section[key];
  return typeof value === "string" ? value : fallback;
}

// An image/video URL field. next/image throws (crashing the whole page, not
// just that image) on a src that isn't a root-relative path or an absolute
// URL — and this value comes from a plain admin text field, so a typo or an
// accidentally-cleared field is a real, reachable failure mode, not just a
// theoretical one. Falls back on anything that doesn't look safe to pass in.
export function img(section: Section, key: string, fallback: string): string {
  const value = section[key];
  if (typeof value === "string" && (value.startsWith("/") || /^https?:\/\//.test(value))) return value;
  return fallback;
}

// A single number field, or the fallback when missing/not a finite number.
export function num(section: Section, key: string, fallback: number): number {
  const value = section[key];
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? n : fallback;
}

// A single boolean field, stored as the literal string "true"/"false" (the
// generic admin editor only has text fields), or the fallback when missing.
export function bool(section: Section, key: string, fallback: boolean): boolean {
  const value = section[key];
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

// A list of strings (paragraphs, bullet points, photo URLs…). Empty or
// missing falls back.
export function strList(section: Section, key: string, fallback: string[]): string[] {
  const value = section[key];
  if (!Array.isArray(value) || value.length === 0 || !value.every((v) => typeof v === "string")) {
    return fallback;
  }
  return value as string[];
}

// A list of flat objects (nearby places, amenity groups, description
// blocks…). Items missing any of `fields` are dropped; empty (or entirely
// missing) falls back.
export function objList<K extends string>(
  section: Section,
  key: string,
  fields: readonly K[],
  fallback: Record<K, string>[],
): Record<K, string>[] {
  const value = section[key];
  if (!Array.isArray(value)) return fallback;
  const items = value.filter(
    (item): item is Record<K, string> =>
      !!item &&
      typeof item === "object" &&
      fields.every((f) => typeof (item as Record<string, unknown>)[f] === "string"),
  );
  return items.length > 0 ? items : fallback;
}
