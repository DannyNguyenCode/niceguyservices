/**
 * Verify a completed audit run without re-running the pipeline.
 */
import { connectToDatabase } from "../src/lib/mongodb";
import { getAuditJobById } from "../src/data/audit-jobs";
import { getAuditRunById } from "../src/data/audit-runs";
import { getPublicReportDraftForAuditRun } from "../src/data/public-reports";
import { getOutreachDraftsForWebsite } from "../src/data/outreach-email-drafts";
import { getOutreachEmailByWebsiteId } from "../src/data/outreach-email";
import { getWebsiteById } from "../src/data/websites";
import { loadAuditRunResources } from "../src/services/audit-history/load-audit-run-resources";

const websiteId = process.argv[2];
const auditRunId = process.argv[3];
const jobId = process.argv[4];

if (!websiteId || !auditRunId || !jobId) {
    console.error("Usage: verify-audit-run.ts <websiteId> <auditRunId> <jobId>");
    process.exit(1);
}

async function main() {
    await connectToDatabase();
    const [job, auditRun, resources, reportDraft, website, outreachDrafts, outreachEmail] =
        await Promise.all([
            getAuditJobById(jobId),
            getAuditRunById(auditRunId),
            loadAuditRunResources({ websiteId, auditRunId }),
            getPublicReportDraftForAuditRun(auditRunId),
            getWebsiteById(websiteId),
            getOutreachDraftsForWebsite(websiteId),
            getOutreachEmailByWebsiteId(websiteId),
        ]);

    const reloaded = await loadAuditRunResources({ websiteId, auditRunId });

    const checks = [
        ["Job completed", job?.status === "completed" || job?.status === "completed_with_warnings"],
        ["Crawl complete", resources?.crawl?.status === "complete"],
        ["Nice Guy linked", auditRun?.references.niceGuyMetricsId === resources?.niceGuy?.id],
        ["AI summary linked", auditRun?.references.aiSummaryId === resources?.aiSummary?.id],
        ["Report draft saved", reportDraft?.status === "draft"],
        ["Report not published", !reportDraft?.publishedAt],
        ["Persistence reload", reloaded?.crawl?.id === resources?.crawl?.id],
        ["No outreach email", outreachEmail === null],
        ["No outreach draft for report", !outreachDrafts.some((d) => d.publicReportId === reportDraft?.id)],
        ["Website exists", Boolean(website && !website.deletedAt)],
    ];

    for (const [label, ok] of checks) {
        console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
    }

    process.exit(checks.every(([, ok]) => ok) ? 0 : 1);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
