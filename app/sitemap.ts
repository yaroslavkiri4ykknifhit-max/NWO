import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/markdown";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://newwayout.online";
  return [
    ...["/", "/free/", "/premium/", "/mentorship/", "/blog/"].map((path) => ({
      url: `${base}${path}`,
    })),
    ...getAllPosts().map((post) => ({
      url: `${base}/blog/${post.slug}/`,
      lastModified: post.date,
    })),
  ];
}
