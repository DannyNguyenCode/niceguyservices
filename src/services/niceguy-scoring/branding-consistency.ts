/**
 * Branding and visual consistency scoring uses deterministic crawl evidence only.
 * Visual-brand analysis from screenshots belongs in a later phase.
 */
import {
    allButtons,
    buildCheck,
    finalizeCategory,
    getHomepage,
    normalizeText,
} from "@/src/services/niceguy-scoring/helpers";
import type { CategoryScore, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

function normalizeBusinessToken(value: string): string {
    return normalizeText(value).replace(/[^\w\s]/g, "");
}

export function scoreBrandingConsistency(input: NiceGuyScoringInput): CategoryScore {
    const homepage = getHomepage(input);
    const businessName = normalizeBusinessToken(input.website.businessName || "");
    const titleTokens = input.crawl.pageResults.map((page) => normalizeText(page.title ?? ""));
    const uniqueTitles = new Set(titleTokens.filter(Boolean));
    const duplicateTitles = titleTokens.length - uniqueTitles.size;
    const phoneValues = input.crawl.phoneNumbersFound.map(normalizeText);
    const emailValues = input.crawl.emailsFound.map(normalizeText);
    const uniquePhones = new Set(phoneValues.filter(Boolean));
    const uniqueEmails = new Set(emailValues.filter(Boolean));
    const ctaTexts = allButtons(input).map((button) => normalizeText(button.text)).filter(Boolean);
    const uniqueCtas = new Set(ctaTexts);
    const logoImages = input.crawl.pageResults.flatMap((page) =>
        page.images
            .filter((image) => {
                const alt = normalizeText(image.alt);
                const src = normalizeText(image.src);
                return alt.includes("logo") || alt.includes("brand") || src.includes("logo");
            })
            .map((image) => ({ ...image, pageUrl: page.url })),
    );
    const pagesWithMeta = input.crawl.pageResults.filter(
        (page) => (page.metaDescription ?? "").trim().length > 0,
    ).length;
    const placeholderImages = input.crawl.pageResults.flatMap((page) =>
        page.images.filter((image) =>
            /placeholder|dummy|via\.placeholder|picsum|lorem/i.test(image.src ?? ""),
        ),
    );

    const nameUsages = [
        input.crawl.homepageTitle,
        homepage?.headings.find((heading) => heading.level === 1)?.text,
        homepage?.visibleText,
    ]
        .map((value) => normalizeBusinessToken(value ?? ""))
        .filter((value) => value && businessName && value.includes(businessName));

    const checks = [
        buildCheck({
            id: "branding-name-consistency",
            label: "Business name consistency",
            description: "Business name usage should be consistent across key elements.",
            status:
                !businessName
                    ? "partial"
                    : nameUsages.length >= 2
                      ? "passed"
                      : nameUsages.length === 1
                        ? "partial"
                        : "failed",
            weight: 20,
            pointsAwarded:
                !businessName ? 10 : nameUsages.length >= 2 ? 20 : nameUsages.length === 1 ? 10 : 0,
            evidence: nameUsages.map((value) => ({
                type: "derived",
                label: "Business name usage",
                value,
            })),
            missing: businessName && nameUsages.length === 0 ? ["Business name not consistently visible"] : [],
            recommendation:
                businessName && nameUsages.length < 2
                    ? "Use the business name consistently in the title, H1, and key page content."
                    : null,
        }),
        buildCheck({
            id: "branding-title-consistency",
            label: "Page title consistency",
            description: "Page titles should be present and not duplicated across every page.",
            status:
                uniqueTitles.size >= Math.max(1, input.crawl.pageResults.length - 1)
                    ? "passed"
                    : uniqueTitles.size > 0
                      ? "partial"
                      : "failed",
            weight: 15,
            pointsAwarded:
                uniqueTitles.size >= Math.max(1, input.crawl.pageResults.length - 1)
                    ? 15
                    : uniqueTitles.size > 0
                      ? 8
                      : 0,
            evidence: [
                { type: "page", label: "Unique page titles", value: uniqueTitles.size },
                { type: "page", label: "Duplicate title signals", value: duplicateTitles },
            ],
            missing: uniqueTitles.size === 0 ? ["Page titles are missing"] : [],
            recommendation:
                duplicateTitles > 0
                    ? "Use distinct page titles that reflect each page's purpose."
                    : null,
        }),
        buildCheck({
            id: "branding-logo-evidence",
            label: "Logo or brand image alt evidence",
            description: "Logo-related image evidence is a weak but useful branding signal.",
            status: logoImages.length > 0 ? "passed" : "partial",
            weight: 10,
            pointsAwarded: logoImages.length > 0 ? 10 : 5,
            evidence: logoImages.slice(0, 3).map((image) => ({
                type: "image",
                label: "Logo-related image",
                value: image.alt || image.src || null,
                pageUrl: image.pageUrl,
            })),
            missing: [],
            recommendation: null,
            priority: "low",
        }),
        buildCheck({
            id: "branding-cta-language",
            label: "Consistent CTA language",
            description: "CTA wording should be reasonably consistent across pages.",
            status:
                ctaTexts.length === 0
                    ? "partial"
                    : uniqueCtas.size <= Math.max(2, Math.ceil(ctaTexts.length / 2))
                      ? "passed"
                      : "partial",
            weight: 15,
            pointsAwarded:
                ctaTexts.length === 0
                    ? 7
                    : uniqueCtas.size <= Math.max(2, Math.ceil(ctaTexts.length / 2))
                      ? 15
                      : 8,
            evidence: [
                { type: "link", label: "Unique CTA phrases", value: uniqueCtas.size },
            ],
            missing: [],
            recommendation:
                uniqueCtas.size > 4
                    ? "Use a consistent set of CTA phrases across key pages."
                    : null,
        }),
        buildCheck({
            id: "branding-contact-consistency",
            label: "Consistent contact information",
            description: "Repeated phone numbers and emails should remain consistent.",
            status:
                uniquePhones.size <= 1 && uniqueEmails.size <= 1
                    ? "passed"
                    : uniquePhones.size <= 2 && uniqueEmails.size <= 2
                      ? "partial"
                      : "failed",
            weight: 15,
            pointsAwarded:
                uniquePhones.size <= 1 && uniqueEmails.size <= 1
                    ? 15
                    : uniquePhones.size <= 2 && uniqueEmails.size <= 2
                      ? 8
                      : 0,
            evidence: [
                { type: "contact", label: "Unique phone values", value: uniquePhones.size },
                { type: "contact", label: "Unique email values", value: uniqueEmails.size },
            ],
            missing:
                uniquePhones.size > 1 || uniqueEmails.size > 1
                    ? ["Conflicting contact information detected"]
                    : [],
            recommendation:
                uniquePhones.size > 1 || uniqueEmails.size > 1
                    ? "Use one consistent phone number and email address across the website."
                    : null,
        }),
        buildCheck({
            id: "branding-image-hygiene",
            label: "Image quality hygiene",
            description: "Images should avoid obvious placeholders and missing alt text.",
            status:
                placeholderImages.length === 0
                    ? "passed"
                    : placeholderImages.length <= 1
                      ? "partial"
                      : "failed",
            weight: 10,
            pointsAwarded:
                placeholderImages.length === 0 ? 10 : placeholderImages.length <= 1 ? 5 : 0,
            evidence: [
                {
                    type: "image",
                    label: "Placeholder image signals",
                    value: placeholderImages.length,
                },
            ],
            missing:
                placeholderImages.length > 0 ? ["Placeholder images detected"] : [],
            recommendation:
                placeholderImages.length > 0
                    ? "Replace placeholder images with real business imagery."
                    : null,
        }),
        buildCheck({
            id: "branding-metadata-consistency",
            label: "Metadata consistency",
            description: "Titles and meta descriptions should support consistent business identity.",
            status:
                pagesWithMeta >= Math.max(1, Math.floor(input.crawl.pageResults.length / 2))
                    ? "passed"
                    : pagesWithMeta > 0
                      ? "partial"
                      : "failed",
            weight: 15,
            pointsAwarded:
                pagesWithMeta >= Math.max(1, Math.floor(input.crawl.pageResults.length / 2))
                    ? 15
                    : pagesWithMeta > 0
                      ? 8
                      : 0,
            evidence: [
                {
                    type: "page",
                    label: "Pages with meta descriptions",
                    value: pagesWithMeta,
                },
            ],
            missing:
                pagesWithMeta === 0 ? ["Meta descriptions are missing on crawled pages"] : [],
            recommendation:
                pagesWithMeta < input.crawl.pageResults.length
                    ? "Add unique meta descriptions to key pages."
                    : null,
        }),
    ];

    return finalizeCategory(checks);
}
