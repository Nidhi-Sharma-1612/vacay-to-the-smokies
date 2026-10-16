"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useAvailability, useQuote } from "@/lib/booking/client";
import { checkGuests, checkStay } from "@/lib/booking/rules";
import { defaultGuests } from "@/lib/booking/search-params";
import type { AvailabilityCalendar, CabinDetails, Guests, Stay, StaySearch } from "@/lib/booking/types";
import type { DateRange } from "./DateRangePicker";

export type BookableCabin = {
  slug: string;
  name: string;
  /** OwnerRez property key, used by the booking widget. */
  ownerRezKey: string;
  details: Pick<CabinDetails, "maxGuests" | "childrenAllowed" | "petsAllowed" | "rateRange" | "rating" | "reviewCount">;
};

type StayState = {
  cabin: BookableCabin;
  dates: DateRange;
  setDates: (d: DateRange) => void;
  guests: Guests;
  setGuests: (g: Guests) => void;
  calendar: AvailabilityCalendar | null;
  calendarError?: string;
  /** The complete stay once dates are chosen, else null. */
  stay: Stay | null;
  /** A client-side rule problem (e.g. too many guests) found before asking the server. */
  problem: string | null;
  quote: ReturnType<typeof useQuote>;
};

const StayContext = createContext<StayState | null>(null);

export function useStay() {
  const ctx = useContext(StayContext);
  if (!ctx) throw new Error("useStay must be used inside <StayProvider>");
  return ctx;
}

export function StayProvider({ cabin, initial, children }: { cabin: BookableCabin; initial: StaySearch; children: React.ReactNode }) {
  const [dates, setDates] = useState<DateRange>({ checkin: initial.checkin, checkout: initial.checkout });
  const [guests, setGuests] = useState<Guests>({
    adults: Math.min(initial.adults ?? defaultGuests.adults, cabin.details.maxGuests),
    children: cabin.details.childrenAllowed ? initial.children : 0,
    pets: cabin.details.petsAllowed ? initial.pets : 0,
  });
  const { calendar, error: calendarError } = useAvailability({ slug: cabin.slug });

  const stay = useMemo<Stay | null>(
    () => (dates.checkin && dates.checkout ? { slug: cabin.slug, checkin: dates.checkin, checkout: dates.checkout, ...guests } : null),
    [cabin.slug, dates.checkin, dates.checkout, guests],
  );

  // Check the stay locally first so obviously invalid stays never hit the pricing API.
  const problem = useMemo(() => {
    const guestError = checkGuests(cabin.details as CabinDetails, guests);
    if (guestError) return guestError;
    return stay && calendar ? checkStay(calendar, stay) : null;
  }, [cabin.details, guests, stay, calendar]);

  const quote = useQuote(problem || !calendar ? null : stay);

  const value: StayState = { cabin, dates, setDates, guests, setGuests, calendar, calendarError, stay, problem, quote };
  return <StayContext.Provider value={value}>{children}</StayContext.Provider>;
}
