import "server-only";

import { cabins as baseCabins, getCabin as getBaseCabin, photoUrl, type CabinWithDetails } from "@/data/cabins";
import { getPageSections, img, num, objList, str, strList, type Section } from "@/lib/cms";

/**
 * Overlays admin-panel content onto a cabin. There's no live property-management
 * API behind this site (see data/cabin-details.ts) — the cabin data is a
 * one-time scrape, so without this layer the client would need a code change
 * to fix a typo in a description. Each cabin's content lives under its own
 * "page" in the admin, keyed by its slug (e.g. "emerald-forest"), with one
 * section per group of fields below.
 *
 * Only descriptive/marketing fields are overridable. Booking-critical fields
 * — ownerRezKey, maxGuests, rateRange, childrenAllowed, petsAllowed, coords —
 * are deliberately NOT included here and always come from the original
 * data/cabin-details.ts: they feed live OwnerRez pricing/availability and
 * client-side booking validation (see lib/booking/rules.ts), so an admin typo
 * there could make the booking widget quote something OwnerRez won't actually
 * honor. Changing those still requires a code change, by design.
 */
function mergeCabin(cabin: CabinWithDetails, sections: Record<string, Section>): CabinWithDetails {
  const basics = sections.basics ?? {};
  const detail = sections.detail ?? {};
  const nearby = sections.nearby ?? {};
  const photos = sections.photos ?? {};
  const description = sections.description ?? {};
  const sleeping = sections.sleeping ?? {};
  const bathrooms = sections.bathrooms ?? {};
  const policies = sections.policies ?? {};
  const amenities = sections.amenities ?? {};
  const stats = sections.stats ?? {};

  const amenityGroups = objList(amenities, "groups", ["name", "items"] as const, []);

  return {
    ...cabin,
    name: str(basics, "name", cabin.name),
    tagline: str(basics, "tagline", cabin.tagline),
    description: str(basics, "description", cabin.description),
    image: img(basics, "image", cabin.image),
    highlights: strList(basics, "highlights", cabin.highlights),
    badge: cabin.badge && { ...cabin.badge, label: str(basics, "badgeLabel", cabin.badge.label) },
    // Card stats (size/baths/sleeps are purely descriptive display text —
    // distinct from the booking-critical `maxGuests` in cabin-details.ts,
    // which is never overridden here).
    size: str(basics, "size", cabin.size),
    baths: num(basics, "baths", cabin.baths),
    sleeps: Math.round(num(basics, "sleeps", cabin.sleeps)),
    categoryLabel: str(
      basics,
      "categoryLabel",
      cabin.categoryLabel ?? (cabin.category === "forest" ? "Secluded forest" : "Walk to the Parkway"),
    ),
    page: {
      headline: str(detail, "headline", cabin.page.headline),
      subtitle: str(detail, "subtitle", cabin.page.subtitle),
      story: strList(detail, "story", cabin.page.story),
      highlights: strList(detail, "highlights", cabin.page.highlights),
    },
    nearby: objList(nearby, "items", ["place", "time"] as const, cabin.nearby),
    details: {
      ...cabin.details,
      photos: (() => {
        // cabin.details.photos (the un-overridden fallback) is raw OwnerRez
        // keys, not URLs — always resolve it, whether it ends up used as the
        // fallback here or not.
        const resolvedFallback = cabin.details.photos.map((p) => photoUrl(p));
        const list = strList(photos, "items", resolvedFallback).filter(
          (p) => p.startsWith("/") || /^https?:\/\//.test(p),
        );
        return list.length > 0 ? list : resolvedFallback;
      })(),
      description: objList(
        description,
        "blocks",
        ["type", "text"] as const,
        cabin.details.description.map((b) => ({ type: b.type, text: b.text })),
      ).map((b) => ({ type: b.type === "h" || b.type === "li" ? b.type : "p", text: b.text })),
      sleeping: {
        summary: str(sleeping, "summary", cabin.details.sleeping.summary),
        rooms: strList(sleeping, "rooms", cabin.details.sleeping.rooms),
        note: sleeping.note !== undefined ? str(sleeping, "note", "") || null : cabin.details.sleeping.note,
      },
      bathrooms: {
        rooms: strList(bathrooms, "rooms", cabin.details.bathrooms.rooms),
        note: bathrooms.note !== undefined ? str(bathrooms, "note", "") || null : cabin.details.bathrooms.note,
      },
      cancellationPolicy: str(policies, "cancellationPolicy", cabin.details.cancellationPolicy ?? ""),
      notes: strList(policies, "notes", cabin.details.notes),
      houseRules: strList(policies, "houseRules", cabin.details.houseRules),
      expectations: strList(policies, "expectations", cabin.details.expectations),
      // Each group's items are stored as one comma-separated field (the
      // generic admin editor only supports flat text per row) — split back
      // into a real list here.
      amenityGroups: amenityGroups.length
        ? amenityGroups.map((g) => ({
            name: g.name,
            items: g.items
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }))
        : cabin.details.amenityGroups,
      locality: str(stats, "locality", cabin.details.locality ?? ""),
      checkInMethod: stats.checkInMethod !== undefined ? str(stats, "checkInMethod", "") || null : cabin.details.checkInMethod,
      sqft: stats.sqft !== undefined ? num(stats, "sqft", 0) || null : cabin.details.sqft,
      checkIn: str(stats, "checkIn", cabin.details.checkIn ?? ""),
      checkOut: str(stats, "checkOut", cabin.details.checkOut ?? ""),
      rating: num(stats, "rating", cabin.details.rating),
      reviewCount: Math.round(num(stats, "reviewCount", cabin.details.reviewCount)),
    },
  };
}

export async function getCmsCabin(slug: string): Promise<CabinWithDetails | undefined> {
  const cabin = getBaseCabin(slug);
  if (!cabin) return undefined;
  const sections = await getPageSections(slug);
  return mergeCabin(cabin, sections);
}

export async function getCmsCabins(): Promise<CabinWithDetails[]> {
  return Promise.all(baseCabins.map(async (cabin) => mergeCabin(cabin, await getPageSections(cabin.slug))));
}
