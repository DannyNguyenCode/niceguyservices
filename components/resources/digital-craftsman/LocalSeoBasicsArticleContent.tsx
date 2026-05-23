"use client";

import Image from "next/image";
import Link from "next/link";
import { DcMobileHero } from "./article-ui";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import type { DcArticleContentProps } from "./types";
import {
    LOCAL_SEO_BASICS_TAKEAWAYS,
    PRACTICAL_IMPROVEMENTS,
} from "./localSeoBasicsConfig";
import MaterialIcon from "./MaterialIcon";

const MID_IMAGE = "/images/Toronto-skyline-dusk.png";

const section = "border-b border-[#c1c8c4] p-8 md:p-12";

const SEARCH_EXAMPLES = [
    "Toronto electrician",
    "landscaping company near me",
    "custom website designer Toronto",
    "coffee shop Etobicoke",
];

const GOOGLE_SIGNALS = [
    "website quality",
    "page speed",
    "mobile friendliness",
    "business information consistency",
    "service clarity",
    "location relevance",
    "reviews and reputation",
    "Google Business Profile optimization",
];

const FOUNDATIONS = [
    {
        icon: "web",
        title: "Clear Service Pages",
        body: "Each major service should ideally have its own dedicated page — for example Electrical Services, Landscaping Services, SEO Optimization, or Website Maintenance. Dedicated pages help Google better understand what your business offers.",
    },
    {
        icon: "speed",
        title: "Fast Loading Speeds",
        body: "People leave slow websites quickly. Fast websites improve user experience, mobile usability, and SEO performance. Modern frameworks like Next.js are often used because they help websites load efficiently.",
    },
    {
        icon: "smartphone",
        title: "Mobile-Friendly Design",
        body: "Most local searches now happen on phones. A website should adapt to smaller screens, remain readable, have clear buttons, and make contacting the business easy.",
    },
    {
        icon: "sync",
        title: "Consistent Business Information",
        body: "Your business name, phone number, location, and email should remain consistent across your website, Google Business Profile, directories, and social media. Consistency helps Google trust your business information.",
    },
];

const CONTENT_EXAMPLES = [
    "pricing guides",
    "service explanations",
    "FAQ sections",
    "educational articles",
    "process breakdowns",
];

const MISTAKES = [
    {
        title: "Focusing Only on Rankings",
        body: "Rankings matter, but they are not the entire goal. The real goal is leads, calls, bookings, trust, and visibility. A website that ranks but does not convert visitors into customers still has problems.",
    },
    {
        title: "Overusing Keywords",
        body: "Keyword stuffing usually makes content harder to read. Modern SEO works better when content sounds natural and useful.",
    },
    {
        title: "Ignoring User Experience",
        body: "A confusing website can hurt conversions even if people find the business through Google. Good SEO and good user experience work together.",
    },
    {
        title: "Publishing Low-Quality Content",
        body: "A few strong, useful guides are usually more valuable than dozens of weak articles written only for traffic.",
    },
];

function DottedLine() {
    return <span className="dc-dotted-line" aria-hidden />;
}

export default function LocalSeoBasicsMobile({ meta }: DcArticleContentProps) {
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
                    <p className="mb-4 text-lg">
                        <span className="dc-display float-left mr-3 text-5xl leading-none text-[#416359]">
                            W
                        </span>
                        When most people need a service today, they usually start with Google.
                        Whether someone is searching for an electrician, a landscaping company, a
                        coffee shop, a dog groomer, or a web designer, they are often looking for
                        businesses nearby that feel trustworthy and easy to contact.
                    </p>
                    <p className="mb-4">
                        Search Engine Optimization, commonly called SEO, is the process of helping
                        your business become easier to find in search results.
                    </p>
                    <p>
                        For local businesses, SEO is less about &quot;gaming Google&quot; and more
                        about clearly communicating what you do, where you work, and why customers
                        should trust you.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Is SEO?
                    </h2>
                    <p className="mb-4">
                        SEO stands for Search Engine Optimization. It refers to improving your
                        website so search engines like Google can better discover your pages,
                        understand your content, and recommend your business to users.
                    </p>
                    <p className="mb-4">Good SEO helps your business appear when people search for relevant services. For example:</p>
                    <ul className="mb-4 space-y-2">
                        {SEARCH_EXAMPLES.map((text) => (
                            <li key={text} className="flex items-start gap-2">
                                <MaterialIcon name="check_circle" className="mt-0.5 text-[#416359]" />
                                <span className="dc-code text-sm">&quot;{text}&quot;</span>
                            </li>
                        ))}
                    </ul>
                    <p>Google tries to match search results with the most helpful and relevant businesses.</p>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Local SEO vs Traditional SEO
                    </h2>
                    <p className="mb-6 text-[#414845]">
                        Large companies often compete nationally or globally. Local businesses compete
                        differently — usually for visibility in a city, neighborhood, or service area.
                    </p>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-[#c1c8c4] bg-white p-6 shadow-sm">
                            <h3 className="dc-display mb-3 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                                Traditional SEO
                            </h3>
                            <div className="mb-2 flex items-center text-sm text-[#414845]">
                                <span>National</span>
                                <DottedLine />
                                <span>Scale</span>
                            </div>
                            <p className="text-[#414845]">
                                Broader competition across regions or industries, often with larger
                                marketing budgets.
                            </p>
                        </div>
                        <div className="rounded-lg border-2 border-[#416359] bg-[rgb(89_123_113/0.1)] p-6">
                            <h3 className="dc-display mb-3 text-2xl leading-[1.3] font-medium text-[#416359]">
                                Local SEO
                            </h3>
                            <div className="mb-2 flex items-center text-sm text-[#416359]">
                                <span>Nearby</span>
                                <DottedLine />
                                <span>Relevance</span>
                            </div>
                            <p className="text-[#414845]">
                                Focused on geographically relevant searches — customers in your city or
                                service area who are ready to call or visit.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        How Google Understands Local Businesses
                    </h2>
                    <p className="mb-4">
                        Google looks at many different signals when deciding which businesses to show.
                        Some important factors include:
                    </p>
                    <ul className="mb-4 space-y-2">
                        {GOOGLE_SIGNALS.map((text) => (
                            <li key={text} className="flex items-start gap-2">
                                <MaterialIcon name="check_circle" className="mt-0.5 text-[#416359]" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-[#414845]">
                        Google also tries to understand whether your website genuinely helps users.
                        That means clear communication matters more than stuffing pages with keywords.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Keywords Still Matter — But Differently
                    </h2>
                    <p className="mb-4">
                        Keywords are still important, but modern SEO is more contextual than it used to
                        be. Today, Google is much better at understanding natural language.
                    </p>
                    <div className="flex flex-col gap-4 rounded-lg bg-[#f0eded] p-4 md:flex-row">
                        <div className="flex-1">
                            <span className="mb-1 block text-sm font-medium tracking-wide text-[#ba1a1a]">
                                Avoid:
                            </span>
                            <div className="border-l-2 border-[#ba1a1a] pl-3 dc-code text-sm">
                                &quot;We provide professional services.&quot;
                            </div>
                        </div>
                        <div className="flex-1">
                            <span className="mb-1 block text-sm font-medium tracking-wide text-[#416359]">
                                Try:
                            </span>
                            <div className="border-l-2 border-[#416359] pl-3 dc-code text-sm">
                                &quot;We provide residential and commercial electrical services across
                                Toronto.&quot;
                            </div>
                        </div>
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Important SEO Foundations for Small Businesses
                    </h2>
                    <div className="space-y-6">
                        {FOUNDATIONS.map(({ icon, title, body }) => (
                            <div key={title} className="flex items-start gap-4">
                                <MaterialIcon
                                    name={icon}
                                    className="rounded bg-[rgb(89_123_113/0.2)] p-2 text-[#416359]"
                                />
                                <div>
                                    <p className="dc-display mb-1 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                                        {title}
                                    </p>
                                    <p className="text-[#414845]">{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Is a Google Business Profile?
                    </h2>
                    <div className="rounded-lg border border-[#c1c8c4] bg-[#f0eded] p-6">
                        <p className="mb-4">
                            A Google Business Profile is the listing that appears in Google Maps and
                            local search results. It often includes business hours, reviews, photos,
                            contact information, and directions.
                        </p>
                        <p className="text-[#414845]">
                            For many local businesses, this profile is one of the most important SEO
                            tools available. A strong website and a well-maintained Google Business
                            Profile work best together.
                        </p>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Why Content Matters
                    </h2>
                    <p className="mb-4">
                        Helpful content helps search engines understand your expertise. This does not
                        mean publishing endless blog posts — focus on resources that answer real
                        customer questions, such as:
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
                            alt="Toronto skyline at dusk representing local business visibility"
                            fill
                            className="object-cover"
                            sizes="672px"
                        />
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#ffdad6_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Common SEO Mistakes
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
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        How SEO Connects to AI Search
                    </h2>
                    <p className="mb-4">
                        Search engines are becoming more AI-driven. Google now tries to better
                        understand context, expertise, clarity, and structure. Modern SEO is
                        increasingly about helping search engines understand your business rather than
                        simply matching keywords.
                    </p>
                    <p>
                        Read our guide on{" "}
                        <Link
                            href="/resources/what-google-ai-search-means-for-small-businesses"
                            className="font-medium text-[#416359] underline-offset-2 hover:underline"
                        >
                            what Google AI search means for small businesses
                        </Link>
                        .
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Practical SEO Improvements
                    </h2>
                    <div className="space-y-2">
                        {PRACTICAL_IMPROVEMENTS.map((label) => (
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
                        {LOCAL_SEO_BASICS_TAKEAWAYS.map((text, i) => (
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
                        SEO can feel technical at first, but the core idea is simple: help both people
                        and search engines clearly understand your business. For local businesses, the
                        strongest foundations are usually clarity, trust, useful information, fast
                        performance, and consistent branding.
                    </p>
                    <p className="mx-auto mb-8 max-w-lg text-[#414845]">
                        Businesses that focus on helping users often build stronger long-term visibility
                        online.
                    </p>
                    <DigitalCraftsmanAuditButton>Get SEO Help</DigitalCraftsmanAuditButton>
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
                                body: "Transparent rates for small business websites and SEO.",
                            },
                            {
                                href: "/services",
                                icon: "gallery_thumbnail",
                                title: "View Projects",
                                body: "See how we help local businesses get found online.",
                            },
                            {
                                href: "/contact",
                                icon: "mail",
                                title: "Contact",
                                body: "Reach out to discuss your local SEO foundations.",
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
