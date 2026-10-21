"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronDown, Loader2, Lock, ShieldCheck, Star, Users, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { formatStayRange, usd } from "@/lib/booking/dates";
import { guestLabel } from "@/lib/booking/search-params";
import { OwnerRezBookingWidget } from "./OwnerRezBookingWidget";
import { DateRangePicker } from "./DateRangePicker";
import { GuestPicker } from "./GuestPicker";
import { Popover } from "./Popover";
import { PriceBreakdown } from "./PriceBreakdown";
import { useStay } from "./StayContext";

type Panel = "dates" | "guests" | null;

/** Date/guest fields, live quote and Book Now button. Shared by the desktop sidebar and the mobile sheet. */
function BookingForm() {
  const { cabin, dates, setDates, guests, setGuests, calendar, calendarError, stay, problem, quote } = useStay();
  const [panel, setPanel] = useState<Panel>(null);
  const [booking, setBooking] = useState(false);
  const close = () => setPanel(null);

  const ready = quote.status === "ready";

  // Unavailable dates turn the main button into a shortcut back to the calendar instead of a dead end.
  const datesProblem = Boolean(stay && (problem || quote.status === "error"));

  // Booking itself happens in OwnerRez's widget, prefilled with the dates and guests chosen here.
  function bookNow() {
    if (!stay || datesProblem) return setPanel("dates");
    setBooking(true);
  }

  const label = !stay ? `Check ${cabin.name} Availability` : datesProblem ? "Change dates" : quote.status === "loading" ? "Checking price…" : "Book Now";

  return (
    <div>
      <div className="relative rounded-2xl border border-linen-200">
        <button
          type="button"
          data-popover-trigger
          onClick={() => setPanel((p) => (p === "dates" ? null : "dates"))}
          aria-expanded={panel === "dates"}
          className="flex w-full items-center gap-3 rounded-t-2xl px-4 py-3 text-left hover:bg-linen-100/60"
        >
          <CalendarDays className="size-5 text-ember-500" aria-hidden />
          <span className="flex flex-col">
            <span className="text-[0.7rem] font-bold tracking-[0.16em] text-ink-600 uppercase">Dates</span>
            <span className={`text-[0.95rem] font-semibold ${dates.checkin ? "text-forest-900" : "text-ink-600/70"}`}>
              {formatStayRange(dates.checkin, dates.checkout)}
            </span>
          </span>
          <ChevronDown className="ml-auto size-4 text-ink-600" aria-hidden />
        </button>
        <div className="border-t border-linen-200" />
        <button
          type="button"
          data-popover-trigger
          onClick={() => setPanel((p) => (p === "guests" ? null : "guests"))}
          aria-expanded={panel === "guests"}
          className="flex w-full items-center gap-3 rounded-b-2xl px-4 py-3 text-left hover:bg-linen-100/60"
        >
          <Users className="size-5 text-ember-500" aria-hidden />
          <span className="flex flex-col">
            <span className="text-[0.7rem] font-bold tracking-[0.16em] text-ink-600 uppercase">Guests</span>
            <span className="text-[0.95rem] font-semibold text-forest-900">{guestLabel(guests)}</span>
          </span>
          <ChevronDown className="ml-auto size-4 text-ink-600" aria-hidden />
        </button>

        <Popover
          open={panel === "dates"}
          onClose={close}
          title="Select your dates"
          align="right"
          className="md:w-max"
          footer={
            <>
              <button type="button" onClick={() => setDates({})} className="text-sm font-semibold text-forest-800 underline underline-offset-4">
                Clear dates
              </button>
              <button type="button" onClick={close} className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-cream-50">
                Done
              </button>
            </>
          }
        >
          {calendarError && <p className="mb-3 text-sm text-rose-500">{calendarError}</p>}
          <DateRangePicker
            value={dates}
            calendar={calendar}
            loading={!calendar && !calendarError}
            onChange={(next) => {
              setDates(next);
              if (next.checkout) close();
            }}
          />
        </Popover>
        <Popover open={panel === "guests"} onClose={close} title="Guests" align="right" className="md:w-[22rem]">
          <GuestPicker
            value={guests}
            onChange={setGuests}
            maxGuests={cabin.details.maxGuests}
            childrenAllowed={cabin.details.childrenAllowed}
            petsAllowed={cabin.details.petsAllowed}
          />
        </Popover>
      </div>

      {problem && <p className="mt-4 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{problem}</p>}
      {quote.status === "error" && <p className="mt-4 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{quote.error}</p>}

      <button
        type="button"
        onClick={bookNow}
        disabled={Boolean(stay && !datesProblem && !ready)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-4 font-semibold text-cream-50 transition-colors hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {quote.status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {label}
      </button>
      {stay && ready && <p className="mt-3 text-center text-sm text-ink-600">You won&apos;t be charged until the final step.</p>}

      <Modal open={booking} onClose={() => setBooking(false)} title={`Book ${cabin.name}`} size="md">
        {stay && (
          <p className="mb-5 rounded-2xl bg-linen-100 px-4 py-3 text-sm text-forest-800">
            <span className="font-semibold">{formatStayRange(stay.checkin, stay.checkout)}</span> · {guestLabel(stay)}
            {quote.status === "ready" && (
              <>
                {" "}
                · <span className="font-semibold">{usd(quote.quote.total)} total</span>
              </>
            )}
          </p>
        )}
        <OwnerRezBookingWidget propertyKey={cabin.ownerRezKey} checkin={stay?.checkin} checkout={stay?.checkout} guests={guests} />
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-600">
          <Lock className="mt-0.5 size-4 shrink-0 text-pine-600" aria-hidden />
          Add your details, then Book Now takes you to our secure OwnerRez checkout to pay. Prefer to ask first? Use Send Inquiry.
        </p>
      </Modal>

      {quote.status === "loading" && (
        <div className="mt-6 space-y-3" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-linen-100" />
          ))}
        </div>
      )}
      {quote.status === "ready" && (
        <div className="mt-6">
          <PriceBreakdown quote={quote.quote} />
        </div>
      )}
      {!stay && <p className="mt-4 text-sm text-ink-600">Pick check-in and checkout to see your exact total, including cleaning fee and taxes.</p>}

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-600">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-pine-600" aria-hidden />
        Book direct with your hosts, with secure checkout and no booking-platform service fees.
      </p>
    </div>
  );
}

function PriceHeading() {
  const { cabin, quote } = useStay();
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      {/* Only real OwnerRez totals are shown, and only after dates are chosen. */}
      {quote.status === "ready" ? (
        <p>
          <span className="font-serif text-3xl text-forest-900">{usd(quote.quote.total)}</span>
          <span className="text-ink-600"> total</span>
        </p>
      ) : (
        <p className="font-serif text-2xl text-forest-900">Your stay</p>
      )}
      <p className="flex items-center gap-1 text-sm font-semibold text-forest-900">
        <Star className="size-4 fill-ember-500 text-ember-500" aria-hidden />
        {cabin.details.rating.toFixed(2)}
        <span className="font-normal text-ink-600">({cabin.details.reviewCount})</span>
      </p>
    </div>
  );
}

/** Sticky booking card (desktop) + bottom bar and sheet (mobile). */
export function BookingPanel() {
  const { cabin, quote, dates, problem } = useStay();
  const unavailable = Boolean(dates.checkout && (problem || quote.status === "error"));
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  // Deep links like /cabins/emerald-forest#book open the sheet on mobile.
  useEffect(() => {
    if (window.location.hash === "#book" && window.innerWidth < 1024) {
      const id = window.setTimeout(() => setSheet(true), 300);
      return () => window.clearTimeout(id);
    }
  }, []);

  return (
    <>
      <aside
        id="book"
        aria-label="Book this cabin"
        className="sticky top-28 z-20 hidden scroll-mt-28 rounded-[1.75rem] bg-white p-6 shadow-lift ring-1 ring-forest-900/5 lg:block"
      >
        <PriceHeading />
        <BookingForm />
      </aside>

      <div data-mobile-booking-bar className="fixed inset-x-0 bottom-0 z-40 border-t border-linen-200 bg-cream-50/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div className="min-w-0">
            {quote.status === "ready" ? (
              <p className="font-serif text-lg whitespace-nowrap text-forest-900 sm:text-xl">
                {usd(quote.quote.total)} <span className="font-sans text-sm text-ink-600">total</span>
              </p>

            ) : unavailable ? (
              <p className="font-serif text-lg whitespace-nowrap text-rose-500 sm:text-xl">
                <span className="hidden min-[360px]:inline">Dates unavailable</span>
                <span className="min-[360px]:hidden">Unavailable</span>
              </p>
            ) : (
              <p className="font-serif text-lg whitespace-nowrap text-forest-900 sm:text-xl">Check dates</p>
            )}
            <p className="truncate text-sm text-ink-600 underline underline-offset-2">{formatStayRange(dates.checkin, dates.checkout)}</p>
          </div>
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="shrink-0 rounded-full bg-ember-500 px-5 py-3 font-semibold text-cream-50 hover:bg-ember-600 sm:px-6"
          >
            {quote.status === "ready" ? (
              "Book Now"
            ) : unavailable ? (
              "Change dates"
            ) : (
              <>
                {/* The cabin-specific label fits from tablet width; phones use the short form. */}
                <span className="hidden sm:inline">Check {cabin.name} Availability</span>
                <span className="sm:hidden">Check availability</span>
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sheet && (
          <motion.div
            className="fixed inset-0 z-[55] overflow-y-auto bg-cream-50 lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-label="Book this cabin"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-linen-200 bg-cream-50 px-4 py-3">
              <p className="font-serif text-xl text-forest-900">Your stay</p>
              <button type="button" onClick={() => setSheet(false)} aria-label="Close" className="rounded-full p-2 hover:bg-linen-100">
                <X className="size-5" />
              </button>
            </div>
            <div className="px-4 py-6 pb-16">
              <PriceHeading />
              <BookingForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
