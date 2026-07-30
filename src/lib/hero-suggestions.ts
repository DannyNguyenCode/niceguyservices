import { Schema } from "mongoose";
import { HERO_SUGGESTION_STATUSES } from "@/src/schemas/enums";
import type { HeroSuggestionItem } from "@/src/schemas/hero-suggestions";
import { emptyHeroSuggestions } from "@/src/schemas/hero-suggestions";

export type HeroSuggestionStatus = (typeof HERO_SUGGESTION_STATUSES)[number];
export type { HeroSuggestionItem };

export function emptyHeroSuggestionItem(): HeroSuggestionItem {
    return emptyHeroSuggestions(
        "000000000000000000000000",
        "000000000000000000000000",
        "000000000000000000000000",
        "000000000000000000000000",
    );
}

/** @deprecated Legacy embedded suggestion schema from pre-Phase 8 model. */
export const HeroSuggestionItemSchema = new Schema(
    {
        title: { type: String, trim: true, default: "", maxlength: 500 },
        description: { type: String, trim: true, default: "", maxlength: 5000 },
        reasoning: { type: String, trim: true, default: "", maxlength: 5000 },
        priority: { type: String, default: "medium" },
        implemented: { type: Boolean, default: false },
    },
    { _id: false },
);
