import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetAppEnvCacheForTests } from "@/src/config/app-env";
import { buildWebsiteAuditCloudinaryPrefix } from "@/src/services/websites/delete-website";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
});

describe("website deletion", () => {
    it("builds the Cloudinary prefix for a website audit folder", () => {
        process.env.DEPLOYMENT_ENV = "development";
        process.env.CLOUDINARY_AUDIT_FOLDER_PREFIX = "nice-guy-web-design/audits";

        assert.equal(
            buildWebsiteAuditCloudinaryPrefix("507f1f77bcf86cd799439011"),
            "nice-guy-web-design/audits/development/507f1f77bcf86cd799439011",
        );
    });
});
