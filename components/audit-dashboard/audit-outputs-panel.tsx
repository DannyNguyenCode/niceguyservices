import { Suspense } from "react";
import DemoWebsiteSection from "@/components/audit-dashboard/demo-website-section";
import OutreachEmailSection from "@/components/audit-dashboard/outreach-email-section";
import PdfReportsSection from "@/components/audit-dashboard/pdf-reports-section";
import PublicReportsSection from "@/components/audit-dashboard/public-reports-section";
import AuditSection from "@/components/audit/shared/audit-section";
import { AUDIT_SECTIONS } from "@/src/lib/audit-sections";
import { getOutreachDraftsForWebsite } from "@/src/data/outreach-email-drafts";
import { getPdfReportsForWebsite } from "@/src/data/pdf-reports";
import { getPublicReportsForWebsite } from "@/src/data/public-reports";

type AuditOutputsPanelProps = {
    websiteId: string;
    websiteActive: boolean;
    isAuditReadyForReport: boolean;
    auditRunId: string | null;
    linkedReportIds?: string[] | null;
    linkedPdfReportIds?: string[] | null;
    linkedOutreachDraftIds?: string[] | null;
};

async function AuditOutputsContent({
    websiteId,
    websiteActive,
    isAuditReadyForReport,
    linkedReportIds,
    linkedPdfReportIds,
    linkedOutreachDraftIds,
}: Omit<AuditOutputsPanelProps, "auditRunId">) {
    const [publicReports, pdfReports, outreachDrafts] = await Promise.all([
        getPublicReportsForWebsite(websiteId),
        getPdfReportsForWebsite(websiteId),
        getOutreachDraftsForWebsite(websiteId),
    ]);

    const filteredPublicReports = linkedReportIds
        ? publicReports.filter((report) => linkedReportIds.includes(report.id))
        : publicReports;
    const filteredPdfReports = linkedPdfReportIds
        ? pdfReports.filter((pdf) => linkedPdfReportIds.includes(pdf.id))
        : pdfReports;
    const filteredOutreachDrafts = linkedOutreachDraftIds
        ? outreachDrafts.filter((draft) => linkedOutreachDraftIds.includes(draft.id))
        : outreachDrafts;

    return (
        <div className="grid grid-cols-1 gap-6">
            <PublicReportsSection
                websiteId={websiteId}
                isAuditReadyForReport={isAuditReadyForReport}
                reports={filteredPublicReports}
                pdfReports={filteredPdfReports}
            />
            <PdfReportsSection
                websiteActive={websiteActive}
                publicReports={filteredPublicReports}
                pdfReports={filteredPdfReports}
            />
            <OutreachEmailSection
                websiteActive={websiteActive}
                publicReports={filteredPublicReports}
                outreachDrafts={filteredOutreachDrafts}
            />
            <DemoWebsiteSection websiteActive={websiteActive} publicReports={publicReports} />
        </div>
    );
}

function OutputsFallback() {
    return (
        <div className="grid grid-cols-1 gap-3" aria-busy="true">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-xl bg-base-200" />
            ))}
            <p className="sr-only">Loading outputs…</p>
        </div>
    );
}

export default function AuditOutputsPanel(props: AuditOutputsPanelProps) {
    return (
        <AuditSection
            id={AUDIT_SECTIONS.outputs.id}
            headingId={AUDIT_SECTIONS.outputs.headingId}
            title="Outputs"
            description="Report drafts, PDFs, outreach drafts, and demo assets linked to this website."
        >
            <Suspense fallback={<OutputsFallback />}>
                <AuditOutputsContent {...props} />
            </Suspense>
        </AuditSection>
    );
}
