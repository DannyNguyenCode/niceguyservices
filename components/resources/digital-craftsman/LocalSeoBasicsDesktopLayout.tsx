"use client";

import Image from "next/image";
import Link from "next/link";
import { DcNextStepsDesktop } from "./article-ui";
import MaterialIcon from "./MaterialIcon";
import { LOCAL_SEO_BASICS_TAKEAWAYS } from "./localSeoBasicsConfig";
import type { DcArticleContentProps } from "./types";

const HERO_IMAGE = "/images/Toronto-city-map.png";

const SEARCH_EXAMPLES = [
    "Toronto electrician",
    "landscaping company near me",
    "custom website designer Toronto",
    "coffee shop Etobicoke",
];

export default function LocalSeoBasicsDesktop({ meta }: DcArticleContentProps) {
    void meta;
    return (
        <>
                        <section className="mb-16" id="intro">
                            <p className="mb-6 text-lg leading-relaxed text-[#1b1c1c]">
                                When most people need a service today, they usually start with Google.
                                Search Engine Optimization helps your business become easier to find —
                                especially when you clearly communicate what you do, where you work, and
                                why customers should trust you.
                            </p>
                            <Image
                                src={HERO_IMAGE}
                                alt="Map suggesting local service areas and how businesses appear in search"
                                width={800}
                                height={320}
                                className="mb-6 h-80 w-full rounded-xl border border-[#c1c8c4] object-cover"
                                priority
                            />
                        </section>

                        <section className="mb-16" id="what-is-seo">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                What Is SEO?
                            </h2>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                SEO stands for Search Engine Optimization — improving your website so
                                Google can discover your pages, understand your content, and recommend
                                your business to users searching for relevant services.
                            </p>
                            <ul className="space-y-2 text-sm text-[#414845]">
                                {SEARCH_EXAMPLES.map((text) => (
                                    <li key={text} className="flex items-start gap-2">
                                        <MaterialIcon name="search" className="mt-0.5 shrink-0 text-[#416359]" />
                                        <span>&quot;{text}&quot;</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="mb-16" id="local-seo">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Local SEO vs Traditional SEO
                            </h2>
                            <div className="overflow-hidden rounded-lg border border-[#c1c8c4] bg-white">
                                <div className="border-b border-[#c1c8c4] bg-[#f6f3f2] p-4">
                                    <h3 className="text-sm font-medium tracking-wide text-[#416359] uppercase">
                                        Geographic relevance
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-6 p-6">
                                    <div>
                                        <h4 className="mb-2 font-bold text-[#1b1c1c]">Traditional</h4>
                                        <p className="text-sm text-[#414845]">
                                            National or global competition — broader reach, larger
                                            budgets.
                                        </p>
                                    </div>
                                    <div className="border-l border-[#c1c8c4] pl-6">
                                        <h4 className="mb-2 font-bold text-[#416359]">Local</h4>
                                        <p className="text-sm text-[#414845]">
                                            City, neighborhood, or service-area visibility — customers
                                            nearby who are ready to call or visit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-16" id="foundations">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                SEO Foundations
                            </h2>
                            <p className="mb-6 text-base text-[#1b1c1c]">
                                Google weighs signals like site quality, speed, mobile usability, consistent
                                business information, reviews, and your Google Business Profile. Clear
                                service pages, fast performance, and natural language beat keyword stuffing.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6">
                                    <div className="mb-4 flex items-center gap-2 text-[#416359]">
                                        <MaterialIcon name="check_circle" />
                                        <h4 className="font-bold text-[#1b1c1c]">Do this</h4>
                                    </div>
                                    <ul className="space-y-3 text-sm text-[#414845]">
                                        <li>Dedicated pages per major service.</li>
                                        <li>Fast, mobile-friendly layouts.</li>
                                        <li>Matching NAP across web, Maps, and directories.</li>
                                    </ul>
                                </div>
                                <div className="rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6 opacity-70">
                                    <div className="mb-4 flex items-center gap-2 text-[#414845]">
                                        <MaterialIcon name="cancel" />
                                        <h4 className="font-bold text-[#1b1c1c]">Avoid this</h4>
                                    </div>
                                    <ul className="space-y-3 text-sm text-[#414845]">
                                        <li>Vague copy like &quot;professional services.&quot;</li>
                                        <li>Repeated keyword phrases that read unnaturally.</li>
                                        <li>Slow sites that frustrate mobile searchers.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mb-16" id="content-trust">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Content &amp; Trust
                            </h2>
                            <blockquote className="dc-display my-6 border-l-4 border-[#416359] py-2 pl-6 text-2xl leading-[1.3] font-medium text-[#414845] italic">
                                &quot;A strong website and a well-maintained Google Business Profile work
                                best together.&quot;
                            </blockquote>
                            <p className="text-base text-[#1b1c1c]">
                                Helpful content — FAQs, service explanations, pricing guides, and
                                educational articles — builds trust with users and search engines. You do
                                not need endless posts; a few strong resources that answer real questions
                                are enough.
                            </p>
                        </section>

                        <section className="mb-16" id="mistakes">
                            <div className="rounded-lg border border-[#ba1a1a] bg-[#ffdad6] p-6 text-[#93000a]">
                                <h2 className="dc-display mb-2 flex items-center gap-2 text-2xl leading-[1.3] font-medium">
                                    <MaterialIcon name="warning" />
                                    Common Mistakes
                                </h2>
                                <ul className="list-disc space-y-2 pl-5 text-sm">
                                    <li>Chasing rankings without conversions (calls, bookings, trust).</li>
                                    <li>Keyword stuffing instead of natural, useful writing.</li>
                                    <li>Poor UX that loses visitors after they find you on Google.</li>
                                    <li>Many weak articles instead of a few strong guides.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-16" id="ai-search">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                How SEO Connects to AI Search
                            </h2>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                Search is increasingly AI-driven. Focus on organized content, clear
                                messaging, and trustworthy branding so engines understand your expertise.
                            </p>
                            <Link
                                href="/resources/what-google-ai-search-means-for-small-businesses"
                                className="inline-flex items-center gap-1 font-medium text-[#416359] hover:underline"
                            >
                                Read: What Google AI Search means for small businesses
                                <MaterialIcon name="arrow_forward" className="!text-base" />
                            </Link>
                        </section>

                        <section className="mb-16" id="final-thoughts">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Key Takeaways &amp; Final Thoughts
                            </h2>
                            <ul className="mb-6 space-y-2 text-sm text-[#414845]">
                                {LOCAL_SEO_BASICS_TAKEAWAYS.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[#416359]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mb-6 text-base text-[#1b1c1c]">
                                SEO is often built through many small improvements over time. Businesses
                                that help users clearly — with fast sites, consistent branding, and useful
                                information — build stronger long-term visibility.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {["LOCAL SEO", "SMALL BUSINESS", "GOOGLE"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded bg-[rgba(107,142,131,0.1)] px-3 py-1 text-sm font-medium tracking-wide text-[#416359]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </section>
        </>
    );
}

export function LocalSeoBasicsDesktopFooter() {
    return (
        <DcNextStepsDesktop
            steps={[
                {
                    href: "/pricing",
                    title: "View Pricing",
                    body: "Transparent packages for websites and local SEO.",
                },
                {
                    href: "/contact",
                    title: "Get SEO Help",
                    body: "Discuss practical improvements for your business.",
                },
            ]}
        />
    );
}
