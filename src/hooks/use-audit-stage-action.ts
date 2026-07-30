"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

type AuditStageActionResult = {
    ok: boolean;
    message?: string;
};

type UseAuditStageActionOptions = {
    action: () => Promise<AuditStageActionResult>;
    successMessage?: string;
};

export function useAuditStageAction({
    action,
    successMessage = "Stage completed.",
}: UseAuditStageActionOptions) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isRunning, startTransition] = useTransition();

    const run = useCallback(() => {
        setMessage(null);
        setIsSuccess(false);

        startTransition(async () => {
            const result = await action();
            setIsSuccess(result.ok);
            setMessage(result.message ?? (result.ok ? successMessage : "Stage failed."));
            if (result.ok) {
                router.refresh();
            }
        });
    }, [action, router, successMessage]);

    const resetError = useCallback(() => {
        setMessage(null);
        setIsSuccess(false);
    }, []);

    return {
        run,
        isRunning,
        message,
        isSuccess,
        error: isSuccess ? null : message,
        resetError,
    };
}
