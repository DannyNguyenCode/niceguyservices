import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { getDemoAssetsForProject } from "@/src/data/demo-assets";
import {
    createDemoGeneration,
    failDemoGeneration,
    getDemoGenerationById,
    hasActiveDemoGeneration,
    completeDemoGeneration,
    updateDemoGenerationStatus,
} from "@/src/data/demo-generations";
import { getDemoProjectById, updateDemoProject } from "@/src/data/demo-projects";
import { getPublicReportById } from "@/src/data/public-reports";
import { getWebsiteById, updateWebsiteDemoProjectSummary } from "@/src/data/websites";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { buildDemoSpec } from "@/src/services/demo/build-demo-spec";
import { evaluateDemoReadiness } from "@/src/services/demo/get-demo-readiness";
import { getDemoPreviewBaseUrl } from "@/src/services/demo/env";
import { getDemoGenerationProvider } from "@/src/services/demo/providers/get-demo-provider";
import { prepareDemoWorkspace } from "@/src/services/demo/prepare-demo-workspace";
import { validateDemoBuild } from "@/src/services/demo/validate-demo-build";
import { DEMO_GENERATION_USER_PROMPT_V1 } from "@/src/prompts/demo-generation-system-v1";
import { buildDemoGenerationUserPrompt } from "@/src/prompts/demo-generation-user-v1";
import type { SerializableDemoGeneration } from "@/src/services/demo/types";
import {
    calculateDemoGenerationCost,
    enforceAdministratorActionRateLimit,
} from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";

export type GenerateDemoProjectResult =
    | { success: true; generation: SerializableDemoGeneration }
    | { success: false; error: { code: string; message: string }; generation?: SerializableDemoGeneration };

export async function generateDemoProject(
    input: {
        demoProjectId: string;
        forceRegenerate?: boolean;
    } & RateLimitedServiceOptions,
): Promise<GenerateDemoProjectResult> {
    if (!input.demoProjectId?.trim()) {
        return {
            success: false,
            error: { code: "DEMO_INVALID_PROJECT_ID", message: "Invalid demo project ID." },
        };
    }

    const project = await getDemoProjectById(input.demoProjectId);
    if (!project) {
        return {
            success: false,
            error: { code: "DEMO_PROJECT_NOT_FOUND", message: "Demo project not found." },
        };
    }

    const website = await getWebsiteById(project.websiteId);
    if (!website || website.deletedAt) {
        return {
            success: false,
            error: { code: "DEMO_WEBSITE_NOT_FOUND", message: "Website not found." },
        };
    }

    const report = await getPublicReportById(project.publicReportId);
    if (!report) {
        return {
            success: false,
            error: { code: "DEMO_REPORT_NOT_FOUND", message: "Public report not found." },
        };
    }

    const checksum = calculateSnapshotChecksum(report);
    if (checksum !== project.source.snapshotChecksum) {
        return {
            success: false,
            error: {
                code: "DEMO_SOURCE_CHECKSUM_MISMATCH",
                message: "Saved public-report checksum does not match the demo source.",
            },
        };
    }

    const active = await hasActiveDemoGeneration(project.id);
    if (active && !input.forceRegenerate) {
        return {
            success: false,
            error: {
                code: "DEMO_ALREADY_RUNNING",
                message: "Demo generation is already running for this project.",
            },
        };
    }

    const readiness = evaluateDemoReadiness({
        report,
        websiteActive: !website.deletedAt,
        selectedPages: project.configuration.pages,
        contentPolicySelected: Boolean(project.contentPolicy.mode),
        activeGeneration: active,
    });
    if (!readiness.canGenerate) {
        return {
            success: false,
            error: {
                code: readiness.blockers[0]?.code ?? "DEMO_SOURCE_INCOMPLETE",
                message: readiness.blockers[0]?.message ?? "Demo cannot be generated.",
            },
        };
    }

    await enforceAdministratorActionRateLimit({
        policyId: "demo-generate",
        websiteId: project.websiteId,
        cost: calculateDemoGenerationCost(project.configuration.pages.length),
        administratorIdentity: input.administratorIdentity,
        internalWorker: input.internalWorker,
    });

    const provider = getDemoGenerationProvider();
    const generation = await createDemoGeneration({
        demoProjectId: project.id,
        websiteId: project.websiteId,
        publicReportId: project.publicReportId,
        source: {
            snapshotChecksum: project.source.snapshotChecksum,
            publicReportRevision: project.source.publicReportRevision,
            heroSuggestionIds: project.source.heroSuggestionIds,
            screenshotIds: project.source.screenshotIds,
        },
        providerName: provider.name,
    });

    await updateDemoProject(project.id, {
        status: "generating",
        currentGenerationId: generation.id,
    });
    await updateWebsiteDemoProjectSummary(project.websiteId, "generating", new Date());

    await createActivityLog({
        websiteId: project.websiteId,
        type: "demo-generation-queued",
        description: "Demo generation queued.",
        metadata: {
            demoProjectId: project.id,
            demoGenerationId: generation.id,
            publicReportId: project.publicReportId,
            publicReportRevision: project.source.publicReportRevision,
            provider: provider.name,
        },
    });

    const startedAt = new Date();
    await updateDemoGenerationStatus(generation.id, "preparing", { startedAt });

    const workspace = prepareDemoWorkspace({
        demoProjectId: project.id,
        generationId: generation.id,
    });

    const assets = await getDemoAssetsForProject(project.id);
    const specification = buildDemoSpec({
        project,
        report,
        assets,
        businessFacts: {
            phone: website.businessEmail ? null : null,
            email: website.businessEmail || null,
            services: null,
        },
    });

    const instructions = `${DEMO_GENERATION_USER_PROMPT_V1}\n\n${buildDemoGenerationUserPrompt({
        demoProjectId: project.id,
        generationId: generation.id,
        publicReportRevision: project.source.publicReportRevision,
    })}`;

    try {
        await updateDemoGenerationStatus(generation.id, "generating", {
            workspace: {
                repository: workspace.repository,
                branch: workspace.branch,
                outputPath: null,
                commitSha: null,
            },
        });

        await createActivityLog({
            websiteId: project.websiteId,
            type: "demo-generation-started",
            description: "Demo generation started.",
            metadata: {
                demoProjectId: project.id,
                demoGenerationId: generation.id,
                provider: provider.name,
                branch: workspace.branch,
            },
        });

        const providerResult = await provider.generateDemo({
            specification,
            workspace,
            instructions,
            generationId: generation.id,
            demoProjectId: project.id,
        });

        await updateDemoGenerationStatus(generation.id, "validating");

        const validation = validateDemoBuild({
            files: providerResult.files,
            requiredPages: project.configuration.pages,
        });

        const previewUrl = project.previewPath
            ? `${getDemoPreviewBaseUrl()}${project.previewPath}`
            : null;

        if (!validation.passed) {
            const failed = await failDemoGeneration(generation.id, {
                errorCode: validation.errors[0]?.code ?? "DEMO_BUILD_FAILED",
                errorMessage: validation.errors[0]?.message ?? "Demo validation failed.",
                durationMs: providerResult.durationMs,
            });
            await updateDemoProject(project.id, { status: "draft" });
            await updateWebsiteDemoProjectSummary(project.websiteId, "draft", new Date());
            await createActivityLog({
                websiteId: project.websiteId,
                type: "demo-generation-failed",
                description: "Demo generation failed validation.",
                metadata: {
                    demoProjectId: project.id,
                    demoGenerationId: generation.id,
                    errorCount: validation.errors.length,
                    warningCount: validation.warnings.length,
                },
            });
            return {
                success: false,
                error: {
                    code: validation.errors[0]?.code ?? "DEMO_BUILD_FAILED",
                    message: validation.errors[0]?.message ?? "Demo validation failed.",
                },
                generation: failed ?? undefined,
            };
        }

        const completed = await completeDemoGeneration(generation.id, {
            durationMs: providerResult.durationMs,
            validation,
            workspace: {
                repository: workspace.repository,
                branch: providerResult.branch ?? workspace.branch,
                commitSha: providerResult.commitSha ?? null,
                outputPath: providerResult.outputPath ?? null,
            },
            provider: {
                providerRequestId: providerResult.providerRequestId ?? null,
            },
            output: {
                framework: "nextjs",
                packageManager: "npm",
                pagesGenerated: providerResult.pagesGenerated,
                componentsGenerated: providerResult.componentsGenerated,
                filesChanged: providerResult.filesChanged,
                previewUrl,
                buildStatus: validation.buildStatus,
                buildOutput: validation.buildOutput,
            },
        });

        await updateDemoProject(project.id, { status: "review" });
        await updateWebsiteDemoProjectSummary(project.websiteId, "review", new Date());

        await createActivityLog({
            websiteId: project.websiteId,
            type: "demo-generation-completed",
            description: "Demo generation completed and is ready for review.",
            metadata: {
                demoProjectId: project.id,
                demoGenerationId: generation.id,
                provider: provider.name,
                branch: providerResult.branch ?? workspace.branch,
                commitSha: providerResult.commitSha ?? null,
                pagesGenerated: providerResult.pagesGenerated,
                filesChangedCount: providerResult.filesChanged.length,
                warningCount: validation.warnings.length,
                durationMs: providerResult.durationMs,
            },
        });

        return {
            success: true,
            generation: completed ?? (await getDemoGenerationById(generation.id))!,
        };
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Demo generation failed unexpectedly.";
        const code = message.includes("DEMO_PROVIDER_NOT_CONFIGURED")
            ? "DEMO_PROVIDER_NOT_CONFIGURED"
            : "DEMO_PROVIDER_FAILED";
        const failed = await failDemoGeneration(generation.id, {
            errorCode: code,
            errorMessage: "Demo generation failed.",
            durationMs: Date.now() - startedAt.getTime(),
        });
        await updateDemoProject(project.id, { status: "draft" });
        await updateWebsiteDemoProjectSummary(project.websiteId, "draft", new Date());
        await createActivityLog({
            websiteId: project.websiteId,
            type: "demo-generation-failed",
            description: "Demo generation failed.",
            metadata: {
                demoProjectId: project.id,
                demoGenerationId: generation.id,
                errorCode: code,
            },
        });
        return {
            success: false,
            error: { code, message },
            generation: failed ?? undefined,
        };
    }
}
