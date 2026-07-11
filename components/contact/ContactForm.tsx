"use client";

import type { FormEvent } from "react";
import {
    BriefcaseIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeIcon,
    PaperAirplaneIcon,
    PhoneIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import type { FormState } from "../Contact";
import { siteFieldFocusClass } from "@/components/pricing/pricingLayoutConstants";

const labelCapsClass =
    "mb-2 flex items-center gap-1.5 font-pm-body text-xs font-bold uppercase text-(--pm-on-surface-variant)";

const fieldUnderlineClass =
    "w-full border-0 border-b border-base-300 bg-transparent px-0 py-3 font-pm-body text-base-content transition-[border-color] duration-200 placeholder:text-base-300/80 " +
    "focus:border-0 focus:border-b-2 focus:border-primary focus:ring-0 focus:outline-none " +
    `dark:border-base-content/20 ${siteFieldFocusClass}`;

const PROJECT_TYPES = [
    "New website",
    "Website redesign",
    "Landing page",
    "SEO or optimization",
    "Maintenance",
    "Custom functionality",
    "Not sure yet",
] as const;

interface ContactFormProps {
    form: FormState;
    submitting: boolean;
    fieldErrors?: Partial<Record<keyof FormState, string>>;
    statusMessage?: string;
    statusType?: "success" | "error" | "idle";
    onChange: (field: keyof FormState, value: string | boolean) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ContactForm({
    form,
    submitting,
    fieldErrors = {},
    statusMessage = "",
    statusType = "idle",
    onChange,
    onSubmit,
}: ContactFormProps) {
    return (
        <form
            id="contact-form"
            onSubmit={onSubmit}
            className="flex flex-col gap-10"
            noValidate
            aria-describedby="contact-form-intro"
        >
            <div
                className="sr-only"
                aria-live="polite"
                aria-atomic="true"
                role="status"
            >
                {statusType === "success" ? statusMessage : ""}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-name">
                        <UserIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        Full name <span className="text-error">*</span>
                    </label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className={fieldUnderlineClass}
                        required
                        aria-required="true"
                        autoComplete="name"
                        placeholder="e.g. your name"
                        value={form.name}
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                        onChange={(e) => onChange("name", e.target.value)}
                    />
                    {fieldErrors.name ? (
                        <p id="contact-name-error" className="mt-1 text-xs text-error" role="alert">
                            {fieldErrors.name}
                        </p>
                    ) : null}
                </div>
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-email">
                        <EnvelopeIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        Email <span className="text-error">*</span>
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className={fieldUnderlineClass}
                        required
                        aria-required="true"
                        autoComplete="email"
                        placeholder="you@business.com"
                        value={form.email}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                        onChange={(e) => onChange("email", e.target.value)}
                    />
                    {fieldErrors.email ? (
                        <p id="contact-email-error" className="mt-1 text-xs text-error" role="alert">
                            {fieldErrors.email}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-organization">
                        <BriefcaseIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        Business or organization{" "}
                        <span className="text-[0.7rem] font-normal normal-case text-base-content/50">
                            (optional)
                        </span>
                    </label>
                    <input
                        id="contact-organization"
                        name="profession"
                        type="text"
                        className={fieldUnderlineClass}
                        autoComplete="organization"
                        placeholder="e.g. studio name, clinic, trade business"
                        value={form.profession}
                        onChange={(e) => onChange("profession", e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-phone">
                        <PhoneIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        Phone{" "}
                        <span className="text-[0.7rem] font-normal normal-case text-base-content/50">
                            (optional)
                        </span>
                    </label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        className={fieldUnderlineClass}
                        autoComplete="tel"
                        placeholder="(xxx) xxx-xxxx"
                        value={form.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <label className={labelCapsClass} htmlFor="contact-project-type">
                    Project type{" "}
                    <span className="text-[0.7rem] font-normal normal-case text-base-content/50">
                        (optional)
                    </span>
                </label>
                <select
                    id="contact-project-type"
                    name="projectType"
                    className={`${fieldUnderlineClass} cursor-pointer`}
                    value={form.projectType}
                    onChange={(e) => onChange("projectType", e.target.value)}
                >
                    <option value="">Select one (optional)</option>
                    {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label className={labelCapsClass} htmlFor="contact-message">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    Message <span className="text-error">*</span>
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    className={`${fieldUnderlineClass} min-h-20 resize-none`}
                    required
                    aria-required="true"
                    rows={3}
                    placeholder="What are you looking to build, and when do you need it?"
                    value={form.message}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                    onChange={(e) => onChange("message", e.target.value)}
                />
                {fieldErrors.message ? (
                    <p id="contact-message-error" className="mt-1 text-xs text-error" role="alert">
                        {fieldErrors.message}
                    </p>
                ) : null}
            </div>

            <label
                className="flex min-h-11 cursor-pointer items-start gap-3 font-pm-body text-sm text-(--pm-on-surface-variant)"
                htmlFor="contact-meeting"
            >
                <input
                    id="contact-meeting"
                    name="wantsMeeting"
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary mt-0.5"
                    checked={form.wantsMeeting}
                    onChange={(e) => onChange("wantsMeeting", e.target.checked)}
                />
                <span>
                    I&apos;m interested in a call or in-person meetup (Toronto / GTA when practical).
                </span>
            </label>

            <div className="flex flex-col gap-4 pt-2">
                <button
                    className="btn btn-outline min-h-11 border-primary text-primary font-pm-body text-sm font-semibold uppercase transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:min-w-40 md:shrink-0 md:self-start md:px-6 md:py-5"
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                >
                    {submitting ? (
                        "Sending…"
                    ) : (
                        <span className="inline-flex items-center justify-center gap-1.5">
                            <PaperAirplaneIcon className="h-4 w-4" aria-hidden />
                            Send message
                        </span>
                    )}
                </button>
                <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                    I&apos;ll review your message and reply within one business day with questions or a
                    suggested next step. No mailing list and no obligation.
                </p>
                {statusType === "error" && statusMessage ? (
                    <p className="text-sm text-error" role="alert" aria-live="assertive">
                        {statusMessage}
                    </p>
                ) : null}
            </div>
        </form>
    );
}
