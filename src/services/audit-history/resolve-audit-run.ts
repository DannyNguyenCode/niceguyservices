import "server-only";

import { getOpenAuditRunForWebsite } from "@/src/data/audit-runs";
import { getCrawlById } from "@/src/data/crawls";

export async function resolveAuditRunIdForCrawl(input: {
    websiteId: string;
    crawlId: string;
    crawlAuditRunId?: string | null;
}): Promise<string | null> {
    if (input.crawlAuditRunId) {
        return input.crawlAuditRunId;
    }

    const crawl = await getCrawlById(input.crawlId);
    if (crawl?.auditRunId) {
        return crawl.auditRunId;
    }

    const open = await getOpenAuditRunForWebsite(input.websiteId);
    return open?.id ?? null;
}
