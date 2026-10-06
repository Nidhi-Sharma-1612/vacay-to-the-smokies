import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { formatPostDate, type BlogPost } from "@/lib/blog";

export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const href = `/blog/${post.slug}`;
  return (
    <article
      className={`group overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5 transition-shadow duration-500 hover:shadow-lift ${
        featured ? "grid lg:grid-cols-[1.25fr_1fr]" : "flex h-full flex-col"
      }`}
    >
      {/* The title link below goes to the same post, so the image link is skipped by keyboard and screen readers. */}
      <Link href={href} tabIndex={-1} aria-hidden className={`relative block overflow-hidden ${featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[16/10]"}`}>
        <Image
          src={post.cover}
          alt=""
          fill
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-cream-50/95 px-3 py-1 text-xs font-bold text-forest-900">{post.category}</span>
      </Link>
      <div className={`flex flex-1 flex-col ${featured ? "justify-center p-8 sm:p-10" : "p-6"}`}>
        {featured && <p className="eyebrow text-ember-500">Latest story</p>}
        <p className={`flex items-center gap-2 text-sm text-ink-600 ${featured ? "mt-3" : ""}`}>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden /> {post.minutes} min read
          </span>
        </p>
        <h3 className={`mt-3 font-serif font-medium text-balance text-forest-900 ${featured ? "text-3xl leading-tight sm:text-4xl" : "text-xl leading-snug"}`}>
          <Link href={href} className="transition-colors hover:text-ember-600">
            {post.title}
          </Link>
        </h3>
        <p className={`mt-3 leading-relaxed text-ink-600 ${featured ? "text-lg" : "line-clamp-3 text-[0.95rem]"}`}>{post.excerpt}</p>
        <Link
          href={href}
          className={`inline-flex items-center gap-1.5 font-semibold text-forest-900 transition-colors hover:text-ember-600 ${featured ? "mt-8" : "mt-auto pt-5"}`}
        >
          Read the story
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
