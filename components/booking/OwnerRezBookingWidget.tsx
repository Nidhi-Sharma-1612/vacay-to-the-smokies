"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { site } from "@/data/site";
import { useIsClient } from "@/lib/hooks";
import type { Guests } from "@/lib/booking/types";

const ORIGIN = "https://app.ownerrez.com";

type Props = {
  /** The cabin's OwnerRez property key. */
  propertyKey: string;
  checkin?: string;
  checkout?: string;
  guests: Guests;
};

/**
 * OwnerRez "Booking/Inquiry" widget, embedded the same way OwnerRez's widget.js does it,
 * but rendered by React so it can be prefilled with the guest's chosen dates and party size.
 * Book Now inside the widget sends the guest to OwnerRez's secure checkout to pay.
 * OwnerRez refuses to serve widgets to localhost, so it only renders on a real domain.
 */
export function OwnerRezBookingWidget({ propertyKey, checkin, checkout, guests }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const isClient = useIsClient();
  // OwnerRez echoes `seq` back in its messages; keep it alphanumeric.
  const seq = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [height, setHeight] = useState<number | null>(null);
  const widgetId = site.ownerRez.bookingWidgetId;

  const src = useMemo(() => {
    if (!isClient) return null;
    const q = new URLSearchParams({ seq, propertyKey });
    // OwnerRez prefills its form from these `or_` parameters.
    if (checkin) q.set("or_arrival", checkin);
    if (checkout) q.set("or_departure", checkout);
    q.set("or_adults", String(guests.adults));
    q.set("or_children", String(guests.children));
    q.set("or_pets", String(guests.pets));
    q.set("referrer", window.location.href);
    return `${ORIGIN}/widgets/${widgetId}?${q.toString()}#${encodeURIComponent(window.location.href)}`;
  }, [isClient, seq, propertyKey, checkin, checkout, guests.adults, guests.children, guests.pets, widgetId]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== ORIGIN || e.source !== frameRef.current?.contentWindow) return;
      let data: { id?: string; seq?: string; height?: number; url?: string; action?: string };
      try {
        data = typeof e.data === "object" ? e.data : JSON.parse(e.data);
      } catch {
        return;
      }
      if (!data?.id || data.id.replace(/-/g, "") !== widgetId.replace(/-/g, "")) return;
      if (typeof data.height === "number" && !Number.isNaN(data.height)) {
        setHeight(data.height);
        if (data.action === "scrollTop") frameRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      } else if (data.url) {
        // Book Now: continue to OwnerRez's secure checkout.
        window.location.assign(data.url);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [widgetId]);

  const isLocal = isClient && ["localhost", "127.0.0.1"].includes(window.location.hostname);

  return (
    <div className="relative">
      {!height && (
        <div className="flex items-center gap-2 py-10 text-sm text-ink-600" aria-live="polite">
          <Loader2 className="size-4 animate-spin text-ember-500" aria-hidden /> Loading secure booking…
        </div>
      )}
      {src && (
        <iframe
          ref={frameRef}
          src={src}
          title="Book this cabin"
          className="block w-full border-0"
          style={{ height: height ?? 0 }}
          scrolling="no"
        />
      )}
      {isLocal && (
        <p className="mt-4 rounded-xl bg-linen-100 px-4 py-3 text-xs leading-relaxed text-ink-600">
          OwnerRez only shows its booking widget on a real domain, so it won&apos;t load on localhost. It works once the site is deployed.
        </p>
      )}
    </div>
  );
}
