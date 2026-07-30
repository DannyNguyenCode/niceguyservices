import { BLOCKED_SCREENSHOT_PATH_PATTERNS } from "@/src/lib/public-report-config";
import type { SerializableScreenshot } from "@/src/data/screenshots";

export function isScreenshotPathAllowed(pageUrl: string): boolean {
    try {
        const pathname = new URL(pageUrl).pathname;
        return !BLOCKED_SCREENSHOT_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
    } catch {
        return false;
    }
}

export function isScreenshotEligibleForPublic(shot: SerializableScreenshot): boolean {
    return (
        shot.status === "complete" &&
        Boolean(shot.secureUrl) &&
        isScreenshotPathAllowed(shot.pageUrl)
    );
}

export function selectDefaultScreenshotIds(
    screenshots: SerializableScreenshot[],
    max = 6,
): string[] {
    const eligible = screenshots.filter(isScreenshotEligibleForPublic);
    const priorityOrder = [
        (shot: SerializableScreenshot) =>
            shot.pageType === "home" && shot.type === "desktop-viewport",
        (shot: SerializableScreenshot) =>
            shot.pageType === "home" && shot.type === "mobile-viewport",
        (shot: SerializableScreenshot) =>
            shot.pageType === "services" && shot.type.includes("desktop"),
        (shot: SerializableScreenshot) =>
            shot.pageType === "contact" && shot.type.includes("desktop"),
        (shot: SerializableScreenshot) => shot.pageType === "about",
    ];

    const selected: SerializableScreenshot[] = [];
    const used = new Set<string>();

    for (const matcher of priorityOrder) {
        const match = eligible.find((shot) => matcher(shot) && !used.has(shot.id));
        if (match) {
            selected.push(match);
            used.add(match.id);
        }
        if (selected.length >= max) break;
    }

    for (const shot of eligible) {
        if (selected.length >= max) break;
        if (!used.has(shot.id)) {
            selected.push(shot);
            used.add(shot.id);
        }
    }

    return selected.map((shot) => shot.id);
}

export function sanitizeReportText(value: string, maxLength = 200): string {
    return value
        .replace(/<[^>]*>/g, "")
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .trim()
        .slice(0, maxLength);
}
