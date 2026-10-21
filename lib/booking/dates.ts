import { addDays, differenceInCalendarDays, format, isValid, parse } from "date-fns";

export const ISO = "yyyy-MM-dd";

export const toISO = (date: Date) => format(date, ISO);

export function fromISO(value: string | undefined | null): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = parse(value, ISO, new Date());
  return isValid(date) ? date : undefined;
}

export const todayISO = () => toISO(new Date());

export function nightsBetween(checkin: string, checkout: string) {
  const a = fromISO(checkin);
  const b = fromISO(checkout);
  return a && b ? differenceInCalendarDays(b, a) : 0;
}

/** Every night of a stay: checkin inclusive, checkout exclusive. */
export function eachNight(checkin: string, checkout: string): string[] {
  const start = fromISO(checkin);
  const n = nightsBetween(checkin, checkout);
  if (!start || n <= 0) return [];
  return Array.from({ length: n }, (_, i) => toISO(addDays(start, i)));
}

export function formatStayRange(checkin?: string, checkout?: string) {
  const a = fromISO(checkin);
  const b = fromISO(checkout);
  if (!a) return "Add dates";
  if (!b) return `${format(a, "MMM d")} – Add checkout`;
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  return sameMonth ? `${format(a, "MMM d")} – ${format(b, "d, yyyy")}` : `${format(a, "MMM d")} – ${format(b, "MMM d, yyyy")}`;
}

export function formatLongDate(value: string) {
  const d = fromISO(value);
  return d ? format(d, "EEE, MMM d, yyyy") : value;
}

/**
 * "16:00" -> "4:00 PM". Check-in/out times are admin-editable text (see
 * lib/cabin-cms.ts), so a malformed value here is reachable, not just a
 * theoretical bad input — fail soft instead of throwing and 500ing the page.
 */
export function formatTime(value: string | null) {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || h > 23 || m < 0 || m > 59) return value;
  return format(new Date(2000, 0, 1, h, m), "h:mm a");
}

export const usd = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
