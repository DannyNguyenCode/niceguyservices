"use client";

import RunAiAnalysisButton from "@/components/websiteAudit/RunAiAnalysisButton";
import RunCrawlButton from "@/components/websiteAudit/RunCrawlButton";
import RunNiceGuyAnalysisButton from "@/components/websiteAudit/RunNiceGuyAnalysisButton";
import RunPageSpeedButton from "@/components/websiteAudit/RunPageSpeedButton";
import type { WebsiteAuditDashboardData } from "@/src/types/audit-dashboard";

type AuditStageActionsProps = {
    websiteId: string;
    data: WebsiteAuditDashboardData;
};

export default function AuditStageActions({ websiteId, data }: AuditStageActionsProps) {
    const { website, readiness, latest } = data;
    const crawlComplete = latest.crawl?.status === "complete";
    const homepageOk = Boolean(
        latest.crawl?.pageResults.some(
            (page) =>
                page.pageType === "home" &&
                (page.statusCode ?? 200) < 400 &&
                !page.errorMessage,
        ),
    );
    const pageSpeedReady = Boolean(
        latest.pageSpeed.mobile?.status === "complete" ||
            latest.pageSpeed.desktop?.status === "complete",
    );
    const niceGuyReady = Boolean(
        latest.niceGuy?.status === "complete" &&
            latest.niceGuy.crawlId === latest.crawl?.id,
    );

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-base-content">Run audit stages</h2>
            <p className="mt-2 text-sm text-base-content/70">
                Screenshots are captured automatically when a crawl completes. Stages must run in
                order; disabled actions indicate missing prerequisites or an active run.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-sm font-medium text-base-content">Crawl</p>
                    <div className="mt-3">
                        <RunCrawlButton
                            websiteId={websiteId}
                            crawlStatus={website.crawlStatus}
                            canRun={readiness.canRunCrawl}
                        />
                    </div>
                </div>
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-sm font-medium text-base-content">Screenshots</p>
                    <p className="mt-2 text-sm text-base-content/70">
                        Included with crawl. Rerun crawl to recapture homepage screenshots.
                    </p>
                </div>
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-sm font-medium text-base-content">PageSpeed</p>
                    <div className="mt-3">
                        <RunPageSpeedButton
                            websiteId={websiteId}
                            pageSpeedStatus={website.pageSpeedStatus}
                            crawlComplete={crawlComplete && homepageOk}
                            canRun={readiness.canRunPageSpeed}
                        />
                    </div>
                </div>
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-sm font-medium text-base-content">Nice Guy Metrics</p>
                    <div className="mt-3">
                        <RunNiceGuyAnalysisButton
                            websiteId={websiteId}
                            niceGuyStatus={website.niceGuyStatus}
                            prerequisitesMet={pageSpeedReady && crawlComplete && homepageOk}
                            canRun={readiness.canRunNiceGuy}
                        />
                    </div>
                </div>
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <p className="text-sm font-medium text-base-content">AI analysis</p>
                    <div className="mt-3">
                        <RunAiAnalysisButton
                            websiteId={websiteId}
                            aiAnalysisStatus={website.aiAnalysisStatus}
                            prerequisitesMet={niceGuyReady}
                            canRun={readiness.canRunAiAnalysis}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
