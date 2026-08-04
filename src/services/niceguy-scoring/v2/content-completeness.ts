import { buildV2Check, finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    allVisibleText,
    getHomepage,
    getPageByType,
    hasPlaceholderContent,
    normalizeText,
    textSimilarity,
} from "@/src/services/niceguy-scoring/v2/shared";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreContentCompletenessV2(input: NiceGuyScoringInput) {
    const homepage = getHomepage(input);
    const services = getPageByType(input, "services");
    const about = getPageByType(input, "about");
    const contact = getPageByType(input, "contact");
    const visible = homepage?.visibleText ?? "";
    const placeholders = hasPlaceholderContent(input);

    const homepageDecisionPatterns = [
        "service",
        "contact",
        "quote",
        "book",
        "about",
        "experience",
        "serving",
    ];
    const homepageHits = homepageDecisionPatterns.filter((pattern) =>
        normalizeText(visible).includes(pattern),
    );
    const homepageStatus =
        homepageHits.length >= 4 ? "passed" : homepageHits.length >= 2 ? "partial" : "not_detected";

    const serviceText = services?.visibleText ?? "";
    const serviceStatus = !services
        ? "not_detected"
        : serviceText.length >= 120
          ? "passed"
          : serviceText.length >= 40
            ? "partial"
            : "failed";

    const aboutText = about?.visibleText ?? "";
    const aboutStatus = !about
        ? "not_detected"
        : aboutText.length >= 100
          ? "passed"
          : aboutText.length >= 40
            ? "partial"
            : "failed";

    const contactText = contact?.visibleText ?? "";
    const contactStatus = !contact
        ? "not_detected"
        : contactText.length >= 60
          ? "passed"
          : contactText.length >= 20
            ? "partial"
            : "failed";

    const pagesWithMeta = input.crawl.pageResults.filter(
        (page) => (page.title ?? "").length > 10 && (page.metaDescription ?? "").length > 40,
    );
    const snippetStatus =
        pagesWithMeta.length >= Math.max(1, Math.floor(input.crawl.pageResults.length * 0.6))
            ? "passed"
            : pagesWithMeta.length > 0
              ? "partial"
              : "not_detected";

    const headings = homepage?.headings ?? [];
    const usefulHeadings = headings.filter(
        (heading) => heading.text.trim().length > 4 && !/^(home|welcome|services)$/i.test(heading.text),
    );
    const headingStatus =
        usefulHeadings.length >= 2 ? "passed" : usefulHeadings.length === 1 ? "partial" : "not_detected";

    const contentPages = input.crawl.pageResults.filter(
        (page) => (page.visibleText ?? "").length > 80,
    );
    let maxSimilarity = 0;
    for (let i = 0; i < contentPages.length; i += 1) {
        for (let j = i + 1; j < contentPages.length; j += 1) {
            maxSimilarity = Math.max(
                maxSimilarity,
                textSimilarity(
                    contentPages[i].visibleText ?? "",
                    contentPages[j].visibleText ?? "",
                ),
            );
        }
    }
    const similarityStatus =
        contentPages.length < 2
            ? "not_applicable"
            : maxSimilarity < 0.55
              ? "passed"
              : maxSimilarity < 0.75
                ? "partial"
                : "failed";

    const datePatterns = visible.match(/\b20\d{2}\b/g) ?? [];
    const hasArticlePages = input.crawl.pageResults.some((page) =>
        /blog|news|article|event/i.test(page.path),
    );
    const dateStatus = !hasArticlePages
        ? "not_applicable"
        : datePatterns.length > 0
          ? "partial"
          : "not_detected";

    const integrityStatus =
        placeholders.length === 0 ? "passed" : placeholders.length <= 1 ? "partial" : "failed";

    const title = homepage?.title ?? "";
    const h1 = homepage?.headings.find((heading) => heading.level === 1)?.text ?? "";
    const alignmentScore = textSimilarity(title, h1);
    const alignmentStatus =
        alignmentScore >= 0.25 || normalizeText(title).includes(normalizeText(h1).slice(0, 12))
            ? "passed"
            : title && h1
              ? "partial"
              : "not_detected";

    const detailStatus = homepageHits.length >= 3 ? "passed" : homepage ? "partial" : "unavailable";

    const checks = [
        buildV2Check({
            id: "cc-homepage-decision-support",
            label: "Homepage decision-support",
            description: "Homepage main content should support a visitor decision.",
            status: homepageStatus,
            weight: 20,
            pointsAwarded:
                homepageStatus === "passed" ? 20 : homepageStatus === "partial" ? 10 : 0,
            evidence: homepageHits.map((hit) => ({ type: "content", label: "Decision signal", value: hit })),
        }),
        buildV2Check({
            id: "cc-service-detail",
            label: "Service-detail usefulness",
            description: "Important services should include specific useful detail.",
            status: serviceStatus,
            weight: 20,
            pointsAwarded: serviceStatus === "passed" ? 20 : serviceStatus === "partial" ? 10 : 0,
            evidence: [{ type: "page", label: "Services content length", value: serviceText.length }],
            recommendation:
                serviceStatus !== "passed"
                    ? "Expand service pages with scope, outcomes, and next steps."
                    : null,
        }),
        buildV2Check({
            id: "cc-about-credibility",
            label: "About credibility content",
            description: "About content should communicate meaningful identity and experience.",
            status: aboutStatus,
            weight: 10,
            pointsAwarded: aboutStatus === "passed" ? 10 : aboutStatus === "partial" ? 5 : 0,
            evidence: [{ type: "page", label: "About content length", value: aboutText.length }],
        }),
        buildV2Check({
            id: "cc-contact-expectations",
            label: "Contact expectation clarity",
            description: "Contact pages should explain methods, hours, and response expectations.",
            status: contactStatus,
            weight: 10,
            pointsAwarded: contactStatus === "passed" ? 10 : contactStatus === "partial" ? 5 : 0,
            evidence: [{ type: "page", label: "Contact content length", value: contactText.length }],
        }),
        buildV2Check({
            id: "cc-search-snippet",
            label: "Search-snippet completeness",
            description: "Indexable pages should have descriptive title and meta description.",
            status: snippetStatus,
            weight: 10,
            pointsAwarded: snippetStatus === "passed" ? 10 : snippetStatus === "partial" ? 5 : 0,
            evidence: [
                {
                    type: "page",
                    label: "Pages with title + description",
                    value: pagesWithMeta.length,
                },
            ],
        }),
        buildV2Check({
            id: "cc-section-headings",
            label: "Descriptive section headings",
            description: "Headings should communicate subject value when scanned.",
            status: headingStatus,
            weight: 5,
            pointsAwarded: headingStatus === "passed" ? 5 : headingStatus === "partial" ? 3 : 0,
            evidence: usefulHeadings.map((heading) => ({
                type: "page",
                label: `H${heading.level}`,
                value: heading.text,
            })),
        }),
        buildV2Check({
            id: "cc-main-content-similarity",
            label: "Main-content similarity",
            description: "Important pages should not reuse the same main content.",
            status: similarityStatus,
            weight: 10,
            pointsAwarded:
                similarityStatus === "passed" ? 10 : similarityStatus === "partial" ? 5 : 0,
            evidence: [{ type: "derived", label: "Highest similarity score", value: maxSimilarity }],
            recommendation:
                similarityStatus === "failed"
                    ? "Differentiate service or landing pages with unique main content."
                    : null,
        }),
        buildV2Check({
            id: "cc-date-integrity",
            label: "Date integrity",
            description: "Date-sensitive content should expose meaningful dates when applicable.",
            status: dateStatus,
            weight: 5,
            pointsAwarded: dateStatus === "partial" ? 3 : 0,
            evidence: datePatterns.map((year) => ({ type: "content", label: "Year detected", value: year })),
            missing:
                dateStatus === "not_detected"
                    ? ["Copyright year alone does not prove content freshness."]
                    : [],
        }),
        buildV2Check({
            id: "cc-content-integrity",
            label: "Content integrity",
            description: "Placeholder, token, or broken template text should not appear in major sections.",
            status: integrityStatus,
            weight: 5,
            pointsAwarded:
                integrityStatus === "passed" ? 5 : integrityStatus === "partial" ? 3 : 0,
            evidence: placeholders.map((item) => ({
                type: "content",
                label: "Placeholder detected",
                value: item,
            })),
            recommendation:
                integrityStatus !== "passed"
                    ? "Remove placeholder or template text before publishing."
                    : null,
        }),
        buildV2Check({
            id: "cc-content-intent-alignment",
            label: "Content-to-intent alignment",
            description: "Title, heading, and delivered content should align.",
            status: alignmentStatus,
            weight: 3,
            pointsAwarded: alignmentStatus === "passed" ? 3 : alignmentStatus === "partial" ? 2 : 0,
            evidence: [
                { type: "page", label: "Title", value: title },
                { type: "page", label: "H1", value: h1 },
            ],
        }),
        buildV2Check({
            id: "cc-detail-completeness",
            label: "Important-detail completeness",
            description: "Business-type-specific details should appear when relevant.",
            status: detailStatus,
            weight: 2,
            pointsAwarded: detailStatus === "passed" ? 2 : detailStatus === "partial" ? 1 : 0,
            evidence: [{ type: "derived", label: "Homepage decision signals", value: homepageHits.length }],
        }),
    ];

    return finalizeCategoryV2(checks, "contentQuality");
}
