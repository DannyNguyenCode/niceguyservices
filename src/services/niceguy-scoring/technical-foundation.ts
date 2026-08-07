import {
    buildCheck,
    finalizeCategory,
    getHomepage,
    mapAccessibilityPoints,
    mapPerformancePoints,
} from "@/src/services/niceguy-scoring/helpers";
import type { CategoryScore, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

function weightedAccessibilityScore(input: NiceGuyScoringInput): number | null {
    const mobile = input.pagespeed.mobile?.scores.accessibility;
    const desktop = input.pagespeed.desktop?.scores.accessibility;
    if (mobile == null && desktop == null) return null;
    if (mobile != null && desktop != null) return Math.round(mobile * 0.7 + desktop * 0.3);
    return mobile ?? desktop ?? null;
}

function averageScore(
    mobile: number | null | undefined,
    desktop: number | null | undefined,
): number | null {
    if (mobile == null && desktop == null) return null;
    if (mobile != null && desktop != null) return Math.round((mobile + desktop) / 2);
    return mobile ?? desktop ?? null;
}

export function scoreTechnicalFoundation(input: NiceGuyScoringInput): CategoryScore {
    const mobile = input.pagespeed.mobile;
    const desktop = input.pagespeed.desktop;
    const homepage = getHomepage(input);
    const finalUrl = input.crawl.finalUrl || input.crawl.requestedUrl || "";
    const httpsEnabled = finalUrl.startsWith("https://");
    const failedPages = input.crawl.pageResults.filter(
        (page) => (page.statusCode ?? 200) >= 400 || page.errorMessage,
    ).length;
    const homepageOk =
        homepage &&
        (homepage.statusCode ?? 200) < 400 &&
        !homepage.errorMessage;
    const accessibilityScore = weightedAccessibilityScore(input);
    const bestPracticesScore = averageScore(
        mobile?.scores.bestPractices,
        desktop?.scores.bestPractices,
    );
    const seoScore = averageScore(mobile?.scores.seo, desktop?.scores.seo);
    const cwvAssessment = mobile?.coreWebVitals.assessment ?? desktop?.coreWebVitals.assessment;

    const checks = [
        buildCheck({
            id: "technical-mobile-performance",
            label: "Mobile PageSpeed performance",
            description: "Mobile performance is a core technical foundation signal.",
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
        }),
        buildCheck({
            id: "technical-desktop-performance",
            label: "Desktop PageSpeed performance",
            description: "Desktop performance complements mobile technical analysis.",
            status: desktop ? "passed" : "unavailable",
            weight: 10,
            pointsAwarded: desktop
                ? mapPerformancePoints(desktop.scores.performance, 10)
                : 0,
            evidence: desktop
                ? [
                      {
                          type: "pagespeed",
                          label: "Desktop performance score",
                          value: desktop.scores.performance ?? null,
                      },
                  ]
                : [],
            missing: desktop ? [] : ["Desktop PageSpeed result is unavailable"],
            recommendation:
                desktop && (desktop.scores.performance ?? 100) < 75
                    ? "Improve desktop performance by reducing heavy scripts and large assets."
                    : null,
        }),
        buildCheck({
            id: "technical-accessibility",
            label: "Accessibility score",
            description: "Accessibility score uses a mobile-first weighted approach.",
            status: accessibilityScore !== null ? "passed" : "unavailable",
            weight: 15,
            pointsAwarded:
                accessibilityScore !== null
                    ? mapAccessibilityPoints(accessibilityScore, 15)
                    : 0,
            evidence: [
                {
                    type: "pagespeed",
                    label: "Weighted accessibility score",
                    value: accessibilityScore,
                },
            ],
            missing:
                accessibilityScore === null
                    ? ["Accessibility PageSpeed results are unavailable"]
                    : [],
            recommendation:
                accessibilityScore !== null && accessibilityScore < 75
                    ? "Address accessibility failures found in Lighthouse audits."
                    : null,
        }),
        buildCheck({
            id: "technical-best-practices",
            label: "Best Practices score",
            description: "Best practices reflect modern web implementation quality.",
            status: bestPracticesScore !== null ? "passed" : "unavailable",
            weight: 10,
            pointsAwarded:
                bestPracticesScore !== null
                    ? mapAccessibilityPoints(bestPracticesScore, 10)
                    : 0,
            evidence: [
                {
                    type: "pagespeed",
                    label: "Average best practices score",
                    value: bestPracticesScore,
                },
            ],
            missing:
                bestPracticesScore === null
                    ? ["Best practices PageSpeed results are unavailable"]
                    : [],
            recommendation:
                bestPracticesScore !== null && bestPracticesScore < 75
                    ? "Resolve Lighthouse best-practices issues such as HTTPS usage and browser errors."
                    : null,
        }),
        buildCheck({
            id: "technical-seo",
            label: "SEO score",
            description: "SEO score reflects basic technical search readiness.",
            status: seoScore !== null ? "passed" : "unavailable",
            weight: 10,
            pointsAwarded:
                seoScore !== null ? mapAccessibilityPoints(seoScore, 10) : 0,
            evidence: [
                {
                    type: "pagespeed",
                    label: "Average SEO score",
                    value: seoScore,
                },
            ],
            missing: seoScore === null ? ["SEO PageSpeed results are unavailable"] : [],
            recommendation:
                seoScore !== null && seoScore < 75
                    ? "Address technical SEO issues such as metadata, crawlability, and indexability."
                    : null,
        }),
        buildCheck({
            id: "technical-core-web-vitals",
            label: "Core Web Vitals evidence",
            description: "Uses field data when available; otherwise lab proxies without failing missing data.",
            status:
                cwvAssessment === "passed"
                    ? "passed"
                    : cwvAssessment === "failed"
                      ? "partial"
                      : mobile || desktop
                        ? "partial"
                        : "unavailable",
            weight: 15,
            pointsAwarded:
                cwvAssessment === "passed"
                    ? 15
                    : cwvAssessment === "failed"
                      ? 7
                      : mobile || desktop
                        ? 8
                        : 0,
            evidence: [
                {
                    type: "pagespeed",
                    label: "Core Web Vitals assessment",
                    value: cwvAssessment ?? "unavailable",
                },
            ],
            missing:
                !mobile && !desktop
                    ? ["No PageSpeed data available for Core Web Vitals"]
                    : cwvAssessment === "unavailable"
                      ? ["Insufficient real-user Core Web Vitals data"]
                      : [],
            recommendation:
                cwvAssessment === "failed"
                    ? "Improve Core Web Vitals by reducing LCP, INP, and CLS issues."
                    : null,
        }),
        buildCheck({
            id: "technical-https",
            label: "HTTPS",
            description: "Homepage should load over HTTPS.",
            status: httpsEnabled ? "passed" : "failed",
            weight: 10,
            pointsAwarded: httpsEnabled ? 10 : 0,
            evidence: [
                {
                    type: "crawl",
                    label: "Final homepage URL",
                    value: finalUrl,
                },
            ],
            missing: httpsEnabled ? [] : ["Homepage is not served over HTTPS"],
            recommendation: !httpsEnabled ? "Serve the website over HTTPS." : null,
            priority: !httpsEnabled ? "high" : null,
        }),
        buildCheck({
            id: "technical-crawl-health",
            label: "Technical crawl health",
            description: "Crawl health reflects homepage success and page-level errors.",
            status:
                homepageOk && failedPages === 0
                    ? "passed"
                    : homepageOk
                      ? "partial"
                      : "failed",
            weight: 10,
            pointsAwarded:
                homepageOk && failedPages === 0 ? 10 : homepageOk ? 5 : 0,
            evidence: [
                { type: "crawl", label: "Failed pages", value: failedPages },
                {
                    type: "crawl",
                    label: "Homepage loaded successfully",
                    value: Boolean(homepageOk),
                },
            ],
            missing: !homepageOk ? ["Homepage did not load successfully"] : [],
            recommendation:
                failedPages > 0
                    ? "Fix pages that returned errors or failed to load during the crawl."
                    : null,
            priority: !homepageOk ? "high" : "medium",
        }),
    ];

    return finalizeCategory(checks);
}
