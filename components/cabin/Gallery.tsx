"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid3x3, X } from "lucide-react";

type Props = { photos: string[]; name: string };

const pad = (n: number) => String(n).padStart(2, "0");

export function Gallery({ photos, name }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const step = useCallback((d: number) => setOpen((i) => (i == null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  return (
    <>
      {/* Desktop: one large photo and four tiles */}
      <div className="relative hidden h-[30rem] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[2rem] md:grid lg:h-[34rem]">
        {photos.slice(0, 5).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden bg-linen-100 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            <Image
              src={src}
              alt={`${name} photo ${i + 1}`}
              fill
              priority={i === 0}
              sizes={i === 0 ? "50vw" : "25vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-forest-950/0 transition-colors group-hover:bg-forest-950/10" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="absolute right-5 bottom-5 inline-flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2.5 text-sm font-semibold text-forest-900 shadow-soft hover:bg-white"
        >
          <Grid3x3 className="size-4" aria-hidden />
          Show all {photos.length} photos
        </button>
      </div>

      {/* Mobile: swipeable strip */}
      <div className="relative -mx-4 md:hidden">
        <div
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
          onScroll={(e) => setMobileIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        >
          {photos.map((src, i) => (
            <button key={src} type="button" onClick={() => setOpen(i)} className="relative aspect-[4/3] w-full shrink-0 snap-center">
              <Image src={src} alt={`${name} photo ${i + 1}`} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>
        <span className="absolute right-4 bottom-4 rounded-full bg-forest-950/70 px-3 py-1 text-xs font-semibold text-cream-50">
          {mobileIndex + 1} / {photos.length}
        </span>
      </div>

      <AnimatePresence>
        {open != null && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-forest-950/97"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} photos`}
          >
            <div className="flex items-center justify-between px-4 py-4 text-cream-50 sm:px-8">
              <p className="font-serif text-lg tabular-nums">
                {pad(open + 1)} <span className="text-mist-400">/ {pad(photos.length)}</span>
              </p>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close gallery" className="rounded-full p-2 hover:bg-cream-50/10">
                <X className="size-6" />
              </button>
            </div>
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={open}
                  className="absolute inset-4 sm:inset-x-20"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Image src={photos[open]} alt={`${name} photo ${open + 1}`} fill sizes="100vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute top-1/2 left-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute top-1/2 right-3 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-cream-50/10 text-cream-50 hover:bg-cream-50/20"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-8">
              {photos.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity ${i === open ? "ring-2 ring-ember-300" : "opacity-50 hover:opacity-90"}`}
                >
                  <Image src={src.replace(/-(Large|Medium)$/, "-Thumb")} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
