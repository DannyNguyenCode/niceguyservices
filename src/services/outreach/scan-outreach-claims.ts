const HARD_REJECT_PATTERNS: Array<{ code: string; pattern: RegExp; message: string }> = [
    {
        code: "PRIOR_CONTACT",
        pattern: /\b(as discussed|following up|you requested|we spoke|our previous conversation)\b/i,
        message: "The draft implies prior contact.",
    },
    {
        code: "REQUESTED_AUDIT",
        pattern: /\b(you requested (this|the) audit|you asked (us|me) to review)\b/i,
        message: "The draft claims the recipient requested the audit.",
    },
    {
        code: "FAKE_ATTACHMENT",
        pattern: /\b(i('ve| have) attached|please find attached|attached (is|the))\b/i,
        message: "The draft claims an attachment exists.",
    },
    {
        code: "GUARANTEED_RESULT",
        pattern: /\b(guarantee|guaranteed|will (definitely|certainly) (increase|improve|boost))\b/i,
        message: "The draft promises guaranteed results.",
    },
    {
        code: "REVENUE_LOSS",
        pattern: /\b(losing (thousands|customers|revenue|money)|costing you)\b/i,
        message: "The draft claims unsupported revenue or customer loss.",
    },
    {
        code: "LEGAL_VIOLATION",
        pattern: /\b(illegal|non-?compliant|legally required|ada violation|wcag violation)\b/i,
        message: "The draft claims legal or compliance violations without verified evidence.",
    },
];

const WARNING_PATTERNS: Array<{ code: string; pattern: RegExp; message: string }> = [
    {
        code: "COMPETITOR_CLAIM",
        pattern: /\b(your competitors|competitors are)\b/i,
        message: "The draft references competitors.",
    },
    {
        code: "GOOGLE_PENALTY",
        pattern: /\b(penalized by google|google penalty)\b/i,
        message: "The draft references a Google penalty.",
    },
    {
        code: "OFFICIAL_SCORE",
        pattern: /\bofficial (website )?score\b/i,
        message: "The draft may present the score as official.",
    },
    {
        code: "BROKEN_WEBSITE",
        pattern: /\b(your website is (terrible|broken|awful))\b/i,
        message: "The draft uses shaming language.",
    },
    {
        code: "URGENCY",
        pattern: /\b(urgent(ly)?|act now|immediately)\b/i,
        message: "The draft uses urgency language.",
    },
];

export type ClaimScanResult = {
    hardRejections: Array<{ code: string; message: string }>;
    warnings: Array<{ code: string; message: string }>;
};

export function scanOutreachClaims(input: {
    subject: string;
    bodyText: string;
    allowAttachmentPlaceholder?: boolean;
}): ClaimScanResult {
    const combined = `${input.subject}\n${input.bodyText}`;
    const hardRejections: ClaimScanResult["hardRejections"] = [];
    const warnings: ClaimScanResult["warnings"] = [];

    for (const rule of HARD_REJECT_PATTERNS) {
        if (rule.pattern.test(combined)) {
            if (rule.code === "FAKE_ATTACHMENT" && input.allowAttachmentPlaceholder) {
                continue;
            }
            hardRejections.push({ code: rule.code, message: rule.message });
        }
    }

    for (const rule of WARNING_PATTERNS) {
        if (rule.pattern.test(combined)) {
            warnings.push({ code: rule.code, message: rule.message });
        }
    }

    return { hardRejections, warnings };
}
