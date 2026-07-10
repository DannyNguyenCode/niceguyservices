import type { MetadataRoute } from "next";
import { RESOURCE_ARTICLE_METAS } from "@/components/resources/digital-craftsman/articles/metas";
import { parseArticleDate } from "@/components/resources/digital-craftsman/formatArticleDate";
import { absoluteUrl } from "@/lib/siteConfig";

type SitemapRoute = {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
    priority: number;
    lastModified?: Date;
};

const staticRoutes: SitemapRoute[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.85 },
    { path: "/about", changeFrequency: "yearly", priority: 0.65 },
    { path: "/work", changeFrequency: "monthly", priority: 0.7 },
    { path: "/work/jackie-portfolio", changeFrequency: "monthly", priority: 0.68 },
    { path: "/inspiration", changeFrequency: "monthly", priority: 0.65 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.75 },
    // { path: "/client-discovery-workbook", changeFrequency: "yearly", priority: 0.5 },
    { path: "/resources", changeFrequency: "weekly", priority: 0.75 },
    { path: "/testimonials", changeFrequency: "monthly", priority: 0.55 },
];

const resourceArticleRoutes: SitemapRoute[] = RESOURCE_ARTICLE_METAS.map((meta) => ({
    path: meta.path,
    changeFrequency: "monthly" as const,
    priority: 0.75,
    lastModified: parseArticleDate(meta.dateModified),
}));

const routes: SitemapRoute[] = [...staticRoutes, ...resourceArticleRoutes];

export default function sitemap(): MetadataRoute.Sitemap {
    const siteLastModified = new Date();

    return routes.map((r) => ({
        url: absoluteUrl(r.path),
        lastModified: r.lastModified ?? siteLastModified,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));
}
