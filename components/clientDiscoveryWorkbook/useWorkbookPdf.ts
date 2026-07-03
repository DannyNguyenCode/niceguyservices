"use client";

import { useCallback, useEffect, useState } from "react";
import type { WorkbookAnswers } from "@/lib/clientDiscoveryWorkbook/types";

export type WorkbookPdfPreview = {
    url: string;
    blank: boolean;
};

export function useWorkbookPdf(answers: WorkbookAnswers) {
    const [pdfBusy, setPdfBusy] = useState(false);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [pdfPreview, setPdfPreview] = useState<WorkbookPdfPreview | null>(null);

    const closePdfPreview = useCallback(() => {
        setPdfPreview((current) => {
            if (current?.url) {
                URL.revokeObjectURL(current.url);
            }
            return null;
        });
    }, []);

    useEffect(() => {
        return () => {
            if (pdfPreview?.url) {
                URL.revokeObjectURL(pdfPreview.url);
            }
        };
    }, [pdfPreview?.url]);

    const openPdfPreview = useCallback(
        async (blank: boolean) => {
            if (pdfBusy) return;

            setPdfBusy(true);
            setPdfError(null);

            try {
                const { generateWorkbookPdfBlob } = await import("./pdf/workbookPdfClient");
                const blob = await generateWorkbookPdfBlob(answers, blank);
                const url = URL.createObjectURL(blob);

                setPdfPreview((current) => {
                    if (current?.url) {
                        URL.revokeObjectURL(current.url);
                    }
                    return { url, blank };
                });
            } catch (error) {
                console.error("Workbook PDF generation failed:", error);
                setPdfError("Could not generate the PDF. Please try again.");
            } finally {
                setPdfBusy(false);
            }
        },
        [answers, pdfBusy],
    );

    const downloadPdfPreview = useCallback(async () => {
        if (!pdfPreview) return;

        try {
            const { downloadWorkbookPdfFromUrl } = await import("./pdf/workbookPdfClient");
            downloadWorkbookPdfFromUrl(
                pdfPreview.url,
                pdfPreview.blank,
                answers.businessName,
            );
        } catch {
            setPdfError("Could not download the PDF. Please try again.");
        }
    }, [answers.businessName, pdfPreview]);

    const printPdfPreview = useCallback(async () => {
        if (!pdfPreview) return;

        try {
            const { printWorkbookPdfFromUrl } = await import("./pdf/workbookPdfClient");
            printWorkbookPdfFromUrl(pdfPreview.url);
        } catch {
            setPdfError("Could not open the print dialog. Try Download PDF instead.");
        }
    }, [pdfPreview]);

    return {
        pdfBusy,
        pdfError,
        pdfPreview,
        openPdfPreview,
        closePdfPreview,
        downloadPdfPreview,
        printPdfPreview,
    };
}
