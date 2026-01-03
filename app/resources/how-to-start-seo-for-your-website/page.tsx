import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "How to Start SEO on Your Website (Beginner Guide) | Nice Guy Services",
    description:
        "A beginner-friendly guide to integrating SEO on your website: what to do first, what to avoid, and how to build a solid foundation that leads to more calls and inquiries.",
};

export default function HowToStartSEOForBeginnersPage() {
    return (
        <section className="max-w-4xl mx-auto px-6 py-16 space-y-10">
            {/* Article header */}
            <header className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    How to Start Integrating SEO on Your Own Website
                </h1>
                <p className="text-lg text-muted-foreground">
                    A beginner-friendly checklist for making your website easier to find
                    on Google — without tricks, plugins, or keyword stuffing.
                </p>

                {/* Optional trust signal */}
                <p className="text-sm text-muted-foreground">
                    Last updated: <time dateTime="2026-01-03">January 3, 2026</time>
                </p>
            </header>

            {/* Intro */}
            <section className="space-y-4">
                <p>
                    SEO can feel confusing at first because there’s a lot of advice online
                    — and much of it is either overly technical or focused on shortcuts.
                    The truth is, you don’t need to do everything at once.
                </p>
                <p>
                    If you start with a few fundamentals (clarity, structure, and speed),
                    you’ll build a foundation that helps search engines understand your
                    site and helps real people trust your business. That’s the same
                    approach I bake into{" "}
                    <Link
                        href="/services"
                        className="text-primary font-medium hover:underline"
                        aria-label="View Nice Guy Services website services"
                    >
                        modern, custom websites
                    </Link>
                    .
                </p>
            </section>

            {/* What SEO is (and isn’t) */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">What SEO Is (and What It Isn’t)</h2>
                <p>SEO is not:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Stuffing keywords into every sentence</li>
                    <li>Buying backlinks or chasing “hacks”</li>
                    <li>Trying to rank one page for everything</li>
                </ul>
                <p>
                    SEO <strong>is</strong> about making your site clear and useful. When
                    your pages explain what you do, who you help, and how to take the next
                    step, search engines can match your site to the right searches.
                </p>
            </section>

            {/* Step 1 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Step 1: Pick One Clear Topic Per Page</h2>
                <p>
                    Each page should have one main purpose. This makes your website easier
                    for people to navigate and easier for Google to understand.
                </p>
                <p>Example:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Home:</strong> what you do + who it’s for</li>
                    <li><strong>Services:</strong> what you offer + what’s included</li>
                    <li><strong>Pricing:</strong> what it costs + how to choose an option</li>
                    <li><strong>Contact:</strong> how to reach you</li>
                </ul>
                <p>
                    Beginners often try to rank the homepage for every service and every
                    city. It’s better to keep pages focused and expand gradually.
                </p>
            </section>

            {/* Step 2 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Step 2: Use Headings Properly</h2>
                <p>
                    Headings are one of the easiest SEO wins because they define your
                    content structure.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Use one <strong>H1</strong> per page (the main topic)</li>
                    <li>Use <strong>H2</strong> for major sections</li>
                    <li>Use <strong>H3</strong> for sub-sections</li>
                </ul>
                <p>
                    Don’t choose heading levels based on how big the text looks — choose
                    them based on structure. You can style headings however you want with
                    CSS.
                </p>
            </section>

            {/* Step 3 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Step 3: Write Like a Human (Seriously)</h2>
                <p>
                    If your copy sounds unnatural because you’re trying to “fit keywords,”
                    it usually performs worse. Google is good at understanding natural
                    language and related phrases.
                </p>
                <p>
                    A simple rule: write answers to the questions a real customer would
                    ask, in plain language. Clarity beats cleverness.
                </p>
            </section>

            {/* Step 4 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Step 4: Make Your Site Fast and Mobile-Friendly</h2>
                <p>
                    Speed and mobile usability impact both rankings and conversions. If a
                    page feels slow or messy on a phone, visitors leave — and search
                    engines notice that behavior over time.
                </p>
                <p>Beginner-friendly wins:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Compress images and avoid uploading huge files</li>
                    <li>Keep layouts simple and avoid heavy scripts</li>
                    <li>Check your site on mobile and fix anything that feels annoying</li>
                </ul>
                <p>
                    If you’re building with modern tools (like Next.js), you already have a
                    big advantage — as long as you keep the site lean and intentional.
                </p>
            </section>

            {/* Step 5 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Step 5: Set Up the Essentials (No Tool Overload)</h2>
                <p>You don’t need 10 tools to start SEO. You need the basics:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Google Search Console:</strong> see queries, indexing, and errors
                    </li>
                    <li>
                        <strong>Sitemap + robots.txt:</strong> help search engines crawl your pages
                    </li>
                    <li>
                        <strong>Good titles + descriptions:</strong> improve clicks from search results
                    </li>
                </ul>
                <p>
                    Once these are in place, your site becomes easier to index, and you’ll
                    have real data to learn from.
                </p>
            </section>

            {/* Step 6 */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Step 6: Add Helpful Content Gradually</h2>
                <p>
                    You don’t need a blog to “do SEO,” but helpful content can build
                    authority over time. Think of content as answering questions your
                    customers already have.
                </p>
                <p>Good starter topics:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>How your service works</li>
                    <li>What affects pricing</li>
                    <li>Common mistakes to avoid</li>
                    <li>What to expect when hiring a professional</li>
                </ul>
                <p>
                    One clear, useful article beats ten shallow posts. Consistency matters
                    more than volume.
                </p>
            </section>

            {/* Common mistakes */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Common Beginner Mistakes to Avoid</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Targeting ultra-competitive keywords too early</li>
                    <li>Copying competitor content and swapping a few words</li>
                    <li>Ignoring mobile readability and page speed</li>
                    <li>Over-optimizing instead of being clear</li>
                    <li>Expecting results in days (SEO compounds)</li>
                </ul>
            </section>

            {/* Wrap-up */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">SEO Is a Foundation, Not a One-Time Task</h2>
                <p>
                    SEO works best when it’s built into your website from the start:
                    clean structure, clear pages, fast performance, and content that helps
                    real people.
                </p>
                <p>
                    If you focus on those fundamentals, you’ll have an SEO setup that
                    improves over time — and brings in the kind of visitors who are ready
                    to contact you.
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
        </section>
    );
}
