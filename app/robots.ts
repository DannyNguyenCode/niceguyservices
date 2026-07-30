import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

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
        ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml` } : {}),
    };
}
