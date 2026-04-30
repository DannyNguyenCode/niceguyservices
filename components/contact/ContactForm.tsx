"use client";

import {
    ArrowRightIcon,
    BriefcaseIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    EnvelopeIcon,
    PaperAirplaneIcon,
    PhoneIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { FormEvent } from "react";
import type { FormState } from "../Contact";

const labelCapsClass =
    "mb-2 flex items-center gap-1.5 font-pm-body text-xs font-bold uppercase tracking-[0.1em] text-(--pm-on-surface-variant)";

const fieldUnderlineClass =
    "w-full border-0 border-b border-base-300 bg-transparent px-0 py-3 font-pm-body text-base-content transition-[border-color] duration-200 placeholder:text-base-300/80 " +
    "focus:border-0 focus:border-b-2 focus:border-primary focus:ring-0 focus:outline-none " +
    "dark:border-base-content/20";

interface ContactFormProps {
    form: FormState;
    submitting: boolean;
    ctaText: string;
    onCtaTextChange: (t: string) => void;
    onChange: (field: keyof FormState, value: string | boolean) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ContactForm({
    form,
    submitting,
    ctaText,
    onCtaTextChange,
    onChange,
    onSubmit,
}: ContactFormProps) {
    return (
        <form id="intake-form" onSubmit={onSubmit} className="space-y-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-name">
                        <UserIcon
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden
                        />
                        Full name
                    </label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className={fieldUnderlineClass}
                        required
                        autoComplete="name"
                        placeholder="e.g. your name"
                        value={form.name}
                        onChange={(e) => onChange("name", e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-email">
                        <EnvelopeIcon
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden
                        />
                        Email
                    </label>
                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        className={fieldUnderlineClass}
                        required
                        autoComplete="email"
                        placeholder="you@business.com"
                        value={form.email}
                        onChange={(e) => onChange("email", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-profession">
                        <BriefcaseIcon
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden
                        />
                        Profession{" "}
                        <span className="text-[0.7rem] font-normal normal-case tracking-normal text-base-content/50">
                            (optional)
                        </span>
                    </label>
                    <input
                        id="contact-profession"
                        name="profession"
                        type="text"
                        className={fieldUnderlineClass}
                        autoComplete="organization-title"
                        placeholder="e.g. designer, business owner, dentist"
                        value={form.profession}
                        onChange={(e) =>
                            onChange("profession", e.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <label className={labelCapsClass} htmlFor="contact-phone">
                        <PhoneIcon
                            className="h-4 w-4 shrink-0 text-primary"
                            aria-hidden
                        />
                        Phone{" "}
                        <span className="text-[0.7rem] font-normal normal-case tracking-normal text-base-content/50">
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

            <fieldset className="flex flex-col border border-base-300 bg-(--pm-surface-low) p-8">
                <legend className="mb-6 flex w-full items-center gap-2 font-pm-body text-xs font-bold tracking-[0.15em] text-primary uppercase">
                    Select primary goal
                </legend>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="group flex cursor-pointer items-center border border-base-300 bg-base-100 p-4 transition-all hover:border-primary/60 dark:bg-base-200">
                        <input
                            className="radio h-5 w-5"
                            name="objective"
                            type="radio"
                            value="business"
                            required
                            checked={form.primaryObjective === "business"}
                            onChange={() => {
                                onChange("primaryObjective", "business");
                                onCtaTextChange(
                                    "Project details",
                                );
                            }}
                        />
                        <div className="ml-2 flex min-w-0 flex-1 flex-col sm:ml-3">
                            <span className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-(--pm-on-surface) uppercase group-hover:text-primary">
                                Business website
                            </span>
                            <span className="mt-1 block text-xs text-(--pm-on-surface-variant)">
                                A fast, credible site for leads and service calls
                            </span>
                        </div>
                    </label>
                    <label className="group flex cursor-pointer items-center border border-base-300 bg-base-100 p-4 transition-all hover:border-primary/60 dark:bg-base-200">
                        <input
                            className="radio h-5 w-5"
                            name="objective"
                            type="radio"
                            value="portfolio"
                            checked={form.primaryObjective === "portfolio"}
                            onChange={() => {
                                onChange("primaryObjective", "portfolio");
                                onCtaTextChange("Creative brief");
                            }}
                        />
                        <div className="ml-2 flex min-w-0 flex-1 flex-col sm:ml-3">
                            <span className="flex items-center gap-1.5 text-sm font-bold tracking-wider text-(--pm-on-surface) uppercase group-hover:text-primary">
                                Portfolio or showcase
                            </span>                            <span className="mt-1 block text-xs text-(--pm-on-surface-variant)">
                                A polished, image-forward presence for your work
                            </span>
                        </div>
                    </label>
                </div>
            </fieldset>

            <div className="flex flex-col">
                <label className={labelCapsClass} htmlFor="contact-message">
                    <ChatBubbleLeftRightIcon
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                    />
                    Message
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    className={`${fieldUnderlineClass} min-h-20 resize-none`}
                    required
                    rows={3}
                    placeholder="What are you looking to build, and when do you need it?"
                    value={form.message}
                    onChange={(e) => onChange("message", e.target.value)}
                />
            </div>

            <label className="flex cursor-pointer items-start gap-3 font-pm-body text-sm text-(--pm-on-surface-variant)">
                <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                    checked={form.wantsMeeting}
                    onChange={(e) => onChange("wantsMeeting", e.target.checked)}
                />
                <span className="inline-flex min-w-0 items-start gap-1.5">
                    <span>
                        I&apos;m interested in a call or in-person meetup (Toronto
                        / GTA when practical).
                    </span>
                </span>
            </label>

            <div className="flex flex-col justify-around gap-6 pt-2 md:flex-row">
                <button
                    className="btn btn-outline border-primary text-primary font-pm-body text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content md:min-w-40 md:shrink-0 md:px-6 md:py-5"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? (
                        "Sending…"
                    ) : (
                        <span className="inline-flex items-center justify-center gap-1.5">
                            <PaperAirplaneIcon
                                className="h-4 w-4"
                                aria-hidden
                            />
                            Send message
                        </span>
                    )}
                </button>
                <Link
                    href={
                        form.primaryObjective === "business"
                            ? "/contact/business-intake"
                            : form.primaryObjective === "portfolio"
                                ? "/contact/portfolio-intake"
                                : "/pricing"
                    }
                    className="btn btn-primary group flex items-center justify-around font-pm-body text-sm font-semibold tracking-widest uppercase"
                    onClick={() => {
                        if (
                            form.primaryObjective !== "business" &&
                            form.primaryObjective !== "portfolio"
                        ) {
                            return;
                        }
                        try {
                            sessionStorage.setItem(
                                "ng-contact-prefill",
                                JSON.stringify({
                                    name: form.name,
                                    email: form.email,
                                    profession: form.profession,
                                })
                            );
                        } catch {
                            /* ignore */
                        }
                    }}
                >
                    <span>{ctaText}</span>
                    <ArrowRightIcon
                        className="h-5 w-5 transition-transform group-hover:translate-x-2"
                        aria-hidden
                    />
                </Link>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1 text-center text-[0.65rem] tracking-[0.2em] text-(--pm-on-surface-variant) uppercase opacity-60 md:justify-end">
                <ClockIcon
                    className="h-3.5 w-3.5 shrink-0 opacity-80"
                    aria-hidden
                />
                Avg. time to complete: 3–4 minutes
            </p>
        </form>
    );
}
