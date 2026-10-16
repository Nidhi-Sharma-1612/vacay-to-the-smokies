import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { ButtonLink } from "@/components/ui/Button";
import { blogPosts } from "@/data/blog-posts";
import { blogCategories } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Smoky Mountain Guide | Vacay To The Smokies",
  description:
    "Local ideas for Gatlinburg, Pigeon Forge, Great Smoky Mountains National Park and romantic getaways for two, from your hosts in the Smokies.",
};

export default async function GuidePage({ searchParams }: PageProps<"/smoky-mountain-guide">) {
  const { category } = await searchParams;
  const active = typeof category === "string" && blogCategories.includes(category) ? category : null;
  const posts = active ? blogPosts.filter((p) => p.category === active) : blogPosts;
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="grain border-b border-linen-200 bg-linen-100">
          <div className="mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6 lg:px-8">
            <p className="eyebrow text-ember-500">Smoky Mountain Guide</p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              Local ideas for making the most of your time in <em className="text-ember-600">the Smokies</em>
            </h1>
            <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-ink-600">
              <p>
                You don&apos;t need to do everything to have a great Smoky Mountain vacation. Sometimes it&apos;s a waterfall hike followed by
                dinner in Gatlinburg. Sometimes it&apos;s a full day at Dollywood. And sometimes the best plan is coffee on the deck, a drive
                through the mountains and getting back to the hot tub before sunset.
              </p>
              <p>
                Our Smoky Mountain Guide brings together local ideas for Gatlinburg, Pigeon Forge, Great Smoky Mountains National Park and
                romantic getaways for two—so you can spend less time researching and more time enjoying your trip.
              </p>
            </div>
            <nav aria-label="Guide sections" className="mt-8 flex flex-wrap gap-2">
              {[null, ...blogCategories].map((c) => {
                const isActive = c === active;
                return (
                  <Link
                    key={c ?? "all"}
                    href={c ? `/smoky-mountain-guide?category=${encodeURIComponent(c)}` : "/smoky-mountain-guide"}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive ? "bg-forest-900 text-cream-50" : "bg-white text-forest-800 ring-1 ring-linen-200 hover:bg-cream-50"
                    }`}
                  >
                    {c ?? "All guides"}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          {!featured && (
            <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-linen-200 bg-white px-6 py-14 text-center">
              <p className="font-serif text-2xl text-forest-900">Guides for this section are on the way</p>
              <p className="mt-2 text-ink-600">In the meantime, browse the rest of our Smoky Mountain Guide.</p>
              <Link
                href="/smoky-mountain-guide"
                className="mt-6 inline-flex rounded-full bg-forest-900 px-5 py-3 text-sm font-semibold text-cream-50 hover:bg-ember-500"
              >
                All guides
              </Link>
            </div>
          )}
          {featured && <PostCard post={featured} featured />}
          {rest.length > 0 && (
            <ul className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-forest-900 p-8 text-cream-50 sm:p-12 md:flex-row md:items-center">
            <div>
              <p className="eyebrow text-ember-300">Ready when you are</p>
              <h2 className="mt-3 font-serif text-3xl font-medium sm:text-4xl">See the Smokies from your own hot tub</h2>
              <p className="mt-3 max-w-xl text-mist-200/80">Six hideaways between Gatlinburg and Pigeon Forge, booked direct with your hosts.</p>
            </div>
            <ButtonLink href="/cabins" size="lg" className="shrink-0">
              Find your cabin
            </ButtonLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
