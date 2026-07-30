"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { runPageSpeedAnalysisAction } from "@/src/actions/pagespeed";
import { getRateLimitResetLabel } from "@/lib/websiteAudit/rate-limit-client";
import RateLimitAlert from "@/components/websiteAudit/RateLimitAlert";
import type { PageSpeedStatus } from "@/src/types/website-audit";

type RunPageSpeedButtonProps = {
    websiteId: string;
    pageSpeedStatus: PageSpeedStatus;
    crawlComplete: boolean;
    canRun?: boolean;
};

export default function RunPageSpeedButton({
    websiteId,
    pageSpeedStatus,
    crawlComplete,
    canRun = true,
}: RunPageSpeedButtonProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [resetLabel, setResetLabel] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isProcessing =
        isPending || pageSpeedStatus === "queued" || pageSpeedStatus === "processing";

    const label =
        pageSpeedStatus === "failed" || pageSpeedStatus === "partial"
            ? isPending
                ? "Rerunning PageSpeed..."
                : "Rerun PageSpeed"
            : isPending
              ? "Running PageSpeed..."
              : "Run PageSpeed";

    function handleClick() {
        setMessage(null);
        setResetLabel(null);
        setIsSuccess(false);
        setIsRateLimited(false);

        startTransition(async () => {
            const result = await runPageSpeedAnalysisAction(websiteId);
            if (result.rateLimited) {
                setIsRateLimited(true);
                setMessage(result.message ?? "PageSpeed is temporarily limited.");
                setResetLabel(getRateLimitResetLabel(result));
                return;
            }
            setIsSuccess(result.ok);
            setMessage(
                result.message ??
                    (result.ok ? "PageSpeed completed." : "PageSpeed failed."),
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
                disabled={isProcessing || !crawlComplete || !canRun || isRateLimited}
            >
                {label}
            </button>
            {!crawlComplete ? (
                <p className="text-sm text-base-content/70">
                    Complete a crawl before running PageSpeed.
                </p>
            ) : null}
            {isRateLimited && message ? (
                <RateLimitAlert message={message} resetLabel={resetLabel} />
            ) : null}
            {message && !isRateLimited ? (
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
