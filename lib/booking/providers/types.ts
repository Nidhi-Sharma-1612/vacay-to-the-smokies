import type { CabinWithDetails } from "@/data/cabins";
import type { AvailabilityCalendar, GuestDetails, Quote, Reservation, Stay } from "../types";

export type PaymentRecord = { processor: "stripe" | "none"; reference?: string; amount: number };

/** Anything that can supply availability, pricing and reservations for a cabin. */
export interface BookingProvider {
  readonly source: "live" | "demo";
  getCalendar(cabin: CabinWithDetails, from: string, to: string): Promise<AvailabilityCalendar>;
  getQuote(cabin: CabinWithDetails, stay: Stay): Promise<Quote>;
  createReservation(cabin: CabinWithDetails, stay: Stay, guest: GuestDetails, payment: PaymentRecord): Promise<Reservation>;
}

export class ProviderError extends Error {}
