import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    buildCloudinaryScreenshotFolder,
    buildCloudinaryScreenshotPublicId,
    sanitizeScreenshotFilename,
} from "@/src/lib/cloudinary-screenshot-path";
import { InvalidObjectIdError, ScreenshotPathError } from "@/src/lib/errors/audit-platform-error";
import {
    isWebsiteAuditLandingPath,
    screenshotFilenameForTarget,
    selectScreenshotPageTargets,
} from "@/src/services/screenshot-targets";
import { validateScreenshotSaveInput } from "@/src/lib/cloudinary-screenshot-path";
import { VALID_OBJECT_ID, VALID_OBJECT_ID_2 } from "./helpers";

describe("Phase 4 — Screenshots and Cloudinary", () => {
    describe("Cloudinary path building", () => {
        it("builds audit-run scoped folders", () => {
            const folder = buildCloudinaryScreenshotFolder({
                folderPrefix: "nice-guy-web-design/audits/development",
                websiteId: VALID_OBJECT_ID,
                auditRunId: VALID_OBJECT_ID_2,
            });
            assert.equal(
                folder,
                `nice-guy-web-design/audits/development/${VALID_OBJECT_ID}/${VALID_OBJECT_ID_2}`,
            );
        });

        it("rejects invalid MongoDB IDs", () => {
            assert.throws(
                () =>
                    buildCloudinaryScreenshotFolder({
                        folderPrefix: "prefix",
                        websiteId: "bad-id",
                        auditRunId: VALID_OBJECT_ID_2,
                    }),
                InvalidObjectIdError,
            );
        });

        it("sanitizes unsafe filename characters", () => {
            const filename = sanitizeScreenshotFilename("home/desktop viewport!.png");
            assert.equal(filename, "home-desktop-viewport-");
        });

        it("builds unique public IDs per audit run", () => {
            const first = buildCloudinaryScreenshotPublicId({
                folderPrefix: "audits/dev",
                websiteId: VALID_OBJECT_ID,
                auditRunId: VALID_OBJECT_ID,
                filename: "home-desktop-viewport.png",
            });
            const second = buildCloudinaryScreenshotPublicId({
                folderPrefix: "audits/dev",
                websiteId: VALID_OBJECT_ID,
                auditRunId: VALID_OBJECT_ID_2,
                filename: "home-desktop-viewport.png",
            });
            assert.notEqual(first.publicId, second.publicId);
        });
    });

    describe("screenshot target selection", () => {
        it("selects home, contact, and website audit pages", () => {
            const targets = selectScreenshotPageTargets([
                {
                    url: "https://example.com/",
                    path: "/",
                    pageType: "home",
                    headings: [],
                    buttons: [],
                    forms: [],
                    images: [],
                },
                {
                    url: "https://example.com/contact",
                    path: "/contact",
                    pageType: "contact",
                    headings: [],
                    buttons: [],
                    forms: [],
                    images: [],
                },
                {
                    url: "https://example.com/work/website-audit",
                    path: "/work/website-audit",
                    pageType: "other",
                    headings: [],
                    buttons: [],
                    forms: [],
                    images: [],
                },
            ]);
            assert.deepEqual(
                targets.map((target) => target.slug),
                ["home", "contact", "website-audit"],
            );
        });

        it("skips failed crawl pages", () => {
            const targets = selectScreenshotPageTargets([
                {
                    url: "https://example.com/contact",
                    path: "/contact",
                    pageType: "contact",
                    headings: [],
                    buttons: [],
                    forms: [],
                    images: [],
                    errorMessage: "Timeout",
                },
            ]);
            assert.equal(targets.length, 0);
        });

        it("keeps desktop and mobile filenames separate", () => {
            assert.equal(
                screenshotFilenameForTarget("contact", "desktop"),
                "contact-desktop-viewport.png",
            );
            assert.equal(
                screenshotFilenameForTarget("contact", "mobile"),
                "contact-mobile-viewport.png",
            );
        });

        it("detects website audit landing paths", () => {
            assert.equal(isWebsiteAuditLandingPath("/work/website-audit"), true);
            assert.equal(isWebsiteAuditLandingPath("/about"), false);
        });
    });

    describe("save input validation", () => {
        it("rejects empty image buffers", () => {
            assert.throws(
                () =>
                    validateScreenshotSaveInput({
                        websiteId: VALID_OBJECT_ID,
                        auditRunId: VALID_OBJECT_ID_2,
                        crawlId: VALID_OBJECT_ID,
                        filename: "home-desktop-viewport.png",
                        buffer: Buffer.alloc(0),
                    }),
                ScreenshotPathError,
            );
        });

        it("rejects blank filenames", () => {
            assert.throws(
                () =>
                    validateScreenshotSaveInput({
                        websiteId: VALID_OBJECT_ID,
                        auditRunId: VALID_OBJECT_ID_2,
                        crawlId: VALID_OBJECT_ID,
                        filename: "   ",
                        buffer: Buffer.from("png"),
                    }),
                ScreenshotPathError,
            );
        });
    });
});
