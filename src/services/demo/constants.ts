export const DEMO_GENERATION_VERSION = "demo-generation-v1";
export const DEMO_SPEC_VERSION = "demo-spec-v1";

export const DEMO_DISCLAIMER_TEXT =
    "Demonstration concept created by Nice Guy Web Design. Content, services, contact information, images, and business claims require client verification before production use.";

export const DEMO_BANNER_TEXT = "Demo Preview — Not the live website";

export const DEMO_FORM_MESSAGE = "Demo form only. No information has been submitted.";

export const HIGH_RISK_FACT_KEYS = [
    "certifications",
    "licences",
    "insurance",
    "awards",
    "ratings",
    "reviews",
    "yearsInBusiness",
    "emergencyAvailability",
    "guarantees",
    "financing",
    "legalCompliance",
] as const;

export const DEFAULT_DEMO_PAGES = ["home", "services", "about", "contact"] as const;

export const DEFAULT_DEMO_CONFIGURATION = {
    architecture: "multi-page" as const,
    pages: ["home", "services", "about", "contact"] as Array<
        "home" | "services" | "about" | "contact" | "resources"
    >,
    visualDirection: "modern-professional" as const,
    devicePriority: "mobile-first" as const,
    includeAuditComparison: false,
    includeDemoBanner: true,
    includePlaceholderForms: true,
    includePlaceholderContactInfo: true,
    useApprovedHeroConcept: true,
    useExistingLogo: false,
    useExistingImages: false,
};

export const DEFAULT_APPROVED_FACTS = {
    businessName: true,
    industry: false,
    location: false,
    services: false,
    contactInformation: false,
    logo: false,
    images: false,
    brandColours: false,
    existingCopyExcerpts: false,
    certifications: false,
    licences: false,
    insurance: false,
    awards: false,
    ratings: false,
    reviews: false,
    yearsInBusiness: false,
    emergencyAvailability: false,
    guarantees: false,
    financing: false,
    legalCompliance: false,
};

export const DEFAULT_CONTENT_POLICY = {
    mode: "approved-facts-with-rewritten-copy" as const,
    disclaimerRequired: true,
    inventedClaimsForbidden: true,
};
