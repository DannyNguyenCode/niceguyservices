"use client";

import { useCallback, useEffect, useId, useRef, useState, type ClipboardEvent } from "react";
import Link from "next/link";
import { siteFieldFocusClass } from "@/components/pricing/pricingLayoutConstants";

/** Mirrors server-enforced resend cooldown in report-lookup constants. */
const RESEND_COOLDOWN_SECONDS = 60;

type LookupStep = "email" | "code" | "verified";

type CustomerReport = {
    businessName: string;
    websiteUrl: string;
    auditDate: string | null;
    publishedAt: string | null;
    reportUrl: string;
};

function formatAuditDate(iso: string | null): string {
    if (!iso) return "Audit date unavailable";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Audit date unavailable";
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function hostnameFromUrl(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./i, "");
    } catch {
        return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    }
}

export default function ReportLookupForm() {
    const formId = useId();
    const [step, setStep] = useState<LookupStep>("email");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [reports, setReports] = useState<CustomerReport[]>([]);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);
    const submittingRef = useRef(false);
    const codeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (cooldownSeconds <= 0) return;
        const timer = window.setTimeout(() => {
            setCooldownSeconds((value) => Math.max(0, value - 1));
        }, 1000);
        return () => window.clearTimeout(timer);
    }, [cooldownSeconds]);

    useEffect(() => {
        if (step === "code") {
            codeInputRef.current?.focus();
        }
    }, [step]);

    const clearMessages = useCallback(() => {
        setStatusMessage(null);
        setErrorMessage(null);
    }, []);

    const startCooldown = useCallback(() => {
        setCooldownSeconds(RESEND_COOLDOWN_SECONDS);
    }, []);

    async function requestCode(targetEmail: string) {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setPending(true);
        clearMessages();

        try {
            const response = await fetch("/api/public-reports/lookup/request-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: targetEmail }),
            });
            const body = (await response.json().catch(() => ({}))) as {
                success?: boolean;
                message?: string;
                error?: string;
                retryAfterSeconds?: number;
            };

            if (response.status === 429) {
                const retry = body.retryAfterSeconds ?? RESEND_COOLDOWN_SECONDS;
                setCooldownSeconds(retry);
                setErrorMessage(
                    body.error ??
                        `Please wait ${retry} seconds before requesting another code.`,
                );
                return;
            }

            if (!response.ok) {
                setErrorMessage(body.error ?? "Unable to send a verification code.");
                return;
            }

            setEmail(targetEmail.trim().toLowerCase());
            setStep("code");
            setCode("");
            setStatusMessage(
                body.message ??
                    "If a published report is associated with that email, a verification code has been sent.",
            );
            startCooldown();
        } catch {
            setErrorMessage("Unable to send a verification code. Please try again.");
        } finally {
            setPending(false);
            submittingRef.current = false;
        }
    }

    async function verifyCode() {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setPending(true);
        clearMessages();

        try {
            const response = await fetch("/api/public-reports/lookup/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                body: JSON.stringify({ email, code }),
            });
            const body = (await response.json().catch(() => ({}))) as {
                success?: boolean;
                message?: string;
                error?: string;
                code?: string;
            };

            if (!response.ok) {
                setErrorMessage(body.error ?? "Unable to verify that code.");
                return;
            }

            setStatusMessage(body.message ?? "Email verified.");
            await loadReports();
        } catch {
            setErrorMessage("Unable to verify that code. Please try again.");
        } finally {
            setPending(false);
            submittingRef.current = false;
        }
    }

    async function loadReports() {
        const response = await fetch("/api/public-reports/lookup", {
            method: "GET",
            credentials: "same-origin",
        });
        const body = (await response.json().catch(() => ({}))) as {
            success?: boolean;
            reports?: CustomerReport[];
            error?: string;
        };

        if (!response.ok) {
            setErrorMessage(body.error ?? "Unable to load your reports.");
            setStep("code");
            return;
        }

        setReports(body.reports ?? []);
        setStep("verified");
    }

    function resetToEmail() {
        clearMessages();
        setStep("email");
        setCode("");
        setReports([]);
    }

    function onCodeChange(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 6);
        setCode(digits);
    }

    function onCodePaste(event: ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();
        const pasted = event.clipboardData.getData("text");
        onCodeChange(pasted);
    }

    return (
        <div className="grid grid-cols-1 gap-5">
            <div aria-live="polite" className="sr-only">
                {statusMessage || errorMessage || ""}
            </div>

            {errorMessage ? (
                <p className="rounded-xl bg-error/10 p-4 text-sm text-error" role="alert">
                    {errorMessage}
                </p>
            ) : null}

            {statusMessage && !errorMessage ? (
                <p className="rounded-xl bg-base-200 p-4 text-sm leading-relaxed text-base-content/80">
                    {statusMessage}
                </p>
            ) : null}

            {step === "email" ? (
                <form
                    className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault();
                        void requestCode(email);
                    }}
                >
                    <div className="md:col-span-2 md:max-w-xl">
                        <label
                            className="mb-2 block text-sm font-medium text-base-content"
                            htmlFor={`${formId}-email`}
                        >
                            Business email
                        </label>
                        <input
                            id={`${formId}-email`}
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@yourbusiness.com"
                            required
                            disabled={pending}
                            className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="btn btn-outline w-full md:w-auto"
                            disabled={pending || !email.trim()}
                        >
                            {pending ? "Sending…" : "Find My Report"}
                        </button>
                    </div>
                </form>
            ) : null}

            {step === "code" ? (
                <form
                    className="grid grid-cols-1 gap-5 md:max-w-xl"
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault();
                        void verifyCode();
                    }}
                >
                    <div>
                        <h3 className="text-base font-semibold text-base-content">
                            Check your email
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                            We sent a 6-digit verification code if a published report is
                            associated with this email.
                        </p>
                    </div>
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium text-base-content"
                            htmlFor={`${formId}-code`}
                        >
                            Verification code
                        </label>
                        <input
                            ref={codeInputRef}
                            id={`${formId}-code`}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="\d{6}"
                            maxLength={6}
                            value={code}
                            onChange={(event) => onCodeChange(event.target.value)}
                            onPaste={onCodePaste}
                            placeholder="123456"
                            required
                            disabled={pending}
                            aria-describedby={`${formId}-code-hint`}
                            className={`input input-bordered w-full bg-base-100 tracking-[0.35em] ${siteFieldFocusClass}`}
                        />
                        <p
                            id={`${formId}-code-hint`}
                            className="mt-2 text-xs text-base-content/60"
                        >
                            Enter the 6-digit code from your email. You can paste it.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={pending || code.length !== 6}
                        >
                            {pending ? "Verifying…" : "Verify Code"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={pending || cooldownSeconds > 0}
                            onClick={() => void requestCode(email)}
                        >
                            {cooldownSeconds > 0
                                ? `Resend code (${cooldownSeconds}s)`
                                : "Resend code"}
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={pending}
                            onClick={resetToEmail}
                        >
                            Use a different email
                        </button>
                    </div>
                </form>
            ) : null}

            {step === "verified" ? (
                <div className="grid grid-cols-1 gap-4">
                    {reports.length === 0 ? (
                        <p className="rounded-xl bg-base-200 p-4 text-sm leading-relaxed text-base-content/80">
                            No published reports are currently available for this email.
                            If you expected a report, it may not be published yet.
                        </p>
                    ) : (
                        reports.map((report) => (
                            <article
                                key={report.reportUrl}
                                className="flex flex-col gap-3 rounded-2xl bg-base-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <h3 className="text-base font-semibold text-base-content">
                                        {report.businessName}
                                    </h3>
                                    <p className="mt-1 text-sm text-base-content/75">
                                        {hostnameFromUrl(report.websiteUrl)}
                                    </p>
                                    <p className="mt-1 text-sm text-base-content/60">
                                        Audited {formatAuditDate(report.auditDate)}
                                    </p>
                                </div>
                                <Link
                                    href={report.reportUrl}
                                    className="btn btn-primary w-full sm:w-auto"
                                >
                                    View Report
                                </Link>
                            </article>
                        ))
                    )}
                    <div>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={resetToEmail}
                        >
                            Look up a different email
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
