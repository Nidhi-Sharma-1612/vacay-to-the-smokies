import type { CabinWithDetails } from "@/data/cabins";
import type { AvailabilityCalendar, GuestDetails, Quote, Reservation, Stay } from "../types";

/** How the stay was paid for. `processor` is "none" until a payment method is connected. */
export type PaymentRecord = { processor: string; reference?: string; amount: number };

/** Anything that can supply availability, pricing and reservations for a cabin. */
export interface BookingProvider {
  readonly source: "live" | "demo";
  getCalendar(cabin: CabinWithDetails, from: string, to: string): Promise<AvailabilityCalendar>;
  getQuote(cabin: CabinWithDetails, stay: Stay): Promise<Quote>;
  createReservation(cabin: CabinWithDetails, stay: Stay, guest: GuestDetails, payment: PaymentRecord): Promise<Reservation>;
}

export class ProviderError extends Error {}
