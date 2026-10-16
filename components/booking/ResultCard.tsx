import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Star, Users } from "lucide-react";
import type { CabinWithDetails } from "@/data/cabins";
import { getRatingSummary } from "@/lib/reviews";
import type { Quote } from "@/lib/booking/types";

const badgeTones = {
  rose: "bg-rose-500 text-white",
  ember: "bg-ember-500 text-cream-50",
  cream: "bg-cream-50/95 text-forest-900",
};

type Props = {
  cabin: CabinWithDetails;
  href: string;
  quote?: Quote;
  unavailableReason?: string;
};

export async function ResultCard({ cabin, href, quote, unavailableReason }: Props) {
  // Live OwnerRez rating, falling back to the saved listing figures.
  const live = await getRatingSummary(cabin.slug);
  const rating = live?.rating ?? cabin.details.rating;
  const reviewCount = live?.count ?? cabin.details.reviewCount;
  const muted = Boolean(unavailableReason);
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5 transition-shadow duration-500 ${
        muted ? "opacity-75" : "hover:shadow-lift"
      }`}
    >
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden" aria-label={`View ${cabin.name}`}>
        <Image
          src={cabin.image}
          alt={`${cabin.name}, ${cabin.tagline}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${muted ? "grayscale-[40%]" : ""}`}
        />
        {cabin.badge && !muted && (
          <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold ${badgeTones[cabin.badge.tone]}`}>
            {cabin.badge.label}
          </span>
        )}
        {muted && (
          <span className="absolute top-4 left-4 rounded-full bg-forest-950/80 px-3 py-1 text-xs font-bold text-cream-50">Unavailable</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ember-600">{cabin.tagline}</p>
            <h3 className="mt-1 font-serif text-2xl font-medium text-forest-900">
              <Link href={href} className="hover:text-ember-600">
                {cabin.name}
              </Link>
            </h3>
          </div>
          <p className="mt-1 flex shrink-0 items-center gap-1 text-sm font-semibold text-forest-900">
            <Star className="size-4 fill-ember-500 text-ember-500" aria-hidden />
            {rating.toFixed(2)}
            <span className="font-normal text-ink-600">({reviewCount})</span>
          </p>
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-600">
          <li className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-pine-600" aria-hidden />
            {cabin.size}
          </li>
          <li className="flex items-center gap-1.5">
            <Bath className="size-4 text-pine-600" aria-hidden />
            {cabin.baths} Bath
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="size-4 text-pine-600" aria-hidden />
            Sleeps {cabin.details.maxGuests}
          </li>
        </ul>

        <ul className="mt-4 mb-6 flex flex-wrap gap-2">
          {cabin.highlights.map((h) => (
            <li key={h} className="rounded-full bg-linen-100 px-3 py-1 text-xs font-semibold text-forest-800">
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-linen-200 pt-5">
          {muted ? (
            <p className="text-sm leading-snug text-ink-600">{unavailableReason}</p>
          ) : (
            // Prices appear only in the cabin page's booking card, once dates are chosen.
            <p className="text-sm leading-snug text-ink-600">{quote ? "Available for your dates" : "Choose dates to see your price"}</p>
          )}
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-ember-500"
          >
            {muted ? "See calendar" : quote ? "Book now" : "View dates"}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
