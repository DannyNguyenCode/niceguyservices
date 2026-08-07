import {
    buildCheck,
    finalizeCategory,
    hasLocationEvidence,
    hasTrustLanguage,
} from "@/src/services/niceguy-scoring/helpers";
import type { CategoryScore, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreTrustCredibility(input: NiceGuyScoringInput): CategoryScore {
    const trustLanguage = hasTrustLanguage(input);
    const location = hasLocationEvidence(input);
    const socialCount = input.crawl.socialLinks.length;

    const checks = [
        buildCheck({
            id: "trust-about-page",
            label: "About page",
            description: "An About page helps establish business legitimacy.",
            status: input.crawl.hasAboutPage ? "passed" : "failed",
            weight: 15,
            pointsAwarded: input.crawl.hasAboutPage ? 15 : 0,
            evidence: input.crawl.hasAboutPage
                ? [{ type: "page", label: "About page detected", value: true }]
                : [],
            missing: input.crawl.hasAboutPage ? [] : ["About page not found"],
            recommendation: input.crawl.hasAboutPage
                ? null
                : "Create a dedicated About page that explains the company's experience, approach, and service area.",
        }),
        buildCheck({
            id: "trust-contact-page",
            label: "Contact page",
            description: "A Contact page makes it easier for visitors to reach the business.",
            status: input.crawl.hasContactPage ? "passed" : "failed",
            weight: 15,
            pointsAwarded: input.crawl.hasContactPage ? 15 : 0,
            evidence: input.crawl.hasContactPage
                ? [{ type: "page", label: "Contact page detected", value: true }]
                : [],
            missing: input.crawl.hasContactPage ? [] : ["Contact page not found"],
            recommendation: input.crawl.hasContactPage
                ? null
                : "Add a dedicated Contact page with phone, email, and a contact form.",
        }),
        buildCheck({
            id: "trust-phone-visible",
            label: "Visible phone number",
            description: "Phone numbers improve trust and conversion for local businesses.",
            status: input.crawl.phoneNumbersFound.length > 0 ? "passed" : "failed",
            weight: 10,
            pointsAwarded: input.crawl.phoneNumbersFound.length > 0 ? 10 : 0,
            evidence: [
                {
                    type: "contact",
                    label: "Phone numbers found",
                    value: input.crawl.phoneNumbersFound.length,
                },
            ],
            missing:
                input.crawl.phoneNumbersFound.length > 0 ? [] : ["No phone number detected"],
            recommendation:
                input.crawl.phoneNumbersFound.length === 0
                    ? "Display a phone number on the homepage or contact page."
                    : null,
        }),
        buildCheck({
            id: "trust-email-visible",
            label: "Visible email address",
            description: "Email contact information supports trust and follow-up.",
            status: input.crawl.emailsFound.length > 0 ? "passed" : "failed",
            weight: 10,
            pointsAwarded: input.crawl.emailsFound.length > 0 ? 10 : 0,
            evidence: [
                {
                    type: "contact",
                    label: "Email addresses found",
                    value: input.crawl.emailsFound.length,
                },
            ],
            missing: input.crawl.emailsFound.length > 0 ? [] : ["No email address detected"],
            recommendation:
                input.crawl.emailsFound.length === 0
                    ? "Display a business email address on the contact page or homepage."
                    : null,
        }),
        buildCheck({
            id: "trust-location-visible",
            label: "Physical location or service area",
            description: "Location evidence helps visitors confirm the business serves their area.",
            status: location.found ? "passed" : location.partial ? "partial" : "failed",
            weight: 10,
            pointsAwarded: location.found ? 10 : location.partial ? 5 : 0,
            evidence: location.evidence,
            missing: location.found ? [] : ["Location or service area not clearly visible"],
            recommendation: !location.found
                ? "Show your city, address, or service area on the homepage or contact page."
                : null,
        }),
        buildCheck({
            id: "trust-privacy-policy",
            label: "Privacy policy",
            description: "A privacy policy supports transparency and compliance.",
            status: input.crawl.hasPrivacyPolicy ? "passed" : "failed",
            weight: 10,
            pointsAwarded: input.crawl.hasPrivacyPolicy ? 10 : 0,
            evidence: input.crawl.hasPrivacyPolicy
                ? [{ type: "page", label: "Privacy policy detected", value: true }]
                : [],
            missing: input.crawl.hasPrivacyPolicy ? [] : ["Privacy policy not found"],
            recommendation: input.crawl.hasPrivacyPolicy
                ? null
                : "Add a privacy policy page or footer link.",
        }),
        buildCheck({
            id: "trust-terms",
            label: "Terms or legal information",
            description: "Terms or legal pages provide additional business transparency.",
            status: input.crawl.hasTerms ? "passed" : "partial",
            weight: 5,
            pointsAwarded: input.crawl.hasTerms ? 5 : 2,
            evidence: input.crawl.hasTerms
                ? [{ type: "page", label: "Terms or legal page detected", value: true }]
                : [],
            missing: input.crawl.hasTerms ? [] : ["Terms or legal page not found"],
            recommendation: null,
            priority: "low",
        }),
        buildCheck({
            id: "trust-social-presence",
            label: "Social presence",
            description: "Linked social profiles can reinforce credibility.",
            status:
                socialCount >= 2 ? "passed" : socialCount === 1 ? "partial" : "failed",
            weight: 10,
            pointsAwarded: socialCount >= 2 ? 10 : socialCount === 1 ? 5 : 0,
            evidence: [
                {
                    type: "link",
                    label: "Social profiles found",
                    value: socialCount,
                },
            ],
            missing: socialCount > 0 ? [] : ["No social profile links detected"],
            recommendation:
                socialCount === 0 ? "Link to active social profiles that reinforce your business presence." : null,
            priority: "low",
        }),
        buildCheck({
            id: "trust-proof-language",
            label: "Trust language or proof",
            description: "Visible proof language can support credibility.",
            status:
                trustLanguage.hits.length >= 3
                    ? "passed"
                    : trustLanguage.hits.length > 0
                      ? "partial"
                      : "failed",
            weight: 15,
            pointsAwarded:
                trustLanguage.hits.length >= 3 ? 15 : trustLanguage.hits.length > 0 ? 8 : 0,
            evidence: trustLanguage.evidence.slice(0, 5),
            missing:
                trustLanguage.hits.length > 0
                    ? []
                    : ["No testimonials, reviews, certifications, or trust language detected"],
            recommendation:
                trustLanguage.hits.length === 0
                    ? "Add testimonials, years of experience, certifications, or guarantees to build trust."
                    : null,
        }),
    ];

    return finalizeCategory(checks);
}
