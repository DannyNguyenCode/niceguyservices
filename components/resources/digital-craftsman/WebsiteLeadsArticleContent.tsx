"use client";

import Image from "next/image";
import Link from "next/link";
import { DcMobileHero } from "./article-ui";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import type { DcArticleContentProps } from "./types";
import {
    PRACTICAL_LEAD_IMPROVEMENTS,
    WEBSITE_LEADS_TAKEAWAYS,
} from "./websiteLeadsConfig";
import MaterialIcon from "./MaterialIcon";

const MID_IMAGE = "/images/Toronto-skyline-dusk.png";

const section = "border-b border-[#c1c8c4] p-8 md:p-12";

const LEAD_OUTCOMES = [
    "phone calls",
    "quote requests",
    "bookings",
    "consultations",
    "walk-in visits",
    "long-term customers",
];

const LEAD_TYPES = [
    "submitting a contact form",
    "requesting a quote",
    "calling your business",
    "booking an appointment",
    "sending an email",
    "visiting your store after finding you online",
];

const DISCOVERY_STEPS = [
    "Search on Google",
    "Compare businesses",
    "Visit a few websites",
    "Read reviews",
    "Contact the business that feels most trustworthy",
];

const DISCOVERY_CHANNELS = [
    "Google Maps",
    "Instagram",
    "TikTok",
    "referrals",
];

const FIRST_IMPRESSION_FACTORS = [
    "clarity",
    "professionalism",
    "speed",
    "organization",
    "ease of use",
];

const CTAS = [
    "Request a Quote",
    "Book a Consultation",
    "Contact Us",
    "View Pricing",
    "Get Started",
];

const TRUST_SIGNALS = [
    "testimonials",
    "reviews",
    "project examples",
    "case studies",
    "before-and-after photos",
    "transparent pricing",
    "clear business information",
    "professional branding",
];

const CONTENT_EXAMPLES = [
    "FAQ sections",
    "pricing guides",
    "process breakdowns",
    "service explanations",
    "educational articles",
];

const MISTAKES = [
    {
        title: "Too Much Focus on Design",
        body: "Visual design matters, but clarity matters more. Some websites prioritize animations while making important information difficult to find.",
    },
    {
        title: "Weak or Missing CTAs",
        body: "If visitors do not know what action to take next, conversions often decrease.",
    },
    {
        title: "Overly Complicated Navigation",
        body: "Visitors should quickly find services, pricing, contact information, and examples of work.",
    },
    {
        title: "Generic Messaging",
        body: "Websites that sound too broad or generic often feel less trustworthy. Specific language usually performs better.",
    },
];

export default function WebsiteLeadsMobile({ meta }: DcArticleContentProps) {
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
                    <p className="mb-4">
                        Many small businesses launch a website because they feel they are supposed to
                        have one. But a good website should do more than simply exist online.
                    </p>
                    <p className="mb-4">For local businesses, a website can help generate:</p>
                    <ul className="mb-6 space-y-2">
                        {LEAD_OUTCOMES.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                                <MaterialIcon name="check_circle" className="mt-0.5 text-[#416359]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p>
                        <span className="dc-display float-left mr-3 text-5xl leading-none text-[#416359]">
                            A
                        </span>
                        website is often one of the first impressions a customer has. People often
                        decide within seconds whether a business feels trustworthy, professional, and
                        worth contacting.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Is a Lead?
                    </h2>
                    <p className="mb-4">
                        A lead is someone who shows interest in your business. For local businesses,
                        this could include:
                    </p>
                    <ul className="mb-4 space-y-2">
                        {LEAD_TYPES.map((text) => (
                            <li key={text} className="flex items-start gap-2 text-[#414845]">
                                <MaterialIcon name="person_add" className="mt-0.5 shrink-0 text-[#416359]" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                    <p>
                        Not every visitor becomes a customer immediately, but a strong website increases
                        the chances of turning visitors into leads.
                    </p>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        How People Usually Discover Local Businesses Online
                    </h2>
                    <ol className="mb-6 list-decimal space-y-2 pl-6">
                        {DISCOVERY_STEPS.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    <p className="mb-4">
                        A website plays an important role during the comparison stage. Even if someone
                        first discovers your business through:
                    </p>
                    <ul className="mb-4 flex flex-wrap gap-2">
                        {DISCOVERY_CHANNELS.map((ch) => (
                            <li
                                key={ch}
                                className="rounded bg-[rgb(107_142_131/0.1)] px-3 py-1 text-sm text-[#416359]"
                            >
                                {ch}
                            </li>
                        ))}
                    </ul>
                    <p className="text-[#414845]">
                        they often still visit the website before making a decision.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        First Impressions Matter
                    </h2>
                    <p className="mb-4">People quickly judge websites based on:</p>
                    <ul className="mb-6 flex flex-wrap gap-2">
                        {FIRST_IMPRESSION_FACTORS.map((f) => (
                            <li
                                key={f}
                                className="rounded border border-[#c1c8c4] bg-white px-3 py-1 text-sm capitalize"
                            >
                                {f}
                            </li>
                        ))}
                    </ul>
                    <p className="text-[#414845]">
                        Good websites make it easy to understand what you offer, where you operate, how
                        to contact you, and why customers should trust you. Clear communication often
                        performs better than overly complicated design.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Strong Messaging Helps Generate Leads
                    </h2>
                    <div className="flex flex-col gap-4 rounded-lg bg-[#f0eded] p-4 md:flex-row">
                        <div className="flex-1">
                            <span className="mb-1 block text-sm font-medium tracking-wide text-[#ba1a1a]">
                                Avoid:
                            </span>
                            <div className="border-l-2 border-[#ba1a1a] pl-3 dc-code text-sm">
                                &quot;Innovative digital experiences for modern solutions.&quot;
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="mb-1 block text-sm font-medium tracking-wide text-[#416359]">
                                Try:
                            </span>
                            <div className="border-l-2 border-[#416359] pl-3 dc-code text-sm">
                                &quot;Custom websites for Toronto small businesses designed to improve
                                visibility and generate leads.&quot;
                            </div>
                        </div>
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Clear Calls-to-Action Matter
                    </h2>
                    <p className="mb-4">
                        A call-to-action (CTA) guides visitors toward an action. Strong CTAs are
                        visible, easy to understand, and repeated naturally throughout the page.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {CTAS.map((cta) => (
                            <span
                                key={cta}
                                className="rounded bg-[#416359] px-4 py-2 text-sm font-medium text-white"
                            >
                                {cta}
                            </span>
                        ))}
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Trust Signals Increase Conversions
                    </h2>
                    <ul className="mb-4 grid gap-2 sm:grid-cols-2">
                        {TRUST_SIGNALS.map((signal) => (
                            <li key={signal} className="flex items-center gap-2 text-[#414845]">
                                <MaterialIcon name="verified" className="text-[#416359]" />
                                <span className="capitalize">{signal}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-[#414845]">
                        For local businesses, authenticity often matters more than looking overly
                        corporate. Real project examples and honest explanations usually feel more
                        trustworthy than generic marketing language.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Fast Websites Help Retain Visitors
                    </h2>
                    <p className="mb-6">
                        Slow websites lose potential customers quickly. Fast sites improve user
                        experience, mobile usability, SEO, and lead generation. Modern frameworks like
                        Next.js help websites load efficiently and feel responsive.
                    </p>
                    <h3 className="dc-display mb-4 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                        Mobile Experience Is Extremely Important
                    </h3>
                    <p>
                        Most local searches happen on phones. A mobile-friendly site should load
                        quickly, remain readable, have large tap targets, and make contact actions
                        easy.
                    </p>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#e4e2e1_20%,transparent)]`}>
                    <div className="relative mx-auto max-w-xl border-y-2 border-[#c1c8c4] py-8 text-center">
                        <MaterialIcon
                            name="format_quote"
                            className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fbf9f8] px-4 text-[#416359]"
                        />
                        <p className="dc-display text-2xl leading-[1.3] text-[#1b1c1c] italic">
                            &quot;SEO helps people discover your business. Lead-focused design helps
                            convert visitors into customers. Strong websites combine visibility,
                            clarity, usability, and trust.&quot;
                        </p>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Helpful Content Builds Trust
                    </h2>
                    <p className="mb-4">
                        Educational resources can improve both SEO and conversions, such as:
                    </p>
                    <ul className="mb-6 flex flex-wrap gap-2">
                        {CONTENT_EXAMPLES.map((item) => (
                            <li
                                key={item}
                                className="rounded bg-[rgb(107_142_131/0.1)] px-3 py-1 text-sm text-[#416359]"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="relative h-64 w-full overflow-hidden rounded border border-[#c1c8c4]">
                        <Image
                            src={MID_IMAGE}
                            alt="Toronto skyline at dusk representing local business growth"
                            fill
                            className="object-cover"
                            sizes="672px"
                        />
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#ffdad6_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Common Mistakes That Hurt Lead Generation
                    </h2>
                    <div className="space-y-4">
                        {MISTAKES.map(({ title, body }) => (
                            <div
                                key={title}
                                className="rounded-r-lg border-l-4 border-[#ba1a1a] bg-white p-6"
                            >
                                <h3 className="mb-2 text-sm font-medium tracking-wide text-[#ba1a1a] uppercase">
                                    {title}
                                </h3>
                                <p className="text-[#414845]">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        How AI Search Changes Lead Generation
                    </h2>
                    <p className="mb-4">
                        As search becomes more AI-driven, websites need clear structure, organized
                        content, and trustworthy information. Businesses that clearly communicate who
                        they help, what they offer, and where they operate are easier for search and AI
                        systems to recommend.
                    </p>
                    <Link
                        href="/resources/what-google-ai-search-means-for-small-businesses"
                        className="font-medium text-[#416359] underline-offset-2 hover:underline"
                    >
                        Read: What Google AI Search means for small businesses
                    </Link>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        How Small Businesses Can Improve Lead Generation
                    </h2>
                    <div className="space-y-2">
                        {PRACTICAL_LEAD_IMPROVEMENTS.map((label) => (
                            <label
                                key={label}
                                className="group flex cursor-pointer items-center gap-4 rounded border border-[#c1c8c4] p-4 transition-colors hover:bg-[#f6f3f2]"
                            >
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-[#c1c8c4] text-[#416359] focus:ring-[#416359]"
                                />
                                <span className="capitalize transition-colors group-hover:text-[#416359]">
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_20%,transparent)]`}>
                    <h2 className="dc-display mb-8 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Key Takeaways
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {WEBSITE_LEADS_TAKEAWAYS.map((text, i) => (
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
                    <p className="mx-auto mb-4 max-w-lg text-[#414845]">
                        A website should support real business goals — communication, trust, usability,
                        visibility, and customer experience — not simply act as an online placeholder.
                    </p>
                    <p className="mx-auto mb-8 max-w-lg text-[#414845]">
                        Businesses that make it easy for visitors to understand and contact them are
                        often in a stronger position to generate leads consistently over time.
                    </p>
                    <DigitalCraftsmanAuditButton>Build a Lead-Ready Site</DigitalCraftsmanAuditButton>
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
                                body: "Transparent website packages for local businesses.",
                            },
                            {
                                href: "/services",
                                icon: "gallery_thumbnail",
                                title: "View Projects",
                                body: "See sites built to convert visitors into leads.",
                            },
                            {
                                href: "/contact",
                                icon: "mail",
                                title: "Contact",
                                body: "Discuss messaging, CTAs, and your next site.",
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
