"use client";

import CursorAnalysisResultsPanel from "@/components/audit-dashboard/cursor-analysis-results-panel";
import CursorAnalysisStatusPoller from "@/components/audit-dashboard/cursor-analysis-status-poller";
import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import RunAiAnalysisButton from "@/components/websiteAudit/RunAiAnalysisButton";
import { AiAnalysisStatusBadge } from "@/components/websiteAudit/StatusBadges";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { AiAnalysisStatus } from "@/src/schemas/enums";
import type { AnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import type { SerializableAuditRunAnalysis } from "@/src/services/cursor-analysis/types";

type WebsiteAiSectionProps = {
    websiteId: string;
    auditRunId?: string | null;
    aiAnalysisStatus: AiAnalysisStatus;
    latestAiAnalysisRunAt: string | null;
    niceGuyMetric: SerializableNiceGuyMetric | null;
    cursorAnalysisConfigured?: boolean;
    cursorAnalysis?: SerializableAuditRunAnalysis | null;
    cursorReadiness?: AnalysisReadiness;
};

export default function WebsiteAiSection({
    websiteId,
    auditRunId,
    aiAnalysisStatus,
    latestAiAnalysisRunAt,
    niceGuyMetric,
    cursorAnalysisConfigured = false,
    cursorAnalysis = null,
    cursorReadiness,
}: WebsiteAiSectionProps) {
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
                        {cursorAnalysis?.status === "failed" ? (
                            <p className="text-sm text-error">
                                {cursorAnalysis.lastError ?? "Analysis failed."}
                            </p>
                        ) : null}
                    </div>
                    <RunAiAnalysisButton
                        websiteId={websiteId}
                        auditRunId={auditRunId}
                        cursorAnalysisConfigured={cursorAnalysisConfigured}
                        cursorAnalysis={cursorAnalysis}
                        cursorReadiness={cursorReadiness}
                    />
                </div>

                {!cursorAnalysisConfigured ? (
                    <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-base-content/80">
                        <p className="font-medium text-base-content">
                            Cursor analysis is not fully configured on this deployment.
                        </p>
                        <p className="mt-2">
                            Add the Cursor environment variables in Vercel for Preview and
                            Production, then redeploy.
                        </p>
                    </div>
                ) : null}

                {auditRunId && cursorAnalysis ? (
                    <CursorAnalysisStatusPoller
                        auditRunId={auditRunId}
                        status={cursorAnalysis.status}
                    />
                ) : null}

                {cursorAnalysis ? (
                    <CursorAnalysisResultsPanel
                        analysis={cursorAnalysis}
                        officialNiceGuyScore={niceGuyMetric?.overallScore ?? null}
                    />
                ) : null}

                {aiAnalysisStatus === "not-started" ? (
                    <p className="text-sm text-base-content/75">
                        Run analysis to generate an executive summary, prioritized findings, and
                        hero-section concepts based on saved crawl and scoring evidence.
                    </p>
                ) : null}
            </div>
        </AuditSectionCard>
    );
}
