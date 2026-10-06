"use client";

import { useEffect, useState } from "react";
import { Check, Heart, Share2 } from "lucide-react";

const STORAGE_KEY = "vts:saved-cabins";

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Share (native share sheet, or copy link) and Save (remembered in this browser only). */
export function CabinActions({ slug, name, save = true }: { slug: string; name: string; save?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!save) return;
    // Read after mount so server and client render the same markup.
    const id = window.setTimeout(() => setSaved(readSaved().includes(slug)), 0);
    return () => window.clearTimeout(id);
  }, [slug, save]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${name} · Vacay To The Smokies`, url }).catch(() => {});
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function toggleSave() {
    const list = readSaved();
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode); the toggle still works for this visit.
    }
    setSaved(next.includes(slug));
  }

  const btn =
    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-forest-900 transition-colors hover:bg-linen-100";
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={share} className={btn}>
        {copied ? <Check className="size-4 text-pine-600" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
        {copied ? "Link copied" : "Share"}
      </button>
      {save && (
        <button type="button" onClick={toggleSave} aria-pressed={saved} className={btn}>
          <Heart className={`size-4 transition-colors ${saved ? "fill-rose-500 text-rose-500" : ""}`} aria-hidden />
          {saved ? "Saved" : "Save"}
        </button>
      )}
    </div>
  );
}
