import type { Metadata } from "next";
import Link from "next/link";
import ResourceArticleTemplate, {
    ResourceSection,
} from "@/components/resources/ResourceArticleTemplate";

export const metadata: Metadata = {
    title: "How to Start SEO on Your Website (Beginner Guide) | Nice Guy Services",
    description:
        "A beginner-friendly guide to integrating SEO on your website: what to do first, what to avoid, and how to build a solid foundation that leads to more calls and inquiries.",
};

export default function HowToStartSEOForBeginnersPage() {
    return (
        <ResourceArticleTemplate
            seriesBadge="Beginner guide 03"
            title="How to start integrating SEO on your own website"
            updatedIso="2026-01-03"
            updatedLabel="January 3, 2026"
            heroImage={{
                src: "/images/Toronto-skyline-dusk.png",
                alt: "City skyline at dusk suggesting growth and visibility",
            }}
            executiveSummary="Start with one topic per page, real headings, human copy, speed, and a few essential tools—then improve with data, not hacks."
            comparisonBars={[
                {
                    label: "Clarity (structure & copy)",
                    valueLabel: "Foundation",
                    fillPercent: 95,
                    variant: "primary",
                },
                {
                    label: "Tooling (keep it lean)",
                    valueLabel: "Light",
                    fillPercent: 40,
                    variant: "secondary",
                },
                {
                    label: "Results timeline",
                    valueLabel: "Compounds",
                    fillPercent: 70,
                    variant: "primary",
                },
            ]}
            expertTip={{
                title: "Expert tip",
                body: "Pick one service you want to be known for and build one strong page for it before you chase ten keywords. Depth beats scatter.",
            }}
            cta={{
                title: "Want SEO baked into the build?",
                body: "Clean structure and fast delivery make the beginner checklist much easier to execute.",
                primary: { href: "/contact", label: "Talk about your site" },
                secondary: { href: "/pricing", label: "See pricing" },
            }}
        >
            <div className="space-y-6 text-lg leading-relaxed text-(--pm-on-surface-variant)">
                <p>
                    A beginner-friendly checklist for making your website easier to find on
                    Google — without tricks, plugins, or keyword stuffing.
                </p>
                <p>
                    SEO can feel confusing at first because there’s a lot of advice online
                    — and much of it is either overly technical or focused on shortcuts. The
                    truth is, you don’t need to do everything at once.
                </p>
                <p>
                    If you start with a few fundamentals (clarity, structure, and speed),
                    you’ll build a foundation that helps search engines understand your site
                    and helps real people trust your business. That’s the same approach I
                    bake into{" "}
                    <Link
                        href="/services"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                        aria-label="View Nice Guy Services website services"
                    >
                        modern, custom websites
                    </Link>
                    .
                </p>
            </div>

            <ResourceSection index="01" title="What SEO is (and what it isn’t)">
                <p>SEO is not:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Stuffing keywords into every sentence</li>
                    <li>Buying backlinks or chasing “hacks”</li>
                    <li>Trying to rank one page for everything</li>
                </ul>
                <p>
                    SEO <strong className="text-(--pm-on-surface)">is</strong> about making
                    your site clear and useful. When your pages explain what you do, who
                    you help, and how to take the next step, search engines can match your
                    site to the right searches.
                </p>
            </ResourceSection>

            <ResourceSection index="02" accent="secondary" title="Step 1: Pick one clear topic per page">
                <p>
                    Each page should have one main purpose. This makes your website easier
                    for people to navigate and easier for Google to understand.
                </p>
                <p>Example:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>
                        <strong className="text-(--pm-on-surface)">Home:</strong> what you
                        do + who it’s for
                    </li>
                    <li>
                        <strong className="text-(--pm-on-surface)">Services:</strong> what
                        you offer + what’s included
                    </li>
                    <li>
                        <strong className="text-(--pm-on-surface)">Pricing:</strong> what it
                        costs + how to choose an option
                    </li>
                    <li>
                        <strong className="text-(--pm-on-surface)">Contact:</strong> how to
                        reach you
                    </li>
                </ul>
                <p>
                    Beginners often try to rank the homepage for every service and every
                    city. It’s better to keep pages focused and expand gradually.
                </p>
            </ResourceSection>

            <ResourceSection index="03" title="Step 2: Use headings properly">
                <p>
                    Headings are one of the easiest SEO wins because they define your
                    content structure.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>
                        Use one <strong className="text-(--pm-on-surface)">H1</strong> per
                        page (the main topic)
                    </li>
                    <li>
                        Use <strong className="text-(--pm-on-surface)">H2</strong> for major
                        sections
                    </li>
                    <li>
                        Use <strong className="text-(--pm-on-surface)">H3</strong> for
                        sub-sections
                    </li>
                </ul>
                <p>
                    Don’t choose heading levels based on how big the text looks — choose
                    them based on structure. You can style headings however you want with
                    CSS.
                </p>
            </ResourceSection>

            <ResourceSection index="04" accent="secondary" title="Step 3: Write like a human (seriously)">
                <p>
                    If your copy sounds unnatural because you’re trying to “fit keywords,”
                    it usually performs worse. Google is good at understanding natural
                    language and related phrases.
                </p>
                <p>
                    A simple rule: write answers to the questions a real customer would ask,
                    in plain language. Clarity beats cleverness.
                </p>
            </ResourceSection>

            <ResourceSection index="05" title="Step 4: Make your site fast and mobile-friendly">
                <p>
                    Speed and mobile usability impact both rankings and conversions. If a
                    page feels slow or messy on a phone, visitors leave — and search engines
                    notice that behavior over time.
                </p>
                <p>Beginner-friendly wins:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>Compress images and avoid uploading huge files</li>
                    <li>Keep layouts simple and avoid heavy scripts</li>
                    <li>Check your site on mobile and fix anything that feels annoying</li>
                </ul>
                <p>
                    If you’re building with modern tools (like Next.js), you already have a
                    big advantage — as long as you keep the site lean and intentional.
                </p>
            </ResourceSection>

            <ResourceSection
                index="06"
                accent="secondary"
                title="Step 5: Set up the essentials (no tool overload)"
            >
                <p>You don’t need 10 tools to start SEO. You need the basics:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>
                        <strong className="text-(--pm-on-surface)">
                            Google Search Console:
                        </strong>{" "}
                        see queries, indexing, and errors
                    </li>
                    <li>
                        <strong className="text-(--pm-on-surface)">
                            Sitemap + robots.txt:
                        </strong>{" "}
                        help search engines crawl your pages
                    </li>
                    <li>
                        <strong className="text-(--pm-on-surface)">
                            Good titles + descriptions:
                        </strong>{" "}
                        improve clicks from search results
                    </li>
                </ul>
                <p>
                    Once these are in place, your site becomes easier to index, and you’ll
                    have real data to learn from.
                </p>
            </ResourceSection>

            <ResourceSection index="07" title="Step 6: Add helpful content gradually">
                <p>
                    You don’t need a blog to “do SEO,” but helpful content can build
                    authority over time. Think of content as answering questions your
                    customers already have.
                </p>
                <p>Good starter topics:</p>
                <ul className="list-disc space-y-2 pl-6">
                    <li>How your service works</li>
                    <li>What affects pricing</li>
                    <li>Common mistakes to avoid</li>
                    <li>What to expect when hiring a professional</li>
                </ul>
                <p>
                    One clear, useful article beats ten shallow posts. Consistency matters
                    more than volume.
                </p>
            </ResourceSection>

            <ResourceSection index="08" accent="secondary" title="Common beginner mistakes to avoid">
                <ul className="list-disc space-y-2 pl-6">
                    <li>Targeting ultra-competitive keywords too early</li>
                    <li>Copying competitor content and swapping a few words</li>
                    <li>Ignoring mobile readability and page speed</li>
                    <li>Over-optimizing instead of being clear</li>
                    <li>Expecting results in days (SEO compounds)</li>
                </ul>
            </ResourceSection>

            <ResourceSection index="09" title="SEO is a foundation, not a one-time task">
                <p>
                    SEO works best when it’s built into your website from the start: clean
                    structure, clear pages, fast performance, and content that helps real
                    people.
                </p>
                <p>
                    If you focus on those fundamentals, you’ll have an SEO setup that
                    improves over time — and brings in the kind of visitors who are ready
                    to contact you.
                </p>
                <p className="text-(--pm-on-surface-variant)">
                    These foundations are built into every website I create for small
                    businesses.{" "}
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
