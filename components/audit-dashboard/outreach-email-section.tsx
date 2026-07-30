import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import OutreachEmailBuilder from "@/components/audit-dashboard/outreach-email-builder";
import { getOutreachReadiness } from "@/src/services/outreach/get-outreach-readiness";
import type { SerializableOutreachEmailDraft } from "@/src/services/outreach/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

const STATUS_LABELS: Record<string, string> = {
    draft: "Draft",
    approved: "Approved",
    rejected: "Rejected",
    archived: "Archived",
    "not-generated": "Not generated",
};

type OutreachEmailSectionProps = {
    websiteActive: boolean;
    publicReports: SerializablePublicReport[];
    outreachDrafts: SerializableOutreachEmailDraft[];
};

export default async function OutreachEmailSection({
    websiteActive,
    publicReports,
    outreachDrafts,
}: OutreachEmailSectionProps) {
    const latestPublicReport = publicReports[0] ?? null;
    const latestDraft = outreachDrafts[0] ?? null;

    const readiness = latestPublicReport
        ? await getOutreachReadiness({
              publicReportId: latestPublicReport.id,
              websiteActive,
          })
        : {
              canGenerate: false,
              blockers: [{ code: "REPORT_NOT_FOUND", message: "No public report available." }],
              warnings: [],
              availablePdfReports: [],
              supportedFindingsCount: 0,
          };

    return (
        <section id="outreach-email" className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-base-content">Outreach email</h2>
                <p className="mt-2 text-sm text-base-content/75">
                    Generate editable outreach drafts from saved audit evidence. No emails are sent
                    during this phase.
                </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-base-content">Outreach readiness</h3>
                    <p className="mt-2 text-sm text-base-content/75">
                        {readiness.canGenerate
                            ? `${readiness.supportedFindingsCount} supported findings are available.`
                            : readiness.blockers[0]?.message ?? "Outreach drafting is not available."}
                    </p>
                    {readiness.warnings.length > 0 ? (
                        <ul className="mt-2 grid grid-cols-1 gap-1 text-xs text-base-content/65">
                            {readiness.warnings.map((warning) => (
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
                        {latestDraft ? (
                            <p className="mt-2 text-sm text-base-content/65">
                                Latest draft: {STATUS_LABELS[latestDraft.status] ?? latestDraft.status}
                                {latestDraft.generation?.generatedAt || latestDraft.createdAt
                                    ? ` · ${formatWebsiteDate(latestDraft.generation?.generatedAt ?? latestDraft.createdAt)}`
                                    : ""}
                            </p>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {latestPublicReport ? (
                <div className="mt-6">
                    <OutreachEmailBuilder
                        publicReportId={latestPublicReport.id}
                        availablePdfReports={readiness.availablePdfReports}
                        canGenerate={readiness.canGenerate}
                        initialDraft={latestDraft}
                    />
                </div>
            ) : (
                <p className="mt-4 text-sm text-base-content/70">
                    Create a public report snapshot before generating an outreach email.
                </p>
            )}

            {outreachDrafts.length > 0 ? (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-base-content">Draft history</h3>
                    <div className="mt-3 grid grid-cols-1 gap-3">
                        {outreachDrafts.map((draft) => (
                            <div
                                key={draft.id}
                                className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm"
                            >
                                <div className="grid grid-cols-1 gap-1 text-sm text-base-content/75">
                                    <p className="font-medium text-base-content">
                                        {draft.subject || "Failed draft"}
                                    </p>
                                    <p>
                                        {formatWebsiteDate(draft.createdAt)} ·{" "}
                                        {STATUS_LABELS[draft.status] ?? draft.status}
                                        {draft.isCurrentApproved ? " · Current approved" : ""}
                                    </p>
                                    <p>
                                        Revision r{draft.source.publicReportRevision} ·{" "}
                                        {draft.strategy.tone} · {draft.strategy.length}
                                    </p>
                                    {draft.errorMessage ? (
                                        <p className="text-error">{draft.errorMessage}</p>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </section>
    );
}
