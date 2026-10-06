import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { ButtonLink } from "@/components/ui/Button";
import { blogPosts } from "@/data/blog-posts";
import { blogCategories } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Smoky Mountain Travel Blog | Vacay To The Smokies",
  description: "Seasonal guides, romantic getaway ideas and things to do in Gatlinburg, Pigeon Forge and the Great Smoky Mountains.",
};

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
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
            <p className="eyebrow text-ember-500">The Smokies journal</p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium tracking-tight text-balance text-forest-900 sm:text-5xl">
              Stories &amp; guides from <em className="text-ember-600">the mountains</em>
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              When to visit, where to wander, and how to plan the perfect couples&apos; escape, from your hosts in Pigeon Forge and Gatlinburg.
            </p>
            <nav aria-label="Blog categories" className="mt-8 flex flex-wrap gap-2">
              {[null, ...blogCategories].map((c) => {
                const isActive = c === active;
                return (
                  <Link
                    key={c ?? "all"}
                    href={c ? `/blog?category=${encodeURIComponent(c)}` : "/blog"}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive ? "bg-forest-900 text-cream-50" : "bg-white text-forest-800 ring-1 ring-linen-200 hover:bg-cream-50"
                    }`}
                  >
                    {c ?? "All stories"}
                  </Link>
                );
              })}
            </nav>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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
