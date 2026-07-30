export const OUTREACH_EMAIL_VERSION = "outreach-email-v1";
export const OUTREACH_PROMPT_VERSION = "outreach-email-v1";
export const OUTREACH_INPUT_SCHEMA_VERSION = "outreach-input-v1";

export const OUTREACH_SUBJECT_MAX_LENGTH = 80;

export const OUTREACH_BODY_WORD_LIMITS = {
    short: { min: 60, max: 140 },
    standard: { min: 100, max: 220 },
    detailed: { min: 180, max: 350 },
} as const;

export const DEFAULT_OUTREACH_STRATEGY = {
    tone: "professional" as const,
    length: "short" as const,
    primaryGoal: "start-conversation" as const,
    includePublicReport: false,
    includePdfReference: true,
    includeScore: false,
    includePageSpeed: false,
    includeQuickWin: true,
    includeBusinessCompliment: true,
};
