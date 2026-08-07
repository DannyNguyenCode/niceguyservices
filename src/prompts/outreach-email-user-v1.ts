import type { OutreachGenerationInput } from "@/src/services/outreach/types";
import { wrapUntrustedEvidence } from "@/src/services/ai/sanitize-input";

export function buildOutreachEmailUserPrompt(input: OutreachGenerationInput): string {
    const evidenceJson = JSON.stringify(input, null, 2);

    return `${wrapUntrustedEvidence("outreach-audit-evidence", evidenceJson)}

Write an outreach email draft with:
- subject (maximum 80 characters)
- bodyText (plain text, word count appropriate for length: ${input.strategy.length})
- evidenceUsed (items from the supplied evidence IDs only)
- rationale (for administrator review only)
- warnings (any concerns about limited evidence)

Tone: ${input.strategy.tone}
Length: ${input.strategy.length}
Primary goal: ${input.strategy.primaryGoal}
Include score: ${input.strategy.includeScore}
Include PageSpeed: ${input.strategy.includePageSpeed}
Include quick win: ${input.strategy.includeQuickWin}
Include compliment: ${input.strategy.includeBusinessCompliment}
Reference PDF: ${input.strategy.includePdfReference}
Reference public report: ${input.strategy.includePublicReport}`;
}
