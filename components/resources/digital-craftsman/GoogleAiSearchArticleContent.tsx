"use client";

import Image from "next/image";
import Link from "next/link";
import { DcMobileHero } from "./article-ui";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import MaterialIcon from "./MaterialIcon";
import type { DcArticleContentProps } from "./types";

const LOCAL_BAKERY_IMAGE =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDqRPXgwNuy95_YnaRoorJe1aZlsdmSIkN56ZFdxgOvVaLYXe9mf4jFHZNwGBoxBdN_qiRPU33xegPGplddDsN60_zL3XAXW6w0CtMyxGc19wbDgyO-Ya4Zrjq74dR-NzENLKsIPQhLy2-v5V4GSduS39VF_nwaMdl-NtQR9HtLUOU5evLEMNbP7EHqBjUggl2nDnVTY7AmKJN07iZMp5PJ0uSebcuBVOvK7JOlzqkcs4dSOFRPqjtxK0j-qbq9dTPu8OFXv9j0f1rJ";

const CHECKLIST = [
    "Optimize your Google Business Profile with detailed descriptions.",
    'Publish helpful "How-To" guides that answer niche local questions.',
    "Ensure your Schema Markup (technical metadata) is perfectly formatted.",
];

const TAKEAWAYS = [
    "AI prioritizes intent over exact keyword matches.",
    'Trust signals like reviews are now "training data" for AI.',
    'Direct answers are the new "First Page" of search.',
    "Technical Schema Markup is more vital than ever.",
    "Niche expertise beats generic broad-range content.",
    "Local context is a small business's secret weapon.",
];

function DottedLine() {
    return <span className="dc-dotted-line" aria-hidden />;
}

const section =
    "border-b border-[#c1c8c4] p-8 md:p-12";

export default function GoogleAiSearchMobile({ meta }: DcArticleContentProps) {
    return (
        <>
                <DcMobileHero
                    badge={meta.badge}
                    readTime={meta.readTime}
                    title={meta.title}
                    subtitle={meta.subtitle}
                    dateModified={meta.dateModified}
                />

                <section className={`${section} text-base leading-relaxed text-[#1b1c1c]`}>
                    <p className="text-lg">
                        <span className="dc-display float-left mr-3 text-5xl leading-none text-[#416359]">
                            G
                        </span>
                        Google Search is changing. For decades, the goal of a search
                        engine was to provide a list of relevant websites for a user to
                        click through. Today, that paradigm is shifting toward direct
                        answers. With the introduction of generative AI into the core
                        search experience, small businesses must adapt their digital
                        presence or risk becoming invisible in the &quot;AI-first&quot;
                        era.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Is Google AI Search?
                    </h2>
                    <div className="mb-8 space-y-4">
                        <p>
                            Google is integrating Large Language Models (LLMs) to
                            synthesize information across multiple sources into a single,
                            cohesive answer called an &quot;AI Overview.&quot;
                        </p>
                        <ul className="space-y-2">
                            {[
                                "AI Overviews that appear at the very top of search results.",
                                "Conversational follow-ups for complex inquiries.",
                                "Multimodal search using images and video as inputs.",
                            ].map((text) => (
                                <li key={text} className="flex items-start gap-2">
                                    <MaterialIcon
                                        name="check_circle"
                                        className="mt-0.5 text-[#416359]"
                                    />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="rounded-lg border border-[#c1c8c4] bg-[#f0eded] p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <MaterialIcon name="lightbulb" className="text-[#406372]" />
                            <span className="text-sm font-medium tracking-wider text-[#406372] uppercase">
                                Example Query
                            </span>
                        </div>
                        <p className="mb-3 rounded border border-[#c1c8c4] bg-white p-3 dc-code text-sm">
                            &quot;Best drought-resistant landscaping for a small yard in
                            Texas&quot;
                        </p>
                        <p className="text-[#414845]">
                            Instead of just showing local landscapers, Google now explains{" "}
                            <em>why</em> certain plants work and then suggests local pros who
                            specialize in xeriscaping.
                        </p>
                    </div>
                </section>

                <section
                    className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}
                >
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Why This Matters for Small Businesses
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-[#c1c8c4] bg-white p-6 shadow-sm">
                            <h3 className="dc-display mb-3 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                                Traditional SEO
                            </h3>
                            <div className="mb-2 flex items-center text-sm text-[#414845]">
                                <span>Rankings</span>
                                <DottedLine />
                                <span>Keywords</span>
                            </div>
                            <p className="text-[#414845]">
                                Focused on technical triggers to push your website link to
                                the first page of results.
                            </p>
                        </div>
                        <div className="rounded-lg border-2 border-[#416359] bg-[rgb(89_123_113/0.1)] p-6">
                            <h3 className="dc-display mb-3 text-2xl leading-[1.3] font-medium text-[#416359]">
                                AI Search
                            </h3>
                            <div className="mb-2 flex items-center text-sm text-[#416359]">
                                <span>Clarity</span>
                                <DottedLine />
                                <span>Trust</span>
                            </div>
                            <p className="text-[#414845]">
                                Focused on whether the AI understands your authority enough
                                to recommend you as an answer.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Makes a Website AI-Friendly?
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-6">
                            <MaterialIcon
                                name="description"
                                className="rounded bg-[rgb(89_123_113/0.2)] p-2 text-[#416359]"
                            />
                            <div>
                                <p className="dc-display mb-1 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                                    Specific Content Blocks
                                </p>
                                <p className="text-[#414845]">
                                    Avoid generic buzzwords. AI favors detailed, niche
                                    expertise over broad marketing speak.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 rounded-lg bg-[#f0eded] p-4 md:flex-row">
                            <div className="flex-1">
                                <span className="mb-1 block text-sm font-medium tracking-wide text-[#ba1a1a]">
                                    Avoid:
                                </span>
                                <div className="border-l-2 border-[#ba1a1a] pl-3 dc-code text-sm">
                                    &quot;SEO Services&quot;
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="mb-1 block text-sm font-medium tracking-wide text-[#416359]">
                                    Try:
                                </span>
                                <div className="border-l-2 border-[#416359] pl-3 dc-code text-sm">
                                    &quot;SEO Optimization for Toronto Small Businesses&quot;
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className={`${section} bg-[color-mix(in_srgb,#e4e2e1_20%,transparent)]`}
                >
                    <div className="relative mx-auto max-w-xl border-y-2 border-[#c1c8c4] py-8 text-center">
                        <MaterialIcon
                            name="format_quote"
                            className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fbf9f8] px-4 text-[#416359]"
                        />
                        <p className="dc-display text-2xl leading-[1.3] text-[#1b1c1c] italic">
                            &quot;Traditional SEO helps Google find your website. AI
                            optimization helps Google understand your website. Both now
                            work together.&quot;
                        </p>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Small Businesses Should Focus On
                    </h2>
                    <div className="space-y-2">
                        {CHECKLIST.map((label) => (
                            <label
                                key={label}
                                className="group flex cursor-pointer items-center gap-4 rounded border border-[#c1c8c4] p-4 transition-colors hover:bg-[#f6f3f2]"
                            >
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-[#c1c8c4] text-[#416359] focus:ring-[#416359]"
                                />
                                <span className="transition-colors group-hover:text-[#416359]">
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <section
                    className={`${section} bg-[color-mix(in_srgb,#ffdad6_10%,transparent)]`}
                >
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Common Mistakes Businesses Make
                    </h2>
                    <div className="rounded-r-lg border-l-4 border-[#ba1a1a] bg-white p-6">
                        <h3 className="mb-2 text-sm font-medium tracking-wide text-[#ba1a1a] uppercase">
                            Avoid This: Vague Messaging
                        </h3>
                        <p className="text-[#414845]">
                            AI cannot recommend you if it doesn&apos;t know exactly what you
                            do. Saying &quot;We provide great service&quot; gives the AI
                            zero data points to work with.
                        </p>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        The Opportunity for Local Businesses
                    </h2>
                    <p className="mb-6 leading-relaxed text-[#414845]">
                        While AI might seem daunting, it actually levels the playing field.
                        Large corporations struggle to provide the granular, localized
                        information that AI search rewards. As a small business, your
                        &quot;human&quot; touch—real customer stories, local project
                        galleries, and specific community knowledge—is your greatest asset
                        in an AI world.
                    </p>
                    <div className="relative h-64 w-full overflow-hidden rounded border border-[#c1c8c4]">
                        <Image
                            src={LOCAL_BAKERY_IMAGE}
                            alt="Warm local bakery interior with a business owner greeting a customer"
                            fill
                            className="object-cover"
                            sizes="672px"
                        />
                    </div>
                </section>

                <section
                    className={`${section} bg-[color-mix(in_srgb,#f6f3f2_20%,transparent)]`}
                >
                    <h2 className="dc-display mb-8 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Key Takeaways
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {TAKEAWAYS.map((text, i) => (
                            <div
                                key={text}
                                className="rounded border border-[#c1c8c4] bg-white p-5"
                            >
                                <span className="mb-1 block dc-code text-sm text-[#416359]">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="font-medium">{text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="border-b border-[#c1c8c4] p-8 text-center md:p-12">
                    <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Final Thoughts
                    </h2>
                    <p className="mx-auto mb-8 max-w-lg text-[#414845]">
                        The shift to AI search isn&apos;t the end of SEO; it&apos;s the
                        evolution of it. By focusing on clarity, authority, and your unique
                        local story, you can ensure that when AI answers a customer&apos;s
                        question, it points directly to you.
                    </p>
                    <DigitalCraftsmanAuditButton />
                </section>

                <section className="border-t border-[#c1c8c4] bg-[rgb(65_99_89/0.05)] p-8 md:p-12">
                    <h2 className="dc-display mb-8 text-center text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Next Steps
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            {
                                href: "/pricing",
                                icon: "payments",
                                title: "View Pricing",
                                body: "Transparent rates for small business AI services.",
                            },
                            {
                                href: "/services",
                                icon: "gallery_thumbnail",
                                title: "View Projects",
                                body: "See how we help businesses adapt to AI search.",
                            },
                            {
                                href: "/contact",
                                icon: "mail",
                                title: "Contact",
                                body: "Reach out to start your AI-ready transformation.",
                            },
                        ].map(({ href, icon, title, body }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group rounded-lg border border-[#c1c8c4] bg-white p-6 text-center transition-all duration-200 hover:border-[#416359]"
                            >
                                <MaterialIcon
                                    name={icon}
                                    className="mx-auto mb-3 block !text-4xl text-[#416359]"
                                />
                                <h3 className="dc-display mb-1 text-2xl leading-[1.3] font-medium text-[#1b1c1c] group-hover:text-[#416359]">
                                    {title}
                                </h3>
                                <p className="text-[#414845]">{body}</p>
                            </Link>
                        ))}
                    </div>
                </section>
        </>
    );
}
