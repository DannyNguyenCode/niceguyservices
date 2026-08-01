"use client";

import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";
import type { SerializableAuditRunAnalysis } from "@/src/services/cursor-analysis/types";

const severityOrder = ["critical", "high", "medium", "low"] as const;

function formatStatusLabel(status: string): string {
    return status.replace(/_/g, " ");
}

export default function CursorAnalysisResultsPanel({
    analysis,
}: {
    analysis: SerializableAuditRunAnalysis;
}) {
    const result = analysis.result as CursorAuditResult | null;

    if (!result) {
        return (
            <div className="rounded-xl bg-base-200 p-4 text-sm text-base-content/75">
                <p>
                    Status: <span className="font-medium text-base-content">{formatStatusLabel(analysis.status)}</span>
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
            <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                <p className="text-sm text-base-content/60">Overall score</p>
                <p className="mt-2 text-3xl font-semibold text-base-content">{result.overallScore}</p>
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
                                <p className="mt-2 text-base-content/75">{item.evidence}</p>
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
                            <li key={issue.id} className="rounded-lg bg-base-100 p-3 text-sm">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-base-content">{issue.title}</p>
                                    <span className="badge badge-outline badge-sm">{issue.severity}</span>
                                    <span className="badge badge-ghost badge-sm">{issue.category}</span>
                                </div>
                                <p className="mt-2 text-base-content/75">{issue.evidence}</p>
                                <p className="mt-2 text-base-content/75">
                                    Recommendation: {issue.recommendation}
                                </p>
                                <p className="mt-2 text-xs text-base-content/60">
                                    Sources: {issue.sources.join(", ")} · Confidence:{" "}
                                    {Math.round(issue.confidence * 100)}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-base-content">Hero recommendations</h3>
                <p className="mt-2 text-sm font-medium text-base-content">
                    {result.heroSuggestions.headline}
                </p>
                <p className="mt-2 text-sm text-base-content/75">
                    {result.heroSuggestions.supportingCopy}
                </p>
                <p className="mt-2 text-sm text-base-content/70">
                    Primary CTA: {result.heroSuggestions.primaryCTA}
                    {result.heroSuggestions.secondaryCTA
                        ? ` · Secondary CTA: ${result.heroSuggestions.secondaryCTA}`
                        : ""}
                </p>
                <p className="mt-2 text-sm text-base-content/70">
                    Design direction: {result.heroSuggestions.designDirection}
                </p>
            </div>

            <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-base-content">Outreach email</h3>
                <p className="mt-2 text-sm font-medium text-base-content">
                    Subject: {result.outreachEmail.subject}
                </p>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-base-100 p-3 text-sm text-base-content/80">
                    {result.outreachEmail.body}
                </pre>
            </div>
        </div>
    );
}
