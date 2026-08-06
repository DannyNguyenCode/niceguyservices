"use client";

import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useId, useRef } from "react";
import type { PublicAuditSubmitStatusView } from "@/components/websiteAudit/public-audit-submit-status";

type PublicAuditSubmitStatusModalProps = {
    open: boolean;
    view: PublicAuditSubmitStatusView | null;
    onClose: () => void;
};

export default function PublicAuditSubmitStatusModal({
    open,
    view,
    onClose,
}: PublicAuditSubmitStatusModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const primaryActionRef = useRef<HTMLButtonElement | null>(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open) {
            if (!dialog.open) dialog.showModal();
        } else if (dialog.open) {
            dialog.close();
        }
    }, [open]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => {
            onClose();
        };

        const handleCancel = (event: Event) => {
            if (view && !view.dismissible) {
                event.preventDefault();
            }
        };

        dialog.addEventListener("close", handleClose);
        dialog.addEventListener("cancel", handleCancel);
        return () => {
            dialog.removeEventListener("close", handleClose);
            dialog.removeEventListener("cancel", handleCancel);
        };
    }, [onClose, view]);

    useEffect(() => {
        if (!open || !view || view.phase === "loading") return;
        primaryActionRef.current?.focus();
    }, [open, view]);

    if (!open || !view) return null;

    const isLoading = view.phase === "loading";
    const isSuccess = view.phase === "success";
    const isError = view.phase === "error";

    return (
        <dialog
            ref={dialogRef}
            className="modal modal-bottom sm:modal-middle"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            aria-busy={isLoading ? "true" : undefined}
        >
            <div className="modal-box mx-4 w-[calc(100%-2rem)] max-w-md sm:mx-auto">
                <div className="flex flex-col items-center text-center">
                    {isLoading ? (
                        <span
                            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                            aria-hidden
                        >
                            <span className="loading-indicator h-6 w-6 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin motion-reduce:animate-none" />
                        </span>
                    ) : null}

                    {isSuccess ? (
                        <CheckCircleIcon
                            className="mb-4 h-12 w-12 text-success"
                            aria-hidden
                        />
                    ) : null}

                    {isError ? (
                        <ExclamationTriangleIcon
                            className="mb-4 h-12 w-12 text-warning"
                            aria-hidden
                        />
                    ) : null}

                    <h3 id={titleId} className="text-lg font-semibold text-base-content">
                        {view.title}
                    </h3>

                    <p
                        id={descriptionId}
                        className="mt-2 text-sm leading-relaxed text-base-content/75"
                    >
                        {view.description}
                    </p>

                    {view.statusLabel ? (
                        <p
                            className="mt-4 text-sm font-medium text-base-content"
                            role="status"
                            aria-live="polite"
                        >
                            {view.statusLabel}
                        </p>
                    ) : null}

                    {view.backgroundNote ? (
                        <p
                            className="mt-4 rounded-xl bg-base-200 px-4 py-3 text-sm leading-relaxed text-base-content/80"
                            role="status"
                        >
                            {view.backgroundNote}
                        </p>
                    ) : null}

                    {view.phase !== "loading" ? (
                        <div className="modal-action mt-6 w-full justify-center sm:justify-end">
                            <button
                                ref={primaryActionRef}
                                type="button"
                                className="btn btn-primary inline-flex min-w-[7.5rem] items-center gap-1.5"
                                onClick={onClose}
                            >
                                {isError ? (
                                    <XMarkIcon className="h-5 w-5" aria-hidden />
                                ) : null}
                                {view.primaryActionLabel}
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>

            {view.dismissible ? (
                <form method="dialog" className="modal-backdrop">
                    <button type="submit" aria-label="Close">
                        close
                    </button>
                </form>
            ) : (
                <div className="modal-backdrop" aria-hidden />
            )}
        </dialog>
    );
}
