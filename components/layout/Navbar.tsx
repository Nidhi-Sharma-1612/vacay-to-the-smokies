"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = usePathname() === "/";

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Only the landing page has a full-bleed hero behind the header.
  const solid = !isHome || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "bg-cream-50/90 shadow-[0_1px_0_rgb(22_33_28/0.08)] backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link href="/" className="relative z-10 shrink-0" aria-label={`${site.name} home`}>
          <Image
            src="/images/logo.png"
            alt={site.name}
            width={1089}
            height={539}
            priority
            className={`h-12 w-auto transition-[filter] duration-500 sm:h-14 ${solid ? "" : "brightness-0 invert"}`}
          />
        </Link>

        <ul className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative text-sm font-semibold tracking-wide transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-ember-500 after:transition-all hover:after:w-full ${
                  solid ? "text-forest-900 hover:text-ember-600" : "text-cream-50/90 hover:text-cream-50"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 xl:flex">
          <a
            href={site.phoneHref}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              solid ? "text-forest-800 hover:text-ember-600" : "text-cream-50/90 hover:text-cream-50"
            }`}
          >
            <Phone className="size-4" aria-hidden />
            {site.phone}
          </a>
          <ButtonLink href="/cabins">Book Now</ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`relative z-10 rounded-full p-2 xl:hidden ${solid ? "text-forest-900" : "text-cream-50"}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-[calc(100svh-5rem)] overflow-y-auto bg-cream-50 px-4 pb-10 xl:hidden"
          >
            <ul className="flex flex-col divide-y divide-linen-200 border-t border-linen-200">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-5 font-serif text-3xl text-forest-900"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <ButtonLink href="/cabins" size="lg">
                Book Now
              </ButtonLink>
              <ButtonLink href={site.phoneHref} variant="outline-dark" size="lg">
                <Phone className="size-4" aria-hidden />
                {site.phone}
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
