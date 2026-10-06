import { eachNight, fromISO, nightsBetween, todayISO } from "./dates";
import type { AvailabilityCalendar, CabinDetails, Guests, Stay } from "./types";

/** Guest-count rules that don't depend on dates. Returns an error message or null. */
export function checkGuests(details: CabinDetails, guests: Guests): string | null {
  if (guests.adults < 1) return "At least one adult is required.";
  if (guests.adults + guests.children > details.maxGuests)
    return `This cabin sleeps up to ${details.maxGuests} ${details.maxGuests === 1 ? "guest" : "guests"}.`;
  if (guests.children > 0 && !details.childrenAllowed) return "This cabin is designed for adults and isn't suitable for children.";
  if (guests.pets > 0 && !details.petsAllowed) return "Pets aren't allowed at this cabin.";
  return null;
}

/** Validate a stay against the cabin's calendar. Returns an error message or null. */
export function checkStay(calendar: AvailabilityCalendar, stay: Stay): string | null {
  if (!fromISO(stay.checkin) || !fromISO(stay.checkout)) return "Choose your check-in and checkout dates.";
  if (stay.checkin < todayISO()) return "Check-in can't be in the past.";
  const nights = nightsBetween(stay.checkin, stay.checkout);
  if (nights < 1) return "Checkout must be after check-in.";

  const blocked = new Set(calendar.blocked);
  if (eachNight(stay.checkin, stay.checkout).some((night) => blocked.has(night)))
    return "Some of those nights are already booked.";
  if (calendar.noArrival.includes(stay.checkin)) return "Check-in isn't available on that date.";
  if (calendar.noDeparture.includes(stay.checkout)) return "Checkout isn't available on that date.";

  const minStay = calendar.minStay[stay.checkin] ?? calendar.defaultMinStay;
  if (nights < minStay) return `Stays starting on that date require at least ${minStay} nights.`;
  return null;
}
