"use client";

import { ClockIcon } from "@heroicons/react/24/outline";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import pricingContent from "@/components/pricing/pricingContent.json";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import homepageContent from "./homepageContent.json";
import { homeSectionTitleSizeClass } from "./homepageLayoutConstants";

export default function HomeContact() {
    const { contactTeaser } = homepageContent;
    const contactHref = pricingContent.meta.contactHref;

    return (
        <section
            className="relative w-full overflow-hidden py-12 md:py-20"
            style={{
                background: `linear-gradient(to bottom right, var(--pm-primary), var(--pm-primary-dim))`,
            }}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--color-secondary) 0%, transparent 40%)",
                }}
                aria-hidden
            />
            <div
                className="bg-secondary/20 pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                aria-hidden
            />
            <div className={`relative z-10 text-center ${sitePageContentClass}`}>
                <h2 className={`font-pixel mb-8 text-primary-content ${homeSectionTitleSizeClass}`}>
                    Need A Website That Works Harder For Your Business?
                </h2>
                <p className="mx-auto mb-12 max-w-xl text-lg leading-relaxed font-medium text-primary-content/90">
                    {contactTeaser.body}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                    <PixelCtaLink
                        href={contactHref}
                        color="var(--ng-btn-sky)"
                        fill="var(--ng-btn-fill)"
                        textColor="var(--ng-btn-text)"
                        filled
                        pill
                        lg
                    >
                        {contactTeaser.primaryCtaLabel}
                    </PixelCtaLink>
                    <div className="flex items-center justify-center gap-2 font-pm-headline text-sm tracking-widest text-primary-content/90 uppercase md:ml-6">
                        <ClockIcon className="h-5 w-5 shrink-0" aria-hidden />
                        {contactTeaser.responseNote}
                    </div>
                </div>
            </div>
        </section>
    );
}
