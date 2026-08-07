import type {
    AuditComparison,
    AuditComparisonSnapshot,
    SerializableAuditRun,
} from "@/src/services/audit-history/types";

function diffNullable(
    from: number | null | undefined,
    to: number | null | undefined,
): { from: number | null; to: number | null; difference: number | null } | undefined {
    if (from === null || from === undefined || to === null || to === undefined) {
        return undefined;
    }
    return { from, to, difference: to - from };
}

function toSnapshot(run: SerializableAuditRun): AuditComparisonSnapshot {
    return {
        auditRunId: run.id,
        auditNumber: run.auditNumber,
        status: run.status,
        completedAt: run.completedAt,
        summary: run.summary,
        versions: run.versions,
    };
}

export function compareAuditRuns(
    fromRun: SerializableAuditRun,
    toRun: SerializableAuditRun,
): AuditComparison {
    const from = toSnapshot(fromRun);
    const to = toSnapshot(toRun);

    const warnings: string[] = [];
    if (from.versions.metricsVersion !== to.versions.metricsVersion) {
        warnings.push(
            "These audits used different Nice Guy metrics versions. Score changes may reflect scoring changes as well as website changes.",
        );
    }
    if (from.versions.aiPromptVersion !== to.versions.aiPromptVersion) {
        warnings.push(
            "These audits used different AI prompt versions. Finding counts may not be directly comparable.",
        );
    }
    if (from.versions.pageSpeedVersion !== to.versions.pageSpeedVersion) {
        warnings.push(
            "These audits used different PageSpeed integration versions. Performance scores may not be directly comparable.",
        );
    }

    const fromCategories = new Map(
        from.summary.categoryScores.map((item) => [item.category, item.score]),
    );
    const toCategories = new Map(
        to.summary.categoryScores.map((item) => [item.category, item.score]),
    );
    const allCategories = new Set([...fromCategories.keys(), ...toCategories.keys()]);

    const categoryScores = [...allCategories].map((category) => {
        const fromScore = fromCategories.get(category) ?? null;
        const toScore = toCategories.get(category) ?? null;
        const difference =
            fromScore !== null && toScore !== null ? toScore - fromScore : null;
        return { category, from: fromScore, to: toScore, difference };
    });

    const mobileFrom = from.summary.pageSpeed.mobile?.performance ?? null;
    const mobileTo = to.summary.pageSpeed.mobile?.performance ?? null;
    const desktopFrom = from.summary.pageSpeed.desktop?.performance ?? null;
    const desktopTo = to.summary.pageSpeed.desktop?.performance ?? null;

    return {
        from,
        to,
        changes: {
            overallScore: diffNullable(from.summary.overallScore, to.summary.overallScore),
            categoryScores,
            pageSpeed: {
                mobile: {
                    performance: diffNullable(mobileFrom, mobileTo),
                },
                desktop: {
                    performance: diffNullable(desktopFrom, desktopTo),
                },
            },
            pagesCrawled: diffNullable(from.summary.pagesCrawled, to.summary.pagesCrawled),
            screenshotsCaptured: diffNullable(
                from.summary.screenshotsCaptured,
                to.summary.screenshotsCaptured,
            ),
            strengths: diffNullable(from.summary.strengthCount, to.summary.strengthCount),
            weaknesses: diffNullable(from.summary.weaknessCount, to.summary.weaknessCount),
            recommendations: diffNullable(
                from.summary.recommendationCount,
                to.summary.recommendationCount,
            ),
        },
        compatibility: {
            metricsVersionMatch: from.versions.metricsVersion === to.versions.metricsVersion,
            aiPromptVersionMatch: from.versions.aiPromptVersion === to.versions.aiPromptVersion,
            pageSpeedVersionMatch:
                from.versions.pageSpeedVersion === to.versions.pageSpeedVersion,
            warnings,
        },
    };
}
