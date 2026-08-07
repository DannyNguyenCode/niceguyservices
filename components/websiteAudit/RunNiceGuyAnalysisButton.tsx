"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { runNiceGuyAnalysisAction } from "@/src/actions/niceguy";
import type { NiceGuyStatus } from "@/src/schemas/enums";

type RunNiceGuyAnalysisButtonProps = {
    websiteId: string;
    niceGuyStatus: NiceGuyStatus;
    prerequisitesMet: boolean;
    canRun?: boolean;
};

export default function RunNiceGuyAnalysisButton({
    websiteId,
    niceGuyStatus,
    prerequisitesMet,
    canRun = true,
}: RunNiceGuyAnalysisButtonProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isProcessing =
        isPending || niceGuyStatus === "queued" || niceGuyStatus === "processing";

    const label =
        niceGuyStatus === "failed" || niceGuyStatus === "complete"
            ? isPending
                ? "Rerunning analysis..."
                : "Rerun analysis"
            : isPending
              ? "Running analysis..."
              : "Run analysis";

    function handleClick() {
        setMessage(null);
        setIsSuccess(false);

        startTransition(async () => {
            const result = await runNiceGuyAnalysisAction(websiteId);
            setIsSuccess(result.ok);
            setMessage(
                result.message ??
                    (result.ok ? "Nice Guy scoring completed." : "Nice Guy scoring failed."),
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
                disabled={isProcessing || !prerequisitesMet || !canRun}
            >
                {label}
            </button>
            {!prerequisitesMet ? (
                <p className="text-sm text-base-content/70">
                    Complete a crawl and at least one PageSpeed result before running Nice Guy
                    scoring.
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
