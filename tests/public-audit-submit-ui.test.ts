import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import {
    PUBLIC_AUDIT_SUBMIT_UI,
    derivePublicAuditSubmitStatusView,
    shouldShowPublicAuditSubmitFeedback,
    shouldStopPublicAuditStatusPolling,
} from "@/components/websiteAudit/public-audit-submit-status";
import { PUBLIC_AUDIT_RATE_LIMITED_MESSAGE } from "@/src/services/public-audit-protection/constants";
import { publicAuditRequestSchema } from "@/src/lib/website-validation";

describe("public audit submit status helpers", () => {
    it("still derives loading/progress views from shared helpers for copy reuse", () => {
        const view = derivePublicAuditSubmitStatusView({ pending: true });
        assert.ok(view);
        assert.equal(view.phase, "loading");
        assert.equal(view.title, PUBLIC_AUDIT_SUBMIT_UI.loading.title);
    });

    it("shows inline feedback for error outcomes only — not for pending or started", () => {
        assert.equal(shouldShowPublicAuditSubmitFeedback({ pending: true }), false);
        assert.equal(
            shouldShowPublicAuditSubmitFeedback({ pending: false, outcome: "started" }),
            false,
        );
        assert.equal(
            shouldShowPublicAuditSubmitFeedback({ pending: false, outcome: "validation" }),
            false,
        );
        assert.equal(
            shouldShowPublicAuditSubmitFeedback({ pending: false, outcome: "error" }),
            true,
        );
        assert.equal(
            shouldShowPublicAuditSubmitFeedback({
                pending: false,
                outcome: "rate_limited",
            }),
            true,
        );
    });

    it("keeps leave-and-return guidance without promising automatic email", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            progress: {
                status: "processing",
                message: "We're testing your website's performance.",
                domain: "example.com",
                stages: [
                    {
                        id: "request",
                        label: "Request received",
                        description: "Done",
                        state: "complete",
                    },
                    {
                        id: "performance",
                        label: "Performance analysis",
                        description: "Testing",
                        state: "processing",
                    },
                ],
            },
        });
        assert.ok(view);
        assert.match(view.backgroundNote ?? "", /continue automatically/i);
        assert.match(view.backgroundNote ?? "", /email you a PDF download link/i);
        assert.equal(/View in browser/i.test(view.backgroundNote ?? ""), false);
    });

    it("stops polling on complete or failed only", () => {
        assert.equal(shouldStopPublicAuditStatusPolling("complete"), true);
        assert.equal(shouldStopPublicAuditStatusPolling("failed"), true);
        assert.equal(shouldStopPublicAuditStatusPolling("processing"), false);
        assert.equal(shouldStopPublicAuditStatusPolling("accepted"), false);
    });

    it("shows the generic rate-limit message", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            outcome: "rate_limited",
            message: PUBLIC_AUDIT_RATE_LIMITED_MESSAGE,
        });
        assert.ok(view);
        assert.equal(view.description, PUBLIC_AUDIT_RATE_LIMITED_MESSAGE);
    });

    it("keeps submit button labels stable for loading UX", () => {
        assert.equal(PUBLIC_AUDIT_SUBMIT_UI.buttonIdle, "Submit audit request");
        assert.equal(PUBLIC_AUDIT_SUBMIT_UI.buttonPending, "Starting audit...");
    });
});

describe("public audit form validation remains in place", () => {
    it("still rejects invalid website/email before submission UX", () => {
        const parsed = publicAuditRequestSchema.safeParse({
            websiteUrl: "not-a-url",
            businessEmail: "owner@example.com",
        });
        assert.equal(parsed.success, false);

        const missingEmail = publicAuditRequestSchema.safeParse({
            websiteUrl: "https://example.com",
            businessEmail: "",
        });
        assert.equal(missingEmail.success, false);
    });
});

describe("public audit daily limit customer copy", () => {
    it("exposes the email-per-day limit from PUBLIC_AUDIT_LIMITS", async () => {
        const { PUBLIC_AUDIT_LIMITS, PUBLIC_AUDIT_CUSTOMER_DAILY_LIMIT_NOTE } = await import(
            "@/src/services/public-audit-protection/constants"
        );
        assert.equal(PUBLIC_AUDIT_LIMITS.emailPer24Hours, 3);
        assert.match(
            PUBLIC_AUDIT_CUSTOMER_DAILY_LIMIT_NOTE,
            new RegExp(String(PUBLIC_AUDIT_LIMITS.emailPer24Hours)),
        );
        assert.match(PUBLIC_AUDIT_CUSTOMER_DAILY_LIMIT_NOTE, /24 hours/i);
    });
});

describe("public audit submit UI source contracts", () => {
    it("uses inline progress only — no customer progress modal", async () => {
        const formSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditForm.tsx"),
            "utf8",
        );
        const landingSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditLandingPage.tsx"),
            "utf8",
        );

        assert.match(formSource, /disabled=\{pending\}/);
        assert.match(formSource, /aria-busy=\{pending \? "true" : undefined\}/);
        assert.match(formSource, /PUBLIC_AUDIT_SUBMIT_UI\.buttonPending/);
        assert.match(formSource, /AuditInlineProgress/);
        assert.match(formSource, /\/api\/public\/audits\//);
        assert.match(formSource, /sessionStorage|persistPublicAuditStatusSession/);
        assert.match(formSource, /shouldStopPublicAuditStatusPolling/);
        assert.match(formSource, /Single polling source/);
        assert.match(formSource, /min-w-\[12\.5rem\]/);
        assert.match(formSource, /Retrieve my audit/);
        assert.match(formSource, /PUBLIC_AUDIT_CUSTOMER_DAILY_LIMIT_NOTE/);
        assert.equal(/PublicAuditSubmitStatusModal|progressModalVisible|<dialog/i.test(formSource), false);
        assert.equal(
            await fileExists(
                path.join(
                    process.cwd(),
                    "components/websiteAudit/PublicAuditSubmitStatusModal.tsx",
                ),
            ),
            false,
        );
        assert.match(landingSource, /id="retrieve-audit"/);
    });

    it("does not cancel backend processing when the customer leaves the page", async () => {
        const formSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditForm.tsx"),
            "utf8",
        );
        assert.equal(/abort\(|AbortController|cancelAudit|stopOrchestration/i.test(formSource), false);
        assert.match(formSource, /persistPublicAuditStatusSession|statusToken/);
    });

    it("leaves shared orchestration entry points unchanged for backend protections", async () => {
        const submitSource = await readFile(
            path.join(process.cwd(), "src/services/audit-pipeline/submit-and-start-public-audit.ts"),
            "utf8",
        );
        assert.match(submitSource, /evaluateEligibility/);
        assert.match(submitSource, /startAuditOrchestration|startOrchestration/);
        assert.match(submitSource, /forceAsync:\s*true/);
        assert.match(submitSource, /blockReason/);
        assert.match(submitSource, /issueStatusToken|issuePublicAuditStatusToken/);
    });

    it("keeps report lookup verification architecture intact", async () => {
        const lookupSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/ReportLookupForm.tsx"),
            "utf8",
        );
        assert.match(lookupSource, /verification code|6-digit/i);
        assert.match(lookupSource, /request-code|verify-code|public-reports\/lookup/);
        assert.match(lookupSource, /Find my audit/);
        assert.match(lookupSource, /may still be running/i);
    });
});

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await readFile(filePath);
        return true;
    } catch {
        return false;
    }
}
