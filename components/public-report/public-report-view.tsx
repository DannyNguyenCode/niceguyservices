import {
    formatPublicScore,
    pagespeedPublicLabel,
    scorePresentation,
} from "@/lib/websiteAudit/public-report-format";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import { STANDARD_PUBLIC_DISCLAIMERS } from "@/src/lib/public-report-config";
import type { SerializablePublicReport } from "@/src/types/public-report";
import PublicReportHeader from "@/components/public-report/public-report-header";
import PublicReportNavigation from "@/components/public-report/public-report-navigation";

type PublicReportViewProps = {
    report: SerializablePublicReport;
    mode: "preview" | "public" | "pdf";
};

function Section({
    id,
    title,
    children,
    pdfMode = false,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
    pdfMode?: boolean;
}) {
    return (
        <section
            id={id}
            className={`rounded-2xl bg-base-100 p-6 shadow-sm ${pdfMode ? "pdf-avoid-break" : ""}`}
        >
            <h2 className="text-lg font-semibold text-base-content pdf-keep-with-next">{title}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">{children}</div>
        </section>
    );
}

function Card({
    title,
    children,
    pdfMode = false,
}: {
    title: string;
    children: React.ReactNode;
    pdfMode?: boolean;
}) {
    return (
        <div className={`rounded-xl bg-base-200 p-4 shadow-sm ${pdfMode ? "pdf-avoid-break" : ""}`}>
            <h3 className="text-sm font-medium text-base-content">{title}</h3>
            <div className="mt-2 text-sm leading-relaxed text-base-content/80">{children}</div>
        </div>
    );
}

function PdfCoverPage({ report }: { report: SerializablePublicReport }) {
    const { branding } = report;
    const reportDate = report.publishedAt ?? report.createdAt;

    return (
        <section className="pdf-cover pdf-page-break rounded-2xl bg-base-100 p-8 shadow-sm">
            {branding.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={branding.logoUrl}
                    alt={branding.businessName ?? "Business logo"}
                    className="h-16 w-auto object-contain"
                />
            ) : null}
            <p className="text-sm text-base-content/60">Website audit report</p>
            <h1 className="text-3xl font-semibold text-base-content">{report.title}</h1>
            {report.subtitle ? (
                <p className="text-base text-base-content/75">{report.subtitle}</p>
            ) : null}
            <p className="text-sm text-base-content/75">
                Website clarity, trust, conversion, usability, content, and technical-performance
                review
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-base-content/75">
                {branding.businessName ? <p>{branding.businessName}</p> : null}
                {branding.normalizedDomain ? <p>{branding.normalizedDomain}</p> : null}
                {branding.location ? <p>{branding.location}</p> : null}
                <p>Prepared by {branding.reportPreparedBy}</p>
                <p>{formatWebsiteDate(reportDate)}</p>
                <p>Report revision {report.revisionNumber}</p>
            </div>
        </section>
    );
}

export default function PublicReportView({ report, mode }: PublicReportViewProps) {
    const { settings, sourceSnapshot: snapshot, branding } = report;
    const isPdf = mode === "pdf";
    const contactBase = branding.reportPreparedByUrl || "";
    const contactUrl = contactBase ? `${contactBase}/contact` : "/contact";

    const weaknesses = [...snapshot.ai.weaknesses].sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
    });

    return (
        <div
            className={`mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 ${isPdf ? "pdf-root" : ""}`}
        >
            {isPdf ? <PdfCoverPage report={report} /> : null}

            {mode === "preview" ? (
                <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4" role="status">
                    <p className="text-sm font-medium text-warning">Administrator preview</p>
                    <p className="mt-1 text-sm text-base-content/75">
                        This report is not publicly accessible unless its status is Published.
                    </p>
                </div>
            ) : null}

            {!isPdf ? <PublicReportHeader report={report} /> : null}
            {!isPdf ? <PublicReportNavigation report={report} /> : null}

            <Section id="overview" title="Executive summary" pdfMode={isPdf}>
                <Card title="Summary" pdfMode={isPdf}>
                    <p>{snapshot.ai.executiveSummary}</p>
                </Card>
                <Card title="Business impact" pdfMode={isPdf}>
                    <p>{snapshot.ai.businessImpactSummary}</p>
                </Card>
            </Section>

            {settings.showOverallScore ? (
                <Section id="score" title="Overall score" pdfMode={isPdf}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Card title="Nice Guy score" pdfMode={isPdf}>
                            <p className="text-3xl font-semibold">{snapshot.niceGuy.overallScore}</p>
                            <p>{snapshot.niceGuy.scoreLabel}</p>
                            {settings.showScoreConfidence ? (
                                <p className="mt-2">Confidence: {snapshot.niceGuy.overallConfidence}</p>
                            ) : null}
                        </Card>
                        <Card title="Score context" pdfMode={isPdf}>
                            <p>
                                The score summarizes website clarity, trust, conversion readiness,
                                usability, branding consistency, content, and technical performance.
                            </p>
                            {settings.showScoreConfidence ? (
                                <p className="mt-2">
                                    Confidence reflects how much audit evidence was available. Missing
                                    evidence does not automatically reduce the website score.
                                </p>
                            ) : null}
                        </Card>
                    </div>
                    <Card title="Score disclaimer" pdfMode={isPdf}>
                        <p>
                            This score is a structured assessment based on the pages and technical
                            results available during the audit. It is intended to guide improvement
                            priorities, not to guarantee business outcomes.
                        </p>
                    </Card>
                    {snapshot.niceGuy.strongestCategory ? (
                        <p className="text-sm text-base-content/75">
                            Strongest area: {snapshot.niceGuy.strongestCategory.name} (
                            {snapshot.niceGuy.strongestCategory.score})
                        </p>
                    ) : null}
                    {snapshot.niceGuy.weakestCategory ? (
                        <p className="text-sm text-base-content/75">
                            Greatest opportunity: {snapshot.niceGuy.weakestCategory.name} (
                            {snapshot.niceGuy.weakestCategory.score})
                        </p>
                    ) : null}
                </Section>
            ) : null}

            {settings.showStrengths && snapshot.ai.strengths.length > 0 ? (
                <Section id="strengths" title="What the website does well" pdfMode={isPdf}>
                    {snapshot.ai.strengths.map((item) => (
                        <Card key={item.title} title={item.title} pdfMode={isPdf}>
                            <p>{item.description}</p>
                            {item.category ? <p className="mt-2">Category: {item.category}</p> : null}
                        </Card>
                    ))}
                </Section>
            ) : null}

            {settings.showWeaknesses && weaknesses.length > 0 ? (
                <Section id="priorities" title="Highest-priority issues" pdfMode={isPdf}>
                    {weaknesses.map((item) => (
                        <Card key={item.title} title={item.title} pdfMode={isPdf}>
                            <p>{item.description}</p>
                            <p className="mt-2 capitalize">Priority: {item.priority}</p>
                            {item.category ? <p>Category: {item.category}</p> : null}
                        </Card>
                    ))}
                </Section>
            ) : null}

            {settings.showPageSpeed ? (
                <Section id="performance" title="Performance results" pdfMode={isPdf}>
                    <p className="text-sm text-base-content/75">
                        Mobile and desktop results are measured separately because visitors may
                        experience the same website differently depending on their device.
                    </p>
                    {(["mobile", "desktop"] as const).map((strategy) => {
                        const data = snapshot.pageSpeed[strategy];
                        if (!data) {
                            return (
                                <Card key={strategy} title={`${strategy} performance`} pdfMode={isPdf}>
                                    <p>Not available</p>
                                </Card>
                            );
                        }
                        return (
                            <Card key={strategy} title={`${strategy} performance`} pdfMode={isPdf}>
                                <p>Performance: {formatPublicScore(data.performance)} — {pagespeedPublicLabel(data.performance)}</p>
                                <p>Accessibility: {formatPublicScore(data.accessibility)}</p>
                                <p>Best practices: {formatPublicScore(data.bestPractices)}</p>
                                <p>SEO: {formatPublicScore(data.seo)}</p>
                                {settings.showTechnicalDetails ? (
                                    <div className="mt-2 grid grid-cols-1 gap-1">
                                        <p>LCP: {data.lcp ?? "Not available"}</p>
                                        <p>CLS: {data.cls ?? "Not available"}</p>
                                        <p>TBT: {data.tbt ?? "Not available"}</p>
                                    </div>
                                ) : null}
                            </Card>
                        );
                    })}
                </Section>
            ) : null}

            {settings.showCategoryScores ? (
                <Section id="categories" title="Category scores" pdfMode={isPdf}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {snapshot.niceGuy.categories.map((category) => (
                            <Card key={category.id} title={category.name} pdfMode={isPdf}>
                                <p className="text-2xl font-semibold">{category.score}</p>
                                <p>{category.scoreLabel || scorePresentation(category.score)}</p>
                            </Card>
                        ))}
                    </div>
                </Section>
            ) : null}

            {settings.showQuickWins && snapshot.ai.quickWins.length > 0 ? (
                <Section id="quick-wins" title="Quick wins" pdfMode={isPdf}>
                    {snapshot.ai.quickWins.map((item) => (
                        <Card key={item.title} title={item.title} pdfMode={isPdf}>
                            <p>{item.description}</p>
                            <p className="mt-2">Expected impact: {item.expectedImpact}</p>
                            <p>Relative effort: {item.relativeEffort}</p>
                        </Card>
                    ))}
                </Section>
            ) : null}

            {settings.showLongTermRecommendations &&
            snapshot.ai.longTermRecommendations.length > 0 ? (
                <Section id="long-term" title="Long-term recommendations" pdfMode={isPdf}>
                    {snapshot.ai.longTermRecommendations.map((item) => (
                        <Card key={item.title} title={item.title} pdfMode={isPdf}>
                            <p>{item.description}</p>
                            <p className="mt-2 capitalize">Priority: {item.priority}</p>
                            <p>Relative effort: {item.relativeEffort}</p>
                        </Card>
                    ))}
                </Section>
            ) : null}

            {settings.showPriorityPlan && snapshot.ai.priorityOrder.length > 0 ? (
                <Section id="plan" title="Priority action plan" pdfMode={isPdf}>
                    <ol className="grid grid-cols-1 gap-3">
                        {snapshot.ai.priorityOrder.map((item) => (
                            <li
                                key={item.rank}
                                className={`rounded-xl bg-base-200 p-4 shadow-sm ${isPdf ? "pdf-avoid-break" : ""}`}
                            >
                                <p className="text-sm font-medium text-base-content">
                                    {item.rank}. {item.title}
                                </p>
                                <p className="mt-2 text-sm text-base-content/75">{item.reason}</p>
                            </li>
                        ))}
                    </ol>
                </Section>
            ) : null}

            {settings.showScreenshots && snapshot.screenshots.length > 0 ? (
                <Section id="screenshots" title="Screenshots" pdfMode={isPdf}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {snapshot.screenshots.map((shot) => (
                            <div
                                key={shot.screenshotId}
                                className={`rounded-xl bg-base-200 p-4 shadow-sm ${isPdf ? "pdf-avoid-break" : ""}`}
                            >
                                <p className="text-sm font-medium capitalize text-base-content">
                                    {shot.pageType} · {shot.viewport}
                                </p>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={shot.thumbnailUrl ?? shot.secureUrl}
                                    alt={shot.altText}
                                    loading={isPdf ? "eager" : "lazy"}
                                    className={`mt-3 w-full rounded-lg ${isPdf ? "object-contain" : ""}`}
                                />
                            </div>
                        ))}
                    </div>
                </Section>
            ) : null}

            {settings.showHeroSuggestions && snapshot.heroSuggestions.length > 0 ? (
                <Section id="concepts" title="Hero section concepts" pdfMode={isPdf}>
                    {snapshot.heroSuggestions.map((hero) => (
                        <Card key={hero.suggestionId} title={hero.conceptName} pdfMode={isPdf}>
                            <p className="text-lg font-medium">{hero.headline}</p>
                            <p className="mt-2">{hero.supportingCopy}</p>
                            <p className="mt-2">Primary CTA: {hero.primaryCta.label}</p>
                            {hero.secondaryCta ? (
                                <p>Secondary CTA: {hero.secondaryCta.label}</p>
                            ) : null}
                            {hero.trustSupport ? <p className="mt-2">{hero.trustSupport}</p> : null}
                            <p className="mt-2">{hero.rationale}</p>
                            {hero.constraints.length > 0 ? (
                                isPdf ? (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium">Important publishing notes</p>
                                        <ul className="mt-2 list-disc pl-5">
                                            {hero.constraints.map((note) => (
                                                <li key={note}>{note}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <details className="mt-3">
                                        <summary className="cursor-pointer text-sm font-medium">
                                            Important publishing notes
                                        </summary>
                                        <ul className="mt-2 list-disc pl-5">
                                            {hero.constraints.map((note) => (
                                                <li key={note}>{note}</li>
                                            ))}
                                        </ul>
                                    </details>
                                )
                            ) : null}
                        </Card>
                    ))}
                </Section>
            ) : null}

            <Section id="methodology" title="Methodology and limitations" pdfMode={isPdf}>
                <Card title="How this audit was prepared" pdfMode={isPdf}>
                    <p>
                        This audit reviewed selected website pages, technical performance, content
                        structure, trust signals, conversion paths, usability indicators, and
                        available screenshots.
                    </p>
                    <p className="mt-2">
                        The Nice Guy score was calculated using deterministic rules. AI was used only
                        to summarize and organize saved findings.
                    </p>
                </Card>
                <Card title="Limitations" pdfMode={isPdf}>
                    <ul className="list-disc pl-5">
                        <li>Only selected pages were crawled.</li>
                        <li>PageSpeed results represent a test at a specific time.</li>
                        <li>Screenshots show captured states.</li>
                        <li>AI did not alter deterministic scores.</li>
                        <li>The report does not guarantee rankings, traffic, leads, or revenue.</li>
                    </ul>
                </Card>
                {[...snapshot.ai.disclaimers, ...STANDARD_PUBLIC_DISCLAIMERS].map((text) => (
                    <p key={text} className="text-sm text-base-content/75">
                        {text}
                    </p>
                ))}
            </Section>

            {settings.showContactCta ? (
                <section className={`rounded-2xl bg-base-100 p-6 shadow-sm ${isPdf ? "pdf-avoid-break" : ""}`}>
                    <h2 className="text-lg font-semibold text-base-content">
                        Ready to improve your website?
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                        Nice Guy Web Design can help turn these findings into a clearer, faster, and
                        more effective customer experience.
                    </p>
                    {isPdf ? (
                        <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-base-content/80">
                            <p>
                                Contact:{" "}
                                <a href={contactUrl} className="link link-primary">
                                    {contactUrl}
                                </a>
                            </p>
                            {branding.reportPreparedByUrl ? (
                                <p>
                                    Website:{" "}
                                    <a
                                        href={branding.reportPreparedByUrl}
                                        className="link link-primary"
                                    >
                                        {branding.reportPreparedByUrl}
                                    </a>
                                </p>
                            ) : null}
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-wrap gap-3">
                            <a href={contactUrl} className="btn btn-primary btn-sm">
                                Discuss this audit
                            </a>
                            {branding.reportPreparedByUrl ? (
                                <a
                                    href={branding.reportPreparedByUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm"
                                >
                                    Visit Nice Guy Web Design
                                </a>
                            ) : null}
                        </div>
                    )}
                </section>
            ) : null}

            <footer className={`pb-8 text-center text-sm text-base-content/60 ${isPdf ? "pdf-footer" : ""}`}>
                {settings.showNiceGuyBranding ? (
                    <p>Prepared by {branding.reportPreparedBy}</p>
                ) : null}
                <p className="mt-1">Report revision {report.revisionNumber}</p>
                {isPdf ? (
                    <p className="mt-1">Nice Guy Web Design · Website Audit</p>
                ) : null}
            </footer>
        </div>
    );
}
