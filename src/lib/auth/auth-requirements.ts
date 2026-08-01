const PLACEHOLDER_SECRETS = new Set([
    "",
    "your-auth-secret",
]);

/** Documented development-only fallback; never accepted in preview or production. */
export const DEVELOPMENT_AUTH_SECRET_FALLBACK = "local-development-auth-secret-only";

export function isProtectedDeploymentEnvironment(): boolean {
    const explicit = process.env.DEPLOYMENT_ENV?.trim().toLowerCase();
    if (explicit === "preview" || explicit === "staging" || explicit === "production") {
        return true;
    }
    if (explicit === "development" || explicit === "test") {
        return false;
    }

    const nodeEnv = process.env.NODE_ENV ?? "development";
    if (nodeEnv === "test") {
        return false;
    }
    if (nodeEnv === "production") {
        return process.env.VERCEL_ENV !== "development";
    }
    return false;
}

export function isConfiguredAuthSecretValue(secret: string | undefined): boolean {
    const trimmed = secret?.trim();
    return Boolean(trimmed && !PLACEHOLDER_SECRETS.has(trimmed));
}

export function resolveAuthSecretForRuntime(): string | undefined {
    const configured = process.env.AUTH_SECRET?.trim();
    if (isConfiguredAuthSecretValue(configured)) {
        if (
            isProtectedDeploymentEnvironment() &&
            configured === DEVELOPMENT_AUTH_SECRET_FALLBACK
        ) {
            return undefined;
        }
        return configured;
    }

    if (!isProtectedDeploymentEnvironment() && configured === DEVELOPMENT_AUTH_SECRET_FALLBACK) {
        return configured;
    }

    if (
        !isProtectedDeploymentEnvironment() &&
        !configured &&
        process.env.NODE_ENV !== "test"
    ) {
        return DEVELOPMENT_AUTH_SECRET_FALLBACK;
    }

    return undefined;
}

export function isAuthenticationRequired(): boolean {
    return isProtectedDeploymentEnvironment() || Boolean(resolveAuthSecretForRuntime());
}

export function isAuthenticationConfigured(): boolean {
    return Boolean(resolveAuthSecretForRuntime());
}
