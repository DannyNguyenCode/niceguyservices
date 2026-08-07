import Link from "next/link";
import { notFound } from "next/navigation";
import ActivitySection from "@/components/audit-dashboard/activity-section";
import StatusBadge from "@/components/audit-dashboard/status-badge";
import { getAuditRunById } from "@/src/data/audit-runs";
import { getWebsiteById } from "@/src/data/websites";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";

function formatDuration(startedAt: string | null, completedAt: string | null): string {
    if (!startedAt || !completedAt) return "Unavailable";
    const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
    if (ms < 0) return "Unavailable";
    return `${(ms / 1000).toFixed(1)} s`;
}

function ResourceLink({
    label,
    href,
    count,
}: {
    label: string;
    href: string | null;
    count: number;
}) {
    if (!href || count === 0) return null;
    return (
        <li>
            <Link className="link link-hover" href={href}>
                {label} ({count})
            </Link>
        </li>
    );
}

export default async function AuditRunDetailPage({
    params,
}: {
    params: Promise<{ id: string; auditRunId: string }>;
}) {
    const { id, auditRunId } = await params;
    const [website, auditRun] = await Promise.all([getWebsiteById(id), getAuditRunById(auditRunId)]);

    if (!website || !auditRun || auditRun.websiteId !== id) {
        notFound();
    }

    const refs = auditRun.references;
    const crawlId = refs.crawlDataIds[refs.crawlDataIds.length - 1] ?? null;

    return (
        <div className="grid grid-cols-1 gap-6">
            <div>
                <Link
                    className="text-sm text-base-content/70 hover:text-base-content"
                    href={`/dashboard/websites/${id}/audits`}
                >
                    ← Back to audit history
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold text-base-content">
                        Audit {auditRun.auditNumber}
                    </h1>
                    <StatusBadge status={auditRun.status} />
                    {auditRun.isCurrent ? (
                        <span className="badge badge-primary">Current audit</span>
                    ) : null}
                    {auditRun.isArchived ? (
                        <span className="badge badge-ghost">Archived</span>
                    ) : null}
                </div>
            </div>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Overview</h2>
                <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-base-content/70">Website at audit time</dt>
                        <dd className="text-sm">{auditRun.source.websiteUrl}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Business name</dt>
                        <dd className="text-sm">{auditRun.source.businessName ?? "—"}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Started</dt>
                        <dd className="text-sm">
                            {auditRun.startedAt ? formatWebsiteDate(auditRun.startedAt) : "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Completed</dt>
                        <dd className="text-sm">
                            {auditRun.completedAt ? formatWebsiteDate(auditRun.completedAt) : "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Duration</dt>
                        <dd className="text-sm">
                            {formatDuration(auditRun.startedAt, auditRun.completedAt)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Trigger</dt>
                        <dd className="text-sm">{auditRun.trigger.type}</dd>
                    </div>
                </dl>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Completion</h2>
                <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(auditRun.completion).map(([stage, value]) => (
                        <div key={stage}>
                            <dt className="text-sm capitalize text-base-content/70">{stage}</dt>
                            <dd className="text-sm">{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Summary</h2>
                <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <dt className="text-sm text-base-content/70">Overall score</dt>
                        <dd className="text-sm">{auditRun.summary.overallScore ?? "Unavailable"}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Mobile performance</dt>
                        <dd className="text-sm">
                            {auditRun.summary.pageSpeed.mobile?.performance ?? "Unavailable"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Desktop performance</dt>
                        <dd className="text-sm">
                            {auditRun.summary.pageSpeed.desktop?.performance ?? "Unavailable"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Pages crawled</dt>
                        <dd className="text-sm">{auditRun.summary.pagesCrawled ?? "Unavailable"}</dd>
                    </div>
                </dl>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Versions</h2>
                <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {Object.entries(auditRun.versions).map(([key, value]) => (
                        <div key={key}>
                            <dt className="text-sm text-base-content/70">{key}</dt>
                            <dd className="text-sm">{value ?? "—"}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Configuration</h2>
                <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-base-content/70">Screenshots</dt>
                        <dd className="text-sm">
                            {auditRun.configuration.includeScreenshots ? "Enabled" : "Disabled"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">PageSpeed</dt>
                        <dd className="text-sm">
                            {auditRun.configuration.includePageSpeed ? "Enabled" : "Disabled"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Nice Guy metrics</dt>
                        <dd className="text-sm">
                            {auditRun.configuration.includeNiceGuyMetrics ? "Enabled" : "Disabled"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">AI analysis</dt>
                        <dd className="text-sm">
                            {auditRun.configuration.includeAiAnalysis ? "Enabled" : "Disabled"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">PageSpeed strategies</dt>
                        <dd className="text-sm">
                            {auditRun.configuration.pageSpeedStrategies.join(", ")}
                        </dd>
                    </div>
                </dl>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Related resources</h2>
                <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <ResourceLink
                        count={refs.crawlDataIds.length}
                        href={
                            crawlId
                                ? `/dashboard/websites/${id}?auditRunId=${auditRunId}#crawl`
                                : null
                        }
                        label="Crawl data"
                    />
                    <ResourceLink
                        count={refs.screenshotIds.length}
                        href={
                            crawlId
                                ? `/dashboard/websites/${id}?auditRunId=${auditRunId}#screenshots`
                                : null
                        }
                        label="Screenshots"
                    />
                    <ResourceLink
                        count={refs.googleMetricsIds.length}
                        href={`/dashboard/websites/${id}?auditRunId=${auditRunId}#pagespeed`}
                        label="PageSpeed results"
                    />
                    <ResourceLink
                        count={refs.niceGuyMetricsId ? 1 : 0}
                        href={`/dashboard/websites/${id}?auditRunId=${auditRunId}#metrics`}
                        label="Nice Guy metrics"
                    />
                    <ResourceLink
                        count={refs.aiSummaryId ? 1 : 0}
                        href={`/dashboard/websites/${id}?auditRunId=${auditRunId}#ai`}
                        label="AI summary"
                    />
                    <ResourceLink
                        count={refs.publicReportIds.length}
                        href={`/dashboard/websites/${id}#public-reports`}
                        label="Public reports"
                    />
                </ul>
            </section>

            <ActivitySection
                auditRunId={auditRunId}
                title="Audit activity"
                websiteId={id}
            />
        </div>
    );
}
