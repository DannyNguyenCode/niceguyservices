"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
    createWebsite,
    deleteWebsite,
    updateWebsite,
    WebsiteDataError,
} from "@/src/data/websites";
import {
    createWebsiteSchema,
    formatZodErrors,
    updateWebsiteSchema,
} from "@/src/lib/website-validation";
import { StartAuditJobError, startAuditJob } from "@/src/services/audit-pipeline/start-audit-job";

export type WebsiteActionState = {
    ok: boolean;
    message?: string;
    fieldErrors?: Record<string, string>;
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

function toActionError(error: unknown): WebsiteActionState {
    if (error instanceof WebsiteDataError) {
        return {
            ok: false,
            message: error.message,
            fieldErrors:
                error.code === "duplicate"
                    ? { websiteUrl: error.message }
                    : undefined,
        };
    }

    if (
        error instanceof Error &&
        error.message.includes("MONGODB_URI is missing")
    ) {
        return {
            ok: false,
            message:
                "Database is not configured. Set MONGODB_URI in .env.local and restart the server.",
        };
    }

    console.error("Website action failed:", error);
    return {
        ok: false,
        message: "Something went wrong. Please try again.",
    };
}

export async function createWebsiteAction(
    _prevState: WebsiteActionState,
    formData: FormData,
): Promise<WebsiteActionState> {
    // TODO: Require admin authentication before allowing website mutations.
    const parsed = createWebsiteSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return {
            ok: false,
            message: "Please fix the highlighted fields and try again.",
            fieldErrors: formatZodErrors(parsed.error),
        };
    }

    try {
        const website = await createWebsite(parsed.data);
        const intent = String(formData.get("intent") ?? "save");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");

        if (intent === "save-and-start") {
            try {
                const started = await startAuditJob({
                    websiteId: website.id,
                    trigger: { type: "administrator", actorId: null, actorName: null },
                });
                redirect(
                    `/dashboard/websites/${website.id}?auditRunId=${started.auditRunId}&jobId=${started.job.id}`,
                );
            } catch (error) {
                if (error instanceof StartAuditJobError) {
                    return {
                        ok: false,
                        message: error.message,
                        fieldErrors: error.code.includes("PREFLIGHT")
                            ? { websiteUrl: error.message }
                            : undefined,
                    };
                }
                throw error;
            }
        }

        redirect(`/dashboard/websites/${website.id}?created=1`);
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return toActionError(error);
    }
}

export async function updateWebsiteAction(
    id: string,
    _prevState: WebsiteActionState,
    formData: FormData,
): Promise<WebsiteActionState> {
    // TODO: Require admin authentication before allowing website mutations.
    const parsed = updateWebsiteSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        return {
            ok: false,
            message: "Please fix the highlighted fields and try again.",
            fieldErrors: formatZodErrors(parsed.error),
        };
    }

    try {
        await updateWebsite(id, parsed.data);
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");
        revalidatePath(`/dashboard/websites/${id}`);
        redirect(`/dashboard/websites/${id}?updated=1`);
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return toActionError(error);
    }
}

export async function deleteWebsiteAction(id: string): Promise<WebsiteActionState> {
    // TODO: Require admin authentication before allowing website mutations.
    try {
        await deleteWebsite(id);
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");
        revalidatePath(`/dashboard/websites/${id}`);
        redirect("/dashboard/websites?deleted=1");
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return toActionError(error);
    }
}

/** @deprecated Use `deleteWebsiteAction`. */
export async function softDeleteWebsiteAction(
    id: string,
): Promise<WebsiteActionState> {
    return deleteWebsiteAction(id);
}
