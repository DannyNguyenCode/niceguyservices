/**
 * Website Audit domain types.
 * MongoDB document shapes are defined in `src/schemas/` (Zod) and persisted via Mongoose (`src/models/`).
 */

export type {
    ActivityLogActor,
    ActivityLogType,
    AuditStatus,
    CrawlStatus,
    PageSpeedStatus,
    PageSpeedStrategy,
    NiceGuyStatus,
    AiAnalysisStatus,
    DemoStatus,
    HeroSuggestionPriority,
    OutreachStatus,
    WebsiteSource,
    WebsiteStatus,
} from "@/src/schemas/enums";

export type {
    ActivityLog,
    AiMetadata,
    AiSummary,
    CrawlData,
    Demo,
    GoogleMetrics,
    HeroSuggestionItem,
    HeroSuggestions,
    NiceguyMetricCategory,
    NiceguyMetrics,
    OutreachEmail,
    Pdf,
    Screenshots,
    WebsiteCollection,
} from "@/src/schemas";

/** Serializable website with string id (app/API layer). */
export type { SerializableWebsite as PersistedWebsite } from "@/src/data/websites";

export type AuditScore = {
    id: string;
    label: string;
    value: number;
    summary: string;
};

export type AuditFinding = {
    id: string;
    title: string;
    summary: string;
    impact: "high" | "medium" | "low";
    category:
        | "performance"
        | "accessibility"
        | "messaging"
        | "trust"
        | "mobile"
        | "conversion";
};

/** Legacy public demo placeholder — not the `demo` collection schema. */
export type DemoRecord = {
    id: string;
    title: string;
    description: string;
    status: import("@/src/schemas/enums").DemoStatus;
    reportToken: string;
    demoToken: string;
    desktopPreviewLabel: string;
    mobilePreviewLabel: string;
};

/** Legacy mock report shape kept for public report/demo placeholders. */
export type WebsiteRecord = {
    id: string;
    businessName: string;
    websiteUrl: string;
    businessEmail?: string;
    industry: string;
    location: string;
    source: string;
    internalNotes?: string;
    websiteStatus: import("@/src/schemas/enums").WebsiteStatus;
    auditStatus: import("@/src/schemas/enums").AuditStatus;
    demoStatus: import("@/src/schemas/enums").DemoStatus;
    outreachStatus: import("@/src/schemas/enums").OutreachStatus;
    updatedAt: string;
    generatedAt: string;
    overallScore: number;
    googleMetrics: AuditScore[];
    niceGuyMetrics: AuditScore[];
    strengths: AuditFinding[];
    opportunities: AuditFinding[];
    screenshots: string[];
    methodology: string[];
    demo: DemoRecord;
};
