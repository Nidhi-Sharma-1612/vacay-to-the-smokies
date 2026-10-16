import type { NextConfig } from "next";
import { blogPosts } from "./data/blog-posts";
import { cabins } from "./data/cabins";

const nextConfig: NextConfig = {
  images: {
    // Cabin photo galleries are served from OwnerRez's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "uc.orez.io", pathname: "/i/**" }],
  },
  // Keep links to the old OwnerRez-hosted site working (search engines, emails, OwnerRez widgets).
  // Query strings such as ?or_arrival=…&or_departure=… are carried over and prefill the dates.
  async redirects() {
    return [
      // "Blog" became the Smoky Mountain Guide; old /blog URLs (including the original OwnerRez post slugs) still work.
      ...blogPosts.map((p) => ({ source: `/blog/${p.legacySlug}`, destination: `/smoky-mountain-guide/${p.slug}`, permanent: true })),
      { source: "/blog", destination: "/smoky-mountain-guide", permanent: true },
      { source: "/blog/:slug", destination: "/smoky-mountain-guide/:slug", permanent: true },
      ...cabins.map((c) => ({ source: c.legacyPath, destination: `/cabins/${c.slug}`, permanent: true })),
      { source: "/holdover-orp5b7805ax", destination: "/cabins", permanent: true },
      { source: "/properties", destination: "/cabins", permanent: true },
      { source: "/book", destination: "/cabins", permanent: true },
      { source: "/map", destination: "/cabins", permanent: true },
      { source: "/reviews", destination: "/#reviews", permanent: true },
      { source: "/privacypolicy-573991779", destination: "/policies", permanent: true },
    ];
  },
};

export default nextConfig;
