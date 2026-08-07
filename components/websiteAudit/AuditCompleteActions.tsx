"use client";

import { useCallback, useState } from "react";
import {
    ArrowDownTrayIcon,
    ArrowTopRightOnSquareIcon,
    EnvelopeIcon,
} from "@heroicons/react/24/outline";

type EmailState = "idle" | "sending" | "sent" | "error";

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
    const [emailState, setEmailState] = useState<EmailState>("idle");
    const [emailMessage, setEmailMessage] = useState<string | null>(null);
    const [viewError, setViewError] = useState<string | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [viewPending, setViewPending] = useState(false);

    const handleView = useCallback(async () => {
        setViewError(null);
        setViewPending(true);
        try {
            const response = await fetch(
                `/api/public/audits/${encodeURIComponent(statusToken)}/report-url`,
                { method: "GET", cache: "no-store" },
            );
            const body = (await response.json().catch(() => ({}))) as {
                reportPath?: string;
                error?: string;
            };
            if (!response.ok || !body.reportPath) {
                setViewError(body.error ?? "Unable to open your report right now.");
                return;
            }
            window.location.assign(body.reportPath);
        } catch {
            setViewError("Unable to open your report right now.");
        } finally {
            setViewPending(false);
        }
    }, [statusToken]);

    const handlePdf = useCallback(() => {
        setPdfError(null);
        if (!pdfReady) {
            setPdfError("Your PDF is not ready yet. You can still view the web report.");
            return;
        }
        window.location.assign(
            `/api/public/audits/${encodeURIComponent(statusToken)}/pdf`,
        );
    }, [pdfReady, statusToken]);

    const handleEmail = useCallback(async () => {
        if (emailState === "sending" || emailState === "sent") return;
        setEmailState("sending");
        setEmailMessage(null);
        try {
            const response = await fetch(
                `/api/public/audits/${encodeURIComponent(statusToken)}/email-report`,
                { method: "POST" },
            );
            const body = (await response.json().catch(() => ({}))) as {
                success?: boolean;
                message?: string;
                maskedEmail?: string;
                error?: string;
                retryAfterSeconds?: number;
            };

            if (response.status === 429) {
                setEmailState("error");
                setEmailMessage(
                    body.error ??
                        `Please wait ${body.retryAfterSeconds ?? 60} seconds before requesting another email.`,
                );
                return;
            }

            if (!response.ok || !body.success) {
                setEmailState("error");
                setEmailMessage(body.error ?? "Unable to send email right now.");
                return;
            }

            setEmailState("sent");
            setEmailMessage(
                body.maskedEmail
                    ? `Sent to ${body.maskedEmail}`
                    : body.message ?? "Sent to your email",
            );
        } catch {
            setEmailState("error");
            setEmailMessage("Unable to send email right now.");
        }
    }, [emailState, statusToken]);

    const emailLabel =
        emailState === "sending"
            ? "Sending..."
            : emailState === "sent"
              ? "Sent to your email"
              : emailState === "error"
                ? "Try sending again"
                : "Send to email";

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
                Your results are ready. Choose how you want to open them.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                    type="button"
                    className="btn btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 sm:min-w-[10rem]"
                    onClick={() => void handleView()}
                    disabled={viewPending}
                    aria-busy={viewPending ? "true" : undefined}
                >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 shrink-0" aria-hidden />
                    {viewPending ? "Opening..." : "View in browser"}
                </button>

                <button
                    type="button"
                    className="btn btn-outline inline-flex min-h-11 flex-1 items-center justify-center gap-2 sm:min-w-[10rem]"
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

                <button
                    type="button"
                    className="btn btn-ghost border border-base-300 inline-flex min-h-11 flex-1 items-center justify-center gap-2 sm:min-w-[10rem]"
                    onClick={() => void handleEmail()}
                    disabled={emailState === "sending" || emailState === "sent"}
                    aria-busy={emailState === "sending" ? "true" : undefined}
                >
                    <EnvelopeIcon className="h-5 w-5 shrink-0" aria-hidden />
                    {emailLabel}
                </button>
            </div>

            {viewError ? (
                <p className="mt-3 text-sm text-error" role="alert">
                    {viewError}
                </p>
            ) : null}
            {pdfError ? (
                <p className="mt-3 text-sm text-warning" role="status">
                    {pdfError}
                </p>
            ) : null}
            {!pdfReady ? (
                <p className="mt-3 text-sm text-base-content/65">
                    The web report is ready. PDF download will enable when generation finishes.
                </p>
            ) : null}
            {emailMessage ? (
                <p
                    className={`mt-3 text-sm ${
                        emailState === "error" ? "text-error" : "text-success"
                    }`}
                    role="status"
                >
                    {emailState === "sent" ? `✓ ${emailMessage}` : emailMessage}
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
