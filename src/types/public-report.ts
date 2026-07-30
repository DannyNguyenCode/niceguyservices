export type PublicReportStatus = "draft" | "published" | "unpublished" | "archived";

export type PublicReportSettings = {
    showOverallScore: boolean;
    showScoreConfidence: boolean;
    showCategoryScores: boolean;
    showPageSpeed: boolean;
    showScreenshots: boolean;
    showStrengths: boolean;
    showWeaknesses: boolean;
    showQuickWins: boolean;
    showLongTermRecommendations: boolean;
    showPriorityPlan: boolean;
    showHeroSuggestions: boolean;
    showTechnicalDetails: boolean;
    showNiceGuyBranding: boolean;
    showContactCta: boolean;
};

export type PublicReportBranding = {
    businessName: string | null;
    websiteUrl: string;
    normalizedDomain: string | null;
    industry: string | null;
    location: string | null;
    reportPreparedBy: string;
    reportPreparedByUrl: string | null;
    logoUrl: string | null;
    accentStyle: string | null;
};

export type PublicReportSourceSnapshot = {
    crawl: {
        id: string;
        status: string;
        completedAt: string | null;
        pageCount: number;
        successfulPageCount: number;
        failedPageCount: number;
        version: string | null;
    };
    pageSpeed: {
        mobileAvailable: boolean;
        desktopAvailable: boolean;
        mobile: {
            performance: number | null;
            accessibility: number | null;
            bestPractices: number | null;
            seo: number | null;
            lcp: number | null;
            cls: number | null;
            tbt: number | null;
            fetchTime: string | null;
            lighthouseVersion: string | null;
        } | null;
        desktop: {
            performance: number | null;
            accessibility: number | null;
            bestPractices: number | null;
            seo: number | null;
            lcp: number | null;
            cls: number | null;
            tbt: number | null;
            fetchTime: string | null;
            lighthouseVersion: string | null;
        } | null;
    };
    niceGuy: {
        id: string;
        scoringVersion: string;
        overallScore: number;
        overallConfidence: number;
        scoreLabel: string;
        strongestCategory: {
            id: string;
            name: string;
            score: number;
        } | null;
        weakestCategory: {
            id: string;
            name: string;
            score: number;
        } | null;
        categories: Array<{
            id: string;
            name: string;
            score: number;
            confidence: number;
            scoreLabel: string;
            passedChecks: number;
            partialChecks: number;
            failedChecks: number;
            unavailableChecks: number;
        }>;
        deterministicRecommendations: Array<{
            checkId: string;
            categoryId: string;
            categoryName: string;
            priority: "high" | "medium" | "low";
            title: string;
            description: string;
        }>;
    };
    ai: {
        id: string;
        analysisVersion: string;
        promptVersion: string;
        executiveSummary: string;
        businessImpactSummary: string;
        strengths: Array<{
            title: string;
            description: string;
            category: string | null;
            evidenceLabels: string[];
        }>;
        weaknesses: Array<{
            title: string;
            description: string;
            category: string | null;
            priority: "high" | "medium" | "low";
            evidenceLabels: string[];
        }>;
        quickWins: Array<{
            title: string;
            description: string;
            expectedImpact: "high" | "medium" | "low";
            relativeEffort: "low" | "medium" | "high";
            category: string | null;
            evidenceLabels: string[];
        }>;
        longTermRecommendations: Array<{
            title: string;
            description: string;
            priority: "high" | "medium" | "low";
            relativeEffort: "low" | "medium" | "high";
            category: string | null;
            evidenceLabels: string[];
        }>;
        priorityOrder: Array<{
            rank: number;
            title: string;
            reason: string;
            priority: "high" | "medium" | "low";
            evidenceLabels: string[];
        }>;
        disclaimers: string[];
    };
    screenshots: Array<{
        screenshotId: string;
        pageType: string;
        pageUrl: string;
        viewport: string;
        width: number | null;
        height: number | null;
        secureUrl: string;
        thumbnailUrl: string | null;
        altText: string;
        capturedAt: string | null;
    }>;
    heroSuggestions: Array<{
        suggestionId: string;
        optionNumber: number;
        conceptName: string;
        headline: string;
        supportingCopy: string;
        primaryCta: {
            label: string;
            hrefSuggestion: string | null;
        };
        secondaryCta: {
            label: string;
            hrefSuggestion: string | null;
        } | null;
        trustSupport: string | null;
        designDirection: {
            layout: string;
            hierarchy: string;
            imagery: string;
            mobileBehavior: string;
            accessibilityNotes: string[];
        };
        rationale: string;
        problemsAddressed: Array<{
            checkId: string;
            category: string;
            explanation: string;
        }>;
        constraints: string[];
    }>;
};

export type SerializablePublicReport = {
    id: string;
    websiteId: string;
    crawlId: string;
    niceGuyMetricId: string;
    aiSummaryId: string;
    auditRunId: string | null;
    sourceAuditRunId: string | null;
    sourceAuditNumber: number | null;
    heroSuggestionIds: string[];
    status: PublicReportStatus;
    reportVersion: string;
    revisionNumber: number;
    tokenHash: string | null;
    tokenPrefix: string | null;
    publicPath: string | null;
    title: string;
    subtitle: string | null;
    settings: PublicReportSettings;
    branding: PublicReportBranding;
    sourceSnapshot: PublicReportSourceSnapshot;
    publishedAt: string | null;
    unpublishedAt: string | null;
    archivedAt: string | null;
    expiresAt: string | null;
    viewCount: number;
    uniqueViewEstimate: number;
    lastViewedAt: string | null;
    createdBy: string | null;
    createdAt: string;
    updatedAt: string;
};

export type PublicReportViewModel = {
    report: SerializablePublicReport;
    mode: "preview" | "public";
};
