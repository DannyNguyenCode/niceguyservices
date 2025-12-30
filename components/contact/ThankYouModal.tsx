"use client";

import React, { useEffect, useRef } from "react";

interface ThankYouModalProps {
    open: boolean;
    onClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ open, onClose }) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Sync the native <dialog> with the `open` prop
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open) {
            if (!dialog.open) dialog.showModal();
        } else {
            if (dialog.open) dialog.close();
        }
    }, [open]);

    // Ensure React state updates when dialog closes via ESC/backdrop
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
                    className="font-bold text-lg mb-2"
                >
                    Thank you for reaching out
                </h3>
                <p className="text-sm text-base-content/80 mb-2">
                    I&apos;ve received your message and will get back to you within 24
                    hours.
                </p>
                <p className="text-sm text-base-content/70">
                    If you requested a meeting, I&apos;ll include a few available time
                    slots in my reply and a link where you can pick what works best for
                    you.
                </p>

                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn" onClick={onClose}>
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
};

export default ThankYouModal;
