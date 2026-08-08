"use server";

import { revalidatePath } from "next/cache";
import {
    formatZodErrors,
    publicAuditRequestSchema,
} from "@/src/lib/website-validation";
import { enforcePublicAuditSubmitRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { submitAndStartPublicAuditRequest } from "@/src/services/audit-pipeline/submit-and-start-public-audit";
import {
    PUBLIC_AUDIT_GENERIC_ACCEPTED_MESSAGE,
    PUBLIC_AUDIT_GENERIC_DEDUPED_MESSAGE,
    PUBLIC_AUDIT_RATE_LIMITED_MESSAGE,
} from "@/src/services/public-audit-protection/constants";
import { logPublicAuditSecurityEvent } from "@/src/services/public-audit-protection/log-public-audit-security-event";
import type { PublicAuditSubmitOutcome } from "@/components/websiteAudit/public-audit-submit-status";

export type PublicAuditRequestState = {
    ok: boolean;
    message?: string;
    fieldErrors?: Record<string, string>;
    rateLimited?: boolean;
    /** Safe machine-readable outcome for the public submit UI. Never includes IDs. */
    outcome?: PublicAuditSubmitOutcome;
    /** Opaque progress token for customer polling. Never an internal Mongo ID. */
    statusToken?: string | null;
    /** Customer-safe domain label for progress UI. */
    domain?: string | null;
};

function formDataToObject(formData: FormData): Record<string, string> {
    const entries: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
            entries[key] = value;
        }
    }
    return entries;
}

function toActionError(error: unknown): PublicAuditRequestState {
    if (
        error instanceof Error &&
        error.message.includes("MONGODB_URI is missing")
    ) {
        return {
            ok: false,
            outcome: "error",
            message:
                "We cannot save your request right now. Please try again later.",
        };
    }

    console.error("Public audit request failed:", error);
    return {
        ok: false,
        outcome: "error",
        message: "Something went wrong. Please try again.",
    };
}

export async function submitPublicAuditRequestAction(
    _prevState: PublicAuditRequestState,
    formData: FormData,
): Promise<PublicAuditRequestState> {
    const parsed = publicAuditRequestSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return {
            ok: false,
            outcome: "validation",
            message: "Please fix the highlighted fields and try again.",
            fieldErrors: formatZodErrors(parsed.error),
        };
    }

    try {
        await enforcePublicAuditSubmitRateLimit({
            businessEmail: parsed.data.businessEmail,
        });
    } catch (error) {
        if (isRateLimitError(error)) {
            logPublicAuditSecurityEvent({
                event: "public_audit_rate_limited",
                reason: "rate_limited",
                policyId: String(error.policyId),
                retryAfterSeconds: error.retryAfterSeconds,
            });
            return {
                ok: false,
                rateLimited: true,
                outcome: "rate_limited",
                message: PUBLIC_AUDIT_RATE_LIMITED_MESSAGE,
            };
        }
        throw error;
    }

    try {
        const result = await submitAndStartPublicAuditRequest({
            websiteUrl: parsed.data.websiteUrl,
            businessEmail: parsed.data.businessEmail,
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");

        // Public responses stay generic — never expose other customers' audits,
        // report existence, AuditRun IDs, or internal status details.
        if (result.blockReason) {
            return {
                ok: true,
                outcome: "already_in_progress",
                message: PUBLIC_AUDIT_GENERIC_DEDUPED_MESSAGE,
                statusToken: null,
                domain: result.normalizedDomain,
            };
        }

        if (!result.orchestrationStarted) {
            return {
                ok: false,
                outcome: "received",
                message: "We couldn't start your audit right now. Please try again.",
                statusToken: null,
                domain: result.normalizedDomain,
            };
        }

        return {
            ok: true,
            outcome: "started",
            message: PUBLIC_AUDIT_GENERIC_ACCEPTED_MESSAGE,
            statusToken: result.statusToken,
            domain: result.normalizedDomain,
        };
    } catch (error) {
        return toActionError(error);
    }
}
