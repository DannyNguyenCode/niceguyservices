"use client";

import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";
import type { SerializableAuditRunAnalysis } from "@/src/services/cursor-analysis/types";

const severityOrder = ["critical", "high", "medium", "low"] as const;
const priorityLabels: Record<string, string> = {
    critical: "Critical priority",
    high: "High priority",
    moderate: "Moderate priority",
    low: "Low priority",
};

function formatStatusLabel(status: string): string {
    return status.replace(/_/g, " ");
}

export default function CursorAnalysisResultsPanel({
    analysis,
    officialNiceGuyScore,
}: {
    analysis: SerializableAuditRunAnalysis;
    officialNiceGuyScore?: number | null;
}) {
    const result = analysis.result as CursorAuditResult | null;

    if (!result) {
        return (
            <div className="rounded-xl bg-base-200 p-4 text-sm text-base-content/75">
                <p>
                    Status:{" "}
                    <span className="font-medium text-base-content">
                        {formatStatusLabel(analysis.status)}
                    </span>
                </p>
                {analysis.attempt > 0 ? <p className="mt-2">Attempt: {analysis.attempt}</p> : null}
                {analysis.lastError ? (
                    <p className="mt-2 text-error" role="alert">
                        {analysis.lastError}
                    </p>
                ) : null}
            </div>
        );
    }

    const sortedIssues = [...result.issues].sort(
        (left, right) =>
            severityOrder.indexOf(left.severity) - severityOrder.indexOf(right.severity),
    );

    return (
        <div className="grid grid-cols-1 gap-4">
            {officialNiceGuyScore != null ? (
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-sm text-base-content/60">Official Nice Guy score</p>
                    <p className="mt-2 text-3xl font-semibold text-base-content">
                        {officialNiceGuyScore}
                    </p>
                </div>
            ) : null}

            <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                <p className="text-sm text-base-content/60">AI assessment</p>
                <p className="mt-1 text-sm font-medium text-base-content">
                    {priorityLabels[result.assessment.priority] ?? result.assessment.priority}
                    {" · "}
                    {Math.round(result.assessment.confidence * 100)}% confidence
                </p>
                <p className="mt-2 text-sm leading-relaxed text-base-content/80">
                    {result.assessment.summary}
                </p>
            </div>

            <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-base-content">Executive summary</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/80">
                    {result.executiveSummary}
                </p>
            </div>

            {result.strengths.length > 0 ? (
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-base-content">Strengths</h3>
                    <ul className="mt-3 space-y-3">
                        {result.strengths.map((item) => (
                            <li key={item.title} className="rounded-lg bg-base-100 p-3 text-sm">
                                <p className="font-medium text-base-content">{item.title}</p>
                                <p className="mt-2 text-base-content/75">{item.description}</p>
                                {item.category ? (
                                    <p className="mt-1 text-xs text-base-content/60">
                                        Category: {item.category}
                                    </p>
                                ) : null}
                                <p className="mt-2 text-xs text-base-content/60">
                                    Sources: {item.sources.join(", ")}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {sortedIssues.length > 0 ? (
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-base-content">Prioritized issues</h3>
                    <ul className="mt-3 space-y-3">
                        {sortedIssues.map((issue) => (
                            <li key={issue.title} className="rounded-lg bg-base-100 p-3 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-base-content">{issue.title}</p>
                                    <span className="badge badge-outline badge-sm">
                                        {issue.severity}
                                    </span>
                                    <span className="badge badge-ghost badge-sm">
                                        {issue.category}
                                    </span>
                                </div>
                                <p className="mt-2 text-base-content/75">{issue.description}</p>
                                <p className="mt-2 text-base-content/75">
                                    Recommendation: {issue.recommendation}
                                </p>
                                <p className="mt-2 text-xs text-base-content/60">
                                    Sources: {issue.sources.join(", ")}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {result.limitations.length > 0 ? (
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-base-content">Limitations</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-base-content/75">
                        {result.limitations.map((limitation) => (
                            <li key={limitation}>{limitation}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}
