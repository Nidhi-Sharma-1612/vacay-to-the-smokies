import Link from "next/link";
import { Star } from "lucide-react";
import { getCabin } from "@/data/cabins";
import type { GuestReview } from "@/lib/reviews";

type Props = { review: GuestReview; showCabin?: boolean; clamp?: boolean; showResponse?: boolean };

/** A real guest review from OwnerRez, in the site's card style. */
export function ReviewCard({ review, showCabin = true, clamp = false, showResponse = false }: Props) {
  const cabin = review.cabinSlug ? getCabin(review.cabinSlug) : undefined;
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-forest-900/5 sm:p-7">
      <div className="flex text-ember-500" aria-label={`${review.stars} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`size-4 ${i < Math.round(review.stars) ? "fill-current" : "text-linen-200"}`} aria-hidden />
        ))}
      </div>
      {review.title && <h3 className="mt-3 font-serif text-lg text-forest-900">{review.title}</h3>}
      <blockquote className={`mt-3 flex-1 leading-relaxed whitespace-pre-line text-forest-800 ${clamp ? "line-clamp-6" : ""}`}>
        {review.body}
      </blockquote>
      {showResponse && review.response && (
        <div className="mt-4 rounded-2xl bg-linen-100 px-4 py-3 text-sm leading-relaxed text-ink-600">
          <p className="font-semibold text-forest-900">Response from Vacay To The Smokies</p>
          <p className="mt-1 whitespace-pre-line">{review.response}</p>
        </div>
      )}
      <footer className="mt-5 flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-linen-100 font-serif text-forest-900" aria-hidden>
          {review.author.charAt(0)}
        </span>
        <p className="min-w-0 text-sm leading-tight">
          <span className="block font-semibold text-forest-900">{review.author}</span>
          <span className="text-ink-600">
            {review.stayed && <>Stayed {review.stayed}</>}
            {showCabin && cabin && (
              <>
                {review.stayed && " · "}
                <Link href={cabin.href} className="underline-offset-2 hover:text-ember-600 hover:underline">
                  {cabin.name}
                </Link>
              </>
            )}
          </span>
        </p>
      </footer>
    </article>
  );
}
