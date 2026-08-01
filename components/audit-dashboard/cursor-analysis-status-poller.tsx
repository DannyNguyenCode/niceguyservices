"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ACTIVE_CURSOR_ANALYSIS_STATUSES } from "@/src/services/cursor-analysis/constants";
import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";

type CursorAnalysisStatusPollerProps = {
    auditRunId: string;
    status: CursorAnalysisStatus;
    pollIntervalMs?: number;
};

export default function CursorAnalysisStatusPoller({
    auditRunId,
    status,
    pollIntervalMs = 5000,
}: CursorAnalysisStatusPollerProps) {
    const router = useRouter();
    const shouldPoll = ACTIVE_CURSOR_ANALYSIS_STATUSES.includes(status);

    useEffect(() => {
        if (!shouldPoll) return undefined;

        const intervalId = window.setInterval(async () => {
            try {
                const response = await fetch(`/api/admin/audit-runs/${auditRunId}/analysis`, {
                    cache: "no-store",
                });
                if (!response.ok) return;
                const data = (await response.json()) as {
                    analysis?: { status?: CursorAnalysisStatus };
                };
                const nextStatus = data.analysis?.status;
                if (
                    nextStatus === "completed" ||
                    nextStatus === "failed" ||
                    nextStatus === "retry_pending"
                ) {
                    router.refresh();
                }
            } catch {
                // Ignore transient polling errors.
            }
        }, pollIntervalMs);

        return () => window.clearInterval(intervalId);
    }, [auditRunId, pollIntervalMs, router, shouldPoll]);

    return null;
}
