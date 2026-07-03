"use client";

import { useCallback, useEffect, useState } from "react";
import { WORKBOOK_CONTENT } from "@/lib/clientDiscoveryWorkbook/content";

const SECTION_IDS = WORKBOOK_CONTENT.sections.map((s) => s.id);

const NAV_HEIGHT_PX = 64;

function measureScrollOffset(): number {
    const sticky = document.querySelector<HTMLElement>(".workbook-sticky-actions");
    const stickyHeight = sticky?.getBoundingClientRect().height ?? 0;
    return NAV_HEIGHT_PX + stickyHeight + 12;
}

function resolveActiveSection(): string {
    const offset = measureScrollOffset();
    let active = SECTION_IDS[0];

    for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) {
            active = id;
        }
    }

    return active;
}

export function useWorkbookSectionScrollSpy(enabled: boolean) {
    const [activeSectionId, setActiveSectionId] = useState(SECTION_IDS[0]);

    useEffect(() => {
        if (!enabled) return;

        let frame = 0;

        const update = () => {
            const next = resolveActiveSection();
            setActiveSectionId((prev) => (prev === next ? prev : next));
        };

        const onScrollOrResize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };

        const sticky = document.querySelector<HTMLElement>(".workbook-sticky-actions");
        const resizeObserver =
            sticky && typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(onScrollOrResize)
                : null;
        if (sticky && resizeObserver) {
            resizeObserver.observe(sticky);
        }

        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);

        const initTimer = window.setTimeout(update, 0);

        return () => {
            cancelAnimationFrame(frame);
            window.clearTimeout(initTimer);
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
            resizeObserver?.disconnect();
        };
    }, [enabled]);

    const scrollToSection = useCallback((sectionId: string) => {
        const el = document.getElementById(sectionId);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - measureScrollOffset();
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, []);

    return { activeSectionId, scrollToSection };
}
