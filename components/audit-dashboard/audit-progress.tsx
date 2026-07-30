import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import StatusBadge from "@/components/audit-dashboard/status-badge";
import type { AuditStageStatus } from "@/src/types/audit-dashboard";

const STAGES: Array<{ key: string; number: number; name: string }> = [
    { key: "crawl", number: 1, name: "Crawl" },
    { key: "screenshots", number: 2, name: "Screenshots" },
    { key: "pageSpeed", number: 3, name: "PageSpeed" },
    { key: "niceGuy", number: 4, name: "Nice Guy Metrics" },
    { key: "aiAnalysis", number: 5, name: "AI Analysis" },
];

type AuditProgressProps = {
    auditStatus: {
        crawl: AuditStageStatus;
        screenshots: AuditStageStatus;
        pageSpeed: AuditStageStatus;
        niceGuy: AuditStageStatus;
        aiAnalysis: AuditStageStatus;
    };
};

export default function AuditProgress({ auditStatus }: AuditProgressProps) {
    const statusMap = {
        crawl: auditStatus.crawl,
        screenshots: auditStatus.screenshots,
        pageSpeed: auditStatus.pageSpeed,
        niceGuy: auditStatus.niceGuy,
        aiAnalysis: auditStatus.aiAnalysis,
    };

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-base-content">Audit progress</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-5">
                {STAGES.map((stage) => {
                    const status = statusMap[stage.key as keyof typeof statusMap];
                    const runTime = status.latestRunAt ?? status.completedAt;

                    return (
                        <div
                            key={stage.key}
                            className="rounded-xl bg-base-200 p-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-medium text-base-content/60">
                                    {stage.number}
                                </span>
                                <StatusBadge status={status.status} label={status.label} />
                            </div>
                            <p className="mt-3 text-sm font-medium text-base-content">
                                {stage.name}
                            </p>
                            {runTime ? (
                                <p className="mt-2 text-xs text-base-content/65">
                                    Latest: {formatWebsiteDate(runTime)}
                                </p>
                            ) : (
                                <p className="mt-2 text-xs text-base-content/65">Not run yet</p>
                            )}
                            {status.isStale ? (
                                <p className="mt-2 text-xs text-warning">{status.staleReason}</p>
                            ) : null}
                            {status.errorMessage ? (
                                <p className="mt-2 text-xs text-error" role="alert">
                                    {status.errorMessage}
                                </p>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
