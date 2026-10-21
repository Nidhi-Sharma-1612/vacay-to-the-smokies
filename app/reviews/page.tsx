import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { cabins, getCabin } from "@/data/cabins";
import { getReviews, reviewPropertyIds } from "@/lib/reviews";
import { getPageSections, str } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Guest Reviews | Vacay To The Smokies",
  description: "Real, verified reviews from guests who stayed in our Pigeon Forge and Gatlinburg cabins.",
};

export default async function ReviewsPage({ searchParams }: PageProps<"/reviews">) {
  const params = await searchParams;
  const cabinSlug = typeof params.cabin === "string" && params.cabin in reviewPropertyIds ? params.cabin : undefined;
  const page = Math.max(1, Number.parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);
  const [{ reviews, total, average, pages }, sections] = await Promise.all([
    getReviews({ cabinSlug, page }),
    getPageSections("reviews"),
  ]);
  const intro = sections.intro ?? {};
  const cabin = cabinSlug ? getCabin(cabinSlug) : undefined;
  const href = (p: { cabin?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (p.cabin) q.set("cabin", p.cabin);
    if (p.page && p.page > 1) q.set("page", String(p.page));
    const s = q.toString();
    return `/reviews${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="grain border-b border-linen-200 bg-linen-100">
          <div className="mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
            <p className="eyebrow text-ember-500">{str(intro, "eyebrow", "Guest reviews")}</p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-forest-900 sm:text-5xl">
              {cabin ? `${cabin.name} reviews` : str(intro, "heading", "What our guests say")}
            </h1>
            {average !== null && (
              <p className="mt-5 flex items-center gap-3 text-lg text-ink-600">
                <span className="flex text-ember-500" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-current" />
                  ))}
                </span>
                <span>
                  <strong className="font-serif text-2xl font-medium text-forest-900">{average.toFixed(2)}</strong> from {total} verified reviews
                </span>
              </p>
            )}
            <nav aria-label="Filter reviews by cabin" className="mt-8 flex flex-wrap gap-2">
              {[undefined, ...cabins.map((c) => c.slug)].map((slug) => {
                const active = slug === cabinSlug;
                return (
                  <Link
                    key={slug ?? "all"}
                    href={href({ cabin: slug })}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active ? "bg-forest-900 text-cream-50" : "bg-white text-forest-800 ring-1 ring-linen-200 hover:bg-cream-50"
                    }`}
                  >
                    {slug ? getCabin(slug)?.name : "All cabins"}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          {reviews.length > 0 ? (
            <ul className="columns-1 gap-6 md:columns-2 xl:columns-3">
              {reviews.map((r) => (
                <li key={r.id} className="mb-6 break-inside-avoid">
                  <ReviewCard review={r} showCabin={!cabinSlug} showResponse />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mx-auto max-w-md rounded-3xl border border-dashed border-linen-200 bg-white px-6 py-14 text-center text-ink-600">
              Reviews are temporarily unavailable. Please check back soon.
            </p>
          )}

          {pages > 1 && (
            <nav aria-label="Review pages" className="mt-10 flex items-center justify-center gap-3">
              {page > 1 && (
                <Link href={href({ cabin: cabinSlug, page: page - 1 })} className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-forest-900 ring-1 ring-linen-200 hover:bg-linen-100">
                  <ChevronLeft className="size-4" aria-hidden /> Newer
                </Link>
              )}
              <span className="text-sm text-ink-600">
                Page {page} of {pages}
              </span>
              {page < pages && (
                <Link href={href({ cabin: cabinSlug, page: page + 1 })} className="inline-flex items-center gap-1 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:bg-ember-500">
                  Older <ChevronRight className="size-4" aria-hidden />
                </Link>
              )}
            </nav>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
