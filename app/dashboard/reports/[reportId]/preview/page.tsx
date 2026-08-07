import Link from "next/link";
import { notFound } from "next/navigation";
import PublicReportView from "@/components/public-report/public-report-view";
import { getPublicReportById } from "@/src/data/public-reports";
import PublishReportButton from "@/components/public-report/publish-report-button";

export default async function DashboardReportPreviewPage({
    params,
}: {
    params: Promise<{ reportId: string }>;
}) {
    const { reportId } = await params;
    const report = await getPublicReportById(reportId);
    if (!report) {
        notFound();
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <section className="rounded-2xl bg-base-100 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm text-base-content/60">Report preview</p>
                        <p className="text-sm text-base-content">
                            Revision {report.revisionNumber} · {report.status}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/dashboard/websites/${report.websiteId}`}
                            className="btn btn-outline btn-sm"
                        >
                            Back to website
                        </Link>
                        {report.status === "draft" || report.status === "unpublished" ? (
                            <PublishReportButton reportId={report.id} />
                        ) : null}
                    </div>
                </div>
            </section>
            <PublicReportView report={report} mode="preview" />
        </div>
    );
}
