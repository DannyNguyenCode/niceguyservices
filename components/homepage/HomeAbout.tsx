"use client";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import aboutContent from "@/components/about/aboutContent.json";
import homepageContent from "./homepageContent.json";
import { homeSectionTitleSizeClass } from "./homepageLayoutConstants";

export default function HomeAbout() {
    const { aboutTeaser } = homepageContent;
    const { intro, summary, biographyLayout } = aboutContent;
    const vital = biographyLayout.vitalStats.find(
        (r: { label: string }) => r.label === "Experience",
    );
    const experienceValue = vital?.value ?? "2+ years";

    return (
        <section className="bg-(--pm-surface-low) py-24 md:py-32">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:grid-cols-2 md:gap-20 md:px-8">
                <div className="relative">
                    <div
                        className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl"
                        aria-hidden
                    />
                    <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl md:mx-0 md:max-w-none">
                        <Image
                            src={intro.image.src}
                            alt={intro.image.alt}
                            fill
                            className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div className="absolute -right-6 -bottom-8 rounded-xl border border-white/20 bg-base-100/60 p-6 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-base-100/80">
                        <p className="font-pm-headline text-3xl font-bold text-primary">
                            {experienceValue}
                        </p>
                        <p className="font-pm-headline text-xs tracking-widest text-(--pm-on-surface-variant) uppercase">
                            {aboutTeaser.experienceStatLabel}
                        </p>
                    </div>
                </div>
                <div>
                    <h2 className={`mb-8 text-(--pm-on-surface) ${homeSectionTitleSizeClass}`}>
                        The{" "}
                        <PixelKeyword>Mind</PixelKeyword>{" "}
                        Behind The{" "}
                        <PixelKeyword>Code</PixelKeyword>
                    </h2>
                    <p className="mb-6 text-xl leading-relaxed text-(--pm-on-surface)">
                        {intro.leadParagraph}
                    </p>
                    <p className="mb-10 leading-relaxed text-(--pm-on-surface-variant)">
                        {summary.paragraphs[0]}
                    </p>
                    <PixelCtaLink
                        href={aboutTeaser.meetCtaHref}
                        color="var(--ng-btn-sky)"
                        fill="var(--pm-on-surface)"
                        textColor="var(--pm-surface)"
                        filled
                        pill
                        className="group"
                    >
                        {aboutTeaser.meetCtaLabel}
                        <ArrowTopRightOnSquareIcon
                            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden
                        />
                    </PixelCtaLink>
                </div>
            </div>
        </section>
    );
}
