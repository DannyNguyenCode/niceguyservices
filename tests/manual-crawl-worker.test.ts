import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { MANUAL_CRAWL_AUDIT_CONFIGURATION } from "@/src/services/audit-pipeline/manual-crawl-configuration";
import { evaluateRequiredScreenshots } from "@/src/services/screenshots/required-screenshots";
import type { SerializableScreenshot } from "@/src/data/screenshots";

function shot(
    partial: Partial<SerializableScreenshot> & Pick<SerializableScreenshot, "type" | "status">,
): SerializableScreenshot {
    return {
        id: partial.id ?? "shot-1",
        websiteId: "site-1",
        crawlId: "crawl-1",
        type: partial.type,
        pageType: "home",
        pageUrl: "https://example.com",
        viewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
        storageType: "cloudinary",
        filePath: "",
        publicUrl: partial.publicUrl ?? "",
        cloudinaryPublicId: "",
        cloudinaryAssetId: "",
        cloudinaryVersion: null,
        secureUrl: partial.secureUrl ?? "",
        width: null,
        height: null,
        format: "png",
        fileSizeBytes: null,
        status: partial.status,
        errorMessage: partial.errorMessage ?? null,
        visualStability: null,
        generatedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

describe("manual crawl configuration", () => {
    it("limits the durable job to crawl + screenshots", () => {
        assert.equal(MANUAL_CRAWL_AUDIT_CONFIGURATION.includeScreenshots, true);
        assert.equal(MANUAL_CRAWL_AUDIT_CONFIGURATION.includePageSpeed, false);
        assert.equal(MANUAL_CRAWL_AUDIT_CONFIGURATION.includeNiceGuyMetrics, false);
        assert.equal(MANUAL_CRAWL_AUDIT_CONFIGURATION.includeAiAnalysis, false);
        assert.equal(MANUAL_CRAWL_AUDIT_CONFIGURATION.generateReportDraft, false);
    });
});

describe("required screenshot evaluation", () => {
    it("marks the stage complete only when desktop and mobile usable screenshots exist", () => {
        assert.equal(evaluateRequiredScreenshots([]).complete, false);

        assert.equal(
            evaluateRequiredScreenshots([
                shot({
                    type: "desktop-viewport",
                    status: "complete",
                    secureUrl: "https://cdn/d.png",
                }),
            ]).complete,
            false,
        );

        assert.equal(
            evaluateRequiredScreenshots([
                shot({
                    type: "desktop-viewport",
                    status: "complete",
                    secureUrl: "https://cdn/d.png",
                }),
                shot({
                    type: "mobile-viewport",
                    status: "complete",
                    secureUrl: "https://cdn/m.png",
                }),
            ]).complete,
            true,
        );
    });

    it("keeps a successful desktop when mobile fails", () => {
        const result = evaluateRequiredScreenshots([
            shot({
                type: "desktop-viewport",
                status: "complete",
                secureUrl: "https://cdn/d.png",
            }),
            shot({ type: "mobile-viewport", status: "failed", errorMessage: "timeout" }),
        ]);
        assert.equal(result.hasDesktop, true);
        assert.equal(result.hasMobile, false);
        assert.equal(result.complete, false);
        assert.deepEqual(result.missing, ["mobile"]);
    });

    it("treats zero usable screenshots as incomplete, not complete", () => {
        const result = evaluateRequiredScreenshots([
            shot({ type: "desktop-viewport", status: "failed", errorMessage: "boom" }),
            shot({ type: "mobile-viewport", status: "complete", secureUrl: "" }),
        ]);
        assert.equal(result.complete, false);
        assert.deepEqual(result.missing, ["desktop", "mobile"]);
    });
});

describe("manual crawl worker wiring", () => {
    it("routes Run Crawl through startAuditJob with forceAsync in production async mode", async () => {
        const source = await readFile(
            path.join(process.cwd(), "src/services/run-website-crawl.ts"),
            "utf8",
        );
        assert.match(source, /startAuditJob/);
        assert.match(source, /MANUAL_CRAWL_AUDIT_CONFIGURATION/);
        assert.match(source, /forceAsync/);
        assert.match(source, /MANUAL_CRAWL_ACCEPTED/);
        assert.equal(/createCrawlRecord/.test(source), false);
        assert.equal(/executeWebsiteCrawlWork/.test(source), false);
    });

    it("reuses active jobs and does not leave orphan queued CrawlData from the action", async () => {
        const source = await readFile(
            path.join(process.cwd(), "src/services/run-website-crawl.ts"),
            "utf8",
        );
        const startSource = await readFile(
            path.join(process.cwd(), "src/services/audit-pipeline/start-audit-job.ts"),
            "utf8",
        );
        assert.match(source, /reused/);
        assert.match(startSource, /getActiveAuditJobForWebsite|getAuditJobByIdempotencyKey/);
        assert.match(startSource, /scheduleAuditWorkerKick/);
    });

    it("surfaces start failures safely without inventing undefined reasons", async () => {
        const source = await readFile(
            path.join(process.cwd(), "src/services/run-website-crawl.ts"),
            "utf8",
        );
        assert.match(source, /StartAuditJobError/);
        assert.match(source, /MANUAL_CRAWL_START_FAILED|MANUAL_CRAWL_UNEXPECTED_FAILURE/);
        assert.match(source, /error\.message/);
    });
});

describe("screenshot capture semantics", () => {
    it("requires desktop + mobile before marking screenshots complete", async () => {
        const crawlWork = await readFile(
            path.join(process.cwd(), "src/services/audit-jobs/execute-crawl-work.ts"),
            "utf8",
        );
        const stage = await readFile(
            path.join(process.cwd(), "src/services/audit-pipeline/run-audit-stage.ts"),
            "utf8",
        );
        assert.match(crawlWork, /evaluateRequiredScreenshots/);
        assert.match(crawlWork, /ScreenshotStageError/);
        assert.match(crawlWork, /getCompleteScreenshotForCrawlType/);
        assert.match(crawlWork, /CLOUDINARY_UPLOAD_FAILED/);
        assert.match(crawlWork, /required\.complete/);
        assert.match(stage, /SCREENSHOTS_MISSING|SCREENSHOTS_INCOMPLETE|SCREENSHOTS_FAILED/);
        const screenshotsCase = stage.split('case "screenshots"')[1]?.slice(0, 1500) ?? "";
        assert.match(screenshotsCase, /status: "failed"/);
        assert.equal(/completed_with_warnings/.test(screenshotsCase), false);
    });

    it("treats configured screenshots as a required pipeline stage", async () => {
        const { isStageRequired, getStageDependencies } = await import(
            "@/src/services/audit-pipeline/stage-plan"
        );
        const configuration = {
            crawlMaxPages: 10,
            crawlMaxDepth: 2,
            includeScreenshots: true,
            includePageSpeed: false,
            includeNiceGuyMetrics: false,
            includeAiAnalysis: false,
            generateReportDraft: false,
            pageSpeedStrategies: [] as Array<"mobile" | "desktop">,
            configurationVersion: "audit-config-v1",
        };
        assert.equal(isStageRequired("screenshots", configuration), true);
        assert.deepEqual(getStageDependencies("finalize", configuration), [
            "crawl",
            "screenshots",
        ]);
    });
});
