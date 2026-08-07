import type { AuditScore } from "@/src/types/website-audit";

type AuditScoreCardProps = {
    score: AuditScore;
};

export default function AuditScoreCard({ score }: AuditScoreCardProps) {
    return (
        <article className="rounded-2xl bg-base-200 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-base-content">{score.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                        {score.summary}
                    </p>
                </div>
                <div
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-base-100 text-lg font-semibold text-base-content shadow-sm"
                    aria-label={`${score.label} score ${score.value} out of 100`}
                >
                    {score.value}
                </div>
            </div>
        </article>
    );
}
