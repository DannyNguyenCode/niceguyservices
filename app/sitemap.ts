import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteConfig";

const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
}> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.85 },
    { path: "/about", changeFrequency: "yearly", priority: 0.65 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.75 },
    { path: "/contact/business-intake", changeFrequency: "yearly", priority: 0.45 },
    { path: "/contact/portfolio-intake", changeFrequency: "yearly", priority: 0.45 },
    { path: "/resources", changeFrequency: "weekly", priority: 0.75 },
    {
        path: "/resources/how-seo-helps-local-businesses",
        changeFrequency: "monthly",
        priority: 0.65,
    },
    {
        path: "/resources/why-fast-websites-rank-better",
        changeFrequency: "monthly",
        priority: 0.65,
    },
    {
        path: "/resources/how-to-start-seo-for-your-website",
        changeFrequency: "monthly",
        priority: 0.65,
    },
    { path: "/testimonials", changeFrequency: "monthly", priority: 0.55 },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = getSiteUrl();
    const lastModified = new Date();

    return routes.map((r) => ({
        url: `${baseUrl}${r.path === "/" ? "" : r.path}`,
        lastModified,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));
}
