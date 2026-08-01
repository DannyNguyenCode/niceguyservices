import "server-only";

import type { AiSummaryOutput } from "@/src/services/ai/types";
import { collectValidCheckIds } from "@/src/services/ai/normalize-output";

function pickIds(ids: Set<string>, count: number): string[] {
    return [...ids].slice(0, Math.max(count, 1));
}

export function buildDevelopmentMockAiSummary(input: {
    categories: Array<{ checks: Array<{ id: string }> }>;
    businessName: string;
}): AiSummaryOutput {
    const validIds = collectValidCheckIds(input.categories);
    const primary = pickIds(validIds, 1)[0] ?? "clarity-homepage-message";
    const secondary = pickIds(validIds, 2)[1] ?? primary;
    const tertiary = pickIds(validIds, 3)[2] ?? secondary;

    const label = input.businessName.trim() || "This website";

    return {
        executiveSummary: `${label} was reviewed using the automated development mock analysis path because no AI provider API key is configured locally. The crawl, screenshot, PageSpeed, and Nice Guy scoring stages still ran normally, and this summary is generated from those deterministic signals so the dashboard and report draft workflow can be verified end to end. Focus on homepage clarity, trust signals, and mobile performance first because those areas most directly affect visitor confidence and contact attempts. This mock output is clearly marked as non-production analysis and should be replaced once a real AI provider is configured.`,
        businessImpactSummary:
            "Visitors may hesitate when the homepage message, trust signals, or mobile performance are weak. Improving clarity and reducing friction on the primary conversion path should help more visitors understand the offer and take the next step. The development mock highlights the highest-signal findings from the completed crawl and scoring stages without calling an external AI provider.",
        strengths: [
            {
                title: "Audit pipeline completed",
                description: "Core crawl and scoring stages completed successfully in development.",
                category: "Technical Foundation",
                evidenceCheckIds: [primary],
            },
            {
                title: "Structured findings available",
                description: "Nice Guy scoring produced evidence-backed checks for review.",
                category: "Business Clarity",
                evidenceCheckIds: [secondary],
            },
        ],
        weaknesses: [
            {
                title: "Mock analysis only",
                description:
                    "AI provider credentials are not configured, so this summary uses development mock content.",
                category: "Content Quality",
                priority: "medium",
                evidenceCheckIds: [primary],
            },
            {
                title: "Review homepage clarity",
                description:
                    "Validate that the homepage immediately explains the primary service offering.",
                category: "Business Clarity",
                priority: "high",
                evidenceCheckIds: [secondary],
            },
        ],
        quickWins: [
            {
                title: "Clarify the homepage headline",
                description: "State the primary service and audience in the first screen.",
                expectedImpact: "high",
                estimatedEffort: "low",
                category: "Business Clarity",
                evidenceCheckIds: [primary],
            },
            {
                title: "Make contact options visible",
                description: "Place phone, email, or contact actions near the main call to action.",
                expectedImpact: "medium",
                estimatedEffort: "low",
                category: "Conversion Readiness",
                evidenceCheckIds: [secondary],
            },
            {
                title: "Review mobile performance",
                description: "Check mobile PageSpeed results and reduce heavy assets if needed.",
                expectedImpact: "medium",
                estimatedEffort: "medium",
                category: "User Experience",
                evidenceCheckIds: [tertiary],
            },
        ],
        longTermRecommendations: [
            {
                title: "Strengthen service-page structure",
                description: "Build clearer service pages with proof, FAQs, and stronger hierarchy.",
                priority: "medium",
                estimatedEffort: "high",
                category: "Business Clarity",
                evidenceCheckIds: [secondary],
            },
            {
                title: "Configure production AI analysis",
                description: "Add AI provider credentials to replace this development mock summary.",
                priority: "low",
                estimatedEffort: "low",
                category: "Technical Foundation",
                evidenceCheckIds: [primary],
            },
        ],
        priorityOrder: [
            {
                rank: 1,
                title: "Clarify homepage message",
                reason: "Visitors need an immediate understanding of the service offered.",
                priority: "high",
                evidenceCheckIds: [primary],
            },
            {
                rank: 2,
                title: "Improve conversion visibility",
                reason: "Contact paths should be obvious without scrolling or searching.",
                priority: "high",
                evidenceCheckIds: [secondary],
            },
            {
                rank: 3,
                title: "Review mobile experience",
                reason: "Mobile visitors are often the majority of local service traffic.",
                priority: "medium",
                evidenceCheckIds: [tertiary],
            },
        ],
        disclaimers: [
            "This summary was generated by the development mock AI path for local testing.",
        ],
    };
}
