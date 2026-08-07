/**
 * Visual stability configuration for screenshot capture only.
 * Does not affect crawl DOM extraction, PageSpeed, or NiceGuy measurements.
 */

function parsePositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
    if (!value) return fallback;
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
    return fallback;
}

export const VISUAL_STABILITY_CONFIG = {
    /** Master switch — when false, screenshot path uses legacy short settle only. */
    enabled: parseBoolean(process.env.VISUAL_STABILITY_ENABLED, true),
    /**
     * Hard ceiling for the visual stability wait (per viewport navigation).
     * Timeout still captures; it never fails the audit.
     */
    maxWaitMs: parsePositiveInt(process.env.VISUAL_STABILITY_MAX_WAIT_MS, 4_000),
    /** Consecutive stable observation window required before declaring settled. */
    windowMs: parsePositiveInt(process.env.VISUAL_STABILITY_WINDOW_MS, 700),
    /** Interval between layout/animation samples. */
    sampleMs: parsePositiveInt(process.env.VISUAL_STABILITY_SAMPLE_MS, 150),
    /** Bounded wait for document.fonts.ready inside sampling. */
    fontBudgetMs: 1_000,
    /** Layout dimension / box change tolerance in CSS pixels. */
    layoutTolerancePx: 2,
    /** Max viewport-visible images we wait on (beyond this, proceed). */
    maxVisibleImagesToAwait: 12,
    /**
     * After stability timeout on fonts/images signals, ignore those gates.
     * Finite animations still prefer to finish within maxWaitMs.
     */
    softResourceBudgetMs: 1_500,
    /** Bounded lazy-load scroll pass before full-page screenshots. */
    lazyScrollMaxMs: 2_000,
    lazyScrollStepDelayMs: 80,
    /** Shorter re-stabilize after lazy scroll + restore to top. */
    postLazyMaxWaitMs: 2_000,
} as const;

export type VisualStabilityConfig = typeof VISUAL_STABILITY_CONFIG;
