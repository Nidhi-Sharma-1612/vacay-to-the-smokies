import Image from "next/image";
import { headingId, type BlogBlock, type BlogText } from "@/lib/blog";

function Text({ parts }: { parts: BlogText[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.bold ? (
          <strong key={i} className="font-semibold text-forest-900">
            {p.text}
          </strong>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/** Renders imported blog content with the site's typography. */
export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="text-[1.075rem] leading-[1.8] text-ink-600">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <h2
                key={i}
                id={headingId(b.text)}
                className="mt-12 mb-4 scroll-mt-28 font-serif text-2xl leading-snug font-medium text-forest-900 first:mt-0 sm:text-[1.75rem]"
              >
                {b.text}
              </h2>
            );
          case "paragraph":
            return (
              <p key={i} className="mb-5 first:text-xl first:leading-relaxed first:text-forest-800">
                <Text parts={b.parts} />
              </p>
            );
          case "list": {
            const ListTag = b.ordered ? "ol" : "ul";
            return (
              <ListTag key={i} className="my-7 space-y-4">
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-4">
                    <span
                      className={`mt-1 grid shrink-0 place-items-center rounded-full text-sm font-bold ${
                        b.ordered ? "size-7 bg-forest-900 text-cream-50" : "size-2 translate-y-2.5 bg-ember-500"
                      }`}
                      aria-hidden
                    >
                      {b.ordered ? j + 1 : null}
                    </span>
                    <span>
                      <Text parts={item} />
                    </span>
                  </li>
                ))}
              </ListTag>
            );
          }
          case "image":
            return (
              <figure key={i} className="my-10 overflow-hidden rounded-3xl">
                <Image src={b.src} alt={b.alt} width={1536} height={1024} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full" />
              </figure>
            );
        }
      })}
    </div>
  );
}
