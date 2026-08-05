import type { BusinessTypeDetection } from "@/src/services/niceguy-scoring/v2/business-types";
import { isUniversalOffer, requiresLocation } from "@/src/services/niceguy-scoring/v2/business-types";
import { buildV2Check, finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    AUDIENCE_PATTERNS,
    findPrimaryCta,
    GENERIC_ADJECTIVES,
    getHeroText,
    getHomepage,
    hasLocationEvidence,
    hasSpecificOffer,
    isGenericHeading,
    isGenericTitle,
    isStrongCta,
    isWeakCta,
    normalizeText,
    SERVICE_KEYWORDS,
} from "@/src/services/niceguy-scoring/v2/shared";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreBusinessClarityV2(
    input: NiceGuyScoringInput,
    businessType: BusinessTypeDetection,
) {
    const homepage = getHomepage(input);
    const heroText = getHeroText(homepage);
    const h1 = homepage?.headings.find((heading) => heading.level === 1)?.text ?? "";
    const visible = homepage?.visibleText ?? "";
    const location = hasLocationEvidence(input);
    const primaryCta = findPrimaryCta(input);
    const businessName = normalizeText(input.website.businessName);
    const visibleName = businessName && normalizeText(visible).includes(businessName);

    const offerSpecific = hasSpecificOffer(heroText);
    const offerStatus = !homepage
        ? "unavailable"
        : offerSpecific
          ? "passed"
          : heroText.length > 10
            ? "partial"
            : heroText.length > 0
              ? "failed"
              : "not_detected";

    const audienceHits = AUDIENCE_PATTERNS.filter((pattern) =>
        normalizeText(visible).includes(pattern),
    );
    const audienceStatus =
        isUniversalOffer(businessType.applied) && audienceHits.length === 0
            ? "not_applicable"
            : audienceHits.length > 0
              ? "passed"
              : audienceHits.length === 0 && visible.length > 100
                ? "partial"
                : "not_detected";

    const servicePages = input.crawl.pageResults.filter(
        (page) => page.pageType === "services" || page.pageType === "service-detail",
    );
    const serviceText = servicePages.map((page) => page.visibleText ?? "").join(" ");
    const serviceNamed =
        SERVICE_KEYWORDS.filter((keyword) =>
            normalizeText(`${heroText} ${serviceText}`).includes(keyword),
        ).length >= 2 ||
        servicePages.some((page) => (page.visibleText ?? "").length > 80);
    const serviceStatus = serviceNamed
        ? "passed"
        : input.crawl.hasServicesPage
          ? "partial"
          : "not_detected";

    const locationApplicable = requiresLocation(businessType.applied);
    const locationStatus = !locationApplicable
        ? "not_applicable"
        : location.found
          ? "passed"
          : location.partial
            ? "partial"
            : homepage
              ? "not_detected"
              : "unavailable";

    const differentiationHits = GENERIC_ADJECTIVES.filter((adj) =>
        normalizeText(visible).includes(adj),
    );
    const concreteProcess =
        /\b(process|step|method|approach|since \d{4}|\d+\+ years|licensed|certified|warranty)\b/i.test(
            visible,
        );
    const diffStatus = concreteProcess
        ? "passed"
        : differentiationHits.length > 0 && !concreteProcess
          ? "partial"
          : "not_detected";

    const ctaStatus = !primaryCta
        ? homepage
            ? "not_detected"
            : "unavailable"
        : isStrongCta(primaryCta.text)
          ? "passed"
          : isWeakCta(primaryCta.text) && primaryCta.href
            ? "partial"
            : normalizeText(primaryCta.text)
              ? "partial"
              : "failed";

    const identityStatus = visibleName
        ? "passed"
        : businessName && homepage
          ? "partial"
          : homepage
            ? "not_detected"
            : "unavailable";

    const expectationPatterns = [
        "response within",
        "within 24",
        "free estimate",
        "book online",
        "what to expect",
        "next steps",
        "how it works",
    ];
    const expectationHit = expectationPatterns.find((pattern) =>
        normalizeText(visible).includes(pattern),
    );
    const expectationStatus = expectationHit
        ? "passed"
        : homepage
          ? "not_detected"
          : "unavailable";

    const checks = [
        buildV2Check({
            id: "bc-primary-offer-clarity",
            label: "Primary offer clarity",
            description:
                "Homepage hero content should communicate a specific product, service, or category.",
            status: offerStatus,
            weight: 20,
            pointsAwarded:
                offerStatus === "passed" ? 20 : offerStatus === "partial" ? 10 : 0,
            evidence: [
                { type: "content", label: "H1", value: h1 || null },
                { type: "content", label: "Hero excerpt", value: heroText.slice(0, 200) },
            ],
            missing:
                offerStatus === "not_detected"
                    ? ["Specific offer not detected during crawl"]
                    : [],
            recommendation:
                offerStatus !== "passed"
                    ? "State a specific service or product in the homepage hero, not only slogans."
                    : null,
        }),
        buildV2Check({
            id: "bc-audience-clarity",
            label: "Intended-customer clarity",
            description: "Audience, problem, or use case should be explicit when relevant.",
            status: audienceStatus,
            weight: 12,
            pointsAwarded:
                audienceStatus === "passed" ? 12 : audienceStatus === "partial" ? 6 : 0,
            evidence: audienceHits.map((hit) => ({
                type: "content",
                label: "Audience phrase",
                value: hit,
            })),
            recommendation:
                audienceStatus === "not_detected"
                    ? "Clarify who the offer is for using plain language on the homepage."
                    : null,
        }),
        buildV2Check({
            id: "bc-service-scope",
            label: "Service/product scope clarity",
            description: "Important offerings should be named with understandable boundaries.",
            status: serviceStatus,
            weight: 15,
            pointsAwarded:
                serviceStatus === "passed" ? 15 : serviceStatus === "partial" ? 7 : 0,
            evidence: [
                {
                    type: "page",
                    label: "Service pages inspected",
                    value: servicePages.length,
                },
            ],
            recommendation:
                serviceStatus !== "passed"
                    ? "Name specific services with useful detail, not only a generic services route."
                    : null,
        }),
        buildV2Check({
            id: "bc-location-clarity",
            label: "Location/service-area clarity",
            description: "Location-dependent businesses should state where they operate.",
            status: locationStatus,
            weight: 10,
            pointsAwarded:
                locationStatus === "passed" ? 10 : locationStatus === "partial" ? 5 : 0,
            evidence: location.evidence,
            missing:
                locationStatus === "not_detected"
                    ? ["Location or service area not detected during crawl"]
                    : [],
            recommendation:
                locationApplicable && locationStatus !== "passed"
                    ? "Add a clearly labelled city, address, or service area."
                    : null,
        }),
        buildV2Check({
            id: "bc-differentiation",
            label: "Differentiation and specific value",
            description: "Concrete benefits or process distinctions should be visible.",
            status: diffStatus,
            weight: 15,
            pointsAwarded: diffStatus === "passed" ? 15 : diffStatus === "partial" ? 7 : 0,
            evidence: [
                {
                    type: "content",
                    label: "Generic adjectives detected",
                    value: differentiationHits.join(", ") || "none",
                },
            ],
            recommendation:
                diffStatus !== "passed"
                    ? "Replace generic claims with specific process, qualification, or outcome language."
                    : null,
        }),
        buildV2Check({
            id: "bc-primary-action",
            label: "Primary action clarity",
            description: "Dominant homepage action should communicate intent.",
            status: ctaStatus,
            weight: 12,
            pointsAwarded: ctaStatus === "passed" ? 12 : ctaStatus === "partial" ? 6 : 0,
            evidence: primaryCta
                ? [
                      {
                          type: "link",
                          label: "Primary CTA",
                          value: `${primaryCta.text} → ${primaryCta.href ?? "no href"}`,
                          pageUrl: primaryCta.pageUrl,
                      },
                  ]
                : [],
            recommendation:
                ctaStatus !== "passed"
                    ? "Use a specific primary action label such as Request a quote or Book an appointment."
                    : null,
        }),
        buildV2Check({
            id: "bc-business-identity",
            label: "Business identity clarity",
            description: "Visible business name should be consistent on key pages.",
            status: identityStatus,
            weight: 8,
            pointsAwarded:
                identityStatus === "passed" ? 8 : identityStatus === "partial" ? 4 : 0,
            evidence: [
                {
                    type: "content",
                    label: "Configured business name",
                    value: input.website.businessName ?? null,
                },
            ],
            recommendation:
                identityStatus !== "passed"
                    ? "Show the business name clearly in the homepage hero or header."
                    : null,
        }),
        buildV2Check({
            id: "bc-expectation-setting",
            label: "Expectation-setting",
            description: "Useful next-step expectations should be stated when relevant.",
            status: expectationStatus,
            weight: 8,
            pointsAwarded: expectationStatus === "passed" ? 8 : 0,
            evidence: expectationHit
                ? [{ type: "content", label: "Expectation phrase", value: expectationHit }]
                : [],
            recommendation:
                expectationStatus === "not_detected"
                    ? "Explain what happens after contact, booking, or quote request."
                    : null,
        }),
    ];

    return finalizeCategoryV2(checks, "businessClarity");
}
