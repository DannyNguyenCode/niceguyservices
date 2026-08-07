/**
 * Production deployment preflight checks.
 *
 * Usage:
 *   npx tsx scripts/deploy-check.ts
 */

import { getAppEnv } from "../src/config/app-env";
import { getRateLimitEnv } from "../src/config/env";
import { assertProductionApplicationUrl } from "../src/lib/application-url";

function check(name: string, fn: () => void): void {
    try {
        fn();
        console.log(`OK  ${name}`);
    } catch (error) {
        console.error(`FAIL ${name}:`, error instanceof Error ? error.message : String(error));
        process.exitCode = 1;
    }
}

async function main() {
    const nodeEnv = process.env.NODE_ENV ?? "development";
    console.log(`Deployment check (${nodeEnv})`);

    check("application environment", () => {
        getAppEnv();
    });

    if (nodeEnv === "production") {
        check("production application URL", () => {
            assertProductionApplicationUrl();
        });
        check("rate-limit configuration", () => {
            const env = getRateLimitEnv();
            if (env.provider !== "redis") {
                throw new Error("Production requires RATE_LIMIT_PROVIDER=redis.");
            }
            if (env.bypassMode !== "disabled") {
                throw new Error("RATE_LIMIT_BYPASS_MODE must be disabled.");
            }
        });
        check("authentication secret present", () => {
            const env = getAppEnv();
            if (!env.authSecret) {
                throw new Error(
                    "AUTH_SECRET is not configured. Administrator authentication must be enabled before production traffic.",
                );
            }
        });
    }

    console.log(nodeEnv === "production" ? "Production preflight complete." : "Preflight complete.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
