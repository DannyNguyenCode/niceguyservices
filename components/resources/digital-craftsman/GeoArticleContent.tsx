"use client";

import {
    DcDropCap,
    DcMobileHero,
    DcNextStepsMobile,
    DcSection,
    DEFAULT_NEXT_STEPS_MOBILE,
} from "./article-ui";
import { DigitalCraftsmanAuditButton } from "./DigitalCraftsmanChrome";
import {
    GeoAiSignalsSection,
    GeoComparisonTable,
    GeoDisclaimerQuote,
    GeoFriendlyGrid,
    GeoHeroIconRow,
    GeoLandscapingExample,
    GeoMythAccordion,
    GeoPrepareChecklist,
    GeoTakeawaysGrid,
    GeoTimeline,
} from "./GeoArticleSections";
import { GEO_AI_TOOLS } from "./geoConfig";
import type { DcArticleContentProps } from "./types";

const section = "border-b border-[#c1c8c4] p-8 md:p-12";

export default function GeoArticleContent({ meta }: DcArticleContentProps) {
    return (
        <>
            <DcMobileHero
                badge={meta.badge}
                readTime={meta.readTime}
                title={meta.title}
                subtitle={meta.subtitle}
                dateModified={meta.dateModified}
            />

            <DcSection id="intro">
                <GeoHeroIconRow />
                <DcDropCap letter="F">
                    or decades, most people searched the web by typing short phrases into
                    Google — things like &ldquo;Toronto plumber&rdquo; or &ldquo;landscaping
                    near me.&rdquo; The search engine returned a list of links, and people
                    clicked through to find answers themselves.
                </DcDropCap>
                <p className="mt-4 text-base leading-relaxed text-[#414845]">
                    That habit is changing. More people now ask complete questions using AI
                    tools such as{" "}
                    {GEO_AI_TOOLS.slice(0, -1).join(", ")}, and {GEO_AI_TOOLS.at(-1)}.
                    Instead of scanning ten blue links, they may receive a summarized answer
                    drawn from many sources — including business websites like yours.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#414845]">
                    Because search behaviour is shifting, websites need to evolve too. That
                    is where{" "}
                    <strong className="text-[#1b1c1c]">
                        Generative Engine Optimization (GEO)
                    </strong>{" "}
                    enters the conversation — not as a magic shortcut, but as a practical way
                    to make your expertise easier to understand online.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#414845]">
                    If you have heard terms like &ldquo;AI search optimization&rdquo; or
                    &ldquo;ChatGPT SEO&rdquo; and felt unsure what they mean, you are not
                    alone. This guide explains GEO in everyday language — what it is, what it
                    is not, and how it fits alongside the SEO work many businesses already do.
                </p>
            </DcSection>

            <section className={section} id="evolution">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    The Evolution of Search
                </h2>
                <p className="mb-8 text-base leading-relaxed text-[#414845]">
                    Search has moved from matching keywords to understanding natural
                    language. Each era rewarded businesses that adapted to how people
                    actually looked for information:
                </p>
                <GeoTimeline />
                <p className="mt-8 text-base leading-relaxed text-[#414845]">
                    Today, a customer might ask, &ldquo;What should I budget for interlocking
                    a small backyard patio in Toronto?&rdquo; AI tools look for clear,
                    trustworthy sources that answer that kind of question — not just pages
                    that repeat a keyword.
                </p>
            </section>

            <section className={section} id="what-is-geo">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    What Is GEO?
                </h2>
                <p className="mb-4 text-base leading-relaxed text-[#1b1c1c]">
                    <strong>GEO</strong> stands for{" "}
                    <strong>Generative Engine Optimization</strong>. It describes the
                    practice of building and maintaining websites that AI systems can easily
                    understand, trust, and use when generating answers — when your content is
                    relevant to the question being asked.
                </p>
                <GeoDisclaimerQuote />
                <p className="text-base leading-relaxed text-[#414845]">
                    Think of GEO as clarity at scale: plain language, organized pages, honest
                    information, and content that reflects what you actually do for customers.
                    The goal is not to trick an algorithm. It is to communicate well enough
                    that both people and machines can follow your expertise.
                </p>
            </section>

            <section
                className={`${section} bg-[color-mix(in_srgb,#f6f3f2_15%,transparent)]`}
                id="how-ai-finds"
            >
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    How AI Finds Information
                </h2>
                <p className="mb-6 text-base leading-relaxed text-[#414845]">
                    AI tools do not publish their exact methods, and no one outside those
                    companies knows every detail of how sources are chosen. In general terms,
                    though, systems tend to favour content that looks helpful, specific, and
                    trustworthy. Common signals include:
                </p>
                <GeoAiSignalsSection />
                <p className="mt-8 text-base leading-relaxed text-[#414845]">
                    None of these signals require secret tricks. They reflect what good business
                    communication has always involved: be specific, be honest, keep information
                    up to date, and make your site pleasant to use. GEO simply recognizes that
                    AI tools now join search engines in reading that same material.
                </p>
            </section>

            <section className={section} id="geo-vs-seo">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    GEO vs SEO vs AEO
                </h2>
                <p className="mb-6 text-base leading-relaxed text-[#414845]">
                    These terms overlap, but they emphasize different goals. None of them
                    replaces the others — they work best together.
                </p>
                <GeoComparisonTable />
                <p className="mt-6 text-base leading-relaxed text-[#414845]">
                    SEO helps people discover your site in traditional search results. AEO
                    (Answer Engine Optimization) focuses on answering questions directly on
                    your pages. GEO adds a layer focused on how AI systems interpret and
                    reference quality content. A strong website strategy considers all three.
                </p>
            </section>

            <section className={section} id="geo-friendly">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    What Makes a Website GEO Friendly?
                </h2>
                <p className="mb-8 text-base leading-relaxed text-[#414845]">
                    You do not need exotic technology to move in the right direction. Most
                    improvements are the same fundamentals that help customers — organized
                    clearly for machines as well:
                </p>
                <GeoFriendlyGrid />
            </section>

            <section
                className={`${section} bg-[color-mix(in_srgb,#e4e2e1_15%,transparent)]`}
                id="example"
            >
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Example: A Landscaping Company
                </h2>
                <p className="mb-4 text-base leading-relaxed text-[#414845]">
                    Imagine a landscaping company with one page titled{" "}
                    <strong className="text-[#1b1c1c]">Interlocking Services</strong>. That
                    page might list materials and a phone number — useful, but thin.
                </p>
                <GeoLandscapingExample />
            </section>

            <section className={section} id="myths">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Common GEO Myths
                </h2>
                <p className="mb-6 text-base leading-relaxed text-[#414845]">
                    GEO is a newer term, and that invites confusion. Here are misconceptions
                    worth clearing up:
                </p>
                <GeoMythAccordion />
            </section>

            <section className={section} id="prepare">
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    How Businesses Can Prepare
                </h2>
                <p className="mb-6 text-base leading-relaxed text-[#414845]">
                    You do not need to rebuild your entire site overnight. Steady, practical
                    steps add up:
                </p>
                <GeoPrepareChecklist />
                <p className="mt-8 text-base leading-relaxed text-[#414845]">
                    Start with what you already know from customer conversations. The questions
                    people ask on the phone — pricing, timelines, service areas, what is
                    included — are often the same questions worth answering on your website.
                    Over time, that library of helpful pages becomes a clearer picture of your
                    business for both visitors and AI systems.
                </p>
            </section>

            <section
                className={`${section} bg-[color-mix(in_srgb,#f6f3f2_20%,transparent)]`}
                id="why-matters"
            >
                <h2 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Why GEO Matters
                </h2>
                <p className="mb-4 text-base leading-relaxed text-[#414845]">
                    Customer search habits are changing. Many people now ask conversational
                    questions — on phones, at desks, and inside AI chat tools — instead of
                    typing two-word keywords.
                </p>
                <p className="mb-4 text-base leading-relaxed text-[#414845]">
                    Businesses that invest in informative, trustworthy websites are better
                    positioned for traditional search <em>and</em> for AI-powered experiences.
                    That does not mean every AI answer will mention you. It means your
                    expertise is easier to find and understand when it matters.
                </p>
                <p className="text-base leading-relaxed text-[#414845]">
                    GEO is really about communication: saying what you do, proving you know
                    your field, and making it simple for someone — human or machine — to
                    follow along.
                </p>
            </section>

            <section className={`${section} bg-[color-mix(in_srgb,#f6f3f2_20%,transparent)]`}>
                <h2 className="dc-display mb-8 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Key Takeaways
                </h2>
                <GeoTakeawaysGrid />
            </section>

            <section className={`${section} text-center`} id="conclusion">
                <h2 className="dc-display mb-4 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                    Conclusion
                </h2>
                <p className="mx-auto mb-4 max-w-lg text-base leading-relaxed text-[#414845]">
                    <strong className="text-[#1b1c1c]">SEO</strong> helps people find you.{" "}
                    <strong className="text-[#1b1c1c]">AEO</strong> helps answer questions.{" "}
                    <strong className="text-[#1b1c1c]">GEO</strong> helps AI systems better
                    understand your expertise when they generate responses.
                </p>
                <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-[#414845]">
                    The strongest digital strategy combines all three — built on honest
                    content, a fast and accessible website, and information you would be proud
                    to show a customer in person.
                </p>
                <h3 className="dc-display mb-4 text-2xl font-medium text-[#1b1c1c]">
                    Want a website built for the future of search?
                </h3>
                <DigitalCraftsmanAuditButton>
                    Book a Free Consultation
                </DigitalCraftsmanAuditButton>
            </section>

            <DcNextStepsMobile
                steps={[
                    DEFAULT_NEXT_STEPS_MOBILE[0],
                    {
                        ...DEFAULT_NEXT_STEPS_MOBILE[1],
                        body: "See how we help businesses prepare for search and AI.",
                    },
                    DEFAULT_NEXT_STEPS_MOBILE[2],
                ]}
            />
        </>
    );
}
