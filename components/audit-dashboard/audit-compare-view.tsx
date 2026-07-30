import type { AuditComparison } from "@/src/services/audit-history/types";

type AuditCompareViewProps = {
    comparison: AuditComparison;
    websiteId: string;
};

function formatDiff(
    value:
        | {
              from: number | null;
              to: number | null;
              difference: number | null;
          }
        | undefined,
): string {
    if (!value || value.difference === null) return "Unavailable";
    if (value.difference === 0) return "No change";
    return value.difference > 0 ? `Improved by ${value.difference}` : `Declined by ${Math.abs(value.difference)}`;
}

export default function AuditCompareView({ comparison }: AuditCompareViewProps) {
    return (
        <div className="grid grid-cols-1 gap-6">
            {comparison.compatibility.warnings.length > 0 ? (
                <div className="alert alert-warning">
                    <div className="grid grid-cols-1 gap-2">
                        {comparison.compatibility.warnings.map((warning) => (
                            <p key={warning} className="text-sm">
                                {warning}
                            </p>
                        ))}
                    </div>
                </div>
            ) : null}

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Audits</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-base-200 p-4">
                        <p className="text-sm font-medium">From — Audit {comparison.from.auditNumber}</p>
                        <p className="mt-1 text-sm text-base-content/70">{comparison.from.status}</p>
                    </div>
                    <div className="rounded-xl bg-base-200 p-4">
                        <p className="text-sm font-medium">To — Audit {comparison.to.auditNumber}</p>
                        <p className="mt-1 text-sm text-base-content/70">{comparison.to.status}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">Score changes</h2>
                <dl className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                        <dt className="text-sm text-base-content/70">Overall score</dt>
                        <dd className="text-sm">{formatDiff(comparison.changes.overallScore)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Mobile performance</dt>
                        <dd className="text-sm">
                            {formatDiff(comparison.changes.pageSpeed.mobile.performance)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Desktop performance</dt>
                        <dd className="text-sm">
                            {formatDiff(comparison.changes.pageSpeed.desktop.performance)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Pages crawled</dt>
                        <dd className="text-sm">{formatDiff(comparison.changes.pagesCrawled)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Strengths</dt>
                        <dd className="text-sm">{formatDiff(comparison.changes.strengths)}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-base-content/70">Weaknesses</dt>
                        <dd className="text-sm">{formatDiff(comparison.changes.weaknesses)}</dd>
                    </div>
                </dl>
            </section>

            {comparison.changes.categoryScores.length > 0 ? (
                <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold">Category scores</h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="table table-sm">
                            <caption className="sr-only">Category score comparison</caption>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.changes.categoryScores.map((row) => (
                                    <tr key={row.category}>
                                        <td>{row.category}</td>
                                        <td>{row.from ?? "Unavailable"}</td>
                                        <td>{row.to ?? "Unavailable"}</td>
                                        <td>
                                            {row.difference === null
                                                ? "Unavailable"
                                                : row.difference === 0
                                                  ? "No change"
                                                  : row.difference > 0
                                                    ? `Improved by ${row.difference}`
                                                    : `Declined by ${Math.abs(row.difference)}`}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}
        </div>
    );
}
