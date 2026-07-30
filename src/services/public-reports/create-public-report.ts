import "server-only";

import { getAiSummaryById } from "@/src/data/ai-summaries";
import { createActivityLog } from "@/src/data/activity-logs";
import { getCrawlById } from "@/src/data/crawls";
import { getGoogleMetricsForCrawl } from "@/src/data/google-metrics";
import { getHeroSuggestionsForSummary } from "@/src/data/hero-suggestions";
import { getNiceGuyMetricById } from "@/src/data/niceguy-metrics";
import {
    createPublicReportDraft,
    getNextRevisionNumber,
} from "@/src/data/public-reports";
import { getScreenshotsForCrawl } from "@/src/data/screenshots";
import { getWebsiteById, updateWebsitePublicReportStatus } from "@/src/data/websites";
import { getAuditRunById } from "@/src/data/audit-runs";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import {
    buildPublicReportSnapshot,
    resolveHeroSelection,
    resolveScreenshotSelection,
} from "@/src/services/public-reports/build-public-report-snapshot";
import { sanitizeReportText } from "@/src/services/public-reports/screenshot-selection";
import {
    PublicReportValidationError,
    validatePublicReportSources,
} from "@/src/services/public-reports/validate-public-report-sources";
import type { PublicReportSettings } from "@/src/types/public-report";

export type CreatePublicReportResult =
    | {
          success: true;
          reportId: string;
          status: "draft";
          revisionNumber: number;
          message: string;
      }
    | {
          success: false;
          error: { code: string; message: string };
      };

function defaultTitle(businessName: string, domain: string): string {
    const label = businessName.trim() || domain;
    return `Website Audit for ${label}`;
}

export async function createPublicReport(input: {
    websiteId: string;
    crawlId: string;
    niceGuyMetricId: string;
    aiSummaryId: string;
    heroSuggestionIds?: string[];
    screenshotIds?: string[];
    title?: string;
    subtitle?: string;
    settings?: Partial<PublicReportSettings>;
}): Promise<CreatePublicReportResult> {
    try {
        const website = await getWebsiteById(input.websiteId);
        if (!website || website.deletedAt) {
            return {
                success: false,
                error: { code: "NOT_FOUND", message: "Website not found." },
            };
        }

        const [crawl, niceGuy, aiSummary] = await Promise.all([
            getCrawlById(input.crawlId),
            getNiceGuyMetricById(input.niceGuyMetricId),
            getAiSummaryById(input.aiSummaryId),
        ]);

        if (!crawl || !niceGuy || !aiSummary) {
            return {
                success: false,
                error: { code: "NOT_FOUND", message: "Required audit records were not found." },
            };
        }

        const pageSpeedRecords = await getGoogleMetricsForCrawl(input.crawlId);
        const pageSpeed = {
            mobile: pageSpeedRecords.find((metric) => metric.strategy === "mobile") ?? null,
            desktop: pageSpeedRecords.find((metric) => metric.strategy === "desktop") ?? null,
        };

        const [allScreenshots, allHeroes] = await Promise.all([
            getScreenshotsForCrawl(input.crawlId),
            getHeroSuggestionsForSummary(input.aiSummaryId),
        ]);

        const screenshots = resolveScreenshotSelection(allScreenshots, input.screenshotIds);
        const heroSuggestions = resolveHeroSelection(allHeroes, input.heroSuggestionIds);

        validatePublicReportSources({
            website,
            crawl,
            pageSpeed,
            niceGuy,
            aiSummary,
            heroSuggestions,
            screenshots,
        });

        const snapshot = buildPublicReportSnapshot({
            website,
            crawl,
            pageSpeed,
            niceGuy,
            aiSummary,
            screenshots,
            heroSuggestions,
            settings: input.settings,
        });

        const title = sanitizeReportText(
            input.title ?? defaultTitle(website.businessName, website.normalizedDomain),
            200,
        );
        const subtitle = input.subtitle
            ? sanitizeReportText(input.subtitle, 200)
            : "Prepared by Nice Guy Web Design";

        let revisionNumber = await getNextRevisionNumber(website.id);
        let report = null;
        const sourceAuditRunId = aiSummary.auditRunId ?? crawl.auditRunId ?? null;
        const sourceAuditRun = sourceAuditRunId
            ? await getAuditRunById(sourceAuditRunId)
            : null;

        for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
                report = await createPublicReportDraft({
                    websiteId: website.id,
                    crawlId: crawl.id,
                    niceGuyMetricId: niceGuy.id,
                    aiSummaryId: aiSummary.id,
                    auditRunId: aiSummary.auditRunId,
                    sourceAuditRunId,
                    sourceAuditNumber: sourceAuditRun?.auditNumber ?? null,
                    heroSuggestionIds: heroSuggestions.map((hero) => hero.id),
                    title,
                    subtitle,
                    settings: snapshot.settings,
                    branding: snapshot.branding,
                    sourceSnapshot: snapshot.sourceSnapshot,
                    revisionNumber,
                    createdBy: "admin",
                });
                break;
            } catch (error) {
                if (
                    typeof error === "object" &&
                    error !== null &&
                    "code" in error &&
                    (error as { code?: number }).code === 11000
                ) {
                    revisionNumber += 1;
                    continue;
                }
                throw error;
            }
        }

        if (!report) {
            return {
                success: false,
                error: {
                    code: "REVISION_CONFLICT",
                    message: "Unable to assign a report revision number. Please try again.",
                },
            };
        }

        if (sourceAuditRunId) {
            await registerAuditReference({
                auditRunId: sourceAuditRunId,
                resourceType: "public-report",
                resourceId: report.id,
            });
        }

        await updateWebsitePublicReportStatus(website.id, "draft", new Date());

        await createActivityLog({
            websiteId: website.id,
            type: "public-report-created",
            description: `Public report revision ${report.revisionNumber} created.`,
            actor: "admin",
            metadata: {
                publicReportId: report.id,
                revisionNumber: report.revisionNumber,
                status: report.status,
            },
        });

        return {
            success: true,
            reportId: report.id,
            status: "draft",
            revisionNumber: report.revisionNumber,
            message: "Public report draft created.",
        };
    } catch (error) {
        if (error instanceof PublicReportValidationError) {
            return {
                success: false,
                error: { code: error.code, message: error.message },
            };
        }
        console.error("createPublicReport failed:", error);
        return {
            success: false,
            error: {
                code: "CREATE_FAILED",
                message: "Unable to create the public report right now.",
            },
        };
    }
}
