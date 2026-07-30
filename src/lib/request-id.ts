const REQUEST_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;

export function normalizeRequestId(value: string | null | undefined): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!REQUEST_ID_PATTERN.test(trimmed)) {
        return null;
    }
    return trimmed;
}

export function createRequestId(): string {
    const random = Math.random().toString(36).slice(2, 10);
    const timestamp = Date.now().toString(36);
    return `req_${timestamp}_${random}`;
}

export function resolveRequestId(headers: Headers): string {
    const candidates = [
        headers.get("x-request-id"),
        headers.get("x-vercel-id"),
        headers.get("x-amzn-trace-id"),
    ];

    for (const candidate of candidates) {
        const normalized = normalizeRequestId(candidate);
        if (normalized) {
            return normalized;
        }
    }

    return createRequestId();
}
