import { z } from "zod";

export const WEBSITE_SOURCES = [
    "manual-prospect-research",
    "public-audit-submission",
    "referral",
    "existing-client",
    "other",
] as const;

export const WEBSITE_STATUSES = ["new", "ready", "archived"] as const;

export const AUDIT_STATUSES = [
    "not-started",
    "queued",
    "processing",
    "complete",
    "failed",
] as const;

export const CRAWL_STATUSES = [
    "not-started",
    "queued",
    "processing",
    "complete",
    "failed",
] as const;

export const PAGE_TYPES = [
    "home",
    "about",
    "contact",
    "services",
    "service-detail",
    "other",
] as const;

export const SCREENSHOT_TYPES = [
    "desktop-viewport",
    "desktop-full",
    "mobile-viewport",
    "mobile-full",
] as const;

export const SCREENSHOT_STORAGE_TYPES = [
    "local",
    "cloudinary",
    "vercel-blob",
] as const;

export const SCREENSHOT_STATUSES = ["pending", "complete", "failed"] as const;

export const PAGESPEED_STATUSES = [
    "not-started",
    "queued",
    "processing",
    "complete",
    "partial",
    "failed",
] as const;

export const GOOGLE_METRIC_STATUSES = [
    "queued",
    "processing",
    "complete",
    "failed",
] as const;

export const PAGESPEED_STRATEGIES = ["mobile", "desktop"] as const;

export const NICEGUY_STATUSES = [
    "not-started",
    "queued",
    "processing",
    "complete",
    "failed",
] as const;

export const NICEGUY_METRIC_STATUSES = [
    "queued",
    "processing",
    "complete",
    "failed",
] as const;

export const AI_ANALYSIS_STATUSES = [
    "not-started",
    "queued",
    "processing",
    "complete",
    "partial",
    "failed",
] as const;

export const AI_SUMMARY_STATUSES = [
    "queued",
    "processing",
    "complete",
    "failed",
] as const;

export const HERO_SUGGESTION_STATUSES = [
    "draft",
    "selected",
    "rejected",
    "implemented",
] as const;

export const AI_METADATA_RELATED_TYPES = ["ai-summary", "hero-suggestions"] as const;

export const DEMO_STATUSES = [
    "none",
    "planned",
    "in-progress",
    "published",
] as const;

export const OUTREACH_STATUSES = [
    "not-contacted",
    "draft-ready",
    "sent",
    "replied",
    "interested",
    "do-not-contact",
] as const;

export const HERO_SUGGESTION_PRIORITIES = ["low", "medium", "high"] as const;

export const PUBLIC_REPORT_WEBSITE_STATUSES = [
    "not-created",
    "draft",
    "published",
    "unpublished",
] as const;

export const ACTIVITY_LOG_TYPES = [
    "website-created",
    "website-updated",
    "website-archived",
    "website-restored",
    "website-deleted",
    "crawl-queued",
    "crawl-started",
    "crawl-page-completed",
    "crawl-completed",
    "crawl-failed",
    "crawl-cancelled",
    "crawl-partial",
    "screenshot-created",
    "screenshot-failed",
    "screenshot-capture-started",
    "screenshot-captured",
    "screenshot-capture-completed",
    "screenshot-capture-failed",
    "screenshot-deleted",
    "pagespeed-queued",
    "pagespeed-started",
    "pagespeed-mobile-completed",
    "pagespeed-desktop-completed",
    "pagespeed-mobile-failed",
    "pagespeed-desktop-failed",
    "pagespeed-completed",
    "pagespeed-partial",
    "pagespeed-failed",
    "niceguy-queued",
    "niceguy-started",
    "niceguy-completed",
    "niceguy-failed",
    "ai-analysis-queued",
    "ai-analysis-started",
    "ai-summary-completed",
    "ai-summary-failed",
    "hero-suggestions-completed",
    "hero-suggestions-failed",
    "ai-analysis-completed",
    "ai-analysis-partial",
    "ai-analysis-failed",
    "hero-suggestion-selected",
    "hero-suggestion-rejected",
    "hero-suggestion-restored",
    "ai-analysis-generated",
    "public-report-created",
    "public-report-updated",
    "public-report-published",
    "public-report-unpublished",
    "public-report-revised",
    "public-report-archived",
    "public-report-token-rotated",
    "public-report-viewed",
    "pdf-report-queued",
    "pdf-report-started",
    "pdf-report-completed",
    "pdf-report-failed",
    "pdf-report-downloaded",
    "pdf-report-deleted",
    "pdf-generated",
    "outreach-draft-started",
    "outreach-draft-generated",
    "outreach-draft-failed",
    "outreach-draft-edited",
    "outreach-draft-approved",
    "outreach-draft-rejected",
    "outreach-draft-archived",
    "outreach-draft-copied",
    "demo-project-created",
    "demo-project-updated",
    "demo-generation-queued",
    "demo-generation-started",
    "demo-generation-completed",
    "demo-generation-failed",
    "demo-generation-cancelled",
    "demo-preview-opened",
    "demo-approved",
    "demo-rejected",
    "demo-archived",
    "demo-asset-approved",
    "demo-asset-rejected",
    "administrator-note-added",
    "administrator-note-updated",
    "administrator-note-archived",
    "administrator-action-failed",
    "email-generated",
    "email-sent",
    "demo-published",
    "audit-run-created",
    "audit-run-started",
    "audit-run-completed",
    "audit-run-partial",
    "audit-run-failed",
    "audit-run-cancelled",
    "audit-run-finalized",
    "audit-run-archived",
    "audit-run-restored",
    "audit-comparison-opened",
    "audit-history-migrated",
    "rate-limit-triggered",
    "provider-rate-limit-triggered",
    "global-budget-warning",
    "global-budget-exhausted",
] as const;

export const ACTIVITY_LOG_ACTORS = ["system", "admin"] as const;

export type WebsiteSource = (typeof WEBSITE_SOURCES)[number];
export type WebsiteStatus = (typeof WEBSITE_STATUSES)[number];
export type AuditStatus = (typeof AUDIT_STATUSES)[number];
export type CrawlStatus = (typeof CRAWL_STATUSES)[number];
export type PageType = (typeof PAGE_TYPES)[number];
export type ScreenshotType = (typeof SCREENSHOT_TYPES)[number];
export type ScreenshotStorageType = (typeof SCREENSHOT_STORAGE_TYPES)[number];
export type ScreenshotStatus = (typeof SCREENSHOT_STATUSES)[number];
export type PageSpeedStatus = (typeof PAGESPEED_STATUSES)[number];
export type GoogleMetricStatus = (typeof GOOGLE_METRIC_STATUSES)[number];
export type PageSpeedStrategy = (typeof PAGESPEED_STRATEGIES)[number];
export type NiceGuyStatus = (typeof NICEGUY_STATUSES)[number];
export type NiceGuyMetricStatus = (typeof NICEGUY_METRIC_STATUSES)[number];
export type AiAnalysisStatus = (typeof AI_ANALYSIS_STATUSES)[number];
export type AiSummaryStatus = (typeof AI_SUMMARY_STATUSES)[number];
export type HeroSuggestionStatus = (typeof HERO_SUGGESTION_STATUSES)[number];
export type AiMetadataRelatedType = (typeof AI_METADATA_RELATED_TYPES)[number];
export type DemoStatus = (typeof DEMO_STATUSES)[number];
export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];
export type HeroSuggestionPriority = (typeof HERO_SUGGESTION_PRIORITIES)[number];
export type ActivityLogType = (typeof ACTIVITY_LOG_TYPES)[number];
export type ActivityLogActor = (typeof ACTIVITY_LOG_ACTORS)[number];

export const websiteSourceSchema = z.enum(WEBSITE_SOURCES);
export const websiteStatusSchema = z.enum(WEBSITE_STATUSES);
export const auditStatusSchema = z.enum(AUDIT_STATUSES);
export const crawlStatusSchema = z.enum(CRAWL_STATUSES);
export const pageTypeSchema = z.enum(PAGE_TYPES);
export const screenshotTypeSchema = z.enum(SCREENSHOT_TYPES);
export const screenshotStorageTypeSchema = z.enum(SCREENSHOT_STORAGE_TYPES);
export const screenshotStatusSchema = z.enum(SCREENSHOT_STATUSES);
export const pageSpeedStatusSchema = z.enum(PAGESPEED_STATUSES);
export const googleMetricStatusSchema = z.enum(GOOGLE_METRIC_STATUSES);
export const pageSpeedStrategySchema = z.enum(PAGESPEED_STRATEGIES);
export const niceGuyStatusSchema = z.enum(NICEGUY_STATUSES);
export const niceGuyMetricStatusSchema = z.enum(NICEGUY_METRIC_STATUSES);
export const aiAnalysisStatusSchema = z.enum(AI_ANALYSIS_STATUSES);
export const aiSummaryStatusSchema = z.enum(AI_SUMMARY_STATUSES);
export const heroSuggestionStatusSchema = z.enum(HERO_SUGGESTION_STATUSES);
export const aiMetadataRelatedTypeSchema = z.enum(AI_METADATA_RELATED_TYPES);
export const demoStatusSchema = z.enum(DEMO_STATUSES);
export const outreachStatusSchema = z.enum(OUTREACH_STATUSES);
export const heroSuggestionPrioritySchema = z.enum(HERO_SUGGESTION_PRIORITIES);
export const activityLogTypeSchema = z.enum(ACTIVITY_LOG_TYPES);
export const activityLogActorSchema = z.enum(ACTIVITY_LOG_ACTORS);

export const WEBSITE_SOURCE_LABELS: Record<(typeof WEBSITE_SOURCES)[number], string> = {
    "manual-prospect-research": "Manual prospect research",
    "public-audit-submission": "Public audit submission",
    referral: "Referral",
    "existing-client": "Existing client",
    other: "Other",
};

export const ACTIVITY_LOG_TYPE_LABELS: Record<(typeof ACTIVITY_LOG_TYPES)[number], string> = {
    "website-created": "Website created",
    "website-updated": "Website updated",
    "website-archived": "Website archived",
    "website-restored": "Website restored",
    "website-deleted": "Website deleted",
    "crawl-queued": "Crawl queued",
    "crawl-started": "Crawl started",
    "crawl-page-completed": "Crawl page completed",
    "crawl-completed": "Crawl completed",
    "crawl-failed": "Crawl failed",
    "crawl-cancelled": "Crawl cancelled",
    "crawl-partial": "Crawl partially completed",
    "screenshot-created": "Screenshot created",
    "screenshot-failed": "Screenshot failed",
    "screenshot-capture-started": "Screenshot capture started",
    "screenshot-captured": "Screenshot captured",
    "screenshot-capture-completed": "Screenshot capture completed",
    "screenshot-capture-failed": "Screenshot capture failed",
    "screenshot-deleted": "Screenshot deleted",
    "pagespeed-queued": "PageSpeed queued",
    "pagespeed-started": "PageSpeed started",
    "pagespeed-mobile-completed": "PageSpeed mobile completed",
    "pagespeed-desktop-completed": "PageSpeed desktop completed",
    "pagespeed-mobile-failed": "PageSpeed mobile failed",
    "pagespeed-desktop-failed": "PageSpeed desktop failed",
    "pagespeed-completed": "PageSpeed completed",
    "pagespeed-partial": "PageSpeed partial",
    "pagespeed-failed": "PageSpeed failed",
    "niceguy-queued": "Nice Guy scoring queued",
    "niceguy-started": "Nice Guy scoring started",
    "niceguy-completed": "Nice Guy scoring completed",
    "niceguy-failed": "Nice Guy scoring failed",
    "ai-analysis-queued": "AI analysis queued",
    "ai-analysis-started": "AI analysis started",
    "ai-summary-completed": "AI summary completed",
    "ai-summary-failed": "AI summary failed",
    "hero-suggestions-completed": "Hero suggestions completed",
    "hero-suggestions-failed": "Hero suggestions failed",
    "ai-analysis-completed": "AI analysis completed",
    "ai-analysis-partial": "AI analysis partially completed",
    "ai-analysis-failed": "AI analysis failed",
    "hero-suggestion-selected": "Hero suggestion selected",
    "hero-suggestion-rejected": "Hero suggestion rejected",
    "hero-suggestion-restored": "Hero suggestion restored to draft",
    "ai-analysis-generated": "AI analysis generated",
    "public-report-created": "Public report created",
    "public-report-updated": "Public report updated",
    "public-report-published": "Public report published",
    "public-report-unpublished": "Public report unpublished",
    "public-report-revised": "Public report revised",
    "public-report-archived": "Public report archived",
    "public-report-token-rotated": "Public report token rotated",
    "public-report-viewed": "Public report viewed",
    "pdf-report-queued": "PDF report queued",
    "pdf-report-started": "PDF report started",
    "pdf-report-completed": "PDF report completed",
    "pdf-report-failed": "PDF report failed",
    "pdf-report-downloaded": "PDF report downloaded",
    "pdf-report-deleted": "PDF report deleted",
    "pdf-generated": "PDF generated",
    "outreach-draft-started": "Outreach draft started",
    "outreach-draft-generated": "Outreach draft generated",
    "outreach-draft-failed": "Outreach draft failed",
    "outreach-draft-edited": "Outreach draft edited",
    "outreach-draft-approved": "Outreach draft approved",
    "outreach-draft-rejected": "Outreach draft rejected",
    "outreach-draft-archived": "Outreach draft archived",
    "outreach-draft-copied": "Outreach draft copied",
    "demo-project-created": "Demo project created",
    "demo-project-updated": "Demo project updated",
    "demo-generation-queued": "Demo generation queued",
    "demo-generation-started": "Demo generation started",
    "demo-generation-completed": "Demo generation completed",
    "demo-generation-failed": "Demo generation failed",
    "demo-generation-cancelled": "Demo generation cancelled",
    "demo-preview-opened": "Demo preview opened",
    "demo-approved": "Demo approved",
    "demo-rejected": "Demo rejected",
    "demo-archived": "Demo archived",
    "demo-asset-approved": "Demo asset approved",
    "demo-asset-rejected": "Demo asset rejected",
    "administrator-note-added": "Administrator note added",
    "administrator-note-updated": "Administrator note updated",
    "administrator-note-archived": "Administrator note archived",
    "administrator-action-failed": "Administrator action failed",
    "email-generated": "Email generated",
    "email-sent": "Email sent",
    "demo-published": "Demo published",
    "audit-run-created": "Audit run created",
    "audit-run-started": "Audit run started",
    "audit-run-completed": "Audit run completed",
    "audit-run-partial": "Audit run partially completed",
    "audit-run-failed": "Audit run failed",
    "audit-run-cancelled": "Audit run cancelled",
    "audit-run-finalized": "Audit run finalized",
    "audit-run-archived": "Audit run archived",
    "audit-run-restored": "Audit run restored",
    "audit-comparison-opened": "Audit comparison opened",
    "audit-history-migrated": "Audit history migrated",
    "rate-limit-triggered": "Rate limit triggered",
    "provider-rate-limit-triggered": "Provider rate limit triggered",
    "global-budget-warning": "Global provider budget warning",
    "global-budget-exhausted": "Global provider budget exhausted",
};
