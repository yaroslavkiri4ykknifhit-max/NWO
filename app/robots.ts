import { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/loader-demo/", "/test-loader.html"],
    },
    sitemap: "https://newwayout.online/sitemap.xml",
  };
}
