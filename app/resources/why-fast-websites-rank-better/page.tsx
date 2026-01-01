import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Why Fast Websites Rank Better (and Convert More Visitors) | Nice Guy Services",
    description:
        "Learn why website speed matters for SEO, user experience, and conversions — and how modern websites outperform bloated templates.",
};

export default function WhyFastWebsitesRankBetterPage() {
    return (
        <section className="max-w-4xl mx-auto px-6 py-16 space-y-10">
            {/* Article header */}
            <header className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Why Fast Websites Rank Better (and Convert More Visitors)
                </h1>
                <p className="text-lg text-muted-foreground">
                    Website speed isn’t just about convenience — it directly affects SEO,
                    trust, and whether visitors become customers.
                </p>

                {/* Optional trust signal */}
                <p className="text-sm text-muted-foreground">
                    Last updated: <time dateTime="2025-12-31">December 31, 2025</time>
                </p>
            </header>

            {/* Intro */}
            <section className="space-y-4">
                <p>
                    When someone visits a website, they make a decision in seconds. If the
                    site feels slow, cluttered, or unresponsive, most people leave before
                    reading a single word.
                </p>
                <p>
                    Search engines like Google notice this behavior. That’s why fast,
                    well-structured websites consistently rank higher and convert better
                    than slow, bloated ones.
                </p>
            </section>

            {/* Core Web Vitals */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Speed Is a Direct Google Ranking Factor
                </h2>
                <p>
                    Google uses performance signals known as <strong>Core Web Vitals</strong>{" "}
                    to evaluate user experience. These measurements focus on how quickly a
                    page loads, how stable it feels, and how responsive it is.
                </p>
                <p>
                    Websites that load slowly or shift around while loading tend to rank
                    lower — even if the content itself is good.
                </p>
            </section>

            {/* Conversion impact */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Fast Websites Build Trust and Increase Conversions
                </h2>
                <p>
                    For small businesses, a website is often the first impression. A slow
                    site feels outdated and unreliable, while a fast site feels
                    professional and trustworthy.
                </p>
                <p>Faster websites lead to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Lower bounce rates</li>
                    <li>More time spent on the site</li>
                    <li>Higher contact form submissions</li>
                    <li>More phone calls and inquiries</li>
                </ul>
            </section>

            {/* Why many sites are slow */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Why Many Small Business Websites Are Slow
                </h2>
                <p>
                    Many template-based websites rely on heavy themes, plugins, and
                    unnecessary features. While convenient, this often results in:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Large file sizes</li>
                    <li>Extra scripts loading on every page</li>
                    <li>Poor mobile performance</li>
                    <li>Long-term maintenance issues</li>
                </ul>
                <p>
                    Over time, these sites become harder to manage and harder for search
                    engines to understand.
                </p>
            </section>

            {/* Modern approach */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    How Modern Websites Solve This Problem
                </h2>
                <p>
                    Modern{" "}
                    <Link
                        href="/services"
                        className="text-primary font-medium hover:underline"
                        aria-label="View Nice Guy Services website services"
                    >
                        custom-built websites
                    </Link>{" "}
                    focus on performance from the start. Instead of loading everything at
                    once, they deliver what visitors need — quickly and efficiently.
                </p>
                <p>
                    This results in faster load times, better SEO performance, and a
                    smoother experience across all devices.
                </p>
            </section>

            {/* Conclusion */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Speed Is an Investment, Not a Feature
                </h2>
                <p>
                    A fast website isn’t just a technical improvement — it’s a business
                    advantage. It helps customers find you, trust you, and take action.
                </p>
                <p>
                    When speed, clarity, and structure are built in from day one, your
                    website becomes a long-term asset instead of a recurring problem.
                </p>
            </section>

            {/* Internal linking CTA */}
            <section className="pt-8 border-t space-y-4">
                <p className="text-muted-foreground">
                    These performance principles are applied to every website I build for
                    small businesses.
                </p>
                <Link
                    href="/services"
                    className="inline-block text-primary font-medium hover:underline"
                >
                    View website services →
                </Link>
                <div>
                    <Link
                        href="/resources"
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        ← Back to resources
                    </Link>
                </div>
            </section>
        </section>
    );
}
