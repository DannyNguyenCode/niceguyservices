import { Font, pdf, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { WorkbookAnswers } from "@/lib/clientDiscoveryWorkbook/types";
import { WorkbookPdfDocument } from "./WorkbookPdfDocument";
import { workbookPdfFilename } from "./workbookPdfFilename";

async function ensureWorkbookPdfFonts(): Promise<void> {
    await Promise.all([
        Font.load({ fontFamily: "Helvetica", fontStyle: "normal", fontWeight: 400 }),
        Font.load({ fontFamily: "Helvetica", fontStyle: "normal", fontWeight: 700 }),
        Font.load({ fontFamily: "Helvetica-Bold", fontStyle: "normal", fontWeight: 700 }),
        Font.load({ fontFamily: "Times-Roman", fontStyle: "normal", fontWeight: 400 }),
        Font.load({ fontFamily: "Times-Roman", fontStyle: "normal", fontWeight: 700 }),
    ]);
}

export async function generateWorkbookPdfBlob(
    answers: WorkbookAnswers,
    blank: boolean,
): Promise<Blob> {
    if (typeof window === "undefined") {
        throw new Error("PDF generation is only available in the browser.");
    }

    await ensureWorkbookPdfFonts();

    const doc = createElement(WorkbookPdfDocument, { answers, blank });
    return pdf(doc as ReactElement<DocumentProps>).toBlob();
}

export function downloadWorkbookPdfFromUrl(
    url: string,
    blank: boolean,
    businessName?: string,
): void {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = workbookPdfFilename(blank, businessName);
    anchor.click();
}

export function printWorkbookPdfFromUrl(url: string): void {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
        "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    iframe.src = url;

    iframe.onload = () => {
        const printWindow = iframe.contentWindow;
        if (!printWindow) return;

        window.setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 300);
    };

    document.body.appendChild(iframe);

    window.setTimeout(() => {
        iframe.remove();
    }, 120_000);
}
