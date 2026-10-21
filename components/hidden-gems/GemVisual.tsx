import Image from "next/image";
import { Gem } from "lucide-react";
import { RENDERING_LABEL, type HiddenGem } from "@/data/hidden-gems";

/**
 * Photo for open cabins; for coming-soon cabins, the architectural rendering (always labelled)
 * or, until one is supplied, a styled placeholder in the gem's colors.
 *
 * `imageOverride` (admin-edited) takes priority over the cabin's built-in photo/rendering, but
 * never changes the "coming soon"/rendering label logic below — that's tied to the cabin's
 * real status, not to which image happens to be showing.
 */
export function GemVisual({
  gem,
  sizes,
  priority = false,
  imageOverride,
}: {
  gem: HiddenGem;
  sizes: string;
  priority?: boolean;
  imageOverride?: string;
}) {
  const image = imageOverride ?? gem.image;
  const src = image ?? gem.rendering;
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: `linear-gradient(140deg, ${gem.swatch[0]}, ${gem.swatch[1]})` }}>
      {src ? (
        <Image src={src} alt={`${gem.name}${gem.rendering && !image ? " architectural rendering" : ""}`} fill sizes={sizes} priority={priority} className={`object-cover ${image ? "" : "object-left-bottom"}`} />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-cream-50/90" aria-hidden>
          <svg viewBox="0 0 200 80" className="absolute bottom-0 w-full text-cream-50/15" preserveAspectRatio="none">
            <path fill="currentColor" d="M0 80 L0 55 L30 38 L52 50 L80 22 L108 46 L132 30 L160 48 L182 36 L200 44 L200 80 Z" />
          </svg>
          <span className="flex flex-col items-center gap-2">
            <Gem className="size-9" />
            <span className="text-xs font-bold tracking-[0.25em]">{gem.gem}</span>
          </span>
        </div>
      )}
      {gem.status === "coming-soon" && (
        <span className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)] rounded-lg bg-cream-50/95 px-2.5 py-1 text-[0.65rem] leading-tight font-bold text-forest-900">
          {gem.rendering ? RENDERING_LABEL : "COMING SOON"}
        </span>
      )}
    </div>
  );
}
