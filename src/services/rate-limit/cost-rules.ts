export function calculatePageSpeedCost(strategies: readonly string[]): number {
    return Math.max(1, strategies.length);
}

export function calculateScreenshotCost(count: number): number {
    if (count <= 5) return 1;
    if (count <= 15) return 2;
    if (count <= 30) return 3;
    return 4;
}

export function calculateDemoGenerationCost(pageCount: number): number {
    return pageCount > 1 ? 2 : 1;
}
