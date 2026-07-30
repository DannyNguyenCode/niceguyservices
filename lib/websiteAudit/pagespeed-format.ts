import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import { scoreDisplayLabel } from "@/src/lib/pagespeed-rules";

export function formatScore(score: number | null | undefined): string {
    if (score === null || score === undefined) return "Not available";
    return String(score);
}

export function formatScoreWithLabel(score: number | null | undefined): string {
    const label = scoreDisplayLabel(score);
    if (score === null || score === undefined) return label;
    return `${score} — ${label}`;
}

export function formatMetricDisplay(
    metric?: {
        displayValue?: string | null;
        valueMs?: number | null;
        value?: number | null;
    } | null,
): string {
    if (!metric) return "Not available";
    if (metric.displayValue) return metric.displayValue;
    if (metric.valueMs !== null && metric.valueMs !== undefined) {
        return `${Math.round(metric.valueMs)} ms`;
    }
    if (metric.value !== null && metric.value !== undefined) {
        return String(metric.value);
    }
    return "Not available";
}

export function formatFieldMetric(
    metric?: { percentile?: number | null; category?: string | null } | null,
): string {
    if (!metric?.percentile && !metric?.category) return "Not available";
    const parts = [];
    if (metric.percentile !== null && metric.percentile !== undefined) {
        parts.push(`${metric.percentile}`);
    }
    if (metric.category) {
        parts.push(metric.category);
    }
    return parts.join(" — ");
}

export function scoreDifference(
    mobile: SerializableGoogleMetric | null,
    desktop: SerializableGoogleMetric | null,
    key: keyof SerializableGoogleMetric["scores"],
): string {
    const mobileScore = mobile?.scores[key];
    const desktopScore = desktop?.scores[key];
    if (
        mobileScore === null ||
        mobileScore === undefined ||
        desktopScore === null ||
        desktopScore === undefined
    ) {
        return "Not available";
    }
    const diff = mobileScore - desktopScore;
    if (diff === 0) return "No difference";
    return diff > 0 ? `Mobile +${diff}` : `Desktop +${Math.abs(diff)}`;
}

export function formatStatusLabel(value: string): string {
    return value.replace(/-/g, " ");
}

export function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
