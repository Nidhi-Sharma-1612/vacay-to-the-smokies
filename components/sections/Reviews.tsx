"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Link from "next/link";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

export function Reviews() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback((step: number) => {
    setState(([i]) => [(i + step + reviews.length) % reviews.length, step]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [paused, go]);

  const review = reviews[index];

  return (
    <section id="reviews" className="grain py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-8">
        <Reveal>
          <p className="eyebrow text-ember-500">Guest love</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.08] font-medium tracking-tight text-forest-900 sm:text-5xl">
            Stories from <em className="text-ember-600">the porch swing</em>
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
            Find your dates
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </Reveal>

        <Reveal delay={0.15}>
          <div
            className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-lift ring-1 ring-forest-900/5 sm:p-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Guest reviews"
          >
            <Quote className="size-12 text-ember-300/60" aria-hidden />
            <div className="relative mt-4 min-h-[15rem] sm:min-h-[12rem]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.figure
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  aria-live="polite"
                >
                  <blockquote className="font-serif text-2xl leading-snug text-forest-900 sm:text-[1.75rem]">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 text-sm">
                    <span className="font-bold text-forest-900">{review.author}</span>
                    <span className="text-ink-600">
                      {" "}
                      · stayed at {review.cabin} · {review.date}
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {reviews.map((r, i) => (
                  <button
                    key={r.quote}
                    onClick={() => setState([i, i > index ? 1 : -1])}
                    aria-label={`Show review ${i + 1}`}
                    aria-current={i === index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-ember-500" : "w-2 bg-linen-200 hover:bg-mist-400"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous review"
                  className="grid size-11 place-items-center rounded-full border border-linen-200 text-forest-900 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next review"
                  className="grid size-11 place-items-center rounded-full border border-linen-200 text-forest-900 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
