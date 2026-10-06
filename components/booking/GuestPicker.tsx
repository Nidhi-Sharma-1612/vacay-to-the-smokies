"use client";

import { Minus, Plus } from "lucide-react";
import type { Guests } from "@/lib/booking/types";

type Props = {
  value: Guests;
  onChange: (guests: Guests) => void;
  maxGuests?: number;
  childrenAllowed?: boolean;
  petsAllowed?: boolean;
};

function Stepper({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid size-10 place-items-center rounded-full border border-linen-200 text-forest-900 transition-colors hover:border-forest-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-linen-200"
    >
      {children}
    </button>
  );
}

export function GuestPicker({ value, onChange, maxGuests = 6, childrenAllowed = true, petsAllowed = true }: Props) {
  const rows = [
    { key: "adults" as const, label: "Adults", hint: "Ages 13+", min: 1, max: maxGuests - value.children, show: true },
    { key: "children" as const, label: "Children", hint: "Ages 2–12", min: 0, max: maxGuests - value.adults, show: childrenAllowed },
    { key: "pets" as const, label: "Pets", hint: "With prior approval & pet fee", min: 0, max: 2, show: petsAllowed },
  ];
  return (
    <div className="divide-y divide-linen-200">
      {rows
        .filter((r) => r.show)
        .map((r) => (
          <div key={r.key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
            <div>
              <p className="font-semibold text-forest-900">{r.label}</p>
              <p className="text-sm text-ink-600">{r.hint}</p>
            </div>
            <div className="flex items-center gap-3">
              <Stepper
                label={`Fewer ${r.label.toLowerCase()}`}
                disabled={value[r.key] <= r.min}
                onClick={() => onChange({ ...value, [r.key]: value[r.key] - 1 })}
              >
                <Minus className="size-4" />
              </Stepper>
              <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">
                {value[r.key]}
              </span>
              <Stepper
                label={`More ${r.label.toLowerCase()}`}
                disabled={value[r.key] >= r.max}
                onClick={() => onChange({ ...value, [r.key]: value[r.key] + 1 })}
              >
                <Plus className="size-4" />
              </Stepper>
            </div>
          </div>
        ))}
      {!childrenAllowed && <p className="pt-4 text-sm text-ink-600">This cabin is designed for couples and isn&apos;t suitable for children.</p>}
    </div>
  );
}
