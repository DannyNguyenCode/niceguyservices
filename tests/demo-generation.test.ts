import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDemoSpec } from "@/src/services/demo/build-demo-spec";
import {
    resolvePlaceholderFields,
    resolveVerifiedFacts,
    buildDemoDesignSystem,
} from "@/src/services/demo/build-demo-design-system";
import {
    DEMO_BANNER_TEXT,
    DEMO_DISCLAIMER_TEXT,
    DEMO_SPEC_VERSION,
    DEFAULT_APPROVED_FACTS,
} from "@/src/services/demo/constants";
import { evaluateDemoReadiness } from "@/src/services/demo/get-demo-readiness";
import { mapAuditOpportunities } from "@/src/services/demo/map-audit-opportunities";
import { scanDemoSource } from "@/src/services/demo/scan-demo-source";
import { validateDemoBuild } from "@/src/services/demo/validate-demo-build";
import type { SerializableDemoProject } from "@/src/services/demo/types";
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

function sampleProject(): SerializableDemoProject {
    return {
        id: "demo-project-1",
        websiteId: "website-1",
        publicReportId: "report-1",
        aiSummaryId: "ai-1",
        status: "draft",
        deploymentState: "preview-private",
        demoGenerationVersion: "demo-generation-v1",
        demoSpecVersion: DEMO_SPEC_VERSION,
        previewTokenPrefix: "abcd1234",
        previewPath: "/demo-preview/token",
        source: {
            publicReportVersion: "public-report-v1",
            publicReportRevision: 2,
            snapshotChecksum: "checksum-abc",
            heroSuggestionIds: ["hero-1"],
            screenshotIds: ["shot-1"],
        },
        business: {
            originalBusinessName: "Acme Plumbing",
            demoBusinessName: "Acme Plumbing",
            domain: "acme.example",
            industry: "Plumbing",
            location: "Toronto",
        },
        configuration: {
            architecture: "multi-page",
            pages: ["home", "services", "contact"],
            visualDirection: "modern-professional",
            devicePriority: "mobile-first",
            includeAuditComparison: false,
            includeDemoBanner: true,
            includePlaceholderForms: true,
            includePlaceholderContactInfo: true,
            useApprovedHeroConcept: true,
            useExistingLogo: false,
            useExistingImages: false,
        },
        approvedFacts: { ...DEFAULT_APPROVED_FACTS, businessName: true, industry: true },
        contentPolicy: {
            mode: "approved-facts-with-rewritten-copy",
            disclaimerRequired: true,
            inventedClaimsForbidden: true,
        },
        selectedHeroSuggestionId: "hero-1",
        editedHeroConcept: null,
        currentGenerationId: null,
        rejectionReason: null,
        rejectionNotes: null,
        approvedAt: null,
        rejectedAt: null,
        archivedAt: null,
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:00:00.000Z",
    };
}

describe("demo readiness", () => {
    it("allows project creation when report snapshot has opportunities", () => {
        const readiness = evaluateDemoReadiness({
            report: sampleReport(),
            websiteActive: true,
            contentPolicySelected: true,
        });
        assert.equal(readiness.canCreateProject, true);
        assert.ok(readiness.availableHeroSuggestions.length > 0);
    });

    it("blocks creation when public report is missing", () => {
        const readiness = evaluateDemoReadiness({
            report: null,
            websiteActive: true,
        });
        assert.equal(readiness.canCreateProject, false);
        assert.equal(readiness.blockers[0]?.code, "REPORT_NOT_FOUND");
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

    it("does not block generation when hero suggestions are missing", () => {
        const report = sampleReport();
        report.sourceSnapshot.heroSuggestions = [];
        const readiness = evaluateDemoReadiness({
            report,
            websiteActive: true,
            contentPolicySelected: true,
        });
        assert.ok(readiness.warnings.some((item) => item.code === "NO_APPROVED_HERO"));
    });
});

describe("fact safety", () => {
    it("uses placeholders for unapproved contact information", () => {
        const placeholders = resolvePlaceholderFields(DEFAULT_APPROVED_FACTS, {
            name: "Acme Plumbing",
            phone: "555-0100",
            email: "info@acme.example",
        });
        assert.ok(placeholders.includes("phone"));
        assert.ok(placeholders.includes("email"));
    });

    it("includes only approved facts in verified facts", () => {
        const facts = resolveVerifiedFacts(
            { ...DEFAULT_APPROVED_FACTS, businessName: true, industry: true },
            { name: "Acme Plumbing", industry: "Plumbing", phone: "555-0100" },
        );
        assert.equal(facts.businessName, "Acme Plumbing");
        assert.equal(facts.industry, "Plumbing");
        assert.equal(facts.phone, undefined);
    });
});

describe("demo specification", () => {
    it("uses saved report snapshot revision and checksum", () => {
        const spec = buildDemoSpec({
            project: sampleProject(),
            report: sampleReport(),
            assets: [],
            businessFacts: {},
        });
        assert.equal(spec.schemaVersion, DEMO_SPEC_VERSION);
        assert.equal(spec.sourceReport.revision, 2);
        assert.equal(spec.sourceReport.snapshotChecksum, "checksum-abc");
        assert.equal(spec.project.pages.length, 3);
        assert.equal(spec.heroConcept?.id, "hero-1");
        assert.equal(spec.contentRules.demoDisclaimerRequired, true);
    });

    it("maps audit opportunities to demo implementations", () => {
        const opportunities = mapAuditOpportunities(sampleReport());
        assert.ok(opportunities.length > 0);
        assert.ok(opportunities.some((item) => item.demoImplementation.includes("CTA")));
    });
});

describe("source scanning and validation", () => {
    it("flags prohibited integrations", () => {
        const result = scanDemoSource({
            files: [{ path: "app/page.tsx", content: "mongoose.connect(process.env.MONGODB_URI)" }],
        });
        assert.equal(result.passed, false);
    });

    it("validates required banner, disclaimer, and routes", () => {
        const files = [
            {
                path: "components/DemoBanner.tsx",
                content: DEMO_BANNER_TEXT,
            },
            {
                path: "components/DemoDisclaimer.tsx",
                content: DEMO_DISCLAIMER_TEXT,
            },
            {
                path: "components/DemoPlaceholder.tsx",
                content: "DemoPlaceholder",
            },
            { path: "app/page.tsx", content: `${DEMO_BANNER_TEXT}\n${DEMO_DISCLAIMER_TEXT}` },
            {
                path: "app/services/page.tsx",
                content: `${DEMO_BANNER_TEXT}\n${DEMO_DISCLAIMER_TEXT}`,
            },
            {
                path: "app/contact/page.tsx",
                content: `${DEMO_BANNER_TEXT}\n${DEMO_DISCLAIMER_TEXT}`,
            },
        ];
        const validation = validateDemoBuild({
            files,
            requiredPages: ["home", "services", "contact"],
        });
        assert.equal(validation.passed, true);
    });
});

describe("design system", () => {
    it("preserves selected visual direction palette", () => {
        const system = buildDemoDesignSystem({ visualDirection: "clean-minimal" });
        assert.equal(system.palette.primary, "#111827");
        assert.equal(system.typography.scale, "moderate");
    });
});
