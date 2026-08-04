import type { BusinessTypeDetection } from "@/src/services/niceguy-scoring/v2/business-types";
import { requiresCheckoutPolicies } from "@/src/services/niceguy-scoring/v2/business-types";
import { buildV2Check, finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    allButtons,
    allForms,
    findPrimaryCta,
    getHomepage,
    hasLabeledFormFields,
    isStrongCta,
    isWeakCta,
    normalizeText,
} from "@/src/services/niceguy-scoring/v2/shared";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

function resolveCtaDestination(
    input: NiceGuyScoringInput,
    href: string | undefined,
): { aligned: boolean; destination: string | null } {
    if (!href || href === "#") return { aligned: false, destination: href };
    const normalizedHref = href.toLowerCase();
    const pages = input.crawl.pageResults.map((page) => page.path.toLowerCase());
    const isInternal =
        normalizedHref.startsWith("/") ||
        normalizedHref.includes(new URL(input.crawl.requestedUrl).hostname);
    if (!isInternal) return { aligned: true, destination: href };
    const path = normalizedHref.startsWith("/")
        ? normalizedHref
        : new URL(href).pathname;
    const exists = pages.some((pagePath) => path.startsWith(pagePath) || pagePath.startsWith(path));
    return { aligned: exists, destination: href };
}

export function scoreConversionReadinessV2(
    input: NiceGuyScoringInput,
    businessType: BusinessTypeDetection,
) {
    const homepage = getHomepage(input);
    const primaryCta = findPrimaryCta(input);
    const buttons = allButtons(input);
    const forms = allForms(input);
    const formLabels = hasLabeledFormFields(forms);

    const prominenceStatus = !homepage
        ? "unavailable"
        : primaryCta && !isWeakCta(primaryCta.text)
          ? "passed"
          : primaryCta
            ? "partial"
            : "not_detected";

    const destination = primaryCta
        ? resolveCtaDestination(input, primaryCta.href)
        : { aligned: false, destination: null };
    const continuityStatus = !primaryCta
        ? homepage
            ? "not_detected"
            : "unavailable"
        : destination.aligned
          ? "passed"
          : "failed";

    const hasPhone = input.crawl.phoneNumbersFound.length > 0;
    const hasEmail = input.crawl.emailsFound.length > 0;
    const hasForm = forms.length > 0;
    const pathCount = [hasPhone, hasEmail, hasForm].filter(Boolean).length;
    const pathStatus =
        pathCount >= 2 ? "passed" : pathCount === 1 ? "partial" : "not_detected";

    const formStatus =
        forms.length === 0
            ? "not_detected"
            : formLabels.unlabeled === 0 && formLabels.labeled >= 2
              ? "passed"
              : formLabels.labeled > 0
                ? "partial"
                : "failed";

    const totalFields = forms.reduce(
        (sum, form) => sum + form.fields.filter((field) => field.type !== "submit").length,
        0,
    );
    const frictionStatus =
        totalFields === 0
            ? "not_applicable"
            : totalFields <= 8
              ? "passed"
              : totalFields <= 14
                ? "partial"
                : "failed";

    const visible = homepage?.visibleText ?? "";
    const outcomePatterns = [
        "we will respond",
        "confirmation",
        "within 24",
        "next business day",
        "appointment",
        "estimate",
        "quote",
    ];
    const outcomeHit = outcomePatterns.find((pattern) => normalizeText(visible).includes(pattern));
    const outcomeStatus = outcomeHit ? "passed" : homepage ? "not_detected" : "unavailable";

    const riskPatterns = ["privacy", "return", "refund", "cancel", "warranty", "secure", "ssl"];
    const riskHit = riskPatterns.filter((pattern) => normalizeText(visible).includes(pattern));
    const riskApplicable = requiresCheckoutPolicies(businessType.applied);
    const riskStatus = !riskApplicable
        ? riskHit.length > 0
            ? "passed"
            : "not_applicable"
        : riskHit.length >= 2
          ? "passed"
          : riskHit.length === 1
            ? "partial"
            : "not_detected";

    const ctaLabels = buttons
        .map((button) => normalizeText(button.text))
        .filter((text) => isStrongCta(text) || text.includes("contact"));
    const uniqueLabels = new Set(ctaLabels);
    const consistencyStatus =
        ctaLabels.length === 0
            ? "not_detected"
            : uniqueLabels.size <= 2
              ? "passed"
              : "partial";

    const mobileStatus = primaryCta ? "partial" : homepage ? "not_detected" : "unavailable";

    const feedbackStatus = forms.some((form) =>
        form.fields.some((field) => field.required || field.label),
    )
        ? "partial"
        : forms.length > 0
          ? "not_detected"
          : "not_applicable";

    const checks = [
        buildV2Check({
            id: "cr-cta-prominence",
            label: "Primary CTA prominence and clarity",
            description: "Primary action should be visible and distinguishable on the homepage.",
            status: prominenceStatus,
            weight: 18,
            pointsAwarded:
                prominenceStatus === "passed" ? 18 : prominenceStatus === "partial" ? 9 : 0,
            evidence: primaryCta
                ? [{ type: "link", label: "Primary CTA", value: primaryCta.text }]
                : [],
            recommendation:
                prominenceStatus !== "passed"
                    ? "Make the primary action visually prominent with a specific label."
                    : null,
        }),
        buildV2Check({
            id: "cr-cta-continuity",
            label: "CTA destination and intent continuity",
            description: "CTA destinations should align with label intent.",
            status: continuityStatus,
            weight: 12,
            pointsAwarded:
                continuityStatus === "passed" ? 12 : continuityStatus === "partial" ? 6 : 0,
            evidence: [
                {
                    type: "link",
                    label: "Destination",
                    value: destination.destination,
                },
            ],
            recommendation:
                continuityStatus === "failed"
                    ? "Ensure CTA links resolve to a relevant page discovered during the crawl."
                    : null,
        }),
        buildV2Check({
            id: "cr-conversion-paths",
            label: "Contact/conversion-path availability",
            description: "At least one actionable conversion path should be available.",
            status: pathStatus,
            weight: 12,
            pointsAwarded: pathStatus === "passed" ? 12 : pathStatus === "partial" ? 6 : 0,
            evidence: [
                { type: "contact", label: "Phone numbers", value: input.crawl.phoneNumbersFound.length },
                { type: "contact", label: "Email addresses", value: input.crawl.emailsFound.length },
                { type: "form", label: "Forms detected", value: forms.length },
            ],
            recommendation:
                pathStatus === "not_detected"
                    ? "Provide at least one clear contact or conversion path."
                    : null,
        }),
        buildV2Check({
            id: "cr-form-readiness",
            label: "Form readiness and labelling",
            description: "Form controls should be labelled without relying on placeholders alone.",
            status: formStatus,
            weight: 15,
            pointsAwarded: formStatus === "passed" ? 15 : formStatus === "partial" ? 7 : 0,
            evidence: [
                { type: "form", label: "Labelled fields", value: formLabels.labeled },
                { type: "form", label: "Unlabelled fields", value: formLabels.unlabeled },
            ],
            recommendation:
                formStatus !== "passed" && forms.length > 0
                    ? "Add visible labels or accessible names to all required form fields."
                    : null,
        }),
        buildV2Check({
            id: "cr-friction",
            label: "Friction proportionality",
            description: "Requested information should be proportionate to the task.",
            status: frictionStatus,
            weight: 10,
            pointsAwarded:
                frictionStatus === "passed" ? 10 : frictionStatus === "partial" ? 5 : 0,
            evidence: [{ type: "form", label: "Visible fields", value: totalFields }],
            recommendation:
                frictionStatus === "failed"
                    ? "Reduce unnecessary fields or explain why each field is required."
                    : null,
        }),
        buildV2Check({
            id: "cr-outcome-expectations",
            label: "Outcome and next-step expectations",
            description: "Visitors should understand what happens after they act.",
            status: outcomeStatus,
            weight: 10,
            pointsAwarded: outcomeStatus === "passed" ? 10 : outcomeStatus === "partial" ? 5 : 0,
            evidence: outcomeHit
                ? [{ type: "content", label: "Outcome phrase", value: outcomeHit }]
                : [],
            recommendation:
                outcomeStatus === "not_detected"
                    ? "State response time, confirmation, or next steps near the primary action."
                    : null,
        }),
        buildV2Check({
            id: "cr-risk-objections",
            label: "Risk and objection information",
            description: "Relevant reassurance should appear near decision points when applicable.",
            status: riskStatus,
            weight: 8,
            pointsAwarded: riskStatus === "passed" ? 8 : riskStatus === "partial" ? 4 : 0,
            evidence: riskHit.map((hit) => ({ type: "content", label: "Risk signal", value: hit })),
            recommendation:
                riskApplicable && riskStatus === "not_detected"
                    ? "Add returns, privacy, or security context appropriate to the transaction model."
                    : null,
        }),
        buildV2Check({
            id: "cr-cta-consistency",
            label: "CTA consistency by intent",
            description: "Equivalent actions should use consistent labels.",
            status: consistencyStatus,
            weight: 6,
            pointsAwarded:
                consistencyStatus === "passed" ? 6 : consistencyStatus === "partial" ? 3 : 0,
            evidence: [{ type: "derived", label: "Distinct CTA labels", value: uniqueLabels.size }],
        }),
        buildV2Check({
            id: "cr-mobile-path",
            label: "Mobile conversion-path usability",
            description: "Primary action should remain reachable at mobile viewport.",
            status: mobileStatus,
            weight: 6,
            pointsAwarded: mobileStatus === "passed" ? 6 : mobileStatus === "partial" ? 3 : 0,
            missing: ["Mobile viewport geometry was not captured; label-based screening only."],
            recommendation:
                "Verify primary CTA and required fields on a 390px-wide viewport during manual review.",
        }),
        buildV2Check({
            id: "cr-feedback-readiness",
            label: "Feedback/error readiness",
            description: "Forms should expose validation or instruction structures.",
            status: feedbackStatus,
            weight: 3,
            pointsAwarded:
                feedbackStatus === "passed" ? 3 : feedbackStatus === "partial" ? 2 : 0,
            evidence: [{ type: "form", label: "Forms inspected", value: forms.length }],
        }),
    ];

    return finalizeCategoryV2(checks, "conversionReadiness");
}
