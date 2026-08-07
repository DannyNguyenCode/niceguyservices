import { ACTION_CTAS } from "@/src/services/niceguy-scoring/dictionaries";
import {
    allButtons,
    allForms,
    buildCheck,
    finalizeCategory,
    findActionCtas,
    findStrongCtas,
    getHomepage,
    getPageByType,
    isStrongCta,
    isWeakCta,
    normalizeText,
} from "@/src/services/niceguy-scoring/helpers";
import type { CategoryScore, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

function countContactMethods(input: NiceGuyScoringInput): number {
    let count = 0;
    if (input.crawl.phoneNumbersFound.length > 0) count += 1;
    if (input.crawl.emailsFound.length > 0) count += 1;
    if (allForms(input).length > 0) count += 1;
    const bookingLinks = allButtons(input).filter((button) =>
        normalizeText(button.text).includes("book"),
    );
    if (bookingLinks.length > 0) count += 1;
    return count;
}

function evaluateFormQuality(
    forms: ReturnType<typeof allForms>,
): { status: "passed" | "partial" | "failed"; points: number; evidence: string[]; missing: string[] } {
    if (forms.length === 0) {
        return { status: "failed", points: 0, evidence: [], missing: ["No form detected"] };
    }

    const form = forms[0];
    const fieldCount = form.fields.length;
    const hasSubmit = form.fields.some((field) => field.type === "submit") || fieldCount > 0;
    const hasContactField = form.fields.some((field) =>
        ["email", "tel", "phone"].includes(normalizeText(field.type)),
    );
    const labeledFields = form.fields.filter((field) => field.label?.trim()).length;
    const missing: string[] = [];
    let points = 10;

    if (fieldCount > 12) {
        points -= 4;
        missing.push("Form has too many fields");
    }
    if (!hasContactField) {
        points -= 3;
        missing.push("No email or phone field detected");
    }
    if (labeledFields < Math.max(1, fieldCount - 1)) {
        points -= 2;
        missing.push("Some form fields appear unlabeled");
    }
    if (!hasSubmit) {
        points -= 3;
        missing.push("No submit control detected");
    }

    points = Math.max(0, points);
    return {
        status: points >= 8 ? "passed" : points >= 4 ? "partial" : "failed",
        points,
        evidence: [`Fields: ${fieldCount}`, `Labeled fields: ${labeledFields}`],
        missing,
    };
}

export function scoreConversionReadiness(input: NiceGuyScoringInput): CategoryScore {
    const homepage = getHomepage(input);
    const homepageButtons = allButtons(input).filter((button) => button.pageUrl === homepage?.url);
    const strongHomepageCtas = homepageButtons.filter((button) => isStrongCta(button.text));
    const actionCtas = findActionCtas(input);
    const pagesWithCtas = new Set(
        allButtons(input)
            .filter(
                (button) =>
                    isStrongCta(button.text) ||
                    ACTION_CTAS.some((cta) => normalizeText(button.text).includes(cta)),
            )
            .map((button) => button.pageUrl),
    );
    const contactMethods = countContactMethods(input);
    const forms = allForms(input);
    const homepageOrContactForms = forms.filter(
        (form) =>
            form.pageUrl === homepage?.url ||
            getPageByType(input, "contact")?.url === form.pageUrl,
    );
    const formQuality = evaluateFormQuality(homepageOrContactForms);
    const serviceDetailExists = input.crawl.pageResults.some(
        (page) => page.pageType === "service-detail",
    );
    const strongCtas = findStrongCtas(input);
    const weakOnlyCtas =
        actionCtas.length > 0 &&
        actionCtas.every((cta) => isWeakCta(cta)) &&
        strongCtas.length === 0;

    const checks = [
        buildCheck({
            id: "conversion-primary-cta",
            label: "Primary CTA on homepage",
            description: "Homepage should include a strong action CTA.",
            status:
                strongHomepageCtas.length > 0
                    ? "passed"
                    : homepageButtons.some((button) => actionCtas.includes(normalizeText(button.text)))
                      ? "partial"
                      : "failed",
            weight: 20,
            pointsAwarded:
                strongHomepageCtas.length > 0
                    ? 20
                    : homepageButtons.some((button) => actionCtas.includes(normalizeText(button.text)))
                      ? 10
                      : 0,
            evidence: homepageButtons.slice(0, 5).map((button) => ({
                type: "link",
                label: "Homepage button",
                value: button.text,
                pageUrl: button.pageUrl,
            })),
            missing:
                strongHomepageCtas.length > 0 || actionCtas.length > 0
                    ? []
                    : ["No primary CTA detected on homepage"],
            recommendation:
                strongHomepageCtas.length === 0
                    ? 'Add a clear primary call-to-action on the homepage, such as "Request a Quote" or "Book an Appointment."'
                    : null,
            priority: strongHomepageCtas.length === 0 ? "high" : null,
        }),
        buildCheck({
            id: "conversion-cta-repeated",
            label: "CTA repeated across website",
            description: "Relevant CTAs should appear on more than one page.",
            status: pagesWithCtas.size >= 2 ? "passed" : pagesWithCtas.size === 1 ? "partial" : "failed",
            weight: 10,
            pointsAwarded: pagesWithCtas.size >= 2 ? 10 : pagesWithCtas.size === 1 ? 5 : 0,
            evidence: [
                {
                    type: "derived",
                    label: "Pages with CTA evidence",
                    value: pagesWithCtas.size,
                },
            ],
            missing: pagesWithCtas.size >= 2 ? [] : ["CTA not repeated across multiple pages"],
            recommendation:
                pagesWithCtas.size < 2
                    ? "Repeat a relevant call-to-action on key interior pages."
                    : null,
        }),
        buildCheck({
            id: "conversion-contact-methods",
            label: "Contact methods available",
            description: "Visitors should have multiple ways to contact the business.",
            status:
                contactMethods >= 2 ? "passed" : contactMethods === 1 ? "partial" : "failed",
            weight: 15,
            pointsAwarded: contactMethods >= 2 ? 15 : contactMethods === 1 ? 8 : 0,
            evidence: [
                { type: "contact", label: "Phone numbers", value: input.crawl.phoneNumbersFound.length },
                { type: "contact", label: "Email addresses", value: input.crawl.emailsFound.length },
                { type: "form", label: "Forms", value: forms.length },
            ],
            missing: contactMethods > 0 ? [] : ["No contact methods detected"],
            recommendation:
                contactMethods < 2
                    ? "Provide at least two contact methods such as phone, email, and a contact form."
                    : null,
            priority: contactMethods === 0 ? "high" : null,
        }),
        buildCheck({
            id: "conversion-contact-form",
            label: "Contact or lead form",
            description: "A form on the homepage or contact page supports lead capture.",
            status: homepageOrContactForms.length > 0 ? "passed" : "failed",
            weight: 15,
            pointsAwarded: homepageOrContactForms.length > 0 ? 15 : 0,
            evidence: homepageOrContactForms.map((form) => ({
                type: "form",
                label: "Form detected",
                value: form.fields.length,
                pageUrl: form.pageUrl,
            })),
            missing: homepageOrContactForms.length > 0 ? [] : ["No contact form detected"],
            recommendation:
                homepageOrContactForms.length === 0
                    ? "Add a contact or lead form on the homepage or contact page."
                    : null,
        }),
        buildCheck({
            id: "conversion-form-quality",
            label: "Form quality",
            description: "Forms should be reasonably short, labeled, and actionable.",
            status: formQuality.status,
            weight: 10,
            pointsAwarded: formQuality.points,
            evidence: formQuality.evidence.map((value) => ({
                type: "form",
                label: "Form structure",
                value,
            })),
            missing: formQuality.missing,
            recommendation:
                formQuality.status !== "passed"
                    ? "Improve form usability with labels, a submit button, and a reasonable number of fields."
                    : null,
        }),
        buildCheck({
            id: "conversion-service-detail-path",
            label: "Service-detail path",
            description: "Visitors should be able to move from services overview to detail pages.",
            status:
                serviceDetailExists || input.crawl.hasServicesPage
                    ? serviceDetailExists
                        ? "passed"
                        : "partial"
                    : "failed",
            weight: 10,
            pointsAwarded:
                serviceDetailExists ? 10 : input.crawl.hasServicesPage ? 5 : 0,
            evidence: [
                {
                    type: "page",
                    label: "Service detail pages",
                    value: input.crawl.pageResults.filter((page) => page.pageType === "service-detail")
                        .length,
                },
            ],
            missing:
                serviceDetailExists || input.crawl.hasServicesPage
                    ? []
                    : ["No services path detected"],
            recommendation:
                !serviceDetailExists
                    ? "Add service detail pages or clearer service sections to help visitors evaluate offerings."
                    : null,
        }),
        buildCheck({
            id: "conversion-cta-specificity",
            label: "CTA specificity",
            description: "Strong CTAs are more specific than generic link text.",
            status:
                strongCtas.length > 0 ? "passed" : weakOnlyCtas ? "partial" : actionCtas.length > 0 ? "partial" : "failed",
            weight: 10,
            pointsAwarded:
                strongCtas.length > 0 ? 10 : actionCtas.length > 0 ? 5 : 0,
            evidence: strongCtas.slice(0, 3).map((cta) => ({
                type: "link",
                label: "Strong CTA",
                value: cta,
            })),
            missing: strongCtas.length > 0 ? [] : ["No strong CTA wording detected"],
            recommendation:
                strongCtas.length === 0
                    ? 'Use specific CTA wording such as "Request a Quote" or "Schedule Service" instead of "Click Here."'
                    : null,
        }),
        buildCheck({
            id: "conversion-low-friction-contact",
            label: "Low-friction contact visibility",
            description: "Contact information or CTA should be visible on the homepage content.",
            status:
                (homepage?.visibleText &&
                    (input.crawl.phoneNumbersFound.length > 0 ||
                        input.crawl.emailsFound.length > 0 ||
                        actionCtas.length > 0)) ||
                homepageButtons.length > 0
                    ? "passed"
                    : "failed",
            weight: 10,
            pointsAwarded:
                (homepage?.visibleText &&
                    (input.crawl.phoneNumbersFound.length > 0 ||
                        input.crawl.emailsFound.length > 0 ||
                        actionCtas.length > 0)) ||
                homepageButtons.length > 0
                    ? 10
                    : 0,
            evidence: [
                {
                    type: "content",
                    label: "Detected in homepage content",
                    value: true,
                },
            ],
            missing: [],
            recommendation:
                !homepage?.visibleText
                    ? "Make contact details or a CTA easy to find on the homepage."
                    : null,
        }),
    ];

    return finalizeCategory(checks);
}
