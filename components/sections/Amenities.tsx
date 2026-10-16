import { Bath, BedDouble, ChefHat, Flame, Trees, Waves } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MountainDivider } from "@/components/ui/MountainDivider";

const amenities = [
  { icon: Bath, title: "Private Hot Tubs", text: "Your own hot tub on your own deck or patio, never shared." },
  { icon: Waves, title: "Fireside Double Jacuzzis", text: "Indoor double Jacuzzis, many set right beside the fire." },
  { icon: BedDouble, title: "King Beds", text: "Including premium Stearns & Foster mattresses in our Hidden Gems." },
  { icon: Flame, title: "Fireplaces", text: "Wood-burning, gas or electric, depending on the cabin." },
  { icon: ChefHat, title: "Kitchens", text: "Equipped for breakfast in pajamas or dinner for two." },
  { icon: Trees, title: "Forest Decks & Porches", text: "Wrap-around decks, porches and porch swings among the trees." },
];

export function Amenities() {
  return (
    <section id="amenities" className="grain relative bg-forest-900 text-cream-50">
      <MountainDivider className="-mt-px rotate-180 text-linen-100" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.6fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              tone="dark"
              eyebrow="Cabin comforts"
              title={
                <>
                  The Comforts <em className="text-ember-300">Our Guests Love</em>
                </>
              }
              description="Amenities vary by property. Explore each cabin to find the retreat that fits your trip."
            />
          </div>

          <ul className="grid gap-px overflow-hidden rounded-3xl bg-cream-50/10 sm:grid-cols-2">
            {amenities.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="bg-forest-900">
                <Reveal delay={(i % 2) * 0.08} className="group flex h-full gap-5 p-7 transition-colors hover:bg-forest-800">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-ember-300/30 bg-ember-500/10 text-ember-300 transition-colors group-hover:bg-ember-500 group-hover:text-cream-50">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-medium">{title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-mist-200/75">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <MountainDivider className="-mb-px text-cream-50" />
    </section>
  );
}
