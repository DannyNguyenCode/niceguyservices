import "server-only";

import { touchAuditJobHeartbeat } from "@/src/data/audit-jobs";

const DEFAULT_HEARTBEAT_INTERVAL_MS = Number.parseInt(
    process.env.AUDIT_JOB_HEARTBEAT_INTERVAL_MS ?? "60000",
    10,
);

type HeartbeatTouch = (jobId: string) => Promise<void>;

/**
 * Keeps the parent AuditJob heartbeat fresh during long-running stages so stale
 * recovery does not requeue an actively executing job.
 *
 * Must be stopped before the serverless invocation returns — especially before
 * waiting asynchronously for Cursor.
 */
export class AuditJobHeartbeatSession {
    private timer: ReturnType<typeof setInterval> | null = null;
    private stopped = false;
    private readonly jobId: string;
    private readonly intervalMs: number;
    private readonly touch: HeartbeatTouch;

    constructor(
        jobId: string,
        intervalMs = DEFAULT_HEARTBEAT_INTERVAL_MS,
        touch: HeartbeatTouch = touchAuditJobHeartbeat,
    ) {
        this.jobId = jobId;
        this.intervalMs = Math.max(5_000, intervalMs);
        this.touch = touch;
    }

    start(): void {
        if (this.timer || this.stopped) return;
        void this.touch(this.jobId).catch(() => undefined);
        this.timer = setInterval(() => {
            void this.touch(this.jobId).catch(() => undefined);
        }, this.intervalMs);
        if (typeof this.timer.unref === "function") {
            this.timer.unref();
        }
    }

    stop(): void {
        this.stopped = true;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

export async function withAuditJobHeartbeat<T>(
    jobId: string,
    work: () => Promise<T>,
): Promise<T> {
    const session = new AuditJobHeartbeatSession(jobId);
    session.start();
    try {
        return await work();
    } finally {
        session.stop();
    }
}
