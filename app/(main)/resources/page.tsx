import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import resourceCategoriesData from "@/components/resources/resourceCategories.json";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";
import {
    pixelPageEyebrow,
    pixelPageHeading,
    pricingLayoutHeadline as headline,
    pricingLayoutHeroHeadline as heroHeadline,
    pricingLayoutPixelLabel as pixelLabel,
    responsiveHeroBodyClass,
    responsivePageHeroTitleClass,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";
import { absoluteUrl } from "@/lib/siteConfig";
import {
    ArrowRightIcon,
    ChartBarIcon,
    MapPinIcon,
    SparklesIcon,
    UserGroupIcon,
    Squares2X2Icon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
    title: "Web Design & SEO Resources for Toronto Small Businesses",
    description:
        "Practical guides for Toronto and GTA small businesses: SEO, lead generation, custom vs template websites, and more.",
    alternates: {
        canonical: absoluteUrl("/resources"),
    },
};

type ResourceArticle = {
    title: string;
    category: string;
    slug: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    mutedImage?: boolean;
};

type ResourceCategory = {
    id: string;
    title: string;
    description: string;
    articles: ResourceArticle[];
};

const resourceCategories = resourceCategoriesData.resourceCategories as ResourceCategory[];

const categoryIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
    "SEO Education": SparklesIcon,
    "Local SEO": MapPinIcon,
    "SEO Tools": ChartBarIcon,
    "Lead Generation": UserGroupIcon,
    "Web Strategy": Squares2X2Icon,
};

/** Row 1: 7+5, row 2: 5+7 — resets per category */
function resourceColSpan(index: number): 7 | 5 {
    const row = Math.floor(index / 2);
    const positionInRow = index % 2;
    const isLarge = row % 2 === 0 ? positionInRow === 0 : positionInRow === 1;
    return isLarge ? 7 : 5;
}

function ResourceCard({ article, index }: { article: ResourceArticle; index: number }) {
    const large = resourceColSpan(index) === 7;
    const Icon = categoryIcons[article.category] ?? Squares2X2Icon;

    return (
        <Link
            href={article.slug}
            className={[
                "group flex min-h-[360px] flex-col justify-between rounded-xl p-8 transition-all duration-500 hover:border-primary",
                large
                    ? "border-b-4 border-transparent bg-(--pm-white) shadow-sm dark:bg-base-100 md:col-span-7"
                    : "border border-transparent bg-(--pm-surface-low) md:col-span-5",
            ].join(" ")}
        >
            <div className="relative mb-6 h-40 overflow-hidden rounded-lg">
                <Image
                    src={article.imageSrc}
                    alt={article.imageAlt}
                    fill
                    className={[
                        "object-cover transition-all duration-700",
                        article.mutedImage
                            ? "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100"
                            : "opacity-80 group-hover:opacity-100",
                    ].join(" ")}
                    sizes={large ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                />
            </div>
            <div>
                <div className="mb-4 flex items-start justify-between gap-2">
                    <Icon className="h-10 w-10 shrink-0 text-primary" aria-hidden />
                    <span className="font-pm-headline text-[10px] tracking-widest text-(--pm-on-surface-variant) uppercase">
                        {article.category}
                    </span>
                </div>
                <h3
                    className={[
                        "font-bold tracking-tight",
                        large ? "mb-4 text-3xl leading-none" : "mb-3 text-2xl",
                    ].join(" ")}
                >
                    {article.title}
                </h3>
                <p
                    className={[
                        "text-(--pm-on-surface-variant)",
                        large ? "max-w-md leading-relaxed" : "text-sm",
                    ].join(" ")}
                >
                    {article.description}
                </p>
            </div>
            <div
                className={[
                    "flex items-center gap-2 font-medium text-primary",
                    large ? "mt-8 transition-all group-hover:gap-4" : "mt-6",
                ].join(" ")}
            >
                <span className={`${headline} text-sm tracking-wider uppercase`}>
                    Read article
                </span>
                <ArrowRightIcon className="h-5 w-5" aria-hidden />
            </div>
        </Link>
    );
}

function ResourceCategorySection({ category }: { category: ResourceCategory }) {
    return (
        <section aria-labelledby={`category-${category.id}`} className="mb-20 last:mb-0">
            <h2
                id={`category-${category.id}`}
                className={`${headline} mb-4 text-3xl font-extrabold tracking-tight md:text-4xl ${pixelPageHeading}`}
            >
                {category.title}
            </h2>
            <div
                className="mb-8 h-px w-full bg-(--pm-outline-variant)/30"
                role="presentation"
            />
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-(--pm-on-surface-variant)">
                {category.description}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                {category.articles.map((article, index) => (
                    <ResourceCard key={article.slug} article={article} index={index} />
                ))}
            </div>
        </section>
    );
}

export default function ResourcesPage() {
    return (
        <div className="bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
            <main className={`relative pt-28 pb-24 ${sitePageContentClass}`}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] ng-grid-bg opacity-30" aria-hidden />
                <header className="relative z-10 mb-20">
                    <div className="mb-6 inline-block rounded-full border border-[color:var(--ng-border)] bg-white/60 px-3 py-1 backdrop-blur dark:bg-white/5">
                        <span className={`${pixelLabel} text-[10px] font-bold tracking-widest ${pixelPageEyebrow}`}>
                            Knowledge archive
                        </span>
                    </div>
                    <h1 className={`${heroHeadline} mb-6 max-w-4xl min-w-0 text-balance font-extrabold sm:mb-8 ${responsivePageHeroTitleClass} ${pixelPageHeading}`}>
                        <PixelKeyword>Resources</PixelKeyword>
                        <br />
                        for small businesses
                        <br />
                        <PixelKeyword variant="base">website</PixelKeyword> &amp;{" "}
                        <PixelKeyword variant="base">SEO</PixelKeyword>
                    </h1>
                    <p className={`max-w-2xl ${responsiveHeroBodyClass} text-(--pm-on-surface-variant)`}>
                        These guides are here to help small-business owners make better website
                        decisions, whether they hire me or not. Short reads on local SEO, Search
                        Console, and how search is changing for Toronto and GTA businesses.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
                        <PixelCtaLink
                            href="/contact"
                            color="var(--ng-btn-coral)"
                            className="group"
                        >
                            Start a project
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </PixelCtaLink>
                        <PixelCtaLink
                            href="/services"
                            color="var(--ng-btn-sky)"
                            className="group"
                        >
                            View services
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </PixelCtaLink>
                    </div>
                </header>

                <div className="space-y-4">
                    {resourceCategories.map((category) => (
                        <ResourceCategorySection key={category.id} category={category} />
                    ))}
                </div>
            </main>

            <ServicesModernCTA
                title="Need a website built the right way?"
                description="Skip the trial and error. Get a site that loads fast, reads clearly, and is built to grow with your business."
                primaryLabel="Start a project"
                secondaryHref="/services"
                secondaryLabel="View services"
            />
        </div>
    );
}
