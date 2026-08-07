import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isDuplicateKeyError, buildStageIdempotencyKey } from "@/src/services/audit-jobs/stage-job-utils";

describe("stage job idempotency", () => {
    it("builds stable idempotency keys", () => {
        assert.equal(
            buildStageIdempotencyKey(["pagespeed", "website", "crawl", "mobile"]),
            "pagespeed:website:crawl:mobile",
        );
    });

    it("detects duplicate key errors", () => {
        assert.equal(isDuplicateKeyError({ code: 11000 }), true);
        assert.equal(isDuplicateKeyError(new Error("E11000 duplicate key error")), true);
        assert.equal(isDuplicateKeyError(new Error("other")), false);
    });
});
