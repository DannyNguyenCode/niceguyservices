import {
    CATEGORY_LABELS,
    type NiceGuyCategoryKey,
} from "@/src/config/niceguy-scoring";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import { AI_INPUT_LIMITS } from "@/src/services/ai/constants";
import { truncateExcerpt } from "@/src/services/ai/sanitize-input";
import type { AuditAnalysisInput } from "@/src/services/ai/types";
import type { CategoryScore, MetricCheck } from "@/src/services/niceguy-scoring/types";

const CATEGORY_KEYS: NiceGuyCategoryKey[] = [
    "businessClarity",
    "trustCredibility",
    "conversionReadiness",
    "userExperience",
    "brandingConsistency",
    "contentQuality",
    "technicalFoundation",
];

function checkPriorityScore(check: MetricCheck): number {
    const statusOrder = { failed: 0, partial: 1, unavailable: 2, passed: 3 };
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return (
        (statusOrder[check.status] ?? 3) * 10 +
        (priorityOrder[check.priority ?? "low"] ?? 2)
    );
}

function mapCheck(check: MetricCheck) {
    const { evidence, missing } = {
        evidence: check.evidence
            .slice(0, 5)
            .map((item) => `${item.label}: ${String(item.value ?? "")}`),
        missing: check.missing.slice(0, 5),
    };

    return {
        id: check.id,
        label: check.label,
        status: check.status,
        pointsAwarded: check.pointsAwarded,
        maximumPoints: check.maximumPoints,
        recommendation: check.recommendation ?? null,
        priority: check.priority ?? null,
        evidence,
        missing,
    };
}

function selectChecks(category: CategoryScore): ReturnType<typeof mapCheck>[] {
    return [...category.checks]
        .sort((a, b) => checkPriorityScore(a) - checkPriorityScore(b))
        .slice(0, AI_INPUT_LIMITS.maximumChecksSentPerCategory)
        .map(mapCheck);
}

function buildPageSpeedStrategy(
    metric: SerializableGoogleMetric | null | undefined,
): AuditAnalysisInput["pagespeed"]["mobile"] {
    if (!metric || metric.status !== "complete") return null;

    return {
        scores: {
            performance: metric.scores.performance ?? null,
            accessibility: metric.scores.accessibility ?? null,
            bestPractices: metric.scores.bestPractices ?? null,
            seo: metric.scores.seo ?? null,
        },
        keyMetrics: {
            lcp:
                metric.coreWebVitals.largestContentfulPaint?.value ??
                metric.labMetrics.largestContentfulPaint?.valueMs ??
                null,
            cls:
                metric.coreWebVitals.cumulativeLayoutShift?.value ??
                metric.labMetrics.cumulativeLayoutShift?.value ??
                null,
            tbt: metric.labMetrics.totalBlockingTime?.valueMs ?? null,
        },
        opportunities: [...metric.opportunities]
            .sort(
                (a, b) =>
                    (b.estimatedSavingsMs ?? 0) - (a.estimatedSavingsMs ?? 0),
            )
            .slice(0, AI_INPUT_LIMITS.maximumOpportunitiesPerStrategy)
            .map((item) => ({
                auditId: item.auditId,
                title: item.title,
                priority: item.priority,
                estimatedSavingsMs: item.estimatedSavingsMs ?? null,
                estimatedSavingsBytes: item.estimatedSavingsBytes ?? null,
            })),
    };
}

export function extractDiscoveredPaths(crawl: SerializableCrawl): string[] {
    const paths = new Set<string>();

    for (const page of crawl.pageResults) {
        try {
            paths.add(new URL(page.url).pathname || "/");
        } catch {
            if (page.path) paths.add(page.path);
        }
    }

    for (const link of crawl.internalLinks.slice(0, 50)) {
        if (link.startsWith("/")) {
            paths.add(link);
            continue;
        }
        try {
            paths.add(new URL(link).pathname || "/");
        } catch {
            // ignore invalid URLs
        }
    }

    return [...paths];
}

export function buildAuditAnalysisInput(input: {
    website: SerializableWebsite;
    crawl: SerializableCrawl;
    niceGuyMetric: SerializableNiceGuyMetric;
    googleMetrics: SerializableGoogleMetric[];
    screenshots: SerializableScreenshot[];
}): AuditAnalysisInput {
    const pages = [...input.crawl.pageResults].sort((a, b) => {
        if (a.pageType === "home") return -1;
        if (b.pageType === "home") return 1;
        return 0;
    });

    const mobileMetric = input.googleMetrics.find(
        (metric) => metric.strategy === "mobile" && metric.status === "complete",
    );
    const desktopMetric = input.googleMetrics.find(
        (metric) => metric.strategy === "desktop" && metric.status === "complete",
    );

    const categories = CATEGORY_KEYS.map((key) => {
        const category = input.niceGuyMetric.categories[key];
        return {
            id: key,
            name: CATEGORY_LABELS[key],
            score: category.score,
            confidence: category.confidence,
            checks: selectChecks(category),
        };
    });

    const completeScreenshots = input.screenshots.filter(
        (screenshot) => screenshot.status === "complete",
    );

    return {
        website: {
            businessName: input.website.businessName || null,
            url: input.website.originalUrl,
            industry: input.website.industry || null,
            location: input.website.location || null,
        },
        crawl: {
            requestedUrl: input.crawl.requestedUrl,
            finalUrl: input.crawl.finalUrl || null,
            pageCount: input.crawl.pageResults.length,
            pages: pages.slice(0, AI_INPUT_LIMITS.maximumPagesSent).map((page) => ({
                pageType: page.pageType,
                url: page.url,
                title: page.title ?? null,
                metaDescription: page.metaDescription ?? null,
                headings: page.headings.map((heading) => heading.text).slice(0, 12),
                ctas: page.buttons.map((button) => button.text).filter(Boolean).slice(0, 12),
                formCount: page.forms.length,
                visibleTextExcerpt: truncateExcerpt(
                    page.visibleText ?? "",
                    page.pageType === "home"
                        ? AI_INPUT_LIMITS.homepageExcerptCharacters
                        : AI_INPUT_LIMITS.otherPageExcerptCharacters,
                ),
                error: page.errorMessage ?? null,
            })),
            contactEvidence: {
                phoneCount: input.crawl.phoneNumbersFound.length,
                emailCount: input.crawl.emailsFound.length,
                socialLinkCount: input.crawl.socialLinks.length,
                hasContactPage: input.crawl.hasContactPage,
                hasAboutPage: input.crawl.hasAboutPage,
                hasServicesPage: input.crawl.hasServicesPage,
            },
            discoveredPaths: extractDiscoveredPaths(input.crawl),
        },
        pagespeed: {
            mobile: buildPageSpeedStrategy(mobileMetric),
            desktop: buildPageSpeedStrategy(desktopMetric),
        },
        niceGuy: {
            scoringVersion: input.niceGuyMetric.scoringVersion,
            overallScore: input.niceGuyMetric.overallScore,
            categories,
        },
        screenshots: {
            available: completeScreenshots.length > 0,
            count: completeScreenshots.length,
            visuallyAnalyzed: false,
        },
    };
}

export function hasSufficientHeroContext(input: AuditAnalysisInput): boolean {
    const homepage = input.crawl.pages.find((page) => page.pageType === "home");
    const hasBusinessContext = Boolean(
        input.website.businessName?.trim() ||
            input.website.industry?.trim() ||
            homepage?.title?.trim() ||
            homepage?.visibleTextExcerpt.trim(),
    );
    return hasBusinessContext && input.crawl.pageCount > 0;
}
