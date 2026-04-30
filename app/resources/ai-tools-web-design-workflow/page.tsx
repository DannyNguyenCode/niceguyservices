import type { Metadata } from "next";
import Link from "next/link";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import ResourceArticleTemplate, {
    ResourceQuoteCallout,
    ResourceSection,
} from "@/components/resources/ResourceArticleTemplate";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title:
        "Using AI as a Tool in Web Design (Cursor, Stitch, ChatGPT) | Nice Guy Web Design",
    description:
        "How I use AI in moderation to save time on code and SEO, brainstorm UI with Google Stitch, and draft copy with ChatGPT — without handing the site over to a machine.",
    alternates: {
        canonical: absoluteUrl("/resources/ai-tools-web-design-workflow"),
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function AiToolsWebDesignWorkflowPage() {
    return (
        <ResourceArticleTemplate
            seriesBadge="Process 05"
            title={
                <>
                    AI as a{" "}
                    <span className="text-primary">tool</span> — not the author
                </>
            }
            updatedIso="2026-04-29"
            updatedLabel="April 29, 2026"
            heroImage={{
                src: "/images/Futuristic-tech-abstract.png",
                alt: "Abstract technology suggesting workflow and careful tooling",
            }}
            executiveSummary="Use AI for narrow, reviewable tasks—generation, alternatives, and grunt work—while you keep judgment, voice, and accountability. Small doses, clear boundaries."
            expertTip={{
                title: "Expert tip",
                body: "Treat every model output as a rough cut: if you wouldn’t ship a contractor’s first draft without reading it, don’t ship AI output without the same pass.",
            }}
            cta={{
                title: "Want a site built with care—not autopilot?",
                body: "Fast delivery can still mean human judgment on structure, copy, and performance. Tell me what you’re building.",
                primary: { href: "/contact", label: "Get in touch" },
                secondary: { href: "/services", label: "View services" },
            }}
            articleStructuredData={{
                headline:
                    "Using AI as a tool in web design: Cursor, Google Stitch, and ChatGPT",
                description:
                    "How AI can support code, SEO, UX brainstorming, and copy when used in moderation—with humans staying accountable for quality and accuracy.",
                datePublished: "2026-04-29",
                dateModified: "2026-04-29",
                pagePath: "/resources/ai-tools-web-design-workflow",
                heroImageSrc: "/images/Futuristic-tech-abstract.png",
            }}
        >
            <div className="space-y-6 text-lg leading-relaxed text-(--pm-on-surface-variant)">
                <p>
                    This is{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">
                        not
                    </strong>{" "}
                    a pitch to adopt every AI product on the market. It’s an honest look at
                    how I use a few tools—{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">
                        Cursor
                    </strong>
                    ,{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">
                        Google Stitch
                    </strong>
                    , and{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">
                        ChatGPT
                    </strong>{" "}
                    —to move faster on parts of web projects where automation helps, while
                    keeping quality under human control.
                </p>
                <p>
                    The through-line is simple:{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">
                        use AI in small, bounded ways
                    </strong>
                    , only where you’re comfortable letting it touch your work, and always
                    assume you’ll edit the result. The benefits are real—time saved, more
                    options explored, fewer repetitive keystrokes—but they show up when AI is
                    a{" "}
                    <strong className="font-semibold text-(--pm-on-surface)">
                        lever
                    </strong>
                    , not a replacement for thinking.
                </p>
            </div>

            <ResourceSection index="01" title="Why moderation matters">
                <p>
                    Generative tools are trained on patterns, not on your client’s reputation
                    or your standards. They can sound confident while being wrong, generic,
                    or misaligned with brand voice. That’s why “AI-first” publishing is risky;
                    “AI-assisted, human-reviewed” is the bar I hold for anything that ships.
                </p>
                <p>
                    Moderation here means three things:{" "}
                    <strong className="text-(--pm-on-surface)">scope</strong> (one task at a
                    time), <strong className="text-(--pm-on-surface)">limits</strong> (no
                    sensitive client secrets fed into tools without consent), and{" "}
                    <strong className="text-(--pm-on-surface)">review</strong> (you read
                    before merge). If a step feels uncomfortable to automate, don’t—keep
                    it manual.
                </p>
            </ResourceSection>

            <ResourceQuoteCallout
                title="The useful default"
                icon={LightBulbIcon}
                quote={
                    <>
                        “Let AI propose; you dispose. The moment you stop reading the diff or
                        the paragraph, you’ve traded speed for liability.”
                    </>
                }
            />

            <ResourceSection index="02" title="Cursor: faster code, tighter SEO hygiene">
                <p>
                    <strong className="text-(--pm-on-surface)">Cursor</strong> (and similar
                    coding assistants) fits my workflow where code already lives in a repo:
                    refactors, boilerplate, accessibility tweaks, and catching obvious issues
                    before review.
                </p>
                <p>
                    <strong className="text-(--pm-on-surface)">Where it helps:</strong>{" "}
                    scaffolding components, renaming safely across files, suggesting patterns
                    that match the stack (e.g. Next.js conventions), and surfacing ideas for
                    metadata or structured data that I still verify against Google’s
                    guidelines and the actual page—never copy-paste blind.
                </p>
                <p>
                    <strong className="text-(--pm-on-surface)">Where I keep it small:</strong>{" "}
                    I don’t let the model “rewrite the whole app.” I ask for discrete edits,
                    read the diff, and run the build. SEO wins here come from{" "}
                    <strong className="text-(--pm-on-surface)">
                        consistent implementation
                    </strong>{" "}
                    (titles, headings, performance-minded markup)—not from outsourcing
                    judgment about what belongs on the page.
                </p>
            </ResourceSection>

            <ResourceSection
                index="03"
                accent="secondary"
                title="Google Stitch: brainstorming design and UX"
            >
                <p>
                    <strong className="text-(--pm-on-surface)">Google Stitch</strong> is part
                    of how I explore visual directions early—layout ideas, hierarchy
                    experiments, and UX prompts—before committing pixels in Figma or code.
                </p>
                <p>
                    <strong className="text-(--pm-on-surface)">Benefit:</strong> quicker
                    iteration on “what if we emphasized trust here?” or “what if this section
                    were calmer?” without spending hours on throwaway comps. It’s useful for{" "}
                    <strong className="text-(--pm-on-surface)">divergent thinking</strong>{" "}
                    when the brief is fuzzy.
                </p>
                <p>
                    <strong className="text-(--pm-on-surface)">Boundary:</strong> brainstorm
                    outputs aren’t final UI. Brand, spacing, accessibility, and content come
                    next—and those stay intentionally human-led. I treat Stitch like mood
                    boards and alternatives, not the shipped interface.
                </p>
            </ResourceSection>

            <ResourceSection index="04" title="ChatGPT: drafting and sharpening copy">
                <p>
                    <strong className="text-(--pm-on-surface)">ChatGPT</strong> is strongest
                    where language is iterative: headline variants, shortening dense
                    paragraphs, alternate CTAs, or explaining a technical concept in plain
                    English so I can rewrite it for a specific audience.
                </p>
                <p>
                    <strong className="text-(--pm-on-surface)">Benefit:</strong> less staring
                    at a blank page; more cycles on tone and accuracy. For small businesses,
                    that often means clearer service descriptions and FAQs—always edited so
                    they sound like the owner, not a generic assistant.
                </p>
                <p>
                    <strong className="text-(--pm-on-surface)">Boundary:</strong> I don’t
                    publish raw model copy. Facts (pricing, areas served, legal claims) come
                    from the client or verified sources. The model might invent nuance; the
                    human signs off.
                </p>
            </ResourceSection>

            <ResourceSection
                index="05"
                accent="secondary"
                title="What this stack does not replace"
            >
                <ul className="list-disc space-y-2 pl-6">
                    <li>
                        <strong className="text-(--pm-on-surface)">Accountability</strong> —
                        you still own errors, accessibility, performance, and SEO outcomes.
                    </li>
                    <li>
                        <strong className="text-(--pm-on-surface)">Trust</strong> — visitors
                        buy from people and clarity; uncanny or generic copy erodes that.
                    </li>
                    <li>
                        <strong className="text-(--pm-on-surface)">Strategy</strong> — what
                        to build, for whom, and in what order remains a conversation, not a
                        prompt.
                    </li>
                </ul>
                <p>
                    AI can compress execution time; it doesn’t replace intent. Used as a tool,
                    it buys room to focus on the parts of the project that actually need your
                    taste and domain sense.
                </p>
            </ResourceSection>

            <ResourceSection index="06" title="Practical guardrails that keep you safe">
                <ul className="list-disc space-y-2 pl-6">
                    <li>
                        Use tools on <strong className="text-(--pm-on-surface)">non-secret</strong>{" "}
                        material unless your policy (and the client’s) allows otherwise.
                    </li>
                    <li>
                        Prefer <strong className="text-(--pm-on-surface)">small prompts</strong>{" "}
                        and small patches—easier to review than a 500-line dump.
                    </li>
                    <li>
                        For SEO and local info,{" "}
                        <strong className="text-(--pm-on-surface)">verify</strong> against
                        Search Console, official docs, and the client’s real offering—not the
                        model’s memory.
                    </li>
                    <li>
                        When in doubt,{" "}
                        <strong className="text-(--pm-on-surface)">ship less automation</strong>
                        . A slower honest page beats a fast wrong one.
                    </li>
                </ul>
            </ResourceSection>

            <ResourceSection index="07" title="Bottom line">
                <p>
                    Cursor can speed up code and keep SEO implementation consistent if you
                    review changes. Stitch can widen your design exploration early. ChatGPT
                    can unblock wording—after you edit for voice and truth. Together they’re
                    optional force multipliers, not a mandate.
                </p>
                <p>
                    If you’re hiring someone to build your site, ask how they use assistive
                    tools—not because AI is bad, but because you deserve transparency on what
                    was handcrafted, what was assisted, and what was verified before launch.
                </p>
                <p className="text-(--pm-on-surface-variant)">
                    Curious how that fits your project?{" "}
                    <Link
                        href="/contact"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Get in touch
                    </Link>{" "}
                    — or explore{" "}
                    <Link
                        href="/services"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        services
                    </Link>
                    .
                </p>
            </ResourceSection>
        </ResourceArticleTemplate>
    );
}
