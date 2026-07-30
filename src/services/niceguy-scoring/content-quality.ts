import {
    buildCheck,
    finalizeCategory,
    getHomepage,
    getPageByType,
    hasPlaceholderContent,
    isGenericHeading,
    textSimilarity,
} from "@/src/services/niceguy-scoring/helpers";
import type { CategoryScore, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreContentQuality(input: NiceGuyScoringInput): CategoryScore {
    const homepage = getHomepage(input);
    const aboutPage = getPageByType(input, "about");
    const contactPage = getPageByType(input, "contact");
    const servicesPages = input.crawl.pageResults.filter(
        (page) => page.pageType === "services" || page.pageType === "service-detail",
    );
    const homepageLength = (homepage?.visibleText ?? "").trim().length;
    const aboutLength = (aboutPage?.visibleText ?? "").trim().length;
    const contactLength = (contactPage?.visibleText ?? "").trim().length;
    const pagesWithTitle = input.crawl.pageResults.filter((page) => (page.title ?? "").trim()).length;
    const pagesWithMeta = input.crawl.pageResults.filter(
        (page) => (page.metaDescription ?? "").trim(),
    ).length;
    const descriptiveHeadings = input.crawl.pageResults.flatMap((page) =>
        page.headings.filter(
            (heading) =>
                heading.text.trim().length >= 4 && !isGenericHeading(heading.text),
        ),
    );
    const duplicatePairs: string[] = [];
    const pages = input.crawl.pageResults;
    for (let i = 0; i < pages.length; i += 1) {
        for (let j = i + 1; j < pages.length; j += 1) {
            const similarity = textSimilarity(
                pages[i]?.visibleText ?? "",
                pages[j]?.visibleText ?? "",
            );
            if (similarity >= 0.75) {
                duplicatePairs.push(`${pages[i]?.path} ↔ ${pages[j]?.path}`);
            }
        }
    }
    const freshnessSignals = /\b20(1\d|2\d)\b|updated|recent|latest/i.test(
        input.crawl.pageResults.map((page) => page.visibleText ?? "").join(" "),
    );
    const placeholders = hasPlaceholderContent(input);

    const checks = [
        buildCheck({
            id: "content-homepage-depth",
            label: "Homepage content depth",
            description: "Homepage should include enough content to explain the business.",
            status:
                homepageLength < 150
                    ? "failed"
                    : homepageLength < 400
                      ? "partial"
                      : "passed",
            weight: 15,
            pointsAwarded:
                homepageLength < 150 ? 0 : homepageLength < 400 ? 8 : 15,
            evidence: [
                {
                    type: "content",
                    label: "Homepage visible text length",
                    value: homepageLength,
                },
            ],
            missing: homepageLength < 150 ? ["Homepage content is very thin"] : [],
            recommendation:
                homepageLength < 400
                    ? "Expand homepage content to explain services, service area, and next steps."
                    : null,
        }),
        buildCheck({
            id: "content-services",
            label: "Services content",
            description: "Services content should help visitors understand offerings.",
            status:
                servicesPages.length >= 2
                    ? "passed"
                    : servicesPages.length === 1
                      ? "partial"
                      : "failed",
            weight: 20,
            pointsAwarded:
                servicesPages.length >= 2 ? 20 : servicesPages.length === 1 ? 10 : 0,
            evidence: [
                {
                    type: "page",
                    label: "Services-related pages",
                    value: servicesPages.length,
                },
            ],
            missing: servicesPages.length === 0 ? ["No services content detected"] : [],
            recommendation:
                servicesPages.length === 0
                    ? "Add a services page with clear service names and descriptions."
                    : null,
        }),
        buildCheck({
            id: "content-about",
            label: "About content",
            description: "About page should include meaningful business information.",
            status:
                aboutLength >= 250 ? "passed" : aboutLength >= 100 ? "partial" : "failed",
            weight: 10,
            pointsAwarded: aboutLength >= 250 ? 10 : aboutLength >= 100 ? 5 : 0,
            evidence: [
                { type: "content", label: "About page text length", value: aboutLength },
            ],
            missing: aboutLength < 100 ? ["About page content is thin or missing"] : [],
            recommendation:
                aboutLength < 250
                    ? "Expand the About page with company background and credibility details."
                    : null,
        }),
        buildCheck({
            id: "content-contact",
            label: "Contact content",
            description: "Contact page should include actionable contact information.",
            status:
                contactLength >= 80 &&
                (input.crawl.emailsFound.length > 0 || input.crawl.phoneNumbersFound.length > 0)
                    ? "passed"
                    : contactPage
                      ? "partial"
                      : "failed",
            weight: 10,
            pointsAwarded:
                contactLength >= 80 &&
                (input.crawl.emailsFound.length > 0 || input.crawl.phoneNumbersFound.length > 0)
                    ? 10
                    : contactPage
                      ? 5
                      : 0,
            evidence: [
                { type: "content", label: "Contact page text length", value: contactLength },
            ],
            missing: !contactPage ? ["Contact page content not found"] : [],
            recommendation:
                !contactPage || contactLength < 80
                    ? "Make the contact page actionable with phone, email, and clear instructions."
                    : null,
        }),
        buildCheck({
            id: "content-metadata-coverage",
            label: "Metadata coverage",
            description: "Crawled pages should include titles and meta descriptions.",
            status:
                pagesWithTitle >= input.crawl.pageResults.length &&
                pagesWithMeta >= Math.max(1, Math.floor(input.crawl.pageResults.length / 2))
                    ? "passed"
                    : pagesWithTitle > 0
                      ? "partial"
                      : "failed",
            weight: 15,
            pointsAwarded:
                pagesWithTitle >= input.crawl.pageResults.length &&
                pagesWithMeta >= Math.max(1, Math.floor(input.crawl.pageResults.length / 2))
                    ? 15
                    : pagesWithTitle > 0
                      ? 8
                      : 0,
            evidence: [
                { type: "page", label: "Pages with titles", value: pagesWithTitle },
                { type: "page", label: "Pages with meta descriptions", value: pagesWithMeta },
            ],
            missing: pagesWithTitle === 0 ? ["Page titles are missing"] : [],
            recommendation:
                pagesWithMeta < input.crawl.pageResults.length
                    ? "Add unique titles and meta descriptions across key pages."
                    : null,
        }),
        buildCheck({
            id: "content-heading-usefulness",
            label: "Heading usefulness",
            description: "Headings should be descriptive and useful.",
            status:
                descriptiveHeadings.length >= 4
                    ? "passed"
                    : descriptiveHeadings.length >= 1
                      ? "partial"
                      : "failed",
            weight: 10,
            pointsAwarded:
                descriptiveHeadings.length >= 4
                    ? 10
                    : descriptiveHeadings.length >= 1
                      ? 5
                      : 0,
            evidence: [
                {
                    type: "content",
                    label: "Descriptive headings",
                    value: descriptiveHeadings.length,
                },
            ],
            missing:
                descriptiveHeadings.length === 0
                    ? ["Headings are generic or missing"]
                    : [],
            recommendation:
                descriptiveHeadings.length < 4
                    ? "Use descriptive headings that explain sections and services."
                    : null,
        }),
        buildCheck({
            id: "content-duplicate-signals",
            label: "Duplicate content signals",
            description: "Pages with highly similar visible text may confuse visitors.",
            status:
                duplicatePairs.length === 0
                    ? "passed"
                    : duplicatePairs.length === 1
                      ? "partial"
                      : "failed",
            weight: 10,
            pointsAwarded:
                duplicatePairs.length === 0 ? 10 : duplicatePairs.length === 1 ? 5 : 0,
            evidence: duplicatePairs.slice(0, 3).map((pair) => ({
                type: "derived",
                label: "Likely duplicate content",
                value: pair,
            })),
            missing:
                duplicatePairs.length > 0 ? ["Similar content detected across pages"] : [],
            recommendation:
                duplicatePairs.length > 0
                    ? "Differentiate page content so each page serves a distinct purpose."
                    : null,
        }),
        buildCheck({
            id: "content-freshness",
            label: "Content freshness signals",
            description: "Visible freshness signals are optional and lightly weighted.",
            status: freshnessSignals ? "passed" : "partial",
            weight: 5,
            pointsAwarded: freshnessSignals ? 5 : 3,
            evidence: [
                {
                    type: "content",
                    label: "Freshness signal detected",
                    value: freshnessSignals,
                },
            ],
            missing: [],
            recommendation: null,
            priority: "low",
        }),
        buildCheck({
            id: "content-placeholder-text",
            label: "Broken or placeholder content",
            description: "Placeholder text undermines content quality.",
            status: placeholders.length === 0 ? "passed" : "failed",
            weight: 5,
            pointsAwarded: placeholders.length === 0 ? 5 : 0,
            evidence: placeholders.slice(0, 3).map((pattern) => ({
                type: "content",
                label: "Placeholder pattern",
                value: pattern,
            })),
            missing: placeholders.length > 0 ? ["Placeholder content detected"] : [],
            recommendation:
                placeholders.length > 0
                    ? "Replace placeholder or unfinished content with real business copy."
                    : null,
        }),
    ];

    return finalizeCategory(checks);
}
