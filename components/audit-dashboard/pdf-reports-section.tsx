import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import PdfReportActions from "@/components/audit-dashboard/pdf-report-actions";
import PdfReportDeleteButton from "@/components/audit-dashboard/pdf-report-delete-button";
import {
    calculateSnapshotChecksum,
} from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { getPdfReadiness } from "@/src/services/pdf-reports/get-pdf-readiness";
import { PDF_REPORT_VERSION } from "@/src/services/pdf-reports/constants";
import type { SerializablePdfReport } from "@/src/services/pdf-reports/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

const STATUS_LABELS: Record<string, string> = {
    queued: "Queued",
    processing: "Generating",
    complete: "Ready",
    failed: "Failed",
    deleted: "Asset deleted",
    "not-generated": "Not generated",
};

function formatBytes(bytes: number | null | undefined): string {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type PdfReportsSectionProps = {
    websiteActive: boolean;
    publicReports: SerializablePublicReport[];
    pdfReports: SerializablePdfReport[];
};

export default function PdfReportsSection({
    websiteActive,
    publicReports,
    pdfReports,
}: PdfReportsSectionProps) {
    const latestPublicReport = publicReports[0] ?? null;
    const latestPdf = pdfReports[0] ?? null;
    const matchingPdf =
        latestPublicReport &&
        pdfReports.find(
            (pdf) =>
                pdf.status === "complete" &&
                pdf.publicReportId === latestPublicReport.id &&
                pdf.source.snapshotChecksum === calculateSnapshotChecksum(latestPublicReport) &&
                pdf.pdfVersion === PDF_REPORT_VERSION,
        );

    const readiness = getPdfReadiness({
        report: latestPublicReport,
        websiteActive,
        hasActiveGeneration: pdfReports.some((pdf) =>
            ["queued", "processing"].includes(pdf.status),
        ),
        matchingPdfId: matchingPdf?.id ?? null,
    });

    return (
        <section id="pdf-reports" className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-base-content">PDF reports</h2>
                    <p className="mt-2 text-sm text-base-content/75">
                        Generate branded PDF files from saved public-report snapshots.
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-base-content">PDF readiness</h3>
                    <p className="mt-2 text-sm text-base-content/75">
                        {readiness.canGenerate
                            ? "Ready to generate a PDF from the latest saved report snapshot."
                            : readiness.blockers[0]?.message ?? "PDF generation is not available."}
                    </p>
                    {readiness.snapshotChecksum ? (
                        <p className="mt-2 text-xs text-base-content/60">
                            Snapshot checksum: {readiness.snapshotChecksum.slice(0, 8)}…
                        </p>
                    ) : null}
                </div>

                {latestPublicReport ? (
                    <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-base-content">Source report</h3>
                        <p className="mt-2 text-sm text-base-content/75">
                            PDF source: Public Report Revision {latestPublicReport.revisionNumber}
                        </p>
                        <p className="mt-1 text-sm text-base-content/75">{latestPublicReport.title}</p>
                        <div className="mt-4">
                            <PdfReportActions
                                publicReportId={latestPublicReport.id}
                                matchingPdfExists={readiness.matchingPdfExists}
                                downloadUrl={
                                    matchingPdf
                                        ? `/api/admin/pdf-reports/${matchingPdf.id}/download`
                                        : null
                                }
                                allowArchived={latestPublicReport.status === "archived"}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                        <p className="text-sm text-base-content/75">
                            Create a public report snapshot before generating a PDF.
                        </p>
                    </div>
                )}
            </div>

            {latestPdf ? (
                <div className="mt-4 rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-base-content">Latest PDF generation</h3>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-base-content/75 md:grid-cols-2">
                        <p>Status: {STATUS_LABELS[latestPdf.status] ?? latestPdf.status}</p>
                        <p>PDF version: {latestPdf.pdfVersion}</p>
                        <p>
                            Generated:{" "}
                            {latestPdf.generatedAt
                                ? formatWebsiteDate(latestPdf.generatedAt)
                                : "—"}
                        </p>
                        <p>File size: {formatBytes(latestPdf.file?.bytes)}</p>
                        <p>Filename: {latestPdf.file?.filename ?? "—"}</p>
                        <p>Revision: r{latestPdf.source.publicReportRevision}</p>
                        {latestPdf.errorMessage ? (
                            <p className="text-error md:col-span-2">{latestPdf.errorMessage}</p>
                        ) : null}
                    </div>
                    {latestPdf.status === "complete" && latestPdf.file?.filename ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <a
                                href={`/api/admin/pdf-reports/${latestPdf.id}/download`}
                                className="btn btn-outline btn-sm"
                            >
                                Download PDF
                            </a>
                            <PdfReportActions
                                publicReportId={latestPdf.publicReportId}
                                matchingPdfExists
                                downloadUrl={`/api/admin/pdf-reports/${latestPdf.id}/download`}
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}

            {pdfReports.length > 0 ? (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-base-content">PDF history</h3>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                        {pdfReports.map((pdf) => (
                            <div
                                key={pdf.id}
                                className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm"
                            >
                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div className="grid grid-cols-1 gap-1 text-sm text-base-content/75">
                                        <p className="font-medium text-base-content">
                                            {pdf.file?.filename ?? `PDF run ${pdf.id.slice(-6)}`}
                                        </p>
                                        <p>
                                            {pdf.generatedAt
                                                ? formatWebsiteDate(pdf.generatedAt)
                                                : formatWebsiteDate(pdf.createdAt)}{" "}
                                            · {STATUS_LABELS[pdf.status] ?? pdf.status}
                                        </p>
                                        <p>
                                            Revision r{pdf.source.publicReportRevision} ·{" "}
                                            {pdf.pdfVersion} · {formatBytes(pdf.file?.bytes)}
                                        </p>
                                        <p>Engine: {pdf.render.engine}</p>
                                        {pdf.errorMessage ? <p className="text-error">{pdf.errorMessage}</p> : null}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {pdf.status === "complete" ? (
                                            <a
                                                href={`/api/admin/pdf-reports/${pdf.id}/download`}
                                                className="btn btn-outline btn-xs"
                                            >
                                                Download
                                            </a>
                                        ) : null}
                                        {pdf.status !== "deleted" && pdf.file?.publicId ? (
                                            <PdfReportDeleteButton pdfReportId={pdf.id} />
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-sm text-base-content/70">No PDF versions yet.</p>
            )}
        </section>
    );
}
