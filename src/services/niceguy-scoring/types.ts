import type { NiceGuyCategoryKey } from "@/src/config/niceguy-scoring";

export type CheckStatus = "passed" | "failed" | "partial" | "unavailable";

export type CheckPriority = "high" | "medium" | "low";

export type EvidenceType =
    | "crawl"
    | "pagespeed"
    | "page"
    | "content"
    | "contact"
    | "form"
    | "image"
    | "link"
    | "derived";

export type MetricEvidence = {
    type: EvidenceType;
    label: string;
    value?: string | number | boolean | null;
    pageUrl?: string | null;
};

export type MetricCheck = {
    id: string;
    label: string;
    description: string;
    status: CheckStatus;
    weight: number;
    pointsAwarded: number;
    maximumPoints: number;
    evidence: MetricEvidence[];
    missing: string[];
    recommendation?: string | null;
    priority?: CheckPriority | null;
};

export type CategoryRecommendation = {
    checkId: string;
    priority: CheckPriority;
    title: string;
    description: string;
};

export type CategoryScore = {
    score: number;
    maximumScore: number;
    confidence: number;
    checks: MetricCheck[];
    strengths: string[];
    issues: string[];
    recommendations: CategoryRecommendation[];
};

export type NiceGuyCategories = Record<NiceGuyCategoryKey, CategoryScore>;

export type NiceGuySummary = {
    strongestCategory?: string | null;
    weakestCategory?: string | null;
    highPriorityIssueCount: number;
    mediumPriorityIssueCount: number;
    lowPriorityIssueCount: number;
    checksPassed: number;
    checksFailed: number;
    checksUnavailable: number;
};

export type NormalizedPageResult = {
    url: string;
    path: string;
    pageType: string;
    title?: string | null;
    metaDescription?: string | null;
    headings: Array<{ level: number; text: string }>;
    buttons: Array<{ text: string; href?: string }>;
    forms: Array<{
        action?: string;
        method?: string;
        fields: Array<{
            type?: string;
            name?: string;
            label?: string;
            required?: boolean;
        }>;
    }>;
    images: Array<{ src?: string; alt?: string }>;
    visibleText?: string | null;
    statusCode?: number | null;
    loadDurationMs?: number | null;
    errorMessage?: string | null;
};

export type NormalizedPageSpeedEvidence = {
    strategy: "mobile" | "desktop";
    status: string;
    scores: {
        performance?: number | null;
        accessibility?: number | null;
        bestPractices?: number | null;
        seo?: number | null;
    };
    labMetrics: {
        firstContentfulPaint?: { valueMs?: number | null; displayValue?: string | null };
        largestContentfulPaint?: { valueMs?: number | null; displayValue?: string | null };
        totalBlockingTime?: { valueMs?: number | null; displayValue?: string | null };
        cumulativeLayoutShift?: { value?: number | null; displayValue?: string | null };
        speedIndex?: { valueMs?: number | null; displayValue?: string | null };
        interactive?: { valueMs?: number | null; displayValue?: string | null };
        timeToFirstByte?: { valueMs?: number | null; displayValue?: string | null };
    };
    fieldData: {
        available: boolean;
        overallCategory?: string | null;
        originFallback?: boolean;
    };
    coreWebVitals: {
        assessment?: "passed" | "failed" | "unavailable";
        largestContentfulPaint?: { value?: number | null; rating?: string | null };
        interactionToNextPaint?: { value?: number | null; rating?: string | null };
        cumulativeLayoutShift?: { value?: number | null; rating?: string | null };
    };
};

export type NiceGuyScoringInput = {
    website: {
        id: string;
        businessName?: string | null;
        industry?: string | null;
        location?: string | null;
        originalUrl: string;
    };
    crawl: {
        id: string;
        requestedUrl: string;
        finalUrl?: string | null;
        homepageTitle?: string | null;
        metaDescription?: string | null;
        pagesDiscovered: number;
        pagesCrawled: number;
        internalLinks: string[];
        externalLinks: string[];
        emailsFound: string[];
        phoneNumbersFound: string[];
        socialLinks: string[];
        hasAboutPage: boolean;
        hasContactPage: boolean;
        hasServicesPage: boolean;
        hasPrivacyPolicy: boolean;
        hasTerms: boolean;
        pageResults: NormalizedPageResult[];
    };
    pagespeed: {
        mobile?: NormalizedPageSpeedEvidence | null;
        desktop?: NormalizedPageSpeedEvidence | null;
    };
};

export type NiceGuyScoreResult = {
    scoringVersion: string;
    overallScore: number;
    categories: NiceGuyCategories;
    summary: NiceGuySummary;
};
