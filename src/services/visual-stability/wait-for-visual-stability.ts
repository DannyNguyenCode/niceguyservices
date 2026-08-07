import "server-only";

import type { Page } from "playwright-core";
import { VISUAL_STABILITY_CONFIG } from "@/src/services/visual-stability/constants";
import { collectVisualStabilitySample } from "@/src/services/visual-stability/collect-sample";
import { samplesAreVisuallyStable } from "@/src/services/visual-stability/sample-compare";
import type {
    VisualStabilityGateState,
    VisualStabilityResult,
    VisualStabilitySample,
} from "@/src/services/visual-stability/types";

export type WaitForVisualStabilityOptions = {
    enabled?: boolean;
    maxWaitMs?: number;
    windowMs?: number;
    sampleMs?: number;
    softResourceBudgetMs?: number;
    layoutTolerancePx?: number;
    /** Logging context only. */
    contextLabel?: string;
};

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function emptyResult(
    overrides: Partial<VisualStabilityResult> & Pick<VisualStabilityResult, "reason">,
): VisualStabilityResult {
    return {
        attempted: false,
        stabilized: false,
        timedOut: false,
        elapsedMs: 0,
        samples: 0,
        unfinishedFiniteAnimations: 0,
        infiniteAnimations: 0,
        fontsReady: false,
        visibleImagesPending: 0,
        ...overrides,
    };
}

/**
 * Best-effort, bounded wait for the page's initial presentation to settle.
 * Never throws for timeout — callers should capture screenshots regardless.
 */
export async function waitForVisualStability(
    page: Page,
    options: WaitForVisualStabilityOptions = {},
): Promise<VisualStabilityResult> {
    const enabled = options.enabled ?? VISUAL_STABILITY_CONFIG.enabled;
    if (!enabled) {
        return emptyResult({ attempted: false, reason: "disabled", stabilized: true });
    }

    const maxWaitMs = options.maxWaitMs ?? VISUAL_STABILITY_CONFIG.maxWaitMs;
    const windowMs = options.windowMs ?? VISUAL_STABILITY_CONFIG.windowMs;
    const sampleMs = options.sampleMs ?? VISUAL_STABILITY_CONFIG.sampleMs;
    const softResourceBudgetMs =
        options.softResourceBudgetMs ?? VISUAL_STABILITY_CONFIG.softResourceBudgetMs;
    const layoutTolerancePx =
        options.layoutTolerancePx ?? VISUAL_STABILITY_CONFIG.layoutTolerancePx;
    const requiredConsecutive = Math.max(2, Math.ceil(windowMs / sampleMs) + 1);
    const label = options.contextLabel ?? "screenshot";

    console.info("[visual-stability] VISUAL_STABILITY_STARTED", {
        context: label,
        maxWaitMs,
        windowMs,
        sampleMs,
    });

    const started = Date.now();
    let samples = 0;
    let streak = 1;
    let previous: VisualStabilitySample | null = null;
    let last: VisualStabilitySample | null = null;

    try {
        if (page.isClosed()) {
            return emptyResult({
                attempted: true,
                reason: "page-error",
                timedOut: false,
            });
        }

        // Kick fonts.ready with a budget; do not await forever.
        await Promise.race([
            page.evaluate(async () => {
                const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
                if (fonts && typeof fonts.ready?.then === "function") {
                    await fonts.ready;
                }
            }),
            sleep(VISUAL_STABILITY_CONFIG.fontBudgetMs),
        ]).catch(() => undefined);

        while (Date.now() - started < maxWaitMs) {
            if (page.isClosed()) {
                return emptyResult({
                    attempted: true,
                    reason: "page-error",
                    elapsedMs: Date.now() - started,
                    samples,
                });
            }

            const elapsed = Date.now() - started;
            const gates: VisualStabilityGateState = {
                fontsBudgetExhausted: elapsed >= softResourceBudgetMs,
                imagesBudgetExhausted: elapsed >= softResourceBudgetMs,
            };

            let sample: VisualStabilitySample;
            try {
                sample = await collectVisualStabilitySample(page);
                sample.sampledAtMs = elapsed;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                if (/Target closed|Execution context was destroyed|navigat/i.test(message)) {
                    return emptyResult({
                        attempted: true,
                        reason: "navigation",
                        elapsedMs: Date.now() - started,
                        samples,
                    });
                }
                return emptyResult({
                    attempted: true,
                    reason: "page-error",
                    elapsedMs: Date.now() - started,
                    samples,
                });
            }

            samples += 1;
            last = sample;

            if (previous) {
                if (samplesAreVisuallyStable(previous, sample, layoutTolerancePx, gates)) {
                    streak += 1;
                    if (streak >= requiredConsecutive) {
                        const result: VisualStabilityResult = {
                            attempted: true,
                            stabilized: true,
                            timedOut: false,
                            reason: "stable",
                            elapsedMs: Date.now() - started,
                            samples,
                            unfinishedFiniteAnimations: sample.unfinishedFiniteAnimations,
                            infiniteAnimations: sample.infiniteAnimations,
                            fontsReady: sample.fontsReady,
                            visibleImagesPending: sample.visibleImagesPending,
                        };
                        console.info("[visual-stability] VISUAL_STABILITY_REACHED", {
                            context: label,
                            elapsedMs: result.elapsedMs,
                            samples: result.samples,
                            infiniteAnimations: result.infiniteAnimations,
                        });
                        return result;
                    }
                } else {
                    streak = 1;
                }
            }

            previous = sample;
            const remaining = maxWaitMs - (Date.now() - started);
            if (remaining <= 0) break;
            await sleep(Math.min(sampleMs, remaining));
        }

        const result: VisualStabilityResult = {
            attempted: true,
            stabilized: false,
            timedOut: true,
            reason: "timeout",
            elapsedMs: Date.now() - started,
            samples,
            unfinishedFiniteAnimations: last?.unfinishedFiniteAnimations ?? 0,
            infiniteAnimations: last?.infiniteAnimations ?? 0,
            fontsReady: last?.fontsReady ?? false,
            visibleImagesPending: last?.visibleImagesPending ?? 0,
        };
        console.info("[visual-stability] VISUAL_STABILITY_TIMEOUT", {
            context: label,
            elapsedMs: result.elapsedMs,
            samples: result.samples,
            unfinishedFiniteAnimations: result.unfinishedFiniteAnimations,
            infiniteAnimations: result.infiniteAnimations,
        });
        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn("[visual-stability] VISUAL_STABILITY_ERROR", {
            context: label,
            message: message.slice(0, 200),
        });
        return emptyResult({
            attempted: true,
            reason: /navigat|closed|destroyed/i.test(message) ? "navigation" : "page-error",
            elapsedMs: Date.now() - started,
            samples,
        });
    }
}

/**
 * Bounded scroll pass to give IntersectionObserver / lazy images a chance
 * before full-page screenshots. Restores scroll to top.
 */
export async function prepareLazyLoadedVisualContent(
    page: Page,
    options: { maxDurationMs?: number; stepDelayMs?: number } = {},
): Promise<{ scrolled: boolean; elapsedMs: number }> {
    const maxDurationMs = options.maxDurationMs ?? VISUAL_STABILITY_CONFIG.lazyScrollMaxMs;
    const stepDelayMs = options.stepDelayMs ?? VISUAL_STABILITY_CONFIG.lazyScrollStepDelayMs;
    const started = Date.now();

    try {
        if (page.isClosed()) {
            return { scrolled: false, elapsedMs: 0 };
        }

        await page.evaluate(async ({ maxDurationMs: maxMs, stepDelayMs: delayMs }) => {
            const startedAt = performance.now();
            const step = Math.max(200, Math.floor((window.innerHeight || 600) * 0.85));
            const maxY = Math.max(
                document.documentElement.scrollHeight,
                document.body?.scrollHeight ?? 0,
            );
            let y = 0;
            while (y < maxY && performance.now() - startedAt < maxMs) {
                y = Math.min(y + step, maxY);
                window.scrollTo(0, y);
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
            window.scrollTo(0, 0);
        }, { maxDurationMs, stepDelayMs });

        return { scrolled: true, elapsedMs: Date.now() - started };
    } catch {
        try {
            await page.evaluate(() => window.scrollTo(0, 0));
        } catch {
            // ignore
        }
        return { scrolled: false, elapsedMs: Date.now() - started };
    }
}
