import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import { ACTIVITY_LOG_TYPE_LABELS } from "@/src/lib/activity-log";
import type { SerializableActivityLog } from "@/src/data/activity-logs";

type WebsiteActivitySectionProps = {
    activityLogs: SerializableActivityLog[];
};

export default function WebsiteActivitySection({
    activityLogs,
}: WebsiteActivitySectionProps) {
    return (
        <AuditSectionCard title="Activity">
            {activityLogs.length === 0 ? (
                <p className="text-sm text-base-content/75">No activity recorded yet.</p>
            ) : (
                <ul className="grid grid-cols-1 gap-3">
                    {activityLogs.map((entry) => (
                        <li
                            key={entry.id}
                            className="rounded-2xl bg-base-200 p-4 shadow-sm"
                        >
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-base-content">
                                        {ACTIVITY_LOG_TYPE_LABELS[entry.type] ?? entry.type}
                                    </p>
                                    <p className="mt-1 text-sm text-base-content/75">
                                        {entry.description || "—"}
                                    </p>
                                </div>
                                <div className="text-sm text-base-content/60">
                                    <p>{entry.actor.name ?? entry.actor.type}</p>
                                    <p>{formatWebsiteDate(entry.createdAt)}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </AuditSectionCard>
    );
}
