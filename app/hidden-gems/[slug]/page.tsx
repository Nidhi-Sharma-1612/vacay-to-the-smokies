import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Construction, Gem, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GemVisual } from "@/components/hidden-gems/GemVisual";
import { ButtonLink } from "@/components/ui/Button";
import { comingSoon, hiddenGems, RENDERING_DISCLAIMER, RENDERING_LABEL } from "@/data/hidden-gems";
import { site } from "@/data/site";

const PAGES = { "jade-forest": "jade", "diamond-forest": "diamond" } as const;
type PageSlug = keyof typeof PAGES;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}
export const dynamicParams = false;

function load(slug: string) {
  if (!(slug in PAGES)) return null;
  const key = PAGES[slug as PageSlug];
  return { gem: hiddenGems.find((g) => g.key === key)!, copy: comingSoon[key] };
}

export async function generateMetadata({ params }: PageProps<"/hidden-gems/[slug]">): Promise<Metadata> {
  const page = load((await params).slug);
  if (!page) return {};
  return { title: `${page.copy.title} | Vacay To The Smokies`, description: page.copy.paragraphs[0] };
}

export default async function ComingSoonPage({ params }: PageProps<"/hidden-gems/[slug]">) {
  const page = load((await params).slug);
  if (!page) notFound();
  const { gem, copy } = page;
  const others = hiddenGems.filter((g) => g.key !== gem.key);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-600">
            <Link href="/hidden-gems" className="hover:text-ember-600">
              Hidden Gems
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span className="text-forest-900">{gem.name}</span>
          </nav>
        </div>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <figure>
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
              <GemVisual gem={gem} sizes="(min-width: 1024px) 50vw, 100vw" priority />
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-ink-600">
              {gem.rendering ? (
                <>
                  <span className="font-bold tracking-wide text-forest-900">{RENDERING_LABEL}</span> · {RENDERING_DISCLAIMER}
                </>
              ) : (
                "Architectural rendering coming soon."
              )}
            </figcaption>
          </figure>

          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-ember-600">
              <Gem className="size-4" aria-hidden /> {gem.gem} — {gem.theme}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-forest-900 sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 font-serif text-2xl text-ember-600 italic">{copy.headline}</p>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-600">
              {copy.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-6 flex items-start gap-3 rounded-2xl bg-linen-100 px-5 py-4 font-semibold text-forest-900">
              <Construction className="mt-0.5 size-5 shrink-0 text-ember-500" aria-hidden />
              {copy.status}
            </p>
          </div>
        </section>

        <section className="border-y border-linen-200 bg-linen-100/60">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-medium text-forest-900 sm:text-3xl">{copy.featuresLabel}</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {copy.features.map((f) => (
                <li key={f} className="rounded-full bg-white px-4 py-2 font-semibold text-forest-800 ring-1 ring-linen-200">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-forest-900 p-8 text-cream-50 sm:p-10 md:flex-row md:items-center">
            <div>
              <p className="font-serif text-2xl">Can&apos;t wait for {gem.name}?</p>
              <p className="mt-2 text-mist-200/80">Emerald Forest and Golden Forest are open now, with the same signature Hidden Gem features.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/hidden-gems">See all Hidden Gems</ButtonLink>
              <ButtonLink href={site.phoneHref} variant="outline-light">
                <Phone className="size-4" aria-hidden /> {site.phone}
              </ButtonLink>
            </div>
          </div>

          <h2 className="mt-16 font-serif text-2xl font-medium text-forest-900">More Hidden Gems</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {others.map((g) => (
              <li key={g.key}>
                <Link href={g.href} className="group block overflow-hidden rounded-3xl bg-white ring-1 ring-forest-900/5 hover:shadow-soft">
                  <div className="aspect-[4/3]">
                    <GemVisual gem={g} sizes="(min-width: 640px) 33vw, 100vw" />
                  </div>
                  <p className="p-5 font-serif text-xl text-forest-900 group-hover:text-ember-600">{g.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
