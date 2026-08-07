import { z } from "zod";

const boundedString = (max: number) => z.string().trim().min(1).max(max);

export const AUDIT_ASSESSMENT_PRIORITIES = [
    "critical",
    "high",
    "moderate",
    "low",
] as const;

export const AUDIT_ISSUE_SEVERITIES = ["critical", "high", "medium", "low"] as const;

const screenshotRefSchema = z.object({
    id: z.string().min(1).max(100),
    page: z.string().min(1).max(100),
    device: z.enum(["desktop", "mobile"]),
    url: z.string().url().max(2000),
    width: z.number().positive(),
    height: z.number().positive(),
    viewport: z
        .object({
            width: z.number().positive(),
            height: z.number().positive(),
        })
        .optional(),
    capturedAt: z.string().datetime(),
    /**
     * Optional provenance: whether capture waited for initial presentation settle.
     * When timedOut/stabilized=false, AI should not treat motion as definitive settled UI.
     */
    visualStability: z
        .object({
            attempted: z.boolean(),
            stabilized: z.boolean(),
            timedOut: z.boolean(),
            reason: z.string().max(40),
            elapsedMs: z.number().int().min(0).optional(),
        })
        .optional(),
});

const niceGuyCompletenessSchema = z.object({
    status: z.string().min(1).max(50),
    evidenceCoverage: z.number().min(0).max(1).nullable(),
    applicableChecks: z.number().int().min(0).nullable(),
    evaluatedChecks: z.number().int().min(0).nullable(),
    unavailableChecks: z.number().int().min(0).nullable(),
    notApplicableChecks: z.number().int().min(0).nullable(),
});

const niceGuyMethodologySchema = z.object({
    rubricVersion: z.string().max(50).optional(),
    applicabilityVersion: z.string().max(50).optional(),
    deterministicCheckCount: z.number().int().min(0).optional(),
    aiAssistedCheckCount: z.number().int().min(0).optional(),
    limitations: z.array(z.string().max(500)).max(20).optional(),
});

const niceGuyMetricsPackageSchema = z.object({
    status: z.string().min(1).max(50),
    scoringVersion: z.string().min(1).max(50),
    overallScore: z.number().min(0).max(100).nullable(),
    categories: z.array(z.unknown()),
    completeness: niceGuyCompletenessSchema,
    methodology: niceGuyMethodologySchema,
    generatedAt: z.string().datetime().optional(),
});

const analysisInstructionsSchema = z.object({
    promptVersion: z.string().min(1).max(20),
    rules: z.array(z.string().max(500)).max(30),
    outputSchemaVersion: z.string().min(1).max(20),
});

const auditResultContractSchema = z.object({
    schemaVersion: z.literal("1.1"),
    contractVersion: z.literal("1.1"),
    jsonSchema: z.record(z.string(), z.unknown()),
    requiredFields: z.array(z.string().min(1)).min(1),
    fieldLimits: z.record(z.string(), z.number().int().positive()),
    enums: z.object({
        assessmentPriority: z.array(z.string().min(1)),
        issueSeverity: z.array(z.string().min(1)),
        homepageChangePriority: z.array(z.string().min(1)).optional(),
    }),
    example: z.record(z.string(), z.unknown()),
});

export const cursorAuditPackageSchema = z.object({
    schemaVersion: z.literal("1.1"),
    packageVersion: z.string().min(1).max(20),
    audit: z.object({
        auditId: z.string().min(1).max(100),
        analysisRequestId: z.string().min(1).max(100),
        auditedUrl: z.string().url().max(2000),
        normalizedUrl: z.string().url().max(2000).optional(),
        createdAt: z.string().datetime(),
        completedAt: z.string().datetime().optional(),
    }),
    crawl: z.record(z.string(), z.unknown()),
    screenshots: z.object({
        desktop: screenshotRefSchema.nullable(),
        mobile: screenshotRefSchema.nullable(),
        additional: z.array(screenshotRefSchema).max(10).optional(),
    }),
    pageSpeed: z.object({
        mobile: z.record(z.string(), z.unknown()),
        desktop: z.record(z.string(), z.unknown()),
    }),
    niceGuyMetrics: niceGuyMetricsPackageSchema,
    analysisInstructions: analysisInstructionsSchema,
    resultContract: auditResultContractSchema,
    metadata: z.object({
        packageCreatedAt: z.string().datetime(),
        websiteBusinessName: z.string().max(300).nullable(),
        websiteIndustry: z.string().max(200).nullable(),
        pagesAnalyzed: z.array(z.string().max(2000)).max(100),
    }),
});

const assessmentSchema = z.object({
    priority: z.enum(AUDIT_ASSESSMENT_PRIORITIES),
    confidence: z.number().min(0).max(1),
    summary: boundedString(2000),
});

const strengthSchema = z.object({
    title: boundedString(300),
    description: boundedString(4000),
    category: z.string().max(100).optional(),
    sources: z.array(boundedString(200)).min(1).max(5),
});

const issueSchema = z.object({
    title: boundedString(300),
    description: boundedString(4000),
    severity: z.enum(AUDIT_ISSUE_SEVERITIES),
    category: boundedString(100),
    recommendation: boundedString(4000),
    sources: z.array(boundedString(200)).min(1).max(5),
});

export const HOMEPAGE_CHANGE_PRIORITIES = ["high", "medium", "low"] as const;

const homepageChangeItemSchema = z.object({
    title: boundedString(300),
    priority: z.enum(HOMEPAGE_CHANGE_PRIORITIES),
    category: boundedString(100),
    problem: boundedString(4000),
    recommendation: boundedString(4000),
    expectedImpact: boundedString(2000),
    evidence: z.array(boundedString(200)).max(5).optional(),
});

export const homepageChangesSchema = z.object({
    summary: boundedString(2000),
    priorityChanges: z.array(homepageChangeItemSchema).max(8),
});

export const cursorAuditResultSchema = z.object({
    schemaVersion: z.literal("1.1"),
    analysisRequestId: z.string().min(1).max(100),
    auditId: z.string().min(1).max(100),
    assessment: assessmentSchema,
    executiveSummary: boundedString(8000),
    strengths: z.array(strengthSchema).max(10),
    issues: z.array(issueSchema).max(20),
    limitations: z.array(boundedString(1000)).max(10),
    analyzedAt: z.string().datetime(),
    /**
     * Optional for backward compatibility with analyses completed before
     * homepageChanges existed. New Cloud Agent packages request this section.
     */
    homepageChanges: homepageChangesSchema.optional(),
    /** @deprecated AI-generated score; use Nice Guy Metrics overallScore as the official audit score. */
    deprecatedAiOverallScore: z.number().min(0).max(100).optional(),
});

export type CursorAuditPackage = z.infer<typeof cursorAuditPackageSchema>;
export type CursorAuditResult = z.infer<typeof cursorAuditResultSchema>;
export type CursorAuditAssessment = z.infer<typeof assessmentSchema>;
export type CursorAuditResultContract = z.infer<typeof auditResultContractSchema>;
export type HomepageChanges = z.infer<typeof homepageChangesSchema>;
export type HomepageChangeItem = z.infer<typeof homepageChangeItemSchema>;

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

export function formatCursorResultValidationError(error: z.ZodError): string {
    const first = error.issues[0];
    if (!first) return "Result schema validation failed.";
    const path = first.path.length > 0 ? first.path.join(".") : "root";
    return `Result schema validation failed at ${path}: ${first.message}`;
}
