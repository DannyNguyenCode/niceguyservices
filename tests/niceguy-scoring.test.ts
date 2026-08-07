import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORY_WEIGHTS } from "@/src/config/niceguy-scoring";
import { calculateNiceGuyScore } from "@/src/services/niceguy-scoring/calculate-niceguy-score";
import { calculateNiceGuyScoreV1 } from "@/src/services/niceguy-scoring/calculate-niceguy-score-v1";
import { scoreBusinessClarity } from "@/src/services/niceguy-scoring/business-clarity";
import {
    clampScore,
    finalizeCategory,
    mapClsPoints,
    mapPerformancePoints,
} from "@/src/services/niceguy-scoring/helpers";
import { scoreTechnicalFoundation } from "@/src/services/niceguy-scoring/technical-foundation";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

function baseInput(overrides: Partial<NiceGuyScoringInput> = {}): NiceGuyScoringInput {
    return {
        website: {
            id: "website-1",
            businessName: "Acme Plumbing",
            industry: "Plumbing",
            location: "Toronto",
            originalUrl: "https://acmeplumbing.example",
        },
        crawl: {
            id: "crawl-1",
            requestedUrl: "https://acmeplumbing.example",
            finalUrl: "https://acmeplumbing.example",
            homepageTitle: "Acme Plumbing | Emergency Plumbing Services",
            metaDescription:
                "Acme Plumbing provides emergency plumbing, drain cleaning, and water heater repair across Toronto.",
            pagesDiscovered: 3,
            pagesCrawled: 3,
            internalLinks: ["/about", "/contact", "/services"],
            externalLinks: [],
            emailsFound: ["hello@acmeplumbing.example"],
            phoneNumbersFound: ["416-555-0100"],
            socialLinks: ["https://facebook.com/acmeplumbing"],
            hasAboutPage: true,
            hasContactPage: true,
            hasServicesPage: true,
            hasPrivacyPolicy: true,
            hasTerms: false,
            pageResults: [
                {
                    url: "https://acmeplumbing.example",
                    path: "/",
                    pageType: "home",
                    title: "Acme Plumbing | Emergency Plumbing Services",
                    metaDescription:
                        "Acme Plumbing provides emergency plumbing, drain cleaning, and water heater repair across Toronto.",
                    headings: [
                        { level: 1, text: "Emergency Plumbing Services in Toronto" },
                        { level: 2, text: "Drain Cleaning" },
                    ],
                    buttons: [{ text: "Request a Quote", href: "/contact" }],
                    forms: [],
                    images: [{ src: "/logo.png", alt: "Acme Plumbing logo" }],
                    visibleText:
                        "Acme Plumbing provides emergency plumbing services across Toronto. Call now for fast service.",
                    statusCode: 200,
                },
                {
                    url: "https://acmeplumbing.example/services",
                    path: "/services",
                    pageType: "services",
                    title: "Plumbing Services | Acme Plumbing",
                    headings: [{ level: 1, text: "Our Services" }],
                    buttons: [{ text: "Book an Appointment", href: "/contact" }],
                    forms: [],
                    images: [],
                    visibleText: "Drain cleaning, water heater repair, and emergency plumbing services.",
                    statusCode: 200,
                },
                {
                    url: "https://acmeplumbing.example/contact",
                    path: "/contact",
                    pageType: "contact",
                    title: "Contact Acme Plumbing",
                    headings: [{ level: 1, text: "Contact Us" }],
                    buttons: [],
                    forms: [
                        {
                            fields: [
                                { type: "text", label: "Name", required: true },
                                { type: "email", label: "Email", required: true },
                                { type: "tel", label: "Phone" },
                                { type: "submit", label: "Send" },
                            ],
                        },
                    ],
                    images: [],
                    visibleText: "Call 416-555-0100 or email hello@acmeplumbing.example",
                    statusCode: 200,
                },
            ],
        },
        pagespeed: {
            mobile: {
                strategy: "mobile",
                status: "complete",
                scores: {
                    performance: 54,
                    accessibility: 88,
                    bestPractices: 92,
                    seo: 90,
                },
                labMetrics: {
                    cumulativeLayoutShift: { value: 0.08, displayValue: "0.08" },
                    totalBlockingTime: { valueMs: 180, displayValue: "180 ms" },
                },
                fieldData: { available: false },
                coreWebVitals: { assessment: "unavailable" },
            },
            desktop: {
                strategy: "desktop",
                status: "complete",
                scores: {
                    performance: 82,
                    accessibility: 91,
                    bestPractices: 96,
                    seo: 93,
                },
                labMetrics: {},
                fieldData: { available: false },
                coreWebVitals: { assessment: "unavailable" },
            },
        },
        ...overrides,
    };
}

describe("Nice Guy score mechanics", () => {
    it("category weights total 1.0", () => {
        const total = Object.values(CATEGORY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
        assert.equal(total, 1);
    });

    it("clampScore keeps values between 0 and 100", () => {
        assert.equal(clampScore(-5), 0);
        assert.equal(clampScore(150), 100);
        assert.equal(clampScore(Number.NaN), 0);
    });

    it("unavailable checks reduce confidence but not awarded points", () => {
        const category = finalizeCategory([
            {
                id: "test-unavailable",
                label: "Unavailable check",
                description: "Test",
                status: "unavailable",
                weight: 20,
                pointsAwarded: 0,
                maximumPoints: 20,
                evidence: [],
                missing: ["Missing evidence"],
                recommendation: null,
                priority: null,
            },
            {
                id: "test-passed",
                label: "Passed check",
                description: "Test",
                status: "passed",
                weight: 10,
                pointsAwarded: 10,
                maximumPoints: 10,
                evidence: [],
                missing: [],
                recommendation: null,
                priority: null,
            },
        ]);

        assert.equal(category.score, 100);
        assert.equal(category.confidence, 33);
    });

    it("partial checks award partial points", () => {
        const category = finalizeCategory([
            {
                id: "test-partial",
                label: "Partial check",
                description: "Test",
                status: "partial",
                weight: 10,
                pointsAwarded: 5,
                maximumPoints: 10,
                evidence: [],
                missing: [],
                recommendation: "Improve this.",
                priority: "medium",
            },
        ]);

        assert.equal(category.score, 50);
    });
});

describe("Business clarity", () => {
    it("detects generic homepage titles", () => {
        const result = scoreBusinessClarity(
            baseInput({
                crawl: {
                    ...baseInput().crawl,
                    homepageTitle: "Home",
                    pageResults: [
                        {
                            ...baseInput().crawl.pageResults[0]!,
                            title: "Home",
                        },
                    ],
                },
            }),
        );

        const titleCheck = result.checks.find((check) => check.id === "business-title-clear");
        assert.ok(titleCheck);
        assert.notEqual(titleCheck?.status, "passed");
    });

    it("flags missing CTA as high priority", () => {
        const result = scoreBusinessClarity(
            baseInput({
                crawl: {
                    ...baseInput().crawl,
                    pageResults: [
                        {
                            ...baseInput().crawl.pageResults[0]!,
                            buttons: [],
                        },
                    ],
                },
            }),
        );

        const ctaCheck = result.checks.find((check) => check.id === "business-clear-next-step");
        assert.equal(ctaCheck?.priority, "high");
    });
});

describe("Technical foundation", () => {
    it("preserves a real PageSpeed score of zero", () => {
        const result = scoreTechnicalFoundation(
            baseInput({
                pagespeed: {
                    mobile: {
                        ...baseInput().pagespeed.mobile!,
                        scores: {
                            performance: 0,
                            accessibility: 0,
                            bestPractices: 0,
                            seo: 0,
                        },
                    },
                    desktop: baseInput().pagespeed.desktop,
                },
            }),
        );

        const mobilePerf = result.checks.find(
            (check) => check.id === "technical-mobile-performance",
        );
        assert.equal(mobilePerf?.pointsAwarded, 0);
        assert.notEqual(mobilePerf?.status, "unavailable");
    });

    it("marks missing PageSpeed as unavailable", () => {
        const result = scoreTechnicalFoundation(
            baseInput({
                pagespeed: {
                    mobile: null,
                    desktop: null,
                },
            }),
        );

        const mobilePerf = result.checks.find(
            (check) => check.id === "technical-mobile-performance",
        );
        assert.equal(mobilePerf?.status, "unavailable");
    });

    it("fails HTTP homepage", () => {
        const result = scoreTechnicalFoundation(
            baseInput({
                crawl: {
                    ...baseInput().crawl,
                    finalUrl: "http://acmeplumbing.example",
                },
            }),
        );

        const httpsCheck = result.checks.find((check) => check.id === "technical-https");
        assert.equal(httpsCheck?.status, "failed");
    });
});

describe("calculateNiceGuyScore", () => {
    it("returns seven categories and normalized overall score", () => {
        const result = calculateNiceGuyScore(baseInput());
        assert.equal(Object.keys(result.categories).length, 7);
        assert.ok(result.overallScore >= 0 && result.overallScore <= 100);
        assert.equal(result.scoringVersion, "niceguy-v2");
    });

    it("preserves v1 scoring when explicitly requested", () => {
        const result = calculateNiceGuyScoreV1(baseInput());
        assert.equal(result.scoringVersion, "niceguy-v1");
    });

    it("maps mobile performance thresholds", () => {
        assert.equal(mapPerformancePoints(92, 20), 20);
        assert.equal(mapPerformancePoints(54, 20), 9);
        assert.equal(mapClsPoints(0.08, 10), 10);
        assert.equal(mapClsPoints(0.2, 10), 5);
    });
});
