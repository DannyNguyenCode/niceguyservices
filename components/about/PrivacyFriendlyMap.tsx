"use client";

import Image from "next/image";
import { useState } from "react";
import aboutContent from "./aboutContent.json";

type PrivacyFriendlyMapProps = {
    className?: string;
    variant?: "default" | "embedded";
};

export default function PrivacyFriendlyMap({
    className = "",
    variant = "default",
}: PrivacyFriendlyMapProps) {
    const [loaded, setLoaded] = useState(false);
    const { map } = aboutContent;

    const embedded = variant === "embedded";

    const base = embedded
        ? "relative flex h-full min-h-[280px] w-full flex-col overflow-hidden bg-base-200 md:min-h-[400px]"
        : "relative mt-2 h-56 overflow-hidden rounded-xl border border-base-300 bg-base-200";

    const innerShell = embedded
        ? "relative z-[2] flex min-h-[240px] w-full flex-1 flex-col items-center justify-center px-4 text-center"
        : "relative z-[2] flex h-full w-full flex-col items-center justify-center px-4 text-center";

    const iframeClass = embedded
        ? "relative z-[2] min-h-[240px] w-full flex-1 border-0"
        : "relative z-[2] h-full w-full border-0";

    const previewSrc = map.previewImageSrc ?? "/images/Toronto-city-map.png";
    const previewAlt = map.previewImageAlt ?? "Map preview";

    return (
        <div className={`${base} ${className}`.trim()}>
            {!loaded ? (
                <>
                    <Image
                        src={previewSrc}
                        alt={previewAlt}
                        fill
                        className="z-0 object-cover"
                        sizes={embedded ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
                        priority={false}
                    />
                    <div
                        className="absolute inset-0 z-[1] bg-base-100/80 backdrop-blur-[2px] dark:bg-base-300/75"
                        aria-hidden
                    />
                    <div className={innerShell}>
                        <h4 className="mb-1 font-semibold">{map.privacyTitle}</h4>
                        <p className="mb-3 max-w-md text-sm text-base-content">
                            {map.privacyDescription}
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm rounded-full normal-case"
                            onClick={() => setLoaded(true)}
                        >
                            {map.loadButton}
                        </button>
                    </div>
                </>
            ) : (
                <iframe
                    title={map.iframeTitle}
                    src={map.embedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className={iframeClass}
                />
            )}
        </div>
    );
}
