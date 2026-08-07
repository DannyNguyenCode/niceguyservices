"use client";

import { useEffect, useState } from "react";

export default function PdfReportReadyMarker({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function prepare() {
            try {
                await document.fonts.ready;
                const images = Array.from(document.images);
                await Promise.all(
                    images.map((image) => {
                        if (image.complete) return Promise.resolve();
                        return new Promise<void>((resolve) => {
                            image.addEventListener("load", () => resolve(), { once: true });
                            image.addEventListener("error", () => resolve(), { once: true });
                        });
                    }),
                );
            } finally {
                if (!cancelled) {
                    setReady(true);
                }
            }
        }

        void prepare();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div data-pdf-report-ready={ready ? "true" : "false"} className="pdf-root">
            {children}
        </div>
    );
}
