import type { AuditReadiness } from "@/src/types/audit-dashboard";

const NEXT_STEP_MESSAGES: Record<AuditReadiness["nextRecommendedStage"], string> = {
    crawl: "Run the website crawl.",
    screenshots: "Capture homepage screenshots (included when you run a crawl).",
    pagespeed: "Generate mobile and desktop PageSpeed results.",
    niceguy: "Run Nice Guy Metrics.",
    "ai-analysis": "Generate AI analysis and hero suggestions.",
    complete: "The current audit is complete.",
};

type AuditActionPanelProps = {
    readiness: AuditReadiness;
};

export default function AuditActionPanel({ readiness }: AuditActionPanelProps) {
    const nextMessage = NEXT_STEP_MESSAGES[readiness.nextRecommendedStage];

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-base-content">Next action</h2>
            <p className="mt-3 text-sm text-base-content">
                Next step: <span className="font-medium">{nextMessage}</span>
            </p>

            {readiness.isAuditReadyForReport ? (
                <div className="mt-4 rounded-xl bg-success/10 p-4">
                    <p className="text-sm font-medium text-success">
                        Audit ready for report generation
                    </p>
                    <p className="mt-1 text-sm text-base-content/75">
                        All required stages are complete. Create a public report draft to share a
                        tokenized client-facing summary.
                    </p>
                </div>
            ) : null}

            {readiness.blockers.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-2">
                    {readiness.blockers.map((blocker) => (
                        <p
                            key={`${blocker.stage}-${blocker.code}`}
                            className="text-sm text-base-content/75"
                            role="status"
                        >
                            {blocker.message}
                        </p>
                    ))}
                </div>
            ) : null}

            {readiness.warnings.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-2">
                    {readiness.warnings.map((warning) => (
                        <p key={warning} className="text-sm text-warning" role="status">
                            {warning}
                        </p>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
