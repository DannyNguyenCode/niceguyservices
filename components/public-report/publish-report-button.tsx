"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type PublishReportButtonProps = {
    reportId: string;
    label?: string;
};

export default function PublishReportButton({
    reportId,
    label = "Publish report",
}: PublishReportButtonProps) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [publicUrl, setPublicUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    async function copyUrl(url: string) {
        try {
            await navigator.clipboard.writeText(url);
            setMessage("Public report link copied.");
        } catch {
            setMessage(`Copy this URL: ${url}`);
        }
    }

    function handlePublish() {
        setMessage(null);
        startTransition(async () => {
            const response = await fetch(`/api/admin/reports/${reportId}/publish`, {
                method: "POST",
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Unable to publish report.");
                return;
            }
            setPublicUrl(result.publicUrl);
            setMessage("Report published.");
            await copyUrl(result.publicUrl);
            router.refresh();
        });
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handlePublish}
                disabled={isPending}
            >
                {isPending ? "Publishing..." : label}
            </button>
            {publicUrl ? (
                <input
                    readOnly
                    value={publicUrl}
                    className="input input-bordered input-sm w-full font-mono text-xs"
                    aria-label="Public report URL"
                />
            ) : null}
            {message ? (
                <p className="text-sm text-base-content/75" role="status">
                    {message}
                </p>
            ) : null}
        </div>
    );
}
