import type { PublicReportSettings } from "@/src/types/public-report";

export const PUBLIC_REPORT_VERSION = "public-report-v1";

export const MAX_PUBLIC_SCREENSHOTS = 6;
export const MAX_PUBLIC_HERO_SUGGESTIONS = 3;

export const MIN_REPORT_TOKEN_LENGTH = 32;
export const MAX_REPORT_TOKEN_LENGTH = 128;

export const DEFAULT_PUBLIC_REPORT_SETTINGS: PublicReportSettings = {
    showOverallScore: true,
    showScoreConfidence: false,
    showCategoryScores: true,
    showPageSpeed: true,
    showScreenshots: true,
    showStrengths: true,
    showWeaknesses: true,
    showQuickWins: true,
    showLongTermRecommendations: true,
    showPriorityPlan: true,
    showHeroSuggestions: true,
    showTechnicalDetails: false,
    showNiceGuyBranding: true,
    showContactCta: true,
};

export const BLOCKED_SCREENSHOT_PATH_PATTERNS = [
    /\/login(?:\/|$)/i,
    /\/account(?:\/|$)/i,
    /\/admin(?:\/|$)/i,
    /\/dashboard(?:\/|$)/i,
    /\/checkout(?:\/|$)/i,
    /\/cart(?:\/|$)/i,
    /\/profile(?:\/|$)/i,
    /\/portal(?:\/|$)/i,
] as const;

export const STANDARD_PUBLIC_DISCLAIMERS = [
    "Website performance may vary by device, location, network, hosting conditions, and changes made after the audit.",
    "Recommendations are intended as practical improvement guidance and do not guarantee search rankings, leads, conversions, revenue, accessibility compliance, or legal compliance.",
] as const;

export function getPublicReportBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        ""
    ).replace(/\/$/, "");
}

export function buildPublicReportUrl(rawToken: string): string {
    const base = getPublicReportBaseUrl();
    return base ? `${base}/report/${rawToken}` : `/report/${rawToken}`;
}
