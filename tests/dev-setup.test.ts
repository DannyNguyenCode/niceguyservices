import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetAppEnvCacheForTests } from "@/src/config/app-env";
import { resetRateLimitEnvCacheForTests } from "@/src/config/env";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import {
    createAdministratorSessionToken,
    verifyAdministratorSessionToken,
} from "@/src/lib/auth/session-token";
import { isAuthSecretConfigured } from "@/src/lib/auth/middleware-auth";
import {
    isWebsiteAuditLandingPath,
    selectScreenshotPageTargets,
    screenshotFilenameForTarget,
} from "@/src/services/screenshot-targets";
import { DEVELOPMENT_TEST_WEBSITE } from "@/src/config/development-test-website";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
    resetRateLimitEnvCacheForTests();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
    resetRateLimitEnvCacheForTests();
});

describe("development environment", () => {
    it("loads development configuration without production-only Redis requirement", async () => {
        Object.assign(process.env, {
            NODE_ENV: "development",
            DEPLOYMENT_ENV: "development",
            RATE_LIMIT_PROVIDER: "memory",
        });
        const { getRateLimitEnv } = await import("@/src/config/env");
        assert.equal(getRateLimitEnv().provider, "memory");
    });

    it("normalizes the Nice Guy test website URL", () => {
        const normalized = normalizeWebsiteUrl(DEVELOPMENT_TEST_WEBSITE.websiteUrl);
        assert.equal(normalized.normalizedDomain, "niceguyservices.vercel.app");
        assert.equal(normalized.normalizedUrl, "https://niceguyservices.vercel.app");
    });
});

describe("authentication", () => {
    it("creates and verifies administrator session tokens", async () => {
        const token = await createAdministratorSessionToken(
            {
                sub: "507f1f77bcf86cd799439011",
                email: "gbnguyenw@gmail.com",
                name: "Bao Gia Nguyen",
                role: "owner",
                maxAgeSeconds: 3600,
            },
            "test-secret-value",
        );

        const payload = await verifyAdministratorSessionToken(token, "test-secret-value");
        assert.equal(payload?.sub, "507f1f77bcf86cd799439011");
        assert.equal(payload?.email, "gbnguyenw@gmail.com");
    });

    it("reports auth secret configuration without exposing the secret", () => {
        Object.assign(process.env, {
            NODE_ENV: "test",
            DEPLOYMENT_ENV: "test",
        });
        delete process.env.AUTH_SECRET;
        assert.equal(isAuthSecretConfigured(), false);
        process.env.AUTH_SECRET = "local-development-secret";
        assert.equal(isAuthSecretConfigured(), true);
    });
});

describe("screenshot targets", () => {
    it("selects home, contact, and website audit pages separately", () => {
        const targets = selectScreenshotPageTargets([
            {
                url: "https://niceguyservices.vercel.app/",
                path: "/",
                pageType: "home",
                headings: [],
                buttons: [],
                forms: [],
                images: [],
            },
            {
                url: "https://niceguyservices.vercel.app/contact",
                path: "/contact",
                pageType: "contact",
                headings: [],
                buttons: [],
                forms: [],
                images: [],
            },
            {
                url: "https://niceguyservices.vercel.app/work/website-audit",
                path: "/work/website-audit",
                pageType: "other",
                headings: [],
                buttons: [],
                forms: [],
                images: [],
            },
        ]);

        assert.equal(targets.length, 3);
        assert.deepEqual(
            targets.map((target) => target.slug),
            ["home", "contact", "website-audit"],
        );
    });

    it("keeps desktop and mobile screenshot filenames separate", () => {
        assert.equal(
            screenshotFilenameForTarget("home", "desktop"),
            "home-desktop-viewport.png",
        );
        assert.equal(
            screenshotFilenameForTarget("home", "mobile"),
            "home-mobile-viewport.png",
        );
    });

    it("detects website audit landing paths", () => {
        assert.equal(isWebsiteAuditLandingPath("/work/website-audit"), true);
        assert.equal(isWebsiteAuditLandingPath("/about"), false);
    });
});

describe("public audit submission", () => {
    it("exposes a server action for public audit requests", async () => {
        const fs = await import("node:fs/promises");
        await fs.access("src/actions/public-audit-request.ts");
    });
});

describe("health output", () => {
    it("does not include secret fields in the health route source", async () => {
        const source = await import("node:fs/promises").then((fs) =>
            fs.readFile("app/api/health/route.ts", "utf8"),
        );
        assert.equal(source.includes("MONGODB_URI"), false);
        assert.equal(source.includes("CLOUDINARY_API_SECRET"), false);
        assert.equal(source.includes("AUTH_SECRET"), false);
        assert.equal(source.includes("environment"), true);
    });
});
