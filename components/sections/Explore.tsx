import Image from "next/image";
import { MapPin } from "lucide-react";
import { attractions as defaultAttractions } from "@/data/attractions";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accent } from "@/components/ui/Accent";
import { accentStr, getPageSections, objList, str } from "@/lib/cms";

const looksLikeUrl = (v: string) => v.startsWith("/") || /^https?:\/\//.test(v);

const ATTRACTION_FALLBACK = defaultAttractions.map((a) => ({
  name: a.name,
  distance: a.distance,
  description: a.description,
  image: a.image,
  focus: a.focus ?? "center",
}));

export async function Explore() {
  const sections = await getPageSections("home");
  const e = sections.explore ?? {};
  const items = objList(e, "items", ["name", "distance", "description", "image", "focus"] as const, ATTRACTION_FALLBACK);
  const attractions =
    items.length === ATTRACTION_FALLBACK.length && items.every((i) => looksLikeUrl(i.image)) ? items : ATTRACTION_FALLBACK;

  return (
    <section id="explore" className="bg-linen-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={str(e, "eyebrow", "Explore the Smokies")}
          title={<Accent text={accentStr(e, "heading", "Adventure by day, *hot tub* by night")} />}
          description={str(
            e,
            "description",
            "Our cabins sit right between the National Park and the heart of Pigeon Forge and Gatlinburg, so the best of the Smokies is a short drive (or stroll) away.",
          )}
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {attractions.map((place, i) => (
            <li key={place.name}>
              <Reveal delay={i * 0.08} className="group h-full">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-soft">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ objectPosition: place.focus }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-cream-50/95 px-3 py-1 text-xs font-bold text-forest-900">
                    <MapPin className="size-3.5 text-ember-500" aria-hidden />
                    {place.distance}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-cream-50">
                    <h3 className="font-serif text-2xl leading-tight font-medium">{place.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream-50/80">{place.description}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
