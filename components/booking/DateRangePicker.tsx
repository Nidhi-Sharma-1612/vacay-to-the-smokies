"use client";

import { useMemo } from "react";
import { DayPicker, type Matcher } from "react-day-picker";
import { addDays, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { Loader2 } from "lucide-react";
import "react-day-picker/style.css";
import { fromISO, toISO } from "@/lib/booking/dates";
import type { AvailabilityCalendar } from "@/lib/booking/types";
import { useIsDesktop } from "@/lib/hooks";

export type DateRange = { checkin?: string; checkout?: string };

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Booked nights and stay rules are disabled and marked in the calendar. */
  calendar?: AvailabilityCalendar | null;
  /** True while `calendar` is being fetched. */
  loading?: boolean;
  /** Legend wording for unavailable nights, e.g. "Booked" for one cabin or "Fully booked" across all cabins. */
  bookedLabel?: string;
};

export function DateRangePicker({ value, onChange, calendar, loading = false, bookedLabel = "Booked" }: Props) {
  const desktop = useIsDesktop();
  const from = fromISO(value.checkin);
  const to = fromISO(value.checkout);
  const today = useMemo(() => startOfDay(new Date()), []);

  const { disabled, booked, available } = useMemo(() => {
    const past: Matcher = { before: today };
    if (!calendar) return { disabled: [past], booked: () => false, available: () => false };

    const blocked = new Set(calendar.blocked);
    const noArrival = new Set(calendar.noArrival);
    const noDeparture = new Set(calendar.noDeparture);
    const choosingCheckout = Boolean(from && !to);

    // While choosing checkout, the first booked night after check-in is still a valid checkout morning.
    let firstBlocked: Date | null = null;
    if (from && choosingCheckout) {
      for (let d = from, i = 0; i < 400; d = addDays(d, 1), i++) {
        if (blocked.has(toISO(d))) {
          firstBlocked = d;
          break;
        }
      }
    }
    const isBooked = (d: Date) => blocked.has(toISO(d)) && !(firstBlocked && isSameDay(d, firstBlocked));

    let rule: Matcher;
    if (!from || !choosingCheckout) {
      // Choosing check-in: any free night that allows arrival.
      rule = (d: Date) => blocked.has(toISO(d)) || noArrival.has(toISO(d));
    } else {
      // Choosing checkout: after check-in, at least the minimum stay, and no booked night in between.
      const minStay = calendar.minStay[toISO(from)] ?? calendar.defaultMinStay;
      rule = (d: Date) => {
        if (!isAfter(d, from)) return blocked.has(toISO(d)) || noArrival.has(toISO(d)); // still pickable as a new check-in
        if (isBefore(d, addDays(from, minStay))) return true;
        if (firstBlocked && isAfter(d, firstBlocked)) return true;
        return noDeparture.has(toISO(d));
      };
    }
    return {
      disabled: [past, rule],
      booked: (d: Date) => !isBefore(d, today) && isBooked(d),
      available: (d: Date) => !isBefore(d, today) && !isBooked(d),
    };
  }, [calendar, from, to, today]);

  return (
    <div>
      <DayPicker
        mode="range"
        numberOfMonths={desktop ? 2 : 1}
        selected={{ from, to }}
        disabled={disabled}
        excludeDisabled={false}
        modifiers={{ booked, available }}
        modifiersClassNames={{ booked: "vts-booked", available: "vts-available" }}
        startMonth={today}
        endMonth={addDays(today, 365)}
        defaultMonth={from ?? today}
        onSelect={(_, day) => {
          // Custom range logic: a click with no open range starts a new one.
          if (!from || to || !isAfter(day, from)) onChange({ checkin: toISO(day), checkout: undefined });
          else onChange({ checkin: value.checkin, checkout: toISO(day) });
        }}
        className="vts-calendar"
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-600" aria-live="polite">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-3.5 animate-spin text-ember-500" aria-hidden /> Checking availability…
          </span>
        ) : calendar ? (
          <>
            <span className="flex items-center gap-2">
              <span className="vts-legend-available" aria-hidden /> Available
            </span>
            <span className="flex items-center gap-2">
              <span className="vts-legend-booked" aria-hidden /> {bookedLabel}
            </span>
            <span className="flex items-center gap-2">
              <span className="vts-legend-selected" aria-hidden /> Your stay
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
