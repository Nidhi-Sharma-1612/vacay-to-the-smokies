import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "light" }: SectionHeadingProps) {
  const centered = align === "center";
  const onDark = tone === "dark";
  return (
    <Reveal className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${onDark ? "text-ember-300" : "text-ember-500"}`}>{eyebrow}</p>
      <h2
        className={`mt-4 font-serif text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl ${
          onDark ? "text-cream-50" : "text-forest-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-lg leading-relaxed ${onDark ? "text-mist-200/80" : "text-ink-600"}`}>{description}</p>
      )}
    </Reveal>
  );
}
