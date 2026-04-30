import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
    const base = getSiteUrl();
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/"],
        },
        sitemap: `${base}/sitemap.xml`,
        host: base.replace(/^https?:\/\//, ""),
    };
}
