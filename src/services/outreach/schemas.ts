import { z } from "zod";
import { OUTREACH_SUBJECT_MAX_LENGTH } from "@/src/services/outreach/constants";

export const outreachEvidenceUsedSchema = z.object({
    type: z.string().min(1),
    sourceId: z.string().nullable().optional(),
    label: z.string().min(1),
});

export const outreachEmailOutputSchema = z.object({
    subject: z.string().min(1).max(OUTREACH_SUBJECT_MAX_LENGTH),
    bodyText: z.string().min(1),
    evidenceUsed: z.array(outreachEvidenceUsedSchema).min(1),
    rationale: z.object({
        primaryObservation: z.string().min(1),
        primaryOpportunity: z.string().min(1),
        callToAction: z.string().min(1),
    }),
    warnings: z.array(z.string()),
});

export type OutreachEmailOutput = z.infer<typeof outreachEmailOutputSchema>;

export function parseOutreachEmailOutput(raw: unknown): OutreachEmailOutput {
    return outreachEmailOutputSchema.parse(raw);
}

export function safeParseOutreachEmailOutput(raw: unknown) {
    return outreachEmailOutputSchema.safeParse(raw);
}

export const outreachStrategySchema = z.object({
    tone: z.enum(["friendly", "professional", "concise", "consultative"]),
    length: z.enum(["short", "standard", "detailed"]),
    primaryGoal: z.enum([
        "start-conversation",
        "share-audit",
        "offer-improvement",
        "request-meeting",
    ]),
    includePublicReport: z.boolean(),
    includePdfReference: z.boolean(),
    includeScore: z.boolean(),
    includePageSpeed: z.boolean(),
    includeQuickWin: z.boolean(),
    includeBusinessCompliment: z.boolean(),
});

export const outreachRecipientSchema = z.object({
    name: z.string().max(120).nullable().optional(),
    role: z.string().max(120).nullable().optional(),
    email: z.string().max(254).nullable().optional(),
});
