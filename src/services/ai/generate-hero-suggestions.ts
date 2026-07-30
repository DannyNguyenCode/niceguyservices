import "server-only";

import { AI_CONFIG } from "@/src/lib/ai-config";
import {
    HERO_SUGGESTIONS_SYSTEM_PROMPT,
    buildHeroSuggestionsUserPrompt,
} from "@/src/services/ai/prompts/hero-suggestions-v1";
import { getAiProvider } from "@/src/services/ai/provider";
import {
    assertHeroSuggestionsValid,
    collectValidCheckIds,
    normalizeHeroSuggestionsOutput,
} from "@/src/services/ai/normalize-output";
import {
    parseHeroSuggestionsOutput,
    safeParseHeroSuggestionsOutput,
} from "@/src/services/ai/schemas";
import type { AuditAnalysisInput, HeroSuggestionsOutput } from "@/src/services/ai/types";

export async function generateHeroSuggestions(input: AuditAnalysisInput) {
    const provider = getAiProvider();
    const validCheckIds = collectValidCheckIds(input.niceGuy.categories);
    const discoveredPaths = new Set(input.crawl.discoveredPaths);

    const run = async (repair = false) =>
        provider.generateStructured<HeroSuggestionsOutput>(
            {
                systemPrompt: HERO_SUGGESTIONS_SYSTEM_PROMPT,
                userPrompt: repair
                    ? `${buildHeroSuggestionsUserPrompt(input)}\n\nPrevious output failed validation. Return corrected JSON with exactly three suggestions.`
                    : buildHeroSuggestionsUserPrompt(input),
                schemaName: "hero_suggestions_v1",
                temperature: 0.4,
                maxOutputTokens: 4096,
            },
            parseHeroSuggestionsOutput,
        );

    let result = await run(false);
    let parsed = safeParseHeroSuggestionsOutput(result.output);

    if (!parsed.success) {
        result = await run(true);
        parsed = safeParseHeroSuggestionsOutput(result.output);
        if (!parsed.success) {
            throw new Error("AI_SCHEMA_VALIDATION_FAILED");
        }
    }

    const normalized = normalizeHeroSuggestionsOutput(
        parsed.data,
        validCheckIds,
        discoveredPaths,
    );
    assertHeroSuggestionsValid(normalized);

    return {
        output: normalized,
        provider: provider.name,
        model: result.model,
        promptVersion: AI_CONFIG.heroPromptVersion,
        promptTokens: result.promptTokens ?? null,
        completionTokens: result.completionTokens ?? null,
        totalTokens: result.totalTokens ?? null,
        durationMs: result.durationMs,
        providerRequestId: result.providerRequestId ?? null,
    };
}
