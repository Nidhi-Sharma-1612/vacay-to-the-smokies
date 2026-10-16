import { fromISO } from "./dates";
import type { Stay } from "./types";

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
