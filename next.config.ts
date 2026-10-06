import type { NextConfig } from "next";
import { blogPosts } from "./data/blog-posts";

const nextConfig: NextConfig = {
  images: {
    // Cabin photo galleries are served from OwnerRez's image CDN.
    remotePatterns: [{ protocol: "https", hostname: "uc.orez.io", pathname: "/i/**" }],
  },
  // Keep links to the old OwnerRez blog URLs working.
  async redirects() {
    return blogPosts.map((p) => ({ source: `/blog/${p.legacySlug}`, destination: `/blog/${p.slug}`, permanent: true }));
  },
};

export default nextConfig;
