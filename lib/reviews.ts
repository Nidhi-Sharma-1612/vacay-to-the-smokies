import "server-only";
import { site } from "@/data/site";

/**
 * Real guest reviews from the owner's OwnerRez Reviews widget. The widget page is public HTML
 * (no API key), parsed here so reviews can be shown in the site's own design.
 * If OwnerRez changes the markup, these functions return no reviews rather than failing the page.
 */

const BASE = "https://app.ownerrez.com/widgets/getreviews";
const PAGE_SIZE = 10;

/** OwnerRez's numeric property IDs used by the Reviews widget filter, per cabin slug. */
export const reviewPropertyIds: Record<string, string> = {
  "emerald-forest": "427424",
  "golden-forest": "482426",
  ladyslipper: "373856",
  "wild-columbine": "373951",
  "firefly-bungalow-2": "373993",
  "firefly-bungalow-1": "373779",
};

// OwnerRez listing titles as they appear in reviews, mapped to our cabin slugs.
const LISTING_TITLES: [RegExp, string][] = [
  [/emerald forest/i, "emerald-forest"],
  [/just opened|golden forest/i, "golden-forest"],
  [/ladyslipper|lady slipper/i, "ladyslipper"],
  [/wild columbine/i, "wild-columbine"],
  [/steps from pigeon forge parkway|firefly bungalow #?2/i, "firefly-bungalow-2"],
  [/stylish bungalow|firefly bungalow #?1/i, "firefly-bungalow-1"],
];

export type GuestReview = {
  id: string;
  author: string;
  stars: number;
  title: string | null;
  body: string;
  response: string | null;
  cabinSlug: string | null;
  stayed: string | null; // "Oct 2026"
};

export type ReviewPage = { reviews: GuestReview[]; total: number; average: number | null; page: number; pages: number };

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…" };

function decode(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

/** HTML fragment -> plain text, keeping paragraph breaks. */
function text(html: string) {
  return decode(html.replace(/<br\s*\/?>|<\/p>|<\/div>/gi, "\n").replace(/<[^>]+>/g, ""))
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function parse(html: string, page: number): ReviewPage {
  const totalMatch = html.match(/Showing[\s\S]*?of\s+(\d+)\s+reviews/i);
  const avgMatch = text(html.match(/class="review-average"[\s\S]*?(?=<form|class="review-list")/i)?.[0] ?? "").match(/([\d.]+)\s+stars/);
  const reviews = html
    .split('<div class="review-item">')
    .slice(1)
    .map((chunk, i): GuestReview | null => {
      const stars = Number(chunk.match(/([\d.]+) stars/)?.[1] ?? 0);
      const title = text(chunk.match(/review-item-title">\s*<strong>([\s\S]*?)<\/strong>/)?.[1] ?? "") || null;
      const byLine = text(chunk.match(/review-item-by-line">([\s\S]*?)<\/div>/)?.[1] ?? "").replace(/\n/g, " ");
      const author = byLine.match(/^By\s+(.+?)(?:\s+–|$)/)?.[1]?.trim() ?? "Guest";
      const listing = byLine.match(/stayed at\s+(.+?)\s+in\s+[A-Z][a-z]{2} \d{4}/)?.[1] ?? "";
      const stayed = byLine.match(/in\s+([A-Z][a-z]{2} \d{4})/)?.[1] ?? null;
      const rawBody = chunk.match(/class="has-read-more">([\s\S]*?)<\/div>\s*<label/)?.[1] ?? "";
      const [bodyHtml, responseHtml] = rawBody.split(/<div[^>]*>\s*<b>Response<\/b>\s*from[^<]*<\/div>/i);
      const body = text(bodyHtml ?? "");
      if (!body && !title) return null;
      return {
        id: `${page}-${i}-${author}`,
        author,
        stars,
        title,
        body,
        response: responseHtml ? text(responseHtml) : null,
        cabinSlug: LISTING_TITLES.find(([re]) => re.test(listing))?.[1] ?? null,
        stayed,
      };
    })
    .filter((r): r is GuestReview => r !== null);
  const total = Number(totalMatch?.[1] ?? reviews.length);
  return { reviews, total, average: avgMatch ? Number(avgMatch[1]) : null, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getReviews({
  cabinSlug,
  page = 1,
  pageSize = PAGE_SIZE,
  sort = "MostRecentStay",
}: { cabinSlug?: string; page?: number; pageSize?: number; sort?: "MostRecentStay" | "HighestRated" } = {}): Promise<ReviewPage> {
  const params = new URLSearchParams({
    key: site.ownerRez.reviewsWidgetId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5"),
    Sort: sort,
    PropertyId: cabinSlug ? reviewPropertyIds[cabinSlug] ?? "" : "",
    PageSize: String(pageSize),
    PageNumber: String(page),
  });
  try {
    const res = await fetch(`${BASE}?${params}`, { headers: { Referer: `${site.url}/` }, next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Reviews request failed (${res.status})`);
    const result = parse(await res.text(), page);
    return { ...result, pages: Math.max(1, Math.ceil(result.total / pageSize)) };
  } catch (error) {
    console.error("[reviews]", error);
    return { reviews: [], total: 0, average: null, page, pages: 1 };
  }
}

/** Short, glowing reviews read best in highlight carousels. */
export const isHighlight = (r: GuestReview) => r.stars >= 5 && r.body.length >= 60 && r.body.length <= 420;

/** Live rating summary (overall, or for one cabin); null if OwnerRez is unreachable. Cached with the review list. */
export async function getRatingSummary(cabinSlug?: string): Promise<{ rating: number; count: number } | null> {
  const { average, total } = await getReviews({ cabinSlug, pageSize: 1 });
  return average !== null && total > 0 ? { rating: average, count: total } : null;
}
