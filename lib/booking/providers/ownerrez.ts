import "server-only";
import type { CabinWithDetails } from "@/data/cabins";
import { nightsBetween } from "../dates";
import type { AvailabilityCalendar, Quote, QuoteLine } from "../types";
import { ProviderError, type BookingProvider } from "./types";

/**
 * OwnerRez API v2 adapter (https://api.ownerrez.com/help/v2).
 * Auth: HTTP Basic with the OwnerRez account email + a Personal Access Token.
 */

const BASE_URL = "https://api.ownerrez.com";

type OwnerRezError = { messages?: string[]; code?: string };

type CalendarDay = {
  date: string;
  status: "available" | "booked" | "blocked" | "gap" | "unavailable";
  rate?: { amount?: number };
  rules?: {
    is_arrival_disallowed?: boolean;
    is_departure_disallowed?: boolean;
    is_stay_disallowed?: boolean;
    min_nights?: number;
  };
};

type QuoteCharge = { amount: number; description: string; type: "rent" | "surcharge" | "tax" | "tax_other" | "surcharge_other" };

export function ownerRezConfigured() {
  return Boolean(process.env.OWNERREZ_USERNAME && process.env.OWNERREZ_TOKEN);
}

async function request<T>(path: string, init: RequestInit & { revalidate?: number } = {}): Promise<T> {
  const auth = Buffer.from(`${process.env.OWNERREZ_USERNAME}:${process.env.OWNERREZ_TOKEN}`).toString("base64");
  const { revalidate, ...rest } = init;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "VacayToTheSmokies-DirectBooking/1.0",
      ...rest.headers,
    },
    ...(revalidate != null ? { next: { revalidate } } : { cache: "no-store" as const }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as OwnerRezError;
    throw new ProviderError(body.messages?.[0] ?? `OwnerRez request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

// OwnerRez property IDs are resolved once from the public property keys scraped into cabin-details.
let propertyIds: Promise<Map<string, number>> | null = null;

async function propertyId(cabin: CabinWithDetails) {
  propertyIds ??= request<{ items: { id: number; key: string }[] }>("/v2/properties?limit=100", { revalidate: 3600 })
    .then((r) => new Map(r.items.map((p) => [p.key, p.id])))
    .catch((e) => {
      propertyIds = null;
      throw e;
    });
  const id = (await propertyIds).get(cabin.details.ownerRezKey);
  if (!id) throw new ProviderError(`No OwnerRez property matches ${cabin.name}.`);
  return id;
}

const lineKind = (type: QuoteCharge["type"]): QuoteLine["kind"] =>
  type === "rent" ? "rent" : type.startsWith("tax") ? "tax" : "fee";

export const ownerRezProvider: BookingProvider = {
  source: "live",

  async getCalendar(cabin, from, to) {
    const id = await propertyId(cabin);
    const data = await request<{ currency_code: string; days: CalendarDay[] }>(
      `/v2/calendar/${id}?from=${from}&to=${to}`,
      { revalidate: 300 },
    );
    const calendar: AvailabilityCalendar = {
      slug: cabin.slug,
      currency: data.currency_code ?? "USD",
      blocked: [],
      noArrival: [],
      noDeparture: [],
      minStay: {},
      rates: {},
      defaultMinStay: 1,
    };
    for (const day of data.days ?? []) {
      if (day.status !== "available" || day.rules?.is_stay_disallowed) calendar.blocked.push(day.date);
      if (day.rules?.is_arrival_disallowed) calendar.noArrival.push(day.date);
      if (day.rules?.is_departure_disallowed) calendar.noDeparture.push(day.date);
      if (day.rules?.min_nights && day.rules.min_nights > 1) calendar.minStay[day.date] = day.rules.min_nights;
      if (day.rate?.amount) calendar.rates[day.date] = day.rate.amount;
    }
    return calendar;
  },

  async getQuote(cabin, stay) {
    const id = await propertyId(cabin);
    // test: true prices the stay without saving a quote in OwnerRez.
    const quote = await request<{ charges?: QuoteCharge[] }>("/v2/quotes", {
      method: "POST",
      body: JSON.stringify({
        property_id: id,
        arrival: stay.checkin,
        departure: stay.checkout,
        adults: stay.adults,
        children: stay.children,
        pets: stay.pets,
        test: true,
        generate_charges: true,
        validate_rules: true,
      }),
    });
    const lines: QuoteLine[] = (quote.charges ?? []).map((c) => ({ label: c.description, amount: c.amount, kind: lineKind(c.type) }));
    const total = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;
    const result: Quote = {
      slug: cabin.slug,
      checkin: stay.checkin,
      checkout: stay.checkout,
      nights: nightsBetween(stay.checkin, stay.checkout),
      currency: "USD",
      lines,
      total,
      source: "live",
    };
    return result;
  },

  async createReservation(cabin, stay, guest, payment) {
    const id = await propertyId(cabin);
    const created = await request<{ id: number }>("/v2/guests", {
      method: "POST",
      body: JSON.stringify({
        first_name: guest.firstName,
        last_name: guest.lastName,
        email_addresses: [{ address: guest.email, is_default: true, type: "home" }],
        phones: [{ number: guest.phone, is_default: true, type: "mobile" }],
      }),
    });
    const notes = [
      "Direct booking from vacaytothesmokies.com.",
      payment.processor !== "none" ? `Paid $${payment.amount.toFixed(2)} via ${payment.processor}${payment.reference ? ` (ref ${payment.reference})` : ""}.` : null,
      guest.arrivalTime ? `Estimated arrival: ${guest.arrivalTime}.` : null,
      guest.notes ? `Guest note: ${guest.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    const booking = await request<{ id: number }>("/v2/bookings", {
      method: "POST",
      body: JSON.stringify({
        property_id: id,
        guest_id: created.id,
        arrival: stay.checkin,
        departure: stay.checkout,
        adults: stay.adults,
        children: stay.children,
        pets: stay.pets,
        is_block: false,
        generate_charges: true,
        notes,
      }),
    });
    return { reference: `VTS-${booking.id}`, source: "live" };
  },
};
