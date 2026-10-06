"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DescriptionBlock } from "@/lib/booking/types";

function render(blocks: DescriptionBlock[]) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "li") {
      const items: string[] = [];
      while (i < blocks.length && blocks[i].type === "li") items.push(blocks[i++].text);
      i--;
      out.push(
        <ul key={i} className="my-4 grid gap-2 sm:grid-cols-2">
          {items.map((t) => (
            <li key={t} className="rounded-xl bg-linen-100/70 px-4 py-2.5 text-[0.95rem] text-forest-800">
              {t}
            </li>
          ))}
        </ul>,
      );
    } else if (b.type === "h") {
      out.push(
        <h3 key={i} className="mt-8 mb-2 font-serif text-xl font-medium text-forest-900 first:mt-0">
          {b.text}
        </h3>,
      );
    } else {
      out.push(
        <p key={i} className="mb-4 leading-relaxed text-ink-600">
          {b.text}
        </p>,
      );
    }
  }
  return out;
}

export function Description({ blocks }: { blocks: DescriptionBlock[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div className={`relative overflow-hidden ${expanded ? "" : "max-h-[22rem]"}`}>
        {render(blocks)}
        {!expanded && <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream-50 to-transparent" />}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="mt-3 inline-flex items-center gap-1.5 font-semibold text-forest-900 underline underline-offset-4 hover:text-ember-600"
      >
        {expanded ? "Show less" : "Read the full description"}
        <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
      </button>
    </div>
  );
}
