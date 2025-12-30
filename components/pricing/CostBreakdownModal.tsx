"use client";

import React, { useEffect, useRef } from "react";

interface CostBreakdownModalProps {
    open: boolean;
    onClose: () => void;
}

const CostBreakdownModal: React.FC<CostBreakdownModalProps> = ({
    open,
    onClose,
}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // sync native <dialog> with `open` prop
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open) {
            if (!dialog.open) dialog.showModal();
        } else {
            if (dialog.open) dialog.close();
        }
    }, [open]);

    // keep React state in sync when dialog is closed via ESC/backdrop
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
            aria-labelledby="pricing-breakdown-title"
        >
            <div className="modal-box max-h-[90vh] overflow-y-auto">
                <h3
                    id="pricing-breakdown-title"
                    className="font-bold text-lg mb-4"
                >
                    Full Cost Breakdown
                </h3>

                <p className="text-sm opacity-80 mb-3">
                    Why a $50 template usually becomes thousands after setup.
                </p>

                <ul className="list-disc ml-5 text-sm opacity-80 space-y-1">
                    <li>Template purchase: ~$50</li>
                    <li>Developer customization: $600–$1,600</li>
                    <li>Premium plugins: $200–$400/year</li>
                    <li>Hosting & maintenance ongoing costs</li>
                    <li>Security, performance, and plugin issues</li>
                </ul>

                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn" onClick={onClose}>
                            Close
                        </button>
                    </form>
                    <button
                        className="btn btn-primary"
                        onClick={() => (window.location.href = "/contact")}
                    >
                        See How I Can Save You Money
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button aria-label="Close" onClick={onClose} />
            </form>
        </dialog>
    );
};

export default CostBreakdownModal;
