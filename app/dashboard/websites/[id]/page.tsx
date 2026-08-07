import { notFound } from "next/navigation";
import { Suspense } from "react";
import ActivitySection from "@/components/audit-dashboard/activity-section";
import AdvancedControlsSection from "@/components/audit-dashboard/advanced-controls-section";
import AuditHeader from "@/components/audit-dashboard/audit-header";
import AuditJobStatusPoller from "@/components/audit-dashboard/audit-job-status-poller";
import AuditNavigation from "@/components/audit-dashboard/audit-navigation";
import AuditOutputsPanel from "@/components/audit-dashboard/audit-outputs-panel";
import AuditRunsSection from "@/components/audit-dashboard/audit-runs-section";
import AuditStageHistoryPanel from "@/components/audit-dashboard/audit-stage-history-panel";
import AuditSummaryPanel from "@/components/audit-dashboard/audit-summary-panel";
import HistoricalAuditBanner from "@/components/audit-dashboard/historical-audit-banner";
import AuditSection from "@/components/audit/shared/audit-section";
import AuditSectionFallback from "@/components/audit/shared/audit-section-fallback";
import DashboardFlashMessage from "@/components/websiteAudit/DashboardFlashMessage";
import SoftDeleteWebsiteButton from "@/components/websiteAudit/SoftDeleteWebsiteButton";
import WebsiteAiSection from "@/components/websiteAudit/WebsiteAiSection";
import WebsiteCrawlSection from "@/components/websiteAudit/WebsiteCrawlSection";
import WebsiteNiceGuySection from "@/components/websiteAudit/WebsiteNiceGuySection";
import WebsitePageSpeedSection from "@/components/websiteAudit/WebsitePageSpeedSection";
import WebsiteScreenshotsSection from "@/components/websiteAudit/WebsiteScreenshotsSection";
import { AUDIT_SECTIONS } from "@/src/lib/audit-sections";
import { getAuditRunById } from "@/src/data/audit-runs";
import { mapCursorAnalysisStatusToAiStatus } from "@/src/services/cursor-analysis/display-status";
import { getWebsiteAuditDashboard } from "@/src/services/get-website-audit-dashboard";

export default async function DashboardWebsiteDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ created?: string; updated?: string; auditRunId?: string; jobId?: string }>;
}) {
    const { id } = await params;
    const query = await searchParams;
    const requestedAuditRunId = query.auditRunId?.trim() || null;
    const jobId = query.jobId?.trim() || null;

    let dashboard = null;
    try {
        dashboard = await getWebsiteAuditDashboard(id, {
            auditRunId: requestedAuditRunId,
            includeHistory: false,
            includeActivity: false,
        });
    } catch (error) {
        console.error("Failed to load audit dashboard:", error);
        notFound();
    }

    if (!dashboard) {
        notFound();
    }

    const {
        website,
        latest,
        readiness,
        selectedAuditRunId,
        activeJob,
        cursorAnalysis,
        cursorAnalysisReadiness,
    } = dashboard;
    const cursorAnalysisConfigured = dashboard.cursorAnalysisConfigured;
    const selectedAuditRun = selectedAuditRunId
        ? await getAuditRunById(selectedAuditRunId)
        : null;
    const isHistoricalView = Boolean(
        requestedAuditRunId && selectedAuditRun && !selectedAuditRun.isCurrent,
    );

    const displayCrawl = latest.crawl;
    const displayScreenshots = latest.screenshots;
    const displayPageSpeedMobile = latest.pageSpeed.mobile;
    const displayPageSpeedDesktop = latest.pageSpeed.desktop;
    const displayNiceGuy = latest.niceGuy;
    const businessLabel = website.businessName?.trim() || website.normalizedDomain;

    const pageSpeedReady = Boolean(
        displayPageSpeedMobile?.status === "complete" ||
            displayPageSpeedDesktop?.status === "complete",
    );
    const niceGuyPrerequisitesMet = Boolean(
        displayCrawl?.status === "complete" && pageSpeedReady,
    );

    const pollWhileActive = Boolean(
        activeJob && ["queued", "processing"].includes(activeJob.status),
    );

    const effectiveAiAnalysisStatus = cursorAnalysis
        ? mapCursorAnalysisStatusToAiStatus(cursorAnalysis.status)
        : website.aiAnalysisStatus;

    return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <DashboardFlashMessage created={query.created} updated={query.updated} />

            {isHistoricalView && selectedAuditRun ? (
                <HistoricalAuditBanner
                    auditNumber={selectedAuditRun.auditNumber}
                    auditRunId={selectedAuditRun.id}
                    status={selectedAuditRun.status}
                    websiteId={website.id}
                />
            ) : null}

            <AuditHeader website={website} />

            <AuditNavigation />

            {activeJob ? (
                <AuditJobStatusPoller
                    jobId={activeJob.id}
                    initialStatus={activeJob.status}
                />
            ) : null}

            <AuditSummaryPanel
                dashboard={dashboard}
                activeJob={activeJob}
                selectedAuditRunId={selectedAuditRunId}
            />

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div id={AUDIT_SECTIONS.crawl.id} className="scroll-mt-24">
                    <WebsiteCrawlSection
                        websiteId={website.id}
                        crawlStatus={displayCrawl?.status ?? website.crawlStatus}
                        latestCrawl={displayCrawl}
                    />
                </div>

                <div id={AUDIT_SECTIONS.screenshots.id} className="scroll-mt-24">
                    <WebsiteScreenshotsSection
                        screenshots={displayScreenshots}
                        crawlStatus={displayCrawl?.status ?? website.crawlStatus}
                    />
                </div>

                <div id={AUDIT_SECTIONS.pagespeed.id} className="scroll-mt-24">
                    <WebsitePageSpeedSection
                        websiteId={website.id}
                        pageSpeedStatus={website.pageSpeedStatus}
                        latestPageSpeedRunAt={website.latestPageSpeedRunAt}
                        latestCrawl={displayCrawl}
                        mobile={displayPageSpeedMobile}
                        desktop={displayPageSpeedDesktop}
                    />
                </div>

                <div id={AUDIT_SECTIONS.metrics.id} className="scroll-mt-24">
                    <WebsiteNiceGuySection
                        websiteId={website.id}
                        niceGuyStatus={displayNiceGuy?.status ?? website.niceGuyStatus}
                        latestNiceGuyRunAt={displayNiceGuy?.generatedAt ?? website.latestNiceGuyRunAt}
                        latestMetric={displayNiceGuy}
                        prerequisitesMet={niceGuyPrerequisitesMet}
                    />
                </div>

                <div id={AUDIT_SECTIONS.ai.id} className="scroll-mt-24">
                    <WebsiteAiSection
                        websiteId={website.id}
                        auditRunId={selectedAuditRunId}
                        aiAnalysisStatus={effectiveAiAnalysisStatus}
                        latestAiAnalysisRunAt={
                            cursorAnalysis?.completedAt ?? website.latestAiAnalysisRunAt
                        }
                        niceGuyMetric={displayNiceGuy}
                        cursorAnalysisConfigured={cursorAnalysisConfigured}
                        cursorAnalysis={cursorAnalysis}
                        cursorReadiness={cursorAnalysisReadiness}
                    />
                </div>
            </div>

            <AuditOutputsPanel
                websiteId={website.id}
                websiteActive={!website.deletedAt}
                isAuditReadyForReport={readiness.isAuditReadyForReport}
                auditRunId={selectedAuditRunId}
                linkedReportIds={selectedAuditRun?.references.publicReportIds}
                linkedPdfReportIds={selectedAuditRun?.references.pdfReportIds}
                linkedOutreachDraftIds={selectedAuditRun?.references.outreachDraftIds}
            />

            <Suspense fallback={<AuditSectionFallback label="Loading activity…" />}>
                <ActivitySection
                    websiteId={website.id}
                    auditRunId={selectedAuditRunId ?? undefined}
                    pollWhileActive={pollWhileActive}
                    title="Activity"
                />
            </Suspense>

            <Suspense fallback={<AuditSectionFallback label="Loading audit runs…" />}>
                <AuditRunsSection websiteId={website.id} />
            </Suspense>

            <AuditStageHistoryPanel websiteId={website.id} />

            <AdvancedControlsSection
                websiteId={website.id}
                dashboard={dashboard}
                hidden={Boolean(activeJob)}
            />

            <AuditSection
                id={AUDIT_SECTIONS.administration.id}
                headingId={AUDIT_SECTIONS.administration.headingId}
                title="Website administration"
                description="Permanently deletes the website and all related audit data, including MongoDB records and Cloudinary screenshots/PDFs."
            >
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <SoftDeleteWebsiteButton
                        websiteId={website.id}
                        businessLabel={businessLabel}
                        className="btn btn-outline btn-sm w-full sm:w-auto"
                    />
                </div>
            </AuditSection>

            {jobId ? (
                <p className="sr-only" aria-live="polite">
                    Tracking audit job {jobId}
                </p>
            ) : null}
        </div>
    );
}
