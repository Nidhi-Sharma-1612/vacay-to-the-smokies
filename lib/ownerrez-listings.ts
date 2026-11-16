import "server-only";

import type { DescriptionBlock } from "@/lib/booking/types";
import { reviewPropertyIds } from "@/lib/reviews";

/**
 * Cabin descriptions and photos pulled live from the owner's OwnerRez listings, so the owner edits
 * them in one place (OwnerRez) and the site restyles them in its own design. Uses the read-only token from the
 * owner's own OwnerRez OAuth app. Cached for an hour and refreshed immediately by the OwnerRez
 * webhook (app/api/ownerrez/webhook). Without a token, or if OwnerRez is unreachable, this returns
 * nothing and the site keeps showing its built-in copy.
 */

export const LISTINGS_TAG = "ownerrez-listings";

export type ListingCopy = {
  /** Short description, as plain text, for cabin cards and page metadata. */
  summary?: string;
  /** Full description, split into headings, paragraphs and bullets. */
  blocks?: DescriptionBlock[];
  /** Listing photos in the order set in OwnerRez; the first is the cover. */
  photos?: string[];
};

type ListingResponse = {
  descriptions?: { short_description?: string | null; description?: string | null };
  photos?: { large_url?: string | null }[];
};

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", mdash: "—", ndash: "–", hellip: "…", bull: "•",
};

function decode(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (m, e: string) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

const plain = (html: string) => decode(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
// "• item", "- item", "-item" (but not "-10%").
const BULLET = /^(?:[•▪●◦✓✔*–]|-(?!\d))\s*/;
const EMOJI_START = /^\p{Extended_Pictographic}/u;

/**
 * Turns OwnerRez's description HTML (pasted from various editors, full of inline styles) into
 * clean blocks. A line that is all bold, or short with no closing punctuation, reads as a heading
 * ("Designed for Romance & Connection ❤️"); lines starting with "•" or "-", <li> items and short
 * emoji-led lines ("🔥 Gas fireplace…") are bullets.
 */
export function toBlocks(html: string): DescriptionBlock[] {
  const lines = html
    .replace(/<li\b[^>]*>/gi, "\n<li>")
    .split(/<br\s*\/?>|<\/(?:p|li|ul|ol|div|h[1-6])>|\n/i);
  const blocks: (DescriptionBlock & { guessed?: boolean })[] = [];
  for (const line of lines) {
    const text = plain(line);
    if (!text) continue;
    if (/<li>/i.test(line) || BULLET.test(text)) {
      blocks.push({ type: "li", text: text.replace(BULLET, "") });
      continue;
    }
    if (EMOJI_START.test(text)) {
      blocks.push({ type: text.length <= 120 ? "li" : "p", text });
      continue;
    }
    const allBold = !plain(line.replace(/<(strong|b|h[1-6])\b[^>]*>[\s\S]*?<\/\1>/gi, ""));
    const shortTitle = text.length <= 70 && text.split(" ").length <= 10 && !/[.!?,;:…)"”]$/.test(text);
    if (allBold) blocks.push({ type: "h", text: text.replace(/:$/, "") });
    else blocks.push({ type: shortTitle ? "h" : "p", text, guessed: shortTitle });
  }
  // Back-to-back guessed headings are really a short list (e.g. "TYS (Knoxville) - 1 hour away").
  return blocks.map((b, i) =>
    b.guessed && (blocks[i - 1]?.guessed || blocks[i + 1]?.guessed) ? { type: "li", text: b.text } : { type: b.type, text: b.text },
  );
}

async function fetchListing(propertyId: string): Promise<ListingResponse | null> {
  const token = process.env.OWNERREZ_ACCESS_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`https://api.ownerrez.com/v2/listings/${propertyId}?includeDescriptions=true&includePhotos=true`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json", "User-Agent": "VacayToTheSmokies-Website" },
      // The token header would otherwise make this uncached; cache it and let the webhook refresh it.
      cache: "force-cache",
      next: { revalidate: 3600, tags: [LISTINGS_TAG] },
    });
    return res.ok ? ((await res.json()) as ListingResponse) : null;
  } catch {
    return null;
  }
}

export async function getListingCopy(slug: string): Promise<ListingCopy> {
  // The Reviews widget filter uses the same numeric OwnerRez property IDs.
  const propertyId = reviewPropertyIds[slug];
  const listing = propertyId ? await fetchListing(propertyId) : null;
  const d = listing?.descriptions;
  const blocks = d?.description ? toBlocks(d.description) : [];
  const summary = d?.short_description ? plain(d.short_description.replace(/<\/p>|<br\s*\/?>/gi, " ")) : "";
  const photos = (listing?.photos ?? []).map((p) => p.large_url).filter((url): url is string => !!url);
  return { summary: summary || undefined, blocks: blocks.length ? blocks : undefined, photos: photos.length ? photos : undefined };
}
