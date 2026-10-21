"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { CabinWithDetails } from "@/data/cabins";
import { SearchBar } from "@/components/booking/SearchBar";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  eyebrow = "Gatlinburg · Pigeon Forge · Smoky Mountains",
  heading = "Find your place in the Great Smoky Mountains",
  subheading = "Hidden in the woods or steps from the Parkway.",
  description = "Private hot tubs, romantic retreats and unforgettable Smoky Mountain stays.",
  image = "/images/hero-smokies.jpg",
  cabins,
}: {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  image?: string;
  cabins?: CabinWithDetails[];
}) {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col bg-forest-950">
      <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: "easeOut" }}
      >
        <Image
          src={image}
          alt="Sunset over the layered ridges of the Great Smoky Mountains"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
      </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/35 to-forest-950/90" />
      {/* Soft shade behind the centered headline keeps it legible over the bright sunset. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgb(22_33_28/0.45),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgb(200_105_63/0.25),transparent_60%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 lg:px-8 lg:pb-14">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="eyebrow text-ember-300"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
            className="mt-5 max-w-5xl font-serif text-[2.75rem] leading-[1.02] font-medium tracking-tight text-balance text-cream-50 sm:text-6xl lg:text-[5.25rem]"
          >
            {heading}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
            className="mt-6 max-w-2xl"
          >
            <p className="font-serif text-2xl text-cream-50 sm:text-3xl">{subheading}</p>
            <p className="mt-3 text-lg leading-relaxed text-cream-50/85">{description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
            className="mt-10 w-full text-left"
          >
            <SearchBar panelMode="modal" submitLabel="Find Your Cabin" cabins={cabins} />
          </motion.div>
        </div>

        <a
          href="#welcome"
          className="mx-auto mt-8 hidden flex-col items-center gap-2 text-xs font-semibold tracking-[0.2em] text-cream-50/60 uppercase transition-colors hover:text-cream-50 lg:flex"
        >
          Scroll
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown className="size-4" aria-hidden />
          </motion.span>
        </a>
      </div>
    </section>
  );
}
