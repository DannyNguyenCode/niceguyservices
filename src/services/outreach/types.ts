export type OutreachDraftStatus = "draft" | "approved" | "rejected" | "archived";

export type OutreachTone = "friendly" | "professional" | "concise" | "consultative";
export type OutreachLength = "short" | "standard" | "detailed";
export type OutreachGoal =
    | "start-conversation"
    | "share-audit"
    | "offer-improvement"
    | "request-meeting";

export type OutreachStrategy = {
    tone: OutreachTone;
    length: OutreachLength;
    primaryGoal: OutreachGoal;
    includePublicReport: boolean;
    includePdfReference: boolean;
    includeScore: boolean;
    includePageSpeed: boolean;
    includeQuickWin: boolean;
    includeBusinessCompliment: boolean;
};

export type OutreachEvidenceType =
    | "strength"
    | "weakness"
    | "quick-win"
    | "score"
    | "pagespeed"
    | "content"
    | "technical";

export type OutreachEvidenceItem = {
    type: OutreachEvidenceType;
    sourceId: string | null;
    label: string;
    value?: string | number | null;
    sourcePath?: string | null;
};

export type SerializableOutreachEmailDraft = {
    id: string;
    websiteId: string;
    publicReportId: string;
    pdfReportId: string | null;
    aiSummaryId: string | null;
    status: OutreachDraftStatus;
    outreachVersion: string;
    promptVersion: string;
    isCurrentApproved: boolean;
    source: {
        publicReportVersion: string;
        publicReportRevision: number;
        snapshotChecksum: string;
        pdfVersion: string | null;
        pdfFilename: string | null;
    };
    recipient: {
        name: string | null;
        role: string | null;
        email: string | null;
        businessName: string | null;
    };
    strategy: OutreachStrategy;
    subject: string;
    bodyText: string;
    evidence: OutreachEvidenceItem[];
    claimWarnings: Array<{ code: string; message: string }>;
    generation: {
        provider: string;
        model: string | null;
        providerRequestId: string | null;
        generatedAt: string;
        durationMs: number | null;
        retryCount: number;
    } | null;
    editHistory: Array<{
        subject: string;
        bodyText: string;
        editedAt: string;
        editSource: "generated" | "administrator" | "regenerated";
    }>;
    approvedAt: string | null;
    rejectedAt: string | null;
    archivedAt: string | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
};

export type OutreachGenerationInput = {
    schemaVersion: typeof import("@/src/services/outreach/constants").OUTREACH_INPUT_SCHEMA_VERSION;
    business: {
        name: string;
        domain: string;
        industry: string | null;
        location: string | null;
    };
    recipient: {
        name?: string | null;
        role?: string | null;
    };
    sender: {
        name: string;
        businessName: string;
        websiteUrl: string | null;
        phone: string | null;
        signatureText: string | null;
    };
    report: {
        revision: number;
        title: string;
        generatedAt: string | null;
        publicStatus: string;
        publicUrlAvailable: boolean;
        publicUrl: string | null;
        pdfAvailable: boolean;
        pdfFilename: string | null;
    };
    audit: {
        overallScore: number | null;
        scoreLabel: string | null;
        strengths: Array<{
            id: string;
            title: string;
            description: string;
            evidenceCheckIds: string[];
        }>;
        weaknesses: Array<{
            id: string;
            title: string;
            description: string;
            priority: string;
            evidenceCheckIds: string[];
        }>;
        quickWins: Array<{
            id: string;
            title: string;
            description: string;
            expectedImpact: string | null;
            estimatedEffort: string | null;
            evidenceCheckIds: string[];
        }>;
        pageSpeed: {
            mobilePerformance: number | null;
            desktopPerformance: number | null;
            lcpMobile: number | null;
            lcpDesktop: number | null;
        } | null;
    };
    strategy: OutreachStrategy;
    constraints: {
        doNotInventFacts: true;
        doNotClaimPriorRelationship: true;
        doNotPromiseResults: true;
        doNotShameBusiness: true;
        doNotIncludeUnsupportedNumbers: true;
        requireEvidenceForCriticism: true;
    };
};

export type OutreachReadiness = {
    canGenerate: boolean;
    blockers: Array<{ code: string; message: string }>;
    warnings: Array<{ code: string; message: string }>;
    availablePdfReports: Array<{ id: string; filename: string; revision: number }>;
    supportedFindingsCount: number;
};
