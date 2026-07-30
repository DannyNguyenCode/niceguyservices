import { createHmac } from "crypto";
import { getRateLimitHashSecret } from "@/src/config/env";

export function hashRateLimitIdentifier(value: string): string {
    const secret = getRateLimitHashSecret();
    return createHmac("sha256", secret).update(value).digest("hex");
}

export function hashRateLimitIdentifierPrefix(value: string, length = 16): string {
    return hashRateLimitIdentifier(value).slice(0, length);
}
