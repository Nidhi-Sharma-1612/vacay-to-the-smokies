import { Bath, Footprints, Heart, MapPin, Users } from "lucide-react";
import { getPageSections, objList } from "@/lib/cms";

// Icons are fixed in code (the generic admin editor only has text fields);
// only the labels are editable, matched to an icon by position.
const ICONS = [Bath, Heart, Users, Footprints, MapPin];

const DEFAULT_ITEMS = [
  { label: "Private Hot Tubs" },
  { label: "Secluded Romantic Stays for Two" },
  { label: "Family Stays" },
  { label: "Walk to the Parkway" },
  { label: "Minutes to Gatlinburg & Pigeon Forge" },
];

export async function TrustStrip() {
  const sections = await getPageSections("home");
  const t = sections.trustStrip ?? {};
  const rawItems = objList(t, "items", ["label"] as const, DEFAULT_ITEMS);
  const items = rawItems.length === ICONS.length ? rawItems : DEFAULT_ITEMS;

  return (
    <section aria-label="Highlights" className="border-b border-linen-200 bg-linen-100">
      <ul className="mx-auto grid max-w-7xl gap-x-6 gap-y-4 px-4 py-7 sm:grid-cols-2 sm:px-6 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-10 lg:px-8 xl:justify-between xl:gap-x-6">
        {items.map(({ label }, i) => {
          const Icon = ICONS[i];
          return (
            <li key={label} className="flex items-center gap-3 text-sm font-semibold text-forest-800">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream-50 text-ember-500 ring-1 ring-linen-200">
                <Icon className="size-5" aria-hidden />
              </span>
              {label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
