"use client";

import type { FormEvent } from "react";
import type { FormState } from "../Contact";

const businessTypes = [
    "Landscaping",
    "Construction / Trades",
    "Cleaning Services",
    "Restaurant / Café",
    "Fitness / Wellness",
    "Retail / Local Shop",
    "E-commerce",
    "Professional Services",
    "Non-profit / Community",
    "Other",
];

const budgetRanges = [
    "Under $1,500",
    "$1,500 – $3,000",
    "$3,000 – $5,000",
    "$5,000+",
    "Not sure yet",
];

const servicesOffered = [
    "Web Design",
    "Web Development",
    "E-commerce",
    "Landing page / campaign",
    "SEO",
    "Content Strategy",
    "Consulting",
    "Ongoing maintenance",
];

const labelClass =
    "font-pm-body text-sm font-semibold text-[color:var(--pm-on-surface-variant)]";

const fieldClass =
    "w-full border-0 border-b border-base-300/30 bg-base-100 p-3 font-pm-headline text-base-content transition-all placeholder:text-base-300/80 focus:border-primary focus:ring-0 focus:outline-none dark:border-base-content/15 dark:bg-base-200";

interface ContactFormProps {
    form: FormState;
    submitting: boolean;
    onChange: (field: keyof FormState, value: string | boolean) => void;
    onServiceToggle: (service: string) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ContactForm({
    form,
    submitting,
    onChange,
    onServiceToggle,
    onSubmit,
}: ContactFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="contact-name">
                        Name
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        className={fieldClass}
                        required
                        autoComplete="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="contact-email">
                        Email address
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        className={fieldClass}
                        required
                        autoComplete="email"
                        placeholder="you@business.com"
                        value={form.email}
                        onChange={(e) => onChange("email", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="contact-phone">
                        Phone number{" "}
                        <span className="font-normal text-base-content/60">
                            (optional)
                        </span>
                    </label>
                    <input
                        id="contact-phone"
                        type="tel"
                        className={fieldClass}
                        autoComplete="tel"
                        placeholder="Phone (optional)"
                        value={form.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="contact-business">
                        Business name{" "}
                        <span className="font-normal text-base-content/60">
                            (optional)
                        </span>
                    </label>
                    <input
                        id="contact-business"
                        type="text"
                        className={fieldClass}
                        autoComplete="organization"
                        placeholder="Business name"
                        value={form.businessName}
                        onChange={(e) => onChange("businessName", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="contact-biz-type">
                        Business type
                    </label>
                    <select
                        id="contact-biz-type"
                        className={fieldClass}
                        value={form.businessType}
                        onChange={(e) => onChange("businessType", e.target.value)}
                    >
                        <option value="">Select a business type</option>
                        {businessTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className={labelClass} htmlFor="contact-budget">
                        Estimated budget
                    </label>
                    <select
                        id="contact-budget"
                        className={fieldClass}
                        value={form.budget}
                        onChange={(e) => onChange("budget", e.target.value)}
                    >
                        <option value="">Select a range</option>
                        {budgetRanges.map((range) => (
                            <option key={range} value={range}>
                                {range}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <p className={labelClass}>Services you need</p>
                <p className="text-sm text-(--pm-on-surface-variant)">
                    Choose everything that applies.
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {servicesOffered.map((service) => {
                        const checked = form.services.includes(service);
                        return (
                            <label
                                key={service}
                                className={[
                                    "flex cursor-pointer items-center gap-2 rounded-lg border-b border-base-300/20 px-3 py-2.5 font-pm-body text-sm transition-colors dark:border-base-content/10",
                                    checked
                                        ? "border-primary/40 bg-primary/10"
                                        : "bg-base-100 hover:bg-base-200/80 dark:bg-base-200 dark:hover:bg-base-300/50",
                                ].join(" ")}
                            >
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm checkbox-primary"
                                    checked={checked}
                                    onChange={() => onServiceToggle(service)}
                                />
                                <span>{service}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <label className={labelClass} htmlFor="contact-message">
                    Message
                </label>
                <textarea
                    id="contact-message"
                    className={`${fieldClass} min-h-[120px] resize-none`}
                    required
                    rows={4}
                    placeholder="Describe your project, timeline, and what success looks like…"
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                />
            </div>

            <label className="flex cursor-pointer items-start gap-3 font-pm-body text-sm text-(--pm-on-surface-variant)">
                <input
                    type="checkbox"
                    className="checkbox checkbox-primary mt-0.5"
                    checked={form.wantsMeeting}
                    onChange={(e) => onChange("wantsMeeting", e.target.checked)}
                />
                <span>
                    Request an in-person meeting as part of this inquiry (Toronto /
                    GTA when practical).
                </span>
            </label>

            <button
                type="submit"
                disabled={submitting}
                className="w-full cursor-pointer rounded-lg bg-linear-to-br from-primary to-(--pm-primary-container) px-12 py-4 font-pm-headline font-bold tracking-tight text-primary-content shadow-none transition-all hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
                {submitting ? "Sending…" : "Send message"}
            </button>
        </form>
    );
}
