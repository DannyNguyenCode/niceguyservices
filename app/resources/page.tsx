import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import { absoluteUrl } from "@/lib/siteConfig";
import {
    AcademicCapIcon,
    ArrowRightIcon,
    ArrowUpRightIcon,
    BoltIcon,
    ChartBarIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
    title: "Web Design & SEO Resources for Toronto Small Businesses | Nice Guy Web Design",
    description:
        "Short, practical guides for Toronto and GTA small businesses: SEO, site speed, and how to get more leads from your website.",
    alternates: {
        canonical: absoluteUrl("/resources"),
    },
};

const resources = {
    localSeo: {
        module: "Module 01",
        title: "How SEO Helps Local Service Businesses",
        description:
            "A simple explanation of how search engines connect local customers with businesses — and what actually matters for rankings.",
        href: "/resources/how-seo-helps-local-businesses",
    },
    speed: {
        module: "Module 02",
        title: "Why Fast Websites Rank Better",
        description:
            "Learn how website speed affects SEO, user experience, and conversion rates.",
        href: "/resources/why-fast-websites-rank-better",
        imageSrc: "/images/Futuristic-tech-abstract.png",
        imageAlt:
            "Abstract visualization suggesting performance and technical metrics",
    },
    beginnerSeo: {
        module: "Foundation series",
        title: "How to Start SEO on Your Website (Beginner Guide)",
        description:
            "A beginner-friendly guide to starting SEO on your own website. Practical steps you can take today without a technical degree.",
        href: "/resources/how-to-start-seo-for-your-website",
    },
    /* Hidden from hub — internal process article; restore when ready to publish.
    aiWorkflow: {
        module: "Process",
        title: "AI as a tool in web design",
        description:
            "Cursor for code and SEO hygiene, Google Stitch for UX exploration, ChatGPT for copy — in moderation, with humans reviewing every ship.",
        href: "/resources/ai-tools-web-design-workflow",
    },
    */
};

export default function ResourcesPage() {
    const { localSeo, speed, beginnerSeo } = resources;

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
                        Short, practical guides explaining how modern websites help
                        small businesses rank better, load faster, and turn visitors
                        into customers.
                    </p>
                </header>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Local SEO — wide */}
                    <Link
                        href={localSeo.href}
                        className="group flex min-h-[360px] flex-col justify-between rounded-xl border-b-4 border-transparent bg-(--pm-white) p-8 shadow-sm transition-all duration-500 hover:border-primary dark:bg-base-100 md:col-span-7"
                    >
                        <div>
                            <div className="mb-6 flex items-start justify-between">
                                <MapPinIcon
                                    className="h-10 w-10 shrink-0 text-primary"
                                    aria-hidden
                                />
                                <span className="font-pm-headline text-[10px] tracking-widest text-(--pm-on-surface-variant) uppercase">
                                    {localSeo.module}
                                </span>
                            </div>
                            <h2 className="mb-4 text-3xl leading-none font-bold tracking-tight">
                                {localSeo.title}
                            </h2>
                            <p className="max-w-md leading-relaxed text-(--pm-on-surface-variant)">
                                {localSeo.description}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 font-medium text-primary transition-all group-hover:gap-4">
                            <span className="font-pm-headline text-sm tracking-wider uppercase">
                                Read more
                            </span>
                            <ArrowRightIcon className="h-5 w-5" aria-hidden />
                        </div>
                    </Link>

                    {/* Speed — narrow + image */}
                    <Link
                        href={speed.href}
                        className="group flex min-h-[360px] flex-col justify-between rounded-xl bg-(--pm-surface-low) p-8 transition-all duration-500 md:col-span-5"
                    >
                        <div className="relative mb-6 h-40 overflow-hidden rounded-lg">
                            <Image
                                src={speed.imageSrc}
                                alt={speed.imageAlt}
                                fill
                                className="object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                        <div>
                            <span className="font-pm-headline mb-2 block text-[10px] tracking-widest text-(--pm-on-surface-variant) uppercase">
                                {speed.module}
                            </span>
                            <h2 className="mb-3 text-2xl font-bold tracking-tight">
                                {speed.title}
                            </h2>
                            <p className="text-sm text-(--pm-on-surface-variant)">
                                {speed.description}
                            </p>
                        </div>
                        <div className="mt-6 flex items-center gap-2 font-medium text-primary">
                            <span className="font-pm-headline text-sm tracking-wider uppercase">
                                Read more
                            </span>
                            <BoltIcon className="h-5 w-5" aria-hidden />
                        </div>
                    </Link>

                    {/* Beginner SEO — featured */}
                    <div className="flex min-h-[400px] flex-col items-center gap-8 rounded-xl border border-(--pm-outline-variant)/15 bg-(--pm-white) p-8 md:col-span-12 md:flex-row dark:bg-base-100">
                        <div className="flex-1">
                            <div className="mb-6">
                                <span className="inline-block rounded-full bg-tertiary/15 px-3 py-1 font-pm-headline text-[10px] font-bold tracking-widest text-tertiary uppercase">
                                    {beginnerSeo.module}
                                </span>
                            </div>
                            <h2 className="mb-6 text-4xl leading-[1.1] font-bold tracking-tight">
                                {beginnerSeo.title}
                            </h2>
                            <p className="mb-8 text-(--pm-on-surface-variant)">
                                {beginnerSeo.description}
                            </p>
                            <Link
                                href={beginnerSeo.href}
                                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3 font-medium text-primary-content transition-all hover:bg-(--pm-primary-dim)"
                            >
                                Start learning
                                <AcademicCapIcon
                                    className="h-5 w-5"
                                    aria-hidden
                                />
                            </Link>
                        </div>
                        <div className="relative aspect-square w-full md:w-1/3">
                            <div
                                className="absolute inset-0 animate-pulse rounded-full bg-linear-to-tr from-primary/10 to-secondary/10"
                                aria-hidden
                            />
                            <div className="absolute inset-4 flex items-center justify-center rounded-full border border-white/40 bg-base-100/60 backdrop-blur-xl dark:border-white/20 dark:bg-base-100/50">
                                <ChartBarIcon
                                    className="h-16 w-16 text-primary md:h-24 md:w-24"
                                    aria-hidden
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI workflow article omitted from hub (private); restore aiWorkflow in resources + sitemap + card when publishing. */}
                </section>

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
