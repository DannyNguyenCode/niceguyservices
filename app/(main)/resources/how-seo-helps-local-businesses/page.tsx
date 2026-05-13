import type { Metadata } from "next";
import Link from "next/link";
import ResourceArticleTemplate, {
    ResourceSection,
} from "@/components/resources/ResourceArticleTemplate";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "How SEO Helps Small Businesses Get More Calls | Nice Guy Web Design",
    description:
        "A simple explanation of how SEO helps small businesses get found by nearby customers — and what actually matters for rankings.",
    alternates: {
        canonical: absoluteUrl("/resources/how-seo-helps-local-businesses"),
    },
};

export default function HowSEOHelpsLocalServiceBusinessesPage() {
    return (
        <ResourceArticleTemplate
            seriesBadge="Local SEO 02"
            title="How SEO helps small businesses get more calls"
            updatedIso="2025-12-31"
            updatedLabel="December 31, 2025"
            heroImage={{
                src: "/images/Toronto-city-map.png",
                alt: "Stylized map suggesting local service areas and discovery",
            }}
            executiveSummary="Local SEO is clarity: help search engines and people see what you do, where you work, and why you’re trustworthy."
            comparisonBars={[
                {
                    label: "Relevance (clear services)",
                    valueLabel: "High",
                    fillPercent: 92,
                    variant: "primary",
                },
                {
                    label: "Trust (citations & proof)",
                    valueLabel: "Strong",
                    fillPercent: 85,
                    variant: "primary",
                },
                {
                    label: "Technical foundation (speed)",
                    valueLabel: "Critical",
                    fillPercent: 88,
                    variant: "secondary",
                },
            ]}
            expertTip={{
                title: "Expert tip",
                body: "Keep your Google Business Profile aligned with your website: same business name, categories, service areas, and phone number. Mismatches confuse both people and algorithms.",
            }}
            cta={{
                title: "Want a site built for local discovery?",
                body: "Clear service pages, fast performance, and structured content make local SEO far easier to sustain.",
                primary: { href: "/contact", label: "Get in touch" },
                secondary: { href: "/services", label: "View services" },
            }}
            articleStructuredData={{
                headline: "How SEO helps small businesses get more calls",
                description:
                    "A simple explanation of how SEO helps small businesses get found by nearby customers — and what actually matters for rankings.",
                datePublished: "2025-12-31",
                dateModified: "2025-12-31",
                pagePath: "/resources/how-seo-helps-local-businesses",
                heroImageSrc: "/images/Toronto-city-map.png",
            }}
        >
            <div className="space-y-6 text-lg leading-relaxed text-(--pm-on-surface-variant)">
                <p>
                    SEO isn’t about tricks or stuffing keywords — it’s about helping nearby
                    customers find and trust your business when they need what you offer.
                </p>
                <p>
                    For many small businesses, customers start with a search. They’re
                    looking for someone nearby, reliable, and ready to help — whether
                    that’s a local trade or a professional service.
                </p>
                <p>
                    Search engine optimization (SEO) is how your business shows up in
                    those searches — not randomly, but because your website clearly explains
                    what you do, where you operate, and why you’re trustworthy. A{" "}
                    <Link
                        href="/services"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                        aria-label="View Nice Guy Web Design website services"
                    >
                        well-structured website
                    </Link>{" "}
                    makes that easier for both customers and search engines.
                </p>
            </div>

            <ResourceSection index="01" title="How local search actually works">
                <p>When someone searches for a service, Google tries to show results that are:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Relevant to what’s being searched</li>
                    <li>Located close to the searcher</li>
                    <li>Clear, trustworthy, and easy to understand</li>
                </ul>
                <p>
                    A well-structured website helps Google confidently match your business
                    with the right searches — especially when people are looking locally.
                </p>
            </ResourceSection>

            <ResourceSection index="02" accent="secondary" title={<>What SEO is <em>not</em></>}>
                <p>
                    SEO is often misunderstood. It’s not about stuffing keywords onto a page
                    or chasing shortcuts that stop working later.
                </p>
                <p>
                    For small businesses, SEO is mostly about clarity — making it easy for
                    both people and search engines to understand your services, service
                    areas, and credibility.
                </p>
            </ResourceSection>

            <ResourceSection index="03" title="What actually matters for SEO">
                <p>The strongest SEO results come from a combination of:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Clear service pages that explain what you do</li>
                    <li>Location signals that show where you operate (when relevant)</li>
                    <li>Fast, mobile-friendly website performance</li>
                    <li>Helpful content that answers real customer questions</li>
                </ul>
                <p>
                    When these pieces work together, your website becomes easier to rank
                    and easier for customers to trust.
                </p>
            </ResourceSection>

            <ResourceSection
                index="04"
                accent="secondary"
                title="Why SEO leads to more calls (not just traffic)"
            >
                <p>
                    Good SEO doesn’t just bring more visitors — it brings the right
                    visitors. People searching are often ready to call, request a quote, or
                    book a service.
                </p>
                <p>
                    A clear, fast website with focused content helps turn those searches
                    into real inquiries instead of missed opportunities.
                </p>
            </ResourceSection>

            <ResourceSection index="05" title="Why website structure matters">
                <p>
                    Many small business websites exist, but they aren’t structured in a way
                    that supports SEO. Pages may be slow, cluttered, or unclear about
                    services and locations.
                </p>
                <p>
                    Modern, custom-built websites focus on clarity and performance from the
                    start, making it easier for search engines to understand the business
                    and for customers to take action.
                </p>
            </ResourceSection>

            <ResourceSection index="06" accent="secondary" title="SEO is a long-term advantage">
                <p>
                    SEO isn’t about overnight results — it’s about building a website that
                    continues to work for your business over time.
                </p>
                <p>
                    When your site is clear, fast, and focused on real customer needs, SEO
                    becomes a steady source of leads instead of a mystery.
                </p>
                <p className="text-(--pm-on-surface-variant)">
                    These foundations are built into the sites I create for small businesses.{" "}
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
