"use server";

import { revalidatePath } from "next/cache";
import {
    createWebsite,
    WebsiteDataError,
} from "@/src/data/websites";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import {
    formatZodErrors,
    publicAuditRequestSchema,
} from "@/src/lib/website-validation";

export type PublicAuditRequestState = {
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

function toActionError(error: unknown): PublicAuditRequestState {
    if (
        error instanceof Error &&
        error.message.includes("MONGODB_URI is missing")
    ) {
        return {
            ok: false,
            message:
                "We cannot save your request right now. Please try again later.",
        };
    }

    console.error("Public audit request failed:", error);
    return {
        ok: false,
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
            message: "Please fix the highlighted fields and try again.",
            fieldErrors: formatZodErrors(parsed.error),
        };
    }

    const { normalizedDomain } = normalizeWebsiteUrl(parsed.data.websiteUrl);

    try {
        await createWebsite(
            {
                websiteUrl: parsed.data.websiteUrl,
                businessEmail: parsed.data.businessEmail,
                businessName: undefined,
                industry: undefined,
                location: undefined,
                source: "public-audit-submission",
            },
            {
                activityActor: { type: "system" },
                activityTitle: "Public audit request received",
                activityDescription: `Public audit request received for ${normalizedDomain}.`,
            },
        );

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/websites");

        return {
            ok: true,
            message:
                "Thanks — your request was received. Our team will review your website and follow up by email.",
        };
    } catch (error) {
        if (error instanceof WebsiteDataError && error.code === "duplicate") {
            revalidatePath("/dashboard");
            revalidatePath("/dashboard/websites");

            return {
                ok: true,
                message:
                    "We already have this website on file. Our team will review it and follow up if needed.",
            };
        }

        return toActionError(error);
    }
}
