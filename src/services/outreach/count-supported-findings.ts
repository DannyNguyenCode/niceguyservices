import type { SerializablePublicReport } from "@/src/types/public-report";

export function countSupportedFindings(report: SerializablePublicReport | null): number {
    if (!report?.sourceSnapshot) return 0;
    const snapshot = report.sourceSnapshot;
    return (
        snapshot.ai.strengths.length +
        snapshot.ai.weaknesses.length +
        snapshot.ai.quickWins.length +
        (snapshot.niceGuy.overallScore ? 1 : 0)
    );
}
