import Image from "next/image";
import { Heart } from "lucide-react";
import { site } from "@/data/site";
import { getRatingSummary } from "@/lib/reviews";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Accent } from "@/components/ui/Accent";
import { accentStr, getPageSections, img, str } from "@/lib/cms";

export async function Welcome() {
  // Live overall rating from OwnerRez, falling back to the saved figures.
  const [live, sections] = await Promise.all([getRatingSummary(), getPageSections("home")]);
  const w = sections.welcome ?? {};
  const stats = [
    { value: `${(live?.rating ?? site.rating).toFixed(2)}★`, label: str(w, "ratingLabel", "Average guest rating") },
    { value: `${live?.count ?? site.reviewCount}+`, label: str(w, "reviewsLabel", "Happy guest reviews") },
    { value: str(w, "thirdStatValue", "10 min"), label: str(w, "thirdStatLabel", "To Dollywood & the Parkway") },
  ];

  return (
    <section id="welcome" className="grain overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="relative mx-auto w-full max-w-xl pb-16 sm:pb-20 lg:max-w-none">
          <div className="relative aspect-[4/5] w-[82%] overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src={img(w, "image1", "/images/cabins/emerald-forest.jpg")}
              alt="Emerald Forest cabin surrounded by autumn trees"
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 aspect-square w-[52%] overflow-hidden rounded-[2rem] border-8 border-cream-50 shadow-lift">
            <Image
              src={img(w, "image2", "/images/cabins/emerald-forest-interior.webp")}
              alt="Emerald Forest interior with a freestanding double Jacuzzi beside the fireplace"
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute top-8 right-2 flex items-center gap-2 rounded-full bg-cream-50 px-4 py-2 text-sm font-semibold text-forest-900 shadow-soft sm:right-6">
            <Heart className="size-4 fill-rose-500 text-rose-500" aria-hidden />
            {str(w, "badge", "Made for couples")}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow text-ember-500">{str(w, "eyebrow", "Welcome to the Smokies")}</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.08] font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              <Accent text={accentStr(w, "heading", "Romance, *tucked* into the trees")} />
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              {str(
                w,
                "paragraph1",
                "No crowded resort. No shared hot tub. No rooms you don't need. Just your own cabin, your own deck and space to slow down.",
              )}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {str(
                w,
                "paragraph2",
                "Our couples cabins are made for honeymoons, anniversaries, birthdays, spontaneous weekends—or simply a few days away together.",
              )}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-linen-200 py-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-serif text-2xl font-medium text-forest-900 min-[380px]:text-3xl sm:text-4xl">{s.value}</dd>
                  <dd className="mt-1 text-xs leading-snug font-semibold text-ink-600 sm:text-sm">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#cabins" size="lg">
              {str(w, "primaryLabel", "Find Your Cabin")}
            </ButtonLink>
            <ButtonLink href={site.phoneHref} variant="outline-dark" size="lg">
              {str(w, "secondaryLabel", "Talk to your hosts")}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
