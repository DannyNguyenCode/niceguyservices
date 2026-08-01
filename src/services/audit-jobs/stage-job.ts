import "server-only";

import mongoose from "mongoose";

export const ACTIVE_JOB_STATUSES = ["queued", "processing"] as const;
export type ActiveJobStatus = (typeof ACTIVE_JOB_STATUSES)[number];

export type StageJobTimestamps = {
    attempt?: number;
    startedAt?: Date | null;
    heartbeatAt?: Date | null;
    completedAt?: Date | null;
};

import {
    buildStageIdempotencyKey,
    isDuplicateKeyError,
} from "@/src/services/audit-jobs/stage-job-utils";

export {
    buildStageIdempotencyKey,
    isDuplicateKeyError,
} from "@/src/services/audit-jobs/stage-job-utils";

export async function acquireOrReuseActiveJob(input: {
    idempotencyKey: string;
    createDocument: () => Promise<{ _id: unknown }>;
    serialize: (doc: { _id: unknown }) => { id: string };
    findActive: () => Promise<{ _id: unknown } | null>;
}): Promise<{ record: { id: string }; created: boolean }> {
    const existing = await input.findActive();
    if (existing) {
        return { record: input.serialize(existing), created: false };
    }

    try {
        const created = await input.createDocument();
        return { record: input.serialize(created), created: true };
    } catch (error) {
        if (!isDuplicateKeyError(error)) {
            throw error;
        }
        const raced = await input.findActive();
        if (!raced) {
            throw error;
        }
        return { record: input.serialize(raced), created: false };
    }
}

export function getStaleJobCutoffMs(): number {
    const minutes = Number.parseInt(process.env.AUDIT_JOB_STALE_MINUTES ?? "30", 10);
    return Math.max(5, minutes) * 60_000;
}

export async function recoverStaleJobs(input: {
    model: mongoose.Model<unknown>;
    failureMessage: string;
    additionalSet?: Record<string, unknown>;
}): Promise<number> {
    const cutoff = new Date(Date.now() - getStaleJobCutoffMs());
    const result = await input.model.updateMany(
        {
            status: { $in: [...ACTIVE_JOB_STATUSES] },
            $or: [
                { heartbeatAt: { $lte: cutoff } },
                {
                    heartbeatAt: null,
                    startedAt: { $lte: cutoff },
                },
                {
                    heartbeatAt: null,
                    startedAt: null,
                    updatedAt: { $lte: cutoff },
                },
            ],
        },
        {
            $set: {
                status: "failed",
                completedAt: new Date(),
                errorMessage: input.failureMessage,
                ...input.additionalSet,
            },
        },
    );
    return result.modifiedCount ?? 0;
}
