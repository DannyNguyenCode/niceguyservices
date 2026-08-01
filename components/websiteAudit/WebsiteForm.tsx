"use client";

import { useActionState, useId } from "react";
import { siteFieldFocusClass } from "@/components/pricing/pricingLayoutConstants";
import {
    createWebsiteAction,
    updateWebsiteAction,
    type WebsiteActionState,
} from "@/src/actions/websites";
import type { SerializableWebsite } from "@/src/data/websites";
import {
    AUDIT_STATUSES,
    DEMO_STATUSES,
    OUTREACH_STATUSES,
    WEBSITE_SOURCE_LABELS,
    WEBSITE_SOURCES,
    WEBSITE_STATUSES,
} from "@/src/lib/website-validation";

type WebsiteFormProps =
    | { mode: "create" }
    | { mode: "edit"; website: SerializableWebsite };

const initialState: WebsiteActionState = { ok: true };

function formatStatusLabel(value: string): string {
    return value.replace(/-/g, " ");
}

export default function WebsiteForm(props: WebsiteFormProps) {
    const formId = useId();
    const isEdit = props.mode === "edit";
    const website = isEdit ? props.website : null;

    const boundUpdate = updateWebsiteAction.bind(null, website?.id ?? "");
    const [state, formAction, pending] = useActionState(
        isEdit ? boundUpdate : createWebsiteAction,
        initialState,
    );

    return (
        <form className="grid grid-cols-1 gap-5 md:grid-cols-2" action={formAction} noValidate>
            <div>
                <label
                    htmlFor={`${formId}-business-name`}
                    className="mb-2 block text-sm font-medium text-base-content"
                >
                    Business name
                </label>
                <input
                    id={`${formId}-business-name`}
                    name="businessName"
                    defaultValue={website?.businessName ?? ""}
                    className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    aria-invalid={state.fieldErrors?.businessName ? "true" : "false"}
                    aria-describedby={
                        state.fieldErrors?.businessName
                            ? `${formId}-business-name-error`
                            : undefined
                    }
                />
                {state.fieldErrors?.businessName ? (
                    <p id={`${formId}-business-name-error`} className="mt-2 text-sm text-error">
                        {state.fieldErrors.businessName}
                    </p>
                ) : null}
            </div>

            <div>
                <label
                    htmlFor={`${formId}-website-url`}
                    className="mb-2 block text-sm font-medium text-base-content"
                >
                    Website URL
                </label>
                <input
                    id={`${formId}-website-url`}
                    name="websiteUrl"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    required
                    defaultValue={website?.originalUrl ?? ""}
                    placeholder="example.com or https://example.com"
                    className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    aria-invalid={state.fieldErrors?.websiteUrl ? "true" : "false"}
                    aria-describedby={
                        state.fieldErrors?.websiteUrl
                            ? `${formId}-website-url-error`
                            : undefined
                    }
                />
                {state.fieldErrors?.websiteUrl ? (
                    <p id={`${formId}-website-url-error`} className="mt-2 text-sm text-error">
                        {state.fieldErrors.websiteUrl}
                    </p>
                ) : null}
            </div>

            <div>
                <label
                    htmlFor={`${formId}-business-email`}
                    className="mb-2 block text-sm font-medium text-base-content"
                >
                    Business email
                </label>
                <input
                    id={`${formId}-business-email`}
                    name="businessEmail"
                    type="email"
                    defaultValue={website?.businessEmail ?? ""}
                    className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    aria-invalid={state.fieldErrors?.businessEmail ? "true" : "false"}
                    aria-describedby={
                        state.fieldErrors?.businessEmail
                            ? `${formId}-business-email-error`
                            : undefined
                    }
                />
                {state.fieldErrors?.businessEmail ? (
                    <p id={`${formId}-business-email-error`} className="mt-2 text-sm text-error">
                        {state.fieldErrors.businessEmail}
                    </p>
                ) : null}
            </div>

            <div>
                <label
                    htmlFor={`${formId}-industry`}
                    className="mb-2 block text-sm font-medium text-base-content"
                >
                    Industry
                </label>
                <input
                    id={`${formId}-industry`}
                    name="industry"
                    defaultValue={website?.industry ?? ""}
                    className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    aria-invalid={state.fieldErrors?.industry ? "true" : "false"}
                    aria-describedby={
                        state.fieldErrors?.industry ? `${formId}-industry-error` : undefined
                    }
                />
                {state.fieldErrors?.industry ? (
                    <p id={`${formId}-industry-error`} className="mt-2 text-sm text-error">
                        {state.fieldErrors.industry}
                    </p>
                ) : null}
            </div>

            <div>
                <label
                    htmlFor={`${formId}-location`}
                    className="mb-2 block text-sm font-medium text-base-content"
                >
                    Location
                </label>
                <input
                    id={`${formId}-location`}
                    name="location"
                    defaultValue={website?.location ?? ""}
                    className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    aria-invalid={state.fieldErrors?.location ? "true" : "false"}
                    aria-describedby={
                        state.fieldErrors?.location ? `${formId}-location-error` : undefined
                    }
                />
                {state.fieldErrors?.location ? (
                    <p id={`${formId}-location-error`} className="mt-2 text-sm text-error">
                        {state.fieldErrors.location}
                    </p>
                ) : null}
            </div>

            <div>
                <label
                    htmlFor={`${formId}-source`}
                    className="mb-2 block text-sm font-medium text-base-content"
                >
                    Source
                </label>
                <select
                    id={`${formId}-source`}
                    name="source"
                    defaultValue={website?.source ?? "manual-prospect-research"}
                    className={`select select-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    aria-invalid={state.fieldErrors?.source ? "true" : "false"}
                    aria-describedby={
                        state.fieldErrors?.source ? `${formId}-source-error` : undefined
                    }
                >
                    {WEBSITE_SOURCES.map((option) => (
                        <option key={option} value={option}>
                            {WEBSITE_SOURCE_LABELS[option]}
                        </option>
                    ))}
                </select>
                {state.fieldErrors?.source ? (
                    <p id={`${formId}-source-error`} className="mt-2 text-sm text-error">
                        {state.fieldErrors.source}
                    </p>
                ) : null}
            </div>

            {isEdit ? (
                <>
                    <div>
                        <label
                            htmlFor={`${formId}-status`}
                            className="mb-2 block text-sm font-medium text-base-content"
                        >
                            Website status
                        </label>
                        <select
                            id={`${formId}-status`}
                            name="status"
                            defaultValue={website?.status}
                            className={`select select-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                        >
                            {WEBSITE_STATUSES.map((option) => (
                                <option key={option} value={option}>
                                    {formatStatusLabel(option)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor={`${formId}-audit-status`}
                            className="mb-2 block text-sm font-medium text-base-content"
                        >
                            Audit status
                        </label>
                        <select
                            id={`${formId}-audit-status`}
                            name="auditStatus"
                            defaultValue={website?.auditStatus}
                            className={`select select-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                        >
                            {AUDIT_STATUSES.map((option) => (
                                <option key={option} value={option}>
                                    {formatStatusLabel(option)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor={`${formId}-demo-status`}
                            className="mb-2 block text-sm font-medium text-base-content"
                        >
                            Demo status
                        </label>
                        <select
                            id={`${formId}-demo-status`}
                            name="demoStatus"
                            defaultValue={website?.demoStatus}
                            className={`select select-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                        >
                            {DEMO_STATUSES.map((option) => (
                                <option key={option} value={option}>
                                    {formatStatusLabel(option)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor={`${formId}-outreach-status`}
                            className="mb-2 block text-sm font-medium text-base-content"
                        >
                            Outreach status
                        </label>
                        <select
                            id={`${formId}-outreach-status`}
                            name="outreachStatus"
                            defaultValue={website?.outreachStatus}
                            className={`select select-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                        >
                            {OUTREACH_STATUSES.map((option) => (
                                <option key={option} value={option}>
                                    {formatStatusLabel(option)}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            ) : null}

            <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                    type="submit"
                    name="intent"
                    value="save"
                    className="btn btn-primary"
                    disabled={pending}
                >
                    {pending ? "Saving…" : isEdit ? "Save Website" : "Save Website"}
                </button>
                {!isEdit ? (
                    <button
                        type="submit"
                        name="intent"
                        value="save-and-start"
                        className="btn btn-secondary"
                        disabled={pending}
                    >
                        {pending ? "Starting audit…" : "Save and Start Audit"}
                    </button>
                ) : null}
                {state.message && !state.ok ? (
                    <p className="text-sm text-error" role="alert" aria-live="polite">
                        {state.message}
                    </p>
                ) : (
                    <p className="text-sm text-base-content/75" aria-live="polite">
                        {pending
                            ? "Saving to MongoDB…"
                            : "Server-side validation and domain normalization run on submit."}
                    </p>
                )}
            </div>
        </form>
    );
}
