import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

type Variant = "primary" | "light" | "outline-light" | "outline-dark";

const variants: Record<Variant, string> = {
  primary: "bg-ember-500 text-cream-50 hover:bg-ember-600 shadow-soft",
  light: "bg-cream-50 text-forest-900 hover:bg-linen-100",
  "outline-light": "border border-cream-50/40 text-cream-50 hover:bg-cream-50/10 hover:border-cream-50/70",
  "outline-dark": "border border-forest-800/25 text-forest-800 hover:bg-forest-800 hover:text-cream-50",
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: "md" | "lg";
};

export function ButtonLink({ variant = "primary", size = "md", className = "", children, href = "", ...props }: ButtonLinkProps) {
  const sizing = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-3 text-sm";
  const classes = `group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-500 ${sizing} ${variants[variant]} ${className}`;
  // Internal routes use client-side navigation; tel:, mailto: and in-page anchors stay plain links.
  if (href.startsWith("/"))
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}
