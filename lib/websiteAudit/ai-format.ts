import type { NiceGuyCategoryKey } from "@/src/config/niceguy-scoring";
import { CATEGORY_LABELS } from "@/src/config/niceguy-scoring";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";

export function buildCheckLabelMap(
    metric: SerializableNiceGuyMetric | null,
): Map<string, string> {
    const map = new Map<string, string>();
    if (!metric) return map;

    for (const key of Object.keys(metric.categories) as NiceGuyCategoryKey[]) {
        const category = metric.categories[key];
        for (const check of category.checks) {
            map.set(check.id, check.label);
        }
    }

    return map;
}

export function formatCheckLabels(
    checkIds: string[],
    labelMap: Map<string, string>,
): string {
    if (checkIds.length === 0) return "No linked checks";
    return checkIds
        .map((id) => labelMap.get(id) ?? id)
        .join(", ");
}

export function getStrongestCategoryLabel(metric: SerializableNiceGuyMetric | null): string {
    if (!metric?.summary.strongestCategory) return "—";
    const key = metric.summary.strongestCategory as NiceGuyCategoryKey;
    return CATEGORY_LABELS[key] ?? metric.summary.strongestCategory;
}

export function getWeakestCategoryLabel(metric: SerializableNiceGuyMetric | null): string {
    if (!metric?.summary.weakestCategory) return "—";
    const key = metric.summary.weakestCategory as NiceGuyCategoryKey;
    return CATEGORY_LABELS[key] ?? metric.summary.weakestCategory;
}

export function formatPriorityLabel(priority: string): string {
    return priority.replace(/-/g, " ");
}

export function formatImpactLabel(value: string): string {
    return value.replace(/-/g, " ");
}

export function formatEffortLabel(value: string): string {
    return value.replace(/-/g, " ");
}

export const PRIORITY_SORT_ORDER: Record<string, number> = {
    high: 0,
    medium: 1,
    low: 2,
};

export const EFFORT_SORT_ORDER: Record<string, number> = {
    low: 0,
    medium: 1,
    high: 2,
};
