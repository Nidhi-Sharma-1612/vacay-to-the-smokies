"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cabinFilters, type CabinCategory, type CabinWithDetails } from "@/data/cabins";
import { CabinCard } from "@/components/ui/CabinCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Filter = "all" | CabinCategory;

export function FeaturedCabins({
  cabins,
  eyebrow = "Our cabins",
  heading = "Find your hideaway",
  description = "A hand-picked collection of Smoky Mountain hideaways, each with its own private hot tub. Most are made just for two. Choose a secluded cabin beneath the trees or an in-town bungalow steps from the Pigeon Forge Parkway.",
}: {
  cabins: CabinWithDetails[];
  eyebrow?: string;
  heading?: string;
  description?: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = filter === "all" ? cabins : cabins.filter((c) => c.category === filter);

  return (
    <section id="cabins" className="bg-linen-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <SectionHeading eyebrow={eyebrow} title={heading} description={description} />
          <div role="tablist" aria-label="Filter cabins" className="flex flex-wrap gap-2">
            {cabinFilters.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  filter === f.id ? "text-cream-50" : "text-forest-800 hover:bg-linen-200/70"
                }`}
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="cabin-filter"
                    className="absolute inset-0 rounded-full bg-forest-900"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((cabin, i) => (
              <motion.li
                key={cabin.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <CabinCard cabin={cabin} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div className="mt-14 text-center">
          <Link
            href="/cabins"
            className="group inline-flex items-center gap-2 font-semibold text-forest-800 transition-colors hover:text-ember-600"
          >
            Search availability
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
