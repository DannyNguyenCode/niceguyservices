import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CATEGORY_WEIGHTS_V2 } from "@/src/config/niceguy-scoring-v2";
import { calculateNiceGuyScoreV2 } from "@/src/services/niceguy-scoring/calculate-niceguy-score-v2";
import { finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    clsPoints,
    cruxCompositeStatus,
    lighthouseScoreStatus,
    tbtPoints,
} from "@/src/services/niceguy-scoring/v2/thresholds";
import type { MetricCheck, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

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
                        { level: 2, text: "Drain Cleaning and Water Heater Repair" },
                    ],
                    buttons: [{ text: "Request a Quote", href: "/contact" }],
                    forms: [],
                    images: [{ src: "/logo.png", alt: "Acme Plumbing logo" }],
                    visibleText:
                        "Acme Plumbing provides emergency plumbing services across Toronto for homeowners. Licensed plumbers. Request a quote today.",
                    statusCode: 200,
                },
                {
                    url: "https://acmeplumbing.example/services",
                    path: "/services",
                    pageType: "services",
                    title: "Plumbing Services | Acme Plumbing",
                    headings: [{ level: 1, text: "Our Plumbing Services" }],
                    buttons: [{ text: "Book an Appointment", href: "/contact" }],
                    forms: [],
                    images: [],
                    visibleText:
                        "Drain cleaning, water heater repair, and emergency plumbing services with clear pricing estimates.",
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
                    visibleText: "Call 416-555-0100 or email hello@acmeplumbing.example. We respond within one business day.",
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

describe("Nice Guy Metrics v2 framework", () => {
    it("category weights total 1.0", () => {
        const total = Object.values(CATEGORY_WEIGHTS_V2).reduce((sum, weight) => sum + weight, 0);
        assert.equal(total, 1);
    });

    it("quality 100 with reduced coverage when checks are unavailable", () => {
        const checks: MetricCheck[] = [
            {
                id: "a",
                label: "A",
                description: "",
                status: "passed",
                weight: 10,
                pointsAwarded: 10,
                maximumPoints: 10,
                evidence: [],
                missing: [],
            },
            {
                id: "b",
                label: "B",
                description: "",
                status: "unavailable",
                weight: 20,
                pointsAwarded: 0,
                maximumPoints: 20,
                evidence: [],
                missing: [],
            },
        ];
        const category = finalizeCategoryV2(checks, "businessClarity");
        assert.equal(category.qualityScore, 100);
        assert.equal(category.evidenceCoverage, 33);
    });

    it("not_applicable checks are excluded from coverage denominator", () => {
        const checks: MetricCheck[] = [
            {
                id: "a",
                label: "A",
                description: "",
                status: "passed",
                weight: 10,
                pointsAwarded: 10,
                maximumPoints: 10,
                evidence: [],
                missing: [],
            },
            {
                id: "b",
                label: "B",
                description: "",
                status: "not_applicable",
                weight: 20,
                pointsAwarded: 0,
                maximumPoints: 0,
                evidence: [],
                missing: [],
            },
        ];
        const category = finalizeCategoryV2(checks, "trustCredibility");
        assert.equal(category.evidenceCoverage, 100);
    });

    it("only passed checks with positive points become strengths", () => {
        const checks: MetricCheck[] = [
            {
                id: "pass",
                label: "Good signal",
                description: "",
                status: "passed",
                weight: 10,
                pointsAwarded: 10,
                maximumPoints: 10,
                evidence: [],
                missing: [],
            },
            {
                id: "fail",
                label: "Bad signal",
                description: "",
                status: "failed",
                weight: 10,
                pointsAwarded: 0,
                maximumPoints: 10,
                evidence: [],
                missing: [],
            },
        ];
        const category = finalizeCategoryV2(checks, "technicalFoundation");
        assert.deepEqual(category.strengths, ["Good signal"]);
        assert.ok(category.issues.includes("Bad signal"));
    });
});

describe("Nice Guy Metrics v2 thresholds", () => {
    it("maps lighthouse scores to passed/partial/failed", () => {
        assert.equal(lighthouseScoreStatus(90), "passed");
        assert.equal(lighthouseScoreStatus(50), "partial");
        assert.equal(lighthouseScoreStatus(20), "failed");
        assert.equal(lighthouseScoreStatus(null), "unavailable");
    });

    it("maps CLS and TBT boundaries", () => {
        assert.equal(clsPoints(0.08, 5), 5);
        assert.equal(clsPoints(0.2, 5), 3);
        assert.equal(tbtPoints(180, 5), 5);
        assert.equal(tbtPoints(400, 5), 3);
    });

    it("fails technical performance score of 20", () => {
        const result = calculateNiceGuyScoreV2(baseInput({
            pagespeed: {
                mobile: {
                    ...baseInput().pagespeed.mobile!,
                    scores: {
                        performance: 20,
                        accessibility: 20,
                        bestPractices: 20,
                        seo: 20,
                    },
                },
                desktop: baseInput().pagespeed.desktop,
            },
        }));
        const mobilePerf = result.categories.technicalFoundation.checks.find(
            (check) => check.id === "tf-mobile-performance",
        );
        assert.equal(mobilePerf?.status, "failed");
        assert.equal(mobilePerf?.pointsAwarded, 0);
        assert.ok(!result.categories.technicalFoundation.strengths.includes("Mobile performance"));
    });
});

describe("Nice Guy Metrics v2 business clarity", () => {
    it("flags slogan-only hero as not passing offer clarity", () => {
        const result = calculateNiceGuyScoreV2(
            baseInput({
                crawl: {
                    ...baseInput().crawl,
                    pageResults: [
                        {
                            ...baseInput().crawl.pageResults[0]!,
                            headings: [{ level: 1, text: "Welcome" }],
                            visibleText: "Quality. Trusted. Professional.",
                            buttons: [],
                        },
                    ],
                },
            }),
        );
        const offer = result.categories.businessClarity.checks.find(
            (check) => check.id === "bc-primary-offer-clarity",
        );
        assert.notEqual(offer?.status, "passed");
    });

    it("does not penalize SaaS for missing service area", () => {
        const result = calculateNiceGuyScoreV2(
            baseInput({
                website: {
                    ...baseInput().website,
                    industry: "Software",
                },
                crawl: {
                    ...baseInput().crawl,
                    pageResults: [
                        {
                            ...baseInput().crawl.pageResults[0]!,
                            visibleText:
                                "Cloud software platform with free trial and subscription plans for teams worldwide.",
                            buttons: [{ text: "Start free trial", href: "/signup" }],
                        },
                    ],
                },
            }),
        );
        const location = result.categories.businessClarity.checks.find(
            (check) => check.id === "bc-location-clarity",
        );
        assert.equal(location?.status, "not_applicable");
    });
});

describe("Nice Guy Metrics v2 completeness gate", () => {
    it("marks preliminary score when screenshots are missing", () => {
        const result = calculateNiceGuyScoreV2(baseInput(), { hasScreenshots: false });
        assert.equal(result.completeness?.isComplete, false);
        assert.match(result.completeness?.label ?? "", /Preliminary result/i);
        assert.ok(result.methodology?.disclaimer.includes("not a guarantee"));
    });

    it("returns scoring version niceguy-v2", () => {
        const result = calculateNiceGuyScoreV2(baseInput());
        assert.equal(result.scoringVersion, "niceguy-v2");
    });
});

describe("Nice Guy Metrics v2 UX category", () => {
    it("does not score PageSpeed performance inside usability", () => {
        const result = calculateNiceGuyScoreV2(baseInput());
        const uxCheckIds = result.categories.userExperience.checks.map((check) => check.id);
        assert.ok(!uxCheckIds.some((id) => id.includes("pagespeed") || id.includes("performance")));
    });
});

describe("Nice Guy Metrics v2 CrUX composite", () => {
    it("fails when any field metric is poor", () => {
        assert.equal(
            cruxCompositeStatus(["good", "needs-improvement", "poor"]),
            "failed",
        );
    });
});
