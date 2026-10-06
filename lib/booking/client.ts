"use client";

import { useEffect, useState } from "react";
import type { AvailabilityCalendar, Quote, Stay } from "./types";

type Loaded<T> = { key: string; data?: T; error?: string };

export type AvailabilityScope = { slug?: string; type?: string };

/** Loads availability for one cabin (`slug`), a cabin style (`type`), or all cabins (neither). */
export function useAvailability(scope: AvailabilityScope) {
  const query = scope.slug ? `slug=${encodeURIComponent(scope.slug)}` : scope.type ? `type=${encodeURIComponent(scope.type)}` : "";
  const [state, setState] = useState<Loaded<AvailabilityCalendar>>({ key: "\u0000" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/availability?${query}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        setState(res.ok ? { key: query, data: body } : { key: query, error: body.error ?? "Availability is unavailable right now." });
      })
      .catch((e) => e?.name !== "AbortError" && setState({ key: query, error: "Availability is unavailable right now." }));
    return () => controller.abort();
  }, [query]);

  const current = state.key === query;
  return { calendar: current ? state.data ?? null : null, error: current ? state.error : undefined, loading: !current };
}

export const stayKey = (s: Stay | null) => (s ? `${s.slug}|${s.checkin}|${s.checkout}|${s.adults}|${s.children}|${s.pets}` : "");

/** Prices a stay on the server whenever it changes (debounced). Pass null when the stay is incomplete. */
export function useQuote(stay: Stay | null) {
  const key = stayKey(stay);
  const [state, setState] = useState<Loaded<Quote>>({ key: "" });

  useEffect(() => {
    if (!stay) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stay),
        signal: controller.signal,
      })
        .then(async (res) => {
          const body = await res.json();
          setState(res.ok ? { key, data: body.quote } : { key, error: body.error ?? "We couldn't price those dates." });
        })
        .catch((e) => e?.name !== "AbortError" && setState({ key, error: "Couldn't reach the booking service." }));
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
    // `key` captures every field of `stay`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!stay) return { status: "idle" as const };
  if (state.key !== key) return { status: "loading" as const };
  return state.error ? { status: "error" as const, error: state.error } : { status: "ready" as const, quote: state.data! };
}
