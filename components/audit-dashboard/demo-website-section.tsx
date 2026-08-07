import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import DemoWebsiteBuilder from "@/components/audit-dashboard/demo-website-builder";
import { getDemoGenerationsForProject } from "@/src/data/demo-generations";
import { getDemoProjectsForWebsite } from "@/src/data/demo-projects";
import { getDemoReadiness } from "@/src/services/demo/load-demo-readiness";
import type { SerializablePublicReport } from "@/src/types/public-report";

const STATUS_LABELS: Record<string, string> = {
    draft: "Draft",
    ready: "Ready",
    generating: "Generating",
    review: "Review",
    approved: "Approved",
    rejected: "Rejected",
    archived: "Archived",
    "not-created": "Not created",
};

type DemoWebsiteSectionProps = {
    websiteActive: boolean;
    publicReports: SerializablePublicReport[];
};

export default async function DemoWebsiteSection({
    websiteActive,
    publicReports,
}: DemoWebsiteSectionProps) {
    const latestPublicReport = publicReports[0] ?? null;
    const demoProjects = latestPublicReport
        ? await getDemoProjectsForWebsite(latestPublicReport.websiteId)
        : [];
    const latestProject = demoProjects[0] ?? null;
    const generations = latestProject
        ? await getDemoGenerationsForProject(latestProject.id)
        : [];

    const readiness = latestPublicReport
        ? await getDemoReadiness({
              publicReportId: latestPublicReport.id,
              websiteActive,
              demoProjectId: latestProject?.id ?? null,
              selectedPages: latestProject?.configuration.pages,
              contentPolicySelected: Boolean(latestProject?.contentPolicy.mode ?? true),
          })
        : {
              canCreateProject: false,
              canGenerate: false,
              blockers: [{ code: "REPORT_NOT_FOUND", message: "No public report available." }],
              warnings: [],
              availableHeroSuggestions: [],
              availableScreenshots: [],
              supportedPages: [],
              supportedFacts: [],
          };

    const latestGeneration = generations[0] ?? null;
    const approvedFactsCount = latestProject
        ? Object.values(latestProject.approvedFacts).filter(Boolean).length
        : 0;

    return (
        <section id="demo-website" className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-base-content">Demo website</h2>
                <p className="mt-2 text-sm text-base-content/75">
                    Generate administrator-reviewed demonstration websites from saved audit evidence.
                    No automatic deployment or prospect contact occurs during this phase.
                </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-base-content">Demo readiness</h3>
                    <p className="mt-2 text-sm text-base-content/75">
                        {readiness.canGenerate || readiness.canCreateProject
                            ? "Demo project creation is available from the saved public report snapshot."
                            : readiness.blockers[0]?.message ?? "Demo generation is not available."}
                    </p>
                    {readiness.warnings.length > 0 ? (
                        <ul className="mt-2 grid grid-cols-1 gap-1 text-xs text-base-content/65">
                            {readiness.warnings.slice(0, 4).map((warning) => (
                                <li key={warning.code}>{warning.message}</li>
                            ))}
                        </ul>
                    ) : null}
                </div>

                {latestPublicReport ? (
                    <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-base-content">Source report</h3>
                        <p className="mt-2 text-sm text-base-content/75">
                            Public Report Revision {latestPublicReport.revisionNumber}
                        </p>
                        <p className="text-sm text-base-content/75">{latestPublicReport.title}</p>
                        {latestProject ? (
                            <p className="mt-2 text-sm text-base-content/65">
                                Project: {STATUS_LABELS[latestProject.status] ?? latestProject.status}
                                {latestProject.updatedAt
                                    ? ` · ${formatWebsiteDate(latestProject.updatedAt)}`
                                    : ""}
                            </p>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {latestProject ? (
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                    <p>Architecture: {latestProject.configuration.architecture}</p>
                    <p>Visual direction: {latestProject.configuration.visualDirection}</p>
                    <p>Approved facts: {approvedFactsCount}</p>
                    <p>Assets: {latestProject.source.screenshotIds.length}</p>
                    <p>
                        Generation:{" "}
                        {latestGeneration
                            ? `${latestGeneration.status} (${latestGeneration.provider.name})`
                            : "Not started"}
                    </p>
                    <p>
                        Preview:{" "}
                        {latestGeneration?.output.previewUrl
                            ? "Private preview available"
                            : "Not available"}
                    </p>
                </div>
            ) : null}

            {latestPublicReport ? (
                <DemoWebsiteBuilder
                    publicReportId={latestPublicReport.id}
                    readiness={readiness}
                    initialProject={latestProject}
                    generations={generations}
                />
            ) : null}
        </section>
    );
}
