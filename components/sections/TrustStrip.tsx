import { Award, Bath, MapPin, PawPrint } from "lucide-react";

const items = [
  { icon: Bath, label: "Private hot tub at every cabin" },
  { icon: Award, label: "Airbnb Guest Favorite · Top 10%" },
  { icon: PawPrint, label: "Pet-friendly stays" },
  { icon: MapPin, label: "5 mi to Gatlinburg & Pigeon Forge" },
];

export function TrustStrip() {
  return (
    <section aria-label="Highlights" className="border-b border-linen-200 bg-linen-100">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-7 sm:px-6 lg:grid-cols-4 lg:px-8">
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
