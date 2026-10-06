import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck2, Clock, KeyRound, Mail, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCabin } from "@/data/cabins";
import { site } from "@/data/site";
import { formatLongDate, formatTime, nightsBetween, usd } from "@/lib/booking/dates";
import { guestLabel, parseStay } from "@/lib/booking/search-params";

export const metadata: Metadata = { title: "Booking confirmed | Vacay To The Smokies", robots: { index: false } };

export default async function ConfirmedPage({ searchParams }: PageProps<"/booking/confirmed">) {
  const params = await searchParams;
  const stay = parseStay(params);
  const cabin = stay ? getCabin(stay.slug) : undefined;
  const ref = typeof params.ref === "string" ? params.ref.slice(0, 40) : null;
  const name = typeof params.name === "string" ? params.name.slice(0, 40) : "";
  const total = Number(params.total);

  return (
    <>
      <Navbar />
      <main className="grain min-h-screen pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-pine-600/15 text-pine-600">
              <CalendarCheck2 className="size-8" aria-hidden />
            </span>
            <p className="eyebrow mt-6 text-ember-500">You&apos;re booked</p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              {name ? `See you soon, ${name}!` : "See you in the Smokies!"}
            </h1>
            {ref && (
              <p className="mt-4 text-ink-600">
                Confirmation number <span className="font-semibold text-forest-900">{ref}</span>
              </p>
            )}
          </div>

          {stay && cabin && (
            <div className="mt-12 overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-forest-900/5">
              <div className="relative h-56 sm:h-72">
                <Image src={cabin.image} alt={cabin.name} fill sizes="768px" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 to-transparent" />
                <div className="absolute bottom-5 left-6 text-cream-50">
                  <p className="text-sm text-ember-300">{cabin.tagline}</p>
                  <p className="font-serif text-3xl">{cabin.name}</p>
                </div>
              </div>
              <dl className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
                <div>
                  <dt className="text-sm text-ink-600">Check-in</dt>
                  <dd className="font-semibold text-forest-900">{formatLongDate(stay.checkin)}</dd>
                  {cabin.details.checkIn && <dd className="text-sm text-ink-600">after {formatTime(cabin.details.checkIn)}</dd>}
                </div>
                <div>
                  <dt className="text-sm text-ink-600">Checkout</dt>
                  <dd className="font-semibold text-forest-900">{formatLongDate(stay.checkout)}</dd>
                  {cabin.details.checkOut && <dd className="text-sm text-ink-600">by {formatTime(cabin.details.checkOut)}</dd>}
                </div>
                <div>
                  <dt className="text-sm text-ink-600">Guests</dt>
                  <dd className="font-semibold text-forest-900">{guestLabel(stay)}</dd>
                  <dd className="text-sm text-ink-600">{nightsBetween(stay.checkin, stay.checkout)} nights</dd>
                </div>
                {Number.isFinite(total) && total > 0 && (
                  <div className="sm:col-span-3 flex justify-between border-t border-linen-200 pt-5">
                    <dt className="font-semibold text-forest-900">Total</dt>
                    <dd className="font-serif text-2xl text-forest-900">{usd(total)}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          <section className="mt-10 rounded-3xl bg-linen-100 p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-forest-900">What happens next</h2>
            <ul className="mt-5 space-y-4 text-ink-600">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-ember-500" aria-hidden />
                Your confirmation and receipt are on the way to your inbox.
              </li>
              <li className="flex gap-3">
                <KeyRound className="mt-0.5 size-5 shrink-0 text-ember-500" aria-hidden />
                Before arrival we&apos;ll send the address, directions and self check-in instructions.
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-ember-500" aria-hidden />
                Bringing a pet or celebrating something special? Reply to your confirmation and let us know.
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-ember-500" aria-hidden />
                <span className="min-w-0">
                  Questions? Call{" "}
                  <a href={site.phoneHref} className="font-semibold text-forest-900 underline underline-offset-2">
                    {site.phone}
                  </a>{" "}
                  or email{" "}
                  <a href={`mailto:${site.email}`} className="font-semibold [overflow-wrap:anywhere] text-forest-900 underline underline-offset-2">
                    {site.email}
                  </a>
                  .
                </span>
              </li>
            </ul>
          </section>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/#explore" className="rounded-full bg-forest-900 px-6 py-3 font-semibold text-cream-50 hover:bg-ember-500">
              Plan your Smokies trip
            </Link>
            <Link href="/" className="rounded-full border border-forest-800/25 px-6 py-3 font-semibold text-forest-800 hover:bg-white">
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
