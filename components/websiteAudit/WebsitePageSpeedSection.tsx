"use client";

import { useState } from "react";
import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import RunPageSpeedButton from "@/components/websiteAudit/RunPageSpeedButton";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import {
    formatBytes,
    formatFieldMetric,
    formatMetricDisplay,
    formatScoreWithLabel,
    formatStatusLabel,
    scoreDifference,
} from "@/lib/websiteAudit/pagespeed-format";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { PageSpeedStatus } from "@/src/types/website-audit";

type WebsitePageSpeedSectionProps = {
    websiteId: string;
    pageSpeedStatus: PageSpeedStatus;
    latestPageSpeedRunAt: string | null;
    latestCrawl: SerializableCrawl | null;
    mobile: SerializableGoogleMetric | null;
    desktop: SerializableGoogleMetric | null;
};

function StrategyPanel({
    label,
    metric,
}: {
    label: string;
    metric: SerializableGoogleMetric | null;
}) {
    const [showAllOpportunities, setShowAllOpportunities] = useState(false);
    const [showAllFailed, setShowAllFailed] = useState(false);

    if (!metric) {
        return (
            <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                <p className="text-sm font-medium text-base-content">{label}</p>
                <p className="mt-2 text-sm text-base-content/70">No results yet.</p>
            </div>
        );
    }

    if (metric.status === "queued" || metric.status === "processing") {
        return (
            <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                <p className="text-sm font-medium text-base-content">{label}</p>
                <p className="mt-2 text-sm text-base-content/70">
                    Status: {formatStatusLabel(metric.status)}
                </p>
                <p className="mt-2 text-sm text-base-content/70">
                    {metric.status === "queued"
                        ? "PageSpeed is queued."
                        : "PageSpeed analysis is in progress."}
                </p>
            </div>
        );
    }

    if (metric.status === "failed") {
        return (
            <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                <p className="text-sm font-medium text-base-content">{label}</p>
                <p className="mt-2 text-sm text-base-content/70">
                    Status: {formatStatusLabel(metric.status)}
                </p>
                {metric.errorCode ? (
                    <p className="mt-3 text-xs font-mono text-base-content/60">{metric.errorCode}</p>
                ) : null}
                {metric.errorMessage ? (
                    <p className="mt-2 text-sm text-error">{metric.errorMessage}</p>
                ) : (
                    <p className="mt-2 text-sm text-error">PageSpeed analysis failed.</p>
                )}
            </div>
        );
    }

    const opportunities = showAllOpportunities
        ? metric.opportunities
        : metric.opportunities.slice(0, 5);
    const failedAudits = showAllFailed
        ? metric.failedAudits
        : metric.failedAudits.slice(0, 8);

    const groupedFailed = failedAudits.reduce<
        Record<string, SerializableGoogleMetric["failedAudits"]>
    >((acc, audit) => {
        const key = audit.category;
        acc[key] = acc[key] ?? [];
        acc[key].push(audit);
        return acc;
    }, {});

    return (
        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-sm font-medium text-base-content">{label}</p>
                    <p className="mt-1 text-sm text-base-content/70">
                        Status: {formatStatusLabel(metric.status)}
                    </p>
                </div>
                <div className="text-sm text-base-content/70">
                    {metric.fetchTime ? formatWebsiteDate(metric.fetchTime) : "—"}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {(
                    [
                        ["Performance", metric.scores.performance],
                        ["Accessibility", metric.scores.accessibility],
                        ["Best Practices", metric.scores.bestPractices],
                        ["SEO", metric.scores.seo],
                    ] as const
                ).map(([title, score]) => (
                    <div key={title} className="rounded-xl bg-base-100 p-4 shadow-sm">
                        <p className="text-sm text-base-content/60">{title}</p>
                        <p className="mt-2 text-sm text-base-content">
                            {formatScoreWithLabel(score)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-4 rounded-xl bg-base-100 p-4 shadow-sm">
                <p className="text-sm font-medium text-base-content">Lighthouse lab data</p>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                    <div className="flex justify-between gap-3">
                        <dt className="text-base-content/60">First Contentful Paint</dt>
                        <dd>{formatMetricDisplay(metric.labMetrics.firstContentfulPaint)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-base-content/60">Largest Contentful Paint</dt>
                        <dd>{formatMetricDisplay(metric.labMetrics.largestContentfulPaint)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-base-content/60">Total Blocking Time</dt>
                        <dd>{formatMetricDisplay(metric.labMetrics.totalBlockingTime)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-base-content/60">Cumulative Layout Shift</dt>
                        <dd>{formatMetricDisplay(metric.labMetrics.cumulativeLayoutShift)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-base-content/60">Speed Index</dt>
                        <dd>{formatMetricDisplay(metric.labMetrics.speedIndex)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                        <dt className="text-base-content/60">Time to Interactive</dt>
                        <dd>{formatMetricDisplay(metric.labMetrics.interactive)}</dd>
                    </div>
                </dl>
            </div>

            <div className="mt-4 rounded-xl bg-base-100 p-4 shadow-sm">
                <p className="text-sm font-medium text-base-content">Real-user field data</p>
                {metric.fieldData.available ? (
                    <dl className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">Data source</dt>
                            <dd>
                                {metric.fieldData.originFallback ? "Origin fallback" : "Page URL"}
                            </dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">Overall category</dt>
                            <dd>{metric.fieldData.overallCategory ?? "Not available"}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">LCP</dt>
                            <dd>{formatFieldMetric(metric.fieldData.largestContentfulPaint)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">INP</dt>
                            <dd>{formatFieldMetric(metric.fieldData.interactionToNextPaint)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">CLS</dt>
                            <dd>{formatFieldMetric(metric.fieldData.cumulativeLayoutShift)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">Core Web Vitals</dt>
                            <dd>
                                {metric.coreWebVitals.assessment
                                    ? formatStatusLabel(metric.coreWebVitals.assessment)
                                    : "Not available"}
                            </dd>
                        </div>
                    </dl>
                ) : (
                    <p className="mt-3 text-sm text-base-content/70">
                        Not enough real-user Chrome data is available for this website.
                    </p>
                )}
            </div>

            {metric.opportunities.length > 0 ? (
                <div className="mt-4 rounded-xl bg-base-100 p-4 shadow-sm">
                    <p className="text-sm font-medium text-base-content">Opportunities</p>
                    <ul className="mt-3 grid grid-cols-1 gap-3">
                        {opportunities.map((item) => (
                            <li
                                key={item.auditId}
                                className="rounded-lg bg-base-200 p-3 text-sm"
                            >
                                <div className="flex flex-col gap-1 md:flex-row md:justify-between">
                                    <p className="font-medium text-base-content">{item.title}</p>
                                    <p className="text-base-content/60">
                                        {formatStatusLabel(item.priority)}
                                    </p>
                                </div>
                                {item.displayValue ? (
                                    <p className="mt-1 text-base-content/70">{item.displayValue}</p>
                                ) : null}
                                {item.estimatedSavingsMs ? (
                                    <p className="mt-1 text-base-content/70">
                                        Est. time savings: {item.estimatedSavingsMs} ms
                                    </p>
                                ) : null}
                                {item.estimatedSavingsBytes ? (
                                    <p className="mt-1 text-base-content/70">
                                        Est. byte savings: {formatBytes(item.estimatedSavingsBytes)}
                                    </p>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                    {metric.opportunities.length > 5 ? (
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs mt-3"
                            onClick={() => setShowAllOpportunities((value) => !value)}
                        >
                            {showAllOpportunities ? "Show fewer" : "Show more"}
                        </button>
                    ) : null}
                </div>
            ) : null}

            {metric.failedAudits.length > 0 ? (
                <div className="mt-4 rounded-xl bg-base-100 p-4 shadow-sm">
                    <p className="text-sm font-medium text-base-content">Failed audits</p>
                    <div className="mt-3 grid grid-cols-1 gap-4">
                        {Object.entries(groupedFailed).map(([category, audits]) => (
                            <div key={category}>
                                <p className="text-sm text-base-content/60">
                                    {formatStatusLabel(category)}
                                </p>
                                <ul className="mt-2 grid grid-cols-1 gap-2">
                                    {audits.map((audit) => (
                                        <li
                                            key={audit.auditId}
                                            className="rounded-lg bg-base-200 p-3 text-sm"
                                        >
                                            <div className="flex flex-col gap-1 md:flex-row md:justify-between">
                                                <p className="text-base-content">{audit.title}</p>
                                                <p className="text-base-content/60">
                                                    {formatStatusLabel(audit.severity)}
                                                </p>
                                            </div>
                                            {audit.displayValue ? (
                                                <p className="mt-1 text-base-content/70">
                                                    {audit.displayValue}
                                                </p>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {metric.failedAudits.length > 8 ? (
                        <button
                            type="button"
                            className="btn btn-ghost btn-xs mt-3"
                            onClick={() => setShowAllFailed((value) => !value)}
                        >
                            {showAllFailed ? "Show fewer" : "Show more"}
                        </button>
                    ) : null}
                </div>
            ) : null}

            <dl className="mt-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                <div>
                    <dt className="text-base-content/60">Lighthouse version</dt>
                    <dd>{metric.lighthouseVersion || "—"}</dd>
                </div>
                <div>
                    <dt className="text-base-content/60">Duration</dt>
                    <dd>
                        {metric.durationMs
                            ? `${(metric.durationMs / 1000).toFixed(1)} s`
                            : "—"}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

export default function WebsitePageSpeedSection({
    websiteId,
    pageSpeedStatus,
    latestPageSpeedRunAt,
    latestCrawl,
    mobile,
    desktop,
}: WebsitePageSpeedSectionProps) {
    const testedUrl = latestCrawl?.finalUrl || latestCrawl?.requestedUrl || "—";
    const crawlComplete = latestCrawl?.status === "complete";

    return (
        <AuditSectionCard
            title="PageSpeed"
            actions={
                <RunPageSpeedButton
                    websiteId={websiteId}
                    pageSpeedStatus={pageSpeedStatus}
                    crawlComplete={crawlComplete}
                />
            }
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">PageSpeed status</p>
                    <p className="mt-2 text-sm text-base-content">
                        {formatStatusLabel(pageSpeedStatus)}
                    </p>
                </div>
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm text-base-content/60">Latest run</p>
                    <p className="mt-2 text-sm text-base-content">
                        {latestPageSpeedRunAt
                            ? formatWebsiteDate(latestPageSpeedRunAt)
                            : "No PageSpeed run yet"}
                    </p>
                </div>
                <div className="rounded-2xl bg-base-200 p-5 shadow-sm md:col-span-2">
                    <p className="text-sm text-base-content/60">Tested homepage URL</p>
                    <p className="mt-2 break-all text-sm text-base-content">{testedUrl}</p>
                </div>
            </div>

            {pageSpeedStatus === "partial" ? (
                <p className="mt-4 rounded-2xl bg-warning/10 p-4 text-sm text-warning">
                    PageSpeed completed with partial results. Review mobile and desktop panels
                    below.
                </p>
            ) : null}

            {(mobile || desktop) && (
                <div className="mt-6 rounded-2xl bg-base-200 p-5 shadow-sm">
                    <p className="text-sm font-medium text-base-content">
                        Mobile vs desktop comparison
                    </p>
                    <dl className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">Performance</dt>
                            <dd>{scoreDifference(mobile, desktop, "performance")}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">Accessibility</dt>
                            <dd>{scoreDifference(mobile, desktop, "accessibility")}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">Best Practices</dt>
                            <dd>{scoreDifference(mobile, desktop, "bestPractices")}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt className="text-base-content/60">SEO</dt>
                            <dd>{scoreDifference(mobile, desktop, "seo")}</dd>
                        </div>
                    </dl>
                </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
                <StrategyPanel label="Mobile" metric={mobile} />
                <StrategyPanel label="Desktop" metric={desktop} />
            </div>
        </AuditSectionCard>
    );
}
