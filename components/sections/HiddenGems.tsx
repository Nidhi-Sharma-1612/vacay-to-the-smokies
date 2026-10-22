import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hiddenGems } from "@/data/hidden-gems";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GemVisual } from "@/components/hidden-gems/GemVisual";
import { Accent } from "@/components/ui/Accent";
import { accentStr, getPageSections, img, objList, str } from "@/lib/cms";

const DEFAULT_CARDS = hiddenGems.map((g) => ({
  gem: g.gem,
  theme: g.theme,
  name: g.name,
  short: g.short,
  image: g.image ?? g.rendering ?? "",
}));

export async function HiddenGems() {
  const sections = await getPageSections("home");
  const h = sections.hiddenGems ?? {};
  const cards = objList(h, "items", ["gem", "theme", "name", "short", "image"] as const, DEFAULT_CARDS);
  const gems = hiddenGems.map((g, i) => {
    const card = cards[i] ?? DEFAULT_CARDS[i];
    const fallbackImage = g.image ?? g.rendering ?? "";
    return { ...g, gem: card.gem, theme: card.theme, name: card.name, short: card.short, imageOverride: img(card, "image", fallbackImage) };
  });

  return (
    <section id="hidden-gems" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={str(h, "eyebrow", "The Hidden Gem Cabin Series")}
            title={<Accent text={accentStr(h, "heading", "Four Gemstones. Four Cabins. *Each Created for Two.*")} />}
            description={str(
              h,
              "description",
              "Our Hidden Gem Cabin Series takes one intimate studio concept and gives each cabin a personality of its own.",
            )}
          />
          <Link
            href="/hidden-gems"
            className="group inline-flex shrink-0 items-center gap-2 font-semibold text-forest-800 transition-colors hover:text-ember-600"
          >
            {str(h, "linkLabel", "Explore the Hidden Gems")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gems.map((g, i) => (
            <li key={g.key}>
              <Reveal delay={i * 0.08} className="h-full">
                <Link href={g.href} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5 transition-shadow hover:shadow-lift">
                  <div className="aspect-[4/3] transition-transform duration-700 group-hover:scale-[1.02]">
                    <GemVisual gem={g} imageOverride={g.imageOverride} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold tracking-[0.2em] text-ember-600">
                      {g.gem} <span className="text-ink-600">— {g.theme}</span>
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-medium text-forest-900">{g.name}</h3>
                    <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-600">{g.short}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-900 group-hover:text-ember-600">
                      {g.status === "open" ? "View cabin" : "Coming soon"}
                      <ArrowRight className="size-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center font-serif text-xl text-forest-900">
          {str(h, "footnote", "Jade Forest & Diamond Forest — Coming Soon")}
        </p>
      </div>
    </section>
  );
}
