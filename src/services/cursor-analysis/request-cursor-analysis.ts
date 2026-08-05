import "server-only";

import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { ACTIVITY_EVENTS } from "@/src/constants/activity-events";
import {
    completeAuditRunAnalysis,
    createAnalysisRequestId,
    getAuditRunAnalysis,
    isActiveAuditRunAnalysis,
    markAuditRunAnalysisFailed,
    markAuditRunAnalysisTriggered,
    markAuditRunAnalysisValidating,
    queueAuditRunAnalysis,
    recordPackageAccess,
} from "@/src/data/audit-run-analysis";
import { getAuditRunById } from "@/src/data/audit-runs";
import { getWebsiteById, updateWebsiteAiAnalysisStatus } from "@/src/data/websites";
import { loadAuditRunResources } from "@/src/services/audit-history/load-audit-run-resources";
import {
    authenticateAnalysisCallback,
    createCallbackAuthTokenForRequest,
    validateCallbackTokenAgainstAnalysis,
} from "@/src/services/cursor-analysis/callback-auth";
import { buildCursorAuditPackage } from "@/src/services/cursor-analysis/build-cursor-audit-package";
import {
    getCursorAnalysisConfig,
    isPublicUrlReachableForCursor,
} from "@/src/services/cursor-analysis/config";
import {
    CURSOR_ANALYSIS_PROVIDER,
    PACKAGE_ACCESS_STATUSES,
} from "@/src/services/cursor-analysis/constants";
import { logAnalysisError, logAnalysisEvent } from "@/src/services/cursor-analysis/logging";
import {
    buildAnalysisCallbackUrl,
    buildSignedPackageUrl,
} from "@/src/services/cursor-analysis/package-token";
import { shouldUseVercelProtectionBypass } from "@/src/services/cursor-analysis/vercel-automation-bypass";
import { resolveAuditAnalysisProvider } from "@/src/services/cursor-analysis/providers/get-analysis-provider";
import {
    calculateCursorAnalysisReadiness,
    type AnalysisReadiness,
} from "@/src/services/cursor-analysis/readiness";
import {
    formatCursorResultValidationError,
    safeValidateCursorAuditResult,
    type CursorAuditResult,
} from "@/src/services/cursor-analysis/schemas";

export type RequestCursorAnalysisResult =
    | { ok: true; auditRunId: string; analysisRequestId: string; status: string }
    | {
          ok: false;
          code: string;
          message: string;
          blockers?: AnalysisReadiness["blockers"];
          missing?: string[];
      };

export async function requestCursorAnalysisForAuditRun(
    auditRunId: string,
): Promise<RequestCursorAnalysisResult> {
    const config = getCursorAnalysisConfig();
    const providerResolution = resolveAuditAnalysisProvider();
    if (!providerResolution.ok) {
        return {
            ok: false,
            code: providerResolution.code,
            message: providerResolution.message,
            missing: providerResolution.missing,
        };
    }
    const provider = providerResolution.provider;

    if (!isPublicUrlReachableForCursor(config.publicAppUrl)) {
        return {
            ok: false,
            code: "PUBLIC_URL_UNREACHABLE",
            message:
                "APP_PUBLIC_URL must be a publicly reachable HTTPS URL before triggering Cursor analysis.",
        };
    }

    const auditRun = await getAuditRunById(auditRunId);
    if (!auditRun) {
        return { ok: false, code: "NOT_FOUND", message: "Audit run not found." };
    }

    const website = await getWebsiteById(auditRun.websiteId);
    if (!website) {
        return { ok: false, code: "NOT_FOUND", message: "Website not found." };
    }

    const currentAnalysis = auditRun.analysis ?? (await getAuditRunAnalysis(auditRunId));
    if (currentAnalysis && isActiveAuditRunAnalysis(currentAnalysis.status)) {
        return {
            ok: false,
            code: "ANALYSIS_ALREADY_ACTIVE",
            message: "An analysis job is already in progress for this audit.",
        };
    }

    if (currentAnalysis && currentAnalysis.attempt >= config.maxAttempts) {
        return {
            ok: false,
            code: "RETRY_LIMIT_REACHED",
            message: "Maximum analysis attempts reached for this audit.",
        };
    }

    if (
        currentAnalysis &&
        currentAnalysis.status !== "not_started" &&
        currentAnalysis.status !== "retry_pending"
    ) {
        return {
            ok: false,
            code: "ANALYSIS_NOT_RETRYABLE",
            message: "Analysis can only be triggered from not_started or retry_pending status.",
        };
    }

    const resources = await loadAuditRunResources({
        websiteId: auditRun.websiteId,
        auditRunId,
    });
    if (!resources) {
        return { ok: false, code: "NOT_FOUND", message: "Audit resources not found." };
    }

    const readiness = calculateCursorAnalysisReadiness({
        auditId: auditRunId,
        auditedUrl: auditRun.source.websiteUrl,
        website,
        crawl: resources.crawl,
        screenshots: resources.screenshots,
        pageSpeed: resources.pageSpeed,
        niceGuy: resources.niceGuy,
    });

    if (!readiness.ready) {
        logAnalysisEvent("readiness_failed", { auditId: auditRunId }, readiness.blockers[0]?.code);
        return {
            ok: false,
            code: "AUDIT_NOT_READY",
            message: "Audit data is incomplete for Cursor analysis.",
            blockers: readiness.blockers,
            missing: readiness.blockers.map((item) => item.field ?? item.code),
        };
    }

    const analysisRequestId = createAnalysisRequestId();
    const attempt = (currentAnalysis?.attempt ?? 0) + 1;

    try {
        buildCursorAuditPackage({
            auditRun,
            website,
            crawl: resources.crawl,
            screenshots: resources.screenshots,
            pageSpeed: resources.pageSpeed,
            niceGuy: resources.niceGuy,
            analysisRequestId,
        });
    } catch (error) {
        return {
            ok: false,
            code: "PACKAGE_BUILD_FAILED",
            message: error instanceof Error ? error.message : "Unable to build audit package.",
        };
    }

    await queueAuditRunAnalysis({
        auditRunId,
        analysisRequestId,
        provider: provider.name,
        attempt,
        promptVersion: config.promptVersion,
        packageVersion: config.packageVersion,
    });

    logAnalysisEvent("analysis_queued", {
        auditId: auditRunId,
        analysisRequestId,
        provider: provider.name,
        packageVersion: config.packageVersion,
        promptVersion: config.promptVersion,
        attempt,
        status: "queued",
    });

    await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "queued");

    await createActivityEvent({
        websiteId: auditRun.websiteId,
        auditRunId,
        eventType: ACTIVITY_EVENTS.AI_ANALYSIS_QUEUED,
        title: "Cursor analysis requested",
        description: `Analysis request ${analysisRequestId} queued (attempt ${attempt}).`,
        actor: { type: "administrator" },
        metadata: {
            analysisRequestId,
            attempt,
            provider: provider.name,
        },
    });

    const packageUrl = buildSignedPackageUrl({
        auditId: auditRunId,
        analysisRequestId,
        publicBaseUrl: config.publicAppUrl!,
    });
    const callbackUrl = buildAnalysisCallbackUrl({
        auditId: auditRunId,
        publicBaseUrl: config.publicAppUrl!,
    });

    const callbackAuthToken = createCallbackAuthTokenForRequest({
        auditId: auditRunId,
        analysisRequestId,
    });

    const trigger = await provider.triggerAnalysis({
        auditId: auditRunId,
        analysisRequestId,
        packageUrl,
        callbackUrl,
        callbackAuthHeader: config.callbackHeader,
        callbackAuthToken,
        promptVersion: config.promptVersion,
        packageVersion: config.packageVersion,
    });

    if (!trigger.accepted) {
        await markAuditRunAnalysisFailed({
            auditRunId,
            analysisRequestId,
            error: trigger.error ?? "Cursor webhook rejected the request.",
            errorCode: trigger.errorCode ?? "TRIGGER_FAILED",
            preserveForRetry: attempt < config.maxAttempts,
        });
        await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "failed");
        logAnalysisError(
            "trigger_failed",
            {
                auditId: auditRunId,
                analysisRequestId,
                provider: provider.name,
                errorCode: trigger.errorCode ?? "TRIGGER_FAILED",
            },
            trigger.error,
        );
        await createActivityEvent({
            websiteId: auditRun.websiteId,
            auditRunId,
            eventType: ACTIVITY_EVENTS.AI_ANALYSIS_FAILED,
            title: "Cursor analysis trigger failed",
            description: trigger.error ?? "Cursor webhook rejected the request.",
            severity: "error",
            actor: { type: "system" },
            metadata: { analysisRequestId, attempt },
        });
        return {
            ok: false,
            code: trigger.errorCode ?? "TRIGGER_FAILED",
            message: trigger.error ?? "Cursor webhook rejected the request.",
        };
    }

    await markAuditRunAnalysisTriggered({
        auditRunId,
        analysisRequestId,
        externalJobId: trigger.externalJobId ?? null,
    });
    await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "processing");

    logAnalysisEvent("analysis_triggered", {
        auditId: auditRunId,
        analysisRequestId,
        provider: provider.name,
        status: "triggered",
        attempt,
        vercelProtectionBypass: shouldUseVercelProtectionBypass(),
    });

    await createActivityEvent({
        websiteId: auditRun.websiteId,
        auditRunId,
        eventType: ACTIVITY_EVENTS.AI_ANALYSIS_STARTED,
        title: "Cursor analysis triggered",
        description: `Cursor accepted analysis request ${analysisRequestId}.`,
        actor: { type: "system" },
        metadata: {
            analysisRequestId,
            attempt,
            externalJobId: trigger.externalJobId ?? null,
        },
    });

    return {
        ok: true,
        auditRunId,
        analysisRequestId,
        status: "triggered",
    };
}

export type HandleAnalysisCallbackResult =
    | { ok: true; status: "completed" | "duplicate" }
    | { ok: false; code: string; message: string; status: number };

export async function handleCursorAnalysisCallback(input: {
    auditRunId: string;
    providedToken: string | null;
    body: unknown;
}): Promise<HandleAnalysisCallbackResult> {
    const bodyRecord =
        input.body && typeof input.body === "object"
            ? (input.body as Record<string, unknown>)
            : null;
    const bodyAnalysisRequestId =
        typeof bodyRecord?.analysisRequestId === "string"
            ? bodyRecord.analysisRequestId
            : undefined;

    const auth = authenticateAnalysisCallback({
        providedToken: input.providedToken,
        auditId: input.auditRunId,
        bodyAnalysisRequestId,
    });
    if (!auth.ok) {
        return {
            ok: false,
            code: auth.code,
            message: auth.message,
            status: 401,
        };
    }

    const auditRun = await getAuditRunById(input.auditRunId);
    if (!auditRun) {
        return { ok: false, code: "NOT_FOUND", message: "Audit not found.", status: 404 };
    }

    const analysis = auditRun.analysis ?? (await getAuditRunAnalysis(input.auditRunId));
    const tokenMatch = validateCallbackTokenAgainstAnalysis({
        tokenPayload: auth.payload,
        activeAnalysisRequestId: analysis?.analysisRequestId ?? null,
        status: analysis?.status ?? "not_started",
        hasExistingResult: Boolean(analysis?.result),
    });

    if (!tokenMatch.ok) {
        const status =
            tokenMatch.code === "NO_ACTIVE_REQUEST" || tokenMatch.code === "STALE_CALLBACK"
                ? 409
                : tokenMatch.code === "CALLBACK_TOKEN_REUSED"
                  ? 409
                  : 401;
        return {
            ok: false,
            code: tokenMatch.code,
            message: tokenMatch.message,
            status,
        };
    }

    if (tokenMatch.kind === "duplicate") {
        return { ok: true, status: "duplicate" };
    }

    if (!analysis?.analysisRequestId) {
        return {
            ok: false,
            code: "NO_ACTIVE_REQUEST",
            message: "No analysis request is registered for this audit.",
            status: 409,
        };
    }

    logAnalysisEvent("callback_received", {
        auditId: input.auditRunId,
        analysisRequestId: analysis.analysisRequestId,
        status: analysis.status,
    });

    const parsed = safeValidateCursorAuditResult(input.body);
    if (!parsed.success) {
        const validationMessage = formatCursorResultValidationError(parsed.error);
        await markAuditRunAnalysisFailed({
            auditRunId: input.auditRunId,
            analysisRequestId: analysis.analysisRequestId,
            error: validationMessage,
            errorCode: "INVALID_RESULT",
            preserveForRetry: analysis.attempt < getCursorAnalysisConfig().maxAttempts,
        });
        await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "failed");
        logAnalysisError(
            "callback_validation_failed",
            {
                auditId: input.auditRunId,
                analysisRequestId: analysis.analysisRequestId,
                errorCode: "INVALID_RESULT",
            },
            validationMessage,
        );
        await createActivityEvent({
            websiteId: auditRun.websiteId,
            auditRunId: input.auditRunId,
            eventType: ACTIVITY_EVENTS.AI_ANALYSIS_FAILED,
            title: "Cursor analysis validation failed",
            description: "Callback payload did not match the expected result schema.",
            severity: "error",
            actor: { type: "system" },
            metadata: { analysisRequestId: analysis.analysisRequestId },
        });
        return {
            ok: false,
            code: "INVALID_RESULT",
            message: validationMessage,
            status: 422,
        };
    }

    const result = parsed.data;
    if (result.auditId !== input.auditRunId) {
        return {
            ok: false,
            code: "AUDIT_ID_MISMATCH",
            message: "Result audit ID does not match route audit ID.",
            status: 409,
        };
    }

    if (result.analysisRequestId !== analysis.analysisRequestId) {
        return {
            ok: false,
            code: "STALE_CALLBACK",
            message: "Callback belongs to a previous analysis attempt.",
            status: 409,
        };
    }

    const validating = await markAuditRunAnalysisValidating({
        auditRunId: input.auditRunId,
        analysisRequestId: analysis.analysisRequestId,
    });
    if (!validating && analysis.status !== "validating") {
        return {
            ok: false,
            code: "STALE_CALLBACK",
            message: "Callback is not valid for the current analysis state.",
            status: 409,
        };
    }

    const sanitized = sanitizeCursorAuditResult(result);
    const completed = await completeAuditRunAnalysis({
        auditRunId: input.auditRunId,
        analysisRequestId: analysis.analysisRequestId,
        result: sanitized,
    });

    if (!completed) {
        return {
            ok: false,
            code: "STATE_CONFLICT",
            message: "Unable to save analysis result for the current attempt.",
            status: 409,
        };
    }

    await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "complete", new Date());

    logAnalysisEvent("analysis_completed", {
        auditId: input.auditRunId,
        analysisRequestId: analysis.analysisRequestId,
        status: "completed",
        provider: analysis.provider ?? undefined,
    });

    await createActivityEvent({
        websiteId: auditRun.websiteId,
        auditRunId: input.auditRunId,
        eventType: ACTIVITY_EVENTS.AI_ANALYSIS_COMPLETED,
        title: "Cursor analysis completed",
        description: `Analysis request ${analysis.analysisRequestId} completed successfully.`,
        actor: { type: "system" },
        metadata: {
            analysisRequestId: analysis.analysisRequestId,
            assessmentPriority: sanitized.assessment.priority,
        },
    });

    return { ok: true, status: "completed" };
}

function sanitizeCursorAuditResult(result: CursorAuditResult): CursorAuditResult {
    return {
        ...result,
        executiveSummary: result.executiveSummary.trim().slice(0, 8000),
        assessment: {
            ...result.assessment,
            summary: result.assessment.summary.trim().slice(0, 2000),
        },
        strengths: result.strengths.map((item) => ({
            ...item,
            title: item.title.trim().slice(0, 300),
            description: item.description.trim().slice(0, 4000),
            sources: item.sources.map((source) => source.trim().slice(0, 200)).slice(0, 5),
        })),
        issues: result.issues.map((item) => ({
            ...item,
            title: item.title.trim().slice(0, 300),
            description: item.description.trim().slice(0, 4000),
            recommendation: item.recommendation.trim().slice(0, 4000),
            category: item.category.trim().slice(0, 100),
            sources: item.sources.map((source) => source.trim().slice(0, 200)).slice(0, 5),
        })),
        limitations: result.limitations.map((item) => item.trim().slice(0, 1000)).slice(0, 10),
    };
}

export async function loadCursorAuditPackageForToken(input: {
    auditRunId: string;
    analysisRequestId: string;
}) {
    const auditRun = await getAuditRunById(input.auditRunId);
    if (!auditRun) return null;

    const analysis = auditRun.analysis ?? (await getAuditRunAnalysis(input.auditRunId));
    if (!analysis || analysis.analysisRequestId !== input.analysisRequestId) {
        return null;
    }

    if (!PACKAGE_ACCESS_STATUSES.includes(analysis.status)) {
        return null;
    }

    const website = await getWebsiteById(auditRun.websiteId);
    if (!website) return null;

    const resources = await loadAuditRunResources({
        websiteId: auditRun.websiteId,
        auditRunId: input.auditRunId,
    });
    if (!resources) return null;

    await recordPackageAccess({
        auditRunId: input.auditRunId,
        analysisRequestId: input.analysisRequestId,
    });

    logAnalysisEvent("package_accessed", {
        auditId: input.auditRunId,
        analysisRequestId: input.analysisRequestId,
        status: analysis.status,
        packageVersion: analysis.packageVersion,
    });

    return buildCursorAuditPackage({
        auditRun,
        website,
        crawl: resources.crawl,
        screenshots: resources.screenshots,
        pageSpeed: resources.pageSpeed,
        niceGuy: resources.niceGuy,
        analysisRequestId: input.analysisRequestId,
    });
}
