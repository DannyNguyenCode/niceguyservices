"use client";

import { useState, useTransition } from "react";
import { deleteWebsiteAction } from "@/src/actions/websites";

type SoftDeleteWebsiteButtonProps = {
    websiteId: string;
    businessLabel: string;
    className?: string;
};

export default function SoftDeleteWebsiteButton({
    websiteId,
    businessLabel,
    className = "btn btn-xs btn-ghost",
}: SoftDeleteWebsiteButtonProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    function handleClick() {
        const confirmed = window.confirm(
            `Permanently delete "${businessLabel}"? This removes the website, audit history, screenshots, reports, and all related data from MongoDB and Cloudinary. This cannot be undone.`,
        );
        if (!confirmed) return;

        setErrorMessage(null);
        startTransition(async () => {
            const result = await deleteWebsiteAction(websiteId);
            if (result && !result.ok) {
                setErrorMessage(result.message ?? "Unable to delete this website.");
            }
        });
    }

    return (
        <span className="inline-flex flex-col gap-1">
            <button
                type="button"
                className={className}
                onClick={handleClick}
                disabled={pending}
                aria-label={`Delete ${businessLabel}`}
            >
                {pending ? "Deleting…" : "Delete"}
            </button>
            {errorMessage ? (
                <span className="text-xs text-error" role="alert">
                    {errorMessage}
                </span>
            ) : null}
        </span>
    );
}
