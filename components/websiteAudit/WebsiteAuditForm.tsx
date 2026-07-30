"use client";

import { useId, useState } from "react";
import { siteFieldFocusClass } from "@/components/pricing/pricingLayoutConstants";
import { isValidEmail, isValidHttpUrl } from "@/lib/websiteAudit/validation";

type WebsiteAuditFormProps = {
    title?: string;
    description?: string;
};

type FormValues = {
    websiteUrl: string;
    businessEmail: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
    websiteUrl: "",
    businessEmail: "",
};

export default function WebsiteAuditForm({
    title = "Request a website audit",
    description = "Enter a public website URL to preview the audit workflow. Audit generation will be connected in a later step.",
}: WebsiteAuditFormProps) {
    const formId = useId();
    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [statusMessage, setStatusMessage] = useState(
        "Audit generation is not connected yet. This form currently validates your inputs only.",
    );

    function validate(nextValues: FormValues): FormErrors {
        const nextErrors: FormErrors = {};

        if (!nextValues.websiteUrl.trim()) {
            nextErrors.websiteUrl = "Please enter a website URL.";
        } else if (!isValidHttpUrl(nextValues.websiteUrl.trim())) {
            nextErrors.websiteUrl = "Please enter a valid http or https website URL.";
        }

        if (
            nextValues.businessEmail.trim() &&
            !isValidEmail(nextValues.businessEmail.trim())
        ) {
            nextErrors.businessEmail = "Please enter a valid email address.";
        }

        return nextErrors;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors = validate(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setStatusMessage("Please fix the highlighted fields before continuing.");
            return;
        }

        setStatusMessage(
            "Thanks. The audit request UI is in place, and generation will be connected in a later implementation step.",
        );
    }

    function updateField(field: keyof FormValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
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

            <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-base-content" htmlFor={`${formId}-website`}>
                        Website URL
                    </label>
                    <input
                        id={`${formId}-website`}
                        name="websiteUrl"
                        type="url"
                        value={values.websiteUrl}
                        onChange={(event) => updateField("websiteUrl", event.target.value)}
                        placeholder="https://example.com"
                        aria-invalid={errors.websiteUrl ? "true" : "false"}
                        aria-describedby={errors.websiteUrl ? `${formId}-website-error` : undefined}
                        className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    />
                    {errors.websiteUrl ? (
                        <p
                            id={`${formId}-website-error`}
                            className="mt-2 text-sm text-error"
                        >
                            {errors.websiteUrl}
                        </p>
                    ) : null}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-base-content" htmlFor={`${formId}-email`}>
                        Business email <span className="text-base-content/60">(optional)</span>
                    </label>
                    <input
                        id={`${formId}-email`}
                        name="businessEmail"
                        type="email"
                        value={values.businessEmail}
                        onChange={(event) => updateField("businessEmail", event.target.value)}
                        placeholder="name@business.com"
                        aria-invalid={errors.businessEmail ? "true" : "false"}
                        aria-describedby={errors.businessEmail ? `${formId}-email-error` : undefined}
                        className={`input input-bordered w-full bg-base-100 ${siteFieldFocusClass}`}
                    />
                    {errors.businessEmail ? (
                        <p id={`${formId}-email-error`} className="mt-2 text-sm text-error">
                            {errors.businessEmail}
                        </p>
                    ) : null}
                </div>

                <div className="flex items-end">
                    <button type="submit" className="btn btn-primary w-full md:w-auto">
                        Submit audit request
                    </button>
                </div>

                <div className="md:col-span-2" aria-live="polite">
                    <p className="rounded-xl bg-base-200 p-4 text-sm leading-relaxed text-base-content/80">
                        {statusMessage}
                    </p>
                </div>
            </form>
        </section>
    );
}
