import { buildV2Check, finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    allButtons,
    allForms,
    collectAllImages,
    getHomepage,
    getPageByType,
    hasLabeledFormFields,
    imageAltCoverage,
    isGenericHeading,
    normalizeText,
} from "@/src/services/niceguy-scoring/v2/shared";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreUsabilityAccessibilityV2(input: NiceGuyScoringInput) {
    const homepage = getHomepage(input);
    const about = getPageByType(input, "about");
    const contact = getPageByType(input, "contact");
    const services = getPageByType(input, "services");
    const internalLinks = input.crawl.internalLinks.map((link) => link.toLowerCase());
    const buttons = allButtons(input);
    const forms = allForms(input);
    const formLabels = hasLabeledFormFields(forms);
    const images = collectAllImages(input);
    const altCoverage = imageAltCoverage(images);

    const essentialPaths = [
        { label: "about", found: Boolean(about) || internalLinks.some((link) => link.includes("about")) },
        { label: "contact", found: Boolean(contact) || internalLinks.some((link) => link.includes("contact")) },
        { label: "services", found: Boolean(services) || internalLinks.some((link) => link.includes("service")) },
    ];
    const iaFound = essentialPaths.filter((path) => path.found).length;
    const iaStatus = iaFound >= 2 ? "passed" : iaFound === 1 ? "partial" : "not_detected";

    const navLabels = buttons
        .map((button) => normalizeText(button.text))
        .filter((text) => text.length > 0);
    const emptyNav = navLabels.length === 0;
    const navStatus = emptyNav
        ? "not_detected"
        : navLabels.some((label) => label.length >= 3)
          ? "passed"
          : "partial";

    const mobileStatus = homepage ? "partial" : "unavailable";

    const namedButtons = buttons.filter((button) => normalizeText(button.text).length > 0);
    const interactionStatus =
        namedButtons.length >= Math.max(1, Math.floor(buttons.length * 0.7))
            ? "passed"
            : namedButtons.length > 0
              ? "partial"
              : "not_detected";

    const imageStatus =
        altCoverage.total === 0
            ? "not_applicable"
            : altCoverage.missing === 0
              ? "passed"
              : altCoverage.missing <= Math.ceil(altCoverage.total * 0.3)
                ? "partial"
                : "failed";

    const headings = homepage?.headings ?? [];
    const h1Count = headings.filter((heading) => heading.level === 1).length;
    const genericHeadings = headings.filter((heading) => isGenericHeading(heading.text)).length;
    const structureStatus =
        h1Count === 1 && genericHeadings === 0
            ? "passed"
            : h1Count > 0
              ? "partial"
              : "not_detected";

    const unnamedButtons = buttons.filter((button) => !normalizeText(button.text)).length;
    const linkClarityStatus =
        unnamedButtons === 0 ? "passed" : unnamedButtons <= 2 ? "partial" : "failed";

    const formStatus =
        forms.length === 0
            ? "not_applicable"
            : formLabels.unlabeled === 0
              ? "passed"
              : formLabels.labeled > 0
                ? "partial"
                : "failed";

    const feedbackStatus = forms.length > 0 ? "partial" : "not_applicable";
    const continuityStatus = homepage ? "partial" : "unavailable";

    const checks = [
        buildV2Check({
            id: "ua-information-architecture",
            label: "Task-supporting information architecture",
            description: "Important pages should be discoverable from crawled relationships.",
            status: iaStatus,
            weight: 15,
            pointsAwarded: iaStatus === "passed" ? 15 : iaStatus === "partial" ? 7 : 0,
            evidence: essentialPaths.map((path) => ({
                type: "derived",
                label: `${path.label} discoverable`,
                value: path.found,
            })),
        }),
        buildV2Check({
            id: "ua-primary-navigation",
            label: "Primary-navigation quality",
            description: "Navigation controls should have visible or accessible labels.",
            status: navStatus,
            weight: 20,
            pointsAwarded: navStatus === "passed" ? 20 : navStatus === "partial" ? 10 : 0,
            evidence: [{ type: "link", label: "Button/link labels found", value: navLabels.length }],
            recommendation:
                navStatus !== "passed"
                    ? "Ensure primary navigation items have descriptive labels."
                    : null,
        }),
        buildV2Check({
            id: "ua-mobile-usability",
            label: "Mobile task usability",
            description: "Critical tasks should remain usable at mobile viewport.",
            status: mobileStatus,
            weight: 15,
            pointsAwarded: mobileStatus === "partial" ? 8 : 0,
            missing: ["Mobile geometry was not captured; manual viewport review recommended."],
        }),
        buildV2Check({
            id: "ua-interaction-accessibility",
            label: "Interaction accessibility",
            description: "Critical controls should expose accessible names.",
            status: interactionStatus,
            weight: 15,
            pointsAwarded:
                interactionStatus === "passed" ? 15 : interactionStatus === "partial" ? 7 : 0,
            evidence: [
                { type: "derived", label: "Named controls", value: namedButtons.length },
                { type: "derived", label: "Total controls", value: buttons.length },
            ],
        }),
        buildV2Check({
            id: "ua-image-accessibility",
            label: "Image accessibility appropriateness",
            description: "Informative images should have purpose-appropriate alternatives.",
            status: imageStatus,
            weight: 10,
            pointsAwarded: imageStatus === "passed" ? 10 : imageStatus === "partial" ? 5 : 0,
            evidence: [
                { type: "image", label: "Images inspected", value: altCoverage.total },
                { type: "image", label: "Missing alt", value: altCoverage.missing },
            ],
            recommendation:
                imageStatus === "failed"
                    ? "Add descriptive alt text to informative images."
                    : null,
        }),
        buildV2Check({
            id: "ua-page-structure",
            label: "Page structure and scanability",
            description: "Headings and landmarks should support scanning.",
            status: structureStatus,
            weight: 10,
            pointsAwarded:
                structureStatus === "passed" ? 10 : structureStatus === "partial" ? 5 : 0,
            evidence: [
                { type: "page", label: "H1 count", value: h1Count },
                { type: "page", label: "Generic headings", value: genericHeadings },
            ],
        }),
        buildV2Check({
            id: "ua-link-button-clarity",
            label: "Link and button clarity",
            description: "Critical controls should not be empty or icon-only without names.",
            status: linkClarityStatus,
            weight: 5,
            pointsAwarded:
                linkClarityStatus === "passed" ? 5 : linkClarityStatus === "partial" ? 3 : 0,
            evidence: [{ type: "derived", label: "Unnamed buttons", value: unnamedButtons }],
        }),
        buildV2Check({
            id: "ua-form-usability",
            label: "Form interaction usability",
            description: "Forms should expose labels, instructions, and required state.",
            status: formStatus,
            weight: 5,
            pointsAwarded: formStatus === "passed" ? 5 : formStatus === "partial" ? 3 : 0,
            evidence: [
                { type: "form", label: "Labelled fields", value: formLabels.labeled },
                { type: "form", label: "Unlabelled fields", value: formLabels.unlabeled },
            ],
        }),
        buildV2Check({
            id: "ua-feedback-errors",
            label: "Feedback and error communication",
            description: "Validation structures should be inspectable without submitting forms.",
            status: feedbackStatus,
            weight: 3,
            pointsAwarded: feedbackStatus === "partial" ? 2 : 0,
        }),
        buildV2Check({
            id: "ua-cross-device-continuity",
            label: "Cross-device task continuity",
            description: "Essential tasks should remain available across desktop and mobile.",
            status: continuityStatus,
            weight: 2,
            pointsAwarded: continuityStatus === "partial" ? 1 : 0,
            missing: ["Separate mobile DOM capture not available in this audit run."],
        }),
    ];

    return finalizeCategoryV2(checks, "userExperience");
}
