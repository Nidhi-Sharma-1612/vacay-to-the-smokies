import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Users } from "lucide-react";
import type { Cabin } from "@/data/cabins";

const badgeTones = {
  rose: "bg-rose-500 text-white",
  ember: "bg-ember-500 text-cream-50",
  cream: "bg-cream-50/95 text-forest-900",
};

export function CabinCard({ cabin }: { cabin: Cabin }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5 transition-shadow duration-500 hover:shadow-lift">
      <Link href={cabin.href} className="relative block aspect-[4/3] overflow-hidden" aria-label={`View ${cabin.name}`}>
        <Image
          src={cabin.image}
          alt={`${cabin.name}, ${cabin.tagline}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
        {cabin.badge && (
          <span
            className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold tracking-wide ${badgeTones[cabin.badge.tone]}`}
          >
            {cabin.badge.label}
          </span>
        )}
        <span className="absolute bottom-4 left-4 text-xs font-semibold tracking-[0.18em] text-cream-50 uppercase">
          {cabin.categoryLabel ?? (cabin.category === "forest" ? "Secluded forest" : "Walk to the Parkway")}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-ember-600">{cabin.tagline}</p>
        <h3 className="mt-1 font-serif text-2xl font-medium text-forest-900">
          <Link href={cabin.href} className="transition-colors hover:text-ember-600">
            {cabin.name}
          </Link>
        </h3>

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
            Sleeps {cabin.sleeps}
          </li>
        </ul>

        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-600">{cabin.description}</p>

        <ul className="mt-5 mb-6 flex flex-wrap gap-2">
          {cabin.highlights.map((h) => (
            <li key={h} className="rounded-full bg-linen-100 px-3 py-1 text-xs font-semibold text-forest-800">
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-linen-200 pt-5">
          <Link
            href={`${cabin.href}#book`}
            className="text-sm font-semibold text-forest-800 underline-offset-4 hover:text-ember-600 hover:underline"
          >
            Check dates
          </Link>
          <Link
            href={cabin.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-4 py-2 text-sm font-semibold text-cream-50 transition-colors hover:bg-ember-500"
          >
            View cabin
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
