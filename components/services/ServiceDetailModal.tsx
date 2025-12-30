"use client";

import React, { useEffect, useRef } from "react";
import type { Service } from "@/components/services/data";

interface ServiceDetailsModalProps {
    service: Service | null;
    onClose: () => void;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
    service,
    onClose,
}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Open/close the native <dialog> when `service` changes
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (service) {
            if (!dialog.open) dialog.showModal();
        } else {
            if (dialog.open) dialog.close();
        }
    }, [service]);

    // Sync React state when the dialog is closed (ESC, backdrop, etc.)
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleDialogClose = () => {
            onClose();
        };

        dialog.addEventListener("close", handleDialogClose);
        return () => dialog.removeEventListener("close", handleDialogClose);
    }, [onClose]);

    // Optional: don’t render at all when there’s no active service
    if (!service) return null;

    return (
        <dialog
            ref={dialogRef}
            id="service_modal"
            className="modal modal-bottom sm:modal-middle"
        >
            <div className="modal-box max-h-[90vh] overflow-y-auto space-y-5 w-11/12 max-w-5xl">
                {/* Header */}
                <div className="space-y-1">
                    <h3 className="text-xl font-extrabold">{service.title}</h3>
                    <p className="text-sm text-base-content/70">
                        {service.details.headline}
                    </p>
                </div>

                {/* Description */}
                <p className="text-sm text-base-content/80">
                    {service.details.description}
                </p>

                {/* What You Get */}
                <div>
                    <h4 className="text-lg font-bold mb-2">What You Get</h4>
                    <ul className="space-y-2">
                        {service.details.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="h-2 w-2 bg-primary rounded-full mt-1" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Process */}
                <div>
                    <h4 className="text-lg font-bold mb-2">The Process</h4>
                    <ul className="space-y-3">
                        {service.details.process.map((step, i) => (
                            <li key={i} className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-semibold">{step.step}</p>
                                    <p className="text-xs text-base-content/70">{step.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <div className="pt-2">
                    <a
                        href="#contact"
                        className="btn btn-secondary normal-case w-full"
                    >
                        Request a Free Quote
                    </a>
                </div>

                {/* Close button inside modal */}
                <div className="modal-action">
                    <form method="dialog">
                        <button
                            className="btn"
                            onClick={() => {
                                // This closes the dialog and triggers the `close` event,
                                // which in turn will call onClose() via the listener.
                            }}
                        >
                            Close
                        </button>
                    </form>
                </div>
            </div>

            {/* Backdrop (click to close) */}
            <form method="dialog" className="modal-backdrop">
                <button aria-label="Close" />
            </form>
        </dialog>
    );
};

export default ServiceDetailsModal;
