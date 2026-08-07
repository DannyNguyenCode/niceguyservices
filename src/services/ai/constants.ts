export const AI_INPUT_LIMITS = {
    homepageExcerptCharacters: 4000,
    otherPageExcerptCharacters: 2000,
    maximumPagesSent: 5,
    maximumChecksSentPerCategory: 15,
    maximumOpportunitiesPerStrategy: 10,
} as const;

export const AI_LENGTH_LIMITS = {
    executiveSummaryWords: { min: 80, max: 180 },
    businessImpactSummaryWords: { min: 50, max: 130 },
    strengths: { min: 2, max: 5 },
    weaknesses: { min: 2, max: 6 },
    quickWins: { min: 3, max: 6 },
    longTermRecommendations: { min: 2, max: 5 },
    priorityOrder: { min: 3, max: 7 },
    disclaimers: { min: 0, max: 4 },
    itemDescriptionWords: 100,
    heroSuggestions: 3,
} as const;

export const PROMPT_INJECTION_PATTERNS = [
    /ignore (all )?(previous|prior) instructions/i,
    /you are now/i,
    /system prompt/i,
    /developer message/i,
    /<\s*script/i,
    /javascript:/i,
] as const;
