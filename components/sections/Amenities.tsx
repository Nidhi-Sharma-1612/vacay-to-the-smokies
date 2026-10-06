import { Bath, BedDouble, Beef, ChefHat, Flame, PawPrint, Waves, Wifi } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MountainDivider } from "@/components/ui/MountainDivider";

const amenities = [
  { icon: Bath, title: "Private hot tub", text: "On your own deck, under the trees and the stars." },
  { icon: Waves, title: "Double jacuzzi", text: "Indoor soaking tubs, many set right beside the fire." },
  { icon: Flame, title: "Fireplaces", text: "Wood-burning or electric, for cozy nights in." },
  { icon: BedDouble, title: "King beds", text: "Plush linens, including a Stearns & Foster floating bed." },
  { icon: ChefHat, title: "Full kitchens", text: "Everything you need to cook a gourmet dinner for two." },
  { icon: Beef, title: "Firepit & BBQ", text: "String lights, grills and lounge chairs outdoors." },
  { icon: PawPrint, title: "Pet-friendly", text: "Bring the pup with prior approval and a pet fee." },
  { icon: Wifi, title: "Fast WiFi", text: "Free 100+ Mbps internet, so you can stream or work." },
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
              eyebrow="Every stay includes"
              title={
                <>
                  Comforts that make it <em className="text-ember-300">feel like</em> a getaway
                </>
              }
              description="Each cabin is stocked and styled so all you have to bring is each other (and maybe the dog)."
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
