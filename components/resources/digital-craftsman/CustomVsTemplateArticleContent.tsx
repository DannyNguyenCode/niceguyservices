"use client";

import Image from "next/image";
import Link from "next/link";
import { DcMobileHero } from "./article-ui";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import type { DcArticleContentProps } from "./types";
import {
    CUSTOM_VS_TEMPLATE_TAKEAWAYS,
    DECISION_QUESTIONS,
} from "./customVsTemplateConfig";
import MaterialIcon from "./MaterialIcon";

const HERO_IMAGE = "/images/imageheader.png";

const section = "border-b border-[#c1c8c4] p-8 md:p-12";

const DECISION_FACTORS = [
    "goals",
    "budget",
    "timeline",
    "branding needs",
    "long-term plans",
];

const TEMPLATE_PLATFORMS = ["WordPress", "Wix", "Squarespace"];

const CUSTOM_TECH = ["Next.js", "React", "Tailwind CSS", "custom CMS solutions"];

const TEMPLATE_FIT_EXAMPLES = [
    "small cafés",
    "local startups",
    "solo contractors",
    "temporary campaigns",
    "simple informational websites",
];

const CUSTOM_FIT_EXAMPLES = [
    "businesses with specialized workflows",
    "brands focused heavily on visual identity",
    "companies investing in SEO and performance",
    "businesses building long-term digital strategies",
];

const TEMPLATE_BENEFITS = [
    {
        title: "Faster Launch Time",
        body: "Templates often reduce design and development time significantly. Businesses can sometimes launch within days instead of weeks.",
    },
    {
        title: "Lower Initial Cost",
        body: "Because much of the structure already exists, template websites are usually more affordable upfront.",
    },
    {
        title: "Easier Self-Management",
        body: "Many template platforms include drag-and-drop editing tools designed for non-technical users.",
    },
    {
        title: "Large Ecosystems",
        body: "Popular platforms often include plugins, themes, integrations, tutorials, and community support.",
    },
];

const CUSTOM_BENEFITS = [
    {
        title: "Stronger Brand Identity",
        body: "Layouts, interactions, and design systems can be tailored specifically to the business rather than adapted from a shared template.",
    },
    {
        title: "Better Flexibility",
        body: "Custom websites can be designed around business goals instead of adapting needs around template limitations.",
    },
    {
        title: "Performance Optimization",
        body: "Custom builds can be optimized more aggressively for speed, SEO, mobile usability, and accessibility.",
    },
    {
        title: "Scalability",
        body: "Custom systems may provide more flexibility as businesses expand or require new functionality over time.",
    },
];

const TEMPLATE_LIMITATIONS = [
    "customization",
    "performance",
    "scalability",
    "branding uniqueness",
    "advanced functionality",
];

const MISTAKES = [
    {
        title: "Choosing Based Only on Price",
        body: "The cheapest option is not always the most sustainable long term. At the same time, not every business needs an expensive custom solution immediately.",
    },
    {
        title: "Overbuilding Too Early",
        body: "Some businesses invest heavily in complex websites before validating their actual needs. Sometimes a simpler website is enough at the beginning.",
    },
    {
        title: "Ignoring Long-Term Goals",
        body: "A website should support where the business wants to go over time. Businesses planning long-term growth may eventually benefit from more flexibility.",
    },
    {
        title: "Prioritizing Features Over Clarity",
        body: "Visitors usually value easy navigation, clear information, trust, and contact accessibility more than excessive animations or complicated features.",
    },
];

function DottedLine() {
    return <span className="dc-dotted-line" aria-hidden />;
}

export default function CustomVsTemplateMobile({ meta }: DcArticleContentProps) {
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
                        One of the first decisions many businesses face is whether to use a website
                        template or a custom-built website. There is no single answer that works for
                        every business.
                    </p>
                    <p className="mb-4">Both approaches can work well depending on:</p>
                    <ul className="mb-6 flex flex-wrap gap-2">
                        {DECISION_FACTORS.map((f) => (
                            <li
                                key={f}
                                className="rounded bg-[rgb(107_142_131/0.1)] px-3 py-1 text-sm capitalize text-[#416359]"
                            >
                                {f}
                            </li>
                        ))}
                    </ul>
                    <p>
                        <span className="dc-display float-left mr-3 text-5xl leading-none text-[#416359]">
                            U
                        </span>
                        Understanding the differences can help businesses make more informed
                        decisions without feeling pressured toward one option.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Is a Template Website?
                    </h2>
                    <p className="mb-4">
                        A template website uses a pre-designed layout customized with business
                        information, colors, images, branding, and content.
                    </p>
                    <p className="mb-4">
                        Platforms like {TEMPLATE_PLATFORMS.join(", ")} offer ready-made templates
                        that can reduce development time, upfront cost, and technical complexity.
                    </p>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Is a Custom Website?
                    </h2>
                    <p className="mb-4">
                        A custom website is designed and developed specifically for a business
                        rather than built from a pre-made layout — often using {CUSTOM_TECH.slice(0, 3).join(", ")}, and similar tools.
                    </p>
                    <p>
                        This allows unique layouts, specialized functionality, personalized branding,
                        and tailored user experiences — typically with more flexibility but more planning
                        and development time.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        When Template Websites Make Sense
                    </h2>
                    <p className="mb-4">
                        Templates can work well when you need a site quickly, have a smaller budget,
                        need simple functionality, are launching for the first time, or primarily need
                        an online presence.
                    </p>
                    <ul className="mb-4 flex flex-wrap gap-2">
                        {TEMPLATE_FIT_EXAMPLES.map((ex) => (
                            <li
                                key={ex}
                                className="rounded border border-[#c1c8c4] bg-white px-3 py-1 text-sm text-[#414845]"
                            >
                                {ex}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Benefits of Template Websites
                    </h2>
                    <div className="space-y-6">
                        {TEMPLATE_BENEFITS.map(({ title, body }) => (
                            <div key={title} className="flex items-start gap-4">
                                <MaterialIcon
                                    name="check_circle"
                                    className="rounded bg-[rgb(89_123_113/0.2)] p-2 text-[#416359]"
                                />
                                <div>
                                    <p className="dc-display mb-1 text-xl leading-[1.3] font-medium text-[#1b1c1c]">
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
                        Limitations of Template Websites
                    </h2>
                    <p className="mb-4">
                        Some businesses eventually encounter challenges with:
                    </p>
                    <ul className="mb-4 space-y-2">
                        {TEMPLATE_LIMITATIONS.map((item) => (
                            <li key={item} className="flex items-start gap-2 capitalize">
                                <MaterialIcon name="info" className="mt-0.5 text-[#414845]" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-[#414845]">
                        As businesses grow, some templates may feel restrictive. Heavily modifying a
                        template can sometimes become more complicated than expected.
                    </p>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        When Custom Websites Make Sense
                    </h2>
                    <p className="mb-4">
                        Custom sites are often useful when you want stronger branding, unique
                        functionality, better performance, design flexibility, or long-term scalability.
                    </p>
                    <ul className="mb-4 flex flex-wrap gap-2">
                        {CUSTOM_FIT_EXAMPLES.map((ex) => (
                            <li
                                key={ex}
                                className="rounded bg-[rgb(107_142_131/0.1)] px-3 py-1 text-sm text-[#416359]"
                            >
                                {ex}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Benefits of Custom Websites
                    </h2>
                    <div className="space-y-6">
                        {CUSTOM_BENEFITS.map(({ title, body }) => (
                            <div key={title} className="flex items-start gap-4">
                                <MaterialIcon
                                    name="architecture"
                                    className="rounded bg-[rgb(89_123_113/0.2)] p-2 text-[#416359]"
                                />
                                <div>
                                    <p className="dc-display mb-1 text-xl leading-[1.3] font-medium text-[#416359]">
                                        {title}
                                    </p>
                                    <p className="text-[#414845]">{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#e4e2e1_20%,transparent)]`}>
                    <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Tradeoffs of Custom Websites
                    </h2>
                    <p className="mb-6 text-[#414845]">
                        Custom websites usually involve higher upfront costs, longer timelines, more
                        planning, and ongoing maintenance. Not every business requires a fully custom
                        solution immediately — the best option depends on goals and priorities.
                    </p>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-[#c1c8c4] bg-white p-6 shadow-sm">
                            <h3 className="dc-display mb-3 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                                Template
                            </h3>
                            <div className="mb-2 flex items-center text-sm text-[#414845]">
                                <span>Speed</span>
                                <DottedLine />
                                <span>Cost</span>
                            </div>
                            <p className="text-sm text-[#414845]">
                                Faster launch, lower upfront investment, easier self-management.
                            </p>
                        </div>
                        <div className="rounded-lg border-2 border-[#416359] bg-[rgb(89_123_113/0.1)] p-6">
                            <h3 className="dc-display mb-3 text-2xl leading-[1.3] font-medium text-[#416359]">
                                Custom
                            </h3>
                            <div className="mb-2 flex items-center text-sm text-[#416359]">
                                <span>Brand</span>
                                <DottedLine />
                                <span>Scale</span>
                            </div>
                            <p className="text-sm text-[#414845]">
                                Distinct identity, flexibility, performance, and room to grow.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        SEO Considerations
                    </h2>
                    <p className="mb-6">
                        Both can perform well when implemented properly. SEO depends more on content
                        quality, structure, technical optimization, mobile usability, speed, and
                        helpful information than on template vs custom alone. Custom sites may offer
                        more flexibility for advanced SEO over time.
                    </p>
                    <h3 className="dc-display mb-4 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                        User Experience Matters More Than Labels
                    </h3>
                    <p className="text-[#414845]">
                        Visitors care about clarity, trust, usability, and speed. A well-designed
                        template can outperform a poorly planned custom site — execution matters more
                        than labels alone.
                    </p>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#ffdad6_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Common Mistakes Businesses Make
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
                        Questions to Ask Yourself
                    </h2>
                    <div className="space-y-2">
                        {DECISION_QUESTIONS.map((q) => (
                            <div
                                key={q}
                                className="flex items-start gap-3 rounded border border-[#c1c8c4] p-4"
                            >
                                <MaterialIcon name="help" className="mt-0.5 shrink-0 text-[#416359]" />
                                <span>{q}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={section}>
                    <div className="relative h-48 w-full overflow-hidden rounded border border-[#c1c8c4]">
                        <Image
                            src={HERO_IMAGE}
                            alt="Desk with monitor showing a website layout mockup beside code, illustrating custom vs template design"
                            fill
                            className="object-cover"
                            sizes="672px"
                        />
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_20%,transparent)]`}>
                    <h2 className="dc-display mb-8 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Key Takeaways
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {CUSTOM_VS_TEMPLATE_TAKEAWAYS.map((text, i) => (
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
                        Choosing between template and custom is less about a universally
                        &quot;better&quot; option and more about the right fit. The most important goal
                        is a website that supports the business, serves customers effectively, and
                        communicates trust online.
                    </p>
                    <p className="mx-auto mb-8 max-w-lg text-[#414845]">
                        <Link href="/services" className="font-medium text-[#416359] hover:underline">
                            See how we build custom sites
                        </Link>{" "}
                        or{" "}
                        <Link href="/contact" className="font-medium text-[#416359] hover:underline">
                            contact us
                        </Link>{" "}
                        to discuss a custom build.
                    </p>
                    <DigitalCraftsmanAuditButton>Discuss Your Project</DigitalCraftsmanAuditButton>
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
                                body: "Compare options for your budget and timeline.",
                            },
                            {
                                href: "/services",
                                icon: "design_services",
                                title: "Our Services",
                                body: "Custom builds, SEO, and ongoing support for local businesses.",
                            },
                            {
                                href: "/contact",
                                icon: "mail",
                                title: "Contact",
                                body: "Get honest guidance on template vs custom.",
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
