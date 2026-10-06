import { addDays, getDay, getMonth } from "date-fns";
import type { CabinWithDetails } from "@/data/cabins";
import { eachNight, fromISO, nightsBetween, toISO } from "../dates";
import type { AvailabilityCalendar, Quote, QuoteLine } from "../types";
import type { BookingProvider } from "./types";

/**
 * Demo provider used until OwnerRez credentials are configured.
 * Availability is generated deterministically per cabin so it stays stable between requests,
 * and prices are derived from each cabin's real published rate range.
 */

const TAX_RATE = 0.1275;
const PET_FEE = 75;
const DEFAULT_MIN_STAY = 2;

// Reservations made in demo mode block their nights until the server restarts.
const demoReservations = new Map<string, Set<string>>();

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function nightlyRate(cabin: CabinWithDetails, date: Date) {
  const { min, max } = cabin.details.rateRange;
  let rate = min + (max - min) * 0.22;
  const day = getDay(date);
  const month = getMonth(date);
  if (day === 5 || day === 6) rate *= 1.3; // Fri & Sat nights
  if (month === 9) rate *= 1.35; // October leaf season
  if (month === 0 || month === 1) rate *= 0.85; // quiet winter
  if ((month === 11 && date.getDate() >= 20) || (month === 0 && date.getDate() <= 2)) rate *= 1.3; // holidays
  return Math.round(Math.min(Math.max(rate, min), max));
}

function blockedNights(cabin: CabinWithDetails, from: Date, days: number) {
  const blocked = new Set<string>(demoReservations.get(cabin.slug));
  let i = 0;
  while (i < days) {
    const date = addDays(from, i);
    const roll = hash(`${cabin.slug}:${toISO(date)}`);
    // Busier on weekends and in October; roughly 45% occupancy overall.
    const weekend = getDay(date) >= 4;
    const threshold = (getMonth(date) === 9 ? 0.32 : 0.2) + (weekend ? 0.12 : 0);
    if (roll < threshold) {
      const length = 2 + Math.floor(hash(`${cabin.slug}:len:${i}`) * 3);
      for (let n = 0; n < length; n++) blocked.add(toISO(addDays(from, i + n)));
      i += length + 1;
    } else {
      i += 1;
    }
  }
  return blocked;
}

export const mockProvider: BookingProvider = {
  source: "demo",

  async getCalendar(cabin, from, to) {
    const start = fromISO(from)!;
    const days = Math.max(nightsBetween(from, to), 1);
    const rates: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = addDays(start, i);
      rates[toISO(date)] = nightlyRate(cabin, date);
    }
    const calendar: AvailabilityCalendar = {
      slug: cabin.slug,
      currency: "USD",
      blocked: [...blockedNights(cabin, start, days)].sort(),
      noArrival: [],
      noDeparture: [],
      minStay: {},
      rates,
      defaultMinStay: DEFAULT_MIN_STAY,
    };
    return calendar;
  },

  async getQuote(cabin, stay) {
    const nights = eachNight(stay.checkin, stay.checkout);
    const rent = nights.reduce((sum, night) => sum + nightlyRate(cabin, fromISO(night)!), 0);
    const lines: QuoteLine[] = [
      { label: `Rent · ${nights.length} ${nights.length === 1 ? "night" : "nights"}`, amount: rent, kind: "rent" },
      { label: "Cleaning fee", amount: cabin.cleaningFee, kind: "fee" },
    ];
    if (stay.pets > 0) lines.push({ label: `Pet fee · ${stay.pets} ${stay.pets === 1 ? "pet" : "pets"}`, amount: PET_FEE * stay.pets, kind: "fee" });
    const taxable = lines.reduce((s, l) => s + l.amount, 0);
    lines.push({ label: "Lodging taxes", amount: Math.round(taxable * TAX_RATE * 100) / 100, kind: "tax" });
    const total = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100;
    const quote: Quote = { slug: cabin.slug, checkin: stay.checkin, checkout: stay.checkout, nights: nights.length, currency: "USD", lines, total, source: "demo" };
    return quote;
  },

  async createReservation(cabin, stay) {
    const nights = demoReservations.get(cabin.slug) ?? new Set<string>();
    eachNight(stay.checkin, stay.checkout).forEach((n) => nights.add(n));
    demoReservations.set(cabin.slug, nights);
    const reference = `VTS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    return { reference, source: "demo" };
  },
};
