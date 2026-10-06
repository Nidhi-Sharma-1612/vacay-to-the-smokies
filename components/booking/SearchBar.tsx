"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, Home, Search, Users } from "lucide-react";
import { cabins } from "@/data/cabins";
import { useAvailability } from "@/lib/booking/client";
import { formatStayRange } from "@/lib/booking/dates";
import { defaultGuests, guestLabel, searchQuery } from "@/lib/booking/search-params";
import type { CabinCategory, Guests, StaySearch } from "@/lib/booking/types";
import { DateRangePicker, type DateRange } from "./DateRangePicker";
import { GuestPicker } from "./GuestPicker";
import { Popover } from "./Popover";

type Panel = "dates" | "guests" | null;

type Props = {
  initial?: Partial<StaySearch>;
  variant?: "hero" | "bar";
  /** "modal" opens the date and guest panels centered over the page (used on the hero, where space below is tight). */
  panelMode?: "anchored" | "modal";
};

const MAX_GUESTS = Math.max(...cabins.map((c) => c.details.maxGuests));

/** Where-dates-guests search used on the landing hero and the results page. */
export function SearchBar({ initial, variant = "hero", panelMode = "anchored" }: Props) {
  const router = useRouter();
  const [where, setWhere] = useState<string>(initial?.type ? `type:${initial.type}` : "");
  const [dates, setDates] = useState<DateRange>({ checkin: initial?.checkin, checkout: initial?.checkout });
  const [guests, setGuests] = useState<Guests>({
    adults: initial?.adults ?? defaultGuests.adults,
    children: initial?.children ?? 0,
    pets: initial?.pets ?? 0,
  });
  const [panel, setPanel] = useState<Panel>(null);
  const close = () => setPanel(null);

  // The calendar reflects the current cabin choice: one cabin's bookings, or nights sold out across the matching cabins.
  const [kind, id] = where.split(":");
  const { calendar, loading: calendarLoading } = useAvailability(kind === "cabin" ? { slug: id } : kind === "type" ? { type: id } : {});
  const bookedLabel = kind === "cabin" ? "Booked" : "Fully booked";

  function submit() {
    close();
    const stay = { ...guests, checkin: dates.checkin, checkout: dates.checkout };
    if (kind === "cabin") router.push(`/cabins/${id}${searchQuery(stay)}`);
    else router.push(`/cabins${searchQuery({ ...stay, type: (id as CabinCategory) || undefined })}#results`);
  }

  const shell =
    variant === "hero"
      ? "rounded-3xl bg-cream-50 p-2 shadow-lift"
      : "rounded-3xl bg-white p-2 shadow-soft ring-1 ring-forest-900/5";

  const fieldBtn = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors ${active ? "bg-linen-100" : "hover:bg-linen-100/70"}`;

  return (
    <div className={`relative flex w-full flex-col gap-1 lg:flex-row lg:items-center ${shell}`}>
      <label className={`${fieldBtn(false)} lg:flex-[1.1]`}>
        <Home className="size-5 shrink-0 text-ember-500" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[0.7rem] font-bold tracking-[0.16em] text-ink-600 uppercase">Cabin</span>
          <span className="relative">
            <select
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-[0.95rem] font-semibold text-forest-900 outline-none"
            >
              <option value="">Any cabin</option>
              <option value="type:forest">Secluded forest cabins</option>
              <option value="type:parkway">Walk to the Parkway</option>
              <optgroup label="Our cabins">
                {cabins.map((c) => (
                  <option key={c.slug} value={`cabin:${c.slug}`}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-ink-600" aria-hidden />
          </span>
        </span>
      </label>

      <span className="hidden h-10 w-px bg-linen-200 lg:block" aria-hidden />

      <div className="relative lg:flex-[1.4]">
        <button
          type="button"
          data-popover-trigger
          onClick={() => setPanel((p) => (p === "dates" ? null : "dates"))}
          aria-expanded={panel === "dates"}
          className={fieldBtn(panel === "dates")}
        >
          <CalendarDays className="size-5 shrink-0 text-ember-500" aria-hidden />
          <span className="flex min-w-0 flex-col">
            <span className="text-[0.7rem] font-bold tracking-[0.16em] text-ink-600 uppercase">Check in – Check out</span>
            <span className={`truncate text-[0.95rem] font-semibold ${dates.checkin ? "text-forest-900" : "text-ink-600/70"}`}>
              {formatStayRange(dates.checkin, dates.checkout)}
            </span>
          </span>
        </button>
        <Popover
          open={panel === "dates"}
          onClose={close}
          title="When are you coming?"
          align="center"
          className="md:w-max"
          mode={panelMode}
          footer={
            <>
              <button type="button" onClick={() => setDates({})} className="text-sm font-semibold text-forest-800 underline underline-offset-4">
                Clear dates
              </button>
              <button
                type="button"
                onClick={() => setPanel("guests")}
                className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-ember-500"
              >
                {dates.checkout ? "Next: guests" : "Skip"}
              </button>
            </>
          }
        >
          <DateRangePicker
            value={dates}
            calendar={calendar}
            loading={calendarLoading}
            bookedLabel={bookedLabel}
            onChange={(next) => {
              setDates(next);
              if (next.checkout) setPanel("guests");
            }}
          />
        </Popover>
      </div>

      <span className="hidden h-10 w-px bg-linen-200 lg:block" aria-hidden />

      <div className="relative lg:flex-1">
        <button
          type="button"
          data-popover-trigger
          onClick={() => setPanel((p) => (p === "guests" ? null : "guests"))}
          aria-expanded={panel === "guests"}
          className={fieldBtn(panel === "guests")}
        >
          <Users className="size-5 shrink-0 text-ember-500" aria-hidden />
          <span className="flex min-w-0 flex-col">
            <span className="text-[0.7rem] font-bold tracking-[0.16em] text-ink-600 uppercase">Guests</span>
            <span className="truncate text-[0.95rem] font-semibold text-forest-900">{guestLabel(guests)}</span>
          </span>
        </button>
        <Popover
          open={panel === "guests"}
          onClose={close}
          title="Who's coming?"
          align="right"
          mode={panelMode}
          className="md:w-[22rem]"
          footer={
            <button
              type="button"
              onClick={submit}
              className="ml-auto rounded-full bg-ember-500 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-ember-600"
            >
              Search cabins
            </button>
          }
        >
          <GuestPicker value={guests} onChange={setGuests} maxGuests={MAX_GUESTS} />
        </Popover>
      </div>

      <button
        type="button"
        onClick={submit}
        className="flex items-center justify-center gap-2 rounded-2xl bg-ember-500 px-7 py-4 font-semibold text-cream-50 transition-colors hover:bg-ember-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-500 lg:rounded-full"
      >
        <Search className="size-5" aria-hidden />
        Check availability
      </button>
    </div>
  );
}
