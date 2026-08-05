"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { runAiAnalysisAction } from "@/src/actions/ai";
import { ACTIVE_CURSOR_ANALYSIS_STATUSES } from "@/src/services/cursor-analysis/constants";
import type { AnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import type { SerializableAuditRunAnalysis } from "@/src/services/cursor-analysis/types";

type RunAiAnalysisButtonProps = {
    websiteId: string;
    auditRunId?: string | null;
    aiAnalysisStatus: string;
    prerequisitesMet: boolean;
    canRun?: boolean;
    useCursorAutomation?: boolean;
    cursorAnalysis?: SerializableAuditRunAnalysis | null;
    cursorReadiness?: AnalysisReadiness;
};

export default function RunAiAnalysisButton({
    websiteId,
    auditRunId,
    aiAnalysisStatus,
    prerequisitesMet,
    canRun = true,
    useCursorAutomation = false,
    cursorAnalysis,
    cursorReadiness,
}: RunAiAnalysisButtonProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const cursorActive = Boolean(
        cursorAnalysis && ACTIVE_CURSOR_ANALYSIS_STATUSES.includes(cursorAnalysis.status),
    );
    const cursorReady = useCursorAutomation
        ? Boolean(cursorReadiness?.ready && auditRunId)
        : prerequisitesMet;
    const canRetry =
        useCursorAutomation &&
        (cursorAnalysis?.status === "failed" || cursorAnalysis?.status === "retry_pending");

    const isProcessing =
        isPending ||
        cursorActive ||
        aiAnalysisStatus === "queued" ||
        aiAnalysisStatus === "processing";

    const hasResults =
        cursorAnalysis?.status === "completed" ||
        aiAnalysisStatus === "complete" ||
        aiAnalysisStatus === "partial" ||
        aiAnalysisStatus === "failed";

    const label = isProcessing
        ? useCursorAutomation
            ? "Triggering analysis..."
            : "Generating analysis..."
        : hasResults
          ? canRetry
              ? "Retry analysis"
              : "Regenerate analysis"
          : "Generate analysis";

    function handleClick() {
        setMessage(null);
        setIsSuccess(false);

        startTransition(async () => {
            const result = await runAiAnalysisAction(websiteId, auditRunId);
            setIsSuccess(result.ok);
            setMessage(
                result.message ??
                    (result.ok
                        ? useCursorAutomation
                            ? "Cursor analysis triggered."
                            : "AI analysis completed."
                        : "AI analysis failed."),
            );
            if (result.ok) {
                router.refresh();
            }
        });
    }

    return (
        <div className="flex flex-col gap-3">
            <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleClick}
                disabled={isProcessing || !cursorReady || !canRun || (useCursorAutomation && !auditRunId)}
            >
                {label}
            </button>
            {useCursorAutomation && cursorAnalysis?.attempt ? (
                <p className="text-xs text-base-content/60">Attempt {cursorAnalysis.attempt}</p>
            ) : null}
            {useCursorAutomation && cursorReadiness && !cursorReadiness.ready ? (
                <div className="text-sm text-base-content/70">
                    <p>Missing inputs for Cursor analysis:</p>
                    <ul className="mt-2 list-disc pl-5">
                        {cursorReadiness.blockers.map((item) => (
                            <li key={item.code}>{item.message}</li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {!useCursorAutomation && !prerequisitesMet ? (
                <p className="text-sm text-base-content/70">
                    Complete crawl, PageSpeed, and Nice Guy scoring before running AI analysis.
                </p>
            ) : null}
            {message ? (
                <p
                    className={`text-sm ${isSuccess ? "text-success" : "text-error"}`}
                    role="status"
                >
                    {message}
                </p>
            ) : null}
        </div>
    );
}
