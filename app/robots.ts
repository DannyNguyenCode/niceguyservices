import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getSiteUrl();

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/dashboard",
                    "/dashboard/",
                    "/api/admin/",
                    "/api/internal/",
                    "/report/",
                    "/demo-preview/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
