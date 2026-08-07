/**
 * Safe production smoke checks.
 *
 * Usage:
 *   npx tsx scripts/production-smoke-test.ts --base-url https://example.com
 *   npx tsx scripts/production-smoke-test.ts --base-url https://example.com --full
 */

type Options = {
    baseUrl: string;
    full: boolean;
};

function parseArgs(): Options {
    const baseUrlIndex = process.argv.indexOf("--base-url");
    const baseUrl =
        baseUrlIndex >= 0 ? process.argv[baseUrlIndex + 1]?.trim() : process.env.APP_URL?.trim();

    if (!baseUrl) {
        throw new Error("Provide --base-url or set APP_URL.");
    }

    return {
        baseUrl: baseUrl.replace(/\/$/, ""),
        full: process.argv.includes("--full"),
    };
}

async function expectStatus(url: string, status: number): Promise<void> {
    const response = await fetch(url, { redirect: "manual" });
    if (response.status !== status) {
        throw new Error(`${url} expected ${status}, received ${response.status}`);
    }
}

async function main() {
    const options = parseArgs();
    console.log(`Smoke test: ${options.baseUrl}`);

    await expectStatus(`${options.baseUrl}/api/health`, 200);
    console.log("OK  /api/health");

    const invalidReport = await fetch(`${options.baseUrl}/report/invalid-token-value`);
    if (invalidReport.status >= 500) {
        throw new Error("Invalid public report token returned a server error.");
    }
    console.log("OK  invalid public report token does not expose server error");

    if (options.full) {
        const dashboard = await fetch(`${options.baseUrl}/dashboard`, { redirect: "manual" });
        if (dashboard.status >= 500) {
            throw new Error("Dashboard returned a server error.");
        }
        console.log("OK  /dashboard responds");
    }

    console.log("Smoke test complete.");
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});
