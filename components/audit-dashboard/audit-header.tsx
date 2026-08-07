import Link from "next/link";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { SerializableWebsite } from "@/src/data/websites";
import StatusBadge from "@/components/audit-dashboard/status-badge";

type AuditHeaderProps = {
    website: SerializableWebsite;
};

export default function AuditHeader({ website }: AuditHeaderProps) {
    const businessLabel = website.businessName?.trim() || website.normalizedDomain;

    return (
        <section className="rounded-2xl bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="grid grid-cols-1 gap-3">
                    <Link
                        href="/dashboard/websites"
                        className="text-sm text-base-content/60 underline-offset-2 hover:underline"
                    >
                        Back to websites
                    </Link>
                    <div>
                        <p className="text-sm text-base-content/60">Administrator audit dashboard</p>
                        <h1 className="mt-2 text-2xl font-semibold text-base-content">
                            {businessLabel}
                        </h1>
                        <p className="mt-1 text-sm text-base-content/70">
                            {website.normalizedDomain}
                        </p>
                        {website.industry ? (
                            <p className="mt-2 text-sm text-base-content/75">{website.industry}</p>
                        ) : null}
                        {website.location ? (
                            <p className="text-sm text-base-content/75">{website.location}</p>
                        ) : null}
                    </div>
                    <a
                        href={website.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm text-base-content underline-offset-2 hover:underline"
                    >
                        Open website (external)
                    </a>
                    <div className="flex flex-wrap gap-2 text-sm text-base-content/65">
                        <span>Added {formatWebsiteDate(website.createdAt)}</span>
                        <span aria-hidden="true">·</span>
                        <span>Updated {formatWebsiteDate(website.updatedAt)}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        <StatusBadge status={website.status} label={website.status} />
                        <StatusBadge status={website.auditStatus} label={website.auditStatus} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/dashboard/websites/${website.id}/edit`}
                            className="btn btn-primary btn-sm"
                        >
                            Edit website
                        </Link>
                        <a
                            href={website.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                        >
                            Open website
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
