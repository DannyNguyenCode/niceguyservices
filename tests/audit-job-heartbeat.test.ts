import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AuditJobHeartbeatSession } from "@/src/services/audit-pipeline/job-heartbeat";

describe("AuditJobHeartbeatSession", () => {
    it("starts and stops without throwing", async () => {
        let touches = 0;
        const session = new AuditJobHeartbeatSession(
            "507f1f77bcf86cd799439011",
            5_000,
            async () => {
                touches += 1;
            },
        );
        assert.doesNotThrow(() => session.start());
        await Promise.resolve();
        assert.equal(touches, 1);
        assert.doesNotThrow(() => session.stop());
        assert.doesNotThrow(() => session.stop());
    });

    it("does not restart after stop", async () => {
        let touches = 0;
        const session = new AuditJobHeartbeatSession(
            "507f1f77bcf86cd799439011",
            5_000,
            async () => {
                touches += 1;
            },
        );
        session.start();
        await Promise.resolve();
        session.stop();
        session.start();
        await Promise.resolve();
        // After stop(), start is a no-op by design to prevent cross-request leaks.
        assert.equal(touches, 1);
        session.stop();
    });
});
