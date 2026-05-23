"use client";

import Image from "next/image";
import Link from "next/link";
import { DcArticleSidebar, DcRelatedGuides } from "./DcArticleSidebar";
import MaterialIcon from "./MaterialIcon";
import {
    SEARCH_CONSOLE_RELATED,
    SEARCH_CONSOLE_TAKEAWAYS,
    SEARCH_CONSOLE_TOC,
} from "./searchConsoleConfig";
import { useDcTocScrollSpy } from "./useDcTocScrollSpy";

const HERO_IMAGE = "/images/Futuristic-tech-abstract.png";

export default function SearchConsoleDesktopLayout() {
    const { activeId, scrollToSection } = useDcTocScrollSpy(SEARCH_CONSOLE_TOC);

    return (
        <main className="dc-desktop-main mx-auto hidden max-w-[1120px] px-6 py-16 md:block">
            <div className="grid grid-cols-12 items-start gap-6">
                <DcArticleSidebar
                    toc={SEARCH_CONSOLE_TOC}
                    activeId={activeId}
                    onTocClick={scrollToSection}
                    ctaBody="Set up Search Console and turn search data into practical improvements."
                />

                <div className="relative col-span-6">
                    <article className="max-w-none">
                        <header className="mb-8 border-b border-[#c1c8c4] pb-8">
                            <div className="mb-4 inline-block rounded bg-[#eae8e7] px-3 py-1">
                                <span className="text-sm font-medium tracking-wide text-[#416359] uppercase">
                                    SEO Tools
                                </span>
                            </div>
                            <h1 className="dc-display mb-4 text-[48px] leading-[1.1] font-semibold tracking-tight text-[#1b1c1c]">
                                How Google Search Console Helps Small Businesses
                            </h1>
                            <div className="flex items-center gap-3 text-base text-[#414845]">
                                <div className="flex items-center gap-1">
                                    <MaterialIcon name="schedule" className="!text-base" />
                                    <span>11 min read</span>
                                </div>
                            </div>
                        </header>

                        <section className="mb-16" id="intro">
                            <p className="mb-6 text-lg leading-relaxed text-[#1b1c1c]">
                                Launching a website is only the beginning. Google Search Console is a
                                free tool that shows how your site performs in Google Search — which
                                queries bring visitors, which pages get traffic, and whether Google can
                                index your pages correctly.
                            </p>
                            <Image
                                src={HERO_IMAGE}
                                alt="Abstract visualization suggesting analytics and search performance data"
                                width={800}
                                height={320}
                                className="mb-6 h-80 w-full rounded-xl border border-[#c1c8c4] object-cover"
                                priority
                            />
                        </section>

                        <section className="mb-16" id="what-is-gsc">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                What Is Google Search Console?
                            </h2>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                A free platform to monitor and improve visibility in Google results. It
                                answers which keywords lead to your site, which pages get traffic,
                                whether Google can read your site, technical issues, and mobile
                                performance — a bridge between your website and Google.
                            </p>
                        </section>

                        <section className="mb-16" id="why-it-matters">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Why It Matters
                            </h2>
                            <blockquote className="dc-display my-6 border-l-4 border-[#416359] py-2 pl-6 text-2xl leading-[1.3] font-medium text-[#414845] italic">
                                &quot;Search data often reveals what customers actually care about —
                                not just what we assume they want.&quot;
                            </blockquote>
                            <p className="text-base text-[#1b1c1c]">
                                Without performance data, it is hard to know what works, what customers
                                search for, or where opportunities exist. A landscaping company might
                                discover traffic from &quot;backyard patio landscaping Toronto&quot; and
                                shape content, service pages, and marketing from that insight.
                            </p>
                        </section>

                        <section className="mb-16" id="what-data-shows">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                What Data Shows
                            </h2>
                            <div className="overflow-hidden rounded-lg border border-[#c1c8c4] bg-white">
                                <div className="border-b border-[#c1c8c4] bg-[#f6f3f2] p-4">
                                    <h3 className="text-sm font-medium tracking-wide text-[#416359] uppercase">
                                        Core reports
                                    </h3>
                                </div>
                                <ul className="divide-y divide-[#c1c8c4] p-6 text-sm text-[#414845]">
                                    <li className="flex gap-3 py-3 first:pt-0 last:pb-0">
                                        <MaterialIcon name="search" className="shrink-0 text-[#416359]" />
                                        <span>
                                            <strong className="text-[#1b1c1c]">Queries</strong> — searches
                                            before clicks (e.g. &quot;Toronto electrician&quot;).
                                        </span>
                                    </li>
                                    <li className="flex gap-3 py-3">
                                        <MaterialIcon name="ads_click" className="shrink-0 text-[#416359]" />
                                        <span>
                                            <strong className="text-[#1b1c1c]">Clicks &amp; impressions</strong>{" "}
                                            — visibility and visits over time.
                                        </span>
                                    </li>
                                    <li className="flex gap-3 py-3">
                                        <MaterialIcon name="web" className="shrink-0 text-[#416359]" />
                                        <span>
                                            <strong className="text-[#1b1c1c]">Pages</strong> — which
                                            services and guides perform best.
                                        </span>
                                    </li>
                                    <li className="flex gap-3 py-3">
                                        <MaterialIcon name="smartphone" className="shrink-0 text-[#416359]" />
                                        <span>
                                            <strong className="text-[#1b1c1c]">Mobile</strong> — usability
                                            issues that hurt local searchers.
                                        </span>
                                    </li>
                                    <li className="flex gap-3 py-3">
                                        <MaterialIcon name="bug_report" className="shrink-0 text-[#416359]" />
                                        <span>
                                            <strong className="text-[#1b1c1c]">Indexing</strong> — crawl
                                            errors, duplicates, and pages Google cannot read.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-16" id="strategic-use">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Using It Strategically
                            </h2>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                If an electrician sees demand for &quot;panel upgrade Toronto&quot; but the
                                site barely mentions it, that insight can drive a new service page, FAQs,
                                and examples. A coffee shop might find one guide earning unexpected
                                impressions — a signal for content and social ideas.
                            </p>
                            <p className="text-base text-[#414845]">
                                Search Console does not fix SEO automatically; it shows where to improve
                                based on real queries, page performance, and how Google interprets your
                                site.
                            </p>
                        </section>

                        <section className="mb-16" id="seo-ai">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                SEO &amp; AI Search
                            </h2>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                As search becomes more AI-driven, clarity, topical authority, and structure
                                matter more. Search Console helps you see which topics Google already
                                associates with your site and where visibility can grow.
                            </p>
                            <Link
                                href="/resources/seo-basics-for-local-businesses"
                                className="mr-4 inline-flex items-center gap-1 font-medium text-[#416359] hover:underline"
                            >
                                SEO basics for local businesses
                                <MaterialIcon name="arrow_forward" className="!text-base" />
                            </Link>
                            <Link
                                href="/resources/what-google-ai-search-means-for-small-businesses"
                                className="inline-flex items-center gap-1 font-medium text-[#416359] hover:underline"
                            >
                                Google AI search guide
                                <MaterialIcon name="arrow_forward" className="!text-base" />
                            </Link>
                        </section>

                        <section className="mb-16" id="mistakes">
                            <div className="rounded-lg border border-[#ba1a1a] bg-[#ffdad6] p-6 text-[#93000a]">
                                <h2 className="dc-display mb-2 flex items-center gap-2 text-2xl leading-[1.3] font-medium">
                                    <MaterialIcon name="warning" />
                                    Common Mistakes
                                </h2>
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    <li>Focusing only on &quot;ranking #1&quot; instead of impressions, clicks, and traffic quality.</li>
                                    <li>Optimizing for keywords that do not match real search intent.</li>
                                    <li>Redesigning or rewriting without data from actual user behavior.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-16" id="final-thoughts">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Key Takeaways &amp; Final Thoughts
                            </h2>
                            <ul className="mb-6 space-y-2 text-sm text-[#414845]">
                                {SEARCH_CONSOLE_TAKEAWAYS.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[#416359]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-base text-[#1b1c1c]">
                                Monthly reviews of top pages, queries, mobile issues, and indexing can
                                guide smarter updates — and stronger visibility over time.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {["SEARCH CONSOLE", "ANALYTICS", "LOCAL SEO"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded bg-[rgba(107,142,131,0.1)] px-3 py-1 text-sm font-medium tracking-wide text-[#416359]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </article>

                    <div className="mt-16 border-t border-[#c1c8c4] pt-16">
                        <h3 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                            Next Steps
                        </h3>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/pricing"
                                className="group flex items-center justify-between rounded-lg border border-[#c1c8c4] bg-white p-6 transition-all hover:border-[#416359]"
                            >
                                <div>
                                    <h4 className="dc-display text-2xl leading-[1.3] font-medium text-[#416359]">
                                        View Pricing
                                    </h4>
                                    <p className="text-[#414845]">
                                        Websites built with SEO and reporting in mind.
                                    </p>
                                </div>
                                <MaterialIcon
                                    name="arrow_forward"
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                            <Link
                                href="/contact"
                                className="group flex items-center justify-between rounded-lg border border-[#c1c8c4] bg-white p-6 transition-all hover:border-[#416359]"
                            >
                                <div>
                                    <h4 className="dc-display text-2xl leading-[1.3] font-medium text-[#416359]">
                                        Get SEO Help
                                    </h4>
                                    <p className="text-[#414845]">
                                        Search Console setup, reviews, and improvements.
                                    </p>
                                </div>
                                <MaterialIcon
                                    name="arrow_forward"
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </div>
                </div>

                <DcRelatedGuides guides={SEARCH_CONSOLE_RELATED} />
            </div>
        </main>
    );
}
