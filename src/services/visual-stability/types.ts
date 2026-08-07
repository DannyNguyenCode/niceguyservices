export const VISUAL_STABILITY_REASONS = [
    "stable",
    "timeout",
    "page-error",
    "navigation",
    "unsupported",
    "disabled",
] as const;

export type VisualStabilityReason = (typeof VISUAL_STABILITY_REASONS)[number];

export type VisualStabilityResult = {
    attempted: boolean;
    stabilized: boolean;
    timedOut: boolean;
    reason: VisualStabilityReason;
    elapsedMs: number;
    samples: number;
    /** Finite CSS/WAAPI animations still running when we stopped. */
    unfinishedFiniteAnimations: number;
    /** Infinite/looping animations observed (tolerated; do not block). */
    infiniteAnimations: number;
    fontsReady: boolean;
    visibleImagesPending: number;
};

export type VisualLayoutSignature = {
    scrollWidth: number;
    scrollHeight: number;
    clientWidth: number;
    clientHeight: number;
    /** Compact signature of prominent in-viewport element geometry. */
    boxesKey: string;
};

export type VisualStabilitySample = {
    readyState: string;
    fontsReady: boolean;
    fontsSupported: boolean;
    unfinishedFiniteAnimations: number;
    infiniteAnimations: number;
    visibleImagesTotal: number;
    visibleImagesPending: number;
    layout: VisualLayoutSignature;
    sampledAtMs: number;
};

export type VisualStabilityGateState = {
    fontsBudgetExhausted: boolean;
    imagesBudgetExhausted: boolean;
};
