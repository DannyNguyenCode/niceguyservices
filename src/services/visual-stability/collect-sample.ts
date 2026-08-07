import type { Page } from "playwright-core";
import type { VisualStabilitySample } from "@/src/services/visual-stability/types";

/**
 * Collects a best-effort visual readiness sample inside the page.
 * Runs in the browser via page.evaluate — keep this function self-contained.
 */
export async function collectVisualStabilitySample(page: Page): Promise<VisualStabilitySample> {
    return page.evaluate(() => {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;

        const isInViewport = (rect: DOMRect) =>
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < viewportHeight &&
            rect.left < viewportWidth &&
            rect.width > 0 &&
            rect.height > 0;

        let fontsReady = true;
        let fontsSupported = false;
        const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
        if (fonts && typeof fonts.status === "string") {
            fontsSupported = true;
            fontsReady = fonts.status === "loaded";
        }

        let unfinishedFiniteAnimations = 0;
        let infiniteAnimations = 0;
        try {
            const animations =
                typeof document.getAnimations === "function" ? document.getAnimations() : [];
            for (const animation of animations) {
                const effect = animation.effect as
                    | (KeyframeEffect & { getTiming?: () => EffectTiming })
                    | null;
                const timing = effect && typeof effect.getTiming === "function" ? effect.getTiming() : null;
                const iterations = timing?.iterations;
                const isInfinite =
                    iterations === Infinity ||
                    (typeof iterations === "number" && !Number.isFinite(iterations));

                if (
                    animation.playState === "finished" ||
                    animation.playState === "idle" ||
                    animation.playState === "paused"
                ) {
                    continue;
                }

                if (isInfinite) {
                    infiniteAnimations += 1;
                } else {
                    unfinishedFiniteAnimations += 1;
                }
            }
        } catch {
            // Cross-origin or unsupported animation introspection — ignore.
        }

        const images = Array.from(document.images || []);
        let visibleImagesTotal = 0;
        let visibleImagesPending = 0;
        for (const image of images) {
            const rect = image.getBoundingClientRect();
            if (!isInViewport(rect)) continue;
            visibleImagesTotal += 1;
            if (!image.complete) {
                visibleImagesPending += 1;
                continue;
            }
            // naturalWidth === 0 can mean broken image; treat as settled (real UX issue).
        }

        // Prominent in-viewport element geometry — not every node (performance + noise).
        const candidates = Array.from(
            document.querySelectorAll("body *"),
        ) as HTMLElement[];
        const boxes: string[] = [];
        for (const el of candidates) {
            if (boxes.length >= 40) break;
            const style = window.getComputedStyle(el);
            if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
                continue;
            }
            const rect = el.getBoundingClientRect();
            if (!isInViewport(rect)) continue;
            if (rect.width < 8 || rect.height < 8) continue;
            boxes.push(
                [
                    Math.round(rect.left),
                    Math.round(rect.top),
                    Math.round(rect.width),
                    Math.round(rect.height),
                    el.tagName,
                ].join(":"),
            );
        }

        return {
            readyState: document.readyState,
            fontsReady,
            fontsSupported,
            unfinishedFiniteAnimations,
            infiniteAnimations,
            visibleImagesTotal,
            visibleImagesPending,
            layout: {
                scrollWidth: document.documentElement.scrollWidth || 0,
                scrollHeight: document.documentElement.scrollHeight || 0,
                clientWidth: document.documentElement.clientWidth || 0,
                clientHeight: document.documentElement.clientHeight || 0,
                boxesKey: boxes.join("|"),
            },
            sampledAtMs: 0,
        };
    });
}
