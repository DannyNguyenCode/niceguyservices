"use client";

import {
    ArrowDownTrayIcon,
    DocumentTextIcon,
    PrinterIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import type { WorkbookPdfPreview } from "./useWorkbookPdf";
import { workbookPrimaryBtnClass } from "./workbookLayoutConstants";

type WorkbookPdfPreviewModalProps = {
    preview: WorkbookPdfPreview | null;
    onClose: () => void;
    onDownload: () => void;
    onPrint: () => void;
};

export function WorkbookPdfPreviewModal({
    preview,
    onClose,
    onDownload,
    onPrint,
}: WorkbookPdfPreviewModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const open = preview !== null;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open) {
            if (!dialog.open) dialog.showModal();
        } else if (dialog.open) {
            dialog.close();
        }
    }, [open]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => {
            onClose();
        };

        dialog.addEventListener("close", handleClose);
        return () => dialog.removeEventListener("close", handleClose);
    }, [onClose]);

    if (!open || !preview) return null;

    const title = preview.blank
        ? "Blank workbook preview"
        : "Workbook preview";

    return (
        <dialog
            ref={dialogRef}
            className="modal sm:modal-middle workbook-pdf-preview-dialog"
            aria-labelledby="workbook-pdf-preview-title"
        >
            <div className="modal-box flex h-[min(92vh,820px)] w-[min(96vw,920px)] max-w-none flex-col gap-0 p-0">
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-base-300 px-4 py-4 md:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                        <DocumentTextIcon
                            className="mt-0.5 h-6 w-6 shrink-0 text-primary"
                            aria-hidden
                        />
                        <div className="min-w-0">
                            <h2
                                id="workbook-pdf-preview-title"
                                className="font-pm-headline text-base font-bold text-(--pm-on-surface) md:text-lg"
                            >
                                {title}
                            </h2>
                            <p className="mt-1 font-pm-body text-sm text-(--pm-on-surface-variant)">
                                Review the PDF below, then print or download when you are ready.
                            </p>
                        </div>
                    </div>
                    <form method="dialog">
                        <button
                            type="submit"
                            className="btn btn-sm btn-ghost btn-square shrink-0"
                            aria-label="Close preview"
                            onClick={onClose}
                        >
                            <XMarkIcon className="h-5 w-5" aria-hidden />
                        </button>
                    </form>
                </div>

                <div className="min-h-0 flex-1 bg-base-200 p-3 md:p-4">
                    <iframe
                        src={preview.url}
                        title={title}
                        className="h-full w-full rounded-lg border border-base-300 bg-white"
                    />
                </div>

                <div className="flex shrink-0 flex-col gap-2 border-t border-base-300 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                    <p className="font-pm-body text-sm text-(--pm-on-surface-variant)">
                        {preview.blank
                            ? "Print this blank version and complete it by hand."
                            : "This preview includes your saved answers from this device."}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={onPrint}
                            className={workbookPrimaryBtnClass}
                        >
                            <PrinterIcon className="h-4 w-4" aria-hidden />
                            Print
                        </button>
                        <button
                            type="button"
                            onClick={onDownload}
                            className="btn btn-sm btn-outline border-base-300 font-pm-body font-semibold normal-case hover:border-primary hover:text-primary"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4" aria-hidden />
                            Download PDF
                        </button>
                        <form method="dialog">
                            <button
                                type="submit"
                                className="btn btn-sm btn-ghost font-pm-body font-semibold normal-case"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button aria-label="Close preview" onClick={onClose} />
            </form>
        </dialog>
    );
}
