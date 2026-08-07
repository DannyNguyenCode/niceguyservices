import type {
    VisualLayoutSignature,
    VisualStabilityGateState,
    VisualStabilitySample,
} from "@/src/services/visual-stability/types";

function withinTolerance(a: number, b: number, tolerancePx: number): boolean {
    return Math.abs(a - b) <= tolerancePx;
}

export function layoutsMatch(
    a: VisualLayoutSignature,
    b: VisualLayoutSignature,
    tolerancePx: number,
): boolean {
    return (
        withinTolerance(a.scrollWidth, b.scrollWidth, tolerancePx) &&
        withinTolerance(a.scrollHeight, b.scrollHeight, tolerancePx) &&
        withinTolerance(a.clientWidth, b.clientWidth, tolerancePx) &&
        withinTolerance(a.clientHeight, b.clientHeight, tolerancePx) &&
        a.boxesKey === b.boxesKey
    );
}

/**
 * Whether the current sample is acceptable as a "settled presentation" observation.
 * Infinite animations are intentionally ignored.
 */
export function isPresentationReadySample(
    sample: VisualStabilitySample,
    gates: VisualStabilityGateState,
): boolean {
    if (sample.readyState !== "interactive" && sample.readyState !== "complete") {
        return false;
    }

    if (sample.unfinishedFiniteAnimations > 0) {
        return false;
    }

    if (sample.fontsSupported && !sample.fontsReady && !gates.fontsBudgetExhausted) {
        return false;
    }

    if (sample.visibleImagesPending > 0 && !gates.imagesBudgetExhausted) {
        return false;
    }

    return true;
}

export function samplesAreVisuallyStable(
    previous: VisualStabilitySample,
    current: VisualStabilitySample,
    tolerancePx: number,
    gates: VisualStabilityGateState,
): boolean {
    if (!isPresentationReadySample(previous, gates)) return false;
    if (!isPresentationReadySample(current, gates)) return false;
    return layoutsMatch(previous.layout, current.layout, tolerancePx);
}

/**
 * Pure decision helper for tests: given a sequence of samples and timing,
 * determine whether a consecutive stable window was achieved before maxWait.
 */
export function evaluateStabilitySequence(input: {
    samples: VisualStabilitySample[];
    sampleMs: number;
    windowMs: number;
    maxWaitMs: number;
    softResourceBudgetMs: number;
    layoutTolerancePx: number;
}): {
    stabilized: boolean;
    timedOut: boolean;
    reason: "stable" | "timeout";
    samplesNeeded: number;
} {
    if (input.samples.length === 0) {
        return { stabilized: false, timedOut: true, reason: "timeout", samplesNeeded: 0 };
    }

    const requiredConsecutive = Math.max(2, Math.ceil(input.windowMs / input.sampleMs) + 1);
    let streak = 1;

    for (let i = 1; i < input.samples.length; i += 1) {
        const elapsed = input.samples[i]!.sampledAtMs;
        const gates: VisualStabilityGateState = {
            fontsBudgetExhausted: elapsed >= input.softResourceBudgetMs,
            imagesBudgetExhausted: elapsed >= input.softResourceBudgetMs,
        };

        const prev = input.samples[i - 1]!;
        const curr = input.samples[i]!;
        if (samplesAreVisuallyStable(prev, curr, input.layoutTolerancePx, gates)) {
            streak += 1;
            if (streak >= requiredConsecutive && elapsed <= input.maxWaitMs) {
                return {
                    stabilized: true,
                    timedOut: false,
                    reason: "stable",
                    samplesNeeded: i + 1,
                };
            }
        } else {
            streak = 1;
        }
    }

    return {
        stabilized: false,
        timedOut: true,
        reason: "timeout",
        samplesNeeded: input.samples.length,
    };
}
