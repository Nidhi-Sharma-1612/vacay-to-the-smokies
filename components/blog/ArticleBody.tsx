import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { headingId } from "@/lib/blog";

function textOf(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

const components: Components = {
  h2: ({ children }) => {
    const text = textOf(children);
    return (
      <h2
        id={headingId(text)}
        className="mt-12 mb-4 scroll-mt-28 font-serif text-2xl leading-snug font-medium text-forest-900 first:mt-0 sm:text-[1.75rem]"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 font-serif text-xl leading-snug font-medium text-forest-900">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-5 first:text-xl first:leading-relaxed first:text-forest-800">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-forest-900">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} className="font-semibold text-forest-900 underline underline-offset-2 hover:text-ember-600">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-7 list-disc space-y-3 pl-5 marker:text-ember-500">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-7 list-decimal space-y-3 pl-5 marker:font-bold marker:text-forest-900">{children}</ol>
  ),
  li: ({ children }) => <li className="pl-1.5">{children}</li>,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <figure className="my-10 overflow-hidden rounded-3xl">
        <Image src={src} alt={alt ?? ""} width={1536} height={1024} sizes="(min-width: 768px) 720px, 100vw" className="h-auto w-full" />
      </figure>
    ) : null,
};

/** Renders a post's Markdown body with the site's article typography. */
export function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <div className="text-[1.075rem] leading-[1.8] text-ink-600">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
