const SENSITIVE_KEY_PATTERN =
    /(password|secret|token|authorization|cookie|api[_-]?key|accesstoken|refreshtoken|connectionstring|privatekey|clientsecret|rendertoken|publictoken|previewtoken)/i;

const MAX_DEPTH = 4;
const MAX_KEYS = 40;
const MAX_STRING_LENGTH = 500;
const MAX_ARRAY_LENGTH = 25;

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date);
}

function sanitizeValue(
    value: unknown,
    depth: number,
    seen: WeakSet<object>,
): unknown {
    if (value === null || value === undefined) return value;
    if (typeof value === "boolean" || typeof value === "number") return value;
    if (typeof value === "bigint") return Number(value);
    if (typeof value === "function" || typeof value === "symbol") return undefined;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return undefined;
    if (value instanceof Date) return value.toISOString();

    if (typeof value === "string") {
        return value.length > MAX_STRING_LENGTH
            ? `${value.slice(0, MAX_STRING_LENGTH)}…`
            : value;
    }

    if (depth >= MAX_DEPTH) return "[truncated]";

    if (Array.isArray(value)) {
        return value
            .slice(0, MAX_ARRAY_LENGTH)
            .map((item) => sanitizeValue(item, depth + 1, seen))
            .filter((item) => item !== undefined);
    }

    if (!isPlainObject(value)) return undefined;
    if (seen.has(value)) return "[circular]";
    seen.add(value);

    const output: Record<string, unknown> = {};
    let keyCount = 0;

    for (const [key, nested] of Object.entries(value)) {
        if (keyCount >= MAX_KEYS) break;
        if (SENSITIVE_KEY_PATTERN.test(key)) continue;
        const sanitized = sanitizeValue(nested, depth + 1, seen);
        if (sanitized !== undefined) {
            output[key] = sanitized;
            keyCount += 1;
        }
    }

    return output;
}

export function sanitizeActivityMetadata(
    metadata?: Record<string, unknown> | null,
): Record<string, unknown> | undefined {
    if (!metadata) return undefined;
    const sanitized = sanitizeValue(metadata, 0, new WeakSet<object>());
    if (!sanitized || typeof sanitized !== "object" || Array.isArray(sanitized)) {
        return undefined;
    }
    return sanitized as Record<string, unknown>;
}

export function sanitizePlainText(value: string, maxLength: number): string {
    return value
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}
