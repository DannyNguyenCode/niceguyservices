import MetricCard from "@/components/audit-dashboard/metric-card";
import { pagespeedDisplayLabel, formatAuditStageStatus } from "@/src/lib/audit-dashboard-labels";
import type { WebsiteAuditDashboardData } from "@/src/types/audit-dashboard";
import { AUDIT_SECTIONS } from "@/src/lib/audit-sections";

type AuditOverviewProps = {
    overview: WebsiteAuditDashboardData["overview"];
    aiAnalysisStatus: string;
    embedded?: boolean;
};

function formatCount(value: number | null): string {
    if (value === null) return "Not available";
    return String(value);
}

function formatScore(value: number | null): string {
    if (value === null) return "Not run";
    return String(value);
}

export default function AuditOverview({
    overview,
    aiAnalysisStatus,
    embedded = false,
}: AuditOverviewProps) {
    const mobileHint =
        overview.mobilePerformance !== null
            ? pagespeedDisplayLabel(overview.mobilePerformance)
            : null;
    const desktopHint =
        overview.desktopPerformance !== null
            ? pagespeedDisplayLabel(overview.desktopPerformance)
            : null;

    const content = (
        <>
            <h3
                id={AUDIT_SECTIONS.overview.headingId}
                className="text-base font-semibold text-base-content"
            >
                Key metrics
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </>
    );

    if (embedded) {
        return <div id={AUDIT_SECTIONS.overview.id}>{content}</div>;
    }

    return (
        <section
            id={AUDIT_SECTIONS.overview.id}
            className="rounded-2xl bg-base-100 p-4 shadow-sm sm:p-6 scroll-mt-24"
        >
            {content}
        </section>
    );
}
