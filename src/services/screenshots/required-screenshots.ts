import type { SerializableScreenshot } from "@/src/data/screenshots";

export type RequiredScreenshotEvaluation = {
    hasDesktop: boolean;
    hasMobile: boolean;
    complete: boolean;
    missing: Array<"desktop" | "mobile">;
};

/**
 * Cursor readiness and report evidence require at least one complete desktop
 * and one complete mobile screenshot with a usable HTTPS (or public) URL.
 */
export function isUsableScreenshot(shot: SerializableScreenshot): boolean {
    if (shot.status !== "complete") {
        return false;
    }
    return Boolean(shot.secureUrl?.trim() || shot.publicUrl?.trim());
}

export function evaluateRequiredScreenshots(
    screenshots: SerializableScreenshot[],
): RequiredScreenshotEvaluation {
    const hasDesktop = screenshots.some(
        (shot) => isUsableScreenshot(shot) && shot.type.startsWith("desktop"),
    );
    const hasMobile = screenshots.some(
        (shot) => isUsableScreenshot(shot) && shot.type.startsWith("mobile"),
    );
    const missing: Array<"desktop" | "mobile"> = [];
    if (!hasDesktop) missing.push("desktop");
    if (!hasMobile) missing.push("mobile");
    return {
        hasDesktop,
        hasMobile,
        complete: hasDesktop && hasMobile,
        missing,
    };
}
