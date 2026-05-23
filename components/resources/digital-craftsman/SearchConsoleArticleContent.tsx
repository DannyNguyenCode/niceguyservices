"use client";

import Link from "next/link";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import {
    PRACTICAL_STARTING_POINTS,
    SEARCH_CONSOLE_TAKEAWAYS,
} from "./searchConsoleConfig";
import MaterialIcon from "./MaterialIcon";
import { useDcArticleProgress } from "./useDcArticleProgress";
import { useDcAuditButtonHover } from "./useDcAuditButtonHover";

const HERO_IMAGE = "/images/Futuristic-tech-abstract.png";

const section = "border-b border-[#c1c8c4] p-8 md:p-12";

const LAUNCH_QUESTIONS = [
    "Are people finding my website?",
    "What are visitors searching for?",
    "Which pages are getting traffic?",
    "Are people clicking my contact forms?",
    "Is Google even indexing my pages correctly?",
];

const GSC_ANSWERS = [
    "which keywords people search before finding your site",
    "which pages receive the most traffic",
    "whether Google can properly read your website",
    "whether pages have technical issues",
    "how your site performs on mobile devices",
];

const LANDSCAPING_SEARCHES = [
    "backyard patio landscaping Toronto",
    "interlocking contractors near me",
    "modern backyard design ideas",
];

const QUERY_EXAMPLES = [
    "Toronto electrician",
    "website designer for small business",
    "coffee shop branding ideas",
];

const DATA_SECTIONS = [
    {
        icon: "search",
        title: "Search Queries",
        body: "Shows the searches people used before clicking your website — helping you understand how customers describe your services.",
    },
    {
        icon: "ads_click",
        title: "Clicks and Impressions",
        body: "Tracks impressions (your site appeared in results), clicks (someone visited), and click-through rates — so you know which pages attract attention and whether visibility is growing.",
    },
    {
        icon: "web",
        title: "Page Performance",
        body: "Reveals which service pages get the most traffic, which guides people read, and which pages appear in search most often.",
    },
    {
        icon: "smartphone",
        title: "Mobile Usability",
        body: "Identifies issues like text too small, buttons too close, or layout problems — improving mobile often helps SEO and conversions.",
    },
    {
        icon: "bug_report",
        title: "Indexing Problems",
        body: "Helps find pages Google cannot read, broken links, crawl errors, duplicates, or missing pages — especially after a launch or redesign.",
    },
];

const MISTAKES = [
    {
        title: "Looking Only at Rankings",
        body: 'Many people focus entirely on "Am I #1 on Google?" But visibility is broader — impressions, clicks, and traffic quality can improve even when rankings fluctuate.',
    },
    {
        title: "Ignoring Search Intent",
        body: "Informational, local service, and comparison searches behave differently. Understanding intent helps you create more useful pages.",
    },
    {
        title: "Making Decisions Without Data",
        body: "Without analytics tools, businesses often redesign pages based on assumptions. Search Console provides real user behavior to guide smarter improvements.",
    },
];

export default function SearchConsoleArticleContent() {
    const { articleRef, progressRef } = useDcArticleProgress();
    useDcAuditButtonHover();

    return (
        <main className="relative mx-auto max-w-[1120px] px-4 py-8 md:hidden">
            <article
                ref={articleRef}
                className="relative mx-auto max-w-3xl overflow-hidden rounded-lg border border-[#c1c8c4] bg-white shadow-sm"
            >
                <div className="absolute top-0 left-0 z-10 h-0.5 w-full bg-transparent" aria-hidden>
                    <div
                        ref={progressRef}
                        className="h-full bg-[#416359] transition-[width] duration-100 ease-linear"
                        style={{ width: "0%" }}
                    />
                </div>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_30%,transparent)]`}>
                    <div className="mb-6 flex flex-wrap gap-2">
                        <span className="rounded bg-[rgb(107_142_131/0.1)] px-3 py-1 text-sm font-medium tracking-wide text-[#416359]">
                            Resource / SEO Tools
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 text-sm text-[#414845]">
                            <MaterialIcon name="schedule" className="!text-base" />
                            11 min read
                        </span>
                    </div>
                    <h1 className="dc-display mb-4 text-[28px] leading-[1.2] font-semibold tracking-tight text-[#1b1c1c] md:text-[48px] md:leading-[1.1]">
                        How Google Search Console Helps Small Businesses
                    </h1>
                    <p className="text-lg italic text-[#414845]">
                        Understanding What Happens After Your Website Goes Live
                    </p>
                </section>

                <section className={`${section} text-base leading-relaxed text-[#1b1c1c]`}>
                    <p className="mb-4 text-lg font-medium">Launching a website is only the beginning.</p>
                    <p className="mb-4">
                        Once a website is online, many business owners start asking questions like:
                    </p>
                    <ul className="mb-6 space-y-2">
                        {LAUNCH_QUESTIONS.map((q) => (
                            <li key={q} className="flex items-start gap-2 text-[#414845]">
                                <MaterialIcon name="help" className="mt-0.5 shrink-0 text-[#416359]" />
                                <span>{q}</span>
                            </li>
                        ))}
                    </ul>
                    <p>
                        <span className="dc-display float-left mr-3 text-5xl leading-none text-[#416359]">
                            G
                        </span>
                        Google Search Console is a free tool that helps website owners understand how
                        their website performs inside Google Search — valuable insights without
                        expensive software or advanced technical knowledge.
                    </p>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Is Google Search Console?
                    </h2>
                    <p className="mb-4">
                        Google Search Console is a free platform created by Google that allows website
                        owners to monitor and improve their website&apos;s visibility in search results.
                    </p>
                    <ul className="mb-4 space-y-2">
                        {GSC_ANSWERS.map((text) => (
                            <li key={text} className="flex items-start gap-2">
                                <MaterialIcon name="check_circle" className="mt-0.5 text-[#416359]" />
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-[#414845]">
                        Think of it as a communication bridge between your website and Google.
                    </p>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Why It Matters for Small Businesses
                    </h2>
                    <p className="mb-4 text-[#414845]">
                        Many small businesses launch a website and never look at performance data
                        afterward. Search Console helps you make informed decisions instead of relying
                        entirely on guesses.
                    </p>
                    <div className="rounded-lg border border-[#c1c8c4] bg-[#f0eded] p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <MaterialIcon name="lightbulb" className="text-[#406372]" />
                            <span className="text-sm font-medium tracking-wider text-[#406372] uppercase">
                                Example discovery
                            </span>
                        </div>
                        <p className="mb-3 text-sm text-[#414845]">
                            A landscaping company might discover people find them through searches like:
                        </p>
                        <ul className="mb-3 space-y-1">
                            {LANDSCAPING_SEARCHES.map((q) => (
                                <li key={q} className="dc-code text-sm">
                                    &quot;{q}&quot;
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm text-[#414845]">
                            That can shape future content, service pages, marketing, and SEO improvements.
                        </p>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        What Information Does Search Console Show?
                    </h2>
                    <div className="space-y-6">
                        {DATA_SECTIONS.map(({ icon, title, body }) => (
                            <div key={title} className="flex items-start gap-4">
                                <MaterialIcon
                                    name={icon}
                                    className="rounded bg-[rgb(89_123_113/0.2)] p-2 text-[#416359]"
                                />
                                <div>
                                    <p className="dc-display mb-1 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                                        {title}
                                    </p>
                                    <p className="text-[#414845]">{body}</p>
                                    {title === "Search Queries" ? (
                                        <ul className="mt-3 space-y-1">
                                            {QUERY_EXAMPLES.map((q) => (
                                                <li key={q} className="dc-code text-sm text-[#414845]">
                                                    &quot;{q}&quot;
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_10%,transparent)]`}>
                    <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        How Small Businesses Can Use Search Console Strategically
                    </h2>
                    <div className="mb-6 rounded-lg border border-[#c1c8c4] bg-white p-6">
                        <h3 className="dc-display mb-2 text-xl font-medium text-[#416359]">
                            Example: Improving Service Pages
                        </h3>
                        <p className="mb-3 dc-code text-sm text-[#414845]">
                            &quot;panel upgrade Toronto&quot;
                        </p>
                        <p className="text-sm text-[#414845]">
                            An electrician might notice this search but barely mention panel upgrades —
                            leading to a dedicated service page, FAQs, updated headings, and project
                            examples over time.
                        </p>
                    </div>
                    <div className="rounded-lg border border-[#c1c8c4] bg-white p-6">
                        <h3 className="dc-display mb-2 text-xl font-medium text-[#416359]">
                            Example: Understanding User Interest
                        </h3>
                        <p className="text-sm text-[#414845]">
                            A coffee shop may discover one guide receives far more impressions than
                            expected — revealing customer interests, trending topics, and ideas for
                            social media or future resources.
                        </p>
                    </div>
                </section>

                <section className={section}>
                    <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Search Console and SEO
                    </h2>
                    <p className="mb-4">
                        Search Console does not automatically improve SEO. It helps you understand
                        where improvements can be made — what users search for, which pages perform
                        well, where traffic comes from, and which topics Google associates with your
                        site.
                    </p>
                    <h3 className="dc-display mb-4 text-2xl leading-[1.3] font-medium text-[#1b1c1c]">
                        Search Console and AI Search
                    </h3>
                    <p className="mb-4">
                        As search becomes more AI-driven, understanding structure and performance
                        matters more. Search Console can show which topics Google associates with your
                        site, which pages perform best, and where visibility opportunities exist.
                    </p>
                    <Link
                        href="/resources/what-google-ai-search-means-for-small-businesses"
                        className="font-medium text-[#416359] underline-offset-2 hover:underline"
                    >
                        Read: What Google AI Search means for small businesses
                    </Link>
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
                        Practical Ways to Start Using Search Console
                    </h2>
                    <div className="space-y-2">
                        {PRACTICAL_STARTING_POINTS.map((label) => (
                            <label
                                key={label}
                                className="group flex cursor-pointer items-center gap-4 rounded border border-[#c1c8c4] p-4 transition-colors hover:bg-[#f6f3f2]"
                            >
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-[#c1c8c4] text-[#416359] focus:ring-[#416359]"
                                />
                                <span className="capitalize transition-colors group-hover:text-[#416359]">
                                    {label}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_20%,transparent)]`}>
                    <h2 className="dc-display mb-8 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                        Key Takeaways
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {SEARCH_CONSOLE_TAKEAWAYS.map((text, i) => (
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
                        Google Search Console gives small businesses access to information that was once
                        difficult to measure. Instead of guessing how people discover you online, you
                        can understand what users search for, which pages attract attention, and how
                        Google interprets your website.
                    </p>
                    <p className="mx-auto mb-8 max-w-lg text-[#414845]">
                        Even small improvements based on real search data can lead to stronger
                        visibility, better user experience, and more qualified leads over time.
                    </p>
                    <DigitalCraftsmanAuditButton>Get SEO Help</DigitalCraftsmanAuditButton>
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
                                body: "Website and SEO support for small businesses.",
                            },
                            {
                                href: "/services",
                                icon: "gallery_thumbnail",
                                title: "View Projects",
                                body: "See how we build sites ready for Search Console.",
                            },
                            {
                                href: "/contact",
                                icon: "mail",
                                title: "Contact",
                                body: "Ask about setup, reporting, or SEO improvements.",
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
            </article>
        </main>
    );
}
