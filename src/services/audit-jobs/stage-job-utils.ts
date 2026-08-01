export function isDuplicateKeyError(error: unknown): boolean {
    if (error && typeof error === "object" && "code" in error) {
        return (error as { code?: number }).code === 11000;
    }
    return error instanceof Error && /duplicate key/i.test(error.message);
}

export function buildStageIdempotencyKey(parts: Array<string | number | null | undefined>): string {
    return parts
        .filter((part) => part != null && String(part).length > 0)
        .map((part) => String(part))
        .join(":");
}
