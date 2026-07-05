"use client";

import Image from "next/image";
import Link from "next/link";
import { DcMobileHero } from "./article-ui";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import type { DcArticleContentProps } from "./types";
import {
    ACCESSIBILITY_USERS,
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
import MaterialIcon from "./MaterialIcon";

const MID_IMAGE = "/images/Futuristic-tech-abstract.png";

const section = "border-b border-[#c1c8c4] p-8 md:p-12";

export default function ResponsiveWebDesignMobile({ meta }: DcArticleContentProps) {
    return (
        <>
            <DcMobileHero
                badge={meta.badge}
                readTime={meta.readTime}
                title={meta.title}
                subtitle={meta.subtitle}
                dateModified={meta.dateModified}
            />

            <section className={`${section} text-base leading-relaxed text-[#1b1c1c]`} id="intro">
                <p className="mb-4">
                    Think about the last time you searched for a local business. You may have started
                    on your phone during lunch, looked at the same website later on a tablet, and
                    finally booked a service from your desktop at home. Customers rarely use just one
                    device anymore.
                </p>
                <p className="mb-4">
                    <span className="dc-display float-left mr-3 text-5xl leading-none text-[#416359]">
                        R
                    </span>
                    esponsive web design ensures your website automatically adapts to every screen size
                    without sacrificing usability, speed, or appearance. Instead of creating separate
                    mobile and desktop websites, a responsive website provides one consistent experience
                    across smartphones, tablets, laptops, and large desktop monitors.
                </p>
                <p>
                    In today&apos;s digital world, responsive design is no longer a luxury — it&apos;s
                    an expectation.
                </p>
            </section>

            <section className={section} id="what-is">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    What Is Responsive Web Design?
                </h2>
                <p className="mb-4">
                    Responsive web design is the practice of building websites that intelligently adjust
                    their layout based on the visitor&apos;s screen size.
                </p>
                <p className="mb-4">
                    Rather than simply shrinking everything to fit a smaller display, a responsive
                    website reorganizes content so that it remains readable, accessible, and easy to
                    interact with.
                </p>
                <p className="mb-4">Examples include:</p>
                <ul className="mb-4 space-y-2">
                    {RWD_EXAMPLES.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="check_circle" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p>
                    The goal is simple: every visitor should have an equally enjoyable experience
                    regardless of the device they use.
                </p>
            </section>

            <section className={section} id="mobile-traffic">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Mobile Traffic Continues to Grow
                </h2>
                <p className="mb-4">
                    For many businesses, more than half of all website visitors now come from mobile
                    devices. Depending on the industry, mobile traffic can account for well over 70% of
                    total visits.
                </p>
                <p className="mb-4">Imagine someone looking for:</p>
                <ul className="mb-4 space-y-2">
                    {MOBILE_SEARCH_SCENARIOS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="smartphone" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p className="mb-4">Most of these searches happen on a phone — not a desktop computer.</p>
                <p>
                    If your website isn&apos;t optimized for mobile users, potential customers may leave
                    before ever contacting you.
                </p>
            </section>

            <section className={section} id="first-impressions">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    First Impressions Happen Fast
                </h2>
                <p className="mb-4">
                    Visitors begin forming opinions about your website almost immediately.
                </p>
                <p className="mb-4">A responsive website creates confidence by providing:</p>
                <ul className="mb-4 space-y-2">
                    {FIRST_IMPRESSION_ITEMS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="verified" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p className="mb-4">
                    An outdated website that requires users to zoom, pinch, or scroll sideways often
                    gives the impression that the business itself may also be outdated.
                </p>
                <p>
                    Your website is often your digital storefront. A polished first impression builds
                    trust before a conversation even begins.
                </p>
            </section>

            <section className={section} id="ux-results">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Better User Experience Means Better Results
                </h2>
                <p className="mb-4">
                    User experience (UX) is one of the biggest factors in converting visitors into
                    customers.
                </p>
                <p className="mb-4">
                    Responsive design improves usability by making it easier for visitors to:
                </p>
                <ul className="mb-4 space-y-2">
                    {UX_ACTIONS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="arrow_forward" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p className="mb-4">
                    Every unnecessary tap, zoom, or confusing layout increases the chance that a
                    visitor leaves your website.
                </p>
                <p>
                    The easier your website is to use, the more likely visitors are to become customers.
                </p>
            </section>

            <section className={section} id="seo">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Responsive Design Helps Search Engine Optimization (SEO)
                </h2>
                <p className="mb-4">
                    Search engines want to recommend websites that provide a positive experience.
                </p>
                <p className="mb-4">Responsive websites support SEO by improving:</p>
                <ul className="mb-4 space-y-2">
                    {SEO_BENEFITS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="trending_up" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p className="mb-4">
                    A responsive website also eliminates the need for separate mobile versions, making it
                    easier for search engines to understand and index your content.
                </p>
                <p className="mb-4">
                    While responsive design alone won&apos;t guarantee higher rankings, it provides an
                    essential foundation for strong technical SEO.
                </p>
                <Link
                    href="/resources/seo-basics-for-local-businesses"
                    className="font-medium text-[#416359] underline-offset-2 hover:underline"
                >
                    Read: SEO basics for local businesses
                </Link>
            </section>

            <section className={section} id="ai-search">
                <Image
                    src={MID_IMAGE}
                    alt="Abstract visualization suggesting modern search and connected devices"
                    width={800}
                    height={320}
                    className="mb-6 h-56 w-full rounded-xl border border-[#c1c8c4] object-cover"
                />
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Responsive Design Supports AI Search
                </h2>
                <p className="mb-4">Search is changing rapidly.</p>
                <p className="mb-4">
                    People are increasingly finding businesses through AI-powered search experiences and
                    conversational assistants rather than traditional search results alone.
                </p>
                <p className="mb-4">These systems favor websites that are:</p>
                <ul className="mb-4 space-y-2">
                    {AI_SEARCH_FAVORS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="auto_awesome" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p className="mb-4">
                    When your content is easy for both users and machines to understand, it becomes more
                    useful for modern search experiences.
                </p>
                <p className="mb-4">
                    Responsive design works alongside quality content, structured data, and strong website
                    architecture to improve your overall online presence.
                </p>
                <Link
                    href="/resources/what-google-ai-search-means-for-small-businesses"
                    className="font-medium text-[#416359] underline-offset-2 hover:underline"
                >
                    Read: What Google AI Search means for small businesses
                </Link>
            </section>

            <section className={section} id="accessibility">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Accessibility Benefits Everyone
                </h2>
                <p className="mb-4">Responsive design isn&apos;t only about screen sizes.</p>
                <p className="mb-4">It also improves accessibility for users who:</p>
                <ul className="mb-4 space-y-2">
                    {ACCESSIBILITY_USERS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="accessibility_new" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p>
                    Designing with accessibility in mind helps create a website that serves a wider
                    audience while improving usability for everyone.
                </p>
            </section>

            <section className={section} id="performance">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Faster Websites Keep Visitors Engaged
                </h2>
                <p className="mb-4">Performance matters.</p>
                <p className="mb-4">
                    Visitors expect websites to load quickly, regardless of the device they&apos;re using.
                </p>
                <p className="mb-4">Responsive websites often improve performance by:</p>
                <ul className="mb-4 space-y-2">
                    {PERFORMANCE_BENEFITS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="speed" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p>
                    Even small improvements in loading speed can reduce bounce rates and increase
                    conversions.
                </p>
            </section>

            <section className={section} id="consistency">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Consistency Builds Trust
                </h2>
                <p className="mb-4">
                    Imagine visiting a business website on your phone, only to find missing features that
                    appear on the desktop version later.
                </p>
                <p className="mb-4">Inconsistent experiences create confusion.</p>
                <p className="mb-4">Responsive design ensures visitors encounter:</p>
                <ul className="mb-4 space-y-2">
                    {CONSISTENCY_ITEMS.map((text) => (
                        <li key={text} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon name="sync" className="mt-0.5 shrink-0 text-[#416359]" />
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
                <p>
                    No matter which device someone uses, your business presents itself consistently.
                </p>
            </section>

            <section className={section} id="future-proof">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Future-Proofing Your Website
                </h2>
                <p className="mb-4">New devices continue to appear every year.</p>
                <p className="mb-4">
                    Foldable phones, ultra-wide monitors, tablets, smart TVs, and new screen resolutions
                    all present unique viewing experiences.
                </p>
                <p className="mb-4">
                    Responsive websites are designed with flexibility in mind, making them easier to adapt
                    as technology evolves.
                </p>
                <p>
                    Rather than rebuilding your website every few years, responsive foundations help
                    extend the life of your investment.
                </p>
            </section>

            <section className={section} id="investment">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Responsive Design Is an Investment in Your Business
                </h2>
                <p className="mb-4">
                    Your website often serves as the first interaction someone has with your company.
                </p>
                <p className="mb-4">
                    A responsive website helps ensure that first interaction is a positive one by
                    creating an experience that feels professional, trustworthy, and easy to use on any
                    device.
                </p>
                <p className="mb-4">
                    Whether someone is researching your services, requesting a quote, reading customer
                    reviews, or contacting your business, responsive design removes unnecessary barriers
                    and allows visitors to focus on what matters most — choosing your company.
                </p>
                <p>
                    As customer expectations continue to rise, responsive web design is no longer simply
                    a best practice. It&apos;s a fundamental requirement for businesses that want to
                    compete online today and remain prepared for the technologies of tomorrow.
                </p>
            </section>

            <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_20%,transparent)]`}>
                <h2 className="dc-display mb-8 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Key Takeaways
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {RESPONSIVE_WEB_DESIGN_TAKEAWAYS.map((text, i) => (
                        <div
                            key={text}
                            className="rounded border border-[#c1c8c4] bg-white p-5"
                        >
                            <span className="dc-code mb-1 block text-sm text-[#416359]">
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
                    Responsive design is not a cosmetic upgrade — it is how modern businesses meet
                    customers where they already are, on whatever screen they happen to be using.
                </p>
                <p className="mx-auto mb-8 max-w-lg text-[#414845]">
                    A site that works everywhere removes friction, builds trust, and makes it easier for
                    visitors to take the next step with your business.
                </p>
                <DigitalCraftsmanAuditButton>Discuss Your Website</DigitalCraftsmanAuditButton>
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
                            body: "Responsive websites for Toronto small businesses.",
                        },
                        {
                            href: "/services",
                            icon: "gallery_thumbnail",
                            title: "View Projects",
                            body: "See sites built to work on every screen.",
                        },
                        {
                            href: "/contact",
                            icon: "mail",
                            title: "Contact",
                            body: "Discuss mobile performance and your next site.",
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
