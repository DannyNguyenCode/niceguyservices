import Link from "next/link";
import {
    AuditStatusBadge,
    DemoStatusBadge,
    OutreachStatusBadge,
} from "@/components/websiteAudit/StatusBadges";
import SoftDeleteWebsiteButton from "@/components/websiteAudit/SoftDeleteWebsiteButton";
import type { WebsiteListItemViewModel } from "@/src/lib/website-list-view-model";

type WebsiteListCardsProps = {
    items: WebsiteListItemViewModel[];
};

function WebsiteCard({ item }: { item: WebsiteListItemViewModel }) {
    return (
        <article className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm">
            <div className="flex flex-col gap-3">
                <div>
                    <h3 className="text-base font-semibold text-base-content break-words">
                        {item.businessLabel}
                    </h3>
                    <a
                        href={item.originalUrl}
                        className="link link-hover mt-1 block text-sm break-all text-base-content/80"
                    >
                        {item.normalizedDomain}
                    </a>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-base-content/60">Audit</p>
                        <div className="mt-1">
                            <AuditStatusBadge status={item.auditStatus} />
                        </div>
                    </div>
                    <div>
                        <p className="text-base-content/60">Updated</p>
                        <p className="mt-1 break-words">{item.updatedAtLabel}</p>
                    </div>
                    <div>
                        <p className="text-base-content/60">Demo</p>
                        <div className="mt-1">
                            <DemoStatusBadge status={item.demoStatus} />
                        </div>
                    </div>
                    <div>
                        <p className="text-base-content/60">Outreach</p>
                        <div className="mt-1">
                            <OutreachStatusBadge status={item.outreachStatus} />
                        </div>
                    </div>
                </div>

                {item.businessEmail ? (
                    <p className="text-sm break-all text-base-content/70">{item.businessEmail}</p>
                ) : null}

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Link
                        href={`/dashboard/websites/${item.id}`}
                        className="btn btn-primary btn-sm w-full sm:w-auto"
                    >
                        View audit
                    </Link>
                    <Link
                        href={`/dashboard/websites/${item.id}/edit`}
                        className="btn btn-outline btn-sm w-full sm:w-auto"
                    >
                        Edit
                    </Link>
                    <SoftDeleteWebsiteButton
                        websiteId={item.id}
                        businessLabel={item.businessLabel}
                        className="btn btn-ghost btn-sm w-full sm:w-auto"
                    />
                </div>
            </div>
        </article>
    );
}

export default function WebsiteListCards({ items }: WebsiteListCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:hidden">
            {items.map((item) => (
                <WebsiteCard key={item.id} item={item} />
            ))}
        </div>
    );
}
