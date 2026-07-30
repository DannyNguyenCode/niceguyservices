import { notFound } from "next/navigation";
import ActivitySection from "@/components/audit-dashboard/activity-section";
import AuditActionPanel from "@/components/audit-dashboard/audit-action-panel";
import AuditHeader from "@/components/audit-dashboard/audit-header";
import AuditHistorySection from "@/components/audit-dashboard/audit-history-section";
import AuditRunsSection from "@/components/audit-dashboard/audit-runs-section";
import AuditNavigation from "@/components/audit-dashboard/audit-navigation";
import AuditOverview from "@/components/audit-dashboard/audit-overview";
import AuditProgress from "@/components/audit-dashboard/audit-progress";
import AuditStageActions from "@/components/audit-dashboard/audit-stage-actions";
import AuditWarnings from "@/components/audit-dashboard/audit-warnings";
import PublicReportsSection from "@/components/audit-dashboard/public-reports-section";
import PdfReportsSection from "@/components/audit-dashboard/pdf-reports-section";
import OutreachEmailSection from "@/components/audit-dashboard/outreach-email-section";
import DemoWebsiteSection from "@/components/audit-dashboard/demo-website-section";
import DashboardFlashMessage from "@/components/websiteAudit/DashboardFlashMessage";
import SoftDeleteWebsiteButton from "@/components/websiteAudit/SoftDeleteWebsiteButton";
import WebsiteAiSection from "@/components/websiteAudit/WebsiteAiSection";
import WebsiteCrawlSection from "@/components/websiteAudit/WebsiteCrawlSection";
import WebsiteNiceGuySection from "@/components/websiteAudit/WebsiteNiceGuySection";
import WebsitePageSpeedSection from "@/components/websiteAudit/WebsitePageSpeedSection";
import WebsiteScreenshotsSection from "@/components/websiteAudit/WebsiteScreenshotsSection";
import HistoricalAuditBanner from "@/components/audit-dashboard/historical-audit-banner";
import { getWebsiteAuditDashboard } from "@/src/services/get-website-audit-dashboard";
import { loadAuditRunResources } from "@/src/services/audit-history/load-audit-run-resources";
import { getPublicReportsForWebsite } from "@/src/data/public-reports";
import { getPdfReportsForWebsite } from "@/src/data/pdf-reports";
import { getOutreachDraftsForWebsite } from "@/src/data/outreach-email-drafts";

export default async function DashboardWebsiteDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ created?: string; updated?: string; auditRunId?: string }>;
}) {
    // TODO: Require admin authentication before rendering dashboard routes.
    const { id } = await params;
    const query = await searchParams;
    const historicalAuditRunId = query.auditRunId?.trim() || null;

    let dashboard = null;
    let historicalResources = null;
    let publicReports: Awaited<ReturnType<typeof getPublicReportsForWebsite>> = [];
    let pdfReports: Awaited<ReturnType<typeof getPdfReportsForWebsite>> = [];
    let outreachDrafts: Awaited<ReturnType<typeof getOutreachDraftsForWebsite>> = [];
    try {
        dashboard = await getWebsiteAuditDashboard(id);
        if (dashboard && historicalAuditRunId) {
            historicalResources = await loadAuditRunResources({
                websiteId: id,
                auditRunId: historicalAuditRunId,
            });
        }
        if (dashboard) {
            publicReports = await getPublicReportsForWebsite(dashboard.website.id);
            pdfReports = await getPdfReportsForWebsite(dashboard.website.id);
            outreachDrafts = await getOutreachDraftsForWebsite(dashboard.website.id);
        }
    } catch (error) {
        console.error("Failed to load audit dashboard:", error);
        notFound();
    }

    if (!dashboard) {
        notFound();
    }

    const { website, latest, readiness } = dashboard;
    const view = historicalResources ?? null;
    const displayCrawl = view?.crawl ?? latest.crawl;
    const displayScreenshots = view?.screenshots ?? latest.screenshots;
    const displayPageSpeedMobile = view?.pageSpeed.mobile ?? latest.pageSpeed.mobile;
    const displayPageSpeedDesktop = view?.pageSpeed.desktop ?? latest.pageSpeed.desktop;
    const displayNiceGuy = view?.niceGuy ?? latest.niceGuy;
    const displayAiSummary = view?.aiSummary ?? latest.aiSummary;
    const displayHeroSuggestions = view?.heroSuggestions ?? latest.heroSuggestions;
    const businessLabel = website.businessName?.trim() || website.normalizedDomain;
    const pageSpeedReady = Boolean(
        displayPageSpeedMobile?.status === "complete" ||
            displayPageSpeedDesktop?.status === "complete",
    );
    const niceGuyPrerequisitesMet = Boolean(
        displayCrawl?.status === "complete" && pageSpeedReady,
    );
    const aiPrerequisitesMet = Boolean(
        niceGuyPrerequisitesMet &&
            displayNiceGuy?.status === "complete" &&
            displayNiceGuy.crawlId === displayCrawl?.id,
    );

    const linkedReportIds = view?.auditRun.references.publicReportIds ?? null;
    const filteredPublicReports = linkedReportIds
        ? publicReports.filter((report) => linkedReportIds.includes(report.id))
        : publicReports;
    const filteredPdfReports = view
        ? pdfReports.filter((pdf) => view.auditRun.references.pdfReportIds.includes(pdf.id))
        : pdfReports;
    const filteredOutreachDrafts = view
        ? outreachDrafts.filter((draft) =>
              view.auditRun.references.outreachDraftIds.includes(draft.id),
          )
        : outreachDrafts;

    return (
        <div className="grid grid-cols-1 gap-6">
            <DashboardFlashMessage created={query.created} updated={query.updated} />

            {view ? (
                <HistoricalAuditBanner
                    auditNumber={view.auditRun.auditNumber}
                    auditRunId={view.auditRun.id}
                    status={view.auditRun.status}
                    websiteId={website.id}
                />
            ) : null}

            <AuditHeader website={website} />

            <AuditNavigation />

            <AuditProgress auditStatus={dashboard.auditStatus} />

            <AuditActionPanel readiness={readiness} />

            <AuditWarnings relationWarnings={dashboard.relationWarnings} />

            <AuditStageActions websiteId={website.id} data={dashboard} />

            <AuditOverview
                overview={dashboard.overview}
                aiAnalysisStatus={website.aiAnalysisStatus}
            />

            <div id="crawl">
                <WebsiteCrawlSection
                    websiteId={website.id}
                    crawlStatus={displayCrawl?.status ?? website.crawlStatus}
                    latestCrawl={displayCrawl}
                />
            </div>

            <div id="screenshots">
                <WebsiteScreenshotsSection
                    screenshots={displayScreenshots}
                    crawlStatus={displayCrawl?.status ?? website.crawlStatus}
                />
            </div>

            <div id="pagespeed">
                <WebsitePageSpeedSection
                    websiteId={website.id}
                    pageSpeedStatus={website.pageSpeedStatus}
                    latestPageSpeedRunAt={website.latestPageSpeedRunAt}
                    latestCrawl={displayCrawl}
                    mobile={displayPageSpeedMobile}
                    desktop={displayPageSpeedDesktop}
                />
            </div>

            <div id="metrics">
                <WebsiteNiceGuySection
                    websiteId={website.id}
                    niceGuyStatus={displayNiceGuy?.status ?? website.niceGuyStatus}
                    latestNiceGuyRunAt={displayNiceGuy?.generatedAt ?? website.latestNiceGuyRunAt}
                    latestMetric={displayNiceGuy}
                    prerequisitesMet={niceGuyPrerequisitesMet}
                />
            </div>

            <div id="ai">
                <WebsiteAiSection
                    websiteId={website.id}
                    aiAnalysisStatus={displayAiSummary?.status ?? website.aiAnalysisStatus}
                    latestAiAnalysisRunAt={
                        displayAiSummary?.generatedAt ?? website.latestAiAnalysisRunAt
                    }
                    prerequisitesMet={aiPrerequisitesMet}
                    latestSummary={displayAiSummary}
                    heroSuggestions={displayHeroSuggestions}
                    niceGuyMetric={displayNiceGuy}
                />
            </div>

            <PublicReportsSection
                websiteId={website.id}
                isAuditReadyForReport={readiness.isAuditReadyForReport}
                reports={filteredPublicReports}
                pdfReports={filteredPdfReports}
            />

            <PdfReportsSection
                websiteActive={!website.deletedAt}
                publicReports={filteredPublicReports}
                pdfReports={filteredPdfReports}
            />

            <OutreachEmailSection
                websiteActive={!website.deletedAt}
                publicReports={filteredPublicReports}
                outreachDrafts={filteredOutreachDrafts}
            />

            <DemoWebsiteSection
                websiteActive={!website.deletedAt}
                publicReports={publicReports}
            />

            <ActivitySection
                websiteId={website.id}
                auditRunId={view?.auditRun.id}
                activity={view ? undefined : dashboard.activity}
                pollWhileActive={
                    !view &&
                    (website.crawlStatus === "processing" ||
                        website.pageSpeedStatus === "processing" ||
                        website.niceGuyStatus === "processing" ||
                        website.aiAnalysisStatus === "processing")
                }
            />

            <AuditRunsSection websiteId={website.id} />

            <AuditHistorySection
                crawlRuns={dashboard.history.crawlRuns}
                pageSpeedRuns={dashboard.history.pageSpeedRuns}
                niceGuyRuns={dashboard.history.niceGuyRuns}
                aiRuns={dashboard.history.aiRuns}
            />

            <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-base-content">Website administration</h2>
                <p className="mt-2 text-sm text-base-content/70">
                    Soft-delete removes the website from active lists while preserving audit
                    history.
                </p>
                <div className="mt-4">
                    <SoftDeleteWebsiteButton
                        websiteId={website.id}
                        businessLabel={businessLabel}
                        className="btn btn-outline btn-sm"
                    />
                </div>
            </section>
        </div>
    );
}
