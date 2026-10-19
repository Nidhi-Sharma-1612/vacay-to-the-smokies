import { Bath, Footprints, Heart, MapPin, Users } from "lucide-react";

const items = [
  { icon: Bath, label: "Private Hot Tubs" },
  { icon: Heart, label: "Secluded Romantic Stays for Two" },
  { icon: Users, label: "Family Stays" },
  { icon: Footprints, label: "Walk to the Parkway" },
  { icon: MapPin, label: "Minutes to Gatlinburg & Pigeon Forge" },
];

export function TrustStrip() {
  return (
    <section aria-label="Highlights" className="border-b border-linen-200 bg-linen-100">
      <ul className="mx-auto grid max-w-7xl gap-x-6 gap-y-4 px-4 py-7 sm:grid-cols-2 sm:px-6 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-10 lg:px-8 xl:justify-between xl:gap-x-6">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm font-semibold text-forest-800">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream-50 text-ember-500 ring-1 ring-linen-200">
              <Icon className="size-5" aria-hidden />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
