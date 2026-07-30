"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
    getRateLimitMessage,
    getRateLimitResetLabel,
    isRateLimitResponse,
} from "@/lib/websiteAudit/rate-limit-client";
import RateLimitAlert from "@/components/websiteAudit/RateLimitAlert";

type PdfReportActionsProps = {
    publicReportId: string;
    allowArchived?: boolean;
    matchingPdfExists?: boolean;
    downloadUrl?: string | null;
};

export default function PdfReportActions({
    publicReportId,
    allowArchived = false,
    matchingPdfExists = false,
    downloadUrl = null,
}: PdfReportActionsProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [resetLabel, setResetLabel] = useState<string | null>(null);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [isPending, startTransition] = useTransition();

    function generate(forceRegenerate = false) {
        setMessage(forceRegenerate ? "Generating PDF…" : "Preparing PDF…");
        setResetLabel(null);
        setIsRateLimited(false);
        startTransition(async () => {
            const response = await fetch(`/api/admin/reports/${publicReportId}/pdf`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ forceRegenerate, allowArchived }),
            });
            const result = await response.json();
            if (isRateLimitResponse(response, result)) {
                setIsRateLimited(true);
                setMessage(getRateLimitMessage(result, "PDF generation is temporarily limited."));
                setResetLabel(getRateLimitResetLabel(result));
                return;
            }
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "PDF generation failed.");
                return;
            }
            if (result.reusedExisting) {
                setMessage("Using existing PDF for this report revision.");
            } else {
                setMessage("PDF generated successfully.");
            }
            router.refresh();
        });
    }

    return (
        <div className="grid grid-cols-1 gap-2">
            {matchingPdfExists ? (
                <p className="text-sm text-base-content/75">
                    A PDF already exists for this report revision.
                </p>
            ) : null}
            {isRateLimited && message ? (
                <RateLimitAlert message={message} resetLabel={resetLabel} />
            ) : null}
            {message && !isRateLimited ? (
                <p className="text-sm text-base-content/75" role="status">
                    {message}
                </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
                {matchingPdfExists && downloadUrl ? (
                    <a href={downloadUrl} className="btn btn-outline btn-sm">
                        Download existing PDF
                    </a>
                ) : null}
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={isPending || isRateLimited}
                    onClick={() => generate(false)}
                >
                    {isPending ? "Generating PDF…" : matchingPdfExists ? "Generate another copy" : "Generate PDF"}
                </button>
                {matchingPdfExists ? (
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={isPending || isRateLimited}
                        onClick={() => generate(true)}
                    >
                        Regenerate PDF
                    </button>
                ) : null}
            </div>
        </div>
    );
}
