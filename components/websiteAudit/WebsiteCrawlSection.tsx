import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import RunCrawlButton from "@/components/websiteAudit/RunCrawlButton";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { CrawlStatus } from "@/src/types/website-audit";

function formatDuration(ms: number): string {
    if (!ms) return "—";
    if (ms < 1000) return `${ms} ms`;
    return `${(ms / 1000).toFixed(1)} s`;
}

function formatStatusLabel(value: string): string {
    return value.replace(/-/g, " ");
}

type WebsiteCrawlSectionProps = {
    websiteId: string;
    crawlStatus: CrawlStatus;
    latestCrawl: SerializableCrawl | null;
};

export default function WebsiteCrawlSection({
    websiteId,
    crawlStatus,
    latestCrawl,
}: WebsiteCrawlSectionProps) {
    const pageTypeSummary = latestCrawl
        ? latestCrawl.pageResults.reduce<Record<string, number>>((acc, page) => {
              acc[page.pageType] = (acc[page.pageType] ?? 0) + 1;
              return acc;
          }, {})
        : {};

    return (
        <AuditSectionCard
            title="Crawl"
            actions={
                <RunCrawlButton websiteId={websiteId} crawlStatus={crawlStatus} />
            }
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">Crawl status</p>
                    <p className="mt-2 text-sm text-base-content">
                        {formatStatusLabel(crawlStatus)}
                    </p>
                </div>
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">Latest crawl</p>
                    <p className="mt-2 text-sm text-base-content">
                        {latestCrawl?.completedAt
                            ? formatWebsiteDate(latestCrawl.completedAt)
                            : latestCrawl?.startedAt
                              ? formatWebsiteDate(latestCrawl.startedAt)
                              : "No crawl yet"}
                    </p>
                </div>
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">Pages crawled</p>
                    <p className="mt-2 text-sm text-base-content">
                        {latestCrawl?.pagesCrawled ?? 0}
                    </p>
                </div>
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">Crawl duration</p>
                    <p className="mt-2 text-sm text-base-content">
                        {formatDuration(latestCrawl?.crawlDurationMs ?? 0)}
                    </p>
                </div>
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">Pages discovered</p>
                    <p className="mt-2 text-sm text-base-content">
                        {latestCrawl?.pagesDiscovered ?? 0}
                    </p>
                </div>
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">Record status</p>
                    <p className="mt-2 text-sm text-base-content">
                        {latestCrawl ? formatStatusLabel(latestCrawl.status) : "—"}
                    </p>
                </div>
            </div>

            {latestCrawl ? (
                <div className="mt-6 grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <p className="text-sm text-base-content/60">Requested URL</p>
                            <p className="mt-2 break-all text-sm text-base-content">
                                {latestCrawl.requestedUrl}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <p className="text-sm text-base-content/60">Final homepage URL</p>
                            <p className="mt-2 break-all text-sm text-base-content">
                                {latestCrawl.finalUrl || "—"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <p className="text-sm text-base-content/60">Emails found</p>
                            <p className="mt-2 text-sm text-base-content">
                                {latestCrawl.emailsFound.length}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <p className="text-sm text-base-content/60">Phone numbers found</p>
                            <p className="mt-2 text-sm text-base-content">
                                {latestCrawl.phoneNumbersFound.length}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <p className="text-sm text-base-content/60">Social links found</p>
                            <p className="mt-2 text-sm text-base-content">
                                {latestCrawl.socialLinks.length}
                            </p>
                        </div>
                    </div>

                    {Object.keys(pageTypeSummary).length > 0 ? (
                        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                            <p className="text-sm text-base-content/60">Page-type summary</p>
                            <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                                {Object.entries(pageTypeSummary).map(([type, count]) => (
                                    <li key={type} className="text-sm text-base-content">
                                        {formatStatusLabel(type)}: {count}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {latestCrawl.errorMessage ? (
                        <div className="rounded-2xl bg-error/10 p-5 shadow-sm">
                            <p className="text-sm text-error">{latestCrawl.errorMessage}</p>
                        </div>
                    ) : null}

                    {latestCrawl.pageResults.length > 0 ? (
                        <div className="overflow-x-auto rounded-2xl bg-base-200 p-4 shadow-sm">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Page type</th>
                                        <th>Title</th>
                                        <th>URL</th>
                                        <th>Status</th>
                                        <th>Load time</th>
                                        <th>Extraction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {latestCrawl.pageResults.map((page) => (
                                        <tr key={`${page.url}-${page.path}`}>
                                            <td>{formatStatusLabel(page.pageType)}</td>
                                            <td>{page.title || "—"}</td>
                                            <td className="max-w-xs break-all">{page.url}</td>
                                            <td>{page.statusCode ?? "—"}</td>
                                            <td>{formatDuration(page.loadDurationMs ?? 0)}</td>
                                            <td>
                                                {page.errorMessage ? (
                                                    <span className="text-error">Failed</span>
                                                ) : (
                                                    <span className="text-success">OK</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            ) : (
                <p className="mt-6 text-sm text-base-content/75">
                    No crawl has been run for this website yet.
                </p>
            )}
        </AuditSectionCard>
    );
}
