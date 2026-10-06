import Image from "next/image";
import { Phone } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-forest-950">
        <Image
          src="/images/cabins/stylish-bungalow.jpg"
          alt="String lights and a glowing firepit outside a cabin at twilight"
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/70 to-forest-950/20" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-ember-500/30 blur-3xl" aria-hidden />

        <Reveal className="relative max-w-2xl px-8 py-20 sm:px-14 sm:py-28">
          <p className="eyebrow text-ember-300">Book direct with your hosts</p>
          <h2 className="mt-4 font-serif text-5xl leading-[1.02] font-medium tracking-tight text-balance text-cream-50 sm:text-6xl">
            Your hideaway is <em className="text-ember-300">waiting</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream-50/80">
            Fall color, winter fires, spring wildflowers: the Smokies are magic in every season. Pick your dates and
            we&apos;ll have the hot tub ready.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/cabins" size="lg">
              Check availability
            </ButtonLink>
            <ButtonLink href={site.phoneHref} variant="outline-light" size="lg">
              <Phone className="size-4" aria-hidden />
              {site.phone}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
