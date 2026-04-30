"use client";

import {
    BoltIcon,
    EnvelopeIcon,
    HandRaisedIcon,
    LockClosedIcon,
    PhoneIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import ContactForm from "./ContactForm";
import ThankYouModal from "./ThankYouModal";

export type FormState = {
    name: string;
    email: string;
    profession: string;
    phone: string;
    services: string[];
    message: string;
    wantsMeeting: boolean;
    primaryObjective: "business" | "portfolio" | "";
};

export const initialFormState: FormState = {
    name: "",
    email: "",
    profession: "",
    phone: "",
    services: [],
    message: "",
    wantsMeeting: false,
    primaryObjective: "",
};

const DECOR_IMG =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDkx4RUc9rkx0lGeNXvyrasZjBVNtzjkUvejEsuABY_9noKWVYHqnRURylxiikT9s2C-p7Nrf6Gvt4BMVLOAo-HrH0UmFtZbmHjO4DTfzN85GDc4Pr1Nc2ClmAGmvxwzv0_tcNOpBL8BnDEColtxZJbf-q9W4bhwOVD4ZcJDf1NzxzS-wZp3jOBYoePvFH8WkJJ7nvZNTVhTHMQe2tY0Kdj7tJ1shQHI4ruiP-GyapQbEqcS4scy4KT4qL11y6b2YN4zfOPDPVVCqk";

const DEFAULT_CTA = "Detailed Next steps";

const SERVICES_BY_OBJECTIVE: Record<
    "business" | "portfolio",
    FormState["services"]
> = {
    business: ["Web Design", "Web Development", "E-commerce"],
    portfolio: ["Web Design", "Landing page / campaign", "SEO"],
};

export default function ContactView() {
    const [form, setForm] = useState<FormState>(initialFormState);
    const [submitting, setSubmitting] = useState(false);
    const [thankOpen, setThankOpen] = useState(false);
    const [intakeCta, setIntakeCta] = useState(DEFAULT_CTA);

    const handleChange = (field: keyof FormState, value: string | boolean) => {
        setForm((prev) => {
            if (field === "primaryObjective" && (value === "business" || value === "portfolio")) {
                return {
                    ...prev,
                    primaryObjective: value,
                    services: SERVICES_BY_OBJECTIVE[value],
                };
            }
            if (field === "primaryObjective" && value === "") {
                return { ...prev, primaryObjective: "", services: [] };
            }
            return {
                ...prev,
                [field]: value,
            } as FormState;
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.primaryObjective) {
            return;
        }
        setSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    profession: form.profession,
                    phone: form.phone,
                    services: form.services,
                    message: form.message,
                    wantsMeeting: form.wantsMeeting,
                }),
            });

            const json = (await res.json().catch(() => ({}))) as { error?: string };

            if (!res.ok) {
                throw new Error(
                    json.error || "Something went wrong sending your message."
                );
            }

            setThankOpen(true);
            setForm(initialFormState);
            setIntakeCta(DEFAULT_CTA);
        } catch (error) {
            console.error("Error submitting contact form:", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong sending your message. Please try again or email me directly.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="min-h-[max(884px,100dvh)] bg-(--pm-surface) font-pm-body text-(--pm-on-surface)"
            data-contact-page="modern"
        >
            <main className={`pb-24 pt-28 md:pt-32 ${sitePageContentClass}`}>
                <header className="mb-16 flex flex-col items-baseline gap-6 overflow-hidden md:mb-24 md:flex-row">
                    <h1
                        id="contact-header"
                        className="font-pm-headline text-5xl leading-none font-bold tracking-tighter text-(--pm-on-surface) sm:text-6xl md:text-7xl lg:text-8xl"
                    >
                        Get in touch
                    </h1>
                    <div className="hidden h-[2px] grow bg-(--pm-surface-highest) opacity-50 md:block" />
                    <p className="font-pm-body text-sm text-primary">
                        Replies within one business day
                    </p>
                </header>

                <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="group flex flex-col gap-4 rounded-xl border-b border-[rgb(171_173_174/0.15)] bg-base-100 p-8 transition-all hover:bg-base-100 dark:border-[rgb(255_255_255/0.08)] dark:hover:bg-base-200">
                        <BoltIcon
                            className="h-8 w-8 shrink-0 text-primary"
                            aria-hidden
                        />
                        <h3 className="font-pm-headline text-xl font-bold tracking-tight">
                            24-hour response
                        </h3>
                        <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                            I reply to new inquiries within one business day—usually much
                            sooner—so you are never left waiting on a black hole inbox.
                        </p>
                    </div>
                    <div className="group flex flex-col gap-4 rounded-xl border-b border-[rgb(171_173_174/0.15)] bg-base-100 p-8 transition-all hover:bg-base-100 dark:border-[rgb(255_255_255/0.08)] dark:hover:bg-base-200">
                        <LockClosedIcon
                            className="h-8 w-8 shrink-0 text-secondary"
                            aria-hidden
                        />
                        <h3 className="font-pm-headline text-xl font-bold tracking-tight">
                            Straightforward process
                        </h3>
                        <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                            No jargon walls or surprise invoices. Clear scope, honest
                            timelines, and communication you can actually use.
                        </p>
                    </div>
                    <div className="group flex flex-col gap-4 rounded-xl border-b border-[rgb(171_173_174/0.15)] bg-base-100 p-8 transition-all hover:bg-base-100 dark:border-[rgb(255_255_255/0.08)] dark:hover:bg-base-200">
                        <HandRaisedIcon
                            className="h-8 w-8 shrink-0 text-accent"
                            aria-hidden
                        />
                        <h3 className="font-pm-headline text-xl font-bold tracking-tight">
                            Direct line to me
                        </h3>
                        <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                            You work with me—not a ticket queue. Real conversation about
                            your site, SEO, and what will move the needle for your
                            business.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-12 lg:flex-row">
                    <section className="w-full rounded-xl bg-(--pm-surface-low) p-8 md:p-12 lg:w-2/3">
                        <div className="mb-10">
                            <h2 className="mb-2 font-pm-headline text-3xl font-bold tracking-tight text-(--pm-on-surface)">
                                Send a message
                            </h2>
                            <p className="font-pm-body text-sm text-(--pm-on-surface-variant)">
                                Fill in what you can below and I&apos;ll get back to you
                                with next steps. Required fields are marked so we can
                                respond quickly.
                            </p>
                        </div>
                        <ContactForm
                            form={form}
                            submitting={submitting}
                            ctaText={intakeCta}
                            onCtaTextChange={setIntakeCta}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                        />
                    </section>

                    <aside className="w-full space-y-6 lg:w-1/3">
                        <div className="group flex flex-col items-center gap-6 rounded-xl border-b border-[rgb(171_173_174/0.15)] bg-base-100 p-8 text-center transition-transform hover:-translate-y-1 dark:border-[rgb(255_255_255/0.08)]">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                                <PhoneIcon
                                    className="h-8 w-8"
                                    aria-hidden
                                />
                            </div>
                            <div>
                                <span className="mb-2 block text-xs font-semibold text-(--pm-on-surface-variant)">
                                    Phone number
                                </span>
                                <a
                                    className="font-pm-headline text-2xl font-bold tracking-tighter transition-colors hover:text-secondary"
                                    href="tel:+16477603458"
                                >
                                    (647) 760-3458
                                </a>
                            </div>
                        </div>

                        <div className="group flex flex-col items-center gap-6 rounded-xl border-b border-[rgb(171_173_174/0.15)] bg-base-100 p-8 text-center transition-transform hover:-translate-y-1 dark:border-[rgb(255_255_255/0.08)]">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                                <EnvelopeIcon
                                    className="h-8 w-8"
                                    aria-hidden
                                />
                            </div>
                            <div>
                                <span className="mb-2 block text-xs font-semibold text-(--pm-on-surface-variant)">
                                    Email address
                                </span>
                                <a
                                    className="break-all font-pm-headline text-xl font-bold tracking-tighter transition-colors hover:text-primary sm:text-2xl"
                                    href="mailto:gbnguyenw@gmail.com"
                                >
                                    gbnguyenw@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="group relative h-64 overflow-hidden rounded-xl">
                            <Image
                                src={DECOR_IMG}
                                alt="Decorative abstract technology imagery"
                                fill
                                className="object-cover opacity-40 brightness-125 grayscale transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-(--pm-surface)/80 to-transparent p-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                                        <span className="text-[10px] font-bold tracking-wide text-(--pm-on-surface) uppercase">
                                            Toronto &amp; GTA
                                        </span>
                                    </div>
                                    <p className="font-pm-headline text-sm font-medium text-(--pm-on-surface-variant)">
                                        Local &amp; remote small-business websites
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <ThankYouModal open={thankOpen} onClose={() => setThankOpen(false)} />
        </div>
    );
}
