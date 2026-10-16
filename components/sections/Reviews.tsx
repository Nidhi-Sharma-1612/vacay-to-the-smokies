import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { site } from "@/data/site";
import { getReviews, isHighlight } from "@/lib/reviews";
import { Reveal } from "@/components/ui/Reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";

/** Homepage reviews: live overall rating and recent real reviews from OwnerRez. */
export async function Reviews() {
  const { reviews, total, average } = await getReviews({ pageSize: 30 });
  const rating = average ?? site.rating;
  const count = total || site.reviewCount;
  const featured = reviews.filter(isHighlight).slice(0, 3);

  return (
    <section id="reviews" className="grain scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="eyebrow text-ember-500">Guest reviews</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.08] font-medium tracking-tight text-forest-900 sm:text-5xl">
              Loved by <em className="text-ember-600">couples &amp; families</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex items-end gap-5">
            <span className="font-serif text-6xl leading-none font-medium text-forest-900 sm:text-7xl">{rating.toFixed(2)}</span>
            <div className="pb-1">
              <div className="flex text-ember-500" aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-1.5 text-sm font-semibold text-ink-600">from {count} guest reviews</p>
            </div>
          </Reveal>
        </div>

        {featured.length > 0 && (
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((r, i) => (
              <li key={r.id}>
                <Reveal delay={i * 0.08} className="h-full">
                  <ReviewCard review={r} clamp />
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <Link href="/reviews" className="group inline-flex items-center gap-2 font-semibold text-forest-800 transition-colors hover:text-ember-600">
            Read all {count} reviews
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
