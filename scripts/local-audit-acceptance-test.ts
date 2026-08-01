/**
 * Local end-to-end audit acceptance test.
 *
 * Usage:
 *   npx tsx --import ./scripts/preload-cli.ts scripts/local-audit-acceptance-test.ts
 */

import { DEVELOPMENT_TEST_WEBSITE } from "../src/config/development-test-website";
import { connectToDatabase } from "../src/lib/mongodb";
import { getActiveAuditJobForWebsite, getAuditJobById, cancelAuditJob } from "../src/data/audit-jobs";
import { getAuditRunById, getOpenAuditRunForWebsite, updateAuditRunStatus } from "../src/data/audit-runs";
import { createWebsite, getWebsiteById, getWebsiteByNormalizedDomain, updateWebsite } from "../src/data/websites";
import { getPublicReportDraftForAuditRun } from "../src/data/public-reports";
import { loadAuditRunResources } from "../src/services/audit-history/load-audit-run-resources";
import { runAuditPipeline } from "../src/services/audit-pipeline/run-audit-pipeline";
import { startAuditJob } from "../src/services/audit-pipeline/start-audit-job";
import { getOutreachDraftsForWebsite } from "../src/data/outreach-email-drafts";
import { getOutreachEmailByWebsiteId } from "../src/data/outreach-email";

const TERMINAL_JOB_STATUSES = new Set([
    "completed",
    "completed_with_warnings",
    "failed",
    "cancelled",
]);

async function ensureWebsite() {
    const existing = await getWebsiteByNormalizedDomain(DEVELOPMENT_TEST_WEBSITE.normalizedDomain);
    if (existing) {
        return updateWebsite(existing.id, {
            businessName: DEVELOPMENT_TEST_WEBSITE.businessName,
            websiteUrl: DEVELOPMENT_TEST_WEBSITE.websiteUrl,
            businessEmail: DEVELOPMENT_TEST_WEBSITE.businessEmail,
            industry: DEVELOPMENT_TEST_WEBSITE.industry,
            location: DEVELOPMENT_TEST_WEBSITE.location,
            source: DEVELOPMENT_TEST_WEBSITE.source,
            status: existing.status,
            auditStatus: existing.auditStatus,
            demoStatus: existing.demoStatus,
            outreachStatus: existing.outreachStatus,
        });
    }

    return createWebsite({
        businessName: DEVELOPMENT_TEST_WEBSITE.businessName,
        websiteUrl: DEVELOPMENT_TEST_WEBSITE.websiteUrl,
        businessEmail: DEVELOPMENT_TEST_WEBSITE.businessEmail,
        industry: DEVELOPMENT_TEST_WEBSITE.industry,
        location: DEVELOPMENT_TEST_WEBSITE.location,
        source: DEVELOPMENT_TEST_WEBSITE.source,
    });
}

async function waitForTerminalJob(jobId: string, maxCycles = 60) {
    for (let cycle = 0; cycle < maxCycles; cycle += 1) {
        const job = await getAuditJobById(jobId);
        if (!job) {
            throw new Error("Audit job disappeared.");
        }
        if (TERMINAL_JOB_STATUSES.has(job.status)) {
            return job;
        }
        console.log(
            `[acceptance] cycle ${cycle + 1}: status=${job.status} stage=${job.currentStage ?? "none"} progress=${job.progressPercent}%`,
        );
        await runAuditPipeline(jobId);
    }
    throw new Error("Audit job did not reach a terminal state in time.");
}

async function main() {
    await connectToDatabase();
    console.log("[acceptance] Ensuring Nice Guy Web Design website record...");
    const website = await ensureWebsite();
    console.log(`[acceptance] Website ID: ${website.id}`);

    const activeJob = await getActiveAuditJobForWebsite(website.id);
    if (activeJob) {
        console.log(`[acceptance] Cancelling previous active job ${activeJob.id} (${activeJob.status})`);
        await cancelAuditJob(activeJob.id);
    }

    const openAuditRun = await getOpenAuditRunForWebsite(website.id);
    if (openAuditRun) {
        console.log(`[acceptance] Cancelling previous open audit run ${openAuditRun.id}`);
        await updateAuditRunStatus(openAuditRun.id, "cancelled");
    }

    const started = await startAuditJob({
        websiteId: website.id,
        trigger: { type: "administrator", actorId: null, actorName: null },
    });
    console.log(`[acceptance] Job ID: ${started.job.id}`);
    console.log(`[acceptance] Audit run ID: ${started.auditRunId}`);
    console.log(`[acceptance] Initial status: ${started.job.status}`);

    const finalJob = await waitForTerminalJob(started.job.id);
    console.log(`[acceptance] Final job status: ${finalJob.status}`);

    const auditRun = await getAuditRunById(started.auditRunId);
    const resources = await loadAuditRunResources({
        websiteId: website.id,
        auditRunId: started.auditRunId,
    });
    const reportDraft = await getPublicReportDraftForAuditRun(started.auditRunId);
    const refreshedWebsite = await getWebsiteById(website.id);
    const reloadedResources = await loadAuditRunResources({
        websiteId: website.id,
        auditRunId: started.auditRunId,
    });
    const outreachDrafts = await getOutreachDraftsForWebsite(website.id);
    const outreachEmail = await getOutreachEmailByWebsiteId(website.id);

    const checks: Array<{ label: string; ok: boolean; detail?: string }> = [
        {
            label: "Job reached terminal state",
            ok: TERMINAL_JOB_STATUSES.has(finalJob.status),
            detail: finalJob.status,
        },
        {
            label: "Crawl completed for audit run",
            ok: resources?.crawl?.status === "complete" && resources.crawl.auditRunId === started.auditRunId,
            detail: resources?.crawl?.status ?? "missing",
        },
        {
            label: "Nice Guy metric belongs to audit run",
            ok: Boolean(resources?.niceGuy && auditRun?.references.niceGuyMetricsId === resources.niceGuy.id),
            detail: resources?.niceGuy?.id ?? "missing",
        },
        {
            label: "AI summary belongs to audit run",
            ok: Boolean(resources?.aiSummary && auditRun?.references.aiSummaryId === resources.aiSummary.id),
            detail: resources?.aiSummary?.id ?? "missing",
        },
        {
            label: "PageSpeed results linked to crawl",
            ok: Boolean(
                resources?.pageSpeed.mobile?.crawlId === resources?.crawl?.id ||
                    resources?.pageSpeed.desktop?.crawlId === resources?.crawl?.id,
            ),
        },
        {
            label: "Screenshots captured or stage completed with warnings",
            ok: Boolean(
                (resources?.screenshots?.length ?? 0) > 0 ||
                    finalJob.stages?.screenshots?.status === "completed_with_warnings" ||
                    finalJob.stages?.screenshots?.status === "skipped",
            ),
            detail: `${resources?.screenshots?.length ?? 0} screenshots`,
        },
        {
            label: "All resources share the same audit run",
            ok: Boolean(
                resources?.crawl?.auditRunId === started.auditRunId &&
                    auditRun?.references.niceGuyMetricsId === resources?.niceGuy?.id &&
                    auditRun?.references.aiSummaryId === resources?.aiSummary?.id,
            ),
        },
        {
            label: "Reloaded audit resources match persisted records",
            ok: Boolean(
                reloadedResources?.crawl?.id === resources?.crawl?.id &&
                    reloadedResources?.niceGuy?.id === resources?.niceGuy?.id &&
                    reloadedResources?.aiSummary?.id === resources?.aiSummary?.id,
            ),
        },
        {
            label: "Report draft saved",
            ok: Boolean(reportDraft && reportDraft.status === "draft"),
            detail: reportDraft?.id ?? "missing",
        },
        {
            label: "Report draft not published",
            ok: !reportDraft?.publishedAt && reportDraft?.status === "draft",
        },
        {
            label: "Reloaded website still exists",
            ok: Boolean(refreshedWebsite && !refreshedWebsite.deletedAt),
        },
        {
            label: "No duplicate active job remains",
            ok: (await getActiveAuditJobForWebsite(website.id)) === null,
        },
        {
            label: "No outreach email record created",
            ok: outreachEmail === null,
        },
        {
            label: "No outreach draft created for report draft",
            ok: !outreachDrafts.some((draft) => draft.publicReportId === reportDraft?.id),
        },
    ];

    let failed = 0;
    for (const check of checks) {
        const status = check.ok ? "PASS" : "FAIL";
        console.log(`[acceptance] ${status} ${check.label}${check.detail ? ` (${check.detail})` : ""}`);
        if (!check.ok) failed += 1;
    }

    console.log(`[acceptance] Dashboard URL: /dashboard/websites/${website.id}?auditRunId=${started.auditRunId}&jobId=${started.job.id}`);

    if (failed > 0 || finalJob.status === "failed") {
        process.exitCode = 1;
        throw new Error(`Acceptance test failed (${failed} checks).`);
    }

    console.log("[acceptance] All checks passed.");
}

main().catch((error) => {
    console.error("[acceptance] ERROR:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
