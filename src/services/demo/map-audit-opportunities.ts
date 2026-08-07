import type { SerializablePublicReport } from "@/src/types/public-report";

const OPPORTUNITY_MAPPINGS: Array<{
    match: RegExp;
    category: string;
    demoImplementation: string;
}> = [
    {
        match: /cta|call to action|contact/i,
        category: "Conversion Readiness",
        demoImplementation:
            "Add a prominent request-a-quote CTA in the hero and repeated contextual CTA sections.",
    },
    {
        match: /trust|credential|review|rating/i,
        category: "Trust Signals",
        demoImplementation:
            "Add a trust section using placeholders or approved credentials only.",
    },
    {
        match: /service|hierarchy|navigation/i,
        category: "Service Clarity",
        demoImplementation:
            "Create a structured services grid and detailed service routes.",
    },
    {
        match: /mobile|navigation|menu/i,
        category: "Mobile Experience",
        demoImplementation:
            "Implement responsive navigation with clear touch targets.",
    },
    {
        match: /contact|phone|email|form/i,
        category: "Contact Path",
        demoImplementation: "Add persistent contact CTA and clear contact section.",
    },
    {
        match: /homepage|content|dense|hierarchy|spacing/i,
        category: "Content Hierarchy",
        demoImplementation: "Improve hierarchy, spacing, and section structure.",
    },
    {
        match: /local|location|service area/i,
        category: "Local Relevance",
        demoImplementation: "Add approved service-area and location content.",
    },
    {
        match: /performance|speed|image|javascript/i,
        category: "Performance",
        demoImplementation:
            "Use optimized images, minimal client JavaScript, and static components.",
    },
];

function mapImplementation(title: string, description: string): string {
    const haystack = `${title} ${description}`;
    for (const mapping of OPPORTUNITY_MAPPINGS) {
        if (mapping.match.test(haystack)) {
            return mapping.demoImplementation;
        }
    }
    return "Address this finding with a structured section aligned to the selected visual direction.";
}

export function mapAuditOpportunities(report: SerializablePublicReport): Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    priority: string;
    evidenceCheckIds: string[];
    demoImplementation: string;
}> {
    const opportunities: Array<{
        id: string;
        category: string;
        title: string;
        description: string;
        priority: string;
        evidenceCheckIds: string[];
        demoImplementation: string;
    }> = [];

    const ai = report.sourceSnapshot.ai;
    const niceGuy = report.sourceSnapshot.niceGuy;

    for (const [index, weakness] of ai.weaknesses.entries()) {
        opportunities.push({
            id: `weakness-${index}`,
            category: weakness.category ?? "AI Analysis",
            title: weakness.title,
            description: weakness.description,
            priority: weakness.priority,
            evidenceCheckIds: weakness.evidenceLabels,
            demoImplementation: mapImplementation(weakness.title, weakness.description),
        });
    }

    for (const [index, quickWin] of ai.quickWins.entries()) {
        opportunities.push({
            id: `quick-win-${index}`,
            category: quickWin.category ?? "Quick Win",
            title: quickWin.title,
            description: quickWin.description,
            priority: quickWin.expectedImpact,
            evidenceCheckIds: quickWin.evidenceLabels,
            demoImplementation: mapImplementation(quickWin.title, quickWin.description),
        });
    }

    for (const [index, recommendation] of niceGuy.deterministicRecommendations.entries()) {
        opportunities.push({
            id: `niceguy-${index}`,
            category: recommendation.categoryName,
            title: recommendation.title,
            description: recommendation.description,
            priority: recommendation.priority,
            evidenceCheckIds: [recommendation.checkId],
            demoImplementation: mapImplementation(
                recommendation.title,
                recommendation.description,
            ),
        });
    }

    return opportunities;
}

export function countSupportedDemoOpportunities(report: SerializablePublicReport): number {
    return mapAuditOpportunities(report).length;
}
