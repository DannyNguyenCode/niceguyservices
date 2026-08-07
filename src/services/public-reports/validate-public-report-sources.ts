import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableHeroSuggestion } from "@/src/data/hero-suggestions";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import { MAX_PUBLIC_HERO_SUGGESTIONS, MAX_PUBLIC_SCREENSHOTS } from "@/src/lib/public-report-config";

export class PublicReportValidationError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "PublicReportValidationError";
        this.code = code;
    }
}

function homepageSucceeded(crawl: SerializableCrawl): boolean {
    const homepage = crawl.pageResults.find((page) => page.pageType === "home");
    return Boolean(homepage && (homepage.statusCode ?? 200) < 400 && !homepage.errorMessage);
}

export function validatePublicReportSources(input: {
    website: SerializableWebsite;
    crawl: SerializableCrawl;
    pageSpeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
    niceGuy: SerializableNiceGuyMetric;
    aiSummary: SerializableAiSummary;
    heroSuggestions: SerializableHeroSuggestion[];
    screenshots: SerializableScreenshot[];
}): void {
    if (input.website.deletedAt) {
        throw new PublicReportValidationError("WEBSITE_INACTIVE", "Website is not active.");
    }

    if (input.crawl.websiteId !== input.website.id) {
        throw new PublicReportValidationError(
            "SOURCE_MISMATCH",
            "The selected audit records do not belong to the same audit run.",
        );
    }

    if (input.crawl.status !== "complete") {
        throw new PublicReportValidationError("CRAWL_REQUIRED", "A completed crawl is required.");
    }

    if (!homepageSucceeded(input.crawl)) {
        throw new PublicReportValidationError(
            "CRAWL_HOMEPAGE_REQUIRED",
            "A successful homepage crawl is required.",
        );
    }

    const mobileComplete = input.pageSpeed.mobile?.status === "complete";
    const desktopComplete = input.pageSpeed.desktop?.status === "complete";
    if (!mobileComplete && !desktopComplete) {
        throw new PublicReportValidationError(
            "PAGESPEED_REQUIRED",
            "At least one completed PageSpeed strategy is required.",
        );
    }

    if (
        (input.pageSpeed.mobile && input.pageSpeed.mobile.crawlId !== input.crawl.id) ||
        (input.pageSpeed.desktop && input.pageSpeed.desktop.crawlId !== input.crawl.id)
    ) {
        throw new PublicReportValidationError(
            "SOURCE_MISMATCH",
            "The selected audit records do not belong to the same audit run.",
        );
    }

    if (
        input.niceGuy.websiteId !== input.website.id ||
        input.niceGuy.crawlId !== input.crawl.id ||
        input.niceGuy.status !== "complete"
    ) {
        throw new PublicReportValidationError(
            "NICEGUY_REQUIRED",
            "Completed Nice Guy Metrics matching the crawl are required.",
        );
    }

    if (
        input.aiSummary.websiteId !== input.website.id ||
        input.aiSummary.crawlId !== input.crawl.id ||
        input.aiSummary.niceGuyMetricId !== input.niceGuy.id ||
        input.aiSummary.status !== "complete"
    ) {
        throw new PublicReportValidationError(
            "AI_SUMMARY_REQUIRED",
            "A completed AI summary matching the Nice Guy record is required.",
        );
    }

    for (const hero of input.heroSuggestions) {
        if (hero.aiSummaryId !== input.aiSummary.id) {
            throw new PublicReportValidationError(
                "SOURCE_MISMATCH",
                "The selected audit records do not belong to the same audit run.",
            );
        }
        if (hero.status === "rejected") {
            throw new PublicReportValidationError(
                "HERO_REJECTED",
                "Rejected hero suggestions cannot be included in a public report.",
            );
        }
    }

    if (input.heroSuggestions.length > MAX_PUBLIC_HERO_SUGGESTIONS) {
        throw new PublicReportValidationError(
            "HERO_LIMIT",
            `A maximum of ${MAX_PUBLIC_HERO_SUGGESTIONS} hero suggestions may be included.`,
        );
    }

    for (const shot of input.screenshots) {
        if (shot.crawlId !== input.crawl.id) {
            throw new PublicReportValidationError(
                "SOURCE_MISMATCH",
                "The selected audit records do not belong to the same audit run.",
            );
        }
        if (shot.status !== "complete") {
            throw new PublicReportValidationError(
                "SCREENSHOT_INCOMPLETE",
                "Only completed screenshots may be included.",
            );
        }
    }

    if (input.screenshots.length > MAX_PUBLIC_SCREENSHOTS) {
        throw new PublicReportValidationError(
            "SCREENSHOT_LIMIT",
            `A maximum of ${MAX_PUBLIC_SCREENSHOTS} screenshots may be included.`,
        );
    }
}

export function isReportExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now();
}

export function isPublicReportAccessible(report: {
    status: string;
    expiresAt: string | null;
}): boolean {
    if (report.status !== "published") return false;
    return !isReportExpired(report.expiresAt);
}
