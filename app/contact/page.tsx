import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";
import { cabins } from "@/data/cabins";
import { site } from "@/data/site";
import { formatTime } from "@/lib/booking/dates";

export const metadata: Metadata = {
  title: "Contact us | Vacay To The Smokies",
  description: `Questions about our Pigeon Forge and Gatlinburg cabins? Call ${site.phone} or send your hosts a message.`,
};

const sample = cabins[0].details;

// Answers drawn from the cabins' published house rules and policies.
const FAQS = [
  {
    q: "What are check-in and checkout times?",
    a: `Check-in is after ${formatTime(sample.checkIn)} and checkout is by ${formatTime(sample.checkOut)}. Most cabins have self check-in, and we send directions and instructions before you arrive.`,
  },
  {
    q: "Can I bring my dog?",
    a: "Yes. Every cabin is pet-friendly with prior approval and a pet fee. Please crate pets if they're left alone in the cabin.",
  },
  {
    q: "Are the cabins good for kids?",
    a: "Our Firefly Bungalows welcome families and sleep up to 6. Several of the forest cabins are designed for couples and aren't suitable for children, so check each cabin's house rules.",
  },
  {
    q: "Do I need a 4WD vehicle?",
    a: "Some forest cabins are reached by mountain roads with steep or gravel sections. In winter weather, 4WD or snow chains may be needed. The Parkway bungalows are on regular town streets.",
  },
  {
    q: "What is your cancellation policy?",
    a: sample.cancellationPolicy ?? "Please contact us for cancellation terms.",
  },
];

export default function ContactPage() {
  const channels = [
    { icon: Phone, label: "Call or text", value: site.phone, href: site.phoneHref, note: "The quickest way to reach us" },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}`, note: "Great for detailed questions" },
    { icon: MapPin, label: "Where we are", value: site.location, href: "/cabins", note: "Exact addresses are shared after booking" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="grain border-b border-linen-200 bg-linen-100">
          <div className="mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
            <p className="eyebrow text-ember-500">Contact</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              Talk to your <em className="text-ember-600">hosts</em>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              We&apos;re a small, family-run team in the Smokies. Ask us anything, from which cabin suits your trip to where to find the best fall color.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14 lg:px-8">
          <div className="space-y-4">
            {channels.map(({ icon: Icon, label, value, href, note }) => {
              const Wrapper = href.startsWith("/") ? Link : "a";
              return (
                <Wrapper
                  key={label}
                  href={href}
                  className="group flex items-start gap-4 rounded-3xl bg-white p-5 ring-1 ring-forest-900/5 transition-shadow hover:shadow-soft sm:p-6"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-900 text-ember-300 transition-colors group-hover:bg-ember-500 group-hover:text-cream-50">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink-600">{label}</span>
                    <span className="mt-0.5 block font-serif text-base text-forest-900 [overflow-wrap:anywhere] min-[360px]:text-lg sm:text-xl">
                      {/* Let the email wrap after the @ rather than mid-word. */}
                      {value.includes("@") ? (
                        <>
                          {value.split("@")[0]}@<wbr />
                          {value.split("@")[1]}
                        </>
                      ) : (
                        value
                      )}
                    </span>
                    <span className="mt-1 block text-sm text-ink-600">{note}</span>
                  </span>
                </Wrapper>
              );
            })}

            <div className="rounded-3xl bg-forest-900 p-6 text-cream-50">
              <p className="font-semibold">Follow along</p>
              <p className="mt-1 text-sm text-mist-200/80">Fall color, new cabins and last-minute openings.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={site.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-cream-50/10"
                >
                  <FacebookIcon className="size-4" /> Facebook
                </a>
                <a
                  href={site.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-cream-50/10"
                >
                  <InstagramIcon className="size-4" /> Instagram
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </section>

        <section className="border-t border-linen-200 bg-linen-100/60">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="text-center font-serif text-3xl font-medium text-forest-900 sm:text-4xl">Frequently asked questions</h2>
            <div className="mt-10 divide-y divide-linen-200 rounded-3xl bg-white px-6 ring-1 ring-forest-900/5">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-forest-900 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="size-5 shrink-0 text-ember-500 transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink-600">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-center text-ink-600">
              More details in our{" "}
              <Link href="/policies" className="font-semibold text-forest-900 underline underline-offset-4 hover:text-ember-600">
                booking policies
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
