import ActivityTimeline from "@/components/audit-dashboard/activity-timeline";
import AuditSection from "@/components/audit/shared/audit-section";
import { AUDIT_SECTIONS } from "@/src/lib/audit-sections";
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
        <AuditSection
            id={AUDIT_SECTIONS.activity.id}
            headingId={AUDIT_SECTIONS.activity.headingId}
            title={title}
            description="Operational history of audit, report, outreach, and demo events for this website."
        >
            <ActivityTimeline
                websiteId={websiteId}
                initialItems={initial.items}
                initialHasMore={initial.hasMore}
                initialNextCursor={initial.nextCursor}
                pollWhileActive={pollWhileActive}
            />
        </AuditSection>
    );
}
