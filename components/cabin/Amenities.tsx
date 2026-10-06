"use client";

import { createElement, useState } from "react";
import { amenityIcon } from "@/lib/amenity-icons";
import { Modal } from "@/components/ui/Modal";

type Group = { name: string; items: string[] };

// Show the amenities guests care about most first.
const FEATURED = ["Hot Tub", "Jacuzzi", "Fireplace", "Internet / Wifi", "Air Conditioning", "Kitchen", "Outdoor Grill", "Fire Pit", "Smart TV", "Free Parking", "Coffee Maker", "Washer"];

/** "Internet / Wifi (Free)" -> { name: "Internet / Wifi", note: "Free" } */
function split(label: string) {
  const m = label.match(/^(.*?)\s*\((.*)\)$/);
  return m ? { name: m[1], note: m[2] } : { name: label, note: null };
}

function AmenityRow({ label }: { label: string }) {
  const { name, note } = split(label);
  return (
    <li className="flex items-start gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linen-100 text-ember-600">
        {createElement(amenityIcon(label), { className: "size-5", "aria-hidden": true })}
      </span>
      <span className="pt-2 leading-snug">
        <span className="font-medium text-forest-900">{name}</span>
        {note && <span className="block text-sm text-ink-600">{note}</span>}
      </span>
    </li>
  );
}

export function Amenities({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState(false);
  const all = groups.flatMap((g) => g.items);
  const featured = [...FEATURED.flatMap((f) => all.filter((a) => a.toLowerCase().startsWith(f.toLowerCase()))), ...all]
    .filter((a, i, arr) => arr.indexOf(a) === i)
    .slice(0, 10);

  return (
    <>
      <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {featured.map((a) => (
          <AmenityRow key={a} label={a} />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 rounded-full border border-forest-800/25 px-5 py-3 text-sm font-semibold text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream-50"
      >
        Show all {all.length} amenities
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="What this cabin offers">
        <div className="space-y-9">
          {groups.map((g) => (
            <section key={g.name}>
              <h3 className="eyebrow text-ember-500">{g.name}</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {g.items.map((item) => (
                  <AmenityRow key={item} label={item} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Modal>
    </>
  );
}
