import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GemVisual } from "@/components/hidden-gems/GemVisual";
import { ButtonLink } from "@/components/ui/Button";
import { hiddenGems } from "@/data/hidden-gems";

export const metadata: Metadata = {
  title: "Hidden Gem Cabin Series | Vacay To The Smokies",
  description:
    "Four gemstones, four cabins, each created for two: Emerald, Golden, Jade and Diamond Forest, between Gatlinburg and Pigeon Forge.",
};

const SIGNATURE = ["A king Stearns & Foster bed", "A fireside double Jacuzzi", "A private hot tub", "A full kitchen", "A wrap-around deck"];

export default function HiddenGemsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="grain border-b border-linen-200 bg-linen-100">
          <div className="mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
            <p className="eyebrow text-ember-500">Hidden Gem Cabin Series</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              Four Gemstones. Four Cabins. <em className="text-ember-600">Each Created for Two.</em>
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-ink-600">
              Tucked into the Smoky Mountain forest between Gatlinburg and Pigeon Forge, our Hidden Gem Cabin Series takes one intimate
              couples-focused concept and gives each cabin a personality of its own.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {SIGNATURE.map((f) => (
                <li key={f} className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-forest-800 ring-1 ring-linen-200">
                  <Check className="size-4 text-ember-500" aria-hidden /> {f}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-ink-600">And just enough space for two.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <ul className="space-y-8">
            {hiddenGems.map((g, i) => (
              <li key={g.key}>
                <article className="grid overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-forest-900/5 md:grid-cols-2">
                  <Link href={g.href} tabIndex={-1} aria-hidden className={`block aspect-[16/10] md:aspect-auto md:min-h-80 ${i % 2 ? "md:order-2" : ""}`}>
                    <GemVisual gem={g} sizes="(min-width: 768px) 50vw, 100vw" priority={i === 0} />
                  </Link>
                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <p className="text-xs font-bold tracking-[0.25em] text-ember-600">
                      {g.gem} <span className="text-ink-600">— {g.theme}</span>
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-medium text-forest-900 sm:text-4xl">
                      <Link href={g.href} className="hover:text-ember-600">
                        {g.name}
                      </Link>
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-ink-600">
                      {g.long}
                      {g.status === "coming-soon" && <span className="font-semibold text-forest-900"> Coming Soon.</span>}
                    </p>
                    <div className="mt-7">
                      {g.status === "open" ? (
                        <ButtonLink href={g.href}>
                          Check {g.name} Availability <ArrowRight className="size-4" aria-hidden />
                        </ButtonLink>
                      ) : (
                        <ButtonLink href={g.href} variant="outline-dark">
                          Learn more <ArrowRight className="size-4" aria-hidden />
                        </ButtonLink>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-16 max-w-3xl text-center font-serif text-2xl leading-snug text-balance text-forest-900">
            Our Hidden Gems give you the feeling of disappearing into the forest while keeping Gatlinburg, Pigeon Forge and Great Smoky
            Mountains National Park within easy reach.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
