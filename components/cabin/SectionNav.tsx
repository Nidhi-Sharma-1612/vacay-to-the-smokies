"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

/** Sticky in-page tabs that highlight the section currently in view. */
export function SectionNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    // A section becomes active once its top passes just under the sticky header and tabs.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-150px 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="Cabin sections"
      className="sticky top-20 z-30 -mx-4 mb-2 border-b border-linen-200 bg-cream-50/95 px-4 backdrop-blur-md sm:mx-0 sm:px-0"
    >
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={`relative block px-3 py-4 text-sm font-semibold transition-colors ${
                active === item.id ? "text-forest-900" : "text-ink-600 hover:text-forest-900"
              }`}
            >
              {item.label}
              <span
                className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-ember-500 transition-opacity ${active === item.id ? "opacity-100" : "opacity-0"}`}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
