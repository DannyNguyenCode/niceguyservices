import StatusBadge from "@/components/audit-dashboard/status-badge";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";

const STAGE_LABELS: Record<string, string> = {
    preflight: "URL preflight",
    crawl: "Website crawl",
    screenshots: "Screenshots",
    pagespeed_mobile: "PageSpeed (mobile)",
    pagespeed_desktop: "PageSpeed (desktop)",
    niceguy: "Nice Guy Metrics",
    ai_analysis: "AI expert analysis",
    finalize: "Finalizing audit",
    report_draft: "Creating report draft",
};

const STAGE_STATUS_LABELS: Record<string, string> = {
    pending: "Waiting",
    queued: "Queued",
    processing: "Running…",
    waiting_for_external: "Waiting for Cursor…",
    completed: "✓ Complete",
    completed_with_warnings: "Complete (warnings)",
    failed: "Failed",
    skipped: "Skipped",
};

function describeStageStatus(stageName: string, status: string, stages: SerializableAuditJob["stages"]): string {
    if (stageName === "niceguy" && (status === "pending" || status === "queued")) {
        const crawlStatus = stages.crawl?.status;
        if (crawlStatus === "processing" || crawlStatus === "queued" || crawlStatus === "pending") {
            return "Waiting for crawl";
        }
    }
    if (stageName === "ai_analysis" && (status === "pending" || status === "queued")) {
        return "Waiting for evidence";
    }
    return STAGE_STATUS_LABELS[status] ?? status;
}

type AuditJobProgressPanelProps = {
    job: SerializableAuditJob;
    embedded?: boolean;
};

export default function AuditJobProgressPanel({
    job,
    embedded = false,
}: AuditJobProgressPanelProps) {
    const currentLabel = job.currentStage ? STAGE_LABELS[job.currentStage] ?? job.currentStage : null;

    const content = (
        <>
            {!embedded ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-base-content">Automated audit</h2>
                        <p className="mt-1 text-sm text-base-content/70">
                            Audit run {job.auditRunId.slice(-6)} · Job {job.id.slice(-6)}
                        </p>
                    </div>
                    <StatusBadge status={job.status} label={job.status.replace(/_/g, " ")} />
                </div>
            ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-base-content">Automated audit progress</p>
                    <StatusBadge status={job.status} label={job.status.replace(/_/g, " ")} />
                </div>
            )}

            <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/70">
                        {currentLabel ?? (job.status === "queued" ? "Queued" : "Audit complete")}
                    </span>
                    <span className="font-medium text-base-content">{job.progressPercent}%</span>
                </div>
                <progress
                    className="progress progress-primary mt-2 w-full"
                    value={job.progressPercent}
                    max={100}
                />
            </div>

            {job.error ? (
                <p className="mt-4 text-sm text-error" role="alert">
                    {job.error.message}
                </p>
            ) : null}

            <ul className="mt-4 space-y-2">
                {Object.entries(job.stages)
                    .filter(([, stage]) => stage.status !== "skipped")
                    .map(([name, stage]) => (
                    <li
                        key={name}
                        className="flex items-center justify-between rounded-lg bg-base-200 px-3 py-2 text-sm"
                    >
                        <span>{STAGE_LABELS[name] ?? name}</span>
                        <span className="text-base-content/70">
                            {describeStageStatus(name, stage.status, job.stages)}
                            {stage.attempt > 1 ? ` · attempt ${stage.attempt}` : ""}
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );

    if (embedded) {
        return <div className="rounded-xl bg-base-200/50 p-4">{content}</div>;
    }

    return <section className="rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6">{content}</section>;
}
