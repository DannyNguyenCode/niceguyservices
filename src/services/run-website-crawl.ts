import "server-only";

import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { toSafePublicErrorMessage, validatePublicCrawlUrl } from "@/src/lib/validate-public-url";
import { createActivityLog } from "@/src/data/activity-logs";
import {
    completeCrawl,
    createCrawlRecord,
    failCrawl,
    hasActiveCrawlForWebsite,
    updateCrawlStatus,
} from "@/src/data/crawls";
import {
    completeScreenshotRecord,
    createScreenshotRecord,
    failScreenshotRecord,
} from "@/src/data/screenshots";
import { getWebsiteById, updateWebsiteCrawlStatus } from "@/src/data/websites";
import { getScreenshotStorage } from "@/src/services/cloudinary-screenshot-storage";
import { createAuditRun } from "@/src/services/audit-history/create-audit-run";
import { finalizeAuditRun, updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { updateAuditRunStatus } from "@/src/data/audit-runs";
import { capturePageScreenshots } from "@/src/services/screenshot-capture";
import { selectScreenshotPageTargets } from "@/src/services/screenshot-targets";
import { crawlWebsite } from "@/src/services/website-crawler";
import {
    calculateScreenshotCost,
    enforceAdministratorActionRateLimit,
} from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";
import type { ScreenshotType } from "@/src/schemas/enums";

export type RunWebsiteCrawlResult =
    | {
          ok: true;
          crawlId: string;
          message: string;
      }
    | {
          ok: false;
          message: string;
          code:
              | "invalid-id"
              | "not-found"
              | "duplicate"
              | "invalid-url"
              | "crawl-failed"
              | "database";
      };

const SCREENSHOT_SPECS: Array<{
    type: ScreenshotType;
    filename: string;
    viewport: { width: number; height: number; deviceScaleFactor: number };
}> = [
    {
        type: "desktop-viewport",
        filename: "desktop-viewport.png",
        viewport: CRAWL_CONFIG.desktopViewport,
    },
    {
        type: "desktop-full",
        filename: "desktop-full.png",
        viewport: CRAWL_CONFIG.desktopViewport,
    },
    {
        type: "mobile-viewport",
        filename: "mobile-viewport.png",
        viewport: CRAWL_CONFIG.mobileViewport,
    },
    {
        type: "mobile-full",
        filename: "mobile-full.png",
        viewport: CRAWL_CONFIG.mobileViewport,
    },
];

function screenshotTypeFromFilename(filename: string): ScreenshotType {
    if (filename.includes("desktop-full")) return "desktop-full";
    if (filename.includes("mobile-full")) return "mobile-full";
    if (filename.includes("mobile")) return "mobile-viewport";
    return "desktop-viewport";
}

function safeErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message.slice(0, 500);
    }
    return "The crawl could not be completed.";
}

export async function runWebsiteCrawl(
    websiteId: string,
    options?: RateLimitedServiceOptions & { policyId?: "crawl-start" | "audit-start" },
): Promise<RunWebsiteCrawlResult> {
    const website = await getWebsiteById(websiteId);
    if (!website) {
        return { ok: false, code: "not-found", message: "Website not found." };
    }

    if (await hasActiveCrawlForWebsite(websiteId)) {
        return {
            ok: false,
            code: "duplicate",
            message: "A crawl is already in progress for this website.",
        };
    }

    try {
        await validatePublicCrawlUrl(website.originalUrl);
    } catch (error) {
        return {
            ok: false,
            code: "invalid-url",
            message: toSafePublicErrorMessage(error),
        };
    }

    await enforceAdministratorActionRateLimit({
        policyId: options?.policyId ?? "crawl-start",
        websiteId,
        administratorIdentity: options?.administratorIdentity,
        internalWorker: options?.internalWorker,
    });
    await enforceAdministratorActionRateLimit({
        policyId: "screenshot-start",
        websiteId,
        cost: calculateScreenshotCost(12),
        administratorIdentity: options?.administratorIdentity,
        internalWorker: options?.internalWorker,
    });

    const auditRun = await createAuditRun({
        websiteId,
        trigger: { type: "administrator", actorId: null, actorName: null },
    });

    await updateAuditRunStatus(auditRun.id, "crawling", { startedAt: new Date() });
    await updateAuditRunStage(auditRun.id, "crawl", "running", "crawling");

    const crawl = await createCrawlRecord({
        websiteId,
        requestedUrl: website.originalUrl,
        status: "queued",
        auditRunId: auditRun.id,
    });

    await registerAuditReference({
        auditRunId: auditRun.id,
        resourceType: "crawl-data",
        resourceId: crawl.id,
    });

    await createActivityLog({
        websiteId,
        crawlId: crawl.id,
        auditRunId: auditRun.id,
        type: "crawl-queued",
        description: `Crawl queued for ${website.originalUrl}.`,
        actor: "admin",
    });

    await updateWebsiteCrawlStatus(websiteId, "processing");

    await updateCrawlStatus(crawl.id, "processing", {
        startedAt: new Date(),
        errorMessage: null,
    });

    await createActivityLog({
        websiteId,
        crawlId: crawl.id,
        type: "crawl-started",
        description: "Website crawl started.",
        actor: "admin",
    });

    try {
        const crawlResult = await crawlWebsite({
            websiteId,
            requestedUrl: website.originalUrl,
            maxPages: CRAWL_CONFIG.maxPages,
            maxDepth: CRAWL_CONFIG.maxDepth,
        });

        for (const pageResult of crawlResult.pageResults) {
            await createActivityLog({
                websiteId,
                crawlId: crawl.id,
                type: "crawl-page-completed",
                description: `Crawled ${pageResult.pageType} page at ${pageResult.path}.`,
                actor: "system",
                metadata: {
                    pageType: pageResult.pageType,
                    statusCode: pageResult.statusCode ?? null,
                    errorMessage: pageResult.errorMessage ?? null,
                },
            });
        }

        const screenshotTargets = selectScreenshotPageTargets(crawlResult.pageResults);
        const storage = getScreenshotStorage();

        for (const target of screenshotTargets) {
            let captured;
            try {
                captured = await capturePageScreenshots({
                    url: target.url,
                    slug: target.slug,
                    includeFullPage: target.slug === "home",
                });
            } catch (error) {
                const message = safeErrorMessage(error);
                await createActivityLog({
                    websiteId,
                    crawlId: crawl.id,
                    auditRunId: auditRun.id,
                    type: "screenshot-failed",
                    description: `Screenshot capture failed for ${target.slug}.`,
                    actor: "system",
                    metadata: { pageSlug: target.slug, errorMessage: message },
                });
                continue;
            }

            for (const shot of captured.shots) {
                const spec =
                    SCREENSHOT_SPECS.find((item) => item.type === screenshotTypeFromFilename(shot.filename)) ??
                    SCREENSHOT_SPECS[0];

                const record = await createScreenshotRecord({
                    websiteId,
                    crawlId: crawl.id,
                    auditRunId: auditRun.id,
                    type: spec.type,
                    pageType: target.pageType,
                    pageUrl: target.url,
                    viewport: spec.viewport,
                });

                try {
                    const saved = await storage.save({
                        websiteId,
                        auditRunId: auditRun.id,
                        crawlId: crawl.id,
                        filename: shot.filename,
                        buffer: shot.buffer,
                    });

                    await completeScreenshotRecord(record.id, {
                        storageType: saved.storageType,
                        filePath: saved.filePath,
                        publicUrl: saved.publicUrl,
                        cloudinaryPublicId: saved.cloudinaryPublicId,
                        cloudinaryAssetId: saved.cloudinaryAssetId,
                        cloudinaryVersion: saved.cloudinaryVersion,
                        secureUrl: saved.secureUrl,
                        width: saved.width,
                        height: saved.height,
                        format: saved.format,
                        fileSizeBytes: saved.fileSizeBytes,
                    });

                    await registerAuditReference({
                        auditRunId: auditRun.id,
                        resourceType: "screenshot",
                        resourceId: record.id,
                    });

                    await createActivityLog({
                        websiteId,
                        crawlId: crawl.id,
                        auditRunId: auditRun.id,
                        type: "screenshot-created",
                        description: `${shot.filename} uploaded.`,
                        actor: "system",
                        metadata: { screenshotType: spec.type, pageSlug: target.slug },
                    });
                } catch (error) {
                    const message = safeErrorMessage(error);
                    await failScreenshotRecord(record.id, message);
                    await createActivityLog({
                        websiteId,
                        crawlId: crawl.id,
                        auditRunId: auditRun.id,
                        type: "screenshot-failed",
                        description: `${shot.filename} upload failed.`,
                        actor: "system",
                        metadata: { screenshotType: spec.type, pageSlug: target.slug, errorMessage: message },
                    });
                }
            }
        }

        await completeCrawl(crawl.id, {
            requestedUrl: crawlResult.requestedUrl,
            finalUrl: crawlResult.finalUrl,
            homepageTitle: crawlResult.homepageTitle,
            metaDescription: crawlResult.metaDescription,
            language: crawlResult.language,
            pagesDiscovered: crawlResult.pagesDiscovered,
            pagesCrawled: crawlResult.pagesCrawled,
            internalLinks: crawlResult.internalLinks,
            externalLinks: crawlResult.externalLinks,
            emailsFound: crawlResult.emailsFound,
            phoneNumbersFound: crawlResult.phoneNumbersFound,
            socialLinks: crawlResult.socialLinks,
            hasAboutPage: crawlResult.hasAboutPage,
            hasContactPage: crawlResult.hasContactPage,
            hasServicesPage: crawlResult.hasServicesPage,
            hasPrivacyPolicy: crawlResult.hasPrivacyPolicy,
            hasTerms: crawlResult.hasTerms,
            pageResults: crawlResult.pageResults,
            crawlDurationMs: crawlResult.crawlDurationMs,
            errorMessage: null,
        });

        await updateWebsiteCrawlStatus(websiteId, "complete");

        await updateAuditRunStage(auditRun.id, "crawl", "complete", "collecting-screenshots");
        await updateAuditRunStage(auditRun.id, "screenshots", "complete", "collecting-pagespeed");

        await createActivityLog({
            websiteId,
            crawlId: crawl.id,
            auditRunId: auditRun.id,
            type: "crawl-completed",
            description: `Crawl completed with ${crawlResult.pagesCrawled} pages.`,
            actor: "system",
        });

        return {
            ok: true,
            crawlId: crawl.id,
            message: "Website crawl completed successfully.",
        };
    } catch (error) {
        const message = safeErrorMessage(error);
        console.error("Website crawl failed:", error);

        await failCrawl(crawl.id, message);
        await updateWebsiteCrawlStatus(websiteId, "failed");
        await updateAuditRunStage(auditRun.id, "crawl", "failed");
        try {
            await finalizeAuditRun({ auditRunId: auditRun.id });
        } catch (finalizeError) {
            console.error("Audit finalization after crawl failure:", finalizeError);
        }
        await createActivityLog({
            websiteId,
            crawlId: crawl.id,
            auditRunId: auditRun.id,
            type: "crawl-failed",
            description: "Website crawl failed.",
            actor: "system",
            metadata: { errorMessage: message },
        });

        return {
            ok: false,
            code: "crawl-failed",
            message,
        };
    }
}
