const PROHIBITED_INTEGRATION_PATTERNS: Array<{ code: string; pattern: RegExp }> = [
    { code: "MONGODB_ENV", pattern: /process\.env\.MONGODB/i },
    { code: "RESEND_ENV", pattern: /process\.env\.RESEND/i },
    { code: "CLOUDINARY_SECRET", pattern: /process\.env\.CLOUDINARY_API_SECRET/i },
    { code: "GTAG", pattern: /gtag\(/i },
    { code: "GOOGLE_ANALYTICS", pattern: /GoogleAnalytics/i },
    { code: "FBQ", pattern: /fbq\(/i },
    { code: "STRIPE", pattern: /\bstripe\b/i },
    { code: "CHECKOUT", pattern: /\bcheckout\b/i },
    { code: "SEND_EMAIL", pattern: /sendEmail/i },
    { code: "RESEND_SEND", pattern: /resend\.emails\.send/i },
    { code: "MONGOOSE", pattern: /mongoose\.connect/i },
    { code: "MONGODB", pattern: /\bmongodb\b/i },
    { code: "NEXT_AUTH", pattern: /next-auth|\bauth\(\)/i },
];

const PROHIBITED_CLAIM_PATTERNS: Array<{ code: string; pattern: RegExp }> = [
    { code: "GUARANTEED", pattern: /\bguaranteed\b/i },
    { code: "LICENSED_INSURED", pattern: /licensed and insured/i },
    { code: "AWARD_WINNING", pattern: /award-winning/i },
    { code: "FIVE_STAR", pattern: /five-star/i },
    { code: "BEST_IN", pattern: /best in/i },
    { code: "NUMBER_ONE", pattern: /number one/i },
    { code: "EMERGENCY_24_7", pattern: /24\/7 emergency/i },
    { code: "YEARS_EXPERIENCE", pattern: /years of experience/i },
    { code: "THOUSANDS_CUSTOMERS", pattern: /thousands of customers/i },
    { code: "FINANCING", pattern: /financing available/i },
];

export type DemoSourceScanResult = {
    passed: boolean;
    errors: Array<{ code: string; message: string; filePath?: string | null }>;
    warnings: Array<{ code: string; message: string; filePath?: string | null }>;
};

export function scanDemoSource(input: {
    files: Array<{ path: string; content: string }>;
    approvedFactWhitelist?: string[];
}): DemoSourceScanResult {
    const errors: DemoSourceScanResult["errors"] = [];
    const warnings: DemoSourceScanResult["warnings"] = [];
    const whitelist = new Set((input.approvedFactWhitelist ?? []).map((item) => item.toLowerCase()));

    for (const file of input.files) {
        for (const rule of PROHIBITED_INTEGRATION_PATTERNS) {
            if (rule.pattern.test(file.content)) {
                errors.push({
                    code: rule.code,
                    message: `Prohibited integration pattern detected (${rule.code}).`,
                    filePath: file.path,
                });
            }
        }

        for (const rule of PROHIBITED_CLAIM_PATTERNS) {
            const match = file.content.match(rule.pattern);
            if (!match) continue;
            const matchedText = match[0].toLowerCase();
            if (whitelist.has(matchedText)) continue;
            warnings.push({
                code: rule.code,
                message: `Potential unapproved claim detected (${rule.code}).`,
                filePath: file.path,
            });
        }
    }

    return {
        passed: errors.length === 0,
        errors,
        warnings,
    };
}

export function sanitizeUntrustedText(value: string, maxLength = 2000): string {
    return value
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}
