"use client";

import Image from "next/image";
import Link from "next/link";
import { DcNextStepsDesktop } from "./article-ui";
import MaterialIcon from "./MaterialIcon";
import { WEBSITE_LEADS_TAKEAWAYS } from "./websiteLeadsConfig";
import type { DcArticleContentProps } from "./types";

const HERO_IMAGE = "/images/Toronto-skyline-dusk.png";

export default function WebsiteLeadsDesktop({ meta }: DcArticleContentProps) {
    void meta;
    return (
        <>
                        <section className="mb-16" id="intro">
                            <p className="mb-6 text-lg leading-relaxed text-[#1b1c1c]">
                                A good website does more than exist online — it can drive phone calls,
                                quotes, bookings, and long-term customers. It is often the first
                                impression customers use to decide if you feel trustworthy and worth
                                contacting.
                            </p>
                            <Image
                                src={HERO_IMAGE}
                                alt="Toronto skyline suggesting local business growth and opportunity"
                                width={800}
                                height={320}
                                className="mb-6 h-80 w-full rounded-xl border border-[#c1c8c4] object-cover"
                                priority
                            />
                        </section>

                        <section className="mb-16" id="what-is-a-lead">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                What Is a Lead?
                            </h2>
                            <p className="text-base text-[#1b1c1c]">
                                A lead is someone who shows interest — through a form, quote request,
                                call, booking, email, or visit after finding you online. A strong website
                                increases the chance visitors become leads even when they are not ready
                                to buy immediately.
                            </p>
                        </section>

                        <section className="mb-16" id="discovery">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                How People Discover You
                            </h2>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                Most customers search Google, compare options, visit websites, read
                                reviews, then contact whoever feels most trustworthy. Even when they
                                find you on Maps, social, or referrals, they often still check your
                                website before deciding.
                            </p>
                        </section>

                        <section className="mb-16" id="messaging-cta">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Messaging &amp; CTAs
                            </h2>
                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <div className="rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6 opacity-70">
                                    <span className="mb-2 block text-xs font-medium tracking-wide text-[#ba1a1a] uppercase">
                                        Vague
                                    </span>
                                    <p className="text-sm italic text-[#414845]">
                                        &quot;Innovative digital experiences for modern solutions.&quot;
                                    </p>
                                </div>
                                <div className="rounded-lg border-2 border-[#416359] bg-[rgb(89_123_113/0.1)] p-6">
                                    <span className="mb-2 block text-xs font-medium tracking-wide text-[#416359] uppercase">
                                        Clear
                                    </span>
                                    <p className="text-sm text-[#414845]">
                                        &quot;Custom websites for Toronto small businesses designed to
                                        improve visibility and generate leads.&quot;
                                    </p>
                                </div>
                            </div>
                            <p className="text-base text-[#414845]">
                                Calls-to-action — Request a Quote, Book a Consultation, Contact Us — should
                                be visible, easy to understand, and repeated naturally. Do not make visitors
                                hunt for how to reach you.
                            </p>
                        </section>

                        <section className="mb-16" id="trust-performance">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Trust &amp; Performance
                            </h2>
                            <blockquote className="dc-display my-6 border-l-4 border-[#416359] py-2 pl-6 text-2xl leading-[1.3] font-medium text-[#414845] italic">
                                &quot;Authentic project examples and honest explanations often outperform
                                generic marketing language for local businesses.&quot;
                            </blockquote>
                            <p className="text-base text-[#1b1c1c]">
                                Testimonials, reviews, real work samples, transparent pricing, and fast
                                mobile-friendly pages all improve trust and retention. Most local searches
                                happen on phones.
                            </p>
                        </section>

                        <section className="mb-16" id="seo-content">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                SEO &amp; Content
                            </h2>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                SEO helps people find you; lead-focused design converts them. FAQs,
                                pricing guides, and educational articles answer questions before contact
                                and build trust.
                            </p>
                            <Link
                                href="/resources/seo-basics-for-local-businesses"
                                className="inline-flex items-center gap-1 font-medium text-[#416359] hover:underline"
                            >
                                SEO basics for local businesses
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
                                    <li>Prioritizing flashy design over clarity and findable information.</li>
                                    <li>Weak or missing CTAs so visitors do not know the next step.</li>
                                    <li>Complicated navigation and generic messaging.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-16" id="final-thoughts">
                            <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                                Key Takeaways &amp; Final Thoughts
                            </h2>
                            <ul className="mb-6 space-y-2 text-sm text-[#414845]">
                                {WEBSITE_LEADS_TAKEAWAYS.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[#416359]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mb-4 text-base text-[#1b1c1c]">
                                As AI search grows, clear structure and specific service explanations help
                                engines recommend you. Small improvements to messaging, speed, and CTAs
                                can noticeably improve conversions over time.
                            </p>
                            <Link
                                href="/resources/what-google-ai-search-means-for-small-businesses"
                                className="inline-flex items-center gap-1 font-medium text-[#416359] hover:underline"
                            >
                                Google AI search guide
                                <MaterialIcon name="arrow_forward" className="!text-base" />
                            </Link>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {["LEAD GENERATION", "WEB DESIGN", "LOCAL BUSINESS"].map((tag) => (
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

export function WebsiteLeadsDesktopFooter() {
    return (
        <DcNextStepsDesktop
            steps={[
                {
                    href: "/pricing",
                    title: "View Pricing",
                    body: "Lead-focused websites for Toronto small businesses.",
                },
                {
                    href: "/contact",
                    title: "Build a Lead-Ready Site",
                    body: "Discuss your goals, messaging, and next project.",
                },
            ]}
        />
    );
}
