"use client";

import {
    DEFAULT_NEXT_STEPS_MOBILE,
    DcBlockquoteDesktop,
    DcChecklist,
    DcCodeList,
    DcDesktopCoverImage,
    DcDesktopSection,
    DcExampleBox,
    DcFeatureRows,
    DcFinalMobile,
    DcH2,
    DcH2Desktop,
    DcIconList,
    DcInlineLink,
    DcMistakes,
    DcMobileHero,
    DcNextStepsDesktop,
    DcNextStepsMobile,
    DcProse,
    DcSection,
    DcTakeaways,
    DcWarningBox,
} from "../article-ui";
import { PRACTICAL_STARTING_POINTS, SEARCH_CONSOLE_TAKEAWAYS } from "../searchConsoleConfig";
import type { DcArticleContentProps } from "../types";

const GSC_ANSWERS = [
    "which keywords people search before finding your site",
    "which pages receive the most traffic",
    "whether Google can properly read your website",
    "whether pages have technical issues",
    "how your site performs on mobile devices",
];

const DATA_SECTIONS = [
    {
        icon: "search",
        title: "Search Queries",
        body: "Shows the searches people used before clicking your website — helping you understand how customers describe your services.",
        examples: ["Toronto electrician", "website designer for small business", "coffee shop branding ideas"],
    },
    {
        icon: "ads_click",
        title: "Clicks and Impressions",
        body: "Tracks impressions (your site appeared in results), clicks (someone visited), and click-through rates.",
    },
    {
        icon: "web",
        title: "Page Performance",
        body: "Reveals which service pages get the most traffic and which guides people read.",
    },
    {
        icon: "smartphone",
        title: "Mobile Usability",
        body: "Identifies issues like text too small or buttons too close together.",
    },
    {
        icon: "bug_report",
        title: "Indexing Problems",
        body: "Helps find pages Google cannot read, broken links, crawl errors, and missing pages.",
    },
];

const MISTAKES = [
    {
        title: "Looking Only at Rankings",
        body: 'Many people focus entirely on "Am I #1 on Google?" But impressions, clicks, and traffic quality can improve even when rankings fluctuate.',
    },
    {
        title: "Ignoring Search Intent",
        body: "Informational, local service, and comparison searches behave differently. Understanding intent helps you create more useful pages.",
    },
    {
        title: "Making Decisions Without Data",
        body: "Without analytics tools, businesses often redesign pages based on assumptions. Search Console provides real user behavior.",
    },
];

const LANDSCAPING_SEARCHES = [
    "backyard patio landscaping Toronto",
    "interlocking contractors near me",
    "modern backyard design ideas",
];

export function SearchConsoleMobile({ meta }: DcArticleContentProps) {
    return (
        <>
            <DcMobileHero
                badge={meta.badge}
                readTime={meta.readTime}
                title={meta.title}
                subtitle={meta.subtitle}
                dateModified={meta.dateModified}
            />
            <DcSection>
                <DcProse>
                    <p className="mb-4 text-lg font-medium">Launching a website is only the beginning.</p>
                    <p className="mb-4">
                        Google Search Console is a free tool that helps website owners understand how
                        their website performs inside Google Search.
                    </p>
                </DcProse>
            </DcSection>
            <DcSection>
                <DcH2>What Is Google Search Console?</DcH2>
                <DcIconList items={GSC_ANSWERS} />
            </DcSection>
            <DcSection tint="subtle">
                <DcH2>Why It Matters for Small Businesses</DcH2>
                <DcExampleBox label="Example discovery">
                    <p className="mb-3 text-sm text-[#414845]">
                        A landscaping company might discover people find them through searches like:
                    </p>
                    <DcCodeList items={LANDSCAPING_SEARCHES} />
                </DcExampleBox>
            </DcSection>
            <DcSection>
                <DcH2>What Information Does Search Console Show?</DcH2>
                <DcFeatureRows
                    items={DATA_SECTIONS.map(({ icon, title, body }) => ({
                        icon,
                        title,
                        body,
                    }))}
                />
            </DcSection>
            <DcSection tint="subtle">
                <DcH2>How Small Businesses Can Use Search Console Strategically</DcH2>
                <DcExampleBox title="Example: Improving Service Pages" label="Example">
                    <p className="dc-code text-sm">&quot;panel upgrade Toronto&quot;</p>
                </DcExampleBox>
            </DcSection>
            <DcSection>
                <DcH2>Search Console and SEO</DcH2>
                <p className="mb-4">
                    Search Console does not automatically improve SEO. It helps you understand where to
                    improve.
                </p>
                <DcInlineLink href="/resources/what-google-ai-search-means-for-small-businesses">
                    Read: What Google AI Search means for small businesses
                </DcInlineLink>
            </DcSection>
            <DcSection tint="error">
                <DcH2>Common Mistakes Businesses Make</DcH2>
                <DcMistakes items={MISTAKES} />
            </DcSection>
            <DcSection>
                <DcH2>Practical Ways to Start Using Search Console</DcH2>
                <DcChecklist items={PRACTICAL_STARTING_POINTS} />
            </DcSection>
            <DcSection tint="takeaways">
                <DcH2>Key Takeaways</DcH2>
                <DcTakeaways items={SEARCH_CONSOLE_TAKEAWAYS} />
            </DcSection>
            <DcFinalMobile
                paragraphs={[
                    "Google Search Console gives small businesses access to information that was once difficult to measure.",
                    "Even small improvements based on real search data can lead to stronger visibility and more qualified leads over time.",
                ]}
                ctaLabel={meta.ctaLabel}
            />
            <DcNextStepsMobile steps={DEFAULT_NEXT_STEPS_MOBILE} />
        </>
    );
}

export function SearchConsoleDesktop({ meta }: DcArticleContentProps) {
    return (
        <>
            <DcDesktopSection id="intro">
                <p className="mb-6 text-lg leading-relaxed text-[#1b1c1c]">
                    Launching a website is only the beginning. Google Search Console shows how your site
                    performs in Google Search — queries, traffic, indexing, and mobile usability.
                </p>
                <DcDesktopCoverImage
                    src={meta.heroImageSrc}
                    alt="Analytics and search performance visualization"
                    priority
                />
            </DcDesktopSection>
            <DcDesktopSection id="what-is-gsc">
                <DcH2Desktop>What Is Google Search Console?</DcH2Desktop>
                <p className="text-base text-[#1b1c1c]">
                    A free platform to monitor visibility in Google results — a bridge between your
                    website and Google.
                </p>
            </DcDesktopSection>
            <DcDesktopSection id="why-it-matters">
                <DcH2Desktop>Why It Matters</DcH2Desktop>
                <DcBlockquoteDesktop>
                    &quot;Search data often reveals what customers actually care about.&quot;
                </DcBlockquoteDesktop>
            </DcDesktopSection>
            <DcDesktopSection id="what-data-shows">
                <DcH2Desktop>What Data Shows</DcH2Desktop>
                <DcIconList items={GSC_ANSWERS} />
            </DcDesktopSection>
            <DcDesktopSection id="strategic-use">
                <DcH2Desktop>Using It Strategically</DcH2Desktop>
                <p className="text-base text-[#1b1c1c]">
                    Insights like &quot;panel upgrade Toronto&quot; can drive new service pages, FAQs,
                    and updated headings over time.
                </p>
            </DcDesktopSection>
            <DcDesktopSection id="seo-ai">
                <DcH2Desktop>SEO &amp; AI Search</DcH2Desktop>
                <DcInlineLink href="/resources/what-google-ai-search-means-for-small-businesses">
                    Google AI search guide
                </DcInlineLink>
            </DcDesktopSection>
            <DcDesktopSection id="mistakes">
                <DcWarningBox title="Common Mistakes">
                    <ul className="list-disc space-y-2 pl-5 text-sm">
                        <li>Focusing only on ranking #1.</li>
                        <li>Ignoring search intent.</li>
                        <li>Deciding without data.</li>
                    </ul>
                </DcWarningBox>
            </DcDesktopSection>
            <DcDesktopSection id="final-thoughts">
                <DcH2Desktop>Key Takeaways &amp; Final Thoughts</DcH2Desktop>
                <DcTakeaways items={SEARCH_CONSOLE_TAKEAWAYS} />
            </DcDesktopSection>
        </>
    );
}

export function SearchConsoleDesktopFooter() {
    return (
        <DcNextStepsDesktop
            steps={[
                {
                    href: "/pricing",
                    title: "View Pricing",
                    body: "Websites built with SEO and reporting in mind.",
                },
                {
                    href: "/contact",
                    title: "Get SEO Help",
                    body: "Search Console setup, reviews, and improvements.",
                },
            ]}
        />
    );
}
