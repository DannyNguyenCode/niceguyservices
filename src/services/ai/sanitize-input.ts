import { PROMPT_INJECTION_PATTERNS } from "@/src/services/ai/constants";

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const TOKEN_PATTERN = /\b(?:api[_-]?key|token|secret|password|bearer)\s*[:=]\s*\S+/gi;
const QUERY_SECRET_PATTERN = /[?&](?:token|key|secret|auth|session)=[^&\s]+/gi;

export function redactSensitiveText(text: string): string {
    return text
        .replace(EMAIL_PATTERN, "[redacted-email]")
        .replace(PHONE_PATTERN, "[redacted-phone]")
        .replace(TOKEN_PATTERN, "[redacted-token]")
        .replace(QUERY_SECRET_PATTERN, "?[redacted-param]");
}

export function truncateExcerpt(text: string, maxChars: number): string {
    const cleaned = redactSensitiveText(text).replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxChars) return cleaned;
    return `${cleaned.slice(0, maxChars - 1)}…`;
}

export function sanitizeUntrustedContent(text: string): string {
    let sanitized = redactSensitiveText(text);

    for (const pattern of PROMPT_INJECTION_PATTERNS) {
        if (pattern.test(sanitized)) {
            sanitized = sanitized.replace(pattern, "[untrusted-content-removed]");
        }
    }

    return sanitized;
}

export function wrapUntrustedEvidence(label: string, content: string): string {
    return `[UNTRUSTED WEBSITE EVIDENCE: ${label}]\n${sanitizeUntrustedContent(content)}\n[/UNTRUSTED WEBSITE EVIDENCE]`;
}
