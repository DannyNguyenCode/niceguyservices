import { NICEGUY_SCORING_VERSION } from "@/src/config/niceguy-scoring";
import { scoreBrandingConsistency } from "@/src/services/niceguy-scoring/branding-consistency";
import { scoreBusinessClarity } from "@/src/services/niceguy-scoring/business-clarity";
import { scoreContentQuality } from "@/src/services/niceguy-scoring/content-quality";
import { scoreConversionReadiness } from "@/src/services/niceguy-scoring/conversion-readiness";
import {
    buildSummary,
    calculateOverallScore,
} from "@/src/services/niceguy-scoring/helpers";
import { scoreTechnicalFoundation } from "@/src/services/niceguy-scoring/technical-foundation";
import { scoreTrustCredibility } from "@/src/services/niceguy-scoring/trust-credibility";
import type {
    NiceGuyCategories,
    NiceGuyScoreResult,
    NiceGuyScoringInput,
} from "@/src/services/niceguy-scoring/types";
import { scoreUserExperience } from "@/src/services/niceguy-scoring/user-experience";

export function calculateNiceGuyScore(input: NiceGuyScoringInput): NiceGuyScoreResult {
    const categories: NiceGuyCategories = {
        businessClarity: scoreBusinessClarity(input),
        trustCredibility: scoreTrustCredibility(input),
        conversionReadiness: scoreConversionReadiness(input),
        userExperience: scoreUserExperience(input),
        brandingConsistency: scoreBrandingConsistency(input),
        contentQuality: scoreContentQuality(input),
        technicalFoundation: scoreTechnicalFoundation(input),
    };

    const overallScore = calculateOverallScore(categories);
    const summary = buildSummary(categories);

    return {
        scoringVersion: NICEGUY_SCORING_VERSION,
        overallScore,
        categories,
        summary,
    };
}
