"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { runAiAnalysisAction } from "@/src/actions/ai";
import type { AiAnalysisStatus } from "@/src/schemas/enums";

type RunAiAnalysisButtonProps = {
    websiteId: string;
    aiAnalysisStatus: AiAnalysisStatus;
    prerequisitesMet: boolean;
    canRun?: boolean;
};

export default function RunAiAnalysisButton({
    websiteId,
    aiAnalysisStatus,
    prerequisitesMet,
    canRun = true,
}: RunAiAnalysisButtonProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isProcessing =
        isPending ||
        aiAnalysisStatus === "queued" ||
        aiAnalysisStatus === "processing";

    const hasResults =
        aiAnalysisStatus === "complete" ||
        aiAnalysisStatus === "partial" ||
        aiAnalysisStatus === "failed";

    const label = isProcessing
        ? "Generating analysis..."
        : hasResults
          ? "Regenerate analysis"
          : "Generate analysis";

    function handleClick() {
        setMessage(null);
        setIsSuccess(false);

        startTransition(async () => {
            const result = await runAiAnalysisAction(websiteId);
            setIsSuccess(result.ok);
            setMessage(result.message ?? (result.ok ? "AI analysis completed." : "AI analysis failed."));
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
                disabled={isProcessing || !prerequisitesMet || !canRun}
            >
                {label}
            </button>
            {!prerequisitesMet ? (
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
