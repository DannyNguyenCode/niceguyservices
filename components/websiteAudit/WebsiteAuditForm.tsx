"use client";

import { useActionState, useCallback, useEffect, useId, useRef, useState } from "react";
import { siteFieldFocusClass } from "@/components/pricing/pricingLayoutConstants";
import AuditCompleteActions from "@/components/websiteAudit/AuditCompleteActions";
import AuditFailureState from "@/components/websiteAudit/AuditFailureState";
import AuditInlineProgress from "@/components/websiteAudit/AuditInlineProgress";
import AuditSectionLabel from "@/components/websiteAudit/AuditSectionLabel";
import {
    PUBLIC_AUDIT_SUBMIT_UI,
    PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS,
    clearPersistedPublicAuditStatusSession,
    deriveWebsiteAuditInlinePhase,
    nextPublicAuditPollIntervalMs,
    persistPublicAuditStatusSession,
    readPersistedPublicAuditStatusSession,
    shouldStopPublicAuditStatusPolling,
    websiteAuditSectionCopy,
    type PublicAuditProgressStageView,
} from "@/components/websiteAudit/public-audit-submit-status";
import {
    submitPublicAuditRequestAction,
    type PublicAuditRequestState,
} from "@/src/actions/public-audit-request";
import { PUBLIC_AUDIT_CUSTOMER_DAILY_LIMIT_NOTE } from "@/src/services/public-audit-protection/constants";
import type { PublicAuditOverallStatus } from "@/src/services/public-audit-status/map-public-audit-progress";

type WebsiteAuditFormProps = {
    title?: string;
    description?: string;
    /**
     * When true, omit the outer card shell. Section headings are rendered
     * dynamically from the active audit phase for the landing page layout.
     */
    embedded?: boolean;
    showPrivacyNote?: boolean;
    /** When true (landing page), render Start your audit / phase headings above content. */
    showSectionHeader?: boolean;
};

type FormValues = {
    websiteUrl: string;
    businessEmail: string;
};

type ProgressState = {
    status: PublicAuditOverallStatus;
    message: string;
    domain: string;
    stages: PublicAuditProgressStageView[];
    pdfReady: boolean;
};

const initialValues: FormValues = {
    websiteUrl: "",
    businessEmail: "",
};

const initialState: PublicAuditRequestState = { ok: true };

function scrollToRetrieveAudit() {
    const target = document.getElementById("retrieve-audit");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function WebsiteAuditForm({
    title = "Request a website audit",
    description = "Enter your website URL and business email to request your website audit.",
    embedded = false,
    showPrivacyNote = true,
    showSectionHeader = false,
}: WebsiteAuditFormProps) {
    const formId = useId();
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const [values, setValues] = useState<FormValues>(initialValues);
    const [state, formAction, pending] = useActionState(
        submitPublicAuditRequestAction,
        initialState,
    );
    const [clearedResultKey, setClearedResultKey] = useState<string | null>(null);
    const [statusToken, setStatusToken] = useState<string | null>(null);
    const [progress, setProgress] = useState<ProgressState | null>(null);
    const [pollTransientError, setPollTransientError] = useState(false);
    const pollIntervalRef = useRef(PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS);
    const inFlightPollRef = useRef(false);
    const restoredTokenRef = useRef<string | null>(null);

    // Same-browser refresh recovery via opaque status token (progress only).
    useEffect(() => {
        const saved = readPersistedPublicAuditStatusSession();
        if (!saved) return;
        setStatusToken(saved.statusToken);
        setProgress({
            status: "processing",
            message: "Your audit has started.",
            domain: saved.domain,
            stages: [],
            pdfReady: false,
        });
        restoredTokenRef.current = saved.statusToken;
    }, []);

    // Persist token when submission succeeds — same section becomes live progress.
    // Backend orchestration already started automatically (forceAsync); UI only displays state.
    useEffect(() => {
        if (pending) return;
        if (state.outcome === "started" && state.statusToken) {
            const domain = state.domain ?? "your website";
            setStatusToken(state.statusToken);
            persistPublicAuditStatusSession({
                statusToken: state.statusToken,
                domain,
            });
            setProgress({
                status: "accepted",
                message: "Your audit has started.",
                domain,
                stages: [],
                pdfReady: false,
            });
            pollIntervalRef.current = PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS;
            restoredTokenRef.current = state.statusToken;
        }
    }, [pending, state.outcome, state.statusToken, state.domain]);

    // Single polling source — displays persisted backend status only; does not keep the audit alive.
    useEffect(() => {
        if (!statusToken) return;

        let cancelled = false;
        let stopped = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const scheduleNext = (delayMs = pollIntervalRef.current) => {
            if (cancelled || stopped) return;
            timeoutId = setTimeout(() => {
                void poll();
            }, delayMs);
        };

        const poll = async () => {
            if (cancelled || stopped || inFlightPollRef.current) return;
            inFlightPollRef.current = true;
            try {
                const response = await fetch(
                    `/api/public/audits/${encodeURIComponent(statusToken)}/status`,
                    { method: "GET", cache: "no-store" },
                );

                if (cancelled) return;

                if (response.status === 404) {
                    stopped = true;
                    clearPersistedPublicAuditStatusSession();
                    setStatusToken(null);
                    setProgress(null);
                    setPollTransientError(false);
                    return;
                }

                if (!response.ok) {
                    setPollTransientError(true);
                    pollIntervalRef.current = nextPublicAuditPollIntervalMs(
                        pollIntervalRef.current,
                    );
                    return;
                }

                const data = (await response.json()) as {
                    status: PublicAuditOverallStatus;
                    message: string;
                    domain: string;
                    stageDetails?: PublicAuditProgressStageView[];
                    pdfReady?: boolean;
                };

                setPollTransientError(false);
                setProgress({
                    status: data.status,
                    message: data.message,
                    domain: data.domain,
                    stages: data.stageDetails ?? [],
                    pdfReady: Boolean(data.pdfReady),
                });

                if (data.status === "complete" || data.status === "failed") {
                    persistPublicAuditStatusSession({
                        statusToken,
                        domain: data.domain,
                    });
                }

                if (shouldStopPublicAuditStatusPolling(data.status)) {
                    stopped = true;
                    return;
                }

                pollIntervalRef.current = PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS;
            } catch {
                if (!cancelled) {
                    setPollTransientError(true);
                    pollIntervalRef.current = nextPublicAuditPollIntervalMs(
                        pollIntervalRef.current,
                    );
                }
            } finally {
                inFlightPollRef.current = false;
                scheduleNext();
            }
        };

        pollIntervalRef.current = PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS;
        scheduleNext(0);
        return () => {
            cancelled = true;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [statusToken]);

    const completedResultKey =
        !pending && state.outcome
            ? `${state.outcome}:${state.message ?? ""}:${state.statusToken ?? ""}`
            : statusToken
              ? `session:${statusToken}`
              : null;

    if (
        completedResultKey &&
        completedResultKey !== clearedResultKey &&
        state.ok &&
        (state.outcome === "started" || state.outcome === "already_in_progress")
    ) {
        setClearedResultKey(completedResultKey);
        setValues(initialValues);
    }

    const inlinePhase = deriveWebsiteAuditInlinePhase({
        pending,
        statusToken,
        progressStatus: progress?.status,
    });
    const sectionCopy = websiteAuditSectionCopy(inlinePhase);

    const startAnotherAudit = useCallback(() => {
        setStatusToken(null);
        setProgress(null);
        setPollTransientError(false);
        clearPersistedPublicAuditStatusSession();
        restoredTokenRef.current = null;
        setValues(initialValues);
        queueMicrotask(() => submitButtonRef.current?.focus());
    }, []);

    function updateField(field: keyof FormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
    }

    const showForm = inlinePhase === "form" || inlinePhase === "submitting";
    const showInlineMessage =
        showForm &&
        Boolean(state.message) &&
        state.outcome !== "started" &&
        Boolean(state.outcome);

    const sectionHeader = showSectionHeader ? (
        <>
            <AuditSectionLabel index={inlinePhase === "form" ? "01" : "※"}>
                {sectionCopy.label}
            </AuditSectionLabel>
            <h2 className="mt-5 text-2xl font-semibold text-base-content sm:text-3xl">
                {sectionCopy.title}
            </h2>
            <p className="mt-4 max-w-lg text-base-content/70">{sectionCopy.description}</p>
        </>
    ) : null;

    const formFields = (
        <>
            <form
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
                action={formAction}
                noValidate
                aria-busy={pending ? "true" : undefined}
            >
                <div className="md:col-span-2">
                    <label
                        className="mb-2 block text-sm font-medium text-base-content"
                        htmlFor={`${formId}-website`}
                    >
                        Website URL
                    </label>
                    <input
                        id={`${formId}-website`}
                        name="websiteUrl"
                        type="url"
                        value={values.websiteUrl}
                        onChange={(event) => updateField("websiteUrl", event.target.value)}
                        placeholder="https://example.com"
                        required
                        disabled={pending}
                        aria-invalid={state.fieldErrors?.websiteUrl ? "true" : "false"}
                        aria-describedby={
                            state.fieldErrors?.websiteUrl ? `${formId}-website-error` : undefined
                        }
                        className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    />
                    {state.fieldErrors?.websiteUrl ? (
                        <p id={`${formId}-website-error`} className="mt-2 text-sm text-error">
                            {state.fieldErrors.websiteUrl}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label
                        className="mb-2 block text-sm font-medium text-base-content"
                        htmlFor={`${formId}-email`}
                    >
                        Business email
                    </label>
                    <input
                        id={`${formId}-email`}
                        name="businessEmail"
                        type="email"
                        value={values.businessEmail}
                        onChange={(event) => updateField("businessEmail", event.target.value)}
                        placeholder="name@business.com"
                        required
                        autoComplete="email"
                        disabled={pending}
                        aria-invalid={state.fieldErrors?.businessEmail ? "true" : "false"}
                        aria-describedby={
                            state.fieldErrors?.businessEmail ? `${formId}-email-error` : undefined
                        }
                        className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    />
                    {state.fieldErrors?.businessEmail ? (
                        <p id={`${formId}-email-error`} className="mt-2 text-sm text-error">
                            {state.fieldErrors.businessEmail}
                        </p>
                    ) : null}
                </div>

                <div className="flex items-end">
                    <button
                        ref={submitButtonRef}
                        type="submit"
                        className="btn btn-primary inline-flex w-full min-w-[12.5rem] items-center justify-center gap-2 md:w-auto"
                        disabled={pending}
                        aria-busy={pending ? "true" : undefined}
                        aria-live="polite"
                    >
                        {pending ? (
                            <>
                                <span
                                    className="loading-indicator h-4 w-4 shrink-0 rounded-full border-2 border-primary-content/30 border-t-primary-content motion-safe:animate-spin motion-reduce:animate-none"
                                    aria-hidden
                                />
                                <span>{PUBLIC_AUDIT_SUBMIT_UI.buttonPending}</span>
                            </>
                        ) : (
                            PUBLIC_AUDIT_SUBMIT_UI.buttonIdle
                        )}
                    </button>
                </div>

                <div className="md:col-span-2" aria-live="polite">
                    <p
                        className={`rounded-xl p-4 text-sm leading-relaxed ${
                            showInlineMessage && !state.ok
                                ? "bg-error/10 text-error"
                                : showInlineMessage && state.ok
                                  ? "bg-success/10 text-base-content"
                                  : "bg-base-200 text-base-content/80"
                        }`}
                        role={showInlineMessage && !state.ok ? "alert" : undefined}
                    >
                        {showInlineMessage
                            ? state.message
                            : "Enter your website URL and business email. After you submit, processing starts automatically."}
                    </p>
                    {!showInlineMessage ? (
                        <p className="mt-3 text-sm text-base-content/60">
                            {PUBLIC_AUDIT_CUSTOMER_DAILY_LIMIT_NOTE}
                        </p>
                    ) : null}
                </div>
            </form>

            {showForm && !pending ? (
                <div className="mt-5 border-t border-base-300 pt-5">
                    <p className="text-sm text-base-content/70">Already requested an audit?</p>
                    <button
                        type="button"
                        className="btn btn-link btn-sm mt-1 px-0"
                        onClick={scrollToRetrieveAudit}
                    >
                        Retrieve my audit
                    </button>
                </div>
            ) : null}
        </>
    );

    const formBody = (
        <>
            {sectionHeader}

            {!embedded && !showSectionHeader ? (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-base-content">{title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                        {description}
                    </p>
                    {showPrivacyNote ? (
                        <p className="mt-4 rounded-xl bg-base-200 p-4 text-sm leading-relaxed text-base-content/80">
                            This review combines automated technical checks, Google PageSpeed
                            data, visual analysis, and criteria developed by Nice Guy Web
                            Design. It does not have access to private analytics, sales data,
                            or customer behaviour.
                        </p>
                    ) : null}
                </div>
            ) : null}

            <div className={showSectionHeader ? "mt-9" : undefined}>
                {showForm ? formFields : null}

                {inlinePhase === "progress" && progress && statusToken ? (
                    <AuditInlineProgress
                        domain={progress.domain}
                        message={progress.message}
                        stages={progress.stages}
                        pollTransientError={pollTransientError}
                        onRetrieveAudit={scrollToRetrieveAudit}
                    />
                ) : null}

                {inlinePhase === "complete" && progress && statusToken ? (
                    <AuditCompleteActions
                        domain={progress.domain}
                        statusToken={statusToken}
                        pdfReady={progress.pdfReady}
                        onStartAnother={startAnotherAudit}
                    />
                ) : null}

                {inlinePhase === "failed" ? (
                    <AuditFailureState
                        domain={progress?.domain ?? null}
                        onTryAgain={startAnotherAudit}
                    />
                ) : null}
            </div>
        </>
    );

    if (embedded) {
        return <div className="min-w-0">{formBody}</div>;
    }

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">{formBody}</section>
    );
}
