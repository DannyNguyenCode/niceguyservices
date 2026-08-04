import {
    CATEGORY_LABELS,
    scorePresentationLabel,
} from "@/src/config/niceguy-scoring";
import type { NiceGuyCategoryKey } from "@/src/schemas/niceguy-metrics";
import type {
    CategoryScore,
    CheckPriority,
    CheckStatus,
    MetricCheck,
} from "@/src/services/niceguy-scoring/types";

export function formatNiceGuyStatusLabel(status: string): string {
    return status.replace(/-/g, " ");
}

export function formatCheckStatusLabel(status: CheckStatus): string {
    const labels: Record<CheckStatus, string> = {
        passed: "Passed",
        partial: "Partial",
        failed: "Failed",
        unavailable: "Unavailable",
        not_detected: "Not detected",
        not_applicable: "Not applicable",
    };
    return labels[status];
}

export function formatPriorityLabel(priority: CheckPriority): string {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function formatCategoryLabel(key: NiceGuyCategoryKey): string {
    return CATEGORY_LABELS[key];
}

export function formatScoreWithPresentation(score: number | null | undefined): string {
    if (score === null || score === undefined) return "Not available";
    return `${score} — ${scorePresentationLabel(score)}`;
}

export function countChecksByStatus(
    category: CategoryScore,
    status: CheckStatus,
): number {
    return category.checks.filter((check) => check.status === status).length;
}

export function groupRecommendations(
    categories: Record<NiceGuyCategoryKey, CategoryScore>,
): Array<{
    priority: CheckPriority;
    category: string;
    title: string;
    description: string;
}> {
    const grouped: Array<{
        priority: CheckPriority;
        category: string;
        title: string;
        description: string;
    }> = [];
    const seen = new Set<string>();

    for (const [key, category] of Object.entries(categories) as Array<
        [NiceGuyCategoryKey, CategoryScore]
    >) {
        for (const recommendation of category.recommendations) {
            const dedupeKey = `${recommendation.title}:${recommendation.description}`;
            if (seen.has(dedupeKey)) continue;
            seen.add(dedupeKey);
            grouped.push({
                priority: recommendation.priority,
                category: CATEGORY_LABELS[key],
                title: recommendation.title,
                description: recommendation.description,
            });
        }
    }

    const priorityOrder: Record<CheckPriority, number> = { high: 0, medium: 1, low: 2 };
    grouped.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    return grouped;
}

export function formatEvidenceValue(value: string | number | boolean | null | undefined): string {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
}

export function formatCheckPoints(check: MetricCheck): string {
    return `${check.pointsAwarded}/${check.maximumPoints}`;
}
