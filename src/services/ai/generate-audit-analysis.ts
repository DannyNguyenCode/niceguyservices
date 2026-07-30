import "server-only";

import { AI_CONFIG } from "@/src/lib/ai-config";
import {
    AUDIT_ANALYSIS_SYSTEM_PROMPT,
    buildAuditAnalysisUserPrompt,
} from "@/src/services/ai/prompts/audit-analysis-v1";
import { getAiProvider } from "@/src/services/ai/provider";
import {
    collectValidCheckIds,
    normalizeAiSummaryOutput,
    assertSummaryHasMinimumFindings,
} from "@/src/services/ai/normalize-output";
import { parseAiSummaryOutput, safeParseAiSummaryOutput } from "@/src/services/ai/schemas";
import type { AiSummaryOutput, AuditAnalysisInput } from "@/src/services/ai/types";

export async function generateAuditAnalysis(input: AuditAnalysisInput) {
    const provider = getAiProvider();
    const validCheckIds = collectValidCheckIds(input.niceGuy.categories);

    const run = async (repair = false) =>
        provider.generateStructured<AiSummaryOutput>(
            {
                systemPrompt: AUDIT_ANALYSIS_SYSTEM_PROMPT,
                userPrompt: repair
                    ? `${buildAuditAnalysisUserPrompt(input)}\n\nPrevious output failed validation. Return corrected JSON only.`
                    : buildAuditAnalysisUserPrompt(input),
                schemaName: "audit_analysis_v1",
                temperature: 0.2,
                maxOutputTokens: 4096,
            },
            parseAiSummaryOutput,
        );

    let result = await run(false);
    let parsed = safeParseAiSummaryOutput(result.output);

    if (!parsed.success) {
        result = await run(true);
        parsed = safeParseAiSummaryOutput(result.output);
        if (!parsed.success) {
            throw new Error("AI_SCHEMA_VALIDATION_FAILED");
        }
    }

    const normalized = normalizeAiSummaryOutput(parsed.data, validCheckIds);
    assertSummaryHasMinimumFindings(normalized);

    return {
        output: normalized,
        provider: provider.name,
        model: result.model,
        promptVersion: AI_CONFIG.analysisPromptVersion,
        promptTokens: result.promptTokens ?? null,
        completionTokens: result.completionTokens ?? null,
        totalTokens: result.totalTokens ?? null,
        durationMs: result.durationMs,
        providerRequestId: result.providerRequestId ?? null,
    };
}
