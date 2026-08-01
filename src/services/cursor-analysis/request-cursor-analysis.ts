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
} from "@/src/data/audit-run-analysis";
import { getAuditRunById } from "@/src/data/audit-runs";
import { getWebsiteById, updateWebsiteAiAnalysisStatus } from "@/src/data/websites";
import { loadAuditRunResources } from "@/src/services/audit-history/load-audit-run-resources";
import { buildCursorAuditPackage } from "@/src/services/cursor-analysis/build-cursor-audit-package";
import {
    assertCursorAnalysisConfigured,
    getCursorAnalysisConfig,
    isPublicUrlReachableForCursor,
} from "@/src/services/cursor-analysis/config";
import {
    CURSOR_ANALYSIS_PROVIDER,
    ACTIVE_CURSOR_ANALYSIS_STATUSES,
} from "@/src/services/cursor-analysis/constants";
import {
    buildAnalysisCallbackUrl,
    buildSignedPackageUrl,
} from "@/src/services/cursor-analysis/package-token";
import { getAuditAnalysisProvider } from "@/src/services/cursor-analysis/providers/get-analysis-provider";
import { calculateCursorAnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import {
    safeValidateCursorAuditResult,
    type CursorAuditResult,
} from "@/src/services/cursor-analysis/schemas";
import { timingSafeEqual } from "node:crypto";

export type RequestCursorAnalysisResult =
    | { ok: true; auditRunId: string; analysisRequestId: string; status: string }
    | { ok: false; code: string; message: string; missing?: string[] };

export async function requestCursorAnalysisForAuditRun(
    auditRunId: string,
): Promise<RequestCursorAnalysisResult> {
    assertCursorAnalysisConfigured();
    const config = getCursorAnalysisConfig();
    const provider = getAuditAnalysisProvider();
    if (!provider) {
        return {
            ok: false,
            code: "PROVIDER_NOT_CONFIGURED",
            message: "Cursor automation provider is not enabled.",
        };
    }

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

    const resources = await loadAuditRunResources({
        websiteId: auditRun.websiteId,
        auditRunId,
    });
    if (!resources) {
        return { ok: false, code: "NOT_FOUND", message: "Audit resources not found." };
    }

    const readiness = calculateCursorAnalysisReadiness({
        auditId: auditRunId,
        website,
        crawl: resources.crawl,
        screenshots: resources.screenshots,
        pageSpeed: resources.pageSpeed,
        niceGuy: resources.niceGuy,
    });

    if (!readiness.ready) {
        return {
            ok: false,
            code: "AUDIT_NOT_READY",
            message: "Audit data is incomplete for Cursor analysis.",
            missing: readiness.missing,
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
        provider: CURSOR_ANALYSIS_PROVIDER,
        attempt,
        promptVersion: config.promptVersion,
        packageVersion: config.packageVersion,
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
            provider: CURSOR_ANALYSIS_PROVIDER,
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

    const trigger = await provider.requestAnalysis({
        auditId: auditRunId,
        analysisRequestId,
        packageUrl,
        callbackUrl,
    });

    if (!trigger.accepted) {
        await markAuditRunAnalysisFailed({
            auditRunId,
            analysisRequestId,
            error: trigger.error ?? "Cursor webhook rejected the request.",
            preserveForRetry: attempt < config.maxAttempts,
        });
        await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "failed");
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
            code: "TRIGGER_FAILED",
            message: trigger.error ?? "Cursor webhook rejected the request.",
        };
    }

    await markAuditRunAnalysisTriggered({
        auditRunId,
        analysisRequestId,
        externalJobId: trigger.externalJobId ?? null,
    });
    await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "processing");

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

function verifyCallbackSecret(provided: string | null): boolean {
    const expected = getCursorAnalysisConfig().callbackSecret;
    if (!expected || !provided) return false;
    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);
    if (providedBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(providedBuffer, expectedBuffer);
}

export type HandleAnalysisCallbackResult =
    | { ok: true; status: "completed" | "duplicate" }
    | { ok: false; code: string; message: string; status: number };

export async function handleCursorAnalysisCallback(input: {
    auditRunId: string;
    providedSecret: string | null;
    body: unknown;
}): Promise<HandleAnalysisCallbackResult> {
    if (!verifyCallbackSecret(input.providedSecret)) {
        return {
            ok: false,
            code: "UNAUTHORIZED",
            message: "Invalid callback secret.",
            status: 401,
        };
    }

    const auditRun = await getAuditRunById(input.auditRunId);
    if (!auditRun) {
        return { ok: false, code: "NOT_FOUND", message: "Audit not found.", status: 404 };
    }

    const analysis = auditRun.analysis ?? (await getAuditRunAnalysis(input.auditRunId));
    if (!analysis?.analysisRequestId) {
        return {
            ok: false,
            code: "NO_ACTIVE_REQUEST",
            message: "No analysis request is registered for this audit.",
            status: 409,
        };
    }

    const parsed = safeValidateCursorAuditResult(input.body);
    if (!parsed.success) {
        await markAuditRunAnalysisFailed({
            auditRunId: input.auditRunId,
            analysisRequestId: analysis.analysisRequestId,
            error: "Result schema validation failed.",
            preserveForRetry: analysis.attempt < getCursorAnalysisConfig().maxAttempts,
        });
        await updateWebsiteAiAnalysisStatus(auditRun.websiteId, "failed");
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
            message: "Result schema validation failed.",
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

    if (analysis.status === "completed" && analysis.result) {
        return { ok: true, status: "duplicate" };
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

    await createActivityEvent({
        websiteId: auditRun.websiteId,
        auditRunId: input.auditRunId,
        eventType: ACTIVITY_EVENTS.AI_ANALYSIS_COMPLETED,
        title: "Cursor analysis completed",
        description: `Analysis request ${analysis.analysisRequestId} completed successfully.`,
        actor: { type: "system" },
        metadata: {
            analysisRequestId: analysis.analysisRequestId,
            overallScore: sanitized.overallScore,
        },
    });

    return { ok: true, status: "completed" };
}

function sanitizeCursorAuditResult(result: CursorAuditResult): CursorAuditResult {
    return {
        ...result,
        executiveSummary: result.executiveSummary.trim().slice(0, 8000),
        strengths: result.strengths.map((item) => ({
            ...item,
            title: item.title.trim().slice(0, 300),
            evidence: item.evidence.trim().slice(0, 4000),
        })),
        issues: result.issues.map((item) => ({
            ...item,
            title: item.title.trim().slice(0, 300),
            evidence: item.evidence.trim().slice(0, 4000),
            recommendation: item.recommendation.trim().slice(0, 4000),
        })),
        heroSuggestions: {
            headline: result.heroSuggestions.headline.trim().slice(0, 200),
            supportingCopy: result.heroSuggestions.supportingCopy.trim().slice(0, 2000),
            primaryCTA: result.heroSuggestions.primaryCTA.trim().slice(0, 120),
            secondaryCTA: result.heroSuggestions.secondaryCTA
                ? result.heroSuggestions.secondaryCTA.trim().slice(0, 120)
                : null,
            designDirection: result.heroSuggestions.designDirection.trim().slice(0, 2000),
        },
        outreachEmail: {
            subject: result.outreachEmail.subject.trim().slice(0, 200),
            body: result.outreachEmail.body.trim().slice(0, 8000),
        },
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

    if (!ACTIVE_CURSOR_ANALYSIS_STATUSES.includes(analysis.status) && analysis.status !== "completed") {
        return null;
    }

    const website = await getWebsiteById(auditRun.websiteId);
    if (!website) return null;

    const resources = await loadAuditRunResources({
        websiteId: auditRun.websiteId,
        auditRunId: input.auditRunId,
    });
    if (!resources) return null;

    const readiness = calculateCursorAnalysisReadiness({
        auditId: input.auditRunId,
        website,
        crawl: resources.crawl,
        screenshots: resources.screenshots,
        pageSpeed: resources.pageSpeed,
        niceGuy: resources.niceGuy,
    });
    if (!readiness.ready) return null;

    return buildCursorAuditPackage({
        auditRun,
        website,
        crawl: resources.crawl,
        screenshots: resources.screenshots,
        pageSpeed: resources.pageSpeed,
        niceGuy: resources.niceGuy,
    });
}
