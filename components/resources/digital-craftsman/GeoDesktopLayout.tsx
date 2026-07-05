"use client";

import {
    DcDesktopCoverImage,
    DcH2Desktop,
    DcNextStepsDesktop,
    DcProse,
} from "./article-ui";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import MaterialIcon from "./MaterialIcon";
import {
    GeoAiSignalsSection,
    GeoComparisonTable,
    GeoDisclaimerQuote,
    GeoFriendlyGrid,
    GeoHeroIconRow,
    GeoMythAccordion,
    GeoPrepareChecklist,
    GeoTakeawaysGrid,
    GeoTimeline,
} from "./GeoArticleSections";
import { GEO_AI_TOOLS, GEO_LANDSCAPING_ARTICLES } from "./geoConfig";
import type { DcArticleContentProps } from "./types";

const HERO_IMAGE = "/images/Futuristic-tech-abstract.png";

export default function GeoDesktopLayout({ meta }: DcArticleContentProps) {
    void meta;
    return (
        <>
            <section className="mb-16" id="intro">
                <GeoHeroIconRow />
                <p className="mb-6 max-w-[65ch] text-lg leading-relaxed text-[#1b1c1c]">
                    For decades, most people searched the web by typing short phrases into
                    Google. Today, more customers ask complete questions using AI tools — and
                    websites need to communicate clearly enough for both people and machines
                    to understand their expertise.
                </p>
                <DcDesktopCoverImage
                    src={HERO_IMAGE}
                    alt="Abstract visualization suggesting AI-assisted search and discovery"
                    priority
                />
                <DcProse className="max-w-[65ch] space-y-4">
                    <p>
                        Tools like {GEO_AI_TOOLS.join(", ")} are changing how people research
                        services, compare options, and decide who to contact. Instead of
                        clicking through many links, users may read a synthesized answer first.
                    </p>
                    <p>
                        That shift is why{" "}
                        <strong>Generative Engine Optimization (GEO)</strong> matters — not as
                        hype, but as a practical response to how discovery is evolving.
                    </p>
                </DcProse>
            </section>

            <section className="mb-16" id="evolution">
                <DcH2Desktop>The Evolution of Search</DcH2Desktop>
                <p className="mb-8 max-w-[65ch] text-base text-[#414845]">
                    Search has evolved from directories to keywords to mobile local search —
                    and now toward AI that interprets natural language:
                </p>
                <GeoTimeline />
                <p className="mt-8 max-w-[65ch] text-base text-[#414845]">
                    Each step rewarded businesses that matched how people actually searched.
                    The latest shift favours clear, trustworthy answers over keyword repetition.
                </p>
            </section>

            <section className="mb-16" id="what-is-geo">
                <DcH2Desktop>What Is GEO?</DcH2Desktop>
                <p className="mb-4 max-w-[65ch] text-base text-[#1b1c1c]">
                    <strong>GEO</strong> stands for{" "}
                    <strong>Generative Engine Optimization</strong> — creating websites that
                    AI systems can understand, trust, and reference when generating answers,
                    when your content fits the question.
                </p>
                <div className="max-w-[65ch]">
                    <GeoDisclaimerQuote />
                </div>
                <p className="max-w-[65ch] text-base text-[#414845]">
                    GEO rewards the same qualities customers appreciate: specific service
                    pages, honest answers, and content written by people who know the work.
                </p>
            </section>

            <section className="mb-16" id="how-ai-finds">
                <DcH2Desktop>How AI Finds Information</DcH2Desktop>
                <p className="mb-6 max-w-[65ch] text-base text-[#414845]">
                    No one outside AI providers knows every detail of how sources are selected.
                    In general, systems favour signals like these:
                </p>
                <GeoAiSignalsSection />
                <p className="mt-8 max-w-[65ch] text-base text-[#414845]">
                    These signals mirror good business communication: specific service pages,
                    honest answers, consistent contact details, and a site that loads quickly on
                    phones. GEO does not replace that foundation — it builds on it.
                </p>
            </section>

            <section className="mb-16" id="geo-vs-seo">
                <DcH2Desktop>GEO vs SEO vs AEO</DcH2Desktop>
                <p className="mb-6 max-w-[65ch] text-base text-[#414845]">
                    These approaches complement one another rather than replace each other:
                </p>
                <GeoComparisonTable />
                <p className="mt-6 max-w-[65ch] text-base text-[#414845]">
                    SEO helps people find you in search results. AEO helps your pages answer
                    questions directly. GEO helps AI systems interpret your expertise. Together,
                    they form a modern visibility strategy.
                </p>
            </section>

            <section className="mb-16" id="geo-friendly">
                <DcH2Desktop>What Makes a Website GEO Friendly?</DcH2Desktop>
                <p className="mb-8 max-w-[65ch] text-base text-[#414845]">
                    Practical improvements that help customers also help AI systems interpret
                    your site:
                </p>
                <GeoFriendlyGrid />
            </section>

            <section className="mb-16" id="example">
                <DcH2Desktop>Example: A Landscaping Company</DcH2Desktop>
                <p className="mb-4 max-w-[65ch] text-base text-[#414845]">
                    A single <strong>Interlocking Services</strong> page is a start. A
                    GEO-friendly site adds educational articles such as:
                </p>
                <ul className="mb-6 max-w-[65ch] space-y-2">
                    {GEO_LANDSCAPING_ARTICLES.map((title) => (
                        <li key={title} className="flex items-start gap-2 text-[#414845]">
                            <MaterialIcon
                                name="check_circle"
                                className="mt-0.5 shrink-0 text-[#416359]"
                            />
                            <span>{title}</span>
                        </li>
                    ))}
                </ul>
                <p className="max-w-[65ch] text-base text-[#414845]">
                    This cluster demonstrates expertise without promising specific AI outcomes.
                </p>
            </section>

            <section className="mb-16" id="myths">
                <DcH2Desktop>Common GEO Myths</DcH2Desktop>
                <GeoMythAccordion className="max-w-[65ch]" />
            </section>

            <section className="mb-16" id="prepare">
                <DcH2Desktop>How Businesses Can Prepare</DcH2Desktop>
                <p className="mb-6 max-w-[65ch] text-base text-[#414845]">
                    Steady steps matter more than a one-time overhaul:
                </p>
                <GeoPrepareChecklist />
            </section>

            <section className="mb-16" id="why-matters">
                <DcH2Desktop>Why GEO Matters</DcH2Desktop>
                <DcProse className="max-w-[65ch] space-y-4">
                    <p>
                        Search habits are shifting toward conversational questions — in
                        browsers, on phones, and inside AI tools. Informative websites built
                        on trust are better positioned for both traditional search and
                        AI-powered experiences.
                    </p>
                    <p>
                        GEO is not a guarantee of visibility. It is a commitment to clarity
                        that benefits real customers first — and helps AI systems understand
                        your business when your content is relevant.
                    </p>
                </DcProse>
            </section>

            <section className="mb-16" id="conclusion">
                <DcH2Desktop>Conclusion</DcH2Desktop>
                <DcProse className="max-w-[65ch] space-y-4">
                    <p>
                        SEO helps people find you. AEO helps answer questions. GEO helps AI
                        systems better understand your expertise. The strongest strategy
                        combines all three.
                    </p>
                </DcProse>
                <div className="mt-10 max-w-[65ch] rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] p-8 text-center">
                    <h3 className="dc-display mb-4 text-2xl font-medium text-[#1b1c1c]">
                        Want a website built for the future of search?
                    </h3>
                    <DigitalCraftsmanAuditButton>
                        Book a Free Consultation
                    </DigitalCraftsmanAuditButton>
                </div>
            </section>
        </>
    );
}

export function GeoDesktopFooter() {
    return (
        <>
            <div className="mt-16 border-t border-[#c1c8c4] pt-16">
                <h3 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Key Takeaways
                </h3>
                <GeoTakeawaysGrid />
            </div>
            <DcNextStepsDesktop
                steps={[
                    {
                        href: "/resources/what-google-ai-search-means-for-small-businesses",
                        title: "What Google AI Search Means",
                        body: "How AI Overviews change search for small businesses.",
                    },
                    {
                        href: "/contact",
                        title: "Book a Free Consultation",
                        body: "Discuss a website built for search, answers, and AI clarity.",
                    },
                ]}
            />
        </>
    );
}
