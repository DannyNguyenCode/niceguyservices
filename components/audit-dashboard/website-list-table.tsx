import Link from "next/link";
import {
    AuditStatusBadge,
    DemoStatusBadge,
    OutreachStatusBadge,
} from "@/components/websiteAudit/StatusBadges";
import SoftDeleteWebsiteButton from "@/components/websiteAudit/SoftDeleteWebsiteButton";
import type { WebsiteListItemViewModel } from "@/src/lib/website-list-view-model";

type WebsiteListTableProps = {
    items: WebsiteListItemViewModel[];
};

export default function WebsiteListTable({ items }: WebsiteListTableProps) {
    return (
        <div className="hidden lg:block">
            <div className="overflow-x-auto rounded-xl border border-base-200">
                <table className="table">
                    <caption className="sr-only">Website audit records</caption>
                    <thead>
                        <tr>
                            <th scope="col">Business</th>
                            <th scope="col">Website</th>
                            <th scope="col">Email</th>
                            <th scope="col">Audit</th>
                            <th scope="col">Demo</th>
                            <th scope="col">Outreach</th>
                            <th scope="col">Updated</th>
                            <th scope="col">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td className="max-w-[14rem] font-medium break-words">
                                    {item.businessLabel}
                                </td>
                                <td className="max-w-[16rem]">
                                    <a
                                        href={item.originalUrl}
                                        className="link link-hover break-all"
                                    >
                                        {item.normalizedDomain}
                                    </a>
                                </td>
                                <td className="max-w-[14rem] break-all">
                                    {item.businessEmail || "Not provided"}
                                </td>
                                <td>
                                    <AuditStatusBadge status={item.auditStatus} />
                                </td>
                                <td>
                                    <DemoStatusBadge status={item.demoStatus} />
                                </td>
                                <td>
                                    <OutreachStatusBadge status={item.outreachStatus} />
                                </td>
                                <td className="whitespace-nowrap">{item.updatedAtLabel}</td>
                                <td>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={`/dashboard/websites/${item.id}`}
                                            className="btn btn-xs btn-outline"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/dashboard/websites/${item.id}/edit`}
                                            className="btn btn-xs btn-ghost"
                                        >
                                            Edit
                                        </Link>
                                        <SoftDeleteWebsiteButton
                                            websiteId={item.id}
                                            businessLabel={item.businessLabel}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-2 text-xs text-base-content/60 lg:hidden">
                Swipe horizontally to view all columns.
            </p>
        </div>
    );
}
