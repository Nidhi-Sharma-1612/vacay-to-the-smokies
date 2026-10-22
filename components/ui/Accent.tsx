import { Fragment } from "react";

/** Renders heading text, turning `*marked*` words into the site's italic ember accent. */
export function Accent({ text, className = "text-ember-600" }: { text: string; className?: string }) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 ? (
      <em key={i} className={className}>
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
