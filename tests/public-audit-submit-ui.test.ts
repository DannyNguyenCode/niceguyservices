import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import {
    PUBLIC_AUDIT_SUBMIT_UI,
    derivePublicAuditSubmitStatusView,
    shouldOpenPublicAuditSubmitModal,
} from "@/components/websiteAudit/public-audit-submit-status";
import { PUBLIC_AUDIT_RATE_LIMITED_MESSAGE } from "@/src/services/public-audit-protection/constants";
import { publicAuditRequestSchema } from "@/src/lib/website-validation";

describe("public audit submit status view", () => {
    it("enters a loading view while the public request is pending", () => {
        const view = derivePublicAuditSubmitStatusView({ pending: true });
        assert.ok(view);
        assert.equal(view.phase, "loading");
        assert.equal(view.title, PUBLIC_AUDIT_SUBMIT_UI.loading.title);
        assert.equal(view.statusLabel, PUBLIC_AUDIT_SUBMIT_UI.loading.status);
        assert.equal(view.dismissible, false);
        assert.match(view.description, /validating your website/i);
        assert.equal(/crawl|pagespeed|niceguy|cursor|%\d+/i.test(view.description), false);
    });

    it("opens the modal while pending and for non-validation outcomes", () => {
        assert.equal(shouldOpenPublicAuditSubmitModal({ pending: true }), true);
        assert.equal(
            shouldOpenPublicAuditSubmitModal({ pending: false, outcome: "started" }),
            true,
        );
        assert.equal(
            shouldOpenPublicAuditSubmitModal({ pending: false, outcome: "validation" }),
            false,
        );
    });

    it("transitions loading to success when orchestration is scheduled", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            outcome: "started",
        });
        assert.ok(view);
        assert.equal(view.phase, "success");
        assert.equal(view.title, PUBLIC_AUDIT_SUBMIT_UI.successStarted.title);
        assert.match(view.backgroundNote ?? "", /safely leave this page/i);
        assert.match(view.backgroundNote ?? "", /continue in the background/i);
        assert.equal(view.primaryActionLabel, "Done");
        assert.equal(view.dismissible, true);
    });

    it("does not wait for full audit completion language in success copy", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            outcome: "started",
        });
        assert.ok(view);
        assert.equal(/100%|complete|finished crawling/i.test(view.description), false);
        assert.equal(/AuditRun|Mongo|Cursor Cloud/i.test(view.description), false);
    });

    it("uses generic messaging for duplicate/cooldown outcomes", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            outcome: "already_in_progress",
            message:
                "Your audit request has been received. If a review is already in progress or was recently completed for this website, we will continue with that work.",
        });
        assert.ok(view);
        assert.equal(view.phase, "success");
        assert.match(view.description, /already in progress|recently completed/i);
        assert.equal(/another customer|owns this report|audit id/i.test(view.description), false);
        assert.match(view.backgroundNote ?? "", /safely leave this page/i);
    });

    it("maps schedule failure to a recoverable error state", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            outcome: "received",
        });
        assert.ok(view);
        assert.equal(view.phase, "error");
        assert.equal(view.title, PUBLIC_AUDIT_SUBMIT_UI.errorGeneric.title);
        assert.equal(view.primaryActionLabel, "Try again");
        assert.equal(view.dismissible, true);
    });

    it("maps hard errors to a recoverable error state", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            outcome: "error",
            message: "Something went wrong. Please try again.",
        });
        assert.ok(view);
        assert.equal(view.phase, "error");
        assert.match(view.description, /try again/i);
        assert.equal(/stack|mongo|vercel|rate-limit counter/i.test(view.description), false);
    });

    it("shows the generic rate-limit message", () => {
        const view = derivePublicAuditSubmitStatusView({
            pending: false,
            outcome: "rate_limited",
            message: PUBLIC_AUDIT_RATE_LIMITED_MESSAGE,
        });
        assert.ok(view);
        assert.equal(view.phase, "error");
        assert.equal(view.description, PUBLIC_AUDIT_RATE_LIMITED_MESSAGE);
        assert.equal(/\b3\b|\b5\b|\b10\b|per hour|per day/i.test(view.description), false);
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

describe("public audit submit UI source contracts", () => {
    it("wires disabled pending submit, status modal, and accessible loading attributes", async () => {
        const formSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditForm.tsx"),
            "utf8",
        );
        const modalSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/PublicAuditSubmitStatusModal.tsx"),
            "utf8",
        );

        assert.match(formSource, /disabled=\{pending\}/);
        assert.match(formSource, /aria-busy=\{pending \? "true" : undefined\}/);
        assert.match(formSource, /PUBLIC_AUDIT_SUBMIT_UI\.buttonPending/);
        assert.match(formSource, /PublicAuditSubmitStatusModal/);
        assert.match(formSource, /min-w-\[12\.5rem\]/);

        assert.match(modalSource, /<dialog/);
        assert.match(modalSource, /aria-labelledby/);
        assert.match(modalSource, /aria-describedby/);
        assert.match(modalSource, /aria-busy=\{isLoading \? "true" : undefined\}/);
        assert.match(modalSource, /role="status"/);
        assert.match(modalSource, /motion-safe:animate-spin/);
        assert.match(modalSource, /motion-reduce:animate-none/);
        assert.equal(/AuditRun|auditRunId|507f1f77/i.test(modalSource), false);
        assert.equal(/Crawling website|Running PageSpeed|Cursor Cloud/i.test(modalSource), false);
    });

    it("does not cancel backend processing when the modal closes", async () => {
        const formSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditForm.tsx"),
            "utf8",
        );
        assert.equal(/abort\(|AbortController|cancelAudit|stopOrchestration/i.test(formSource), false);
        assert.match(formSource, /safely leave this page|backgroundNote|derivePublicAuditSubmitStatusView/);
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
    });
});
