import type { ActivityCategory, ActivitySeverity } from "@/src/constants/activity-events";
import type { SerializableActivityItem } from "@/src/services/activity/types";

const ACTIVE_START_EVENTS = new Set([
    "crawl-started",
    "pagespeed-started",
    "niceguy-started",
    "ai-analysis-started",
    "pdf-report-started",
    "demo-generation-started",
    "demo-generation-queued",
]);

const ACTIVE_END_EVENTS = new Set([
    "crawl-completed",
    "crawl-failed",
    "crawl-cancelled",
    "crawl-partial",
    "pagespeed-completed",
    "pagespeed-partial",
    "pagespeed-failed",
    "niceguy-completed",
    "niceguy-failed",
    "ai-analysis-completed",
    "ai-analysis-partial",
    "ai-analysis-failed",
    "pdf-report-completed",
    "pdf-report-failed",
    "demo-generation-completed",
    "demo-generation-failed",
    "demo-generation-cancelled",
]);

const ACTIVE_STAGE_LABELS: Record<string, string> = {
    "crawl-started": "Crawling",
    "pagespeed-started": "Collecting PageSpeed metrics",
    "niceguy-started": "Calculating Nice Guy metrics",
    "ai-analysis-started": "Generating AI analysis",
    "pdf-report-started": "Generating PDF",
    "demo-generation-started": "Generating demo",
    "demo-generation-queued": "Demo generation queued",
};

export type ActivitySummary = {
    latestEvent: SerializableActivityItem | null;
    latestSuccess: SerializableActivityItem | null;
    activeStage: string | null;
    errorCount: number;
    warningCount: number;
};

export function getActivitySummary(items: SerializableActivityItem[]): ActivitySummary {
    const latestEvent = items[0] ?? null;
    const latestSuccess =
        items.find((item) => item.severity === "success" && !item.archivedAt) ?? null;
    const errorCount = items.filter(
        (item) => item.severity === "error" && !item.archivedAt,
    ).length;
    const warningCount = items.filter(
        (item) => item.severity === "warning" && !item.archivedAt,
    ).length;

    let activeStage: string | null = null;
    for (const item of items) {
        if (item.archivedAt) continue;
        if (!ACTIVE_START_EVENTS.has(item.eventType)) continue;
        const ended = items.some(
            (candidate) =>
                !candidate.archivedAt &&
                candidate.occurredAt >= item.occurredAt &&
                ACTIVE_END_EVENTS.has(candidate.eventType) &&
                getStageGroup(candidate.eventType) === getStageGroup(item.eventType),
        );
        if (!ended) {
            activeStage = ACTIVE_STAGE_LABELS[item.eventType] ?? item.title;
            break;
        }
    }

    return {
        latestEvent,
        latestSuccess,
        activeStage,
        errorCount,
        warningCount,
    };
}

function getStageGroup(eventType: string): ActivityCategory | "crawl" | "pagespeed" | "metrics" | "ai" | "pdf" | "demo" {
    if (eventType.startsWith("crawl-")) return "crawl";
    if (eventType.startsWith("pagespeed-")) return "pagespeed";
    if (eventType.startsWith("niceguy-")) return "metrics";
    if (eventType.startsWith("ai-")) return "ai";
    if (eventType.startsWith("pdf-report-")) return "pdf";
    if (eventType.startsWith("demo-generation-")) return "demo";
    return "system";
}

export function filterActivityItems(
    items: SerializableActivityItem[],
    input: {
        categories?: ActivityCategory[];
        severities?: ActivitySeverity[];
        eventTypes?: string[];
        errorsOnly?: boolean;
    },
): SerializableActivityItem[] {
    return items.filter((item) => {
        if (item.archivedAt) return false;
        if (input.errorsOnly && item.severity !== "error") return false;
        if (input.categories?.length && !input.categories.includes(item.category)) return false;
        if (input.severities?.length && !input.severities.includes(item.severity)) return false;
        if (input.eventTypes?.length && !input.eventTypes.includes(item.eventType)) return false;
        return true;
    });
}
