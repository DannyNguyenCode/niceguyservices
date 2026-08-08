import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";

describe("manual PageSpeed reliability", () => {
    it("runs mobile and desktop concurrently with Promise.allSettled", async () => {
        const source = await readFile(
            path.join(process.cwd(), "src/services/run-pagespeed-analysis.ts"),
            "utf8",
        );
        assert.match(source, /Promise\.allSettled/);
        assert.match(source, /STRATEGY_STARTED/);
        assert.match(source, /STRATEGY_COMPLETED|STRATEGY_FAILED/);
        // Sequential awaits of runStrategy back-to-back should no longer exist.
        assert.equal(
            /await runStrategy\(\{[\s\S]*?\}\);\s*const desktopResult = await runStrategy/.test(
                source,
            ),
            false,
        );
    });

    it("persists a handled failed outcome instead of collapsing both failures as success:false", async () => {
        const source = await readFile(
            path.join(process.cwd(), "src/services/run-pagespeed-analysis.ts"),
            "utf8",
        );
        assert.match(source, /status: "complete" \| "partial" \| "failed"/);
        assert.match(source, /success: true/);
        assert.match(source, /status: finalStatus/);
        assert.equal(/code: "PAGESPEED_FAILED"/.test(source), false);
    });

    it("stores admin-safe error codes including provider/rate-limit/timeout/network/url/config", async () => {
        const source = await readFile(
            path.join(process.cwd(), "src/services/run-pagespeed-analysis.ts"),
            "utf8",
        );
        for (const code of [
            "PAGESPEED_CONFIGURATION_ERROR",
            "PAGESPEED_RATE_LIMIT",
            "PAGESPEED_TIMEOUT",
            "PAGESPEED_NETWORK_ERROR",
            "PAGESPEED_URL_ERROR",
            "PAGESPEED_PROVIDER_ERROR",
        ]) {
            assert.match(source, new RegExp(code));
        }
        assert.match(source, /errorCode: mapped\.code/);
        assert.match(source, /errorMessage: mapped\.message/);
    });

    it("revalidates and refreshes after persisted failures", async () => {
        const action = await readFile(
            path.join(process.cwd(), "src/actions/pagespeed.ts"),
            "utf8",
        );
        const button = await readFile(
            path.join(process.cwd(), "components/websiteAudit/RunPageSpeedButton.tsx"),
            "utf8",
        );
        assert.match(action, /persisted/);
        assert.match(action, /result\.status !== "failed"/);
        assert.match(action, /revalidatePath|revalidatePageSpeedPaths/);
        assert.match(button, /result\.persisted \|\| result\.ok/);
        assert.match(button, /router\.refresh\(\)/);
    });

    it("loads latest metrics including failed/queued records for the dashboard", async () => {
        const metrics = await readFile(
            path.join(process.cwd(), "src/data/google-metrics.ts"),
            "utf8",
        );
        const ui = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsitePageSpeedSection.tsx"),
            "utf8",
        );
        const latestFn = metrics.slice(
            metrics.indexOf("export async function getLatestGoogleMetricByStrategy"),
            metrics.indexOf("export async function updateGoogleMetricStatus"),
        );
        assert.equal(/status:\s*"complete"/.test(latestFn), false);
        assert.match(ui, /metric\.errorCode/);
        assert.match(ui, /PageSpeed is queued|in progress/);
        assert.match(ui, /PageSpeed analysis failed/);
    });

    it("keeps per-strategy records independent for partial success", async () => {
        const source = await readFile(
            path.join(process.cwd(), "src/services/run-pagespeed-analysis.ts"),
            "utf8",
        );
        assert.match(source, /strategy: "mobile"/);
        assert.match(source, /strategy: "desktop"/);
        assert.match(source, /mobileRecord/);
        assert.match(source, /desktopRecord/);
        assert.match(source, /finalStatus === "partial"/);
    });
});
