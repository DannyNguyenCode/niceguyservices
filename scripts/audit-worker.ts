/**
 * Background worker for queued audit crawl jobs.
 *
 * Usage:
 *   npx tsx --import ./scripts/preload-cli.ts scripts/audit-worker.ts
 *   npx tsx --import ./scripts/preload-cli.ts scripts/audit-worker.ts --once
 */

import { runAuditWorkerCycle } from "../src/services/audit-pipeline/audit-pipeline-worker";

const once = process.argv.includes("--once");
const intervalMs = Number.parseInt(process.env.AUDIT_WORKER_INTERVAL_MS ?? "5000", 10);

async function runCycle(): Promise<void> {
    const result = await runAuditWorkerCycle();
    console.log(
        `[audit-worker] processed=${result.processedJobs} recovered=${JSON.stringify(result.recovered)}`,
    );
}

async function main(): Promise<void> {
    if (once) {
        await runCycle();
        return;
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
        await runCycle();
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
}

main().catch((error) => {
    console.error("[audit-worker] fatal error:", error);
    process.exitCode = 1;
});
