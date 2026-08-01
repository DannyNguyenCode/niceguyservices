import type { BrowserContext, Route } from "playwright";
import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import {
    OutboundRequestSecurityError,
    validateOutboundHttpUrl,
} from "@/src/services/outbound-request-security";

const BLOCKED_RESOURCE_TYPES = new Set([
    "websocket",
    "eventsource",
    "media",
    "font",
    "manifest",
    "other",
]);

export async function installPlaywrightNetworkGuard(context: BrowserContext): Promise<void> {
    await context.route("**/*", async (route: Route) => {
        const request = route.request();
        const resourceType = request.resourceType();

        if (BLOCKED_RESOURCE_TYPES.has(resourceType)) {
            await route.abort("blockedbyclient");
            return;
        }

        const url = request.url();
        if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("about:")) {
            await route.abort("blockedbyclient");
            return;
        }

        try {
            await validateOutboundHttpUrl(url);
            await route.continue();
        } catch (error) {
            if (!(error instanceof OutboundRequestSecurityError)) {
                console.warn("Blocked Playwright request due to outbound security validation failure.");
            }
            await route.abort("blockedbyclient");
        }
    });

    context.setDefaultTimeout(CRAWL_CONFIG.timeoutMs);
    context.setDefaultNavigationTimeout(CRAWL_CONFIG.timeoutMs);
}
