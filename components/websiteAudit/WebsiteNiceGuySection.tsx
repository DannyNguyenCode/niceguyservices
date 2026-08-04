"use client";

import { useState } from "react";
import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import RunNiceGuyAnalysisButton from "@/components/websiteAudit/RunNiceGuyAnalysisButton";
import { NiceGuyStatusBadge } from "@/components/websiteAudit/StatusBadges";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import {
    countChecksByStatus,
    formatCategoryLabel,
    formatCheckPoints,
    formatCheckStatusLabel,
    formatEvidenceValue,
    formatPriorityLabel,
    formatScoreWithPresentation,
    groupRecommendations,
} from "@/lib/websiteAudit/niceguy-format";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { NiceGuyCategoryKey } from "@/src/schemas/niceguy-metrics";
import type { NiceGuyStatus } from "@/src/schemas/enums";
import type { CategoryScore, MetricCheck } from "@/src/services/niceguy-scoring/types";

const CATEGORY_KEYS: NiceGuyCategoryKey[] = [
    "businessClarity",
    "trustCredibility",
    "conversionReadiness",
    "userExperience",
    "brandingConsistency",
    "contentQuality",
    "technicalFoundation",
];

type WebsiteNiceGuySectionProps = {
    websiteId: string;
    niceGuyStatus: NiceGuyStatus;
    latestNiceGuyRunAt: string | null;
    latestMetric: SerializableNiceGuyMetric | null;
    prerequisitesMet: boolean;
};

function CheckRow({ check }: { check: MetricCheck }) {
  return (
    <div className="rounded-xl bg-base-100 p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-base-content">{check.label}</p>
          <p className="mt-1 text-sm text-base-content/70">{check.description}</p>
        </div>
        <div className="text-sm text-base-content/70">
          {formatCheckStatusLabel(check.status)} · {formatCheckPoints(check)}
        </div>
      </div>
      {check.evidence.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1">
          {check.evidence.map((item, index) => (
            <li key={`${check.id}-evidence-${index}`} className="text-sm text-base-content/75">
              {item.label}: {formatEvidenceValue(item.value)}
            </li>
          ))}
        </ul>
      ) : null}
      {check.missing.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1">
          {check.missing.map((item) => (
            <li key={`${check.id}-missing-${item}`} className="text-sm text-base-content/70">
              Missing: {item}
            </li>
          ))}
        </ul>
      ) : null}
      {check.recommendation ? (
        <p className="mt-3 text-sm text-base-content/80">{check.recommendation}</p>
      ) : null}
      {check.priority ? (
        <p className="mt-2 text-sm text-base-content/60">
          Priority: {formatPriorityLabel(check.priority)}
        </p>
      ) : null}
    </div>
  );
}

function CategoryCard({
  categoryKey,
  category,
}: {
  categoryKey: NiceGuyCategoryKey;
  category: CategoryScore;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-base-content">
            {formatCategoryLabel(categoryKey)}
          </p>
        <p className="mt-1 text-sm text-base-content/70">
          {formatScoreWithPresentation(category.qualityScore ?? category.score)}
        </p>
      </div>
      <p className="text-sm text-base-content/70">
        Evidence coverage: {category.evidenceCoverage ?? category.confidence}%
      </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl bg-base-100 p-3 shadow-sm">
          <p className="text-sm text-base-content/60">Passed</p>
          <p className="mt-1 text-sm text-base-content">
            {countChecksByStatus(category, "passed")}
          </p>
        </div>
        <div className="rounded-xl bg-base-100 p-3 shadow-sm">
          <p className="text-sm text-base-content/60">Failed</p>
          <p className="mt-1 text-sm text-base-content">
            {countChecksByStatus(category, "failed")}
          </p>
        </div>
        <div className="rounded-xl bg-base-100 p-3 shadow-sm">
          <p className="text-sm text-base-content/60">Partial</p>
          <p className="mt-1 text-sm text-base-content">
            {countChecksByStatus(category, "partial")}
          </p>
        </div>
        <div className="rounded-xl bg-base-100 p-3 shadow-sm">
          <p className="text-sm text-base-content/60">Unavailable</p>
          <p className="mt-1 text-sm text-base-content">
            {countChecksByStatus(category, "unavailable")}
          </p>
        </div>
      </div>

      {category.strengths.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-base-content">Top strengths</p>
          <ul className="mt-2 flex flex-col gap-1">
            {category.strengths.slice(0, 3).map((item) => (
              <li key={item} className="text-sm text-base-content/75">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {category.issues.length > 0 ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-base-content">Top issues</p>
          <ul className="mt-2 flex flex-col gap-1">
            {category.issues.slice(0, 3).map((item) => (
              <li key={item} className="text-sm text-base-content/75">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        className="btn btn-ghost btn-sm mt-4"
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? "Hide checks" : "Show checks"}
      </button>

      {expanded ? (
        <div className="mt-4 flex flex-col gap-3">
          {category.checks.map((check) => (
            <CheckRow key={check.id} check={check} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function WebsiteNiceGuySection({
  websiteId,
  niceGuyStatus,
  latestNiceGuyRunAt,
  latestMetric,
  prerequisitesMet,
}: WebsiteNiceGuySectionProps) {
  const recommendations = latestMetric
    ? groupRecommendations(latestMetric.categories)
    : [];

  return (
    <AuditSectionCard title="Nice Guy metrics">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <NiceGuyStatusBadge status={niceGuyStatus} />
              <span className="text-sm text-base-content/70">
                Nice Guy Web Design evaluation
              </span>
            </div>
            <p className="text-sm text-base-content/70">
              Generated:{" "}
              {latestMetric?.generatedAt
                ? formatWebsiteDate(latestMetric.generatedAt)
                : latestNiceGuyRunAt
                  ? formatWebsiteDate(latestNiceGuyRunAt)
                  : "Not yet generated"}
            </p>
            {latestMetric ? (
              <p className="text-sm text-base-content/70">
                Scoring version: {latestMetric.scoringVersion}
              </p>
            ) : null}
            {latestMetric?.completeness ? (
              <p className="text-sm text-base-content/70">{latestMetric.completeness.label}</p>
            ) : null}
            {niceGuyStatus === "failed" ? (
              <p className="text-sm text-error">
                Nice Guy scoring failed. You can rerun the analysis after resolving prerequisites.
              </p>
            ) : null}
          </div>
          <RunNiceGuyAnalysisButton
            websiteId={websiteId}
            niceGuyStatus={niceGuyStatus}
            prerequisitesMet={prerequisitesMet}
          />
        </div>

        {latestMetric ? (
          <>
            <div className="rounded-2xl bg-base-200 p-6 shadow-sm">
              <p className="text-sm text-base-content/60">Overall Nice Guy Score</p>
              <p className="mt-2 text-3xl font-semibold text-base-content">
                {latestMetric.overallScore}
              </p>
              <p className="mt-2 text-sm text-base-content/70">
                {formatScoreWithPresentation(latestMetric.overallScore)}
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-base-100 p-4 shadow-sm">
                  <p className="text-sm text-base-content/60">Strongest category</p>
                  <p className="mt-2 text-sm text-base-content">
                    {latestMetric.summary.strongestCategory ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-base-100 p-4 shadow-sm">
                  <p className="text-sm text-base-content/60">Weakest category</p>
                  <p className="mt-2 text-sm text-base-content">
                    {latestMetric.summary.weakestCategory ?? "—"}
                  </p>
                </div>
                <div className="rounded-xl bg-base-100 p-4 shadow-sm">
                  <p className="text-sm text-base-content/60">Checks passed</p>
                  <p className="mt-2 text-sm text-base-content">
                    {latestMetric.summary.checksPassed}
                  </p>
                </div>
                <div className="rounded-xl bg-base-100 p-4 shadow-sm">
                  <p className="text-sm text-base-content/60">Checks unavailable</p>
                  <p className="mt-2 text-sm text-base-content">
                    {latestMetric.summary.checksUnavailable}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-base-content/70">
                Evidence coverage varies by category when crawl, PageSpeed, or screenshot evidence is
                missing. Unavailable checks reduce coverage without automatically failing the site.
              </p>
              {latestMetric.methodology?.disclaimer ? (
                <p className="mt-4 text-sm text-base-content/70">{latestMetric.methodology.disclaimer}</p>
              ) : null}
              {latestMetric.completeness?.blockers?.length ? (
                <ul className="mt-3 flex flex-col gap-1">
                  {latestMetric.completeness.blockers.map((blocker) => (
                    <li key={blocker} className="text-sm text-base-content/70">
                      {blocker}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {CATEGORY_KEYS.map((key) => (
                <CategoryCard
                  key={key}
                  categoryKey={key}
                  category={latestMetric.categories[key]}
                />
              ))}
            </div>

            {recommendations.length > 0 ? (
              <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
                <p className="text-sm font-medium text-base-content">Recommendations</p>
                <div className="mt-4 flex flex-col gap-4">
                  {(["high", "medium", "low"] as const).map((priority) => {
                    const items = recommendations.filter((item) => item.priority === priority);
                    if (items.length === 0) return null;
                    return (
                      <div key={priority}>
                        <p className="text-sm font-medium text-base-content">
                          {formatPriorityLabel(priority)} priority
                        </p>
                        <div className="mt-3 flex flex-col gap-3">
                          {items.map((item) => (
                            <div
                              key={`${item.category}-${item.title}`}
                              className="rounded-xl bg-base-100 p-4 shadow-sm"
                            >
                              <p className="text-sm font-medium text-base-content">
                                {item.category}: {item.title}
                              </p>
                              <p className="mt-2 text-sm text-base-content/75">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm leading-relaxed text-base-content/75">
            Run Nice Guy analysis to generate deterministic scores across business clarity, trust,
            conversion readiness, user experience, branding, content quality, and technical
            foundation.
          </p>
        )}
      </div>
    </AuditSectionCard>
  );
}
