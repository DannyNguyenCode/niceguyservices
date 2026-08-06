import { z } from "zod";
import { REPORT_LOOKUP_CODE_DIGITS } from "@/src/services/report-lookup/constants";

/** Same normalization as public audit submissions: trim → lowercase → email. */
export const reportLookupEmailSchema = z
    .string()
    .trim()
    .min(1, "Please enter a business email address.")
    .max(254, "Email address is too long.")
    .transform((value) => value.toLowerCase())
    .refine((value) => z.string().email().safeParse(value).success, {
        message: "Please enter a valid email address.",
    });

export const reportLookupCodeSchema = z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${REPORT_LOOKUP_CODE_DIGITS}}$`), {
        message: `Please enter the ${REPORT_LOOKUP_CODE_DIGITS}-digit verification code.`,
    });

export const requestLookupCodeSchema = z.object({
    email: reportLookupEmailSchema,
});

export const verifyLookupCodeSchema = z.object({
    email: reportLookupEmailSchema,
    code: reportLookupCodeSchema,
});

export type RequestLookupCodeInput = z.infer<typeof requestLookupCodeSchema>;
export type VerifyLookupCodeInput = z.infer<typeof verifyLookupCodeSchema>;
