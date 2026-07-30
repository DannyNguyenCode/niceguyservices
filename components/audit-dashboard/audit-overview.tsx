import MetricCard from "@/components/audit-dashboard/metric-card";
import { pagespeedDisplayLabel, formatAuditStageStatus } from "@/src/lib/audit-dashboard-labels";
import type { WebsiteAuditDashboardData } from "@/src/types/audit-dashboard";

type AuditOverviewProps = {
    overview: WebsiteAuditDashboardData["overview"];
    aiAnalysisStatus: string;
};

function formatCount(value: number | null): string {
    if (value === null) return "Not available";
    return String(value);
}

function formatScore(value: number | null): string {
    if (value === null) return "Not run";
    return String(value);
}

export default function AuditOverview({ overview, aiAnalysisStatus }: AuditOverviewProps) {
    const mobileHint =
        overview.mobilePerformance !== null
            ? pagespeedDisplayLabel(overview.mobilePerformance)
            : null;
    const desktopHint =
        overview.desktopPerformance !== null
            ? pagespeedDisplayLabel(overview.desktopPerformance)
            : null;

    return (
        <section id="overview" className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-base-content">Overview</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                    label="Pages crawled"
                    value={formatCount(overview.pagesCrawled)}
                />
                <MetricCard
                    label="Screenshots"
                    value={formatCount(overview.screenshotCount)}
                />
                <MetricCard
                    label="Mobile performance"
                    value={formatScore(overview.mobilePerformance)}
                    hint={mobileHint}
                />
                <MetricCard
                    label="Desktop performance"
                    value={formatScore(overview.desktopPerformance)}
                    hint={desktopHint}
                />
                <MetricCard
                    label="Nice Guy score"
                    value={formatScore(overview.niceGuyScore)}
                    hint={
                        overview.niceGuyConfidence !== null
                            ? `Confidence ${overview.niceGuyConfidence}`
                            : null
                    }
                />
                <MetricCard
                    label="AI analysis"
                    value={formatAuditStageStatus(
                        aiAnalysisStatus as Parameters<typeof formatAuditStageStatus>[0],
                    )}
                />
            </div>
        </section>
    );
}
