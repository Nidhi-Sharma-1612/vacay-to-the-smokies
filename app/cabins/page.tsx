import type { Metadata } from "next";
import Link from "next/link";
import { CalendarSearch, Phone, SearchX } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/booking/SearchBar";
import { ResultCard } from "@/components/booking/ResultCard";
import { cabinFilters } from "@/data/cabins";
import { site } from "@/data/site";
import { formatStayRange } from "@/lib/booking/dates";
import { guestLabel, parseSearch, searchQuery } from "@/lib/booking/search-params";
import { searchCabins } from "@/lib/booking/service";
import { getCmsCabins } from "@/lib/cabin-cms";
import { Accent } from "@/components/ui/Accent";
import { accentStr, getPageSections, str } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Search cabins | Vacay To The Smokies",
  description: "Check live availability and book a romantic cabin with a private hot tub in Pigeon Forge and Gatlinburg directly with your hosts.",
};

export default async function CabinsPage({ searchParams }: PageProps<"/cabins">) {
  const search = parseSearch(await searchParams);
  const [{ available, unavailable }, cmsCabins, sections] = await Promise.all([searchCabins(search), getCmsCabins(), getPageSections("cabins-search")]);
  const intro = sections.intro ?? {};
  // Swap in the admin-edited name/description/photos/etc for display, while
  // leaving availability and pricing untouched — those came from OwnerRez via
  // searchCabins() above and must stay exactly what it computed.
  const cmsBySlug = new Map(cmsCabins.map((c) => [c.slug, c]));
  const withCms = <T extends { cabin: { slug: string } }>(r: T) => ({ ...r, cabin: cmsBySlug.get(r.cabin.slug) ?? r.cabin });
  const availableCms = available.map(withCms);
  const unavailableCms = unavailable.map(withCms);
  const hasDates = Boolean(search.checkin && search.checkout);
  const stayQuery = (slug?: string) =>
    searchQuery({ checkin: search.checkin, checkout: search.checkout, adults: search.adults, children: search.children, pets: search.pets, cabin: slug });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* z-20 keeps the search bar's date and guest dropdowns above the results below. */}
        <section className="grain relative z-20 border-b border-linen-200 bg-linen-100">
          <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
            <p className="eyebrow text-ember-500">{str(intro, "eyebrow", "Book direct")}</p>
            <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-forest-900 sm:text-5xl">
              <Accent text={accentStr(intro, "heading", "Find your *hideaway*")} />
            </h1>
            <div className="mt-8">
              <SearchBar key={JSON.stringify(search)} initial={search} variant="bar" cabins={cmsCabins} />
            </div>
          </div>
        </section>

        <section id="results" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-ink-600" aria-live="polite">
              <span className="font-serif text-2xl text-forest-900">
                {available.length} {available.length === 1 ? "cabin" : "cabins"}
              </span>
              {hasDates && ` · ${formatStayRange(search.checkin, search.checkout)}`}
              {` · ${guestLabel(search)}`}
              {hasDates && available.length > 0 && <span className="ml-2 font-semibold text-pine-600">· Available for your dates</span>}
            </p>
            <nav aria-label="Cabin style" className="flex flex-wrap gap-2">
              {cabinFilters.map((f) => {
                const active = (search.type ?? "all") === f.id;
                const href = `/cabins${searchQuery({ ...search, type: f.id === "all" ? undefined : f.id })}#results`;
                return (
                  <Link
                    key={f.id}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active ? "bg-forest-900 text-cream-50" : "bg-white text-forest-800 ring-1 ring-linen-200 hover:bg-linen-100"
                    }`}
                  >
                    {f.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {!hasDates && (
            <p className="mt-6 flex items-center gap-2 rounded-2xl bg-linen-100 px-4 py-3 text-sm text-forest-800">
              <CalendarSearch className="size-4 shrink-0 text-ember-500" aria-hidden />
              Add your dates above to see live availability and total prices.
            </p>
          )}

          {available.length > 0 ? (
            <ul className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {availableCms.map((r) => (
                <li key={r.cabin.slug}>
                  <ResultCard cabin={r.cabin} quote={r.quote} href={`${r.cabin.href}${stayQuery()}`} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-3xl border border-dashed border-linen-200 bg-white px-6 py-16 text-center">
              <SearchX className="size-10 text-ember-500" aria-hidden />
              <h2 className="mt-5 font-serif text-2xl text-forest-900">
                {hasDates ? "All booked for those dates" : "No cabins match that search"}
              </h2>
              <p className="mt-2 text-ink-600">
                {hasDates
                  ? "Try nearby dates, or give us a call and we'll help you find the closest opening."
                  : "Try fewer guests or a different cabin style. Our largest cabin sleeps 6."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/cabins" className="rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-cream-50 hover:bg-ember-500">
                  Clear search
                </Link>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-forest-800/25 px-5 py-3 text-sm font-semibold text-forest-800"
                >
                  <Phone className="size-4" aria-hidden />
                  {site.phone}
                </a>
              </div>
            </div>
          )}

          {unavailable.length > 0 && (
            <div className="mt-20">
              <h2 className="font-serif text-2xl text-forest-900">
                {unavailable.length} other {unavailable.length === 1 ? "cabin isn't" : "cabins aren't"} available for this search
              </h2>
              <p className="mt-1 text-ink-600">Open a cabin to see its calendar and pick different dates.</p>
              <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {unavailableCms.map((r) => (
                  <li key={r.cabin.slug}>
                    <ResultCard
                      cabin={r.cabin}
                      unavailableReason={r.reason}
                      href={`${r.cabin.href}${searchQuery({ adults: search.adults, children: search.children, pets: search.pets })}`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
