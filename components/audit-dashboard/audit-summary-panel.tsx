import AuditActionPanel from "@/components/audit-dashboard/audit-action-panel";
import AuditJobProgressPanel from "@/components/audit-dashboard/audit-job-progress-panel";
import AuditOverview from "@/components/audit-dashboard/audit-overview";
import AuditProgress from "@/components/audit-dashboard/audit-progress";
import AuditWarnings from "@/components/audit-dashboard/audit-warnings";
import AuditSection from "@/components/audit/shared/audit-section";
import { AUDIT_SECTIONS } from "@/src/lib/audit-sections";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import type { WebsiteAuditDashboardData } from "@/src/types/audit-dashboard";

type AuditSummaryPanelProps = {
    dashboard: WebsiteAuditDashboardData;
    activeJob: SerializableAuditJob | null;
    selectedAuditRunId: string | null;
};

export default function AuditSummaryPanel({
    dashboard,
    activeJob,
    selectedAuditRunId,
}: AuditSummaryPanelProps) {
    const { website, auditStatus, readiness, relationWarnings, overview } = dashboard;
    const submittedUrl = website.originalUrl;
    const auditedUrl = dashboard.latest.crawl?.finalUrl ?? submittedUrl;
    const topFindings = readiness.warnings.slice(0, 3);

    return (
        <AuditSection
            id={AUDIT_SECTIONS.summary.id}
            headingId={AUDIT_SECTIONS.summary.headingId}
            title="Audit summary"
            description="Current audit run status, progress, and highest-priority findings."
        >
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <dt className="text-sm text-base-content/60">Submitted URL</dt>
                    <dd className="mt-1 text-sm break-all">{submittedUrl}</dd>
                </div>
                <div>
                    <dt className="text-sm text-base-content/60">Audited URL</dt>
                    <dd className="mt-1 text-sm break-all">{auditedUrl}</dd>
                </div>
                <div>
                    <dt className="text-sm text-base-content/60">Audit run ID</dt>
                    <dd className="mt-1 font-mono text-xs break-all">
                        {selectedAuditRunId ?? "Not selected"}
                    </dd>
                </div>
                <div>
                    <dt className="text-sm text-base-content/60">Overall job status</dt>
                    <dd className="mt-1 text-sm capitalize">
                        {activeJob?.status?.replace(/_/g, " ") ?? website.auditStatus}
                    </dd>
                </div>
            </dl>

            {activeJob ? (
                <div className="mt-6">
                    <AuditJobProgressPanel job={activeJob} embedded />
                </div>
            ) : null}

            <div className="mt-6">
                <AuditProgress auditStatus={auditStatus} />
            </div>

            <div className="mt-6">
                <AuditWarnings relationWarnings={relationWarnings} />
            </div>

            <div className="mt-6">
                <AuditActionPanel readiness={readiness} />
            </div>

            {topFindings.length > 0 ? (
                <div className="mt-6 rounded-xl bg-warning/10 p-4" role="status">
                    <h3 className="text-sm font-semibold text-base-content">Priority findings</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-base-content/80">
                        {topFindings.map((finding) => (
                            <li key={finding} className="break-words">
                                {finding}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            <div className="mt-6">
                <AuditOverview
                    overview={overview}
                    aiAnalysisStatus={website.aiAnalysisStatus}
                    embedded
                />
            </div>
        </AuditSection>
    );
}
