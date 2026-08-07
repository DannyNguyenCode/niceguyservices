import "server-only";

import { buildCheckLabelMap, formatCheckLabels } from "@/lib/websiteAudit/ai-format";
import {
    countChecksByStatus,
    formatCategoryLabel,
    groupRecommendations,
} from "@/lib/websiteAudit/niceguy-format";
import { scorePresentationLabel } from "@/src/config/niceguy-scoring";
import type { NiceGuyCategoryKey } from "@/src/config/niceguy-scoring";
import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableHeroSuggestion } from "@/src/data/hero-suggestions";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import {
    DEFAULT_PUBLIC_REPORT_SETTINGS,
    MAX_PUBLIC_HERO_SUGGESTIONS,
    MAX_PUBLIC_SCREENSHOTS,
} from "@/src/lib/public-report-config";
import {
    isScreenshotEligibleForPublic,
    selectDefaultScreenshotIds,
} from "@/src/services/public-reports/screenshot-selection";
import type {
    PublicReportBranding,
    PublicReportSettings,
    PublicReportSourceSnapshot,
} from "@/src/types/public-report";

function labMetricValue(
    value: { value?: number | null } | number | null | undefined,
): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;
    return value.value ?? null;
}

function mapPageSpeedStrategy(metric: SerializableGoogleMetric | null) {
    if (!metric || metric.status !== "complete") return null;
    return {
        performance: metric.scores.performance ?? null,
        accessibility: metric.scores.accessibility ?? null,
        bestPractices: metric.scores.bestPractices ?? null,
        seo: metric.scores.seo ?? null,
        lcp: labMetricValue(metric.labMetrics.largestContentfulPaint),
        cls: labMetricValue(metric.labMetrics.cumulativeLayoutShift),
        tbt: labMetricValue(metric.labMetrics.totalBlockingTime),
        fcp: labMetricValue(metric.labMetrics.firstContentfulPaint),
        speedIndex: labMetricValue(metric.labMetrics.speedIndex),
        fetchTime: metric.fetchTime,
        lighthouseVersion: metric.lighthouseVersion,
    };
}

function buildNiceGuySnapshot(metric: SerializableNiceGuyMetric): PublicReportSourceSnapshot["niceGuy"] {
    const categories = (Object.keys(metric.categories) as NiceGuyCategoryKey[]).map((key) => {
        const category = metric.categories[key];
        return {
            id: key,
            name: formatCategoryLabel(key),
            score: category.score,
            confidence: category.confidence,
            scoreLabel: scorePresentationLabel(category.score),
            passedChecks: countChecksByStatus(category, "passed"),
            partialChecks: countChecksByStatus(category, "partial"),
            failedChecks: countChecksByStatus(category, "failed"),
            unavailableChecks: countChecksByStatus(category, "unavailable"),
        };
    });

    const strongestEntry = (Object.entries(metric.categories) as Array<
        [NiceGuyCategoryKey, (typeof metric.categories)[NiceGuyCategoryKey]]
    >).reduce<[NiceGuyCategoryKey, (typeof metric.categories)[NiceGuyCategoryKey]] | null>(
        (best, entry) => {
            if (!best) return entry;
            return entry[1].score > best[1].score ? entry : best;
        },
        null,
    );
    const weakestEntry = (Object.entries(metric.categories) as Array<
        [NiceGuyCategoryKey, (typeof metric.categories)[NiceGuyCategoryKey]]
    >).reduce<[NiceGuyCategoryKey, (typeof metric.categories)[NiceGuyCategoryKey]] | null>(
        (worst, entry) => {
            if (!worst) return entry;
            return entry[1].score < worst[1].score ? entry : worst;
        },
        null,
    );
    const overallConfidence = Math.round(
        categories.reduce((sum, category) => sum + category.confidence, 0) / categories.length,
    );

    const recommendations = groupRecommendations(metric.categories).map((item, index) => {
        const categoryKey = (Object.keys(metric.categories) as NiceGuyCategoryKey[]).find(
            (key) => formatCategoryLabel(key) === item.category,
        );
        return {
            checkId: `rec-${index}`,
            categoryId: categoryKey ?? "unknown",
            categoryName: item.category,
            priority: item.priority,
            title: item.title,
            description: item.description,
        };
    });

    return {
        id: metric.id,
        scoringVersion: metric.scoringVersion,
        overallScore: metric.overallScore,
        overallConfidence,
        scoreLabel: scorePresentationLabel(metric.overallScore),
        strongestCategory: strongestEntry
            ? {
                  id: strongestEntry[0],
                  name: formatCategoryLabel(strongestEntry[0]),
                  score: strongestEntry[1].score,
              }
            : null,
        weakestCategory: weakestEntry
            ? {
                  id: weakestEntry[0],
                  name: formatCategoryLabel(weakestEntry[0]),
                  score: weakestEntry[1].score,
              }
            : null,
        categories,
        deterministicRecommendations: recommendations,
    };
}

function buildAiSnapshot(
    summary: SerializableAiSummary,
    labelMap: Map<string, string>,
): PublicReportSourceSnapshot["ai"] {
    const mapEvidence = (ids: string[]) =>
        formatCheckLabels(ids, labelMap)
            .split(", ")
            .filter((label) => label.length > 0);

    return {
        id: summary.id,
        analysisVersion: summary.analysisVersion,
        promptVersion: summary.promptVersion,
        executiveSummary: summary.executiveSummary,
        businessImpactSummary: summary.businessImpactSummary,
        strengths: summary.strengths.map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category ?? null,
            evidenceLabels: mapEvidence(item.evidenceCheckIds ?? []),
        })),
        weaknesses: summary.weaknesses.map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category ?? null,
            priority: item.priority,
            evidenceLabels: mapEvidence(item.evidenceCheckIds ?? []),
        })),
        quickWins: summary.quickWins.map((item) => ({
            title: item.title,
            description: item.description,
            expectedImpact: item.expectedImpact,
            relativeEffort: item.estimatedEffort,
            category: item.category ?? null,
            evidenceLabels: mapEvidence(item.evidenceCheckIds ?? []),
        })),
        longTermRecommendations: summary.longTermRecommendations.map((item) => ({
            title: item.title,
            description: item.description,
            priority: item.priority,
            relativeEffort: item.estimatedEffort,
            category: item.category ?? null,
            evidenceLabels: mapEvidence(item.evidenceCheckIds ?? []),
        })),
        priorityOrder: summary.priorityOrder.map((item) => ({
            rank: item.rank,
            title: item.title,
            reason: item.reason,
            priority: item.priority,
            evidenceLabels: mapEvidence(item.evidenceCheckIds ?? []),
        })),
        homepageChanges: summary.homepageChanges
            ? {
                  summary: summary.homepageChanges.summary,
                  priorityChanges: summary.homepageChanges.priorityChanges.map((item) => ({
                      title: item.title,
                      priority: item.priority,
                      category: item.category,
                      problem: item.problem,
                      recommendation: item.recommendation,
                      expectedImpact: item.expectedImpact,
                      evidence: item.evidence,
                  })),
              }
            : null,
        disclaimers: summary.disclaimers,
    };
}

function buildScreenshotSnapshot(
    screenshots: SerializableScreenshot[],
    businessName: string,
): PublicReportSourceSnapshot["screenshots"] {
    return screenshots.map((shot) => {
        const viewportLabel = shot.type.includes("mobile") ? "Mobile" : "Desktop";
        return {
            screenshotId: shot.id,
            pageType: shot.pageType,
            pageUrl: shot.pageUrl,
            viewport: viewportLabel,
            width: shot.width,
            height: shot.height,
            secureUrl: shot.secureUrl,
            thumbnailUrl: shot.secureUrl,
            altText: `${viewportLabel} screenshot of the ${shot.pageType} page for ${businessName}`,
            capturedAt: shot.generatedAt,
        };
    });
}

function buildHeroSnapshot(
    heroes: SerializableHeroSuggestion[],
): PublicReportSourceSnapshot["heroSuggestions"] {
    return heroes.map((hero) => ({
        suggestionId: hero.id,
        optionNumber: hero.optionNumber,
        conceptName: hero.conceptName,
        headline: hero.headline,
        supportingCopy: hero.supportingCopy,
        primaryCta: hero.primaryCta,
        secondaryCta: hero.secondaryCta,
        trustSupport: hero.trustSupport,
        designDirection: hero.designDirection,
        rationale: hero.rationale,
        problemsAddressed: hero.targetProblems,
        constraints: hero.constraints,
    }));
}

export function buildPublicReportSnapshot(input: {
    website: SerializableWebsite;
    crawl: SerializableCrawl;
    pageSpeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
    niceGuy: SerializableNiceGuyMetric;
    aiSummary: SerializableAiSummary;
    screenshots: SerializableScreenshot[];
    heroSuggestions: SerializableHeroSuggestion[];
    settings?: Partial<PublicReportSettings>;
    preparedBy?: string;
    preparedByUrl?: string | null;
}): {
    settings: PublicReportSettings;
    branding: PublicReportBranding;
    sourceSnapshot: PublicReportSourceSnapshot;
} {
    const settings: PublicReportSettings = {
        ...DEFAULT_PUBLIC_REPORT_SETTINGS,
        ...input.settings,
    };

    const businessName = input.website.businessName?.trim() || input.website.normalizedDomain;
    const branding: PublicReportBranding = {
        businessName: input.website.businessName || null,
        websiteUrl: input.website.originalUrl,
        normalizedDomain: input.website.normalizedDomain,
        industry: input.website.industry || null,
        location: input.website.location || null,
        reportPreparedBy: input.preparedBy ?? "Nice Guy Web Design",
        reportPreparedByUrl: input.preparedByUrl ?? getPreparedByUrl(),
        logoUrl: null,
        accentStyle: null,
    };

    const successfulPages = input.crawl.pageResults.filter(
        (page) => (page.statusCode ?? 200) < 400 && !page.errorMessage,
    );
    const failedPages = input.crawl.pageResults.filter(
        (page) => (page.statusCode ?? 0) >= 400 || Boolean(page.errorMessage),
    );

    const labelMap = buildCheckLabelMap(input.niceGuy);

    const sourceSnapshot: PublicReportSourceSnapshot = {
        crawl: {
            id: input.crawl.id,
            status: input.crawl.status,
            completedAt: input.crawl.completedAt,
            pageCount: input.crawl.pagesCrawled,
            successfulPageCount: successfulPages.length,
            failedPageCount: failedPages.length,
            version: null,
        },
        pageSpeed: {
            mobileAvailable: input.pageSpeed.mobile?.status === "complete",
            desktopAvailable: input.pageSpeed.desktop?.status === "complete",
            mobile: mapPageSpeedStrategy(input.pageSpeed.mobile),
            desktop: mapPageSpeedStrategy(input.pageSpeed.desktop),
        },
        niceGuy: buildNiceGuySnapshot(input.niceGuy),
        ai: buildAiSnapshot(input.aiSummary, labelMap),
        screenshots: settings.showScreenshots
            ? buildScreenshotSnapshot(input.screenshots, businessName)
            : [],
        heroSuggestions: settings.showHeroSuggestions
            ? buildHeroSnapshot(input.heroSuggestions)
            : [],
    };

    return { settings, branding, sourceSnapshot };
}

export function resolveScreenshotSelection(
    allScreenshots: SerializableScreenshot[],
    requestedIds?: string[],
): SerializableScreenshot[] {
    const crawlScreenshots = allScreenshots.filter(isScreenshotEligibleForPublic);
    const ids =
        requestedIds && requestedIds.length > 0
            ? requestedIds
            : selectDefaultScreenshotIds(crawlScreenshots, MAX_PUBLIC_SCREENSHOTS);

    const selected = ids
        .map((id) => crawlScreenshots.find((shot) => shot.id === id))
        .filter((shot): shot is SerializableScreenshot => Boolean(shot));

    return selected.slice(0, MAX_PUBLIC_SCREENSHOTS);
}

export function resolveHeroSelection(
    allHeroes: SerializableHeroSuggestion[],
    requestedIds?: string[],
): SerializableHeroSuggestion[] {
    const eligible = allHeroes.filter((hero) => hero.status !== "rejected");
    if (requestedIds && requestedIds.length > 0) {
        return requestedIds
            .map((id) => eligible.find((hero) => hero.id === id))
            .filter((hero): hero is SerializableHeroSuggestion => Boolean(hero))
            .slice(0, MAX_PUBLIC_HERO_SUGGESTIONS);
    }

    const selected = eligible.filter((hero) => hero.status === "selected");
    if (selected.length > 0) {
        return selected.slice(0, MAX_PUBLIC_HERO_SUGGESTIONS);
    }

    return [];
}

function getPreparedByUrl(): string | null {
    const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    return base || null;
}
