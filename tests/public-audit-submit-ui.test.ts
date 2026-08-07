import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import {
    PUBLIC_AUDIT_SUBMIT_UI,
    derivePublicAuditSubmitStatusView,
    shouldOpenPublicAuditSubmitModal,
    shouldStopPublicAuditStatusPolling,
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
        assert.equal(
            shouldOpenPublicAuditSubmitModal({
                pending: false,
                hasProgressSession: true,
            }),
            true,
        );
    });

    it("shows progress stages from real backend status", () => {
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
                        id: "crawl",
                        label: "Website crawl",
                        description: "Done",
                        state: "complete",
                    },
                    {
                        id: "performance",
                        label: "Performance analysis",
                        description: "Testing",
                        state: "processing",
                    },
                    {
                        id: "ux_conversion",
                        label: "UX & conversion analysis",
                        description: "Waiting",
                        state: "pending",
                    },
                    {
                        id: "ai_review",
                        label: "AI review",
                        description: "Waiting",
                        state: "pending",
                    },
                    {
                        id: "report",
                        label: "Preparing report",
                        description: "Waiting",
                        state: "pending",
                    },
                ],
            },
        });
        assert.ok(view);
        assert.equal(view.phase, "progress");
        assert.equal(view.domain, "example.com");
        assert.equal(view.stages?.length, 6);
        assert.equal(view.stages?.find((s) => s.id === "performance")?.state, "processing");
        assert.match(view.backgroundNote ?? "", /don't need to keep this page open/i);
        assert.match(view.backgroundNote ?? "", /Retrieve your report|email you submitted/i);
        assert.equal(/We'll email you when/i.test(view.backgroundNote ?? ""), false);
    });

    it("maps completion and terminal failure from progress", () => {
        const complete = derivePublicAuditSubmitStatusView({
            pending: false,
            progress: {
                status: "complete",
                message: "done",
                domain: "example.com",
                stages: [],
            },
        });
        assert.ok(complete);
        assert.equal(complete.phase, "success");
        assert.equal(complete.title, PUBLIC_AUDIT_SUBMIT_UI.successComplete.title);

        const failed = derivePublicAuditSubmitStatusView({
            pending: false,
            progress: {
                status: "failed",
                message: "failed",
                domain: "example.com",
                stages: [],
            },
        });
        assert.ok(failed);
        assert.equal(failed.phase, "error");
        assert.equal(failed.title, PUBLIC_AUDIT_SUBMIT_UI.errorFailed.title);
    });

    it("stops polling on complete or failed only", () => {
        assert.equal(shouldStopPublicAuditStatusPolling("complete"), true);
        assert.equal(shouldStopPublicAuditStatusPolling("failed"), true);
        assert.equal(shouldStopPublicAuditStatusPolling("processing"), false);
        assert.equal(shouldStopPublicAuditStatusPolling("accepted"), false);
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
    it("wires disabled pending submit, status modal, polling, and accessible loading attributes", async () => {
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
        assert.match(formSource, /\/api\/public\/audits\//);
        assert.match(formSource, /sessionStorage|persistPublicAuditStatusSession/);
        assert.match(formSource, /shouldStopPublicAuditStatusPolling/);
        assert.match(formSource, /min-w-\[12\.5rem\]/);

        assert.match(modalSource, /<dialog/);
        assert.match(modalSource, /aria-labelledby/);
        assert.match(modalSource, /aria-describedby/);
        assert.match(modalSource, /Audit progress/);
        assert.match(modalSource, /motion-safe:animate-spin/);
        assert.match(modalSource, /motion-reduce:animate-none/);
        assert.equal(/AuditRun|auditRunId|507f1f77/i.test(modalSource), false);
        assert.equal(/websiteId|CURSOR_|Mongo/i.test(modalSource), false);
    });

    it("does not cancel backend processing when the modal closes", async () => {
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
    });
});
