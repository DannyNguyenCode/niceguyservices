"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
    createWebsite,
    softDeleteWebsite,
    updateWebsite,
    WebsiteDataError,
} from "@/src/data/websites";
import {
    createWebsiteSchema,
    formatZodErrors,
    updateWebsiteSchema,
} from "@/src/lib/website-validation";

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
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");
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

export async function softDeleteWebsiteAction(
    id: string,
): Promise<WebsiteActionState> {
    // TODO: Require admin authentication before allowing website mutations.
    try {
        await softDeleteWebsite(id);
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");
        revalidatePath(`/dashboard/websites/${id}`);
        redirect("/dashboard/websites?deleted=1");
    } catch (error) {
        if (isRedirectError(error)) throw error;
        return toActionError(error);
    }
}
