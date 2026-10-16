import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ways = [
  {
    href: "/cabins?type=forest#results",
    image: "/images/cabins/just-opened.jpg",
    alt: "A glowing forest cabin at dusk surrounded by fall leaves",
    eyebrow: "For two",
    title: "Secluded in the forest",
    points: ["Hot tubs overlooking acres of trees", "A-frames & rustic studio cabins", "5 mi to Gatlinburg & Pigeon Forge"],
  },
  {
    href: "/cabins?type=parkway#results",
    image: "/images/cabins/steps-from-parkway.jpg",
    alt: "A bubbling hot tub beside a string-lit firepit patio at sunset",
    eyebrow: "For couples & small groups",
    title: "Steps from the Parkway",
    points: ["Walk to shows, dining & trolley stops", "Firepits, string lights & hot tubs", "Bungalows sleeping up to 6"],
  },
];

export function TwoWays() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Two ways to escape"
          title={
            <>
              Deep in the Woods. <em className="text-ember-600">Close to It All.</em>
            </>
          }
          description="Spend the morning hiking in Great Smoky Mountains National Park, the afternoon exploring Gatlinburg, or the evening enjoying Pigeon Forge. Then come home to your own hot tub beneath the trees. Prefer to be in the middle of everything? Our Firefly Bungalows put you steps from the Pigeon Forge Parkway."
        />

        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {ways.map((way, i) => (
            <Reveal key={way.title} delay={i * 0.12}>
              <Link
                href={way.href}
                className="group relative flex min-h-[30rem] flex-col justify-end overflow-hidden rounded-[2rem] p-8 shadow-lift sm:min-h-[36rem] sm:p-10"
              >
                <Image
                  src={way.image}
                  alt={way.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/40 to-transparent" />
                <div className="relative text-cream-50">
                  <p className="eyebrow text-ember-300">{way.eyebrow}</p>
                  <h3 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">{way.title}</h3>
                  <ul className="mt-6 space-y-2.5">
                    {way.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-cream-50/85">
                        <Check className="size-4 shrink-0 text-ember-300" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream-50 px-5 py-3 text-sm font-semibold text-forest-900 transition-colors group-hover:bg-ember-500 group-hover:text-cream-50">
                    See these cabins
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
