import { parseArticleDate } from "@/components/resources/digital-craftsman/formatArticleDate";

/**
 * Explicit lastmod values for static marketing pages.
 * Update these when the visible page content actually changes.
 */
export const STATIC_SITEMAP_LASTMOD = {
    "/": "2026-07-05",
    "/services": "2026-07-05",
    "/pricing": "2026-07-05",
    "/about": "2026-07-05",
    "/work": "2026-07-05",
    "/work/jackie-portfolio": "2026-07-31",
    "/inspiration": "2026-07-05",
    "/contact": "2026-07-05",
    "/resources": "2026-07-05",
} as const;

export type StaticSitemapPath = keyof typeof STATIC_SITEMAP_LASTMOD;

export function staticSitemapDate(path: StaticSitemapPath): Date {
    return parseArticleDate(STATIC_SITEMAP_LASTMOD[path]);
}
