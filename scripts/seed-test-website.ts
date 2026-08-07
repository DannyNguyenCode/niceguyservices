/**
 * Idempotently ensure the Nice Guy Web Design development test website exists.
 *
 * Usage:
 *   npm run dev:seed-test-website
 */

import { connectToDatabase } from "../src/lib/mongodb";
import { normalizeWebsiteUrl } from "../src/lib/normalize-domain";
import { DEVELOPMENT_TEST_WEBSITE } from "../src/config/development-test-website";
import { createWebsite, getWebsiteByNormalizedDomain } from "../src/data/websites";

export { DEVELOPMENT_TEST_WEBSITE as TEST_WEBSITE };

export async function ensureDevelopmentTestWebsite() {
    await connectToDatabase();
    const { normalizedDomain } = normalizeWebsiteUrl(DEVELOPMENT_TEST_WEBSITE.websiteUrl);

    const existing = await getWebsiteByNormalizedDomain(normalizedDomain);
    if (existing) {
        return { created: false as const, website: existing };
    }

    const website = await createWebsite({
        businessName: DEVELOPMENT_TEST_WEBSITE.businessName,
        websiteUrl: DEVELOPMENT_TEST_WEBSITE.websiteUrl,
        businessEmail: DEVELOPMENT_TEST_WEBSITE.businessEmail,
        industry: DEVELOPMENT_TEST_WEBSITE.industry,
        location: DEVELOPMENT_TEST_WEBSITE.location,
        source: DEVELOPMENT_TEST_WEBSITE.source,
    });

    return { created: true as const, website };
}

async function main() {
    const result = await ensureDevelopmentTestWebsite();
    console.log(result.created ? "OK  test website created" : "OK  test website reused");
    console.log(`ID ${result.website.id}`);
    console.log(`DOMAIN ${result.website.normalizedDomain}`);
    console.log(`URL ${result.website.originalUrl}`);
}

main().catch((error) => {
    console.error(
        "FAIL test website seed:",
        error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
});
