"use client";

import { EnvelopeOpenIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
interface ThankYouModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ThankYouModal({ open, onClose }: ThankYouModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open) {
            if (!dialog.open) dialog.showModal();
        } else {
            if (dialog.open) dialog.close();
        }
    }, [open]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => {
            onClose();
        };

        dialog.addEventListener("close", handleClose);
        return () => dialog.removeEventListener("close", handleClose);
    }, [onClose]);

    if (!open) return null;

    return (
        <dialog
            ref={dialogRef}
            className="modal modal-bottom sm:modal-middle"
            aria-labelledby="thank-you-title"
        >
            <div className="modal-box">
                <h3
                    id="thank-you-title"
                    className="mb-2 flex items-center gap-2 font-bold text-lg"
                >
                    <EnvelopeOpenIcon
                        className="h-7 w-7 shrink-0 text-primary"
                        aria-hidden
                    />
                    Thank you for reaching out
                </h3>
                <p className="text-sm text-base-content  mb-2">
                    Thanks for contacting Nice Guy Web Design — I&apos;ve received your
                    message and will get back to you within 24 hours.
                </p>
                <p className="text-sm text-base-content">
                    If you requested a meeting, I&apos;ll include a few available time
                    slots in my reply and a link where you can pick what works best for
                    you.
                </p>

                <div className="modal-action">
                    <form method="dialog">
                        <button
                            className="btn inline-flex items-center gap-1.5"
                            onClick={onClose}
                        >
                            <XMarkIcon className="h-5 w-5" aria-hidden />
                            Close
                        </button>
                    </form>
                </div>
            </div>

            {/* Backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button aria-label="Close" onClick={onClose} />
            </form>
        </dialog>
    );
}
