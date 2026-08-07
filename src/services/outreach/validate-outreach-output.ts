import { OUTREACH_BODY_WORD_LIMITS, OUTREACH_SUBJECT_MAX_LENGTH } from "@/src/services/outreach/constants";
import type { OutreachEmailOutput } from "@/src/services/outreach/schemas";
import type { OutreachGenerationInput, OutreachLength } from "@/src/services/outreach/types";
import { scanOutreachClaims } from "@/src/services/outreach/scan-outreach-claims";

const INTERNAL_URL_PATTERN = /\/dashboard\/|\/internal\/|mongodb|cloudinary\.com\/.*\/upload\/v\d+\//i;
const TOKEN_PATTERN = /renderToken=|tokenHash|eyJ[A-Za-z0-9_-]{10,}/;

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function collectValidEvidenceIds(input: OutreachGenerationInput): Set<string> {
    const ids = new Set<string>();
    for (const item of input.audit.strengths) ids.add(item.id);
    for (const item of input.audit.weaknesses) ids.add(item.id);
    for (const item of input.audit.quickWins) ids.add(item.id);
    if (input.audit.overallScore !== null) ids.add("score-overall");
    if (input.audit.pageSpeed?.mobilePerformance !== null) ids.add("pagespeed-mobile");
    if (input.audit.pageSpeed?.desktopPerformance !== null) ids.add("pagespeed-desktop");
    return ids;
}

export class OutreachValidationError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "OutreachValidationError";
        this.code = code;
    }
}

export function validateOutreachOutput(input: {
    output: OutreachEmailOutput;
    generationInput: OutreachGenerationInput;
    allowAttachmentPlaceholder?: boolean;
}): {
    evidence: Array<{
        type: string;
        sourceId: string | null;
        label: string;
        value?: string | number | null;
        sourcePath?: string | null;
    }>;
    claimWarnings: Array<{ code: string; message: string }>;
} {
    const { output, generationInput } = input;
    const validIds = collectValidEvidenceIds(generationInput);

    if (!output.subject.trim()) {
        throw new OutreachValidationError("OUTREACH_SCHEMA_VALIDATION_FAILED", "Subject is required.");
    }
    if (output.subject.length > OUTREACH_SUBJECT_MAX_LENGTH) {
        throw new OutreachValidationError(
            "OUTREACH_SCHEMA_VALIDATION_FAILED",
            "Subject exceeds maximum length.",
        );
    }
    if (!output.bodyText.trim()) {
        throw new OutreachValidationError("OUTREACH_SCHEMA_VALIDATION_FAILED", "Body is required.");
    }

    const combined = `${output.subject}\n${output.bodyText}`;
    if (INTERNAL_URL_PATTERN.test(combined) || TOKEN_PATTERN.test(combined)) {
        throw new OutreachValidationError(
            "OUTREACH_UNSUPPORTED_CLAIM",
            "Draft contains unsupported internal URLs or tokens.",
        );
    }

    const words = countWords(output.bodyText);
    const limits = OUTREACH_BODY_WORD_LIMITS[generationInput.strategy.length as OutreachLength];
    if (words < limits.min * 0.5 || words > limits.max * 1.35) {
        throw new OutreachValidationError(
            "OUTREACH_SCHEMA_VALIDATION_FAILED",
            "Body length does not match the selected strategy.",
        );
    }

    const evidence = output.evidenceUsed.map((item) => {
        if (item.sourceId && !validIds.has(item.sourceId)) {
            throw new OutreachValidationError(
                "OUTREACH_INVALID_EVIDENCE",
                `Evidence ID "${item.sourceId}" is not supported by the source snapshot.`,
            );
        }
        return {
            type: item.type,
            sourceId: item.sourceId ?? null,
            label: item.label,
            sourcePath: item.sourceId ?? null,
        };
    });

    const claimScan = scanOutreachClaims({
        subject: output.subject,
        bodyText: output.bodyText,
        allowAttachmentPlaceholder: input.allowAttachmentPlaceholder,
    });

    if (claimScan.hardRejections.length > 0) {
        throw new OutreachValidationError(
            "OUTREACH_UNSUPPORTED_CLAIM",
            claimScan.hardRejections[0].message,
        );
    }

    return {
        evidence,
        claimWarnings: [
            ...claimScan.warnings,
            ...output.warnings.map((message) => ({ code: "MODEL_WARNING", message })),
        ],
    };
}
