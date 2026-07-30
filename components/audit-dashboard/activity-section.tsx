import ActivityTimeline from "@/components/audit-dashboard/activity-timeline";
import { getActivityLogForWebsite } from "@/src/data/activity-logs";
import type { SerializableActivityItem } from "@/src/services/activity/types";

type ActivitySectionProps = {
    websiteId: string;
    auditRunId?: string;
    activity?: SerializableActivityItem[];
    pollWhileActive?: boolean;
    title?: string;
};

export default async function ActivitySection({
    websiteId,
    auditRunId,
    activity,
    pollWhileActive = false,
    title = "Activity timeline",
}: ActivitySectionProps) {
    const initial = activity
        ? { items: activity, hasMore: false, nextCursor: null }
        : await getActivityLogForWebsite({ websiteId, auditRunId, limit: 25 });

    return (
        <section id="activity" className="rounded-2xl bg-base-100 p-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-base-content">{title}</h2>
                <p className="mt-2 text-sm text-base-content/75">
                    Operational history of audit, report, outreach, and demo events for this
                    website.
                </p>
            </div>
            <div className="mt-6">
                <ActivityTimeline
                    websiteId={websiteId}
                    initialItems={initial.items}
                    initialHasMore={initial.hasMore}
                    initialNextCursor={initial.nextCursor}
                    pollWhileActive={pollWhileActive}
                />
            </div>
        </section>
    );
}
