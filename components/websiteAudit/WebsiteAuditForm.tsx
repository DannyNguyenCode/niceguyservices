"use client";

import { useActionState, useCallback, useId, useRef, useState } from "react";
import { siteFieldFocusClass } from "@/components/pricing/pricingLayoutConstants";
import PublicAuditSubmitStatusModal from "@/components/websiteAudit/PublicAuditSubmitStatusModal";
import {
    PUBLIC_AUDIT_SUBMIT_UI,
    derivePublicAuditSubmitStatusView,
    shouldOpenPublicAuditSubmitModal,
} from "@/components/websiteAudit/public-audit-submit-status";
import {
    submitPublicAuditRequestAction,
    type PublicAuditRequestState,
} from "@/src/actions/public-audit-request";

type WebsiteAuditFormProps = {
    title?: string;
    description?: string;
    /**
     * When true, omit the outer card and header copy so the parent page
     * can provide section headings.
     */
    embedded?: boolean;
    showPrivacyNote?: boolean;
};

type FormValues = {
    websiteUrl: string;
    businessEmail: string;
};

const initialValues: FormValues = {
    websiteUrl: "",
    businessEmail: "",
};

const initialState: PublicAuditRequestState = { ok: true };

export default function WebsiteAuditForm({
    title = "Request a website audit",
    description = "Enter your website URL and business email to request your website audit.",
    embedded = false,
    showPrivacyNote = true,
}: WebsiteAuditFormProps) {
    const formId = useId();
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const [values, setValues] = useState<FormValues>(initialValues);
    const [state, formAction, pending] = useActionState(
        submitPublicAuditRequestAction,
        initialState,
    );
    const [dismissedResultKey, setDismissedResultKey] = useState<string | null>(null);
    const [clearedResultKey, setClearedResultKey] = useState<string | null>(null);

    const completedResultKey =
        !pending && state.outcome
            ? `${state.outcome}:${state.message ?? ""}`
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

    const statusView = derivePublicAuditSubmitStatusView({
        pending,
        outcome: pending ? null : state.outcome,
        message: pending ? null : state.message,
    });

    const modalOpen =
        Boolean(statusView) &&
        (pending ||
            (Boolean(completedResultKey) &&
                completedResultKey !== dismissedResultKey &&
                shouldOpenPublicAuditSubmitModal({
                    pending: false,
                    outcome: state.outcome,
                })));

    const closeModal = useCallback(() => {
        if (pending) return;
        if (completedResultKey) {
            setDismissedResultKey(completedResultKey);
        }
        if (state.outcome === "error" || state.outcome === "received") {
            queueMicrotask(() => submitButtonRef.current?.focus());
        }
    }, [pending, completedResultKey, state.outcome]);

    function updateField(field: keyof FormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
    }

    const showInlineMessage = Boolean(state.message) && !modalOpen;

    const formBody = (
        <>
            {!embedded ? (
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
                        <p
                            id={`${formId}-website-error`}
                            className="mt-2 text-sm text-error"
                        >
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
                </div>
            </form>

            <PublicAuditSubmitStatusModal
                open={modalOpen}
                view={statusView}
                onClose={closeModal}
            />
        </>
    );

    if (embedded) {
        return <div className="min-w-0">{formBody}</div>;
    }

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">{formBody}</section>
    );
}
