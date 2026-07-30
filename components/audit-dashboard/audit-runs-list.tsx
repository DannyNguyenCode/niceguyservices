"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import StatusBadge from "@/components/audit-dashboard/status-badge";
import type { AuditRunListItem } from "@/src/services/audit-history/types";

type AuditRunsListProps = {
    websiteId: string;
    initialStatus?: string;
    initialIncludeArchived?: boolean;
};

export default function AuditRunsList({
    websiteId,
    initialStatus,
    initialIncludeArchived = false,
}: AuditRunsListProps) {
    const [items, setItems] = useState<AuditRunListItem[]>([]);
    const [status, setStatus] = useState(initialStatus ?? "");
    const [includeArchived, setIncludeArchived] = useState(initialIncludeArchived);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(
        async (cursor?: string | null, append = false) => {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            params.set("limit", "20");
            if (status) params.set("status", status);
            if (includeArchived) params.set("includeArchived", "true");
            if (cursor) params.set("before", cursor);

            const response = await fetch(`/api/admin/websites/${websiteId}/audits?${params}`);
            const data = await response.json();
            if (!response.ok || !data.success) {
                setError(data.error?.message ?? "Unable to load audits.");
                setLoading(false);
                return;
            }

            setItems((current) => (append ? [...current, ...data.items] : data.items));
            setNextCursor(data.nextCursor);
            setHasMore(Boolean(data.hasMore));
            setLoading(false);
        },
        [websiteId, status, includeArchived],
    );

    useEffect(() => {
        void load();
    }, [load]);

    async function archiveAudit(auditRunId: string) {
        if (!window.confirm("Archive this audit run? Historical data will be preserved.")) return;
        const response = await fetch(`/api/admin/audits/${auditRunId}/archive`, { method: "POST" });
        const data = await response.json();
        if (!response.ok || !data.success) {
            window.alert(data.error?.message ?? "Unable to archive audit.");
            return;
        }
        void load();
    }

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="form-control">
                    <span className="label-text">Status filter</span>
                    <select
                        className="select select-bordered select-sm"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="complete">Complete</option>
                        <option value="partial">Partial</option>
                        <option value="failed">Failed</option>
                        <option value="queued">Queued</option>
                        <option value="crawling">Crawling</option>
                    </select>
                </label>
                <label className="label cursor-pointer justify-start gap-3 self-end">
                    <input
                        checked={includeArchived}
                        className="checkbox checkbox-sm"
                        type="checkbox"
                        onChange={(event) => setIncludeArchived(event.target.checked)}
                    />
                    <span className="label-text">Include archived</span>
                </label>
            </div>

            {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}

            <div className="mt-6 overflow-x-auto">
                <table className="table">
                    <caption className="sr-only">Audit runs for this website</caption>
                    <thead>
                        <tr>
                            <th>Audit</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Score</th>
                            <th>Mobile</th>
                            <th>Desktop</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((run) => (
                            <tr key={run.id}>
                                <td>
                                    Audit {run.auditNumber}
                                    {run.isCurrent ? (
                                        <span className="badge badge-sm badge-primary ml-2">Current</span>
                                    ) : null}
                                </td>
                                <td>{formatWebsiteDate(run.completedAt ?? run.createdAt)}</td>
                                <td>
                                    <StatusBadge status={run.status} />
                                </td>
                                <td>
                                    {run.summary.overallScore ?? (
                                        <span className="text-base-content/60">Unavailable</span>
                                    )}
                                </td>
                                <td>
                                    {run.summary.pageSpeed.mobile?.performance ?? (
                                        <span className="text-base-content/60">Unavailable</span>
                                    )}
                                </td>
                                <td>
                                    {run.summary.pageSpeed.desktop?.performance ?? (
                                        <span className="text-base-content/60">Unavailable</span>
                                    )}
                                </td>
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
                                        {!run.isArchived && run.status !== "queued" ? (
                                            <button
                                                className="btn btn-ghost btn-xs"
                                                type="button"
                                                onClick={() => void archiveAudit(run.id)}
                                            >
                                                Archive
                                            </button>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {loading ? <p className="mt-4 text-sm text-base-content/70">Loading audits…</p> : null}
            {!loading && items.length === 0 ? (
                <p className="mt-4 text-sm text-base-content/70">No audit runs match these filters.</p>
            ) : null}

            {hasMore ? (
                <button
                    className="btn btn-outline btn-sm mt-4"
                    type="button"
                    onClick={() => void load(nextCursor, true)}
                >
                    Load more
                </button>
            ) : null}
        </section>
    );
}
