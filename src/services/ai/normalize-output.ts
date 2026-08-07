import type { AiSummaryOutput, HeroSuggestionsOutput } from "@/src/services/ai/types";

function filterEvidenceIds(ids: string[], validIds: Set<string>): string[] {
    return [...new Set(ids.filter((id) => validIds.has(id)))];
}

function dropIfNoEvidence<T extends { evidenceCheckIds: string[] }>(item: T): T | null {
    return item.evidenceCheckIds.length > 0 ? item : null;
}

export function collectValidCheckIds(
    categories: Array<{ checks: Array<{ id: string }> }>,
): Set<string> {
    const ids = new Set<string>();
    for (const category of categories) {
        for (const check of category.checks) {
            ids.add(check.id);
        }
    }
    return ids;
}

export function normalizeAiSummaryOutput(
    output: AiSummaryOutput,
    validCheckIds: Set<string>,
): AiSummaryOutput {
    const mapItem = <T extends { evidenceCheckIds: string[] }>(item: T): T => ({
        ...item,
        evidenceCheckIds: filterEvidenceIds(item.evidenceCheckIds, validCheckIds),
    });

    const strengths = output.strengths.map(mapItem).map(dropIfNoEvidence).filter(Boolean) as AiSummaryOutput["strengths"];
    const weaknesses = output.weaknesses.map(mapItem).map(dropIfNoEvidence).filter(Boolean) as AiSummaryOutput["weaknesses"];
    const quickWins = output.quickWins.map(mapItem).map(dropIfNoEvidence).filter(Boolean) as AiSummaryOutput["quickWins"];
    const longTermRecommendations = output.longTermRecommendations
        .map(mapItem)
        .map(dropIfNoEvidence)
        .filter(Boolean) as AiSummaryOutput["longTermRecommendations"];

    const priorityOrder = output.priorityOrder
        .map(mapItem)
        .map(dropIfNoEvidence)
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.rank - b.rank)
        .map((item, index) => ({ ...item, rank: index + 1 }));

    return {
        ...output,
        strengths,
        weaknesses,
        quickWins,
        longTermRecommendations,
        priorityOrder,
    };
}

export function normalizeHeroSuggestionsOutput(
    output: HeroSuggestionsOutput,
    validCheckIds: Set<string>,
    discoveredPaths: Set<string>,
): HeroSuggestionsOutput {
    const normalizeHref = (href?: string | null): string | null => {
        if (!href) return null;
        const normalized = href.startsWith("/") ? href : `/${href}`;
        return discoveredPaths.has(normalized) ? normalized : null;
    };

    return {
        suggestions: output.suggestions.map((suggestion) => ({
            ...suggestion,
            primaryCta: {
                ...suggestion.primaryCta,
                hrefSuggestion: normalizeHref(suggestion.primaryCta.hrefSuggestion),
            },
            secondaryCta: suggestion.secondaryCta
                ? {
                      ...suggestion.secondaryCta,
                      hrefSuggestion: normalizeHref(suggestion.secondaryCta.hrefSuggestion),
                  }
                : suggestion.secondaryCta,
            targetProblems: suggestion.targetProblems.filter((problem) =>
                validCheckIds.has(problem.checkId),
            ),
        })),
    };
}

export function assertSummaryHasMinimumFindings(output: AiSummaryOutput): void {
    if (
        output.strengths.length < 2 ||
        output.weaknesses.length < 2 ||
        output.quickWins.length < 3 ||
        output.longTermRecommendations.length < 2 ||
        output.priorityOrder.length < 3
    ) {
        throw new Error("AI_SCHEMA_VALIDATION_FAILED");
    }
}

export function assertHeroSuggestionsValid(output: HeroSuggestionsOutput): void {
    if (output.suggestions.length !== 3) {
        throw new Error("AI_SCHEMA_VALIDATION_FAILED");
    }

    for (const suggestion of output.suggestions) {
        if (suggestion.targetProblems.length === 0) {
            throw new Error("AI_SCHEMA_VALIDATION_FAILED");
        }
    }
}
