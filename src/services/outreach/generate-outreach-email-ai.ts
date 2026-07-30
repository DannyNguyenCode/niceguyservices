import "server-only";

import { OUTREACH_EMAIL_SYSTEM_PROMPT } from "@/src/prompts/outreach-email-system-v1";
import { buildOutreachEmailUserPrompt } from "@/src/prompts/outreach-email-user-v1";
import { getAiProvider } from "@/src/services/ai/provider";
import { OUTREACH_PROMPT_VERSION } from "@/src/services/outreach/constants";
import {
    parseOutreachEmailOutput,
    safeParseOutreachEmailOutput,
} from "@/src/services/outreach/schemas";
import type { OutreachEmailOutput } from "@/src/services/outreach/schemas";
import type { OutreachGenerationInput } from "@/src/services/outreach/types";
import { validateOutreachOutput } from "@/src/services/outreach/validate-outreach-output";

export async function generateOutreachEmailWithAi(input: OutreachGenerationInput) {
    const provider = getAiProvider();

    const run = async (repair = false) =>
        provider.generateStructured<OutreachEmailOutput>(
            {
                systemPrompt: OUTREACH_EMAIL_SYSTEM_PROMPT,
                userPrompt: repair
                    ? `${buildOutreachEmailUserPrompt(input)}\n\nPrevious output failed validation. Return corrected JSON only.`
                    : buildOutreachEmailUserPrompt(input),
                schemaName: "outreach_email_v1",
                temperature: 0.4,
                maxOutputTokens: 2048,
            },
            parseOutreachEmailOutput,
        );

    let result = await run(false);
    let parsed = safeParseOutreachEmailOutput(result.output);
    let retryCount = 0;

    if (!parsed.success) {
        retryCount = 1;
        result = await run(true);
        parsed = safeParseOutreachEmailOutput(result.output);
        if (!parsed.success) {
            throw new Error("OUTREACH_SCHEMA_VALIDATION_FAILED");
        }
    }

    const validated = validateOutreachOutput({
        output: parsed.data,
        generationInput: input,
    });

    return {
        subject: parsed.data.subject.trim(),
        bodyText: parsed.data.bodyText.trim(),
        evidence: validated.evidence,
        claimWarnings: validated.claimWarnings,
        provider: provider.name,
        model: result.model,
        promptVersion: OUTREACH_PROMPT_VERSION,
        providerRequestId: result.providerRequestId ?? null,
        durationMs: result.durationMs,
        retryCount,
    };
}
