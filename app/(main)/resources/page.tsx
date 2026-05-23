import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import resourceCategoriesData from "@/components/resources/resourceCategories.json";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import { absoluteUrl } from "@/lib/siteConfig";
import {
    ArrowRightIcon,
    ArrowUpRightIcon,
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
                <span className="font-pm-headline text-sm tracking-wider uppercase">
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
                className="font-pm-headline mb-4 text-3xl font-bold tracking-tight text-(--pm-on-surface) md:text-4xl"
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
            <main className={`pt-28 pb-24 ${sitePageContentClass}`}>
                <header className="mb-20">
                    <div className="mb-6 inline-block rounded-full bg-secondary/30 px-3 py-1">
                        <span className="font-pm-headline text-[10px] font-bold tracking-widest text-(--pm-on-surface) uppercase">
                            Knowledge archive
                        </span>
                    </div>
                    <h1 className="font-pm-headline mb-8 max-w-4xl text-5xl leading-[0.95] font-bold tracking-tighter text-(--pm-on-surface) md:text-7xl">
                        Resources for{" "}
                        <span className="text-primary italic">
                            small business
                        </span>{" "}
                        websites &amp; SEO
                    </h1>
                    <p className="max-w-2xl text-xl font-light leading-relaxed text-(--pm-on-surface-variant) md:text-2xl">
                        Short, practical guides on local SEO, Search Console, and how search
                        is changing for Toronto and GTA small businesses.
                    </p>
                </header>

                <div className="space-y-4">
                    {resourceCategories.map((category) => (
                        <ResourceCategorySection key={category.id} category={category} />
                    ))}
                </div>

                <section className="relative mt-32 overflow-hidden rounded-3xl bg-neutral p-12 text-center md:p-20">
                    <div
                        className="bg-primary/20 absolute top-0 right-0 -mt-48 -mr-48 h-96 w-96 rounded-full blur-[120px]"
                        aria-hidden
                    />
                    <div
                        className="bg-secondary/10 absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full blur-[100px]"
                        aria-hidden
                    />
                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h2 className="font-pm-headline mb-6 text-4xl font-bold tracking-tight text-neutral-content md:text-5xl">
                            Need a website built the right way?
                        </h2>
                        <p className="mb-10 text-lg font-light text-neutral-content/80">
                            Skip the trial and error. Get a site that loads fast, reads
                            clearly, and is built to grow with your business.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/services"
                                className="group bg-(--pm-white) font-pm-headline inline-flex items-center gap-4 rounded-full px-10 py-4 text-lg font-bold text-neutral transition-all duration-300 hover:bg-primary hover:text-primary-content"
                            >
                                Explore services
                                <ArrowUpRightIcon
                                    className="h-6 w-6 transition-transform group-hover:rotate-45"
                                    aria-hidden
                                />
                            </Link>
                            <Link
                                href="/contact"
                                className="font-pm-headline text-sm font-semibold text-neutral-content/90 underline-offset-4 transition-colors hover:text-neutral-content hover:underline"
                            >
                                Contact — Toronto &amp; GTA
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
