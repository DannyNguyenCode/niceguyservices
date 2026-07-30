import { z } from "zod";
import {
    positiveIntEnvSchema,
    rateLimitBypassModeSchema,
    rateLimitProviderSchema,
} from "@/src/validation/rate-limit";

const rateLimitEnvSchema = z.object({
    provider: rateLimitProviderSchema.default("memory"),
    bypassMode: rateLimitBypassModeSchema.default("disabled"),
    redisUrl: z.string().optional(),
    redisToken: z.string().optional(),
    hashSecret: z.string().optional(),
    trustProxyHeaders: z
        .string()
        .optional()
        .transform((value) => value === "true"),
    loginIpLimit: positiveIntEnvSchema,
    loginIpWindowSeconds: positiveIntEnvSchema,
    loginAccountLimit: positiveIntEnvSchema,
    loginAccountWindowSeconds: positiveIntEnvSchema,
    auditStartLimit: positiveIntEnvSchema,
    auditStartWindowSeconds: positiveIntEnvSchema,
    pagespeedLimit: positiveIntEnvSchema,
    pagespeedWindowSeconds: positiveIntEnvSchema,
    pagespeedGlobalDailyLimit: positiveIntEnvSchema,
    aiLimit: positiveIntEnvSchema,
    aiWindowSeconds: positiveIntEnvSchema,
    aiGlobalDailyLimit: positiveIntEnvSchema,
    demoLimit: positiveIntEnvSchema,
    demoWindowSeconds: positiveIntEnvSchema,
    publicReportLimit: positiveIntEnvSchema,
    publicReportWindowSeconds: positiveIntEnvSchema,
});

type ParsedRateLimitEnv = z.infer<typeof rateLimitEnvSchema>;

let cachedEnv: ParsedRateLimitEnv | null = null;
let warnedInMemory = false;

function parseRateLimitEnv(): ParsedRateLimitEnv {
    const nodeEnv = process.env.NODE_ENV ?? "development";
    const isProduction = nodeEnv === "production";
    const isTest = nodeEnv === "test";

    const providerInput = process.env.RATE_LIMIT_PROVIDER?.trim();
    const provider =
        providerInput && rateLimitProviderSchema.safeParse(providerInput).success
            ? (providerInput as ParsedRateLimitEnv["provider"])
            : isProduction
              ? "redis"
              : "memory";

    const parsed = rateLimitEnvSchema.parse({
        provider,
        bypassMode: process.env.RATE_LIMIT_BYPASS_MODE?.trim() || "disabled",
        redisUrl: process.env.RATE_LIMIT_REDIS_URL?.trim(),
        redisToken: process.env.RATE_LIMIT_REDIS_TOKEN?.trim(),
        hashSecret:
            process.env.RATE_LIMIT_HASH_SECRET?.trim() ||
            process.env.PDF_RENDER_SECRET?.trim(),
        trustProxyHeaders: process.env.RATE_LIMIT_TRUST_PROXY_HEADERS,
        loginIpLimit: process.env.RATE_LIMIT_LOGIN_IP_LIMIT,
        loginIpWindowSeconds: process.env.RATE_LIMIT_LOGIN_IP_WINDOW_SECONDS,
        loginAccountLimit: process.env.RATE_LIMIT_LOGIN_ACCOUNT_LIMIT,
        loginAccountWindowSeconds: process.env.RATE_LIMIT_LOGIN_ACCOUNT_WINDOW_SECONDS,
        auditStartLimit: process.env.RATE_LIMIT_AUDIT_START_LIMIT,
        auditStartWindowSeconds: process.env.RATE_LIMIT_AUDIT_START_WINDOW_SECONDS,
        pagespeedLimit: process.env.RATE_LIMIT_PAGESPEED_LIMIT,
        pagespeedWindowSeconds: process.env.RATE_LIMIT_PAGESPEED_WINDOW_SECONDS,
        pagespeedGlobalDailyLimit: process.env.RATE_LIMIT_PAGESPEED_GLOBAL_DAILY_LIMIT,
        aiLimit: process.env.RATE_LIMIT_AI_LIMIT,
        aiWindowSeconds: process.env.RATE_LIMIT_AI_WINDOW_SECONDS,
        aiGlobalDailyLimit: process.env.RATE_LIMIT_AI_GLOBAL_DAILY_LIMIT,
        demoLimit: process.env.RATE_LIMIT_DEMO_LIMIT,
        demoWindowSeconds: process.env.RATE_LIMIT_DEMO_WINDOW_SECONDS,
        publicReportLimit: process.env.RATE_LIMIT_PUBLIC_REPORT_LIMIT,
        publicReportWindowSeconds: process.env.RATE_LIMIT_PUBLIC_REPORT_WINDOW_SECONDS,
    });

    if (isProduction) {
        if (parsed.provider === "memory" || parsed.provider === "noop") {
            throw new Error(
                "Production requires a distributed rate-limit provider (redis).",
            );
        }
        if (!parsed.redisUrl || !parsed.redisToken) {
            throw new Error(
                "Production rate limiting requires RATE_LIMIT_REDIS_URL and RATE_LIMIT_REDIS_TOKEN.",
            );
        }
        if (!parsed.hashSecret) {
            throw new Error("Production rate limiting requires RATE_LIMIT_HASH_SECRET.");
        }
        if (parsed.bypassMode !== "disabled") {
            throw new Error("RATE_LIMIT_BYPASS_MODE must be disabled in production.");
        }
    }

    if (!isProduction && !isTest && parsed.provider === "memory" && !warnedInMemory) {
        warnedInMemory = true;
        console.warn(
            "[rate-limit] Using in-memory provider. Configure RATE_LIMIT_PROVIDER=redis for distributed limits.",
        );
    }

    return parsed;
}

export function getRateLimitEnv(): ParsedRateLimitEnv {
    if (!cachedEnv) {
        cachedEnv = parseRateLimitEnv();
    }
    return cachedEnv;
}

export function resetRateLimitEnvCacheForTests(): void {
    cachedEnv = null;
    warnedInMemory = false;
}

export function getRateLimitHashSecret(): string {
    const nodeEnv = process.env.NODE_ENV ?? "development";
    const isTest = nodeEnv === "test";
    const env = getRateLimitEnv();
    if (!env.hashSecret) {
        if (isTest) {
            return "rate-limit-test-secret";
        }
        return "rate-limit-development-secret";
    }
    return env.hashSecret;
}

export function isRateLimitBypassActive(): boolean {
    const nodeEnv = process.env.NODE_ENV ?? "development";
    const isProduction = nodeEnv === "production";
    const isTest = nodeEnv === "test";
    const env = getRateLimitEnv();
    if (env.bypassMode === "disabled") {
        return false;
    }
    if (env.bypassMode === "test" && isTest) {
        return true;
    }
    if (env.bypassMode === "development" && !isProduction && !isTest) {
        return true;
    }
    return false;
}

export function getRateLimitRedisConfig(): { url: string; token: string } | null {
    const env = getRateLimitEnv();
    if (!env.redisUrl || !env.redisToken) {
        return null;
    }
    return { url: env.redisUrl, token: env.redisToken };
}
