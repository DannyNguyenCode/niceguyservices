import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SerializableWebsite } from "../src/data/websites";
import { buildScreenshotThumbnailUrl } from "../src/lib/cloudinary-screenshot-url";
import { toWebsiteListViewModel } from "../src/lib/website-list-view-model";

describe("website list view model", () => {
    it("normalizes website records for responsive list rendering", () => {
        const viewModel = toWebsiteListViewModel({
            id: "abc123",
            businessName: "Nice Guy Web Design",
            normalizedDomain: "niceguyservices.vercel.app",
            originalUrl: "https://niceguyservices.vercel.app/",
            businessEmail: "hello@example.com",
            industry: "Web Design",
            location: "Toronto",
            source: "manual-prospect-research",
            status: "ready",
            auditStatus: "complete",
            crawlStatus: "complete",
            pageSpeedStatus: "complete",
            latestPageSpeedRunAt: null,
            niceGuyStatus: "complete",
            latestNiceGuyRunAt: null,
            aiAnalysisStatus: "complete",
            latestAiAnalysisRunAt: null,
            demoStatus: "none",
            outreachStatus: "not-contacted",
            publicReportStatus: "draft",
            latestPublicReportAt: null,
            latestPublishedReportAt: null,
            pdfReportStatus: "not-generated",
            latestPdfReportAt: null,
            outreachDraftStatus: "not-generated",
            latestOutreachDraftAt: null,
            demoProjectStatus: "not-created",
            latestDemoAt: null,
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-02T00:00:00.000Z",
            deletedAt: null,
        } satisfies SerializableWebsite);

        assert.equal(viewModel.businessLabel, "Nice Guy Web Design");
        assert.equal(viewModel.normalizedDomain, "niceguyservices.vercel.app");
        assert.match(viewModel.updatedAtLabel, /2026/);
    });
});

describe("cloudinary screenshot thumbnails", () => {
    it("adds a transformation segment for Cloudinary URLs", () => {
        const url = buildScreenshotThumbnailUrl(
            "https://res.cloudinary.com/demo/image/upload/v123/audit/desktop.png",
        );
        assert.match(url, /c_limit,w_640,h_480,q_auto,f_auto/);
    });

    it("returns the original URL for non-Cloudinary hosts", () => {
        const original = "https://example.com/screenshot.png";
        assert.equal(buildScreenshotThumbnailUrl(original), original);
    });
});
