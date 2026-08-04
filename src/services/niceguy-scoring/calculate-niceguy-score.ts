export { calculateNiceGuyScoreV2 } from "@/src/services/niceguy-scoring/calculate-niceguy-score-v2";
export { calculateNiceGuyScoreV1 } from "@/src/services/niceguy-scoring/calculate-niceguy-score-v1";

import { calculateNiceGuyScoreV2 } from "@/src/services/niceguy-scoring/calculate-niceguy-score-v2";
import type { NiceGuyScoreResult, NiceGuyScoringInput } from "@/src/services/niceguy-scoring/types";

export type CalculateNiceGuyScoreOptions = {
    hasScreenshots?: boolean;
};

export function calculateNiceGuyScore(
    input: NiceGuyScoringInput,
    options: CalculateNiceGuyScoreOptions = {},
): NiceGuyScoreResult {
    return calculateNiceGuyScoreV2(input, options);
}
