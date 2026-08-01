import { z } from "zod";

export const AUDIT_EVIDENCE_SOURCES = [
    "screenshot",
    "pagespeed",
    "niceguy_metric",
    "crawl",
    "content",
] as const;

export const AUDIT_ISSUE_CATEGORIES = [
    "performance",
    "accessibility",
    "seo",
    "responsive_design",
    "ux",
    "conversion",
    "content",
    "trust",
    "technical",
] as const;

export const AUDIT_ISSUE_SEVERITIES = ["critical", "high", "medium", "low"] as const;

export const AUDIT_REQUESTED_OUTPUTS = [
    "executive_summary",
    "strengths",
    "prioritized_issues",
    "hero_recommendations",
    "outreach_email",
] as const;

const screenshotDeviceSchema = z.enum(["desktop", "mobile"]);

export const cursorAuditPackageSchema = z.object({
    schemaVersion: z.literal("1.0"),
    auditId: z.string().min(1),
    website: z.object({
        url: z.string().url(),
        businessName: z.string().nullable(),
        industry: z.string().nullable(),
        pagesAnalyzed: z.array(z.string().min(1)),
    }),
    screenshots: z.array(
        z.object({
            id: z.string().min(1),
            page: z.string().min(1),
            device: screenshotDeviceSchema,
            url: z.string().url(),
            width: z.number().positive(),
            height: z.number().positive(),
            capturedAt: z.string().datetime(),
        }),
    ),
    googleMetrics: z.object({
        mobile: z.record(z.string(), z.unknown()),
        desktop: z.record(z.string(), z.unknown()),
    }),
    niceGuyMetrics: z.record(z.string(), z.unknown()),
    crawl: z.record(z.string(), z.unknown()),
    requestedOutputs: z.array(z.enum(AUDIT_REQUESTED_OUTPUTS)).min(1),
    metadata: z.object({
        packageCreatedAt: z.string().datetime(),
        packageVersion: z.literal("1.0"),
    }),
});

export const cursorAuditResultSchema = z.object({
    schemaVersion: z.literal("1.0"),
    auditId: z.string().min(1),
    analysisRequestId: z.string().min(1),
    status: z.literal("completed"),
    overallScore: z.number().min(0).max(100),
    executiveSummary: z.string().min(1),
    strengths: z.array(
        z.object({
            title: z.string().min(1),
            evidence: z.string().min(1),
            sources: z.array(z.enum(AUDIT_EVIDENCE_SOURCES)).min(1),
        }),
    ),
    issues: z.array(
        z.object({
            id: z.string().min(1),
            category: z.enum(AUDIT_ISSUE_CATEGORIES),
            severity: z.enum(AUDIT_ISSUE_SEVERITIES),
            title: z.string().min(1),
            evidence: z.string().min(1),
            recommendation: z.string().min(1),
            sources: z.array(z.enum(AUDIT_EVIDENCE_SOURCES)).min(1),
            confidence: z.number().min(0).max(1),
        }),
    ),
    heroSuggestions: z.object({
        headline: z.string().min(1),
        supportingCopy: z.string().min(1),
        primaryCTA: z.string().min(1),
        secondaryCTA: z.string().nullable(),
        designDirection: z.string().min(1),
    }),
    outreachEmail: z.object({
        subject: z.string().min(1),
        body: z.string().min(1),
    }),
    metadata: z.object({
        analysisMethod: z.literal("cursor-automation-poc"),
        promptVersion: z.string().min(1),
        completedAt: z.string().datetime(),
    }),
});

export type CursorAuditPackage = z.infer<typeof cursorAuditPackageSchema>;
export type CursorAuditResult = z.infer<typeof cursorAuditResultSchema>;

export function validateCursorAuditPackage(value: unknown): CursorAuditPackage {
    return cursorAuditPackageSchema.parse(value);
}

export function validateCursorAuditResult(value: unknown): CursorAuditResult {
    return cursorAuditResultSchema.parse(value);
}

export function safeValidateCursorAuditPackage(value: unknown) {
    return cursorAuditPackageSchema.safeParse(value);
}

export function safeValidateCursorAuditResult(value: unknown) {
    return cursorAuditResultSchema.safeParse(value);
}
