import { buildV2Check, finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    allButtons,
    collectAllImages,
    getHomepage,
    isStrongCta,
    normalizeText,
    textSimilarity,
} from "@/src/services/niceguy-scoring/v2/shared";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreBrandingConsistencyV2(input: NiceGuyScoringInput, hasScreenshots: boolean) {
    const homepage = getHomepage(input);
    const businessName = normalizeText(input.website.businessName);
    const titles = input.crawl.pageResults
        .map((page) => page.title ?? "")
        .filter((title) => title.length > 0);
    const titleConsistency =
        titles.length <= 1
            ? 1
            : titles.every(
                  (title) =>
                      textSimilarity(title, titles[0]) >= 0.3 ||
                      normalizeText(title).includes(businessName),
              )
            ? 0.8
            : 0.4;
    const images = collectAllImages(input);
    const logoCandidates = images.filter(
        (image) =>
            normalizeText(image.alt).includes("logo") ||
            (image.src ?? "").toLowerCase().includes("logo"),
    );
    const buttons = allButtons(input);
    const ctaLabels = buttons.map((button) => normalizeText(button.text)).filter(Boolean);
    const uniqueCtas = new Set(ctaLabels.filter((label) => isStrongCta(label)));

    const screenshotLimited = !hasScreenshots;

    const identityStatus =
        businessName && titles.some((title) => normalizeText(title).includes(businessName))
            ? "passed"
            : businessName
              ? "partial"
              : "not_detected";

    const hierarchyStatus = screenshotLimited ? "unavailable" : "partial";
    const logoStatus =
        logoCandidates.length > 0
            ? logoCandidates.some((logo) => (logo.alt ?? "").length > 0)
                ? "passed"
                : "partial"
            : "not_detected";
    const ctaSystemStatus =
        uniqueCtas.size <= 2 && uniqueCtas.size > 0
            ? "passed"
            : uniqueCtas.size > 0
              ? "partial"
              : "not_detected";

    const hasPhone = input.crawl.phoneNumbersFound.length > 0;
    const hasEmail = input.crawl.emailsFound.length > 0;
    const contactIntegrityStatus =
        !hasPhone && !hasEmail
            ? "not_applicable"
            : hasPhone && hasEmail
              ? "passed"
              : "partial";

    const brokenImages = images.filter((image) => !(image.src ?? "").trim()).length;
    const imageryStatus =
        images.length === 0
            ? "not_applicable"
            : brokenImages === 0
              ? "passed"
              : "partial";

    const designSystemStatus = screenshotLimited ? "unavailable" : "partial";
    const paletteStatus = screenshotLimited ? "unavailable" : "partial";
    const typographyStatus = screenshotLimited ? "unavailable" : "partial";
    const spacingStatus = screenshotLimited ? "unavailable" : "partial";
    const continuityStatus = screenshotLimited ? "unavailable" : "partial";

    const checks = [
        buildV2Check({
            id: "bv-identity-consistency",
            label: "Brand identity consistency",
            description: "Visible business name and title patterns should align.",
            status: identityStatus,
            weight: 15,
            pointsAwarded:
                identityStatus === "passed" ? 15 : identityStatus === "partial" ? 7 : 0,
            evidence: [{ type: "page", label: "Titles inspected", value: titles.length }],
        }),
        buildV2Check({
            id: "bv-visual-hierarchy",
            label: "Visual hierarchy consistency",
            description: "Heading, copy, and CTA emphasis should be consistent across viewports.",
            status: hierarchyStatus,
            weight: 15,
            pointsAwarded: hierarchyStatus === "partial" ? 8 : 0,
            missing: screenshotLimited
                ? ["Screenshots required for visual hierarchy scoring."]
                : ["AI-assisted visual review recommended for hierarchy judgments."],
        }),
        buildV2Check({
            id: "bv-logo-quality",
            label: "Logo usage quality",
            description: "Logo candidates should be visible with accessible naming context.",
            status: logoStatus,
            weight: 10,
            pointsAwarded: logoStatus === "passed" ? 10 : logoStatus === "partial" ? 5 : 0,
            evidence: logoCandidates.map((logo) => ({
                type: "image",
                label: "Logo candidate",
                value: logo.alt || logo.src,
                pageUrl: logo.pageUrl,
            })),
        }),
        buildV2Check({
            id: "bv-cta-system",
            label: "CTA-system consistency",
            description: "Equivalent intent classes should use consistent labels and hierarchy.",
            status: ctaSystemStatus,
            weight: 10,
            pointsAwarded:
                ctaSystemStatus === "passed" ? 10 : ctaSystemStatus === "partial" ? 5 : 0,
            evidence: [{ type: "derived", label: "Distinct strong CTA labels", value: uniqueCtas.size }],
        }),
        buildV2Check({
            id: "bv-contact-integrity",
            label: "Contact-detail integrity",
            description: "Detected contact values should be normalized and non-empty when present.",
            status: contactIntegrityStatus,
            weight: 5,
            pointsAwarded:
                contactIntegrityStatus === "passed"
                    ? 5
                    : contactIntegrityStatus === "partial"
                      ? 3
                      : 0,
            evidence: [
                { type: "contact", label: "Phones", value: input.crawl.phoneNumbersFound.join(", ") },
                { type: "contact", label: "Emails", value: input.crawl.emailsFound.join(", ") },
            ],
        }),
        buildV2Check({
            id: "bv-imagery-quality",
            label: "Imagery consistency and quality",
            description: "Broken or placeholder images reduce visual consistency.",
            status: imageryStatus,
            weight: 10,
            pointsAwarded: imageryStatus === "passed" ? 10 : imageryStatus === "partial" ? 5 : 0,
            evidence: [{ type: "image", label: "Broken image candidates", value: brokenImages }],
        }),
        buildV2Check({
            id: "bv-design-system",
            label: "Design-system consistency",
            description: "Comparable components should share radius, spacing, and typography roles.",
            status: designSystemStatus,
            weight: 15,
            pointsAwarded: designSystemStatus === "partial" ? 8 : 0,
            missing: screenshotLimited
                ? ["Screenshots required for design-system comparison."]
                : ["Deterministic geometry limited; AI-assisted review recommended."],
        }),
        buildV2Check({
            id: "bv-colour-palette",
            label: "Colour-palette consistency",
            description: "Role-based colours should remain consistent across comparable sections.",
            status: paletteStatus,
            weight: 5,
            pointsAwarded: paletteStatus === "partial" ? 3 : 0,
            missing: ["Screenshot colour analysis not available in this audit run."],
        }),
        buildV2Check({
            id: "bv-typography",
            label: "Typography consistency",
            description: "Font families and roles should remain consistent across pages.",
            status: typographyStatus,
            weight: 5,
            pointsAwarded: typographyStatus === "partial" ? 3 : 0,
            missing: ["Computed font capture not available in this audit run."],
        }),
        buildV2Check({
            id: "bv-spacing-rhythm",
            label: "Spacing/component rhythm",
            description: "Section gaps and container padding should follow a recognizable rhythm.",
            status: spacingStatus,
            weight: 5,
            pointsAwarded: spacingStatus === "partial" ? 3 : 0,
            missing: ["Layout geometry requires screenshot or computed-style capture."],
        }),
        buildV2Check({
            id: "bv-desktop-mobile-continuity",
            label: "Desktop/mobile continuity",
            description: "Brand identity and CTA hierarchy should remain recognizable across viewports.",
            status: continuityStatus,
            weight: 5,
            pointsAwarded: continuityStatus === "partial" ? 3 : 0,
            missing: ["Both desktop and mobile screenshots are required for full continuity scoring."],
        }),
    ];

    return finalizeCategoryV2(checks, "brandingConsistency");
}
