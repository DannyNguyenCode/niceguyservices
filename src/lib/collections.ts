import "server-only";

function collectionName(envKey: string, fallback: string): string {
    return process.env[envKey]?.trim() || fallback;
}

/** MongoDB collection names for the Website Audit feature (see `MONGODB_DB_NAME` / `MONGODB_AUDIT_DB_NAME`). */
export const MONGODB_COLLECTIONS = {
    website: collectionName("MONGODB_COLLECTION_WEBSITE", "website_collection"),
    crawlData: collectionName("MONGODB_COLLECTION_CRAWL_DATA", "crawl_data"),
    screenshots: collectionName("MONGODB_COLLECTION_SCREENSHOTS", "screenshots"),
    googleMetrics: collectionName(
        "MONGODB_COLLECTION_GOOGLE_METRICS",
        "google_metrics",
    ),
    niceguyMetrics: collectionName(
        "MONGODB_COLLECTION_NICEGUY_METRICS",
        "niceguy_metrics",
    ),
    aiSummary: collectionName("MONGODB_COLLECTION_AI_SUMMARY", "ai_summary"),
    heroSuggestions: collectionName(
        "MONGODB_COLLECTION_HERO_SUGGESTIONS",
        "hero_suggestions",
    ),
    outreachEmail: collectionName(
        "MONGODB_COLLECTION_OUTREACH_EMAIL",
        "outreach_email",
    ),
    pdf: collectionName("MONGODB_COLLECTION_PDF", "pdf"),
    demo: collectionName("MONGODB_COLLECTION_DEMO", "demo"),
    activityLog: collectionName("MONGODB_COLLECTION_ACTIVITY_LOG", "activity_log"),
    aiMetadata: collectionName("MONGODB_COLLECTION_AI_METADATA", "ai_metadata"),
    publicReports: collectionName("MONGODB_COLLECTION_PUBLIC_REPORTS", "public_reports"),
    pdfReports: collectionName("MONGODB_COLLECTION_PDF_REPORTS", "pdf_reports"),
    outreachEmailDrafts: collectionName(
        "MONGODB_COLLECTION_OUTREACH_EMAIL_DRAFTS",
        "outreach_email_drafts",
    ),
    demoProjects: collectionName("MONGODB_COLLECTION_DEMO_PROJECTS", "demo_projects"),
    demoGenerations: collectionName(
        "MONGODB_COLLECTION_DEMO_GENERATIONS",
        "demo_generations",
    ),
    demoAssets: collectionName("MONGODB_COLLECTION_DEMO_ASSETS", "demo_assets"),
    auditRuns: collectionName("MONGODB_COLLECTION_AUDIT_RUNS", "audit_runs"),
    auditJobs: collectionName("MONGODB_COLLECTION_AUDIT_JOBS", "audit_jobs"),
    reportLookupVerifications: collectionName(
        "MONGODB_COLLECTION_REPORT_LOOKUP_VERIFICATIONS",
        "report_lookup_verifications",
    ),
    reportLookupSessions: collectionName(
        "MONGODB_COLLECTION_REPORT_LOOKUP_SESSIONS",
        "report_lookup_sessions",
    ),
    publicAuditStatusTokens: collectionName(
        "MONGODB_COLLECTION_PUBLIC_AUDIT_STATUS_TOKENS",
        "public_audit_status_tokens",
    ),
} as const;
