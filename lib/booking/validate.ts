import { fromISO } from "./dates";
import type { GuestDetails, Stay } from "./types";

const int = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : null;

/** Parse an untrusted request body into a Stay, or null. */
export function readStay(body: unknown): Stay | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const adults = int(b.adults, 1, 20);
  const children = int(b.children ?? 0, 0, 20);
  const pets = int(b.pets ?? 0, 0, 3);
  if (typeof b.slug !== "string" || typeof b.checkin !== "string" || typeof b.checkout !== "string") return null;
  if (!fromISO(b.checkin) || !fromISO(b.checkout) || adults == null || children == null || pets == null) return null;
  return { slug: b.slug, checkin: b.checkin, checkout: b.checkout, adults, children, pets };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Parse untrusted guest details, returning field errors keyed by field name. */
export function readGuest(body: unknown): { guest: GuestDetails | null; errors: Partial<Record<keyof GuestDetails, string>> } {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const str = (k: string, max = 200) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "");
  const guest: GuestDetails = {
    firstName: str("firstName", 80),
    lastName: str("lastName", 80),
    email: str("email", 160),
    phone: str("phone", 40),
    arrivalTime: str("arrivalTime", 40) || undefined,
    notes: str("notes", 1000) || undefined,
  };
  const errors: Partial<Record<keyof GuestDetails, string>> = {};
  if (!guest.firstName) errors.firstName = "Enter your first name.";
  if (!guest.lastName) errors.lastName = "Enter your last name.";
  if (!EMAIL.test(guest.email)) errors.email = "Enter a valid email address.";
  if (guest.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a phone number we can reach you on.";
  return { guest: Object.keys(errors).length ? null : guest, errors };
}
