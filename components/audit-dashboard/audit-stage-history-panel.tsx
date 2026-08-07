import { Suspense } from "react";
import AuditHistorySection from "@/components/audit-dashboard/audit-history-section";
import { getWebsiteAuditDashboardHistory } from "@/src/services/get-website-audit-dashboard";

type AuditStageHistoryPanelProps = {
    websiteId: string;
};

async function StageHistoryContent({ websiteId }: AuditStageHistoryPanelProps) {
    const history = await getWebsiteAuditDashboardHistory(websiteId);
    return (
        <AuditHistorySection
            crawlRuns={history.crawlRuns}
            pageSpeedRuns={history.pageSpeedRuns}
            niceGuyRuns={history.niceGuyRuns}
            aiRuns={history.aiRuns}
        />
    );
}

function StageHistoryFallback() {
    return (
        <div className="rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6" aria-busy="true">
            <div className="h-6 w-48 animate-pulse rounded bg-base-200" />
            <div className="mt-4 h-24 animate-pulse rounded-xl bg-base-200" />
            <p className="sr-only">Loading stage execution log…</p>
        </div>
    );
}

export default function AuditStageHistoryPanel({ websiteId }: AuditStageHistoryPanelProps) {
    return (
        <Suspense fallback={<StageHistoryFallback />}>
            <StageHistoryContent websiteId={websiteId} />
        </Suspense>
    );
}
