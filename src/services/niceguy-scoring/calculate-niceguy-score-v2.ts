import { NICEGUY_SCORING_VERSION_V2 } from "@/src/config/niceguy-scoring-v2";
import { scoreBusinessClarityV2 } from "@/src/services/niceguy-scoring/v2/business-clarity";
import { scoreBrandingConsistencyV2 } from "@/src/services/niceguy-scoring/v2/branding-consistency";
import { detectBusinessType } from "@/src/services/niceguy-scoring/v2/business-types";
import { scoreContentCompletenessV2 } from "@/src/services/niceguy-scoring/v2/content-completeness";
import { scoreConversionReadinessV2 } from "@/src/services/niceguy-scoring/v2/conversion-readiness";
import {
    buildMethodology,
    buildSummaryV2,
    evaluateScoreCompleteness,
    toLegacyCategories,
    type V2NiceGuyCategories,
} from "@/src/services/niceguy-scoring/v2/finalizer";
import { scoreTechnicalFoundationV2 } from "@/src/services/niceguy-scoring/v2/technical-foundation";
import { scoreTrustCredibilityV2 } from "@/src/services/niceguy-scoring/v2/trust-credibility";
import { scoreUsabilityAccessibilityV2 } from "@/src/services/niceguy-scoring/v2/usability-accessibility";
import type { NiceGuyScoreResult, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export type CalculateNiceGuyScoreV2Options = {
    hasScreenshots?: boolean;
};

export function calculateNiceGuyScoreV2(
    input: NiceGuyScoringInput,
    options: CalculateNiceGuyScoreV2Options = {},
): NiceGuyScoreResult {
    const hasScreenshots = options.hasScreenshots ?? false;
    const businessType = detectBusinessType(input);

    const categories: V2NiceGuyCategories = {
        businessClarity: scoreBusinessClarityV2(input, businessType),
        trustCredibility: scoreTrustCredibilityV2(input, businessType),
        conversionReadiness: scoreConversionReadinessV2(input, businessType),
        userExperience: scoreUsabilityAccessibilityV2(input),
        brandingConsistency: scoreBrandingConsistencyV2(input, hasScreenshots),
        contentQuality: scoreContentCompletenessV2(input),
        technicalFoundation: scoreTechnicalFoundationV2(input),
    };

    const completeness = evaluateScoreCompleteness(categories, input, hasScreenshots);
    const summary = buildSummaryV2(categories);
    const methodology = buildMethodology(categories, businessType, completeness);

    return {
        scoringVersion: NICEGUY_SCORING_VERSION_V2,
        overallScore: completeness.provisionalScore,
        categories: toLegacyCategories(categories),
        summary,
        completeness: {
            isComplete: completeness.isComplete,
            label: completeness.label,
            provisionalScore: completeness.provisionalScore,
            blockers: completeness.blockers,
            overallEvidenceCoverage: completeness.overallEvidenceCoverage,
        },
        methodology: {
            scoringVersion: methodology.scoringVersion,
            rubricVersion: methodology.rubricVersion,
            applicabilityVersion: methodology.applicabilityVersion,
            disclaimer: methodology.disclaimer,
            businessType: {
                detected: methodology.businessType.detected,
                confidence: methodology.businessType.confidence,
                evidence: methodology.businessType.evidence,
                applied: methodology.businessType.applied,
            },
            deterministicCheckCount: methodology.deterministicCheckCount,
            aiAssistedCheckCount: methodology.aiAssistedCheckCount,
            limitations: methodology.limitations,
        },
    };
}
