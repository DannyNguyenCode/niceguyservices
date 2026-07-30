import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { SerializablePublicReport } from "@/src/types/public-report";

type PublicReportHeaderProps = {
    report: SerializablePublicReport;
};

export default function PublicReportHeader({ report }: PublicReportHeaderProps) {
    const { branding } = report;
    const reportDate = report.publishedAt ?? report.createdAt;

    return (
        <header className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
            <p className="text-sm text-base-content/60">Website audit report</p>
            <h1 className="mt-2 text-2xl font-semibold text-base-content sm:text-3xl">
                {report.title}
            </h1>
            {report.subtitle ? (
                <p className="mt-2 text-sm text-base-content/75">{report.subtitle}</p>
            ) : null}
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-base-content/75">
                {branding.businessName ? <p>{branding.businessName}</p> : null}
                {branding.normalizedDomain ? <p>{branding.normalizedDomain}</p> : null}
                {branding.location ? <p>{branding.location}</p> : null}
                <p>Prepared by {branding.reportPreparedBy}</p>
                <p>{formatWebsiteDate(reportDate)}</p>
                <p>Report revision {report.revisionNumber}</p>
            </div>
        </header>
    );
}
