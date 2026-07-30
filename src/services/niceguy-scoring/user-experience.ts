import {
    buildCheck,
    finalizeCategory,
    getHomepage,
    mapAccessibilityPoints,
    mapClsPoints,
    mapPerformancePoints,
    mapTbtPoints,
} from "@/src/services/niceguy-scoring/helpers";
import type { CategoryScore, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

function countAltCoverage(input: NiceGuyScoringInput): {
    eligible: number;
    withAlt: number;
} {
    let eligible = 0;
    let withAlt = 0;

    for (const page of input.crawl.pageResults) {
        for (const image of page.images) {
            const src = (image.src ?? "").toLowerCase();
            if (!src || src.endsWith(".svg") && !(image.alt ?? "").trim()) {
                continue;
            }
            eligible += 1;
            if ((image.alt ?? "").trim().length > 0) {
                withAlt += 1;
            }
        }
    }

    return { eligible, withAlt };
}

export function scoreUserExperience(input: NiceGuyScoringInput): CategoryScore {
    const mobile = input.pagespeed.mobile;
    const homepage = getHomepage(input);
    const essentialPages = [
        input.crawl.hasAboutPage,
        input.crawl.hasContactPage,
        input.crawl.hasServicesPage,
    ].filter(Boolean).length;
    const altCoverage = countAltCoverage(input);
    const h1Count = (homepage?.headings ?? []).filter((heading) => heading.level === 1).length;
    const subheadings = (homepage?.headings ?? []).filter((heading) => heading.level >= 2).length;
    const emptyNavLabels = input.crawl.internalLinks.filter((link) => !link.trim()).length;

    const checks = [
        buildCheck({
            id: "ux-essential-pages",
            label: "Essential pages available",
            description: "About, Contact, and Services pages support usability.",
            status:
                essentialPages === 3 ? "passed" : essentialPages >= 1 ? "partial" : "failed",
            weight: 15,
            pointsAwarded:
                essentialPages === 3 ? 15 : essentialPages === 2 ? 10 : essentialPages === 1 ? 5 : 0,
            evidence: [
                { type: "page", label: "About page", value: input.crawl.hasAboutPage },
                { type: "page", label: "Contact page", value: input.crawl.hasContactPage },
                { type: "page", label: "Services page", value: input.crawl.hasServicesPage },
            ],
            missing: essentialPages < 3 ? ["One or more essential pages are missing"] : [],
            recommendation:
                essentialPages < 3
                    ? "Add About, Contact, and Services pages to improve navigation and usability."
                    : null,
        }),
        buildCheck({
            id: "ux-navigation-quality",
            label: "Navigation link quality",
            description: "Navigation should link to essential pages with descriptive labels.",
            status:
                essentialPages >= 2 && emptyNavLabels === 0
                    ? "passed"
                    : essentialPages >= 1
                      ? "partial"
                      : "failed",
            weight: 10,
            pointsAwarded:
                essentialPages >= 2 && emptyNavLabels === 0
                    ? 10
                    : essentialPages >= 1
                      ? 5
                      : 0,
            evidence: [
                {
                    type: "link",
                    label: "Internal links discovered",
                    value: input.crawl.internalLinks.length,
                },
            ],
            missing: emptyNavLabels > 0 ? ["Empty navigation labels detected"] : [],
            recommendation:
                essentialPages < 2
                    ? "Link to essential pages from the main navigation with descriptive labels."
                    : null,
        }),
        buildCheck({
            id: "ux-mobile-performance",
            label: "Mobile performance",
            description: "Mobile PageSpeed performance affects user experience.",
            status: mobile ? "passed" : "unavailable",
            weight: 20,
            pointsAwarded: mobile
                ? mapPerformancePoints(mobile.scores.performance, 20)
                : 0,
            evidence: mobile
                ? [
                      {
                          type: "pagespeed",
                          label: "Mobile performance score",
                          value: mobile.scores.performance ?? null,
                      },
                  ]
                : [],
            missing: mobile ? [] : ["Mobile PageSpeed result is unavailable"],
            recommendation:
                mobile && (mobile.scores.performance ?? 100) < 75
                    ? "Improve mobile performance by addressing the highest-savings Lighthouse opportunities."
                    : null,
            priority:
                mobile && (mobile.scores.performance ?? 100) < 50 ? "high" : "medium",
        }),
        buildCheck({
            id: "ux-mobile-accessibility",
            label: "Mobile accessibility",
            description: "Mobile accessibility score indicates structural usability issues.",
            status: mobile ? "passed" : "unavailable",
            weight: 15,
            pointsAwarded: mobile
                ? mapAccessibilityPoints(mobile.scores.accessibility, 15)
                : 0,
            evidence: mobile
                ? [
                      {
                          type: "pagespeed",
                          label: "Mobile accessibility score",
                          value: mobile.scores.accessibility ?? null,
                      },
                  ]
                : [],
            missing: mobile ? [] : ["Mobile PageSpeed accessibility result is unavailable"],
            recommendation:
                mobile && (mobile.scores.accessibility ?? 100) < 75
                    ? "Address mobile accessibility failures such as contrast, labels, and semantic structure."
                    : null,
        }),
        buildCheck({
            id: "ux-layout-stability",
            label: "Layout stability",
            description: "CLS from Lighthouse lab data indicates layout stability.",
            status: mobile?.labMetrics.cumulativeLayoutShift?.value !== undefined ? "passed" : "unavailable",
            weight: 10,
            pointsAwarded: mobile
                ? mapClsPoints(mobile.labMetrics.cumulativeLayoutShift?.value ?? null, 10)
                : 0,
            evidence: mobile
                ? [
                      {
                          type: "pagespeed",
                          label: "Mobile CLS (lab data)",
                          value: mobile.labMetrics.cumulativeLayoutShift?.displayValue ?? null,
                      },
                  ]
                : [],
            missing: mobile ? [] : ["Mobile CLS lab metric is unavailable"],
            recommendation:
                mobile &&
                (mobile.labMetrics.cumulativeLayoutShift?.value ?? 0) > 0.1
                    ? "Reduce layout shift by reserving space for images, ads, and dynamic content."
                    : null,
        }),
        buildCheck({
            id: "ux-interactive-blocking",
            label: "Interactive blocking",
            description: "Total Blocking Time indicates main-thread delays on mobile.",
            status: mobile?.labMetrics.totalBlockingTime?.valueMs !== undefined ? "passed" : "unavailable",
            weight: 10,
            pointsAwarded: mobile
                ? mapTbtPoints(mobile.labMetrics.totalBlockingTime?.valueMs ?? null, 10)
                : 0,
            evidence: mobile
                ? [
                      {
                          type: "pagespeed",
                          label: "Mobile TBT (lab data)",
                          value: mobile.labMetrics.totalBlockingTime?.displayValue ?? null,
                      },
                  ]
                : [],
            missing: mobile ? [] : ["Mobile TBT lab metric is unavailable"],
            recommendation:
                mobile && (mobile.labMetrics.totalBlockingTime?.valueMs ?? 0) > 200
                    ? "Reduce JavaScript execution and long tasks to improve responsiveness."
                    : null,
        }),
        buildCheck({
            id: "ux-alt-text-coverage",
            label: "Image alt-text coverage",
            description: "Informative images should include alt text.",
            status:
                altCoverage.eligible === 0
                    ? "partial"
                    : altCoverage.withAlt / altCoverage.eligible >= 0.8
                      ? "passed"
                      : altCoverage.withAlt / altCoverage.eligible >= 0.5
                        ? "partial"
                        : "failed",
            weight: 10,
            pointsAwarded:
                altCoverage.eligible === 0
                    ? 5
                    : Math.round(
                          (altCoverage.withAlt / altCoverage.eligible) * 10,
                      ),
            evidence: [
                {
                    type: "image",
                    label: "Images with alt text",
                    value: `${altCoverage.withAlt}/${altCoverage.eligible}`,
                },
            ],
            missing:
                altCoverage.eligible > 0 && altCoverage.withAlt < altCoverage.eligible
                    ? ["Some informative images are missing alt text"]
                    : [],
            recommendation:
                altCoverage.eligible > altCoverage.withAlt
                    ? "Add descriptive alt text to informative images."
                    : null,
        }),
        buildCheck({
            id: "ux-heading-structure",
            label: "Heading structure",
            description: "Homepage heading structure should support scanability.",
            status:
                h1Count === 1 && subheadings >= 1
                    ? "passed"
                    : h1Count > 0
                      ? "partial"
                      : "failed",
            weight: 10,
            pointsAwarded:
                h1Count === 1 && subheadings >= 1 ? 10 : h1Count > 0 ? 5 : 0,
            evidence: [
                { type: "page", label: "Homepage H1 count", value: h1Count },
                { type: "page", label: "Homepage subheadings", value: subheadings },
            ],
            missing: h1Count === 0 ? ["No H1 heading on homepage"] : [],
            recommendation:
                h1Count !== 1
                    ? "Use one clear H1 and supporting H2/H3 headings on the homepage."
                    : null,
        }),
    ];

    return finalizeCategory(checks);
}
