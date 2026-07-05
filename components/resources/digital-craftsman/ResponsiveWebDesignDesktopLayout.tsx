"use client";

import Image from "next/image";
import Link from "next/link";
import { DcNextStepsDesktop } from "./article-ui";
import MaterialIcon from "./MaterialIcon";
import {
    AI_SEARCH_FAVORS,
    CONSISTENCY_ITEMS,
    FIRST_IMPRESSION_ITEMS,
    MOBILE_SEARCH_SCENARIOS,
    PERFORMANCE_BENEFITS,
    RESPONSIVE_WEB_DESIGN_TAKEAWAYS,
    RWD_EXAMPLES,
    SEO_BENEFITS,
    UX_ACTIONS,
} from "./responsiveWebDesignConfig";
import type { DcArticleContentProps } from "./types";

const HERO_IMAGE = "/images/Futuristic-tech-abstract.png";

export default function ResponsiveWebDesignDesktop({ meta }: DcArticleContentProps) {
    void meta;
    return (
        <>
            <section className="mb-16" id="intro">
                <p className="mb-6 text-lg leading-relaxed text-[#1b1c1c]">
                    Customers rarely use just one device anymore. Responsive web design ensures your
                    website adapts to every screen size without sacrificing usability, speed, or
                    appearance — one consistent experience across phones, tablets, laptops, and large
                    monitors.
                </p>
                <Image
                    src={HERO_IMAGE}
                    alt="Abstract visualization suggesting connected devices and modern web design"
                    width={800}
                    height={320}
                    className="mb-6 h-80 w-full rounded-xl border border-[#c1c8c4] object-cover"
                    priority
                />
                <p className="text-base text-[#414845]">
                    In today&apos;s digital world, responsive design is no longer a luxury — it&apos;s
                    an expectation.
                </p>
            </section>

            <section className="mb-16" id="what-is">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    What Is Responsive Web Design?
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    Responsive web design builds websites that intelligently adjust their layout based
                    on screen size. Rather than shrinking everything to fit, content reorganizes so it
                    stays readable, accessible, and easy to interact with.
                </p>
                <ul className="mb-4 space-y-2">
                    {RWD_EXAMPLES.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-base text-[#414845]">
                    Every visitor should have an equally enjoyable experience regardless of the device
                    they use.
                </p>
            </section>

            <section className="mb-16" id="mobile-traffic">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Mobile Traffic Continues to Grow
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    For many businesses, more than half of website visitors come from mobile devices —
                    and in some industries, well over 70% of total visits.
                </p>
                <div className="mb-4 rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-6">
                    <p className="mb-3 text-sm font-medium tracking-wide text-[#416359] uppercase">
                        Searches that happen on phones
                    </p>
                    <ul className="space-y-2">
                        {MOBILE_SEARCH_SCENARIOS.map((text) => (
                            <li key={text} className="flex items-start gap-2 text-[#414845]">
                                <MaterialIcon name="smartphone" className="mt-0.5 shrink-0 text-[#416359]" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-base text-[#414845]">
                    If your website isn&apos;t optimized for mobile users, potential customers may leave
                    before ever contacting you.
                </p>
            </section>

            <section className="mb-16" id="first-impressions">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    First Impressions Happen Fast
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    Visitors form opinions almost immediately. A responsive website creates confidence
                    through clear navigation, readable text, fast pages, professional layouts, and
                    easy-to-find contact information.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {FIRST_IMPRESSION_ITEMS.map((text) => (
                        <div
                            key={text}
                            className="rounded-lg border border-[#c1c8c4] bg-white p-4 text-sm text-[#414845]"
                        >
                            {text}
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-base text-[#414845]">
                    Your website is your digital storefront — a polished first impression builds trust
                    before a conversation begins.
                </p>
            </section>

            <section className="mb-16" id="ux-results">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Better User Experience Means Better Results
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    User experience is one of the biggest factors in converting visitors into customers.
                    Responsive design makes it easier to:
                </p>
                <div className="flex flex-wrap gap-2">
                    {UX_ACTIONS.map((text) => (
                        <span
                            key={text}
                            className="rounded bg-[rgba(107,142,131,0.1)] px-3 py-1 text-sm font-medium tracking-wide text-[#416359]"
                        >
                            {text}
                        </span>
                    ))}
                </div>
                <p className="mt-4 text-base text-[#414845]">
                    Every unnecessary tap, zoom, or confusing layout increases the chance a visitor
                    leaves. The easier your site is to use, the more likely visitors become customers.
                </p>
            </section>

            <section className="mb-16" id="seo">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Responsive Design Helps SEO
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    Search engines recommend sites that provide a positive experience. Responsive design
                    supports mobile usability, page experience, readability, navigation consistency, and
                    crawl efficiency — without maintaining separate mobile versions.
                </p>
                <ul className="mb-4 space-y-2">
                    {SEO_BENEFITS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="trending_up" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <Link
                    href="/resources/seo-basics-for-local-businesses"
                    className="inline-flex items-center gap-1 font-medium text-[#416359] hover:underline"
                >
                    SEO basics for local businesses
                    <MaterialIcon name="arrow_forward" className="!text-base" />
                </Link>
            </section>

            <section className="mb-16" id="ai-search">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Responsive Design Supports AI Search
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    People increasingly find businesses through AI-powered search and conversational
                    assistants. These systems favor websites that are easy to navigate, well-structured,
                    fast-loading, clearly organized, and accessible on every device.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                    {AI_SEARCH_FAVORS.map((text) => (
                        <span
                            key={text}
                            className="rounded border border-[#c1c8c4] px-3 py-1 text-sm text-[#414845]"
                        >
                            {text}
                        </span>
                    ))}
                </div>
                <Link
                    href="/resources/what-google-ai-search-means-for-small-businesses"
                    className="inline-flex items-center gap-1 font-medium text-[#416359] hover:underline"
                >
                    Google AI search guide
                    <MaterialIcon name="arrow_forward" className="!text-base" />
                </Link>
            </section>

            <section className="mb-16" id="accessibility">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Accessibility Benefits Everyone
                </h2>
                <p className="text-base text-[#1b1c1c]">
                    Responsive design also improves accessibility for users who increase text size, use
                    screen readers, navigate with keyboards, have limited vision, or use touch devices
                    with varying screen sizes. Designing with accessibility in mind serves a wider
                    audience while improving usability for everyone.
                </p>
            </section>

            <section className="mb-16" id="performance">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Faster Websites Keep Visitors Engaged
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    Visitors expect fast loading on every device. Responsive sites often improve
                    performance by:
                </p>
                <ul className="mb-4 space-y-2">
                    {PERFORMANCE_BENEFITS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="speed" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-base text-[#414845]">
                    Even small speed improvements can reduce bounce rates and increase conversions.
                </p>
            </section>

            <section className="mb-16" id="consistency">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Consistency Builds Trust
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    Inconsistent mobile and desktop experiences create confusion. Responsive design
                    ensures visitors encounter the same branding, information, services, and calls to
                    action on every device.
                </p>
                <ul className="space-y-2">
                    {CONSISTENCY_ITEMS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="sync" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mb-16" id="future-proof">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Future-Proofing Your Website
                </h2>
                <p className="text-base text-[#1b1c1c]">
                    Foldable phones, ultra-wide monitors, tablets, smart TVs, and new resolutions all
                    present unique viewing experiences. Responsive foundations are built with flexibility
                    in mind — extending the life of your investment instead of rebuilding every few
                    years.
                </p>
            </section>

            <section className="mb-16" id="investment">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    An Investment in Your Business
                </h2>
                <p className="mb-4 text-base text-[#1b1c1c]">
                    Your website is often the first interaction someone has with your company. Responsive
                    design removes unnecessary barriers so visitors can focus on what matters — choosing
                    your business.
                </p>
                <p className="mb-6 text-base text-[#414845]">
                    As expectations continue to rise, responsive web design is a fundamental requirement
                    for businesses that want to compete online today and stay prepared for tomorrow.
                </p>
                <div className="rounded-lg border border-[#c1c8c4] bg-[color-mix(in_srgb,#f6f3f2_40%,transparent)] p-6">
                    <h3 className="dc-display mb-4 text-xl font-semibold text-[#1b1c1c]">
                        Key Takeaways
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {RESPONSIVE_WEB_DESIGN_TAKEAWAYS.map((text, i) => (
                            <div key={text} className="flex gap-3 text-sm text-[#414845]">
                                <span className="dc-code shrink-0 text-[#416359]">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {["RESPONSIVE DESIGN", "MOBILE UX", "LOCAL BUSINESS"].map((tag) => (
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

export function ResponsiveWebDesignDesktopFooter() {
    return (
        <DcNextStepsDesktop
            steps={[
                {
                    href: "/pricing",
                    title: "View Pricing",
                    body: "Responsive websites for Toronto small businesses.",
                },
                {
                    href: "/contact",
                    title: "Discuss Your Website",
                    body: "Talk about mobile performance and your next project.",
                },
            ]}
        />
    );
}
