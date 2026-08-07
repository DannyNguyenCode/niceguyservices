import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VISUAL_STABILITY_CONFIG } from "@/src/services/visual-stability/constants";
import {
    evaluateStabilitySequence,
    isPresentationReadySample,
    layoutsMatch,
    samplesAreVisuallyStable,
} from "@/src/services/visual-stability/sample-compare";
import type { VisualStabilitySample } from "@/src/services/visual-stability/types";

function sample(overrides?: Partial<VisualStabilitySample>): VisualStabilitySample {
    const baseLayout = {
        scrollWidth: 1440,
        scrollHeight: 2000,
        clientWidth: 1440,
        clientHeight: 1000,
        boxesKey: "0:0:1440:400:SECTION",
    };
    return {
        readyState: "complete",
        fontsReady: true,
        fontsSupported: true,
        unfinishedFiniteAnimations: 0,
        infiniteAnimations: 0,
        visibleImagesTotal: 1,
        visibleImagesPending: 0,
        sampledAtMs: 0,
        ...overrides,
        layout: {
            ...baseLayout,
            ...overrides?.layout,
        },
    };
}

describe("visual stability configuration", () => {
    it("uses production-safe bounded defaults", () => {
        assert.equal(VISUAL_STABILITY_CONFIG.enabled, true);
        assert.ok(VISUAL_STABILITY_CONFIG.maxWaitMs <= 5_000);
        assert.ok(VISUAL_STABILITY_CONFIG.maxWaitMs >= 3_000);
        assert.ok(VISUAL_STABILITY_CONFIG.windowMs >= 500);
        assert.ok(VISUAL_STABILITY_CONFIG.sampleMs >= 100);
        assert.ok(VISUAL_STABILITY_CONFIG.windowMs < VISUAL_STABILITY_CONFIG.maxWaitMs);
    });
});

describe("visual stability sample comparison", () => {
    it("treats already-stable samples as presentation-ready", () => {
        assert.equal(
            isPresentationReadySample(sample(), {
                fontsBudgetExhausted: false,
                imagesBudgetExhausted: false,
            }),
            true,
        );
    });

    it("waits for finite entrance animations", () => {
        assert.equal(
            isPresentationReadySample(
                sample({ unfinishedFiniteAnimations: 3 }),
                { fontsBudgetExhausted: true, imagesBudgetExhausted: true },
            ),
            false,
        );
    });

    it("tolerates infinite animations / spinners / carousels", () => {
        assert.equal(
            isPresentationReadySample(
                sample({ infiniteAnimations: 5, unfinishedFiniteAnimations: 0 }),
                { fontsBudgetExhausted: false, imagesBudgetExhausted: false },
            ),
            true,
        );
    });

    it("requires layout stability across samples", () => {
        const a = sample({ layout: { boxesKey: "a", scrollWidth: 1440, scrollHeight: 2000, clientWidth: 1440, clientHeight: 1000 } });
        const b = sample({ layout: { boxesKey: "b", scrollWidth: 1440, scrollHeight: 2100, clientWidth: 1440, clientHeight: 1000 } });
        assert.equal(layoutsMatch(a.layout, b.layout, 2), false);
        assert.equal(
            samplesAreVisuallyStable(a, b, 2, {
                fontsBudgetExhausted: true,
                imagesBudgetExhausted: true,
            }),
            false,
        );
    });

    it("allows tiny layout jitter within tolerance", () => {
        const a = sample({
            layout: {
                boxesKey: "same",
                scrollWidth: 1440,
                scrollHeight: 2000,
                clientWidth: 1440,
                clientHeight: 1000,
            },
        });
        const b = sample({
            layout: {
                boxesKey: "same",
                scrollWidth: 1441,
                scrollHeight: 2001,
                clientWidth: 1440,
                clientHeight: 1000,
            },
        });
        assert.equal(layoutsMatch(a.layout, b.layout, 2), true);
    });

    it("does not permanently block on fonts after soft budget", () => {
        const pendingFonts = sample({ fontsReady: false, fontsSupported: true });
        assert.equal(
            isPresentationReadySample(pendingFonts, {
                fontsBudgetExhausted: false,
                imagesBudgetExhausted: false,
            }),
            false,
        );
        assert.equal(
            isPresentationReadySample(pendingFonts, {
                fontsBudgetExhausted: true,
                imagesBudgetExhausted: false,
            }),
            true,
        );
    });

    it("does not permanently block on slow viewport images after soft budget", () => {
        const pendingImages = sample({ visibleImagesPending: 2, visibleImagesTotal: 2 });
        assert.equal(
            isPresentationReadySample(pendingImages, {
                fontsBudgetExhausted: true,
                imagesBudgetExhausted: false,
            }),
            false,
        );
        assert.equal(
            isPresentationReadySample(pendingImages, {
                fontsBudgetExhausted: true,
                imagesBudgetExhausted: true,
            }),
            true,
        );
    });

    it("resolves a quickly-stable sequence without requiring max wait", () => {
        const samples = [0, 150, 300, 450, 600, 750, 900].map((t) =>
            sample({ sampledAtMs: t }),
        );
        const result = evaluateStabilitySequence({
            samples,
            sampleMs: 150,
            windowMs: 700,
            maxWaitMs: 4000,
            softResourceBudgetMs: 1500,
            layoutTolerancePx: 2,
        });
        assert.equal(result.stabilized, true);
        assert.equal(result.timedOut, false);
        assert.equal(result.reason, "stable");
        assert.ok(result.samplesNeeded < samples.length || result.samplesNeeded >= 5);
    });

    it("times out when layout never settles (continuous mutation)", () => {
        const samples = Array.from({ length: 20 }, (_, i) =>
            sample({
                sampledAtMs: i * 150,
                layout: {
                    boxesKey: `mut-${i}`,
                    scrollWidth: 1440,
                    scrollHeight: 2000 + i * 10,
                    clientWidth: 1440,
                    clientHeight: 1000,
                },
            }),
        );
        const result = evaluateStabilitySequence({
            samples,
            sampleMs: 150,
            windowMs: 700,
            maxWaitMs: 4000,
            softResourceBudgetMs: 1500,
            layoutTolerancePx: 2,
        });
        assert.equal(result.stabilized, false);
        assert.equal(result.timedOut, true);
        assert.equal(result.reason, "timeout");
    });

    it("times out when a finite animation never finishes (broken animation)", () => {
        const samples = Array.from({ length: 20 }, (_, i) =>
            sample({
                sampledAtMs: i * 150,
                unfinishedFiniteAnimations: 1,
            }),
        );
        const result = evaluateStabilitySequence({
            samples,
            sampleMs: 150,
            windowMs: 700,
            maxWaitMs: 4000,
            softResourceBudgetMs: 1500,
            layoutTolerancePx: 2,
        });
        assert.equal(result.stabilized, false);
        assert.equal(result.timedOut, true);
    });

    it("allows finite animation to finish then stabilize", () => {
        const samples = [
            sample({ sampledAtMs: 0, unfinishedFiniteAnimations: 2 }),
            sample({ sampledAtMs: 150, unfinishedFiniteAnimations: 1 }),
            sample({ sampledAtMs: 300, unfinishedFiniteAnimations: 0 }),
            sample({ sampledAtMs: 450, unfinishedFiniteAnimations: 0 }),
            sample({ sampledAtMs: 600, unfinishedFiniteAnimations: 0 }),
            sample({ sampledAtMs: 750, unfinishedFiniteAnimations: 0 }),
            sample({ sampledAtMs: 900, unfinishedFiniteAnimations: 0 }),
            sample({ sampledAtMs: 1050, unfinishedFiniteAnimations: 0 }),
        ];
        const result = evaluateStabilitySequence({
            samples,
            sampleMs: 150,
            windowMs: 700,
            maxWaitMs: 4000,
            softResourceBudgetMs: 1500,
            layoutTolerancePx: 2,
        });
        assert.equal(result.stabilized, true);
        assert.equal(result.reason, "stable");
    });

    it("does not hang forever on infinite spinner / carousel motion alone", () => {
        const samples = Array.from({ length: 10 }, (_, i) =>
            sample({
                sampledAtMs: i * 150,
                infiniteAnimations: 3,
                unfinishedFiniteAnimations: 0,
            }),
        );
        const result = evaluateStabilitySequence({
            samples,
            sampleMs: 150,
            windowMs: 700,
            maxWaitMs: 4000,
            softResourceBudgetMs: 1500,
            layoutTolerancePx: 2,
        });
        assert.equal(result.stabilized, true);
        assert.equal(result.timedOut, false);
    });
});

describe("screenshot capture source contracts", () => {
    it("applies visual stability in screenshot capture, not crawl measurement path", async () => {
        const { readFile } = await import("node:fs/promises");
        const path = await import("node:path");
        const screenshotSource = await readFile(
            path.join(process.cwd(), "src/services/screenshot-capture.ts"),
            "utf8",
        );
        const crawlSource = await readFile(
            path.join(process.cwd(), "src/services/website-crawler.ts"),
            "utf8",
        );
        const pagespeedSource = await readFile(
            path.join(process.cwd(), "src/services/run-pagespeed-analysis.ts"),
            "utf8",
        );
        const niceguySource = await readFile(
            path.join(process.cwd(), "src/services/run-niceguy-analysis.ts"),
            "utf8",
        ).catch(() => "");

        assert.match(screenshotSource, /waitForVisualStability/);
        assert.match(screenshotSource, /prepareLazyLoadedVisualContent/);
        assert.equal(/waitForVisualStability/.test(crawlSource), false);
        assert.equal(/animation:\s*none|transition:\s*none|finish\(\)/i.test(screenshotSource), false);
        assert.equal(/waitForVisualStability/.test(pagespeedSource), false);
        assert.equal(/waitForVisualStability/.test(niceguySource), false);
    });

    it("keeps stabilization failure from failing the crawl loop", async () => {
        const { readFile } = await import("node:fs/promises");
        const path = await import("node:path");
        const crawlWork = await readFile(
            path.join(process.cwd(), "src/services/audit-jobs/execute-crawl-work.ts"),
            "utf8",
        );
        assert.match(crawlWork, /visualStability/);
        assert.match(crawlWork, /capturePageScreenshots/);
        // Capture errors are logged and continued — not thrown to abort crawl.
        assert.match(crawlWork, /screenshot-failed|continue/);
    });

    it("does not share screenshot stabilization with PageSpeed entrypoints", async () => {
        const { readFile } = await import("node:fs/promises");
        const path = await import("node:path");
        const stageSource = await readFile(
            path.join(process.cwd(), "src/services/audit-pipeline/run-audit-stage.ts"),
            "utf8",
        );
        assert.equal(/waitForVisualStability/.test(stageSource), false);
    });
});
