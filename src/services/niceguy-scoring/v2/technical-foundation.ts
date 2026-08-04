import { buildV2Check, finalizeCategoryV2 } from "@/src/services/niceguy-scoring/v2/finalizer";
import {
    clsPoints,
    clsStatus,
    cruxClsRating,
    cruxCompositePoints,
    cruxCompositeStatus,
    cruxInpRating,
    cruxLcpRating,
    lighthouseScorePoints,
    lighthouseScoreStatus,
    tbtPoints,
    tbtStatus,
} from "@/src/services/niceguy-scoring/v2/thresholds";
import { getHomepage } from "@/src/services/niceguy-scoring/v2/shared";
import type { NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

function scoreFromStatus(status: ReturnType<typeof lighthouseScoreStatus>, maxPoints: number): number {
    if (status === "unavailable") return 0;
    if (status === "passed") return maxPoints;
    if (status === "partial") return Math.round(maxPoints * 0.5);
    return 0;
}

export function scoreTechnicalFoundationV2(input: NiceGuyScoringInput) {
    const mobile = input.pagespeed.mobile;
    const desktop = input.pagespeed.desktop;
    const homepage = getHomepage(input);
    const finalUrl = input.crawl.finalUrl || input.crawl.requestedUrl || "";
    const httpsEnabled = finalUrl.startsWith("https://");
    const failedPages = input.crawl.pageResults.filter(
        (page) => (page.statusCode ?? 200) >= 400 || page.errorMessage,
    ).length;
    const homepageOk =
        homepage && (homepage.statusCode ?? 200) < 400 && !homepage.errorMessage;

    const mobilePerfScore = mobile?.scores.performance ?? null;
    const desktopPerfScore = desktop?.scores.performance ?? null;
    const mobilePerfStatus = lighthouseScoreStatus(mobilePerfScore);
    const desktopPerfStatus = lighthouseScoreStatus(desktopPerfScore);

    const mobileA11yScore = mobile?.scores.accessibility ?? null;
    const desktopA11yScore = desktop?.scores.accessibility ?? null;
    const a11yScore =
        mobileA11yScore != null && desktopA11yScore != null
            ? Math.round(mobileA11yScore * 0.7 + desktopA11yScore * 0.3)
            : mobileA11yScore ?? desktopA11yScore;
    const a11yStatus = lighthouseScoreStatus(a11yScore);

    const bestPracticesScore =
        mobile?.scores.bestPractices != null && desktop?.scores.bestPractices != null
            ? Math.round((mobile.scores.bestPractices + desktop.scores.bestPractices) / 2)
            : mobile?.scores.bestPractices ?? desktop?.scores.bestPractices ?? null;
    const bestPracticesStatus = lighthouseScoreStatus(bestPracticesScore);

    const seoScore =
        mobile?.scores.seo != null && desktop?.scores.seo != null
            ? Math.round((mobile.scores.seo + desktop.scores.seo) / 2)
            : mobile?.scores.seo ?? desktop?.scores.seo ?? null;
    const seoStatus = lighthouseScoreStatus(seoScore);

    const lcp = mobile?.coreWebVitals.largestContentfulPaint?.value ?? null;
    const inp = mobile?.coreWebVitals.interactionToNextPaint?.value ?? null;
    const clsField = mobile?.coreWebVitals.cumulativeLayoutShift?.value ?? null;
    const cruxRatings = [cruxLcpRating(lcp), cruxInpRating(inp), cruxClsRating(clsField)];
    const cruxStatus = cruxCompositeStatus(cruxRatings);

    const clsLab = mobile?.labMetrics.cumulativeLayoutShift?.value ?? desktop?.labMetrics.cumulativeLayoutShift?.value ?? null;
    const clsLabStatus = clsStatus(clsLab);
    const tbtLab = mobile?.labMetrics.totalBlockingTime?.valueMs ?? desktop?.labMetrics.totalBlockingTime?.valueMs ?? null;
    const tbtLabStatus = tbtStatus(tbtLab);

    const crawlStatus =
        homepageOk && failedPages === 0
            ? "passed"
            : homepageOk
              ? "partial"
              : "failed";

    const metaDescription = input.crawl.metaDescription || homepage?.metaDescription || "";
    const canonicalStatus = metaDescription.length > 0 ? "partial" : "not_detected";
    const robotsStatus = "not_detected";
    const viewportStatus = mobile ? "partial" : "unavailable";
    const resourceStatus = failedPages > 0 ? "partial" : homepageOk ? "passed" : "unavailable";

    const checks = [
        buildV2Check({
            id: "tf-mobile-performance",
            label: "Mobile performance",
            description: "Lighthouse mobile performance score using v2 thresholds.",
            status: mobile ? mobilePerfStatus : "unavailable",
            weight: 15,
            pointsAwarded: lighthouseScorePoints(mobilePerfScore, 15),
            evidence: [{ type: "pagespeed", label: "Mobile performance", value: mobilePerfScore }],
            recommendation:
                mobilePerfStatus === "failed" || mobilePerfStatus === "partial"
                    ? "Improve mobile performance by addressing top Lighthouse opportunities."
                    : null,
        }),
        buildV2Check({
            id: "tf-desktop-performance",
            label: "Desktop performance",
            description: "Lighthouse desktop performance score using v2 thresholds.",
            status: desktop ? desktopPerfStatus : "unavailable",
            weight: 10,
            pointsAwarded: lighthouseScorePoints(desktopPerfScore, 10),
            evidence: [{ type: "pagespeed", label: "Desktop performance", value: desktopPerfScore }],
        }),
        buildV2Check({
            id: "tf-accessibility-screen",
            label: "Automated accessibility screening",
            description: "Lighthouse accessibility is an automated screen, not WCAG conformance.",
            status: a11yScore != null ? a11yStatus : "unavailable",
            weight: 10,
            pointsAwarded: lighthouseScorePoints(a11yScore, 10),
            evidence: [{ type: "pagespeed", label: "Weighted accessibility", value: a11yScore }],
        }),
        buildV2Check({
            id: "tf-best-practices",
            label: "Browser/security best-practice screen",
            description: "Lighthouse Best Practices is not a full security audit.",
            status: bestPracticesScore != null ? bestPracticesStatus : "unavailable",
            weight: 5,
            pointsAwarded: lighthouseScorePoints(bestPracticesScore, 5),
            evidence: [{ type: "pagespeed", label: "Best practices", value: bestPracticesScore }],
        }),
        buildV2Check({
            id: "tf-technical-seo",
            label: "Technical SEO screening",
            description: "Lighthouse SEO plus crawl evidence; not a ranking prediction.",
            status: seoScore != null ? seoStatus : "unavailable",
            weight: 5,
            pointsAwarded: lighthouseScorePoints(seoScore, 5),
            evidence: [{ type: "pagespeed", label: "SEO score", value: seoScore }],
        }),
        buildV2Check({
            id: "tf-field-performance",
            label: "Field performance (CrUX)",
            description: "CrUX p75 thresholds for LCP, INP, and CLS when available.",
            status: cruxStatus,
            weight: 15,
            pointsAwarded: cruxCompositePoints(cruxStatus, 15),
            evidence: [
                { type: "pagespeed", label: "LCP p75", value: lcp },
                { type: "pagespeed", label: "INP p75", value: inp },
                { type: "pagespeed", label: "CLS p75", value: clsField },
            ],
            missing:
                cruxStatus === "unavailable"
                    ? ["CrUX field data was not available for this URL during the audit."]
                    : [],
        }),
        buildV2Check({
            id: "tf-lab-cls",
            label: "Lab layout stability",
            description: "Lab CLS thresholds separate from field evidence.",
            status: clsLabStatus,
            weight: 5,
            pointsAwarded: clsPoints(clsLab, 5),
            evidence: [{ type: "pagespeed", label: "Lab CLS", value: clsLab }],
        }),
        buildV2Check({
            id: "tf-lab-tbt",
            label: "Lab main-thread blocking",
            description: "Total Blocking Time lab thresholds.",
            status: tbtLabStatus,
            weight: 5,
            pointsAwarded: tbtPoints(tbtLab, 5),
            evidence: [{ type: "pagespeed", label: "Lab TBT (ms)", value: tbtLab }],
        }),
        buildV2Check({
            id: "tf-transport-security",
            label: "Transport security",
            description: "Final homepage URL should use HTTPS without downgrade.",
            status: httpsEnabled ? "passed" : "failed",
            weight: 5,
            pointsAwarded: httpsEnabled ? 5 : 0,
            evidence: [{ type: "crawl", label: "Final URL", value: finalUrl }],
            recommendation: !httpsEnabled ? "Serve the website over HTTPS." : null,
            priority: !httpsEnabled ? "high" : null,
        }),
        buildV2Check({
            id: "tf-crawl-integrity",
            label: "Crawl/response integrity",
            description: "Homepage success, failed pages, and crawl completion within limits.",
            status: crawlStatus,
            weight: 10,
            pointsAwarded: scoreFromStatus(crawlStatus, 10),
            evidence: [
                { type: "crawl", label: "Failed pages", value: failedPages },
                { type: "crawl", label: "Pages crawled", value: input.crawl.pagesCrawled },
            ],
            recommendation:
                crawlStatus !== "passed"
                    ? "Fix pages that returned errors or failed to load during the crawl."
                    : null,
        }),
        buildV2Check({
            id: "tf-indexability-canonical",
            label: "Indexability/canonical",
            description: "Canonical and indexability signals from crawl-visible metadata.",
            status: canonicalStatus,
            weight: 5,
            pointsAwarded: canonicalStatus === "partial" ? 3 : 0,
            evidence: [
                { type: "page", label: "Meta description present", value: metaDescription.length > 0 },
            ],
            missing: ["Robots meta and canonical HTTP headers require expanded crawl capture."],
        }),
        buildV2Check({
            id: "tf-robots-sitemap",
            label: "Robots/sitemap discoverability",
            description: "Robots.txt and sitemap discoverability from crawl scope.",
            status: robotsStatus,
            weight: 3,
            pointsAwarded: 0,
            missing: ["Robots.txt and sitemap inspection not yet captured in crawl evidence."],
        }),
        buildV2Check({
            id: "tf-mobile-viewport",
            label: "Mobile viewport",
            description: "Viewport meta configuration from PageSpeed/mobile capture.",
            status: viewportStatus,
            weight: 2,
            pointsAwarded: viewportStatus === "partial" ? 1 : 0,
            missing: ["Parsed viewport meta not yet extracted from crawl DOM."],
        }),
        buildV2Check({
            id: "tf-resource-loading",
            label: "Resource-loading integrity",
            description: "Critical first-party resource failures within captured limits.",
            status: resourceStatus,
            weight: 5,
            pointsAwarded: scoreFromStatus(resourceStatus, 5),
            evidence: [{ type: "crawl", label: "Failed pages during crawl", value: failedPages }],
        }),
    ];

    return finalizeCategoryV2(checks, "technicalFoundation");
}
