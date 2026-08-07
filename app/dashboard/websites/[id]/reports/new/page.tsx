import { notFound } from "next/navigation";
import ReportBuilderForm from "@/components/public-report/report-builder-form";
import { getWebsiteAuditDashboard } from "@/src/services/get-website-audit-dashboard";

export default async function NewPublicReportPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const dashboard = await getWebsiteAuditDashboard(id);
    if (!dashboard) {
        notFound();
    }

    return <ReportBuilderForm websiteId={id} dashboard={dashboard} />;
}
