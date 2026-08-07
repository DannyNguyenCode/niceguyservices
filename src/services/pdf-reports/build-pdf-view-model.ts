import "server-only";

import type { HomepageChanges } from "@/src/services/cursor-analysis/schemas";
import {
    fetchPdfImageSource,
    type PdfImageSource,
} from "@/src/services/pdf-reports/fetch-pdf-image";
import { PdfStageError } from "@/src/services/pdf-reports/pdf-stage-error";
import type { SerializablePublicReport } from "@/src/types/public-report";

export type PdfPriority = "high" | "medium" | "low";

export type PdfMetricRow = {
    label: string;
    value: string;
};

export type PdfPageSpeedStrategyView = {
    label: string;
    available: boolean;
    metrics: PdfMetricRow[];
};

export type PdfCategoryScore = {
    name: string;
    score: number;
    scoreLabel: string;
};

export type PdfFindingItem = {
    title: string;
    description: string;
    category?: string | null;
    priority?: PdfPriority;
};

export type PdfActionItem = {
    rank?: number;
    title: string;
    reason: string;
    priority: PdfPriority;
};

export type AuditPdfViewModel = {
    title: string;
    subtitle: string | null;
    businessName: string;
    websiteUrl: string;
    domain: string;
    preparedBy: string;
    auditDateLabel: string;
    overallScore: number | null;
    overallScoreLabel: string | null;
    executiveSummary: string;
    businessImpactSummary: string;
    desktopScreenshot: PdfImageSource | null;
    mobileScreenshot: PdfImageSource | null;
    homepageChanges: HomepageChanges | null;
    pageSpeed: {
        mobile: PdfPageSpeedStrategyView;
        desktop: PdfPageSpeedStrategyView;
    };
    uxCategories: PdfCategoryScore[];
    uxRecommendations: Array<{
        title: string;
        description: string;
        priority: PdfPriority;
        categoryName: string;
    }>;
    seoFindings: PdfFindingItem[];
    accessibilityFindings: PdfFindingItem[];
    strengths: PdfFindingItem[];
    weaknesses: PdfFindingItem[];
    priorityPlan: PdfActionItem[];
    disclaimers: string[];
};

function formatDate(iso: string | null | undefined): string {
    if (!iso) return "Date unavailable";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatMs(value: number | null | undefined): string | null {
    if (value == null || !Number.isFinite(value)) return null;
    if (value >= 1000) return `${(value / 1000).toFixed(1)} s`;
    return `${Math.round(value)} ms`;
}

function formatCls(value: number | null | undefined): string | null {
    if (value == null || !Number.isFinite(value)) return null;
    return value.toFixed(3);
}

function formatScore(value: number | null | undefined): string | null {
    if (value == null || !Number.isFinite(value)) return null;
    return String(Math.round(value));
}

function buildStrategyMetrics(
    strategy:
        | NonNullable<
              SerializablePublicReport["sourceSnapshot"]["pageSpeed"]["mobile"]
          >
        | null
        | undefined,
): PdfMetricRow[] {
    if (!strategy) return [];
    const rows: Array<[string, string | null]> = [
        ["Performance", formatScore(strategy.performance)],
        ["LCP", formatMs(strategy.lcp)],
        ["CLS", formatCls(strategy.cls)],
        ["TBT", formatMs(strategy.tbt)],
        ["FCP", formatMs(strategy.fcp)],
        ["Speed Index", formatMs(strategy.speedIndex)],
        ["Accessibility", formatScore(strategy.accessibility)],
        ["SEO", formatScore(strategy.seo)],
        ["Best Practices", formatScore(strategy.bestPractices)],
    ];
    return rows
        .filter((entry): entry is [string, string] => Boolean(entry[1]))
        .map(([label, value]) => ({ label, value }));
}

function isSeoCategory(category: string | null | undefined): boolean {
    if (!category) return false;
    return /seo|search|meta|index/i.test(category);
}

function isAccessibilityCategory(category: string | null | undefined): boolean {
    if (!category) return false;
    return /accessib|a11y|contrast|aria|usability/i.test(category);
}

function pickHomepageScreenshots(
    screenshots: SerializablePublicReport["sourceSnapshot"]["screenshots"],
): {
    desktop: (typeof screenshots)[number] | null;
    mobile: (typeof screenshots)[number] | null;
} {
    const home = screenshots.filter((shot) => shot.pageType === "home");
    const desktop =
        home.find((shot) => /desktop/i.test(shot.viewport)) ??
        screenshots.find((shot) => /desktop/i.test(shot.viewport)) ??
        null;
    const mobile =
        home.find((shot) => /mobile/i.test(shot.viewport)) ??
        screenshots.find((shot) => /mobile/i.test(shot.viewport)) ??
        null;
    return { desktop, mobile };
}

export async function buildAuditPdfViewModel(input: {
    report: SerializablePublicReport;
    attemptId: string;
}): Promise<AuditPdfViewModel> {
    const { report } = input;
    const snapshot = report.sourceSnapshot;

    if (!snapshot) {
        throw new PdfStageError("PDF_DATA_INVALID", "DATA_LOAD", {
            message: "Public report snapshot is missing.",
        });
    }

    if (!snapshot.ai?.executiveSummary?.trim()) {
        throw new PdfStageError("PDF_DATA_INVALID", "DATA_LOAD", {
            message: "Public report is missing an executive summary.",
        });
    }

    const { desktop, mobile } = pickHomepageScreenshots(snapshot.screenshots ?? []);

    const [desktopScreenshot, mobileScreenshot] = await Promise.all([
        fetchPdfImageSource({
            url: desktop?.secureUrl,
            width: desktop?.width,
            height: desktop?.height,
            attemptId: input.attemptId,
            label: "desktop-homepage",
        }),
        fetchPdfImageSource({
            url: mobile?.secureUrl,
            width: mobile?.width,
            height: mobile?.height,
            attemptId: input.attemptId,
            label: "mobile-homepage",
        }),
    ]);

    const weaknesses = snapshot.ai.weaknesses ?? [];
    const seoFindings = weaknesses
        .filter((item) => isSeoCategory(item.category))
        .map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            priority: item.priority,
        }));
    const accessibilityFindings = weaknesses
        .filter((item) => isAccessibilityCategory(item.category))
        .map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            priority: item.priority,
        }));

    // If category filters yield nothing, include PageSpeed SEO/a11y score context via empty arrays —
    // sections will render score metrics instead.

    return {
        title: report.title,
        subtitle: report.subtitle,
        businessName:
            report.branding.businessName?.trim() ||
            report.branding.normalizedDomain ||
            "Website",
        websiteUrl: report.branding.websiteUrl,
        domain: report.branding.normalizedDomain || report.branding.websiteUrl,
        preparedBy: report.branding.reportPreparedBy || "Nice Guy Web Design",
        auditDateLabel: formatDate(
            (snapshot as { capturedAt?: string }).capturedAt ?? report.createdAt,
        ),
        overallScore: snapshot.niceGuy?.overallScore ?? null,
        overallScoreLabel: snapshot.niceGuy?.scoreLabel ?? null,
        executiveSummary: snapshot.ai.executiveSummary,
        businessImpactSummary: snapshot.ai.businessImpactSummary ?? "",
        desktopScreenshot,
        mobileScreenshot,
        homepageChanges: snapshot.ai.homepageChanges ?? null,
        pageSpeed: {
            mobile: {
                label: "Mobile",
                available: Boolean(snapshot.pageSpeed?.mobileAvailable && snapshot.pageSpeed.mobile),
                metrics: buildStrategyMetrics(snapshot.pageSpeed?.mobile),
            },
            desktop: {
                label: "Desktop",
                available: Boolean(
                    snapshot.pageSpeed?.desktopAvailable && snapshot.pageSpeed.desktop,
                ),
                metrics: buildStrategyMetrics(snapshot.pageSpeed?.desktop),
            },
        },
        uxCategories: (snapshot.niceGuy?.categories ?? []).map((category) => ({
            name: category.name,
            score: category.score,
            scoreLabel: category.scoreLabel,
        })),
        uxRecommendations: (snapshot.niceGuy?.deterministicRecommendations ?? [])
            .slice(0, 8)
            .map((item) => ({
                title: item.title,
                description: item.description,
                priority: item.priority,
                categoryName: item.categoryName,
            })),
        seoFindings,
        accessibilityFindings,
        strengths: (snapshot.ai.strengths ?? []).map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
        })),
        weaknesses: weaknesses.map((item) => ({
            title: item.title,
            description: item.description,
            category: item.category,
            priority: item.priority,
        })),
        priorityPlan: (snapshot.ai.priorityOrder ?? []).map((item) => ({
            rank: item.rank,
            title: item.title,
            reason: item.reason,
            priority: item.priority,
        })),
        disclaimers: snapshot.ai.disclaimers ?? [],
    };
}
