import Link from "next/link";
import { notFound } from "next/navigation";
import AuditCompareView from "@/components/audit-dashboard/audit-compare-view";
import { getAuditRunsForComparison } from "@/src/data/audit-runs";
import { getWebsiteById } from "@/src/data/websites";
import { compareAuditRuns } from "@/src/services/audit-history/compare-audit-runs";

export default async function AuditComparePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ from?: string; to?: string; auditRunId?: string | string[] }>;
}) {
    const { id } = await params;
    const query = await searchParams;
    const website = await getWebsiteById(id);
    if (!website) notFound();

    const ids: string[] = [];
    if (query.from) ids.push(query.from);
    if (query.to) ids.push(query.to);
    if (Array.isArray(query.auditRunId)) ids.push(...query.auditRunId);
    else if (query.auditRunId) ids.push(query.auditRunId);

    const uniqueIds = [...new Set(ids)].slice(0, 2);
    const runs = await getAuditRunsForComparison({
        websiteId: id,
        auditRunIds: uniqueIds,
    });

    let comparison = null;
    if (runs.length === 2) {
        const ordered = [...runs].sort((a, b) => a.auditNumber - b.auditNumber);
        comparison = compareAuditRuns(ordered[0], ordered[1]);
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            <div>
                <Link
                    className="text-sm text-base-content/70 hover:text-base-content"
                    href={`/dashboard/websites/${id}/audits`}
                >
                    ← Back to audit history
                </Link>
                <h1 className="mt-2 text-2xl font-semibold text-base-content">Compare audits</h1>
                <p className="mt-1 text-sm text-base-content/70">{website.businessName || website.originalUrl}</p>
            </div>

            {comparison ? (
                <AuditCompareView comparison={comparison} websiteId={id} />
            ) : (
                <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                    <p className="text-sm text-base-content/70">
                        Select two audits from the audit history list to compare scores and outputs.
                    </p>
                    <p className="mt-2 text-sm text-base-content/70">
                        Add <code className="font-mono text-xs">?from=…&amp;to=…</code> query parameters
                        with audit run IDs.
                    </p>
                </section>
            )}
        </div>
    );
}
