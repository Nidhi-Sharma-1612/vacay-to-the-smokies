import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { cabins } from "@/data/cabins";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

// Ratings come from each cabin's verified reviews. Guest quotes can be added here once real reviews are supplied.
export function Reviews() {
  const byRating = [...cabins].sort((a, b) => b.details.rating - a.details.rating);
  return (
    <section id="reviews" className="grain py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-8">
        <Reveal>
          <p className="eyebrow text-ember-500">Guest reviews</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.08] font-medium tracking-tight text-forest-900 sm:text-5xl">
            Loved by <em className="text-ember-600">couples &amp; families</em>
          </h2>
          <div className="mt-10 flex items-end gap-5">
            <span className="font-serif text-7xl leading-none font-medium text-forest-900 sm:text-8xl">{site.rating}</span>
            <div className="pb-2">
              <div className="flex text-ember-500" aria-label={`${site.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-1.5 text-sm font-semibold text-ink-600">from {site.reviewCount} guest reviews</p>
            </div>
          </div>
          <Link
            href="/cabins"
            className="group mt-8 inline-flex items-center gap-2 font-semibold text-forest-800 transition-colors hover:text-ember-600"
          >
            Find Your Cabin
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="divide-y divide-linen-200 overflow-hidden rounded-[2rem] bg-white shadow-lift ring-1 ring-forest-900/5">
            {byRating.map((c) => (
              <li key={c.slug}>
                <Link href={`${c.href}#reviews`} className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-linen-100/60 sm:px-8">
                  <span className="min-w-0">
                    <span className="block font-serif text-xl text-forest-900 group-hover:text-ember-600">{c.name}</span>
                    <span className="block text-sm text-ink-600">{c.tagline}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-sm">
                    <Star className="size-4 fill-ember-500 text-ember-500" aria-hidden />
                    <span className="font-semibold text-forest-900">{c.details.rating.toFixed(2)}</span>
                    <span className="text-ink-600">({c.details.reviewCount})</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
