import { fromISO, nightsBetween, todayISO } from "./dates";
import type { CabinCategory, Guests, Stay, StaySearch } from "./types";

type RawParams = Record<string, string | string[] | undefined> | URLSearchParams;

export const defaultGuests: Guests = { adults: 2, children: 0, pets: 0 };

function read(params: RawParams, key: string) {
  const value = params instanceof URLSearchParams ? params.get(key) : params[key];
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
}

function int(value: string | undefined, fallback: number, min: number, max = 20) {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n >= min ? Math.min(n, max) : fallback;
}

/** Parse the shared search params used by the search bar, results page, cabin page and checkout. */
export function parseSearch(params: RawParams): StaySearch {
  let checkin = read(params, "checkin");
  let checkout = read(params, "checkout");
  // Drop dates that are malformed, in the past, or out of order.
  if (!fromISO(checkin) || checkin! < todayISO()) checkin = undefined;
  if (!checkin || !fromISO(checkout) || nightsBetween(checkin, checkout!) <= 0) checkout = undefined;
  const type = read(params, "type");
  return {
    checkin,
    checkout,
    adults: int(read(params, "adults"), defaultGuests.adults, 1),
    children: int(read(params, "children"), 0, 0),
    pets: int(read(params, "pets"), 0, 0, 3),
    type: type === "forest" || type === "parkway" ? (type as CabinCategory) : undefined,
  };
}

export function parseStay(params: RawParams): Stay | null {
  const slug = read(params, "cabin");
  const search = parseSearch(params);
  if (!slug || !search.checkin || !search.checkout) return null;
  return { slug, checkin: search.checkin, checkout: search.checkout, adults: search.adults, children: search.children, pets: search.pets };
}

/** Serialize a search (or stay) back to a query string, omitting defaults. */
export function searchQuery(search: Partial<StaySearch> & { cabin?: string }) {
  const q = new URLSearchParams();
  if (search.cabin) q.set("cabin", search.cabin);
  if (search.type) q.set("type", search.type);
  if (search.checkin) q.set("checkin", search.checkin);
  if (search.checkout) q.set("checkout", search.checkout);
  if (search.adults != null && search.adults !== defaultGuests.adults) q.set("adults", String(search.adults));
  if (search.children) q.set("children", String(search.children));
  if (search.pets) q.set("pets", String(search.pets));
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function guestLabel({ adults, children, pets }: Guests) {
  const guests = adults + children;
  const parts = [`${guests} ${guests === 1 ? "guest" : "guests"}`];
  if (pets) parts.push(`${pets} ${pets === 1 ? "pet" : "pets"}`);
  return parts.join(", ");
}
