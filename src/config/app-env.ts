import { z } from "zod";
import { assertProductionApplicationUrl } from "@/src/lib/application-url";
import { resolveAuthSecretForRuntime } from "@/src/lib/auth/auth-requirements";

const deploymentEnvironmentSchema = z.enum([
    "development",
    "test",
    "preview",
    "production",
]);

function resolveDeploymentEnvironment(): z.infer<typeof deploymentEnvironmentSchema> {
    const explicit = process.env.DEPLOYMENT_ENV?.trim().toLowerCase();
    if (explicit === "preview" || explicit === "staging") {
        return "preview";
    }
    if (explicit === "production") {
        return "production";
    }
    if (explicit === "test") {
        return "test";
    }

    const nodeEnv = process.env.NODE_ENV ?? "development";
    if (nodeEnv === "test") return "test";
    if (nodeEnv === "production") {
        if (process.env.VERCEL_ENV === "preview") {
            return "preview";
        }
        return "production";
    }
    return "development";
}

const optionalUrlSchema = z
    .string()
    .optional()
    .transform((value) => {
        const trimmed = value?.trim();
        return trimmed || undefined;
    });

const booleanFlagSchema = z
    .string()
    .optional()
    .transform((value) => {
        const normalized = value?.trim().toLowerCase();
        return normalized === "1" || normalized === "true" || normalized === "yes";
    });

const appEnvSchema = z.object({
    deploymentEnvironment: deploymentEnvironmentSchema,
    nodeEnv: z.string(),
    appUrl: optionalUrlSchema,
    publicAppUrl: optionalUrlSchema,
    appVersion: z.string().optional(),
    mongodbUri: z.string().optional(),
    mongodbDbName: z.string().optional(),
    authSecret: z.string().optional(),
    authUrl: optionalUrlSchema,
    cloudinaryCloudName: z.string().optional(),
    cloudinaryApiKey: z.string().optional(),
    cloudinaryApiSecret: z.string().optional(),
    pagespeedApiKey: z.string().optional(),
    aiProvider: z.string().optional(),
    aiApiKey: z.string().optional(),
    pdfRenderSecret: z.string().optional(),
    internalWorkerSecret: z.string().optional(),
    previewAllowProductionDatabase: booleanFlagSchema,
    auditCrawlEnabled: booleanFlagSchema,
    auditScreenshotEnabled: booleanFlagSchema,
    auditPageSpeedEnabled: booleanFlagSchema,
    auditAiEnabled: booleanFlagSchema,
    auditCloudinaryEnabled: booleanFlagSchema,
    auditEmailEnabled: booleanFlagSchema,
    auditSyncExecution: booleanFlagSchema,
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export type AuditOperationFlags = {
    crawlEnabled: boolean;
    screenshotEnabled: boolean;
    pageSpeedEnabled: boolean;
    aiGenerationEnabled: boolean;
    cloudinaryUploadsEnabled: boolean;
    emailSendingEnabled: boolean;
    syncExecution: boolean;
};

let cachedAppEnv: AppEnv | null = null;

const PLACEHOLDER_SECRETS = new Set([
    "",
    "your-pdf-render-secret",
    "your-rate-limit-hash-secret",
    "your-google-pagespeed-api-key",
    "your-ai-api-key",
    "your-openai-api-key",
    "your-cloudinary-cloud-name",
    "your-cloudinary-api-key",
    "your-cloudinary-api-secret",
    "your-auth-secret",
]);

const PRODUCTION_DB_NAME_PATTERNS = [/production/i, /_prod$/i, /-prod$/i];

function readSecret(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    if (!trimmed || PLACEHOLDER_SECRETS.has(trimmed)) {
        return undefined;
    }
    return trimmed;
}

function defaultAuditFlagsForEnvironment(
    deploymentEnvironment: AppEnv["deploymentEnvironment"],
): Pick<
    AppEnv,
    | "auditCrawlEnabled"
    | "auditScreenshotEnabled"
    | "auditPageSpeedEnabled"
    | "auditAiEnabled"
    | "auditCloudinaryEnabled"
    | "auditEmailEnabled"
    | "auditSyncExecution"
> {
    if (deploymentEnvironment === "production") {
        return {
            auditCrawlEnabled: true,
            auditScreenshotEnabled: true,
            auditPageSpeedEnabled: true,
            auditAiEnabled: true,
            auditCloudinaryEnabled: true,
            auditEmailEnabled: true,
            auditSyncExecution: false,
        };
    }

    if (deploymentEnvironment === "preview") {
        return {
            auditCrawlEnabled: false,
            auditScreenshotEnabled: false,
            auditPageSpeedEnabled: false,
            auditAiEnabled: false,
            auditCloudinaryEnabled: false,
            auditEmailEnabled: false,
            auditSyncExecution: false,
        };
    }

    return {
        auditCrawlEnabled: true,
        auditScreenshotEnabled: true,
        auditPageSpeedEnabled: true,
        auditAiEnabled: true,
        auditCloudinaryEnabled: true,
        auditEmailEnabled: false,
        auditSyncExecution: true,
    };
}

function parseAppEnv(): AppEnv {
    const deploymentEnvironment = resolveDeploymentEnvironment();
    const nodeEnv = process.env.NODE_ENV ?? "development";
    const defaults = defaultAuditFlagsForEnvironment(deploymentEnvironment);

    const parsed = appEnvSchema.parse({
        deploymentEnvironment,
        nodeEnv,
        appUrl: process.env.APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
        publicAppUrl: process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
        appVersion:
            process.env.APP_VERSION?.trim() ||
            process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
            process.env.npm_package_version?.trim(),
        mongodbUri: readSecret(process.env.MONGODB_URI),
        mongodbDbName: process.env.MONGODB_DB_NAME?.trim(),
        authSecret: resolveAuthSecretForRuntime(),
        authUrl: process.env.AUTH_URL,
        cloudinaryCloudName: readSecret(process.env.CLOUDINARY_CLOUD_NAME),
        cloudinaryApiKey: readSecret(process.env.CLOUDINARY_API_KEY),
        cloudinaryApiSecret: readSecret(process.env.CLOUDINARY_API_SECRET),
        pagespeedApiKey: readSecret(process.env.GOOGLE_PAGESPEED_API_KEY),
        aiProvider: process.env.AI_PROVIDER?.trim(),
        aiApiKey:
            readSecret(process.env.AI_API_KEY) ||
            readSecret(process.env.OPENAI_API_KEY) ||
            readSecret(process.env.ANTHROPIC_API_KEY),
        pdfRenderSecret: readSecret(process.env.PDF_RENDER_SECRET),
        internalWorkerSecret: readSecret(process.env.INTERNAL_WORKER_SECRET),
        previewAllowProductionDatabase: process.env.PREVIEW_ALLOW_PRODUCTION_DATABASE,
        auditCrawlEnabled: process.env.AUDIT_CRAWL_ENABLED ?? String(defaults.auditCrawlEnabled),
        auditScreenshotEnabled:
            process.env.AUDIT_SCREENSHOT_ENABLED ?? String(defaults.auditScreenshotEnabled),
        auditPageSpeedEnabled:
            process.env.AUDIT_PAGESPEED_ENABLED ?? String(defaults.auditPageSpeedEnabled),
        auditAiEnabled: process.env.AUDIT_AI_ENABLED ?? String(defaults.auditAiEnabled),
        auditCloudinaryEnabled:
            process.env.AUDIT_CLOUDINARY_ENABLED ?? String(defaults.auditCloudinaryEnabled),
        auditEmailEnabled: process.env.AUDIT_EMAIL_ENABLED ?? String(defaults.auditEmailEnabled),
        auditSyncExecution:
            process.env.AUDIT_SYNC_EXECUTION ?? String(defaults.auditSyncExecution),
    });

    if (deploymentEnvironment === "production") {
        validateProductionRequirements(parsed);
    }

    if (deploymentEnvironment === "preview") {
        validatePreviewRequirements(parsed);
    }

    return parsed;
}

function validateProductionRequirements(env: AppEnv): void {
    if (!env.mongodbUri) {
        throw new Error("Production requires MONGODB_URI.");
    }
    if (!env.mongodbDbName) {
        throw new Error("Production requires MONGODB_DB_NAME.");
    }
    if (!env.authSecret) {
        throw new Error("Production requires AUTH_SECRET.");
    }
    if (!env.appUrl && !env.publicAppUrl) {
        throw new Error("Production requires APP_URL or NEXT_PUBLIC_SITE_URL.");
    }
    if (!env.pdfRenderSecret) {
        throw new Error("Production requires PDF_RENDER_SECRET.");
    }
    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
        throw new Error("Production requires Cloudinary credentials.");
    }
    if (!env.pagespeedApiKey) {
        throw new Error("Production requires GOOGLE_PAGESPEED_API_KEY.");
    }
    if (!env.aiApiKey) {
        throw new Error("Production requires an AI API key.");
    }

    assertProductionApplicationUrl();
}

function validatePreviewRequirements(env: AppEnv): void {
    if (!env.mongodbUri) {
        throw new Error("Preview deployments require MONGODB_URI.");
    }
    if (!env.mongodbDbName) {
        throw new Error("Preview deployments require MONGODB_DB_NAME.");
    }
    if (!env.authSecret) {
        throw new Error("Preview deployments require AUTH_SECRET.");
    }

    const looksLikeProductionDb = PRODUCTION_DB_NAME_PATTERNS.some((pattern) =>
        pattern.test(env.mongodbDbName ?? ""),
    );
    if (looksLikeProductionDb && !env.previewAllowProductionDatabase) {
        throw new Error(
            "Preview deployments must not use production MongoDB collections unless PREVIEW_ALLOW_PRODUCTION_DATABASE is explicitly enabled.",
        );
    }
}

export function getAppEnv(): AppEnv {
    if (!cachedAppEnv) {
        cachedAppEnv = parseAppEnv();
    }
    return cachedAppEnv;
}

export function resetAppEnvCacheForTests(): void {
    cachedAppEnv = null;
}

export function getDeploymentEnvironment(): AppEnv["deploymentEnvironment"] {
    return getAppEnv().deploymentEnvironment;
}

export function getAppVersion(): string {
    return getAppEnv().appVersion ?? "unknown";
}

export function isProductionDeployment(): boolean {
    return getDeploymentEnvironment() === "production";
}

export function isPreviewDeployment(): boolean {
    return getDeploymentEnvironment() === "preview";
}

export function getAuditOperationFlags(): AuditOperationFlags {
    const env = getAppEnv();
    return {
        crawlEnabled: env.auditCrawlEnabled,
        screenshotEnabled: env.auditScreenshotEnabled,
        pageSpeedEnabled: env.auditPageSpeedEnabled,
        aiGenerationEnabled: env.auditAiEnabled,
        cloudinaryUploadsEnabled: env.auditCloudinaryEnabled,
        emailSendingEnabled: env.auditEmailEnabled,
        syncExecution: env.auditSyncExecution,
    };
}

export function getDisabledAuditOperationMessage(operation: keyof AuditOperationFlags): string {
    const labels: Record<keyof AuditOperationFlags, string> = {
        crawlEnabled: "Website crawling",
        screenshotEnabled: "Screenshot capture",
        pageSpeedEnabled: "Google PageSpeed analysis",
        aiGenerationEnabled: "AI analysis generation",
        cloudinaryUploadsEnabled: "Cloudinary uploads",
        emailSendingEnabled: "Outreach email sending",
        syncExecution: "Synchronous audit execution",
    };
    return `${labels[operation]} is disabled in this deployment environment.`;
}
