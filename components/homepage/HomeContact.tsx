"use client";

import { ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import pricingContent from "@/components/pricing/pricingContent.json";
import homepageContent from "./homepageContent.json";

export default function HomeContact() {
    const { contactTeaser } = homepageContent;
    const contactHref = pricingContent.meta.contactHref;

    return (
        <section className="mx-auto max-w-5xl px-4 md:px-8">
            <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-primary to-(--pm-primary-dim) p-12 text-center md:p-20">
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--color-secondary) 0%, transparent 40%)",
                    }}
                    aria-hidden
                />
                <div
                    className="bg-secondary/20 absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    aria-hidden
                />
                <div className="relative z-10">
                    <h2 className="font-pm-headline mb-8 text-4xl font-bold tracking-tighter text-primary-content md:text-6xl">
                        {contactTeaser.headline}
                    </h2>
                    <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed font-medium text-primary-content/90">
                        {contactTeaser.body}
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                        <Link
                            href={contactHref}
                            className="rounded-full bg-(--pm-white) px-12 py-5 font-pm-headline text-lg font-bold text-primary shadow-xl transition-transform hover:scale-105"
                        >
                            {contactTeaser.primaryCtaLabel}
                        </Link>
                        <div className="flex items-center justify-center gap-2 font-pm-headline text-sm tracking-widest text-primary-content/90 uppercase md:ml-6">
                            <ClockIcon className="h-5 w-5 shrink-0" aria-hidden />
                            {contactTeaser.responseNote}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
