import "server-only";
import { format } from "date-fns";
import type { CabinWithDetails } from "@/data/cabins";
import { site } from "@/data/site";
import { eachNight, fromISO, nightsBetween } from "./dates";
import type { AvailabilityCalendar, Quote, QuoteLine, Stay } from "./types";

/**
 * Live availability and pricing from the owner's OwnerRez Booking/Inquiry widget.
 * These are the same public endpoints the widget itself calls (no API key needed), so the calendar and totals
 * shown on this site always match what guests see in OwnerRez's checkout.
 * The endpoints are undocumented; if OwnerRez changes them, the booking widget still works and only these lookups fail.
 */

const BASE = "https://app.ownerrez.com/widgets";
const CACHE_SECONDS = 300;

export class OwnerRezError extends Error {}

/** "3a1fc396…" -> "3a1fc396-0b90-4426-92bd-ddb4a5bfc4da" */
const guid = (key: string) => key.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
const widgetKey = () => guid(site.ownerRez.bookingWidgetId);

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = `${BASE}/${path}?${new URLSearchParams(params)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", Referer: `${site.url}/` },
    next: { revalidate: CACHE_SECONDS },
  });
  if (!res.ok) throw new Error(`OwnerRez widget ${path} failed (${res.status})`);
  return (await res.json()) as T;
}

type CalendarData = { Bookings?: { Arrival: string; Departure: string }[] };

export async function getCalendar(cabin: CabinWithDetails, from: string, to: string): Promise<AvailabilityCalendar> {
  const data = await get<CalendarData>("calendardata", {
    widgetId: widgetKey(),
    propertyIds: guid(cabin.details.ownerRezKey),
    startDate: format(fromISO(from)!, "MM/dd/yyyy"),
  });
  // Each booking blocks its nights: arrival day inclusive, departure day exclusive (checkout morning stays open).
  const blocked = new Set<string>();
  for (const b of data.Bookings ?? []) {
    for (const night of eachNight(b.Arrival.slice(0, 10), b.Departure.slice(0, 10))) {
      if (night >= from && night <= to) blocked.add(night);
    }
  }
  return {
    slug: cabin.slug,
    currency: "USD",
    blocked: [...blocked].sort(),
    noArrival: [],
    noDeparture: [],
    minStay: {},
    rates: {},
    // Stay-length rules aren't exposed here; the quote below enforces them with OwnerRez's own message.
    defaultMinStay: 1,
  };
}

type QuoteData = {
  succeeded: boolean;
  total?: number;
  errors?: string[] | null;
  charges?: { type: string; description: string; amount: number }[];
  currencyThreeLetter?: string;
};

const lineKind = (type: string): QuoteLine["kind"] => (type === "Rent" ? "rent" : type === "Tax" ? "tax" : /discount/i.test(type) ? "discount" : "fee");

export async function getQuote(cabin: CabinWithDetails, stay: Stay): Promise<Quote> {
  const day = (iso: string) => format(fromISO(iso)!, "EEE MMM dd yyyy");
  const data = await get<QuoteData>("quote", {
    propertyKey: guid(cabin.details.ownerRezKey),
    widgetKey: widgetKey(),
    arrivalDate: day(stay.checkin),
    departureDate: day(stay.checkout),
    adults: String(stay.adults),
    children: String(stay.children),
    pets: String(stay.pets),
    originalReferrer: `${site.url}/`,
  });
  if (!data.succeeded) throw new OwnerRezError(data.errors?.join(" ") || "Those dates aren't available.");
  const lines: QuoteLine[] = (data.charges ?? []).map((c) => ({
    // OwnerRez labels nightly rent "3 nights"; other rent-type charges (e.g. extra-guest fees) keep their own name.
    label: c.type === "Rent" && /^\d+ nights?$/.test(c.description) ? `Rent · ${c.description}` : c.description,
    amount: c.amount,
    kind: lineKind(c.type),
  }));
  return {
    slug: cabin.slug,
    checkin: stay.checkin,
    checkout: stay.checkout,
    nights: nightsBetween(stay.checkin, stay.checkout),
    currency: data.currencyThreeLetter ?? "USD",
    lines,
    total: Math.round((data.total ?? lines.reduce((s, l) => s + l.amount, 0)) * 100) / 100,
  };
}
