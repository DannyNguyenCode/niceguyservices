import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/api/",
                "/_next/",
                "/contact/business-intake",
                "/contact/portfolio-intake",
            ],
        },
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
