import type { Metadata } from "next";
import Link from "next/link";
import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import { websiteAuditMockRecord } from "@/lib/websiteAudit/mockData";

export const metadata: Metadata = {
    title: "Website Audit Demo",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function WebsiteAuditDemoPage({
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
                    <p className="text-sm text-base-content/60">Business name</p>
                    <h1 className="mt-2 text-3xl font-semibold text-base-content">
                        {record.businessName}
                    </h1>
                    <p className="mt-6 text-sm text-base-content/60">Demo title</p>
                    <p className="mt-2 text-lg font-semibold text-base-content">
                        {record.demo.title}
                    </p>
                    <p className="mt-6 text-sm text-base-content/60">Demo description</p>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-base-content/75">
                        {record.demo.description}
                    </p>
                </section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <AuditSectionCard title="Desktop preview placeholder">
                        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200 p-6 text-center text-sm text-base-content/65">
                            {record.demo.desktopPreviewLabel}
                        </div>
                    </AuditSectionCard>

                    <AuditSectionCard title="Mobile preview placeholder">
                        <div className="mx-auto flex min-h-80 max-w-56 items-center justify-center rounded-[2rem] border border-dashed border-base-300 bg-base-200 p-6 text-center text-sm text-base-content/65">
                            {record.demo.mobilePreviewLabel}
                        </div>
                    </AuditSectionCard>
                </div>

                <AuditSectionCard title="Next steps">
                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                        <Link
                            href={`/work/website-audit/report/${record.demo.reportToken}`}
                            className="btn btn-outline"
                        >
                            Back to report
                        </Link>
                        <Link href="/contact" className="btn btn-primary">
                            Contact Nice Guy Web Design
                        </Link>
                    </div>
                </AuditSectionCard>
            </div>
        </div>
    );
}
