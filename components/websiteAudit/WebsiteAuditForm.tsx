"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { siteFieldFocusClass } from "@/components/pricing/pricingLayoutConstants";
import {
    submitPublicAuditRequestAction,
    type PublicAuditRequestState,
} from "@/src/actions/public-audit-request";

type WebsiteAuditFormProps = {
    title?: string;
    description?: string;
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
    description = "Enter your website URL and business email. Your request is saved for our team to review in the audit dashboard.",
}: WebsiteAuditFormProps) {
    const formId = useId();
    const [values, setValues] = useState<FormValues>(initialValues);
    const [state, formAction, pending] = useActionState(
        submitPublicAuditRequestAction,
        initialState,
    );

    useEffect(() => {
        if (state.ok && state.message) {
            setValues(initialValues);
        }
    }, [state.ok, state.message]);

    function updateField(field: keyof FormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-base-content">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                    {description}
                </p>
                <p className="mt-4 rounded-xl bg-base-200 p-4 text-sm leading-relaxed text-base-content/80">
                    This review combines automated technical checks, Google PageSpeed
                    data, visual analysis, and criteria developed by Nice Guy Web
                    Design. It does not have access to private analytics, sales data,
                    or customer behaviour.
                </p>
            </div>

            <form
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
                action={formAction}
                noValidate
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
                        type="submit"
                        className="btn btn-primary w-full md:w-auto"
                        disabled={pending}
                    >
                        {pending ? "Submitting…" : "Submit audit request"}
                    </button>
                </div>

                <div className="md:col-span-2" aria-live="polite">
                    <p
                        className={`rounded-xl p-4 text-sm leading-relaxed ${
                            state.message && !state.ok
                                ? "bg-error/10 text-error"
                                : state.ok && state.message
                                  ? "bg-success/10 text-base-content"
                                  : "bg-base-200 text-base-content/80"
                        }`}
                        role={state.message && !state.ok ? "alert" : undefined}
                    >
                        {state.message ??
                            "Submit your website to add it to our audit queue. An administrator can start the audit from the dashboard."}
                    </p>
                </div>
            </form>
        </section>
    );
}
