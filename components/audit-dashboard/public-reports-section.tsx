"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import PublishReportButton from "@/components/public-report/publish-report-button";
import PdfReportActions from "@/components/audit-dashboard/pdf-report-actions";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { PDF_REPORT_VERSION } from "@/src/services/pdf-reports/constants";
import type { SerializablePdfReport } from "@/src/services/pdf-reports/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

type PublicReportsSectionProps = {
    websiteId: string;
    isAuditReadyForReport: boolean;
    reports: SerializablePublicReport[];
    pdfReports?: SerializablePdfReport[];
};

export default function PublicReportsSection({
    websiteId,
    isAuditReadyForReport,
    reports,
    pdfReports = [],
}: PublicReportsSectionProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function runAction(reportId: string, action: "unpublish" | "archive" | "rotate-token") {
        setMessage(null);
        startTransition(async () => {
            const response = await fetch(`/api/admin/reports/${reportId}/${action}`, {
                method: "POST",
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Action failed.");
                return;
            }
            if (result.publicUrl) {
                try {
                    await navigator.clipboard.writeText(result.publicUrl);
                    setMessage("New public URL copied.");
                } catch {
                    setMessage(`New URL: ${result.publicUrl}`);
                }
            } else {
                setMessage(result.message ?? "Action completed.");
            }
            router.refresh();
        });
    }

    return (
        <section id="public-reports" className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-base-content">Public reports</h2>
                    <p className="mt-2 text-sm text-base-content/75">
                        Create a saved snapshot and publish a tokenized client-facing report.
                    </p>
                </div>
                {isAuditReadyForReport ? (
                    <Link
                        href={`/dashboard/websites/${websiteId}/reports/new`}
                        className="btn btn-primary btn-sm"
                    >
                        Create report
                    </Link>
                ) : (
                    <p className="text-sm text-base-content/70">
                        Complete the audit before creating a public report.
                    </p>
                )}
            </div>

            {message ? (
                <p className="mt-4 text-sm text-base-content/75" role="status">
                    {message}
                </p>
            ) : null}

            {reports.length === 0 ? (
                <p className="mt-4 text-sm text-base-content/70">No public report revisions yet.</p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-4">
                    {reports.map((report) => {
                        const reportPdfs = pdfReports.filter(
                            (pdf) => pdf.publicReportId === report.id,
                        );
                        const latestPdf = reportPdfs[0] ?? null;
                        const matchingPdf = reportPdfs.find(
                            (pdf) =>
                                pdf.status === "complete" &&
                                pdf.source.snapshotChecksum ===
                                    calculateSnapshotChecksum(report) &&
                                pdf.pdfVersion === PDF_REPORT_VERSION,
                        );

                        return (
                        <div key={report.id} className="rounded-xl bg-base-200 p-4 shadow-sm">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-base-content">
                                        Revision {report.revisionNumber} · {report.status}
                                    </p>
                                    <p className="mt-1 text-sm text-base-content/70">{report.title}</p>
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-base-content/65">
                                        <span>Created {formatWebsiteDate(report.createdAt)}</span>
                                        {report.publishedAt ? (
                                            <span>Published {formatWebsiteDate(report.publishedAt)}</span>
                                        ) : null}
                                        <span>Views {report.viewCount}</span>
                                        {report.tokenPrefix ? (
                                            <span>Token prefix {report.tokenPrefix}…</span>
                                        ) : null}
                                        <span>
                                            PDF versions {reportPdfs.length}
                                            {latestPdf?.generatedAt
                                                ? ` · latest ${formatWebsiteDate(latestPdf.generatedAt)}`
                                                : ""}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-xs text-base-content/60">
                                            PDF source: Public Report Revision {report.revisionNumber}
                                        </p>
                                        <div className="mt-2">
                                            <PdfReportActions
                                                publicReportId={report.id}
                                                matchingPdfExists={Boolean(matchingPdf)}
                                                downloadUrl={
                                                    matchingPdf
                                                        ? `/api/admin/pdf-reports/${matchingPdf.id}/download`
                                                        : null
                                                }
                                                allowArchived={report.status === "archived"}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href={`/dashboard/reports/${report.id}/preview`}
                                        className="btn btn-outline btn-xs"
                                    >
                                        Preview
                                    </Link>
                                    {report.status === "draft" || report.status === "unpublished" ? (
                                        <PublishReportButton reportId={report.id} label="Publish" />
                                    ) : null}
                                    {report.status === "published" ? (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-xs"
                                                disabled={isPending}
                                                onClick={() => runAction(report.id, "unpublish")}
                                            >
                                                Unpublish
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-xs"
                                                disabled={isPending}
                                                onClick={() => runAction(report.id, "rotate-token")}
                                            >
                                                Rotate token
                                            </button>
                                        </>
                                    ) : null}
                                    {report.status !== "archived" ? (
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs"
                                            disabled={isPending}
                                            onClick={() => runAction(report.id, "archive")}
                                        >
                                            Archive
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
