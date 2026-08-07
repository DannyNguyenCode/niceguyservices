import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page } from "playwright-core";

function loadCrawlBrowserScript(): string {
    const candidates = [
        join(process.cwd(), "src/services/crawl-browser-extract.js"),
        join(dirname(fileURLToPath(import.meta.url)), "crawl-browser-extract.js"),
    ];

    for (const candidate of candidates) {
        try {
            return readFileSync(candidate, "utf8");
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
                throw error;
            }
        }
    }

    throw new Error(
        "Unable to locate crawl-browser-extract.js. Expected src/services/crawl-browser-extract.js in the project root.",
    );
}

const CRAWL_BROWSER_SCRIPT = loadCrawlBrowserScript();

type ExtractedPagePayload = {
    title: string;
    metaDescription: string;
    language: string;
    headings: Array<{ level: number; text: string }>;
    buttons: Array<{ text: string; href?: string }>;
    forms: Array<{
        action?: string;
        method?: string;
        fields: Array<{
            type?: string;
            name?: string;
            label?: string;
            required: boolean;
        }>;
    }>;
    images: Array<{ src?: string; alt?: string }>;
    linkUrls: string[];
    mailtoLinks: string[];
    telLinks: string[];
    visibleText: string;
};

type DiscoveredLinkPayload = Array<{ href: string; text: string }>;

export async function evaluateExtractPageData(page: Page): Promise<ExtractedPagePayload> {
    return page.evaluate(`${CRAWL_BROWSER_SCRIPT}\nextractPageDataInBrowser();`);
}

export async function evaluateDiscoverLinks(page: Page): Promise<DiscoveredLinkPayload> {
    return page.evaluate(`${CRAWL_BROWSER_SCRIPT}\ndiscoverLinksInBrowser();`);
}
