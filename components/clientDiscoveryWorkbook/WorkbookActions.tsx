"use client";

import type { ReactElement } from "react";
import {
    ArrowDownTrayIcon,
    ClipboardDocumentCheckIcon,
    ComputerDesktopIcon,
    PrinterIcon,
} from "@heroicons/react/24/outline";
import type { WorkbookAnswers } from "@/lib/clientDiscoveryWorkbook/types";
import { WorkbookProgressPanel } from "./WorkbookProgress";
import {
    workbookActionBtnClass,
    workbookContentClass,
    workbookPrimaryBtnClass,
} from "./workbookLayoutConstants";

export interface WorkbookActionsProps {
    answers: WorkbookAnswers;
    activeSectionId: string;
    onSectionClick: (sectionId: string) => void;
    onCompleteOnline: () => void;
    onDownloadPdf: () => void;
    onPrintBlank: () => void;
    onSaveProgress: () => void;
    onClearAll: () => void;
    onPrintFilled: () => void;
    onSubmit: () => void;
    saveMessage: string | null;
    submitting: boolean;
    pdfBusy: boolean;
    pdfError: string | null;
}

export function WorkbookStickyActions({
    answers,
    activeSectionId,
    onSectionClick,
    onCompleteOnline,
    onDownloadPdf,
    onPrintBlank,
    onSaveProgress,
    onClearAll,
    onPrintFilled,
    onSubmit,
    saveMessage,
    submitting,
    pdfBusy,
    pdfError,
}: WorkbookActionsProps): ReactElement {
    return (
        <div
            className="workbook-no-print workbook-sticky-actions sticky top-16 z-40 border-b border-base-300/60 bg-base-100/95 shadow-sm backdrop-blur-md"
            aria-label="Workbook progress and actions"
        >
            <div className={`${workbookContentClass} flex flex-col gap-3 py-3`}>
                <WorkbookProgressPanel
                    answers={answers}
                    activeSectionId={activeSectionId}
                    onSectionClick={onSectionClick}
                />

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 md:flex-wrap md:overflow-visible">
                        <button
                            type="button"
                            onClick={onCompleteOnline}
                            className={workbookActionBtnClass}
                        >
                            <ComputerDesktopIcon className="h-4 w-4" aria-hidden />
                            <span className="hidden sm:inline">Complete online</span>
                            <span className="sm:hidden">Online</span>
                        </button>
                        <button
                            type="button"
                            onClick={onSaveProgress}
                            className={workbookActionBtnClass}
                        >
                            Save progress
                        </button>
                        <button
                            type="button"
                            onClick={onClearAll}
                            className={`${workbookActionBtnClass} hover:border-error hover:text-error`}
                        >
                            Clear all
                        </button>
                        <button
                            type="button"
                            onClick={onPrintBlank}
                            disabled={pdfBusy}
                            className={workbookActionBtnClass}
                        >
                            <PrinterIcon className="h-4 w-4" aria-hidden />
                            <span className="hidden sm:inline">Print blank</span>
                            <span className="sm:hidden">Blank</span>
                        </button>
                        <button
                            type="button"
                            onClick={onPrintFilled}
                            disabled={pdfBusy}
                            className={workbookActionBtnClass}
                        >
                            <PrinterIcon className="h-4 w-4" aria-hidden />
                            Print
                        </button>
                        <button
                            type="button"
                            onClick={onDownloadPdf}
                            disabled={pdfBusy}
                            className={workbookActionBtnClass}
                        >
                            <ArrowDownTrayIcon className="h-4 w-4" aria-hidden />
                            <span className="hidden sm:inline">Download PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-1 md:items-end">
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={submitting}
                            className={`${workbookPrimaryBtnClass} w-full md:w-auto`}
                        >
                            <ClipboardDocumentCheckIcon className="h-4 w-4" aria-hidden />
                            {submitting ? "Submitting…" : "Submit workbook"}
                        </button>
                        {pdfBusy ? (
                            <p className="text-sm text-(--pm-on-surface-variant)" role="status">
                                Preparing PDF…
                            </p>
                        ) : null}
                        {pdfError ? (
                            <p className="text-sm text-error" role="alert">
                                {pdfError}
                            </p>
                        ) : null}
                        {saveMessage && !pdfBusy ? (
                            <p className="text-sm text-success" role="status">
                                {saveMessage}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
