"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type AuditJobStatusPollerProps = {
    jobId: string;
    initialStatus: string;
};

const POLL_INTERVAL_MS = 4000;
const ACTIVE_STATUSES = new Set(["queued", "processing"]);

export default function AuditJobStatusPoller({
    jobId,
    initialStatus,
}: AuditJobStatusPollerProps) {
    const router = useRouter();
    const lastUpdatedAt = useRef<string | null>(null);

    useEffect(() => {
        if (!ACTIVE_STATUSES.has(initialStatus)) {
            return;
        }

        let cancelled = false;

        async function poll(): Promise<void> {
            if (cancelled) {
                return;
            }

            try {
                const response = await fetch(`/api/admin/audit-jobs/${jobId}`, {
                    cache: "no-store",
                });
                if (!response.ok) {
                    return;
                }
                const payload = (await response.json()) as {
                    status: string;
                    updatedAt?: string;
                };
                if (
                    payload.updatedAt &&
                    payload.updatedAt !== lastUpdatedAt.current
                ) {
                    lastUpdatedAt.current = payload.updatedAt;
                    router.refresh();
                }
                if (!ACTIVE_STATUSES.has(payload.status)) {
                    router.refresh();
                    return;
                }
            } catch {
                // Ignore transient polling errors.
            }

            if (!cancelled) {
                window.setTimeout(() => {
                    void poll();
                }, POLL_INTERVAL_MS);
            }
        }

        void poll();

        return () => {
            cancelled = true;
        };
    }, [initialStatus, jobId, router]);

    return null;
}
