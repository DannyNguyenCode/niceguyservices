/**
 * Non-destructive development preflight checks.
 *
 * Usage:
 *   npm run dev:check
 */

import { isAuthConfigured } from "../src/lib/auth/config";
import { isCloudinaryConfigured } from "../src/lib/cloudinary-config";
import { isAiConfigured } from "../src/lib/ai-config";
import { getRateLimitEnv } from "../src/config/env";
import { getDeploymentEnvironment } from "../src/config/app-env";
import { pingDatabase } from "../src/lib/mongodb";
import { isPageSpeedConfigured } from "../src/lib/pagespeed-config";

async function checkPlaywright(): Promise<"available" | "unavailable"> {
    try {
        const { chromium } = await import("playwright");
        const executablePath = chromium.executablePath();
        if (!executablePath) {
            return "unavailable";
        }
        return "available";
    } catch {
        return "unavailable";
    }
}

function statusLabel(ok: boolean): string {
    return ok ? "configured" : "unavailable";
}

async function main() {
    const deploymentEnvironment = getDeploymentEnvironment();
    const mongodbConfigured = Boolean(process.env.MONGODB_URI?.trim());
    let mongodbConnection: "successful" | "failed" = "failed";

    if (mongodbConfigured) {
        try {
            mongodbConnection = (await pingDatabase()) ? "successful" : "failed";
        } catch {
            mongodbConnection = "failed";
        }
    }

    const rateLimitEnv = getRateLimitEnv();
    const playwrightStatus = await checkPlaywright();

    console.log("Development preflight");
    console.log(`DEPLOYMENT_ENV ${deploymentEnvironment}`);
    console.log(`MongoDB: ${statusLabel(mongodbConfigured)}`);
    console.log(`MongoDB connection: ${mongodbConnection}`);
    console.log(`Cloudinary: ${statusLabel(isCloudinaryConfigured())}`);
    console.log(`PageSpeed: ${statusLabel(isPageSpeedConfigured())}`);
    console.log(`AI: ${statusLabel(isAiConfigured())}`);
    console.log(`Authentication: ${statusLabel(isAuthConfigured())}`);
    console.log(`Rate limiter: ${rateLimitEnv.provider}`);
    console.log(`Playwright: ${playwrightStatus}`);

    if (!mongodbConfigured || mongodbConnection === "failed") {
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error("FAIL dev:check:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
