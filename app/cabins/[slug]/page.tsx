import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Bath, BedDouble, ChevronRight, KeyRound, MapPin, Navigation, PawPrint, Ruler, Star, Users, Waves } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Gallery } from "@/components/cabin/Gallery";
import { Description } from "@/components/cabin/Description";
import { Amenities } from "@/components/cabin/Amenities";
import { CabinActions } from "@/components/cabin/CabinActions";
import { SectionNav } from "@/components/cabin/SectionNav";
import { ThingsToKnow } from "@/components/cabin/ThingsToKnow";
import { BookingPanel } from "@/components/booking/BookingPanel";
import { StayProvider } from "@/components/booking/StayContext";
import { ResultCard } from "@/components/booking/ResultCard";
import { cabins, getCabin, photoUrl, type CabinWithDetails } from "@/data/cabins";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { formatTime } from "@/lib/booking/dates";
import { parseSearch, searchQuery } from "@/lib/booking/search-params";

export function generateStaticParams() {
  return cabins.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cabins/[slug]">): Promise<Metadata> {
  const cabin = getCabin((await params).slug);
  if (!cabin) return {};
  return {
    title: `${cabin.name} · ${cabin.tagline} | Vacay To The Smokies`,
    description: cabin.description,
    openGraph: { images: [photoUrl(cabin.details.photos[0])] },
  };
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "sleeping", label: "Sleeping" },
  { id: "amenities", label: "Amenities" },
  { id: "rules", label: "Things to know" },
  { id: "location", label: "Location" },
  { id: "reviews", label: "Reviews" },
];

function Section({ id, title, children, intro }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-linen-200 py-12 first:border-t-0 first:pt-8">
      <h2 className="font-serif text-2xl font-medium text-forest-900 sm:text-3xl">{title}</h2>
      {intro && <p className="mt-2 text-ink-600">{intro}</p>}
      <div className="mt-7">{children}</div>
    </section>
  );
}

/** Three reasons to book, built only from facts in the listing. */
function highlights(cabin: CabinWithDetails) {
  const d = cabin.details;
  const list = [
    { icon: Bath, title: "Your own private hot tub", text: "Soak under the trees and stars, just steps from your door." },
  ];
  if (d.rating >= 4.9)
    list.push({ icon: Award, title: "One of our top-rated stays", text: `Rated ${d.rating.toFixed(2)} out of 5 by ${d.reviewCount} guests.` });
  if (d.amenityGroups.some((g) => g.items.some((i) => /jacuzzi/i.test(i))))
    list.push({ icon: Waves, title: "Jacuzzi tub inside", text: "A deep soak for two without leaving the cabin." });
  if (d.checkInMethod) list.push({ icon: KeyRound, title: "Self check-in", text: `Arrive on your schedule with a ${d.checkInMethod.toLowerCase()}.` });
  if (d.petsAllowed) list.push({ icon: PawPrint, title: "Bring your pup", text: "Pets welcome with prior approval and a pet fee." });
  return list.slice(0, 3);
}

export default async function CabinPage({ params, searchParams }: PageProps<"/cabins/[slug]">) {
  const cabin = getCabin((await params).slug);
  if (!cabin) notFound();
  const search = parseSearch(await searchParams);
  const d = cabin.details;
  const photos = d.photos.map((id) => photoUrl(id));
  const guestQuery = searchQuery({ checkin: search.checkin, checkout: search.checkout, adults: search.adults, children: search.children, pets: search.pets });
  const similar = [...cabins.filter((c) => c.slug !== cabin.slug)]
    .sort((a, b) => Number(b.category === cabin.category) - Number(a.category === cabin.category))
    .slice(0, 3);
  // Reviews written about this cabin first; other cabins fill in until real reviews are loaded.
  const cabinReviews = [...reviews].sort((a, b) => Number(b.cabin === cabin.name) - Number(a.cabin === cabin.name)).slice(0, 2);
  const [lat, lng] = d.coords ?? [];
  const mapBox = lat && lng ? `${lng - 0.02},${lat - 0.012},${lng + 0.02},${lat + 0.012}` : null;
  const topRated = d.rating >= 4.95;

  const stats = [
    { icon: Users, value: String(d.maxGuests), label: d.maxGuests === 1 ? "guest" : "guests" },
    { icon: BedDouble, value: cabin.size.replace(/ A-Frame$/, ""), label: cabin.size.endsWith("A-Frame") ? "A-frame" : "layout" },
    { icon: Bath, value: String(cabin.baths), label: cabin.baths === 1 ? "bathroom" : "bathrooms" },
    ...(d.sqft ? [{ icon: Ruler, value: `${d.sqft}`, label: "sq ft" }] : []),
  ];

  return (
    <>
      <Navbar />
      <StayProvider
        cabin={{
          slug: cabin.slug,
          name: cabin.name,
          details: {
            maxGuests: d.maxGuests,
            childrenAllowed: d.childrenAllowed,
            petsAllowed: d.petsAllowed,
            rateRange: d.rateRange,
            rating: d.rating,
            reviewCount: d.reviewCount,
          },
        }}
        initial={search}
      >
        <main className="mx-auto max-w-7xl px-4 pt-24 pb-28 sm:px-6 lg:px-8 lg:pb-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-600">
            <Link href={`/cabins${guestQuery}`} className="hover:text-ember-600">
              Cabins
            </Link>
            <ChevronRight className="size-4" aria-hidden />
            <span className="text-forest-900">{cabin.name}</span>
          </nav>

          <header className="mt-4 mb-7">
            <p className="eyebrow text-ember-500">{cabin.tagline}</p>
            <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-forest-900 sm:text-5xl">{cabin.name}</h1>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-600">
                <a href="#reviews" className="flex items-center gap-1 font-semibold text-forest-900 hover:underline">
                  <Star className="size-4 fill-ember-500 text-ember-500" aria-hidden />
                  {d.rating.toFixed(2)}
                  <span className="font-normal text-ink-600 underline underline-offset-2">· {d.reviewCount} reviews</span>
                </a>
                {topRated && (
                  <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-500">
                    <Award className="size-3.5" aria-hidden /> Top rated
                  </span>
                )}
                <a href="#location" className="flex items-center gap-1 hover:text-forest-900">
                  <MapPin className="size-4 text-ember-500" aria-hidden />
                  {d.locality}
                </a>
              </p>
              <CabinActions slug={cabin.slug} name={cabin.name} />
            </div>
          </header>

          <Gallery photos={photos} name={cabin.name} />

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
            <div className="min-w-0">
              <SectionNav items={SECTIONS} />

              <Section id="overview" title="About this cabin">
                <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-linen-200 ring-1 ring-forest-900/5 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  {stats.map(({ icon: Icon, value, label }) => (
                    <li key={label} className="flex min-w-0 items-center gap-3 bg-white p-4 sm:p-5">
                      <Icon className="size-5 shrink-0 text-ember-500 sm:size-6" aria-hidden />
                      <p className="min-w-0">
                        <span className="block font-serif text-lg leading-none text-forest-900 sm:text-xl">{value}</span>
                        <span className="mt-1 block text-xs font-semibold tracking-wide text-ink-600 uppercase">{label}</span>
                      </p>
                    </li>
                  ))}
                </ul>

                <ul className="mt-8 space-y-5">
                  {highlights(cabin).map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-forest-900 text-ember-300">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="font-semibold text-forest-900">{title}</p>
                        <p className="text-ink-600">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 border-t border-linen-200 pt-10">
                  <Description blocks={d.description} />
                </div>
              </Section>

              <Section id="sleeping" title="Where you'll sleep" intro={d.sleeping.summary}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {d.sleeping.rooms.map((room) => {
                    const [where, bed] = room.split(" · ");
                    return (
                      <div key={room} className="rounded-3xl bg-white p-6 ring-1 ring-forest-900/5">
                        <BedDouble className="size-7 text-ember-500" aria-hidden />
                        <p className="mt-4 font-serif text-xl text-forest-900">{bed ?? where}</p>
                        {bed && <p className="mt-1 text-sm leading-relaxed text-ink-600">{where}</p>}
                      </div>
                    );
                  })}
                  {d.bathrooms.rooms.map((room) => {
                    const [where, features] = room.split(" · ");
                    const name = /bath/i.test(where) ? where : `${where} bathroom`;
                    return (
                      <div key={room} className="rounded-3xl bg-white p-6 ring-1 ring-forest-900/5">
                        <Bath className="size-7 text-ember-500" aria-hidden />
                        <p className="mt-4 font-serif text-xl text-forest-900">{name}</p>
                        {features && <p className="mt-1 text-sm leading-relaxed text-ink-600">{features}</p>}
                      </div>
                    );
                  })}
                </div>
              </Section>

              <Section id="amenities" title="What this cabin offers">
                <Amenities groups={d.amenityGroups} />
              </Section>

              <Section id="rules" title="Things to know">
                <ThingsToKnow
                  checkIn={formatTime(d.checkIn)}
                  checkOut={formatTime(d.checkOut)}
                  checkInMethod={d.checkInMethod}
                  houseRules={d.houseRules}
                  property={d.expectations}
                  notes={d.notes}
                  cancellationPolicy={d.cancellationPolicy}
                />
              </Section>

              <Section id="location" title="Where you'll be" intro={`${d.locality} · the exact address is shared after booking.`}>
                <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.4fr_1fr]">
                  {mapBox && (
                    <div className="relative overflow-hidden rounded-3xl ring-1 ring-forest-900/5">
                      <iframe
                        title={`Map of the area around ${cabin.name}`}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBox}&layer=mapnik`}
                        className="h-80 w-full saturate-[0.6]"
                        loading="lazy"
                      />
                      {/* Approximate area marker: the exact location is only shared after booking. */}
                      <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
                        <span className="grid size-28 place-items-center rounded-full border-2 border-ember-500/60 bg-ember-500/15">
                          <span className="grid size-11 place-items-center rounded-full bg-ember-500 text-cream-50 shadow-lift">
                            <MapPin className="size-5" />
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="rounded-3xl bg-white p-6 ring-1 ring-forest-900/5">
                    <p className="flex items-center gap-2 font-semibold text-forest-900">
                      <Navigation className="size-5 text-ember-500" aria-hidden /> Getting around
                    </p>
                    <ul className="mt-4 divide-y divide-linen-200">
                      {cabin.nearby.map((n) => (
                        <li key={n.place} className="flex items-center justify-between gap-4 py-3.5">
                          <span className="text-forest-800">{n.place}</span>
                          <span className="shrink-0 rounded-full bg-linen-100 px-3 py-1 text-sm font-semibold text-forest-900">{n.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              <Section id="reviews" title="Guest reviews">
                <div className="flex flex-col gap-6 rounded-3xl bg-forest-900 p-6 text-cream-50 sm:flex-row sm:items-center sm:p-8">
                  <div className="flex items-center gap-5">
                    <span className="font-serif text-6xl leading-none">{d.rating.toFixed(2)}</span>
                    <div>
                      <div className="flex text-ember-300" aria-label={`${d.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="size-4 fill-current" aria-hidden />
                        ))}
                      </div>
                      <p className="mt-1.5 text-sm text-mist-200/80">{d.reviewCount} verified stays</p>
                    </div>
                  </div>
                  {topRated && (
                    <p className="flex items-start gap-3 border-cream-50/15 text-sm leading-relaxed text-mist-200/90 sm:border-l sm:pl-6">
                      <Award className="mt-0.5 size-5 shrink-0 text-ember-300" aria-hidden />
                      Top rated: one of our highest-rated cabins, based on {d.reviewCount} guest reviews.
                    </p>
                  )}
                </div>
                <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                  {cabinReviews.map((r) => (
                    <li key={r.quote} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-forest-900/5">
                      <div className="flex text-ember-500" aria-hidden>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-3 flex-1 leading-relaxed text-forest-800">&ldquo;{r.quote}&rdquo;</p>
                      <div className="mt-5 flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-linen-100 font-serif text-forest-900">
                          {r.author.charAt(0)}
                        </span>
                        <p className="text-sm leading-tight">
                          <span className="block font-semibold text-forest-900">{r.author}</span>
                          <span className="text-ink-600">
                            {r.date} · {r.cabin}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-linen-100 p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-forest-900">Questions about {cabin.name}?</p>
                  <p className="text-sm text-ink-600">Talk to your hosts directly about pets, special occasions or anything else.</p>
                </div>
                <a
                  href={site.phoneHref}
                  className="shrink-0 rounded-full border border-forest-800/25 px-5 py-3 text-sm font-semibold text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream-50"
                >
                  Call {site.phone}
                </a>
              </div>
            </div>

            <div className="lg:relative">
              <BookingPanel />
            </div>
          </div>

          <section className="mt-20 border-t border-linen-200 pt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl font-medium text-forest-900">More hideaways you might love</h2>
              <Link href={`/cabins${guestQuery}`} className="hidden shrink-0 font-semibold text-forest-800 underline underline-offset-4 hover:text-ember-600 sm:block">
                See all cabins
              </Link>
            </div>
            <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => (
                <li key={c.slug}>
                  <ResultCard cabin={c} href={`${c.href}${guestQuery}`} />
                </li>
              ))}
            </ul>
          </section>
        </main>
      </StayProvider>
      <Footer />
    </>
  );
}
