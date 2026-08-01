export type AuditSectionGroup = "summary" | "results" | "outputs" | "history" | "administration";

export type AuditSectionDefinition = {
    id: string;
    label: string;
    group: AuditSectionGroup;
    headingId: string;
};

export const AUDIT_SECTION_SCROLL_MARGIN = "scroll-mt-24";

export const AUDIT_SECTIONS = {
    summary: {
        id: "audit-summary",
        label: "Summary",
        group: "summary",
        headingId: "audit-summary-heading",
    },
    overview: {
        id: "overview",
        label: "Overview",
        group: "summary",
        headingId: "overview-heading",
    },
    crawl: {
        id: "crawl",
        label: "Crawl",
        group: "results",
        headingId: "crawl-heading",
    },
    screenshots: {
        id: "screenshots",
        label: "Screenshots",
        group: "results",
        headingId: "screenshots-heading",
    },
    pagespeed: {
        id: "pagespeed",
        label: "PageSpeed",
        group: "results",
        headingId: "pagespeed-heading",
    },
    metrics: {
        id: "metrics",
        label: "Nice Guy",
        group: "results",
        headingId: "metrics-heading",
    },
    ai: {
        id: "ai",
        label: "AI analysis",
        group: "results",
        headingId: "ai-heading",
    },
    outputs: {
        id: "audit-outputs",
        label: "Outputs",
        group: "outputs",
        headingId: "audit-outputs-heading",
    },
    publicReports: {
        id: "public-reports",
        label: "Report drafts",
        group: "outputs",
        headingId: "public-reports-heading",
    },
    pdfReports: {
        id: "pdf-reports",
        label: "PDF reports",
        group: "outputs",
        headingId: "pdf-reports-heading",
    },
    outreachEmail: {
        id: "outreach-email",
        label: "Outreach drafts",
        group: "outputs",
        headingId: "outreach-email-heading",
    },
    demoWebsite: {
        id: "demo-website",
        label: "Demo website",
        group: "outputs",
        headingId: "demo-website-heading",
    },
    auditRuns: {
        id: "audit-runs",
        label: "Audit runs",
        group: "history",
        headingId: "audit-runs-heading",
    },
    activity: {
        id: "activity",
        label: "Activity",
        group: "history",
        headingId: "activity-heading",
    },
    stageLog: {
        id: "stage-execution-log",
        label: "Stage execution log",
        group: "administration",
        headingId: "stage-execution-log-heading",
    },
    administration: {
        id: "audit-administration",
        label: "Administration",
        group: "administration",
        headingId: "audit-administration-heading",
    },
} as const satisfies Record<string, AuditSectionDefinition>;

export type AuditSectionKey = keyof typeof AUDIT_SECTIONS;

export const AUDIT_NAV_SECTIONS: AuditSectionDefinition[] = [
    AUDIT_SECTIONS.summary,
    AUDIT_SECTIONS.crawl,
    AUDIT_SECTIONS.screenshots,
    AUDIT_SECTIONS.pagespeed,
    AUDIT_SECTIONS.metrics,
    AUDIT_SECTIONS.ai,
    AUDIT_SECTIONS.outputs,
    AUDIT_SECTIONS.auditRuns,
    AUDIT_SECTIONS.activity,
    AUDIT_SECTIONS.stageLog,
];

export const AUDIT_AREA_TABS: Array<{
    id: AuditSectionGroup;
    label: string;
    sectionId: string;
}> = [
    { id: "summary", label: "Summary", sectionId: AUDIT_SECTIONS.summary.id },
    { id: "results", label: "Results", sectionId: AUDIT_SECTIONS.crawl.id },
    { id: "outputs", label: "Outputs", sectionId: AUDIT_SECTIONS.outputs.id },
    { id: "history", label: "History", sectionId: AUDIT_SECTIONS.auditRuns.id },
    { id: "administration", label: "Admin", sectionId: AUDIT_SECTIONS.administration.id },
];

export function getAuditSectionById(sectionId: string): AuditSectionDefinition | undefined {
    return Object.values(AUDIT_SECTIONS).find((section) => section.id === sectionId);
}

export function isValidAuditSectionId(sectionId: string): boolean {
    return Boolean(getAuditSectionById(sectionId));
}
