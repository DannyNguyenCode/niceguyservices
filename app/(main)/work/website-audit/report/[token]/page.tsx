import type { Metadata } from "next";
import Link from "next/link";
import AuditFindingCard from "@/components/websiteAudit/AuditFindingCard";
import AuditScoreCard from "@/components/websiteAudit/AuditScoreCard";
import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import MethodologySection from "@/components/websiteAudit/MethodologySection";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import { websiteAuditMockRecord } from "@/lib/websiteAudit/mockData";

export const metadata: Metadata = {
    title: "Website Audit Report",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function WebsiteAuditReportPage({
    params: _params,
}: {
    params: Promise<{ token: string }>;
}) {
    await _params;
    const record = websiteAuditMockRecord;

    return (
        <div className="bg-(--pm-surface) py-16 text-(--pm-on-surface)">
            <div className={`${sitePageContentClass} grid grid-cols-1 gap-8`}>
                <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <p className="text-sm text-base-content/60">Business name</p>
                            <p className="mt-2 text-lg font-semibold text-base-content">
                                {record.businessName}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-base-content/60">Website URL</p>
                            <a
                                href={record.websiteUrl}
                                className="mt-2 block break-all text-lg font-semibold text-base-content underline-offset-2 hover:underline"
                            >
                                {record.websiteUrl}
                            </a>
                        </div>
                        <div>
                            <p className="text-sm text-base-content/60">Generated date</p>
                            <p className="mt-2 text-lg font-semibold text-base-content">
                                {record.generatedAt}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-base-content/60">Overall score</p>
                            <p className="mt-2 text-lg font-semibold text-base-content">
                                {record.overallScore} / 100
                            </p>
                        </div>
                    </div>
                </section>

                <AuditSectionCard title="Google metrics">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {record.googleMetrics.map((score) => (
                            <AuditScoreCard key={score.id} score={score} />
                        ))}
                    </div>
                </AuditSectionCard>

                <AuditSectionCard title="Nice Guy Web Design metrics">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {record.niceGuyMetrics.map((score) => (
                            <AuditScoreCard key={score.id} score={score} />
                        ))}
                    </div>
                </AuditSectionCard>

                <AuditSectionCard title="Strengths">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {record.strengths.map((finding) => (
                            <AuditFindingCard key={finding.id} finding={finding} />
                        ))}
                    </div>
                </AuditSectionCard>

                <AuditSectionCard title="Improvement opportunities">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {record.opportunities.map((finding) => (
                            <AuditFindingCard key={finding.id} finding={finding} />
                        ))}
                    </div>
                </AuditSectionCard>

                <AuditSectionCard title="Screenshots">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {record.screenshots.map((label) => (
                            <div
                                key={label}
                                className="rounded-2xl bg-base-200 p-5 shadow-sm"
                                tabIndex={0}
                            >
                                <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-100 p-4 text-center text-sm text-base-content/65">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </AuditSectionCard>

                <AuditSectionCard
                    title="Downloads and next steps"
                    actions={
                        <div className="flex flex-wrap gap-3">
                            <button type="button" className="btn btn-outline">
                                PDF download placeholder
                            </button>
                            <Link
                                href={`/work/website-audit/demo/${record.demo.demoToken}`}
                                className="btn btn-primary"
                            >
                                View demo
                            </Link>
                        </div>
                    }
                >
                    <p className="text-sm leading-relaxed text-base-content/75">
                        The report UI is in place with mock data. PDF export and generated
                        assets will be connected in a later implementation step.
                    </p>
                </AuditSectionCard>

                <MethodologySection items={record.methodology} />
            </div>
        </div>
    );
}
