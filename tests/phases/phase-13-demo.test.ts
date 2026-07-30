import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateDemoReadiness } from "@/src/services/demo/get-demo-readiness";
import { scanDemoSource } from "@/src/services/demo/scan-demo-source";
import { validateDemoBuild } from "@/src/services/demo/validate-demo-build";
import { DEMO_BANNER_TEXT, DEMO_DISCLAIMER_TEXT } from "@/src/services/demo/constants";
import type { SerializablePublicReport } from "@/src/types/public-report";

function sampleReport(): SerializablePublicReport {
    return {
        id: "report-1",
        websiteId: "website-1",
        crawlId: "crawl-1",
        niceGuyMetricId: "niceguy-1",
        aiSummaryId: "ai-1",
        auditRunId: null,
        sourceAuditRunId: null,
        sourceAuditNumber: null,
        heroSuggestionIds: ["hero-1"],
        status: "draft",
        reportVersion: "public-report-v1",
        revisionNumber: 2,
        tokenHash: null,
        tokenPrefix: null,
        publicPath: null,
        title: "Website Audit",
        subtitle: null,
        settings: {
            showOverallScore: true,
            showScoreConfidence: true,
            showCategoryScores: true,
            showPageSpeed: true,
            showScreenshots: true,
            showStrengths: true,
            showWeaknesses: true,
            showQuickWins: true,
            showLongTermRecommendations: true,
            showPriorityPlan: true,
            showHeroSuggestions: true,
            showTechnicalDetails: true,
            showNiceGuyBranding: true,
            showContactCta: true,
        },
        branding: {
            businessName: "Acme Plumbing",
            websiteUrl: "https://acme.example",
            normalizedDomain: "acme.example",
            industry: "Plumbing",
            location: "Toronto",
            reportPreparedBy: "Nice Guy Web Design",
            reportPreparedByUrl: null,
            logoUrl: null,
            accentStyle: null,
        },
        sourceSnapshot: {
            crawl: {
                id: "crawl-1",
                status: "complete",
                completedAt: "2026-07-28T00:00:00.000Z",
                pageCount: 3,
                successfulPageCount: 3,
                failedPageCount: 0,
                version: "crawl-v1",
            },
            pageSpeed: {
                mobileAvailable: true,
                desktopAvailable: true,
                mobile: null,
                desktop: null,
            },
            niceGuy: {
                id: "niceguy-1",
                scoringVersion: "niceguy-v1",
                overallScore: 62,
                overallConfidence: 0.8,
                scoreLabel: "Needs improvement",
                strongestCategory: { id: "nav", name: "Navigation", score: 80 },
                weakestCategory: { id: "cta", name: "Conversion", score: 40 },
                categories: [
                    {
                        id: "nav",
                        name: "Navigation",
                        score: 80,
                        confidence: 0.8,
                        scoreLabel: "Good",
                        passedChecks: 4,
                        partialChecks: 1,
                        failedChecks: 0,
                        unavailableChecks: 0,
                    },
                    {
                        id: "cta",
                        name: "Conversion",
                        score: 40,
                        confidence: 0.7,
                        scoreLabel: "Weak",
                        passedChecks: 1,
                        partialChecks: 1,
                        failedChecks: 3,
                        unavailableChecks: 0,
                    },
                ],
                deterministicRecommendations: [
                    {
                        checkId: "conversion-primary-cta",
                        categoryId: "cta",
                        categoryName: "Conversion Readiness",
                        priority: "high",
                        title: "Primary CTA lacks emphasis",
                        description: "The main call to action is hard to notice.",
                    },
                ],
            },
            ai: {
                id: "ai-1",
                analysisVersion: "ai-v1",
                promptVersion: "audit-analysis-v1",
                executiveSummary: "The site needs clearer conversion paths.",
                businessImpactSummary: "Visitors may leave without contacting the business.",
                strengths: [],
                weaknesses: [
                    {
                        title: "Homepage CTA is subtle",
                        description: "The contact action is not prominent.",
                        category: "Conversion",
                        priority: "high",
                        evidenceLabels: ["conversion-primary-cta"],
                    },
                ],
                quickWins: [
                    {
                        title: "Strengthen homepage CTA",
                        description: "Make the next step more visible.",
                        expectedImpact: "high",
                        relativeEffort: "low",
                        category: "Conversion",
                        evidenceLabels: ["conversion-primary-cta"],
                    },
                ],
                longTermRecommendations: [],
                priorityOrder: [],
                disclaimers: [],
            },
            screenshots: [
                {
                    screenshotId: "shot-1",
                    pageType: "home",
                    pageUrl: "https://acme.example",
                    viewport: "desktop-viewport",
                    width: 1440,
                    height: 900,
                    secureUrl: "https://res.cloudinary.com/demo/image/upload/v1/home.png",
                    thumbnailUrl: null,
                    altText: "Homepage screenshot",
                    capturedAt: "2026-07-28T00:00:00.000Z",
                },
            ],
            heroSuggestions: [
                {
                    suggestionId: "hero-1",
                    optionNumber: 1,
                    conceptName: "Clear action hero",
                    headline: "Reliable plumbing when you need it",
                    supportingCopy: "Request service with a clearer next step.",
                    primaryCta: { label: "Request a quote", hrefSuggestion: "/contact" },
                    secondaryCta: { label: "View services", hrefSuggestion: "/services" },
                    trustSupport: null,
                    designDirection: {
                        layout: "split",
                        hierarchy: "headline-first",
                        imagery: "service-focused",
                        mobileBehavior: "stacked",
                        accessibilityNotes: [],
                    },
                    rationale: "Improves conversion clarity.",
                    problemsAddressed: [
                        {
                            checkId: "conversion-primary-cta",
                            category: "Conversion",
                            explanation: "Addresses weak CTA emphasis.",
                        },
                    ],
                    constraints: [],
                },
            ],
        },
        publishedAt: null,
        unpublishedAt: null,
        archivedAt: null,
        expiresAt: null,
        viewCount: 0,
        uniqueViewEstimate: 0,
        lastViewedAt: null,
        createdBy: null,
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:00:00.000Z",
    };
}

describe("Phase 13 — Redesign demo", () => {
    describe("readiness checks", () => {
        it("blocks creation when public report is missing", () => {
            const readiness = evaluateDemoReadiness({
                report: null,
                websiteActive: true,
            });
            assert.equal(readiness.canCreateProject, false);
            assert.equal(readiness.blockers[0]?.code, "REPORT_NOT_FOUND");
        });

        it("allows project creation when report snapshot has opportunities", () => {
            const readiness = evaluateDemoReadiness({
                report: sampleReport(),
                websiteActive: true,
                contentPolicySelected: true,
            });
            assert.equal(readiness.canCreateProject, true);
        });

        it("blocks generation when no pages are selected", () => {
            const readiness = evaluateDemoReadiness({
                report: sampleReport(),
                websiteActive: true,
                selectedPages: [],
                contentPolicySelected: true,
            });
            assert.equal(readiness.canGenerate, false);
            assert.ok(readiness.blockers.some((item) => item.code === "NO_PAGES_SELECTED"));
        });
    });

    describe("source scanning", () => {
        it("flags prohibited integrations", () => {
            const result = scanDemoSource({
                files: [{ path: "app/page.tsx", content: "mongoose.connect(process.env.MONGODB_URI)" }],
            });
            assert.equal(result.passed, false);
        });
    });

    describe("demo build validation", () => {
        it("validates required banner, disclaimer, and routes", () => {
            const files = [
                { path: "components/DemoBanner.tsx", content: DEMO_BANNER_TEXT },
                { path: "components/DemoDisclaimer.tsx", content: DEMO_DISCLAIMER_TEXT },
                { path: "components/DemoPlaceholder.tsx", content: "DemoPlaceholder" },
                { path: "app/page.tsx", content: `${DEMO_BANNER_TEXT}\n${DEMO_DISCLAIMER_TEXT}` },
                { path: "app/services/page.tsx", content: `${DEMO_BANNER_TEXT}\n${DEMO_DISCLAIMER_TEXT}` },
                { path: "app/contact/page.tsx", content: `${DEMO_BANNER_TEXT}\n${DEMO_DISCLAIMER_TEXT}` },
            ];
            const validation = validateDemoBuild({
                files,
                requiredPages: ["home", "services", "contact"],
            });
            assert.equal(validation.passed, true);
        });
    });
});
