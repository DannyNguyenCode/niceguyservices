import type { CrawlPageResult } from "@/src/schemas/crawl-data";
import type { PageType } from "@/src/schemas/enums";
import { getUrlPath } from "@/src/lib/crawl-utils";

export type ScreenshotPageTarget = {
    url: string;
    pageType: PageType;
    slug: string;
};

const WEBSITE_AUDIT_PATH = /^\/work\/website-audit(?:\/|$)/i;

export function isWebsiteAuditLandingPath(path: string): boolean {
    return WEBSITE_AUDIT_PATH.test(path);
}

function slugForPage(result: CrawlPageResult): string {
    if (result.pageType === "home") return "home";
    if (result.pageType === "contact") return "contact";
    if (isWebsiteAuditLandingPath(result.path)) return "website-audit";
    return result.path
        .replace(/^\/+|\/+$/g, "")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()
        .slice(0, 60) || "page";
}

export function selectScreenshotPageTargets(
    pageResults: CrawlPageResult[],
): ScreenshotPageTarget[] {
    const successful = pageResults.filter((result) => !result.errorMessage);
    const targets: ScreenshotPageTarget[] = [];
    const seen = new Set<string>();

    const addTarget = (matcher: (result: CrawlPageResult) => boolean) => {
        const match = successful.find(matcher);
        if (!match || seen.has(match.url)) return;
        seen.add(match.url);
        targets.push({
            url: match.url,
            pageType: match.pageType,
            slug: slugForPage(match),
        });
    };

    addTarget((result) => result.pageType === "home");
    addTarget((result) => result.pageType === "contact");
    addTarget((result) => isWebsiteAuditLandingPath(result.path));

    for (const result of successful) {
        if (targets.length >= 6) break;
        if (seen.has(result.url)) continue;
        seen.add(result.url);
        targets.push({
            url: result.url,
            pageType: result.pageType,
            slug: slugForPage(result),
        });
    }

    return targets;
}

export function screenshotFilenameForTarget(
    slug: string,
    viewport: "desktop" | "mobile",
    mode: "viewport" | "full" = "viewport",
): string {
    return `${slug}-${viewport}-${mode}.png`;
}

export function pathSlug(url: string): string {
    return slugForPage({
        url,
        path: getUrlPath(url),
        pageType: "other",
        headings: [],
        buttons: [],
        forms: [],
        images: [],
    });
}
