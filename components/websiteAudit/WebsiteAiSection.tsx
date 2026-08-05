"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
    rejectHeroSuggestionAction,
    restoreHeroSuggestionAction,
    selectHeroSuggestionAction,
} from "@/src/actions/ai";
import CursorAnalysisResultsPanel from "@/components/audit-dashboard/cursor-analysis-results-panel";
import CursorAnalysisStatusPoller from "@/components/audit-dashboard/cursor-analysis-status-poller";
import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import RunAiAnalysisButton from "@/components/websiteAudit/RunAiAnalysisButton";
import { AiAnalysisStatusBadge } from "@/components/websiteAudit/StatusBadges";
import {
    buildCheckLabelMap,
    formatCheckLabels,
    formatEffortLabel,
    formatImpactLabel,
    formatPriorityLabel,
    getStrongestCategoryLabel,
    getWeakestCategoryLabel,
    PRIORITY_SORT_ORDER,
} from "@/lib/websiteAudit/ai-format";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableHeroSuggestion } from "@/src/data/hero-suggestions";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { AiAnalysisStatus } from "@/src/schemas/enums";
import type { AnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import type { SerializableAuditRunAnalysis } from "@/src/services/cursor-analysis/types";

type WebsiteAiSectionProps = {
    websiteId: string;
    auditRunId?: string | null;
    aiAnalysisStatus: AiAnalysisStatus;
    latestAiAnalysisRunAt: string | null;
    prerequisitesMet: boolean;
    latestSummary: SerializableAiSummary | null;
    heroSuggestions: SerializableHeroSuggestion[];
    niceGuyMetric: SerializableNiceGuyMetric | null;
    useCursorAutomation?: boolean;
    cursorAnalysis?: SerializableAuditRunAnalysis | null;
    cursorReadiness?: AnalysisReadiness;
};

function FindingListItem({
    title,
    description,
    category,
    meta,
    evidence,
}: {
    title: string;
    description: string;
    category?: string | null;
    meta?: string;
    evidence: string;
}) {
    return (
        <div className="rounded-xl bg-base-100 p-4 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-sm font-medium text-base-content">{title}</p>
                    <p className="mt-2 text-sm text-base-content/75">{description}</p>
                </div>
                {meta ? <p className="text-sm text-base-content/60">{meta}</p> : null}
            </div>
            <div className="mt-3 flex flex-col gap-1 text-sm text-base-content/70">
                {category ? <p>Category: {category}</p> : null}
                <p>Supporting evidence: {evidence}</p>
            </div>
        </div>
    );
}

function HeroSuggestionCard({
    websiteId,
    suggestion,
    labelMap,
}: {
    websiteId: string;
    suggestion: SerializableHeroSuggestion;
    labelMap: Map<string, string>;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function runAction(action: "select" | "reject" | "restore") {
        startTransition(async () => {
            if (action === "select") {
                await selectHeroSuggestionAction(websiteId, suggestion.id);
            } else if (action === "reject") {
                await rejectHeroSuggestionAction(websiteId, suggestion.id);
            } else {
                await restoreHeroSuggestionAction(websiteId, suggestion.id);
            }
            router.refresh();
        });
    }

    return (
        <div className="rounded-2xl bg-base-100 p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-sm text-base-content/60">
                        Option {suggestion.optionNumber}
                    </p>
                    <h4 className="mt-1 text-lg font-semibold text-base-content">
                        {suggestion.conceptName}
                    </h4>
                </div>
                <span className="badge badge-outline">{suggestion.status}</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
                <p className="text-base font-medium text-base-content">{suggestion.headline}</p>
                <p className="text-sm text-base-content/75">{suggestion.supportingCopy}</p>
                <p className="text-sm text-base-content/75">
                    Primary CTA: {suggestion.primaryCta.label}
                    {suggestion.primaryCta.hrefSuggestion
                        ? ` (${suggestion.primaryCta.hrefSuggestion})`
                        : ""}
                </p>
                {suggestion.secondaryCta ? (
                    <p className="text-sm text-base-content/75">
                        Secondary CTA: {suggestion.secondaryCta.label}
                        {suggestion.secondaryCta.hrefSuggestion
                            ? ` (${suggestion.secondaryCta.hrefSuggestion})`
                            : ""}
                    </p>
                ) : null}
                {suggestion.trustSupport ? (
                    <p className="text-sm text-base-content/75">
                        Trust support: {suggestion.trustSupport}
                    </p>
                ) : null}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm font-medium text-base-content">Layout</p>
                    <p className="mt-2 text-sm text-base-content/75">
                        {suggestion.designDirection.layout}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm font-medium text-base-content">Imagery</p>
                    <p className="mt-2 text-sm text-base-content/75">
                        {suggestion.designDirection.imagery}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm font-medium text-base-content">Mobile behavior</p>
                    <p className="mt-2 text-sm text-base-content/75">
                        {suggestion.designDirection.mobileBehavior}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm font-medium text-base-content">Accessibility</p>
                    <ul className="mt-2 flex flex-col gap-1">
                        {suggestion.designDirection.accessibilityNotes.map((note) => (
                            <li key={note} className="text-sm text-base-content/75">
                                {note}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="mt-4 text-sm text-base-content/75">{suggestion.rationale}</p>

            <div className="mt-4">
                <p className="text-sm font-medium text-base-content">Problems addressed</p>
                <ul className="mt-2 flex flex-col gap-2">
                    {suggestion.targetProblems.map((problem) => (
                        <li key={`${problem.checkId}-${problem.explanation}`} className="text-sm text-base-content/75">
                            {labelMap.get(problem.checkId) ?? problem.checkId}: {problem.explanation}
                        </li>
                    ))}
                </ul>
            </div>

            {suggestion.constraints.length > 0 ? (
                <div className="mt-4">
                    <p className="text-sm font-medium text-base-content">Constraints</p>
                    <ul className="mt-2 flex flex-col gap-1">
                        {suggestion.constraints.map((constraint) => (
                            <li key={constraint} className="text-sm text-base-content/75">
                                {constraint}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={isPending || suggestion.status === "selected"}
                    onClick={() => runAction("select")}
                >
                    Select
                </button>
                <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={isPending || suggestion.status === "rejected"}
                    onClick={() => runAction("reject")}
                >
                    Reject
                </button>
                {suggestion.status !== "draft" ? (
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={isPending}
                        onClick={() => runAction("restore")}
                    >
                        Restore to draft
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default function WebsiteAiSection({
    websiteId,
    auditRunId,
    aiAnalysisStatus,
    latestAiAnalysisRunAt,
    prerequisitesMet,
    latestSummary,
    heroSuggestions,
    niceGuyMetric,
    useCursorAutomation = false,
    cursorAnalysis = null,
    cursorReadiness,
}: WebsiteAiSectionProps) {
    const labelMap = buildCheckLabelMap(niceGuyMetric);
    const weaknesses = [...(latestSummary?.weaknesses ?? [])].sort(
        (a, b) =>
            (PRIORITY_SORT_ORDER[a.priority] ?? 9) - (PRIORITY_SORT_ORDER[b.priority] ?? 9),
    );
    const quickWins = [...(latestSummary?.quickWins ?? [])];

    return (
        <AuditSectionCard title="AI analysis">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-3">
                        <AiAnalysisStatusBadge status={aiAnalysisStatus} />
                        <p className="text-sm text-base-content/70">
                            Latest generation:{" "}
                            {latestAiAnalysisRunAt
                                ? formatWebsiteDate(latestAiAnalysisRunAt)
                                : "Not run yet"}
                        </p>
                        {latestSummary ? (
                            <p className="text-sm text-base-content/70">
                                Analysis version: {latestSummary.analysisVersion} · Prompt version:{" "}
                                {latestSummary.promptVersion}
                            </p>
                        ) : null}
                        {aiAnalysisStatus === "partial" ? (
                            <p className="text-sm text-warning">
                                AI analysis partially completed. Review saved summary and hero
                                suggestions below.
                            </p>
                        ) : null}
                        {latestSummary?.status === "failed" ? (
                            <p className="text-sm text-error">
                                {latestSummary.errorMessage ?? "AI summary generation failed."}
                            </p>
                        ) : null}
                    </div>
                    <RunAiAnalysisButton
                        websiteId={websiteId}
                        auditRunId={auditRunId}
                        aiAnalysisStatus={aiAnalysisStatus}
                        prerequisitesMet={prerequisitesMet}
                        useCursorAutomation={useCursorAutomation}
                        cursorAnalysis={cursorAnalysis}
                        cursorReadiness={cursorReadiness}
                    />
                </div>

                {useCursorAutomation && auditRunId && cursorAnalysis ? (
                    <CursorAnalysisStatusPoller
                        auditRunId={auditRunId}
                        status={cursorAnalysis.status}
                    />
                ) : null}

                {useCursorAutomation && cursorAnalysis ? (
                    <CursorAnalysisResultsPanel
                        analysis={cursorAnalysis}
                        officialNiceGuyScore={niceGuyMetric?.overallScore ?? null}
                    />
                ) : null}

                {!useCursorAutomation && latestSummary?.status === "complete" ? (
                    <>
                        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <h3 className="text-lg font-semibold text-base-content">
                                Executive summary
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-base-content/80">
                                {latestSummary.executiveSummary}
                            </p>
                            <p className="mt-4 text-sm leading-relaxed text-base-content/80">
                                {latestSummary.businessImpactSummary}
                            </p>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-base-content/60">Nice Guy score</p>
                                    <p className="mt-1 text-sm text-base-content">
                                        {latestSummary.sourceSnapshot.overallScore}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-base-content/60">Strongest category</p>
                                    <p className="mt-1 text-sm text-base-content">
                                        {getStrongestCategoryLabel(niceGuyMetric)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-base-content/60">Weakest category</p>
                                    <p className="mt-1 text-sm text-base-content">
                                        {getWeakestCategoryLabel(niceGuyMetric)}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-base-content/70">
                                The Nice Guy score is calculated by deterministic rules. AI is used
                                only to summarize and organize the findings.
                            </p>
                            <p className="mt-2 text-sm text-base-content/60">
                                Generated{" "}
                                {latestSummary.generatedAt
                                    ? formatWebsiteDate(latestSummary.generatedAt)
                                    : "—"}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-base-content">Strengths</h3>
                            <div className="mt-4 flex flex-col gap-3">
                                {latestSummary.strengths.map((item) => (
                                    <FindingListItem
                                        key={item.title}
                                        title={item.title}
                                        description={item.description}
                                        category={item.category}
                                        evidence={formatCheckLabels(item.evidenceCheckIds, labelMap)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-base-content">Weaknesses</h3>
                            <div className="mt-4 flex flex-col gap-3">
                                {weaknesses.map((item) => (
                                    <FindingListItem
                                        key={item.title}
                                        title={item.title}
                                        description={item.description}
                                        category={item.category}
                                        meta={`Priority: ${formatPriorityLabel(item.priority)}`}
                                        evidence={formatCheckLabels(item.evidenceCheckIds, labelMap)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-base-content">Quick wins</h3>
                            <p className="mt-2 text-sm text-base-content/70">
                                Effort estimates are relative, not exact project timelines.
                            </p>
                            <div className="mt-4 flex flex-col gap-3">
                                {quickWins.map((item) => (
                                    <FindingListItem
                                        key={item.title}
                                        title={item.title}
                                        description={item.description}
                                        category={item.category}
                                        meta={`Impact: ${formatImpactLabel(item.expectedImpact)} · Effort: ${formatEffortLabel(item.estimatedEffort)}`}
                                        evidence={formatCheckLabels(item.evidenceCheckIds, labelMap)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-base-content">
                                Long-term recommendations
                            </h3>
                            <div className="mt-4 flex flex-col gap-3">
                                {latestSummary.longTermRecommendations.map((item) => (
                                    <FindingListItem
                                        key={item.title}
                                        title={item.title}
                                        description={item.description}
                                        category={item.category}
                                        meta={`Priority: ${formatPriorityLabel(item.priority)} · Effort: ${formatEffortLabel(item.estimatedEffort)}`}
                                        evidence={formatCheckLabels(item.evidenceCheckIds, labelMap)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-base-content">
                                Priority plan
                            </h3>
                            <ol className="mt-4 flex flex-col gap-3">
                                {latestSummary.priorityOrder.map((item) => (
                                    <li
                                        key={`${item.rank}-${item.title}`}
                                        className="rounded-xl bg-base-100 p-4 shadow-sm"
                                    >
                                        <p className="text-sm font-medium text-base-content">
                                            {item.rank}. {item.title}
                                        </p>
                                        <p className="mt-2 text-sm text-base-content/75">
                                            {item.reason}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        {latestSummary.disclaimers.length > 0 ? (
                            <div>
                                <h3 className="text-lg font-semibold text-base-content">
                                    Disclaimers
                                </h3>
                                <ul className="mt-4 flex flex-col gap-2">
                                    {latestSummary.disclaimers.map((item) => (
                                        <li key={item} className="text-sm text-base-content/75">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </>
                ) : null}

                {!useCursorAutomation && heroSuggestions.length > 0 ? (
                    <div>
                        <h3 className="text-lg font-semibold text-base-content">
                            Hero suggestions
                        </h3>
                        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-1">
                            {heroSuggestions.map((suggestion) => (
                                <HeroSuggestionCard
                                    key={suggestion.id}
                                    websiteId={websiteId}
                                    suggestion={suggestion}
                                    labelMap={labelMap}
                                />
                            ))}
                        </div>
                    </div>
                ) : null}

                {!latestSummary && aiAnalysisStatus === "not-started" ? (
                    <p className="text-sm text-base-content/75">
                        Run AI analysis to generate an executive summary, prioritized findings, and
                        hero-section concepts based on saved crawl and scoring evidence.
                    </p>
                ) : null}
            </div>
        </AuditSectionCard>
    );
}
