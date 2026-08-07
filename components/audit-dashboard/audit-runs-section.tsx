import Link from "next/link";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import StatusBadge from "@/components/audit-dashboard/status-badge";
import AuditSection from "@/components/audit/shared/audit-section";
import { AUDIT_SECTIONS } from "@/src/lib/audit-sections";
import { getAuditRunCountsForWebsite, getAuditRunsForWebsite } from "@/src/data/audit-runs";
import type { AuditRunListItem } from "@/src/services/audit-history/types";

type AuditRunsSectionProps = {
    websiteId: string;
};

function formatScore(value: number | null | undefined): string {
    if (value === null || value === undefined) return "Unavailable";
    return String(value);
}

function scoreChange(
    previous: number | null | undefined,
    current: number | null | undefined,
): string {
    if (
        previous === null ||
        previous === undefined ||
        current === null ||
        current === undefined
    ) {
        return "Unavailable";
    }
    const diff = current - previous;
    if (diff === 0) return "No change";
    return diff > 0 ? `Improved by ${diff}` : `Declined by ${Math.abs(diff)}`;
}

function AuditRunRow({ run, websiteId }: { run: AuditRunListItem; websiteId: string }) {
    return (
        <tr>
            <td className="font-medium">
                Audit {run.auditNumber}
                {run.isCurrent ? (
                    <span className="badge badge-sm badge-primary ml-2">Current</span>
                ) : null}
                {run.isArchived ? (
                    <span className="badge badge-sm badge-ghost ml-2">Archived</span>
                ) : null}
            </td>
            <td>{formatWebsiteDate(run.completedAt ?? run.createdAt)}</td>
            <td>
                <StatusBadge status={run.status} />
            </td>
            <td>{formatScore(run.summary.overallScore)}</td>
            <td>{formatScore(run.summary.pageSpeed.mobile?.performance)}</td>
            <td>{formatScore(run.summary.pageSpeed.desktop?.performance)}</td>
            <td>{run.summary.pagesCrawled ?? "—"}</td>
            <td>{run.summary.warningCount}</td>
            <td>{run.summary.errorCount}</td>
            <td>
                <div className="flex flex-wrap gap-2">
                    <Link
                        className="btn btn-ghost btn-xs"
                        href={`/dashboard/websites/${websiteId}/audits/${run.id}`}
                    >
                        Open
                    </Link>
                    <Link
                        className="btn btn-ghost btn-xs"
                        href={`/dashboard/websites/${websiteId}/audits/compare?from=${run.id}`}
                    >
                        Compare
                    </Link>
                </div>
            </td>
        </tr>
    );
}

export default async function AuditRunsSection({ websiteId }: AuditRunsSectionProps) {
    const [{ items }, counts] = await Promise.all([
        getAuditRunsForWebsite({ websiteId, limit: 5 }),
        getAuditRunCountsForWebsite(websiteId),
    ]);

    const current = counts.current;
    const previous = items.find((item) => !item.isCurrent && item.status === "complete") ?? null;

    return (
        <AuditSection
            id={AUDIT_SECTIONS.auditRuns.id}
            headingId={AUDIT_SECTIONS.auditRuns.headingId}
            title="Audit runs"
            description="Complete end-to-end audit executions with immutable snapshots of crawl, metrics, AI analysis, and linked outputs."
        >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="sr-only" aria-hidden="true">
                    Audit run history summary
                </div>
                <Link
                    className="btn btn-sm btn-outline w-full sm:w-auto"
                    href={`/dashboard/websites/${websiteId}/audits`}
                >
                    View all audits
                </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm text-base-content/70">Audit count</p>
                    <p className="mt-1 text-2xl font-semibold">{counts.total}</p>
                </div>
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm text-base-content/70">Current score</p>
                    <p className="mt-1 text-2xl font-semibold">
                        {formatScore(current?.summary.overallScore)}
                    </p>
                    <p className="mt-1 text-sm text-base-content/70">
                        Change: {scoreChange(previous?.summary.overallScore, current?.summary.overallScore)}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm text-base-content/70">Mobile performance</p>
                    <p className="mt-1 text-2xl font-semibold">
                        {formatScore(current?.summary.pageSpeed.mobile?.performance)}
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-sm text-base-content/70">Desktop performance</p>
                    <p className="mt-1 text-2xl font-semibold">
                        {formatScore(current?.summary.pageSpeed.desktop?.performance)}
                    </p>
                </div>
            </div>

            {items.length === 0 ? (
                <p className="mt-6 text-sm text-base-content/70">No audit runs yet.</p>
            ) : (
                <div className="mt-6">
                    <p className="mb-2 text-xs text-base-content/60 md:hidden">
                        Swipe horizontally to view all columns.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-base-200">
                        <table className="table table-sm">
                            <caption className="sr-only">Recent audit runs</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Audit</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Score</th>
                                    <th scope="col">Mobile</th>
                                    <th scope="col">Desktop</th>
                                    <th scope="col">Pages</th>
                                    <th scope="col">Warnings</th>
                                    <th scope="col">Errors</th>
                                    <th scope="col">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((run) => (
                                    <AuditRunRow key={run.id} run={run} websiteId={websiteId} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AuditSection>
    );
}
