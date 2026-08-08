import "server-only";

import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { createActivityLog } from "@/src/data/activity-logs";
import {
    completeCrawl,
    failCrawl,
    getCrawlById,
    touchCrawlHeartbeat,
    updateCrawlStatus,
} from "@/src/data/crawls";
import {
    completeScreenshotRecord,
    createScreenshotRecord,
    failScreenshotRecord,
    getCompleteScreenshotForCrawlType,
    getScreenshotsForCrawl,
} from "@/src/data/screenshots";
import { getWebsiteById, updateWebsiteCrawlStatus } from "@/src/data/websites";
import { getAuditOperationFlags } from "@/src/config/app-env";
import { getScreenshotStorage } from "@/src/services/cloudinary-screenshot-storage";
import { finalizeAuditRun, updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { capturePageScreenshots } from "@/src/services/screenshot-capture";
import { selectScreenshotPageTargets } from "@/src/services/screenshot-targets";
import { evaluateRequiredScreenshots } from "@/src/services/screenshots/required-screenshots";
import { crawlWebsite } from "@/src/services/website-crawler";
import type { ScreenshotType } from "@/src/schemas/enums";

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

export type ExecuteCrawlWorkOptions = {
    includeScreenshots?: boolean;
    crawlMaxPages?: number;
    crawlMaxDepth?: number;
    managedByPipeline?: boolean;
};

export class ScreenshotStageError extends Error {
    readonly code: string;
    readonly retryable: boolean;

    constructor(code: string, message: string, retryable = true) {
        super(message);
        this.name = "ScreenshotStageError";
        this.code = code;
        this.retryable = retryable;
    }
}

export async function executeWebsiteCrawlWork(
    crawlId: string,
    options?: ExecuteCrawlWorkOptions,
): Promise<void> {
    const crawl = await getCrawlById(crawlId);
    if (!crawl) {
        throw new Error("CRAWL_NOT_FOUND");
    }

    const website = await getWebsiteById(crawl.websiteId);
    if (!website) {
        throw new Error("WEBSITE_NOT_FOUND");
    }

    const auditRunId = crawl.auditRunId ?? null;
    const flags = getAuditOperationFlags();
    const includeScreenshots = options?.includeScreenshots ?? true;
    const managedByPipeline = options?.managedByPipeline ?? false;
    const maxPages = options?.crawlMaxPages ?? CRAWL_CONFIG.maxPages;
    const maxDepth = options?.crawlMaxDepth ?? CRAWL_CONFIG.maxDepth;
    const screenshotsEnabled =
        includeScreenshots && flags.screenshotEnabled && flags.cloudinaryUploadsEnabled;

    await updateCrawlStatus(crawl.id, "processing", {
        startedAt: new Date(),
        heartbeatAt: new Date(),
        errorMessage: null,
    });
    await updateWebsiteCrawlStatus(website.id, "processing");

    if (auditRunId) {
        await updateAuditRunStage(auditRunId, "crawl", "running", "crawling");
        if (includeScreenshots) {
            await updateAuditRunStage(auditRunId, "screenshots", "running", "collecting-screenshots");
        }
    }

    console.info("[crawl-work] CRAWL_STARTED", {
        websiteId: website.id,
        auditRunId,
        crawlId: crawl.id,
        includeScreenshots,
        screenshotsEnabled,
        managedByPipeline,
    });

    await createActivityLog({
        websiteId: website.id,
        crawlId: crawl.id,
        auditRunId,
        type: "crawl-started",
        description: "Website crawl started.",
        actor: "system",
    });

    try {
        await touchCrawlHeartbeat(crawl.id);
        const crawlResult = await crawlWebsite({
            websiteId: website.id,
            requestedUrl: crawl.requestedUrl || website.originalUrl,
            maxPages,
            maxDepth,
        });

        for (const pageResult of crawlResult.pageResults) {
            await createActivityLog({
                websiteId: website.id,
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

        let screenshotFailureCode: string | null = null;
        let screenshotFailureMessage: string | null = null;

        if (includeScreenshots && !flags.screenshotEnabled) {
            screenshotFailureCode = "SCREENSHOTS_DISABLED";
            screenshotFailureMessage = "Screenshot capture is disabled in this environment.";
            console.info("[crawl-work] SCREENSHOT_VIEWPORT_SKIPPED", {
                websiteId: website.id,
                crawlId: crawl.id,
                reason: screenshotFailureCode,
            });
        } else if (includeScreenshots && !flags.cloudinaryUploadsEnabled) {
            screenshotFailureCode = "CLOUDINARY_DISABLED";
            screenshotFailureMessage = "Cloudinary uploads are disabled; screenshots cannot be stored.";
            console.info("[crawl-work] SCREENSHOT_VIEWPORT_SKIPPED", {
                websiteId: website.id,
                crawlId: crawl.id,
                reason: screenshotFailureCode,
            });
        } else if (screenshotsEnabled) {
            const screenshotTargets = selectScreenshotPageTargets(crawlResult.pageResults);
            const storage = getScreenshotStorage();

            for (const target of screenshotTargets) {
                await touchCrawlHeartbeat(crawl.id);
                let captured;
                try {
                    console.info("[crawl-work] SCREENSHOT_VIEWPORT_STARTED", {
                        websiteId: website.id,
                        crawlId: crawl.id,
                        auditRunId,
                        pageSlug: target.slug,
                    });
                    captured = await capturePageScreenshots({
                        url: target.url,
                        slug: target.slug,
                        includeFullPage: target.slug === "home",
                    });
                } catch (error) {
                    const message = safeErrorMessage(error);
                    console.error("[crawl-work] SCREENSHOT_VIEWPORT_FAILED", {
                        websiteId: website.id,
                        crawlId: crawl.id,
                        auditRunId,
                        pageSlug: target.slug,
                        errorCode: "SCREENSHOT_CAPTURE_FAILED",
                        message,
                    });
                    await createActivityLog({
                        websiteId: website.id,
                        crawlId: crawl.id,
                        auditRunId,
                        type: "screenshot-failed",
                        description: `Screenshot capture failed for ${target.slug}.`,
                        actor: "system",
                        metadata: {
                            pageSlug: target.slug,
                            errorCode: "SCREENSHOT_CAPTURE_FAILED",
                            errorMessage: message,
                        },
                    });
                    screenshotFailureCode = screenshotFailureCode ?? "SCREENSHOT_CAPTURE_FAILED";
                    screenshotFailureMessage =
                        screenshotFailureMessage ??
                        `Screenshot capture failed for ${target.slug}.`;
                    continue;
                }

                for (const shot of captured.shots) {
                    const spec =
                        SCREENSHOT_SPECS.find(
                            (item) => item.type === screenshotTypeFromFilename(shot.filename),
                        ) ?? SCREENSHOT_SPECS[0];

                    const existing = await getCompleteScreenshotForCrawlType(crawl.id, spec.type);
                    if (existing) {
                        console.info("[crawl-work] SCREENSHOT_VIEWPORT_REUSED", {
                            websiteId: website.id,
                            crawlId: crawl.id,
                            screenshotId: existing.id,
                            viewport: spec.type,
                        });
                        continue;
                    }

                    const record = await createScreenshotRecord({
                        websiteId: website.id,
                        crawlId: crawl.id,
                        auditRunId,
                        type: spec.type,
                        pageType: target.pageType,
                        pageUrl: target.url,
                        viewport: spec.viewport,
                    });

                    try {
                        const saved = await storage.save({
                            websiteId: website.id,
                            auditRunId: auditRunId || crawl.id,
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
                            visualStability: {
                                attempted: shot.visualStability.attempted,
                                stabilized: shot.visualStability.stabilized,
                                timedOut: shot.visualStability.timedOut,
                                reason: shot.visualStability.reason,
                                elapsedMs: shot.visualStability.elapsedMs,
                                samples: shot.visualStability.samples,
                                unfinishedFiniteAnimations:
                                    shot.visualStability.unfinishedFiniteAnimations,
                                infiniteAnimations: shot.visualStability.infiniteAnimations,
                            },
                        });

                        if (auditRunId) {
                            await registerAuditReference({
                                auditRunId,
                                resourceType: "screenshot",
                                resourceId: record.id,
                            });
                        }

                        console.info("[crawl-work] SCREENSHOT_VIEWPORT_COMPLETED", {
                            websiteId: website.id,
                            crawlId: crawl.id,
                            auditRunId,
                            screenshotId: record.id,
                            viewport: spec.type,
                            pageSlug: target.slug,
                        });

                        await createActivityLog({
                            websiteId: website.id,
                            crawlId: crawl.id,
                            auditRunId,
                            type: "screenshot-created",
                            description: `${shot.filename} uploaded.`,
                            actor: "system",
                            metadata: { screenshotType: spec.type, pageSlug: target.slug },
                        });
                    } catch (error) {
                        const message = safeErrorMessage(error);
                        console.error("[crawl-work] CLOUDINARY_UPLOAD_FAILED", {
                            websiteId: website.id,
                            crawlId: crawl.id,
                            auditRunId,
                            screenshotId: record.id,
                            viewport: spec.type,
                            errorCode: "CLOUDINARY_UPLOAD_FAILED",
                            message,
                        });
                        await failScreenshotRecord(record.id, message);
                        screenshotFailureCode = "CLOUDINARY_UPLOAD_FAILED";
                        screenshotFailureMessage = message;
                        await createActivityLog({
                            websiteId: website.id,
                            crawlId: crawl.id,
                            auditRunId,
                            type: "screenshot-failed",
                            description: `${shot.filename} upload failed.`,
                            actor: "system",
                            metadata: {
                                screenshotType: spec.type,
                                pageSlug: target.slug,
                                errorCode: "CLOUDINARY_UPLOAD_FAILED",
                                errorMessage: message,
                            },
                        });
                    }
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

        await updateWebsiteCrawlStatus(website.id, "complete");

        if (auditRunId) {
            await updateAuditRunStage(
                auditRunId,
                "crawl",
                "complete",
                managedByPipeline ? undefined : "collecting-screenshots",
            );
        }

        console.info("[crawl-work] CRAWL_COMPLETED", {
            websiteId: website.id,
            auditRunId,
            crawlId: crawl.id,
            pagesCrawled: crawlResult.pagesCrawled,
        });

        await createActivityLog({
            websiteId: website.id,
            crawlId: crawl.id,
            auditRunId,
            type: "crawl-completed",
            description: `Crawl completed with ${crawlResult.pagesCrawled} pages.`,
            actor: "system",
        });

        if (includeScreenshots) {
            const screenshots = await getScreenshotsForCrawl(crawl.id);
            const required = evaluateRequiredScreenshots(screenshots);

            if (required.complete) {
                if (auditRunId) {
                    await updateAuditRunStage(
                        auditRunId,
                        "screenshots",
                        "complete",
                        managedByPipeline ? undefined : "collecting-pagespeed",
                    );
                }
                console.info("[crawl-work] SCREENSHOTS_STAGE_COMPLETE", {
                    websiteId: website.id,
                    auditRunId,
                    crawlId: crawl.id,
                });
            } else {
                const errorCode =
                    screenshotFailureCode ??
                    (required.missing.length === 2
                        ? "SCREENSHOTS_MISSING"
                        : "SCREENSHOTS_INCOMPLETE");
                const errorMessage =
                    screenshotFailureMessage ??
                    `Required screenshots missing: ${required.missing.join(", ")}.`;

                if (auditRunId) {
                    await updateAuditRunStage(auditRunId, "screenshots", "failed");
                }

                console.error("[crawl-work] SCREENSHOTS_STAGE_FAILED", {
                    websiteId: website.id,
                    auditRunId,
                    crawlId: crawl.id,
                    errorCode,
                    missing: required.missing,
                    hasDesktop: required.hasDesktop,
                    hasMobile: required.hasMobile,
                });

                throw new ScreenshotStageError(errorCode, errorMessage, true);
            }
        }
    } catch (error) {
        if (error instanceof ScreenshotStageError) {
            // Crawl data is already complete; screenshots failed separately.
            throw error;
        }

        const message = safeErrorMessage(error);
        console.error("[crawl-work] CRAWL_FAILED", {
            websiteId: website.id,
            auditRunId,
            crawlId: crawl.id,
            message,
        });

        await failCrawl(crawl.id, message);
        await updateWebsiteCrawlStatus(website.id, "failed");
        if (auditRunId) {
            await updateAuditRunStage(auditRunId, "crawl", "failed");
            if (includeScreenshots) {
                await updateAuditRunStage(auditRunId, "screenshots", "failed");
            }
            if (!managedByPipeline) {
                try {
                    await finalizeAuditRun({ auditRunId });
                } catch (finalizeError) {
                    console.error("Audit finalization after crawl failure:", finalizeError);
                }
            }
        }
        await createActivityLog({
            websiteId: website.id,
            crawlId: crawl.id,
            auditRunId,
            type: "crawl-failed",
            description: "Website crawl failed.",
            actor: "system",
            metadata: { errorMessage: message },
        });
        throw error;
    }
}
