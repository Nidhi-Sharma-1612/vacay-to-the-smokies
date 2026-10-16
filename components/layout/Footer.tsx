import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navLinks, site } from "@/data/site";
import { cabins } from "@/data/cabins";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { MountainDivider } from "@/components/ui/MountainDivider";

export function Footer() {
  return (
    <footer id="contact" className="grain relative bg-forest-950 text-cream-50">
      <MountainDivider className="-mt-px rotate-180 text-cream-50" />
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={1089}
              height={539}
              className="h-20 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-xs leading-relaxed text-mist-200/70">
              Romantic cabins with private hot tubs, tucked between Gatlinburg
              and Pigeon Forge, Tennessee.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-10 place-items-center rounded-full border border-cream-50/15 transition-colors hover:border-ember-500 hover:bg-ember-500"
              >
                <FacebookIcon className="size-5" />
              </a>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center rounded-full border border-cream-50/15 transition-colors hover:border-ember-500 hover:bg-ember-500"
              >
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="eyebrow text-ember-300">Explore</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-mist-200/80 transition-colors hover:text-cream-50"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/policies"
                  className="text-mist-200/80 transition-colors hover:text-cream-50"
                >
                  Booking policies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-ember-300">Cabins</h3>
            <ul className="mt-5 space-y-3">
              {cabins.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    className="text-mist-200/80 transition-colors hover:text-cream-50"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-ember-300">Get in touch</h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-3 text-mist-200/80 transition-colors hover:text-cream-50"
                >
                  <Phone
                    className="size-4 shrink-0 text-ember-300"
                    aria-hidden
                  />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 break-all text-mist-200/80 transition-colors hover:text-cream-50"
                >
                  <Mail
                    className="size-4 shrink-0 text-ember-300"
                    aria-hidden
                  />
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-mist-200/80">
                <MapPin
                  className="size-4 shrink-0 text-ember-300"
                  aria-hidden
                />
                {site.location}
              </li>
            </ul>
            <Link
              href="/cabins"
              className="mt-7 inline-flex rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold transition-colors hover:bg-ember-600"
            >
              Book your stay
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream-50/10 pt-8 text-sm text-mist-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <a
            href="https://designbydial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 transition-colors hover:text-cream-50"
          >
            Designed and developed by
            <Image
              src="/images/company_logo.png"
              alt="Design by Dial"
              width={940}
              height={218}
              className="h-6 w-auto opacity-90 transition-opacity group-hover:opacity-100"
            />
          </a>
          <Link
            href="/policies"
            className="transition-colors hover:text-cream-50"
          >
            Policies & privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
