export const PET_MARKET_USERS_COLLECTION = "pet_market_users" as const;
export const PET_MARKET_AUTH_CODES_COLLECTION = "pet_market_auth_codes" as const;
export const PET_MARKET_SESSIONS_COLLECTION = "pet_market_sessions" as const;

export const PET_MARKET_AUTH_CODE_TTL_MS = 10 * 60 * 1000;
export const PET_MARKET_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const PET_MARKET_MIN_PASSWORD_LENGTH = 8;
