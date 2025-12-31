"use client";

import React from "react";
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

interface ContactFormProps {
    form: FormState;
    submitting: boolean;
    onChange: (field: keyof FormState, value: string | boolean) => void;
    onServiceToggle: (service: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({
    form,
    submitting,
    onChange,
    onServiceToggle,
    onSubmit,
}) => {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body">
                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Name + Email */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="form-control w-full">
                            <span className="label-text text-sm font-semibold">Full name</span>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                required
                                value={form.name}
                                onChange={(e) => onChange("name", e.target.value)}
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text text-sm font-semibold">Email</span>
                            <input
                                type="email"
                                className="input input-bordered w-full"
                                required
                                value={form.email}
                                onChange={(e) => onChange("email", e.target.value)}
                            />
                        </label>
                    </div>

                    {/* Phone + Business name */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="form-control w-full">
                            <span className="label-text text-sm font-semibold">
                                Phone (optional)
                            </span>
                            <input
                                type="tel"
                                className="input input-bordered w-full"
                                value={form.phone}
                                onChange={(e) => onChange("phone", e.target.value)}
                            />
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text text-sm font-semibold">
                                Business name (optional)
                            </span>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={form.businessName}
                                onChange={(e) => onChange("businessName", e.target.value)}
                            />
                        </label>
                    </div>

                    {/* Business type + Budget */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="form-control w-full">
                            <span className="label-text text-sm font-semibold">
                                Business type
                            </span>
                            <select
                                className="select select-bordered w-full"
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
                        </label>

                        <label className="form-control w-full">
                            <span className="label-text text-sm font-semibold">
                                Estimated budget
                            </span>
                            <select
                                className="select select-bordered w-full"
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
                        </label>
                    </div>

                    {/* Services grid */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold">
                            What do you need help with?
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {servicesOffered.map((service) => {
                                const checked = form.services.includes(service);
                                return (
                                    <label
                                        key={service}
                                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer text-sm
                      ${checked
                                                ? "border-primary bg-primary/5"
                                                : "border-base-300 bg-base-100"
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onServiceToggle(service);
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm"
                                            checked={checked}
                                            onChange={() => onServiceToggle(service)}
                                        />
                                        <span className="text-sm text-base-content ">
                                            {service}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Message */}
                    <label className="form-control w-full">
                        <span className="label-text text-sm font-semibold">
                            Tell me a bit about your project or what you’re trying to fix
                        </span>
                        <textarea
                            className="textarea textarea-bordered w-full min-h-[120px]"
                            required
                            value={form.message}
                            onChange={(e) => onChange("message", e.target.value)}
                        />
                    </label>

                    {/* Book a meeting */}
                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            className="checkbox mt-0.5"
                            checked={form.wantsMeeting}
                            onChange={(e) => onChange("wantsMeeting", e.target.checked)}
                        />
                        <span className="text-sm text-base-content ">
                            I&apos;d like to book an in-person meeting as part of this
                            inquiry.
                        </span>
                    </label>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary normal-case min-w-[140px]"
                            disabled={submitting}
                        >
                            {submitting ? "Sending…" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
