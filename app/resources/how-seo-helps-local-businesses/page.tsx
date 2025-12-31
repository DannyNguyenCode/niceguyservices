import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "How SEO Helps Small Businesses Get More Calls | Nice Guy Services",
    description:
        "A simple explanation of how SEO helps small businesses get found by nearby customers — and what actually matters for rankings.",
};

export default function HowSEOHelpsLocalServiceBusinessesPage() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-16 space-y-10">
            {/* Article header */}
            <header className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    How SEO Helps Small Businesses Get More Calls
                </h1>
                <p className="text-lg text-muted-foreground">
                    SEO isn’t about tricks or stuffing keywords — it’s about helping nearby
                    customers find and trust your business when they need what you offer.
                </p>

                {/* Optional trust signal */}
                <p className="text-sm text-muted-foreground">
                    Last updated: <time dateTime="2025-12-31">December 31, 2025</time>
                </p>
            </header>

            {/* Intro */}
            <section className="space-y-4">
                <p>
                    For many small businesses, customers start with a search. They’re looking
                    for someone nearby, reliable, and ready to help — whether that’s a local
                    service company (like an electrician or landscaper) or a professional
                    service (like a consultant or clinic).
                </p>
                <p>
                    Search engine optimization (SEO) is how your business shows up in those
                    searches — not randomly, but because your website clearly explains what you
                    do, where you operate, and why you’re trustworthy. A{" "}
                    <Link
                        href="/services"
                        className="text-primary font-medium hover:underline"
                        aria-label="View Nice Guy Services website services"
                    >
                        well-structured website
                    </Link>{" "}
                    makes that easier for both customers and search engines.
                </p>
            </section>

            {/* How local search works */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">How Local Search Actually Works</h2>
                <p>
                    When someone searches for a service, Google tries to show results that are:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Relevant to what’s being searched</li>
                    <li>Located close to the searcher</li>
                    <li>Clear, trustworthy, and easy to understand</li>
                </ul>
                <p>
                    A well-structured website helps Google confidently match your business with
                    the right searches — especially when people are looking locally.
                </p>
            </section>

            {/* What SEO is not */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    What SEO Is <em>Not</em>
                </h2>
                <p>
                    SEO is often misunderstood. It’s not about stuffing keywords onto a page or
                    chasing shortcuts that stop working later.
                </p>
                <p>
                    For small businesses, SEO is mostly about clarity — making it easy for both
                    people and search engines to understand your services, service areas, and
                    credibility.
                </p>
            </section>

            {/* What actually matters */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">What Actually Matters for SEO</h2>
                <p>The strongest SEO results come from a combination of:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Clear service pages that explain what you do</li>
                    <li>Location signals that show where you operate (when relevant)</li>
                    <li>Fast, mobile-friendly website performance</li>
                    <li>Helpful content that answers real customer questions</li>
                </ul>
                <p>
                    When these pieces work together, your website becomes easier to rank and
                    easier for customers to trust.
                </p>
            </section>

            {/* Why this leads to more calls */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Why SEO Leads to More Calls (Not Just Traffic)
                </h2>
                <p>
                    Good SEO doesn’t just bring more visitors — it brings the right visitors.
                    People searching are often ready to call, request a quote, or book a service.
                </p>
                <p>
                    A clear, fast website with focused content helps turn those searches into
                    real inquiries instead of missed opportunities.
                </p>
            </section>

            {/* Tie to modern websites */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Why Website Structure Matters</h2>
                <p>
                    Many small business websites exist, but they aren’t structured in a way that
                    supports SEO. Pages may be slow, cluttered, or unclear about services and
                    locations.
                </p>
                <p>
                    Modern, custom-built websites focus on clarity and performance from the start,
                    making it easier for search engines to understand the business and for customers
                    to take action.
                </p>
            </section>

            {/* Conclusion */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">SEO Is a Long-Term Advantage</h2>
                <p>
                    SEO isn’t about overnight results — it’s about building a website that continues
                    to work for your business over time.
                </p>
                <p>
                    When your site is clear, fast, and focused on real customer needs, SEO becomes a
                    steady source of leads instead of a mystery.
                </p>
            </section>

            {/* Internal links */}
            <section className="pt-8 border-t space-y-4">
                <p className="text-muted-foreground">
                    These SEO foundations are built into every website I create for small businesses.
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
        </main>
    );
}
