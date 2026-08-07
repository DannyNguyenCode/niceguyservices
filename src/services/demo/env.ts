import path from "node:path";
import { buildApplicationPath } from "@/src/lib/application-url";

export function getDemoWorkspaceRoot(): string {
    return process.env.DEMO_WORKSPACE_ROOT?.trim() || path.join(process.cwd(), "var", "demo-workspaces");
}

export function getDemoTemplateRepository(): string | null {
    const value = process.env.DEMO_TEMPLATE_REPO?.trim();
    return value || null;
}

export function getDemoGenerationProviderName(): string {
    return process.env.DEMO_GENERATION_PROVIDER?.trim() || "local";
}

export function isDemoProviderConfigured(): boolean {
    const provider = getDemoGenerationProviderName();
    if (provider === "local") {
        return Boolean(getDemoTemplateRepository() || getDemoWorkspaceRoot());
    }
    if (provider === "cursor-cloud-agent") {
        return Boolean(process.env.CURSOR_API_KEY?.trim() && getDemoTemplateRepository());
    }
    return false;
}

export function shouldRunDemoBuild(): boolean {
    return process.env.DEMO_RUN_BUILD === "true";
}

export function getDemoPreviewBaseUrl(): string {
    const configured = process.env.DEMO_PREVIEW_BASE_URL?.trim();
    if (configured) {
        return configured.replace(/\/$/, "");
    }
    return buildApplicationPath("").replace(/\/$/, "");
}
