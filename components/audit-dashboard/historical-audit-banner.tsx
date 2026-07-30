import Link from "next/link";

type HistoricalAuditBannerProps = {
    websiteId: string;
    auditNumber: number;
    auditRunId: string;
    status: string;
};

export default function HistoricalAuditBanner({
    websiteId,
    auditNumber,
    auditRunId,
    status,
}: HistoricalAuditBannerProps) {
    return (
        <div className="alert alert-info shadow-sm" role="status">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="font-medium">
                        Viewing historical audit {auditNumber} ({status})
                    </p>
                    <p className="text-sm opacity-80">
                        Stage sections below show results from this audit run, not the latest data.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        className="btn btn-sm btn-outline"
                        href={`/dashboard/websites/${websiteId}/audits/${auditRunId}`}
                    >
                        Audit details
                    </Link>
                    <Link className="btn btn-sm btn-primary" href={`/dashboard/websites/${websiteId}`}>
                        Return to current view
                    </Link>
                </div>
            </div>
        </div>
    );
}
