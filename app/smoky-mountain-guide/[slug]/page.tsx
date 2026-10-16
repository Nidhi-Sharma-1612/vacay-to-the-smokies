import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { PostCard } from "@/components/blog/PostCard";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ResultCard } from "@/components/booking/ResultCard";
import { CabinActions } from "@/components/cabin/CabinActions";
import { blogPosts } from "@/data/blog-posts";
import { cabins } from "@/data/cabins";
import { formatPostDate, getPost, headingId, relatedPosts } from "@/lib/blog";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/smoky-mountain-guide/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | Vacay To The Smokies`,
    description: post.excerpt,
    openGraph: { type: "article", publishedTime: post.date, images: [post.cover] },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/smoky-mountain-guide/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const headings = post.blocks.filter((b) => b.type === "heading").map((b) => b.text);
  const related = relatedPosts(post.slug);
  const featuredCabins = cabins.filter((c) => post.cabins.includes(c.slug));

  return (
    <>
      <Navbar />
      <ReadingProgress />
      <main className="pt-20">
        <header className="relative isolate overflow-hidden bg-forest-950">
          <Image src={post.hero} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-55" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/50 to-forest-950/20" />
          <div className="mx-auto max-w-4xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-cream-50/70">
              <Link href="/smoky-mountain-guide" className="hover:text-cream-50">
                Smoky Mountain Guide
              </Link>
              <ChevronRight className="size-4" aria-hidden />
              <Link href={`/smoky-mountain-guide?category=${encodeURIComponent(post.category)}`} className="hover:text-cream-50">
                {post.category}
              </Link>
            </nav>
            <h1 className="mt-5 font-serif text-4xl leading-[1.08] font-medium tracking-tight text-balance text-cream-50 sm:text-5xl lg:text-[3.5rem]">
              {post.title}
            </h1>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cream-50/80">
              <span className="font-semibold text-cream-50">Vacay To The Smokies</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden /> {post.minutes} min read
              </span>
            </p>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_20rem] lg:gap-16 lg:px-8">
          <article className="mx-auto w-full max-w-3xl min-w-0">
            <ArticleBody blocks={post.blocks} />
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-linen-200 pt-6">
              <Link href="/smoky-mountain-guide" className="inline-flex items-center gap-2 font-semibold text-forest-800 hover:text-ember-600">
                <ArrowLeft className="size-4" aria-hidden /> All guides
              </Link>
              <CabinActions slug={post.slug} name={post.title} save={false} />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {headings.length > 2 && (
              <nav aria-label="In this story" className="hidden rounded-3xl bg-white p-6 ring-1 ring-forest-900/5 lg:block">
                <p className="eyebrow text-ember-500">In this story</p>
                <ol className="mt-4 space-y-2.5 text-sm">
                  {headings.map((h) => (
                    <li key={h}>
                      <a href={`#${headingId(h)}`} className="leading-snug text-ink-600 transition-colors hover:text-forest-900">
                        {h}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="rounded-3xl bg-forest-900 p-6 text-cream-50">
              <p className="eyebrow text-ember-300">Plan your escape</p>
              <p className="mt-3 font-serif text-2xl leading-snug">Stay in a cabin with a private hot tub, minutes from it all</p>
              <Link
                href="/cabins"
                className="mt-5 inline-flex rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold transition-colors hover:bg-ember-600"
              >
                Check availability
              </Link>
            </div>
          </aside>
        </div>

        <section className="border-t border-linen-200 bg-linen-100/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-medium text-forest-900">Stay where the story happens</h2>
            <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:max-w-4xl">
              {featuredCabins.map((c) => (
                <li key={c.slug}>
                  <ResultCard cabin={c} href={c.href} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl font-medium text-forest-900">Keep reading</h2>
              <Link href="/smoky-mountain-guide" className="hidden font-semibold text-forest-800 underline underline-offset-4 hover:text-ember-600 sm:block">
                All guides
              </Link>
            </div>
            <ul className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
