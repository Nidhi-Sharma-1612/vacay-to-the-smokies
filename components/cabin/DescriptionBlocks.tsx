import type { DescriptionBlock } from "@/lib/booking/types";

/** A cabin's OwnerRez description, in the site's typography: headings, paragraphs and grouped bullet lists. */
export function DescriptionBlocks({ blocks }: { blocks: DescriptionBlock[] }) {
  // Group consecutive bullets into one list.
  const groups: (DescriptionBlock | string[])[] = [];
  for (const b of blocks) {
    const last = groups.at(-1);
    if (b.type !== "li") groups.push(b);
    else if (Array.isArray(last)) last.push(b.text);
    else groups.push([b.text]);
  }
  const firstParagraph = blocks.findIndex((b) => b.type === "p");

  return (
    <div className="mt-8 space-y-4 text-[1.05rem] leading-relaxed text-ink-600">
      {groups.map((g, i) =>
        Array.isArray(g) ? (
          <ul key={i} className="space-y-2">
            {g.map((item) => (
              <li key={item} className="flex gap-3">
                {/* Emoji-led items ("🔥 Gas fireplace…") already carry their own marker. */}
                {!/^\p{Extended_Pictographic}/u.test(item) && (
                  <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-ember-500" aria-hidden />
                )}
                {item}
              </li>
            ))}
          </ul>
        ) : g.type === "h" ? (
          <h3 key={i} className="pt-4 font-serif text-xl font-medium text-forest-900">
            {g.text}
          </h3>
        ) : (
          <p key={i} className={blocks[firstParagraph] === g ? "text-lg text-forest-800" : undefined}>
            {g.text}
          </p>
        ),
      )}
    </div>
  );
}
