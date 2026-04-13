import type { Metadata } from "next";
import Link from "next/link";
import {
    BoltIcon,
    NoSymbolIcon,
    ShieldExclamationIcon,
    Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import ResourceArticleTemplate, {
    ResourceLimitationList,
    ResourceQuoteCallout,
    ResourceSection,
} from "@/components/resources/ResourceArticleTemplate";

export const metadata: Metadata = {
    title: "Custom Websites vs Templates: What Small Businesses Should Know | Nice Guy Services",
    description:
        "A practical comparison of custom-built websites versus templates like WordPress or Wix — and how each impacts performance, SEO, and long-term growth.",
};

export default function CustomWebsitesVsTemplatesPage() {
    return (
        <ResourceArticleTemplate
            seriesBadge="Website strategy 01"
            title={
                <>
                    Custom Websites <span className="text-primary">vs</span>{" "}
                    Templates
                </>
            }
            updatedIso="2025-12-31"
            updatedLabel="December 31, 2025"
            heroImage={{
                src: "/images/Futuristic-tech-abstract.png",
                alt: "Abstract digital architecture and soft purple lighting",
            }}
            executiveSummary="Choosing between bespoke builds and pre-built themes shapes performance, SEO depth, and how far you can grow before rework."
            comparisonBars={[
                {
                    label: "Custom flexibility",
                    valueLabel: "100%",
                    fillPercent: 100,
                    variant: "primary",
                },
                {
                    label: "Typical template flexibility",
                    valueLabel: "35%",
                    fillPercent: 35,
                    variant: "secondary",
                },
                {
                    label: "Lean performance potential",
                    valueLabel: "High",
                    fillPercent: 90,
                    variant: "primary",
                },
            ]}
            expertTip={{
                title: "Expert tip",
                body: "For some products, a custom marketing site plus a templated app dashboard can balance brand polish with delivery speed—just keep the public site fast and clear.",
            }}
            cta={{
                title: "Ready for a site built around your business?",
                body: "If your website is core to leads and trust, a custom build can remove bloat and grow with you.",
                primary: { href: "/contact", label: "Start a conversation" },
                secondary: { href: "/services", label: "View services" },
            }}
        >
            <div className="space-y-6 text-lg leading-relaxed text-(--pm-on-surface-variant)">
                <p>
                    Templates are popular for a reason — but they aren’t always the best
                    long-term choice. Here’s how custom websites compare and when each
                    option makes sense.
                </p>
                <p>
                    When building a website, most small business owners face the same
                    question: should you use a template platform like WordPress or Wix, or
                    invest in a custom-built website? The right answer depends on your
                    goals.
                </p>
            </div>

            <ResourceSection index="01" title="What template websites are">
                <p>
                    Template websites use pre-built themes and layouts that can be quickly
                    customized. Platforms like WordPress, Wix, and Squarespace make it easy
                    to get online without much technical setup.
                </p>
                <p>
                    For early-stage businesses or simple projects, templates can be a
                    reasonable starting point.
                </p>
            </ResourceSection>

            <ResourceQuoteCallout
                title="Structural integrity"
                icon={Square3Stack3DIcon}
                quote={
                    <>
                        “A custom website is not a luxury; it is a strategic investment in
                        clarity and speed. Templates are a starting point; custom is built
                        for where you’re going.”
                    </>
                }
            />

            <ResourceSection
                index="02"
                accent="secondary"
                title="Common limitations of template-based websites"
            >
                <p>
                    While convenient, templates often come with trade-offs that aren’t
                    obvious at first:
                </p>
                <ResourceLimitationList
                    items={[
                        {
                            icon: NoSymbolIcon,
                            title: "Extra weight you don’t need",
                            description:
                                "Bundled features, scripts, and styles you never use still load and slow the experience.",
                        },
                        {
                            icon: BoltIcon,
                            title: "Performance drag",
                            description:
                                "Heavy themes and plugins stack up, hurting load times and Core Web Vitals.",
                        },
                        {
                            icon: ShieldExclamationIcon,
                            title: "Maintenance surface area",
                            description:
                                "More moving parts mean more updates, conflicts, and security exposure over time.",
                        },
                    ]}
                />
                <p>
                    Over time, these issues can affect performance, SEO, and the overall
                    experience for visitors.
                </p>
            </ResourceSection>

            <ResourceSection index="03" title="What a custom website means">
                <p>
                    A custom website is designed and built specifically for your business.
                    Instead of adapting your content to fit a theme, the site is structured
                    around your services, goals, and customers.
                </p>
                <p>
                    This approach removes unnecessary features and focuses only on what
                    helps your business perform well online.
                </p>
            </ResourceSection>

            <ResourceSection
                index="04"
                accent="secondary"
                title="Performance, SEO, and long-term value"
            >
                <p>
                    Custom-built websites are typically faster and easier for search
                    engines to understand. With fewer plugins and cleaner structure, pages
                    load quicker and perform better across devices.
                </p>
                <p>
                    Faster websites tend to rank better, keep visitors engaged longer, and
                    convert more consistently.
                </p>
            </ResourceSection>

            <ResourceSection index="05" title="When templates can be the right choice">
                <p>
                    Templates aren’t bad — they’re just designed for general use. They may
                    be suitable if:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>You need something temporary or experimental</li>
                    <li>Your site has very simple requirements</li>
                    <li>You’re comfortable managing updates and plugins</li>
                </ul>
            </ResourceSection>

            <ResourceSection
                index="06"
                accent="secondary"
                title="When a custom website makes more sense"
            >
                <p>
                    A custom website is often a better fit when your website is a core part
                    of your business — not just an online brochure.
                </p>
                <p>
                    Businesses that rely on visibility, trust, and consistent leads often
                    benefit from a site built for speed, clarity, and growth.
                </p>
            </ResourceSection>

            <ResourceSection index="07" title="Choosing the right tool for your business">
                <p>
                    Templates and custom websites serve different purposes. The key is
                    choosing a solution that supports where your business is going — not
                    just where it is today.
                </p>
                <p>
                    A website built intentionally can become a long-term asset instead of a
                    recurring source of frustration.
                </p>
                <p className="text-(--pm-on-surface-variant)">
                    These principles guide how I build for small businesses — performance,
                    clarity, and long-term value.{" "}
                    <Link
                        href="/services"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        View website services
                    </Link>
                    .
                </p>
            </ResourceSection>
        </ResourceArticleTemplate>
    );
}
