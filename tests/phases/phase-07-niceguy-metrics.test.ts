import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORY_WEIGHTS } from "@/src/config/niceguy-scoring";
import { calculateNiceGuyScore } from "@/src/services/niceguy-scoring/calculate-niceguy-score";
import {
    clampScore,
    mapClsPoints,
    mapPerformancePoints,
} from "@/src/services/niceguy-scoring/helpers";
import { scoreBusinessClarity } from "@/src/services/niceguy-scoring/business-clarity";
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
            socialLinks: [],
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
                    ],
                    buttons: [{ text: "Request a Quote", href: "/contact" }],
                    forms: [],
                    images: [{ src: "/logo.png", alt: "Acme Plumbing logo" }],
                    visibleText:
                        "Acme Plumbing provides emergency plumbing services across Toronto.",
                    statusCode: 200,
                },
            ],
        },
        pagespeed: {
            mobile: {
                strategy: "mobile",
                status: "complete",
                scores: { performance: 54, accessibility: 88, bestPractices: 92, seo: 90 },
                labMetrics: {
                    cumulativeLayoutShift: { value: 0.08, displayValue: "0.08" },
                },
                fieldData: { available: false },
                coreWebVitals: { assessment: "unavailable" },
            },
            desktop: {
                strategy: "desktop",
                status: "complete",
                scores: { performance: 82, accessibility: 91, bestPractices: 96, seo: 93 },
                labMetrics: {},
                fieldData: { available: false },
                coreWebVitals: { assessment: "unavailable" },
            },
        },
        ...overrides,
    };
}

describe("Phase 7 — Nice Guy deterministic metrics", () => {
    describe("scoring helpers", () => {
        it("clamps scores between 0 and 100", () => {
            assert.equal(clampScore(-5), 0);
            assert.equal(clampScore(150), 100);
            assert.equal(clampScore(72), 72);
        });

        it("maps performance metrics to point values", () => {
            assert.ok(mapPerformancePoints(95, 20) > mapPerformancePoints(40, 20));
            assert.equal(mapPerformancePoints(null, 20), 0);
        });

        it("maps CLS values to point values", () => {
            assert.ok(mapClsPoints(0.05, 10) > mapClsPoints(0.25, 10));
            assert.equal(mapClsPoints(null, 10), 0);
        });
    });

    describe("category weights", () => {
        it("sums category weights to 1.0", () => {
            const total = Object.values(CATEGORY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
            assert.equal(total, 1);
        });
    });

    describe("business clarity scoring", () => {
        it("scores strong business clarity higher than weak messaging", () => {
            const strong = scoreBusinessClarity(baseInput());
            const weak = scoreBusinessClarity(
                baseInput({
                    crawl: {
                        ...baseInput().crawl,
                        homepageTitle: "Home",
                        metaDescription: "",
                        pageResults: [
                            {
                                url: "https://acmeplumbing.example",
                                path: "/",
                                pageType: "home",
                                title: "Home",
                                metaDescription: "",
                                headings: [],
                                buttons: [],
                                forms: [],
                                images: [],
                                visibleText: "Welcome.",
                                statusCode: 200,
                            },
                        ],
                    },
                }),
            );
            assert.ok(strong.score > weak.score);
        });
    });

    describe("overall score", () => {
        it("returns a bounded overall score with category breakdown", () => {
            const result = calculateNiceGuyScore(baseInput());
            assert.ok(result.overallScore >= 0 && result.overallScore <= 100);
            assert.ok(Object.keys(result.categories).length > 0);
        });
    });
});
