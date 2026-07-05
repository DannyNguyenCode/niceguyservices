"use client";

import {
    DcChecklist,
    DcFeatureRows,
    DcIconList,
    DcTakeaways,
} from "./article-ui";
import MaterialIcon from "./MaterialIcon";
import {
    GEO_AI_SIGNALS,
    GEO_COMPARISON,
    GEO_FRIENDLY_CARDS,
    GEO_LANDSCAPING_ARTICLES,
    GEO_MYTHS,
    GEO_PREP_TIPS,
    GEO_TAKEAWAYS,
    GEO_TIMELINE,
} from "./geoConfig";

export { GEO_TAKEAWAYS };

export function GeoHeroIconRow() {
    return (
        <div
            className="mb-6 inline-flex items-center gap-3 rounded-lg border border-[#c1c8c4] bg-[#f6f3f2] px-4 py-3"
            aria-hidden
        >
            <MaterialIcon name="psychology" className="!text-3xl text-[#416359]" />
            <MaterialIcon name="travel_explore" className="!text-3xl text-[#406372]" />
            <span className="sr-only">AI and search illustration</span>
        </div>
    );
}

export function GeoDisclaimerQuote() {
    return (
        <blockquote className="my-6 rounded-lg border border-[#416359] bg-[rgb(89_123_113/0.08)] p-6">
            <p className="text-base leading-relaxed text-[#1b1c1c]">
                GEO does not guarantee an AI assistant will recommend your business. Instead,
                it helps improve the chances that your content is considered useful,
                authoritative, and relevant when AI systems generate responses.
            </p>
        </blockquote>
    );
}

export function GeoMythAccordion({ className = "" }: { className?: string }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {GEO_MYTHS.map(({ myth, explanation }) => (
                <details
                    key={myth}
                    className="group rounded-lg border border-[#c1c8c4] bg-white open:shadow-sm"
                >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 marker:content-none [&::-webkit-details-marker]:hidden">
                        <div>
                            <span className="mb-1 block text-xs font-medium tracking-widest text-[#ba1a1a] uppercase">
                                Myth
                            </span>
                            <span className="font-medium text-[#1b1c1c]">&ldquo;{myth}&rdquo;</span>
                        </div>
                        <MaterialIcon
                            name="expand_more"
                            className="shrink-0 text-[#416359] transition-transform group-open:rotate-180"
                        />
                    </summary>
                    <div className="border-t border-[#c1c8c4] px-5 pt-4 pb-5">
                        <p className="mb-2 text-sm font-medium tracking-wide text-[#416359] uppercase">
                            False
                        </p>
                        <p className="text-[#414845]">{explanation}</p>
                    </div>
                </details>
            ))}
        </div>
    );
}

export function GeoComparisonTable() {
    return (
        <div className="overflow-x-auto rounded-lg border border-[#c1c8c4] bg-white">
            <table className="w-full min-w-[280px] border-collapse text-left text-sm">
                <caption className="sr-only">
                    Comparison of SEO, AEO, and GEO goals
                </caption>
                <thead>
                    <tr className="border-b border-[#c1c8c4] bg-[#f6f3f2]">
                        <th scope="col" className="p-4 font-medium text-[#416359]">
                            Approach
                        </th>
                        <th scope="col" className="p-4 font-medium text-[#416359]">
                            Goal
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {GEO_COMPARISON.map(({ acronym, name, goal }) => (
                        <tr key={acronym} className="border-b border-[#c1c8c4] last:border-b-0">
                            <td className="p-4 align-top md:w-2/5">
                                <span className="block font-bold text-[#1b1c1c]">{acronym}</span>
                                <span className="mt-1 block text-xs text-[#414845]">{name}</span>
                            </td>
                            <td className="p-4 text-[#414845]">{goal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function GeoTimeline() {
    return (
        <ol className="relative space-y-0 border-l-2 border-[#416359] pl-8">
            {GEO_TIMELINE.map(({ era, label, body }, index) => (
                <li key={era} className={index < GEO_TIMELINE.length - 1 ? "pb-10" : ""}>
                    <span
                        className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-[#416359]"
                        aria-hidden
                    />
                    <p className="mb-1 text-xs font-bold tracking-widest text-[#416359] uppercase">
                        {era}
                    </p>
                    <h3 className="dc-display mb-2 text-xl font-medium text-[#1b1c1c]">{label}</h3>
                    <p className="text-[#414845]">{body}</p>
                    {index < GEO_TIMELINE.length - 1 ? (
                        <span className="mt-4 block text-center text-[#416359]" aria-hidden>
                            ↓
                        </span>
                    ) : null}
                </li>
            ))}
        </ol>
    );
}

export function GeoFriendlyGrid() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {GEO_FRIENDLY_CARDS.map(({ icon, title, body }) => (
                <article
                    key={title}
                    className="rounded-lg border border-[#c1c8c4] bg-white p-5 shadow-sm"
                >
                    <div className="mb-3 flex items-center gap-2 text-[#416359]">
                        <MaterialIcon name={icon} className="shrink-0" />
                        <h3 className="font-medium text-[#1b1c1c]">{title}</h3>
                    </div>
                    <p className="text-sm text-[#414845]">{body}</p>
                </article>
            ))}
        </div>
    );
}

export function GeoLandscapingExample() {
    return (
        <>
            <p className="mb-6 text-base leading-relaxed text-[#414845]">
                A GEO-friendly version of the same site also publishes supporting articles that
                answer questions homeowners actually ask:
            </p>
            <DcIconList items={GEO_LANDSCAPING_ARTICLES} icon="article" />
            <p className="mt-6 text-base leading-relaxed text-[#414845]">
                Together, these pages demonstrate expertise. They do not promise a specific
                ranking or AI mention — but they give both customers and systems more context
                about what the company knows and how it helps.
            </p>
        </>
    );
}

export function GeoAiSignalsSection() {
    return <DcFeatureRows items={GEO_AI_SIGNALS} />;
}

export function GeoPrepareChecklist() {
    return <DcChecklist items={GEO_PREP_TIPS} />;
}

export function GeoTakeawaysGrid() {
    return <DcTakeaways items={GEO_TAKEAWAYS} />;
}
