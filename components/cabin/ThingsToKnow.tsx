"use client";

import { useState } from "react";
import { CalendarX2, ChevronRight, Clock, KeyRound, ScrollText, ShieldAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

type Props = {
  checkIn: string | null;
  checkOut: string | null;
  checkInMethod: string | null;
  houseRules: string[];
  property: string[];
  notes: string[];
  cancellationPolicy: string | null;
};

type Panel = "rules" | "property" | "cancellation" | null;

function Card({
  icon: Icon,
  title,
  children,
  onMore,
}: {
  icon: typeof Clock;
  title: string;
  children: React.ReactNode;
  onMore?: () => void;
}) {
  return (
    <div className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-forest-900/5">
      <span className="grid size-10 place-items-center rounded-xl bg-linen-100 text-ember-600">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="mt-4 font-semibold text-forest-900">{title}</h3>
      <div className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-600">{children}</div>
      {onMore && (
        <button
          type="button"
          onClick={onMore}
          className="mt-5 inline-flex items-center gap-1 self-start font-semibold text-forest-900 underline underline-offset-4 hover:text-ember-600"
        >
          Show more <ChevronRight className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

const clean = (s: string) => s.replace(/\s*\((.*)\)$/, " · $1");

export function ThingsToKnow({ checkIn, checkOut, checkInMethod, houseRules, property, notes, cancellationPolicy }: Props) {
  const [panel, setPanel] = useState<Panel>(null);
  const close = () => setPanel(null);
  const propertyAll = [...property.map(clean), ...notes];

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <Card icon={ScrollText} title="House rules" onMore={() => setPanel("rules")}>
          <ul className="space-y-2">
            {checkIn && <li>Check-in after {checkIn}</li>}
            {checkOut && <li>Checkout by {checkOut}</li>}
            {houseRules.slice(0, 2).map((r) => (
              <li key={r}>{clean(r)}</li>
            ))}
          </ul>
        </Card>
        <Card icon={ShieldAlert} title="Safety & property" onMore={propertyAll.length > 3 ? () => setPanel("property") : undefined}>
          <ul className="space-y-2">
            {propertyAll.slice(0, 3).map((r) => (
              <li key={r} className="line-clamp-2">
                {r}
              </li>
            ))}
          </ul>
        </Card>
        <Card icon={CalendarX2} title="Cancellation policy" onMore={cancellationPolicy ? () => setPanel("cancellation") : undefined}>
          <p className="line-clamp-4">{cancellationPolicy ?? "Contact us for cancellation terms."}</p>
        </Card>
      </div>

      <Modal open={panel === "rules"} onClose={close} title="House rules">
        <div className="grid gap-4 sm:grid-cols-2">
          {checkIn && (
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest-900/5">
              <Clock className="size-5 text-ember-500" aria-hidden />
              <div>
                <p className="text-sm text-ink-600">Check-in</p>
                <p className="font-semibold text-forest-900">After {checkIn}</p>
              </div>
            </div>
          )}
          {checkOut && (
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest-900/5">
              <Clock className="size-5 text-ember-500" aria-hidden />
              <div>
                <p className="text-sm text-ink-600">Checkout</p>
                <p className="font-semibold text-forest-900">By {checkOut}</p>
              </div>
            </div>
          )}
          {checkInMethod && (
            <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest-900/5 sm:col-span-2">
              <KeyRound className="size-5 text-ember-500" aria-hidden />
              <div>
                <p className="text-sm text-ink-600">Self check-in</p>
                <p className="font-semibold text-forest-900">{checkInMethod}</p>
              </div>
            </div>
          )}
        </div>
        <ul className="mt-6 divide-y divide-linen-200">
          {houseRules.map((r) => (
            <li key={r} className="py-3.5 text-forest-800">
              {clean(r)}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={panel === "property"} onClose={close} title="Safety & property">
        <ul className="divide-y divide-linen-200">
          {propertyAll.map((r) => (
            <li key={r} className="py-3.5 leading-relaxed text-forest-800">
              {r}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal open={panel === "cancellation"} onClose={close} title="Cancellation policy">
        <p className="leading-relaxed text-forest-800">{cancellationPolicy}</p>
      </Modal>
    </>
  );
}
