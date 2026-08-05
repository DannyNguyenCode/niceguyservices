import type { BusinessTypeDetection } from "@/src/services/niceguy-scoring/v2/business-types";
import { requiresCredentials } from "@/src/services/niceguy-scoring/v2/business-types";
import { buildV2Check, finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    allVisibleText,
    getHomepage,
    getPageByType,
    hasLocationEvidence,
    hasTrustLanguage,
    normalizeText,
    PLACEHOLDER_PATTERNS,
    SUPERLATIVE_PATTERNS,
} from "@/src/services/niceguy-scoring/v2/shared";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreTrustCredibilityV2(
    input: NiceGuyScoringInput,
    businessType: BusinessTypeDetection,
) {
    const visible = allVisibleText(input);
    const about = getPageByType(input, "about");
    const contact = getPageByType(input, "contact");
    const homepage = getHomepage(input);
    const trust = hasTrustLanguage(input);
    const location = hasLocationEvidence(input);

    const identityStatus =
        about && (about.visibleText ?? "").length > 120
            ? "passed"
            : about
              ? "partial"
              : input.crawl.hasAboutPage
                ? "partial"
                : "not_detected";

    const hasPhone = input.crawl.phoneNumbersFound.length > 0;
    const hasEmail = input.crawl.emailsFound.length > 0;
    const hasForm = input.crawl.pageResults.some((page) => page.forms.length > 0);
    const contactStatus =
        hasPhone || hasEmail
            ? "passed"
            : hasForm && contact
              ? "passed"
              : hasForm
                ? "partial"
                : "not_detected";

    const proofPatterns = [
        "case study",
        "portfolio",
        "client",
        "customer",
        "project",
        "certified",
        "licensed",
        "award",
        "member of",
    ];
    const proofHits = proofPatterns.filter((pattern) => visible.includes(pattern));
    const proofStatus =
        proofHits.length >= 2 ? "passed" : proofHits.length === 1 ? "partial" : "not_detected";

    const testimonialPatterns = ["testimonial", "review", "said", "rating", "stars"];
    const testimonialHits = testimonialPatterns.filter((pattern) => visible.includes(pattern));
    const placeholderTestimonial = PLACEHOLDER_PATTERNS.some((pattern) => visible.includes(pattern));
    const testimonialStatus = placeholderTestimonial
        ? "failed"
        : testimonialHits.length >= 2
          ? "passed"
          : testimonialHits.length === 1
            ? "partial"
            : "not_detected";

    const credentialPatterns = [
        "dr.",
        "md",
        "rn",
        "cpa",
        "p.eng",
        "licence",
        "license",
        "board certified",
    ];
    const credentialHits = credentialPatterns.filter((pattern) => visible.includes(pattern));
    const credentialsApplicable = requiresCredentials(businessType.applied);
    const credentialStatus = !credentialsApplicable
        ? "not_applicable"
        : credentialHits.length > 0
          ? "passed"
          : "not_detected";

    const policyStatus =
        input.crawl.hasPrivacyPolicy || input.crawl.hasTerms
            ? "passed"
            : businessType.applied === "ecommerce"
              ? "not_detected"
              : "not_applicable";

    const superlativeHits = SUPERLATIVE_PATTERNS.filter((pattern) => visible.includes(pattern));
    const substantiationStatus =
        superlativeHits.length === 0
            ? "passed"
            : trust.hits.length > 0
              ? "partial"
              : "failed";

    const socialCount = input.crawl.socialLinks.length;
    const externalStatus =
        socialCount >= 2 ? "passed" : socialCount === 1 ? "partial" : "not_detected";

    const copyrightYear = visible.match(/©\s*(20\d{2})/);
    const consistencyStatus = homepage ? "partial" : "unavailable";

    const securePatterns = ["secure checkout", "payment", "stripe", "paypal", "encrypted"];
    const secureHits = securePatterns.filter((pattern) => visible.includes(pattern));
    const secureStatus =
        businessType.applied === "ecommerce"
            ? secureHits.length > 0
                ? "partial"
                : "not_detected"
            : "not_applicable";

    const checks = [
        buildV2Check({
            id: "tc-business-identity",
            label: "Verifiable business identity",
            description: "About information and consistent identity signals should be present.",
            status: identityStatus,
            weight: 15,
            pointsAwarded:
                identityStatus === "passed" ? 15 : identityStatus === "partial" ? 7 : 0,
            evidence: about
                ? [{ type: "page", label: "About page content length", value: (about.visibleText ?? "").length }]
                : [],
            recommendation:
                identityStatus === "not_detected"
                    ? "Add meaningful About content describing who operates the business."
                    : null,
        }),
        buildV2Check({
            id: "tc-contact-transparency",
            label: "Contact transparency",
            description: "At least one actionable contact path should be clearly labelled.",
            status: contactStatus,
            weight: 12,
            pointsAwarded:
                contactStatus === "passed" ? 12 : contactStatus === "partial" ? 6 : 0,
            evidence: [
                { type: "contact", label: "Phone", value: hasPhone },
                { type: "contact", label: "Email", value: hasEmail },
                { type: "form", label: "Form path", value: hasForm },
            ],
            recommendation:
                contactStatus === "not_detected"
                    ? "Provide a clearly labelled contact method appropriate to the business model."
                    : null,
        }),
        buildV2Check({
            id: "tc-proof-evidence",
            label: "Specific proof evidence",
            description: "Portfolio, case study, or qualification evidence may support credibility.",
            status: proofStatus,
            weight: 15,
            pointsAwarded: proofStatus === "passed" ? 15 : proofStatus === "partial" ? 7 : 0,
            evidence: proofHits.map((hit) => ({ type: "content", label: "Proof signal", value: hit })),
            recommendation:
                proofStatus === "not_detected"
                    ? "Add attributable work examples, outcomes, or credentials where appropriate."
                    : null,
        }),
        buildV2Check({
            id: "tc-testimonials",
            label: "Testimonials/reviews integrity",
            description: "Quoted testimonials should be attributable; placeholder text is flagged.",
            status: testimonialStatus,
            weight: 12,
            pointsAwarded:
                testimonialStatus === "passed"
                    ? 12
                    : testimonialStatus === "partial"
                      ? 6
                      : 0,
            evidence: testimonialHits.map((hit) => ({
                type: "content",
                label: "Testimonial signal",
                value: hit,
            })),
            recommendation:
                testimonialStatus === "failed"
                    ? "Replace placeholder testimonial content with attributable quotes."
                    : null,
        }),
        buildV2Check({
            id: "tc-qualifications",
            label: "Qualifications and expertise context",
            description: "Regulated or expertise-driven services may show credentials.",
            status: credentialStatus,
            weight: 10,
            pointsAwarded: credentialStatus === "passed" ? 10 : 0,
            evidence: credentialHits.map((hit) => ({
                type: "content",
                label: "Credential signal",
                value: hit,
            })),
            recommendation:
                credentialsApplicable && credentialStatus === "not_detected"
                    ? "Name professionals, roles, and governing bodies where relevant."
                    : null,
        }),
        buildV2Check({
            id: "tc-policy-transparency",
            label: "Policy and commercial transparency",
            description: "Useful policy content should be visible when transactions apply.",
            status: policyStatus,
            weight: 12,
            pointsAwarded: policyStatus === "passed" ? 12 : 0,
            evidence: [
                { type: "page", label: "Privacy policy", value: input.crawl.hasPrivacyPolicy },
                { type: "page", label: "Terms", value: input.crawl.hasTerms },
            ],
            recommendation:
                policyStatus === "not_detected"
                    ? "Publish privacy or commercial terms with useful visible content."
                    : null,
        }),
        buildV2Check({
            id: "tc-claim-substantiation",
            label: "Claim substantiation hygiene",
            description: "Superlatives without nearby qualification are flagged for review.",
            status: substantiationStatus,
            weight: 10,
            pointsAwarded:
                substantiationStatus === "passed"
                    ? 10
                    : substantiationStatus === "partial"
                      ? 5
                      : 0,
            evidence: superlativeHits.map((hit) => ({
                type: "content",
                label: "Potential review flag",
                value: hit,
            })),
            recommendation:
                substantiationStatus !== "passed"
                    ? "Qualify performance claims or link to substantiating evidence."
                    : null,
        }),
        buildV2Check({
            id: "tc-external-presence",
            label: "External presence connection",
            description: "Intentional links to official profiles may support verification.",
            status: externalStatus,
            weight: 6,
            pointsAwarded:
                externalStatus === "passed" ? 6 : externalStatus === "partial" ? 3 : 0,
            evidence: input.crawl.socialLinks.map((link) => ({
                type: "link",
                label: "Social/profile link",
                value: link,
            })),
        }),
        buildV2Check({
            id: "tc-operational-consistency",
            label: "Currency and operational consistency",
            description: "Contradictory operational details across pages reduce confidence.",
            status: consistencyStatus,
            weight: 5,
            pointsAwarded: consistencyStatus === "partial" ? 3 : 0,
            evidence: copyrightYear
                ? [{ type: "derived", label: "Copyright year detected", value: copyrightYear[1] }]
                : [],
            missing: ["Automated cross-page hour/price consistency requires human review."],
        }),
        buildV2Check({
            id: "tc-secure-decision",
            label: "Secure-decision context",
            description: "Payment flows should show provider context near sensitive fields.",
            status: secureStatus,
            weight: 3,
            pointsAwarded: secureStatus === "partial" ? 2 : 0,
            evidence: secureHits.map((hit) => ({ type: "content", label: "Payment signal", value: hit })),
        }),
    ];

    return finalizeCategoryV2(checks, "trustCredibility");
}
