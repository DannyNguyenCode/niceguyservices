import { Document, Page } from "@react-pdf/renderer";
import type { AuditPdfViewModel } from "@/src/services/pdf-reports/build-pdf-view-model";
import { auditPdfStyles as s } from "./auditPdfStyles";
import { PdfPageChrome } from "./shared";
import {
    AccessibilitySectionContent,
    CoverPageContent,
    HomepageChangesContent,
    HomepagePreviewContent,
    PerformanceContent,
    PriorityActionPlanContent,
    SeoSectionContent,
    UxSectionContent,
} from "./sections";

export type AuditReportDocumentProps = {
    model: AuditPdfViewModel;
};

export function AuditReportDocument({ model }: AuditReportDocumentProps) {
    return (
        <Document
            title={model.title}
            author="Nice Guy Web Design"
            subject={`Website audit report for ${model.domain}`}
            creator="Nice Guy Web Design"
            producer="Nice Guy Website Audit Platform"
        >
            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <CoverPageContent model={model} />
            </Page>

            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <HomepagePreviewContent model={model} />
            </Page>

            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <HomepageChangesContent model={model} />
            </Page>

            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <PerformanceContent model={model} />
            </Page>

            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <UxSectionContent model={model} />
            </Page>

            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <SeoSectionContent model={model} />
            </Page>

            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <AccessibilitySectionContent model={model} />
            </Page>

            <Page size="LETTER" style={s.page}>
                <PdfPageChrome domain={model.domain} />
                <PriorityActionPlanContent model={model} />
            </Page>
        </Document>
    );
}
