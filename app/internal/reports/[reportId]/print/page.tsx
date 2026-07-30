import { notFound } from "next/navigation";
import PublicReportView from "@/components/public-report/public-report-view";
import PdfReportReadyMarker from "@/components/public-report/pdf-report-ready-marker";
import { loadPdfPrintReport } from "@/src/services/pdf-reports/load-pdf-print-report";
import "@/src/styles/public-report-print.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function headers() {
    return {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
    };
}

type PrintPageProps = {
    params: Promise<{ reportId: string }>;
    searchParams: Promise<{ renderToken?: string }>;
};

export default async function InternalReportPrintPage({ params, searchParams }: PrintPageProps) {
    const { reportId } = await params;
    const query = await searchParams;
    const renderToken = query.renderToken?.trim();

    if (!renderToken) {
        notFound();
    }

    const loaded = await loadPdfPrintReport({
        publicReportId: reportId,
        renderToken,
    });

    if (!loaded) {
        notFound();
    }

    return (
        <PdfReportReadyMarker>
            <PublicReportView report={loaded.report} mode="pdf" />
        </PdfReportReadyMarker>
    );
}
