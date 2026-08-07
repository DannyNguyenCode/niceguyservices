import {
    buildCheck,
    finalizeCategory,
    findActionCtas,
    getHomepage,
    hasLocationEvidence,
    hasServiceOffering,
    isGenericTitle,
    normalizeText,
} from "@/src/services/niceguy-scoring/helpers";
import type { CategoryScore, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export function scoreBusinessClarity(input: NiceGuyScoringInput): CategoryScore {
    const homepage = getHomepage(input);
    const title = input.crawl.homepageTitle || homepage?.title || "";
    const metaDescription = input.crawl.metaDescription || homepage?.metaDescription || "";
    const h1s = (homepage?.headings ?? []).filter((heading) => heading.level === 1);
    const businessName = normalizeText(input.website.businessName);
    const actionCtas = findActionCtas(input);

    const checks = [
        buildCheck({
            id: "business-title-clear",
            label: "Clear homepage title",
            description: "Homepage title should describe the business and service.",
            status: !title
                ? "failed"
                : isGenericTitle(title)
                  ? title.length > 10
                      ? "partial"
                      : "failed"
                  : title.length <= 10
                    ? "partial"
                    : "passed",
            weight: 15,
            pointsAwarded: !title
                ? 0
                : isGenericTitle(title)
                  ? title.length > 10
                      ? 7
                      : 0
                  : title.length <= 10
                    ? 7
                    : 15,
            evidence: title
                ? [{ type: "page", label: "Homepage title", value: title }]
                : [],
            missing: !title ? ["Homepage title is missing"] : [],
            recommendation:
                !title || isGenericTitle(title)
                    ? "Use a descriptive page title that includes the business name and primary service."
                    : null,
        }),
        buildCheck({
            id: "business-meta-description",
            label: "Meta description present",
            description: "Homepage meta description should be present and useful.",
            status: !metaDescription
                ? "failed"
                : metaDescription.length < 70 || metaDescription.length > 180
                  ? "partial"
                  : "passed",
            weight: 10,
            pointsAwarded: !metaDescription ? 0 : metaDescription.length < 70 || metaDescription.length > 180 ? 5 : 10,
            evidence: metaDescription
                ? [{ type: "page", label: "Meta description length", value: metaDescription.length }]
                : [],
            missing: !metaDescription ? ["Meta description is missing"] : [],
            recommendation: !metaDescription
                ? "Add a concise meta description that explains what the business offers."
                : null,
        }),
        buildCheck({
            id: "business-primary-heading",
            label: "Primary heading present",
            description: "Homepage should include a clear H1 heading.",
            status:
                h1s.length === 0
                    ? "failed"
                    : h1s.length > 1 || (h1s[0] && h1s[0].text.trim().length < 5)
                      ? "partial"
                      : isGenericTitle(h1s[0]?.text ?? "")
                        ? "partial"
                        : "passed",
            weight: 15,
            pointsAwarded:
                h1s.length === 0
                    ? 0
                    : h1s.length > 1 || (h1s[0] && h1s[0].text.trim().length < 5)
                      ? 8
                      : isGenericTitle(h1s[0]?.text ?? "")
                        ? 8
                        : 15,
            evidence: h1s.map((heading) => ({
                type: "page",
                label: "Homepage H1",
                value: heading.text,
            })),
            missing: h1s.length === 0 ? ["No H1 heading found on homepage"] : [],
            recommendation:
                h1s.length === 0
                    ? "Add a clear H1 heading that states what the business does."
                    : null,
        }),
        buildCheck({
            id: "business-service-offering",
            label: "Service offering is identifiable",
            description: "Visitors should be able to identify what services are offered.",
            status: hasServiceOffering(input) ? "passed" : "failed",
            weight: 20,
            pointsAwarded: hasServiceOffering(input) ? 20 : 0,
            evidence: hasServiceOffering(input)
                ? [
                      {
                          type: "page",
                          label: "Services evidence detected",
                          value: input.crawl.hasServicesPage
                              ? "Services page found"
                              : "Service-oriented content found",
                      },
                  ]
                : [],
            missing: hasServiceOffering(input) ? [] : ["No clear services offering detected"],
            recommendation: hasServiceOffering(input)
                ? null
                : "Create a services page or clearly describe your services on the homepage.",
        }),
        (() => {
            const location = hasLocationEvidence(input);
            return buildCheck({
                id: "business-location-visible",
                label: "Location or service area visible",
                description: "Visitors should understand where the business operates.",
                status: location.found ? "passed" : location.partial ? "partial" : "unavailable",
                weight: 10,
                pointsAwarded: location.found ? 10 : location.partial ? 5 : 0,
                evidence: location.evidence,
                missing:
                    location.found || location.partial
                        ? []
                        : ["No location or service area evidence found"],
                recommendation:
                    !location.found && !location.partial
                        ? "Mention your city, service area, or operating region on the homepage or contact page."
                        : null,
            });
        })(),
        buildCheck({
            id: "business-name-visible",
            label: "Business name visible",
            description: "Business name should appear in key homepage elements.",
            status: !businessName
                ? "partial"
                : [title, h1s[0]?.text ?? "", homepage?.visibleText ?? ""].some((value) =>
                        normalizeText(value).includes(businessName),
                    )
                  ? "passed"
                  : "failed",
            weight: 10,
            pointsAwarded: !businessName
                ? 5
                : [title, h1s[0]?.text ?? "", homepage?.visibleText ?? ""].some((value) =>
                        normalizeText(value).includes(businessName),
                    )
                  ? 10
                  : 0,
            evidence: businessName
                ? [{ type: "derived", label: "Stored business name", value: input.website.businessName }]
                : [{ type: "derived", label: "Business name inferred from title", value: title }],
            missing: [],
            recommendation:
                businessName &&
                ![title, h1s[0]?.text ?? ""].some((value) =>
                    normalizeText(value).includes(businessName),
                )
                    ? "Make the business name visible in the homepage title or main heading."
                    : null,
        }),
        buildCheck({
            id: "business-clear-next-step",
            label: "Clear next step",
            description: "Homepage should include a clear primary call-to-action.",
            status: actionCtas.length > 0 ? "passed" : "failed",
            weight: 20,
            pointsAwarded: actionCtas.length > 0 ? 20 : 0,
            evidence: actionCtas.slice(0, 3).map((cta) => ({
                type: "link",
                label: "CTA detected",
                value: cta,
            })),
            missing: actionCtas.length > 0 ? [] : ["No clear primary CTA detected"],
            recommendation:
                actionCtas.length === 0
                    ? 'Add a clear primary call-to-action on the homepage, such as "Request a Quote" or "Book an Appointment."'
                    : null,
            priority: actionCtas.length === 0 ? "high" : null,
        }),
    ];

    return finalizeCategory(checks);
}
