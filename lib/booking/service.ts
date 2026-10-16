import "server-only";
import { addDays } from "date-fns";
import { cabins, getCabin, type CabinWithDetails } from "@/data/cabins";
import { toISO, todayISO } from "./dates";
import { checkGuests, checkStay } from "./rules";
import * as ownerRez from "./ownerrez-widget";
import type { AvailabilityCalendar, Quote, Result, Stay, StaySearch } from "./types";

const CALENDAR_DAYS = 365;

function message(error: unknown) {
  if (error instanceof ownerRez.OwnerRezError) return error.message;
  console.error("[booking]", error);
  return "We couldn't reach our booking system. Please try again, or call us.";
}

export async function getCalendar(cabin: CabinWithDetails): Promise<AvailabilityCalendar> {
  const from = todayISO();
  const to = toISO(addDays(new Date(), CALENDAR_DAYS));
  return ownerRez.getCalendar(cabin, from, to);
}

/**
 * One calendar for several cabins (the "Any cabin" search): a night counts as booked only when
 * every cabin is booked, so the calendar shows which dates are fully sold out.
 */
export async function getCombinedCalendar(list: CabinWithDetails[], label: string): Promise<AvailabilityCalendar> {
  const calendars = await Promise.all(list.map((c) => getCalendar(c)));
  const everyCabin = (pick: (c: AvailabilityCalendar) => string[]) => {
    const sets = calendars.map((c) => new Set(pick(c)));
    return [...sets[0]].filter((night) => sets.every((set) => set.has(night))).sort();
  };
  const rates: Record<string, number> = {};
  for (const c of calendars)
    for (const [night, rate] of Object.entries(c.rates)) rates[night] = Math.min(rate, rates[night] ?? Infinity);
  return {
    slug: label,
    currency: calendars[0]?.currency ?? "USD",
    blocked: everyCabin((c) => c.blocked),
    noArrival: everyCabin((c) => c.noArrival),
    noDeparture: everyCabin((c) => c.noDeparture),
    minStay: {},
    rates,
    defaultMinStay: Math.min(...calendars.map((c) => c.defaultMinStay)),
  };
}

/** Validate a stay against guest rules and live availability, then price it. */
export async function quoteStay(stay: Stay): Promise<Result<{ cabin: CabinWithDetails; quote: Quote }>> {
  const cabin = getCabin(stay.slug);
  if (!cabin) return { ok: false, error: "We couldn't find that cabin." };
  const guestError = checkGuests(cabin.details, stay);
  if (guestError) return { ok: false, error: guestError };
  try {
    const stayError = checkStay(await getCalendar(cabin), stay);
    if (stayError) return { ok: false, error: stayError };
    return { ok: true, data: { cabin, quote: await ownerRez.getQuote(cabin, stay) } };
  } catch (error) {
    return { ok: false, error: message(error) };
  }
}

export type SearchResult = {
  cabin: CabinWithDetails;
  status: "available" | "unavailable" | "unpriced";
  reason?: string;
  quote?: Quote;
};

/** Run a search across all cabins, mirroring the results page filters. */
export async function searchCabins(search: StaySearch) {
  const matching = cabins.filter((c) => !search.type || c.category === search.type);
  const results = await Promise.all(
    matching.map(async (cabin): Promise<SearchResult> => {
      const guestError = checkGuests(cabin.details, search);
      if (guestError) return { cabin, status: "unavailable", reason: guestError };
      if (!search.checkin || !search.checkout) return { cabin, status: "unpriced" };
      const result = await quoteStay({ ...search, slug: cabin.slug, checkin: search.checkin, checkout: search.checkout });
      return result.ok ? { cabin, status: "available", quote: result.data.quote } : { cabin, status: "unavailable", reason: result.error };
    }),
  );
  return {
    available: results.filter((r) => r.status !== "unavailable"),
    unavailable: results.filter((r) => r.status === "unavailable"),
  };
}
