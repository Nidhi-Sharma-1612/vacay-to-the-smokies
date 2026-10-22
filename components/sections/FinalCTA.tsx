import Image from "next/image";
import { Phone } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Accent } from "@/components/ui/Accent";
import { accentStr, getPageSections, getSiteSettings, img, str } from "@/lib/cms";

export async function FinalCTA() {
  const [sections, settings] = await Promise.all([getPageSections("home"), getSiteSettings()]);
  const c = sections.finalCta ?? {};
  const phone = settings?.phone || site.phone;
  const phoneHref = phone === site.phone ? site.phoneHref : `tel:${phone.replace(/[^\d+]/g, "")}`;
  return (
    <section className="px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-forest-950">
        <Image
          src={img(c, "image", "/images/cabins/stylish-bungalow.jpg")}
          alt="String lights and a glowing firepit outside a cabin at twilight"
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/70 to-forest-950/20" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-ember-500/30 blur-3xl" aria-hidden />

        <Reveal className="relative max-w-2xl px-8 py-20 sm:px-14 sm:py-28">
          <p className="eyebrow text-ember-300">{str(c, "eyebrow", "Family-run in East Tennessee")}</p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.02] font-medium tracking-tight text-balance text-cream-50 sm:text-6xl">
            <Accent text={accentStr(c, "heading", "Small Cabins. *Big Memories.*")} className="text-ember-300" />
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream-50/80">
            {str(
              c,
              "description",
              "Vacay To The Smokies is a family-run East Tennessee cabin company built around a simple idea: A memorable mountain getaway doesn't have to be the biggest cabin on the mountain. It needs the right setting, thoughtful details and space to enjoy the people you came with.",
            )}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/cabins" size="lg">
              {str(c, "primaryLabel", "Find Your Cabin")}
            </ButtonLink>
            <ButtonLink href={phoneHref} variant="outline-light" size="lg">
              <Phone className="size-4" aria-hidden />
              {phone}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
