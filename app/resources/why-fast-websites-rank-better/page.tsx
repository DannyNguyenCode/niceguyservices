import type { Metadata } from "next";
import Link from "next/link";
import ResourceArticleTemplate, {
    ResourceSection,
} from "@/components/resources/ResourceArticleTemplate";

export const metadata: Metadata = {
    title: "Why Fast Websites Rank Better (and Convert More Visitors) | Nice Guy Services",
    description:
        "Learn why website speed matters for SEO, user experience, and conversions — and how modern websites outperform bloated templates.",
};

export default function WhyFastWebsitesRankBetterPage() {
    return (
        <ResourceArticleTemplate
            seriesBadge="Performance 04"
            title={
                <>
                    Why fast websites rank better{" "}
                    <span className="text-primary">(and convert more)</span>
                </>
            }
            updatedIso="2025-12-31"
            updatedLabel="December 31, 2025"
            heroImage={{
                src: "/images/Futuristic-tech-abstract.png",
                alt: "Abstract technology visual suggesting speed and precision",
            }}
            executiveSummary="Speed signals trust to visitors and quality to search engines; bloated templates often work against both."
            comparisonBars={[
                {
                    label: "Modern lean stack",
                    valueLabel: "Strong",
                    fillPercent: 92,
                    variant: "primary",
                },
                {
                    label: "Heavy template + plugins",
                    valueLabel: "Risk",
                    fillPercent: 65,
                    variant: "secondary",
                },
                {
                    label: "Visitor patience",
                    valueLabel: "Low",
                    fillPercent: 25,
                    variant: "secondary",
                },
            ]}
            expertTip={{
                title: "Expert tip",
                body: "Measure real pages on mobile throttling, not just your desktop on Wi‑Fi. That’s where Core Web Vitals pain shows up first.",
            }}
            cta={{
                title: "Ready for a faster, clearer site?",
                body: "Performance-first builds help SEO, trust, and conversions at the same time.",
                primary: { href: "/contact", label: "Discuss your project" },
                secondary: { href: "/services", label: "View services" },
            }}
        >
            <div className="space-y-6 text-lg leading-relaxed text-(--pm-on-surface-variant)">
                <p>
                    Website speed isn’t just about convenience — it directly affects SEO,
                    trust, and whether visitors become customers.
                </p>
                <p>
                    When someone visits a website, they make a decision in seconds. If the
                    site feels slow, cluttered, or unresponsive, most people leave before
                    reading a single word.
                </p>
                <p>
                    Search engines like Google notice this behavior. That’s why fast,
                    well-structured websites consistently rank higher and convert better than
                    slow, bloated ones.
                </p>
            </div>

            <ResourceSection index="01" title="Speed is a direct Google ranking factor">
                <p>
                    Google uses performance signals known as{" "}
                    <strong className="text-(--pm-on-surface)">Core Web Vitals</strong> to
                    evaluate user experience. These measurements focus on how quickly a page
                    loads, how stable it feels, and how responsive it is.
                </p>
                <p>
                    Websites that load slowly or shift around while loading tend to rank
                    lower — even if the content itself is good.
                </p>
            </ResourceSection>

            <ResourceSection
                index="02"
                accent="secondary"
                title="Fast websites build trust and increase conversions"
            >
                <p>
                    For small businesses, a website is often the first impression. A slow
                    site feels outdated and unreliable, while a fast site feels
                    professional and trustworthy.
                </p>
                <p>Faster websites lead to:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Lower bounce rates</li>
                    <li>More time spent on the site</li>
                    <li>Higher contact form submissions</li>
                    <li>More phone calls and inquiries</li>
                </ul>
            </ResourceSection>

            <ResourceSection index="03" title="Why many small business websites are slow">
                <p>
                    Many template-based websites rely on heavy themes, plugins, and
                    unnecessary features. While convenient, this often results in:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Large file sizes</li>
                    <li>Extra scripts loading on every page</li>
                    <li>Poor mobile performance</li>
                    <li>Long-term maintenance issues</li>
                </ul>
                <p>
                    Over time, these sites become harder to manage and harder for search
                    engines to understand.
                </p>
            </ResourceSection>

            <ResourceSection
                index="04"
                accent="secondary"
                title="How modern websites solve this problem"
            >
                <p>
                    Modern{" "}
                    <Link
                        href="/services"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                        aria-label="View Nice Guy Services website services"
                    >
                        custom-built websites
                    </Link>{" "}
                    focus on performance from the start. Instead of loading everything at
                    once, they deliver what visitors need — quickly and efficiently.
                </p>
                <p>
                    This results in faster load times, better SEO performance, and a smoother
                    experience across all devices.
                </p>
            </ResourceSection>

            <ResourceSection index="05" title="Speed is an investment, not a feature">
                <p>
                    A fast website isn’t just a technical improvement — it’s a business
                    advantage. It helps customers find you, trust you, and take action.
                </p>
                <p>
                    When speed, clarity, and structure are built in from day one, your
                    website becomes a long-term asset instead of a recurring problem.
                </p>
                <p className="text-(--pm-on-surface-variant)">
                    These performance principles are applied to every website I build for
                    small businesses.{" "}
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
