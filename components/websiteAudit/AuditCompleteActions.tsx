"use client";

import { useCallback, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

type AuditCompleteActionsProps = {
    domain: string;
    statusToken: string;
    pdfReady: boolean;
    onStartAnother: () => void;
};

export default function AuditCompleteActions({
    domain,
    statusToken,
    pdfReady,
    onStartAnother,
}: AuditCompleteActionsProps) {
    const [pdfError, setPdfError] = useState<string | null>(null);

    const handlePdf = useCallback(() => {
        setPdfError(null);
        if (!pdfReady) {
            setPdfError(
                "Your PDF is still being prepared. We've emailed you a download link as soon as it is ready.",
            );
            return;
        }
        window.open(
            `/api/public/audits/${encodeURIComponent(statusToken)}/pdf`,
            "_blank",
            "noopener,noreferrer",
        );
    }, [pdfReady, statusToken]);

    return (
        <div
            className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6"
            aria-live="polite"
        >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-success">
                Audit complete
            </p>
            <h3 className="mt-2 text-xl font-semibold text-base-content">
                Your website audit is ready
            </h3>
            <p className="mt-1 text-sm font-medium text-base-content/80">{domain}</p>
            <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                {pdfReady
                    ? "We've emailed a PDF download link to the business email you submitted. You can also download it here."
                    : "We're finishing your PDF and will email a download link to the business email you submitted as soon as it is ready."}
            </p>

            <div className="mt-6">
                <button
                    type="button"
                    className="btn btn-primary inline-flex min-h-11 w-full items-center justify-center gap-2 sm:w-auto sm:min-w-[12rem]"
                    onClick={handlePdf}
                    disabled={!pdfReady}
                    aria-disabled={!pdfReady ? "true" : undefined}
                    title={
                        pdfReady
                            ? "Download your audit PDF"
                            : "PDF is still being prepared"
                    }
                >
                    <ArrowDownTrayIcon className="h-5 w-5 shrink-0" aria-hidden />
                    Download PDF
                </button>
            </div>

            {pdfError ? (
                <p className="mt-3 text-sm text-warning" role="status">
                    {pdfError}
                </p>
            ) : null}
            {!pdfReady ? (
                <p className="mt-3 text-sm text-base-content/65">
                    PDF download will enable here when generation finishes. Check your email for
                    the download link.
                </p>
            ) : null}

            <div className="mt-6 border-t border-base-300 pt-4">
                <button
                    type="button"
                    className="btn btn-link btn-sm px-0 text-base-content/60"
                    onClick={onStartAnother}
                >
                    Audit another website
                </button>
            </div>
        </div>
    );
}
