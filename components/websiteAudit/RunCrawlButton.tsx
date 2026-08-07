"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { runWebsiteCrawlAction } from "@/src/actions/crawl";
import { getRateLimitResetLabel } from "@/lib/websiteAudit/rate-limit-client";
import RateLimitAlert from "@/components/websiteAudit/RateLimitAlert";
import type { CrawlStatus } from "@/src/types/website-audit";

type RunCrawlButtonProps = {
    websiteId: string;
    crawlStatus: CrawlStatus;
    canRun?: boolean;
};

export default function RunCrawlButton({
    websiteId,
    crawlStatus,
    canRun = true,
}: RunCrawlButtonProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [resetLabel, setResetLabel] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isProcessing =
        isPending || crawlStatus === "queued" || crawlStatus === "processing";
    const label =
        crawlStatus === "failed" || crawlStatus === "complete"
            ? isPending
                ? "Retrying crawl..."
                : "Rerun crawl"
            : isPending
              ? "Running crawl..."
              : "Run crawl";

    function handleClick() {
        setMessage(null);
        setResetLabel(null);
        setIsSuccess(false);
        setIsRateLimited(false);

        startTransition(async () => {
            const result = await runWebsiteCrawlAction(websiteId);
            if (result.rateLimited) {
                setIsRateLimited(true);
                setMessage(result.message ?? "Crawl is temporarily limited.");
                setResetLabel(getRateLimitResetLabel(result));
                return;
            }
            setIsSuccess(result.ok);
            setMessage(result.message ?? (result.ok ? "Crawl completed." : "Crawl failed."));
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
                disabled={isProcessing || !canRun || isRateLimited}
            >
                {label}
            </button>
            {isRateLimited && message ? (
                <RateLimitAlert message={message} resetLabel={resetLabel} />
            ) : null}
            {message && !isRateLimited ? (
                <p
                    className={`text-sm ${
                        isSuccess ? "text-success" : "text-error"
                    }`}
                    role="status"
                >
                    {message}
                </p>
            ) : null}
        </div>
    );
}
