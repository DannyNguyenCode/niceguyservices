import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import StatusBadge from "@/components/audit-dashboard/status-badge";
import type { AuditHistoryItem } from "@/src/types/audit-dashboard";

type AuditHistorySectionProps = {
    crawlRuns: AuditHistoryItem[];
    pageSpeedRuns: AuditHistoryItem[];
    niceGuyRuns: AuditHistoryItem[];
    aiRuns: AuditHistoryItem[];
};

function HistoryGroup({
    title,
    items,
}: {
    title: string;
    items: AuditHistoryItem[];
}) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            <h3 className="text-sm font-semibold text-base-content">{title}</h3>
            {items.map((item) => (
                <div key={item.id} className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-base-content">{item.label}</p>
                            <p className="mt-1 text-sm text-base-content/70">
                                {formatWebsiteDate(item.completedAt ?? item.createdAt)}
                            </p>
                        </div>
                        <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/70">
                        {item.score !== null && item.score !== undefined ? (
                            <span>Score: {item.score}</span>
                        ) : null}
                        {item.confidence !== null && item.confidence !== undefined ? (
                            <span>Confidence: {item.confidence}</span>
                        ) : null}
                        {item.version ? <span>Version: {item.version}</span> : null}
                        {item.promptVersion ? <span>Prompt: {item.promptVersion}</span> : null}
                        {item.durationMs ? (
                            <span>Duration: {(item.durationMs / 1000).toFixed(1)} s</span>
                        ) : null}
                    </div>
                    <p className="mt-2 font-mono text-xs text-base-content/50">ID: {item.id}</p>
                </div>
            ))}
        </div>
    );
}

export default function AuditHistorySection({
    crawlRuns,
    pageSpeedRuns,
    niceGuyRuns,
    aiRuns,
}: AuditHistorySectionProps) {
    const hasHistory =
        crawlRuns.length > 0 ||
        pageSpeedRuns.length > 0 ||
        niceGuyRuns.length > 0 ||
        aiRuns.length > 0;

    return (
        <section
            id="stage-execution-log"
            className="rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6 scroll-mt-24"
        >
            <h2 id="stage-execution-log-heading" className="text-lg font-semibold text-base-content">
                Stage execution log
            </h2>
            <p className="mt-2 text-sm text-base-content/70">
                Technical stage-level attempts and reruns. Use audit runs above for complete
                end-to-end executions.
            </p>

            {!hasHistory ? (
                <p className="mt-4 text-sm text-base-content/70">No historical runs yet.</p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-6">
                    <HistoryGroup title="Crawl history" items={crawlRuns} />
                    <HistoryGroup title="PageSpeed history" items={pageSpeedRuns} />
                    <HistoryGroup title="Nice Guy history" items={niceGuyRuns} />
                    <HistoryGroup title="AI analysis history" items={aiRuns} />
                </div>
            )}
        </section>
    );
}
