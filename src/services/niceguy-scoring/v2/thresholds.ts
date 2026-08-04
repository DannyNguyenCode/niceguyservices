import type { CheckStatus } from "@/src/services/niceguy-scoring/types";

/** Lighthouse score bands per v2 Technical Foundation spec. */
export function lighthouseScoreStatus(score: number | null | undefined): CheckStatus {
    if (score === null || score === undefined) return "unavailable";
    if (score >= 90) return "passed";
    if (score >= 50) return "partial";
    return "failed";
}

export function lighthouseScorePoints(
    score: number | null | undefined,
    maxPoints: number,
): number {
    const status = lighthouseScoreStatus(score);
    if (status === "unavailable") return 0;
    if (status === "passed") return maxPoints;
    if (status === "partial") return Math.round(maxPoints * 0.5);
    return 0;
}

/** CLS lab thresholds: good ≤0.1, needs improvement ≤0.25, poor >0.25 */
export function clsStatus(cls: number | null | undefined): CheckStatus {
    if (cls === null || cls === undefined) return "unavailable";
    if (cls <= 0.1) return "passed";
    if (cls <= 0.25) return "partial";
    return "failed";
}

export function clsPoints(cls: number | null | undefined, maxPoints: number): number {
    const status = clsStatus(cls);
    if (status === "unavailable") return 0;
    if (status === "passed") return maxPoints;
    if (status === "partial") return Math.round(maxPoints * 0.5);
    return 0;
}

/** TBT lab thresholds: ≤200 pass, 201–600 partial, >600 fail */
export function tbtStatus(tbtMs: number | null | undefined): CheckStatus {
    if (tbtMs === null || tbtMs === undefined) return "unavailable";
    if (tbtMs <= 200) return "passed";
    if (tbtMs <= 600) return "partial";
    return "failed";
}

export function tbtPoints(tbtMs: number | null | undefined, maxPoints: number): number {
    const status = tbtStatus(tbtMs);
    if (status === "unavailable") return 0;
    if (status === "passed") return maxPoints;
    if (status === "partial") return Math.round(maxPoints * 0.5);
    return 0;
}

export type CruxMetricRating = "good" | "needs-improvement" | "poor" | "unavailable";

export function cruxLcpRating(ms: number | null | undefined): CruxMetricRating {
    if (ms === null || ms === undefined) return "unavailable";
    if (ms <= 2500) return "good";
    if (ms <= 4000) return "needs-improvement";
    return "poor";
}

export function cruxInpRating(ms: number | null | undefined): CruxMetricRating {
    if (ms === null || ms === undefined) return "unavailable";
    if (ms <= 200) return "good";
    if (ms <= 500) return "needs-improvement";
    return "poor";
}

export function cruxClsRating(value: number | null | undefined): CruxMetricRating {
    if (value === null || value === undefined) return "unavailable";
    if (value <= 0.1) return "good";
    if (value <= 0.25) return "needs-improvement";
    return "poor";
}

/** Field CWV composite: any poor fails; any NI and none poor partial; all good passes. */
export function cruxCompositeStatus(ratings: CruxMetricRating[]): CheckStatus {
    const applicable = ratings.filter((rating) => rating !== "unavailable");
    if (applicable.length === 0) return "unavailable";
    if (applicable.some((rating) => rating === "poor")) return "failed";
    if (applicable.some((rating) => rating === "needs-improvement")) return "partial";
    return "passed";
}

export function cruxCompositePoints(status: CheckStatus, maxPoints: number): number {
    if (status === "unavailable") return 0;
    if (status === "passed") return maxPoints;
    if (status === "partial") return Math.round(maxPoints * 0.5);
    return 0;
}
