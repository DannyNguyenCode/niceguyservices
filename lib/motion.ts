export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function particleBudget(): { max: number; ambient: number; browser: number } {
    if (typeof window === "undefined") return { max: 550, ambient: 14, browser: 550 };
    if (prefersReducedMotion()) return { max: 0, ambient: 0, browser: 0 };
    const w = window.innerWidth;
    if (w < 640) return { max: 50, ambient: 8, browser: 110 };
    if (w < 1024) return { max: 90, ambient: 12, browser: 180 };
    return { max: 140, ambient: 20, browser: 280 };
}
