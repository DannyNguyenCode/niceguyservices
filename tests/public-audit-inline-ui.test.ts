import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import {
    AUDIT_INLINE_LEAVE_GUIDANCE,
} from "@/components/websiteAudit/AuditInlineProgress";
import {
    deriveWebsiteAuditInlinePhase,
    websiteAuditSectionCopy,
} from "@/components/websiteAudit/public-audit-submit-status";
import { maskBusinessEmail } from "@/src/services/public-audit-status/resolve-public-audit-deliverables";
import { buildPublicAuditReportReadyEmail } from "@/src/services/public-audit-status/send-public-audit-report-email";

describe("website audit inline phase", () => {
    it("shows the form before submission", () => {
        assert.equal(
            deriveWebsiteAuditInlinePhase({
                pending: false,
                statusToken: null,
                progressStatus: null,
            }),
            "form",
        );
        const copy = websiteAuditSectionCopy("form");
        assert.match(copy.title, /Request a website audit/i);
    });

    it("enters submitting while pending without a token", () => {
        assert.equal(
            deriveWebsiteAuditInlinePhase({
                pending: true,
                statusToken: null,
                progressStatus: null,
            }),
            "submitting",
        );
    });

    it("replaces the form with progress after a status token exists", () => {
        assert.equal(
            deriveWebsiteAuditInlinePhase({
                pending: false,
                statusToken: "a".repeat(40),
                progressStatus: "processing",
            }),
            "progress",
        );
        assert.equal(
            deriveWebsiteAuditInlinePhase({
                pending: false,
                statusToken: "a".repeat(40),
                progressStatus: "complete",
            }),
            "complete",
        );
        assert.equal(
            deriveWebsiteAuditInlinePhase({
                pending: false,
                statusToken: "a".repeat(40),
                progressStatus: "failed",
            }),
            "failed",
        );
    });
});

describe("leave-and-return guidance", () => {
    it("tells customers they may leave and how to retrieve by email", () => {
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.title, /don't need to wait/i);
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.body, /continue automatically/i);
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.body, /leave this page/i);
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.body, /enter your email/i);
        assert.equal(/We'll email you when/i.test(AUDIT_INLINE_LEAVE_GUIDANCE.body), false);
    });
});

describe("automatic start on submit — no second customer action", () => {
    it("submit action starts orchestration and returns a status token without a start button", async () => {
        const formSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditForm.tsx"),
            "utf8",
        );
        const submitSource = await readFile(
            path.join(
                process.cwd(),
                "src/services/audit-pipeline/submit-and-start-public-audit.ts",
            ),
            "utf8",
        );
        const actionSource = await readFile(
            path.join(process.cwd(), "src/actions/public-audit-request.ts"),
            "utf8",
        );

        assert.match(formSource, /Submit audit request|PUBLIC_AUDIT_SUBMIT_UI\.buttonIdle/);
        assert.equal(/Start processing|Begin analysis|Confirm request/i.test(formSource), false);
        assert.equal(/PublicAuditSubmitStatusModal|progressModalVisible|<dialog/i.test(formSource), false);
        assert.match(formSource, /forceAsync|Backend orchestration already started|displays persisted backend status/i);
        assert.match(submitSource, /forceAsync:\s*true/);
        assert.match(submitSource, /startAuditOrchestration|startOrchestration/);
        assert.match(actionSource, /submitAndStartPublicAuditRequest/);
        assert.match(actionSource, /outcome:\s*"started"|statusToken/);
    });
});

describe("public audit deliverable helpers", () => {
    it("masks business emails for UI feedback", () => {
        assert.equal(maskBusinessEmail("owner@business.com"), "o***@business.com");
        assert.equal(maskBusinessEmail("a@x.co"), "a***@x.co");
    });

    it("builds a report-ready email without inventing automatic completion spam", () => {
        const email = buildPublicAuditReportReadyEmail({
            domain: "example.com",
            reportUrl: "https://niceguyweb.design/report/token",
            pdfReady: true,
        });
        assert.match(email.subject, /example.com/i);
        assert.match(email.text, /View your report/i);
        assert.match(email.html, /View in browser/i);
        assert.equal(/verification code/i.test(email.text), false);
    });
});

describe("inline audit UI source contracts", () => {
    it("keeps a single inline progress surface without a progress modal", async () => {
        const formSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditForm.tsx"),
            "utf8",
        );
        const completeSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/AuditCompleteActions.tsx"),
            "utf8",
        );
        const inlineSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/AuditInlineProgress.tsx"),
            "utf8",
        );
        const stagesSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/PublicAuditProgressStages.tsx"),
            "utf8",
        );
        const landingSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditLandingPage.tsx"),
            "utf8",
        );

        assert.match(formSource, /AuditInlineProgress/);
        assert.match(formSource, /AuditCompleteActions/);
        assert.match(formSource, /AuditFailureState/);
        assert.match(formSource, /deriveWebsiteAuditInlinePhase/);
        assert.match(formSource, /Single polling source/);
        assert.match(formSource, /startAnotherAudit/);
        assert.equal(/PublicAuditSubmitStatusModal|progressModalVisible|<dialog/i.test(formSource), false);
        assert.equal(/Open detailed progress/i.test(formSource), false);

        assert.match(inlineSource, /PublicAuditProgressStages/);
        assert.match(inlineSource, /AUDIT_INLINE_LEAVE_GUIDANCE|continue automatically/i);
        assert.match(inlineSource, /enter your email/i);
        assert.equal(/We'll email you when/i.test(inlineSource), false);
        assert.equal(/Open detailed progress/i.test(inlineSource), false);

        assert.match(completeSource, /View in browser/);
        assert.match(completeSource, /Download PDF/);
        assert.match(completeSource, /Send to email/);
        assert.match(completeSource, /\/report-url/);
        assert.match(completeSource, /\/pdf/);
        assert.match(completeSource, /\/email-report/);
        assert.match(completeSource, /disabled=\{!pdfReady\}/);
        assert.match(completeSource, /Audit another website/);

        assert.match(stagesSource, /aria-label="Audit progress"/);
        assert.match(landingSource, /showSectionHeader/);
        assert.match(landingSource, /id="retrieve-audit"/);
        assert.match(landingSource, /Already requested an audit/);
        assert.equal(
            /Request a website audit[\s\S]*WebsiteAuditForm/i.test(landingSource),
            false,
        );
    });

    it("documents that email lookup retrieves published reports only", async () => {
        const lookupSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/ReportLookupForm.tsx"),
            "utf8",
        );
        const listSource = await readFile(
            path.join(process.cwd(), "src/services/report-lookup/list-lookup-reports.ts"),
            "utf8",
        );
        assert.match(lookupSource, /verification code|6-digit/i);
        assert.match(lookupSource, /may still be running/i);
        assert.match(listSource, /published reports/i);
        assert.equal(/statusToken|issuePublicAuditStatusToken/i.test(lookupSource), false);
    });

    it("scopes deliverable routes to the status token without poll URL leakage", async () => {
        const statusRoute = await readFile(
            path.join(
                process.cwd(),
                "app/api/public/audits/[statusToken]/status/route.ts",
            ),
            "utf8",
        );
        const resolveSource = await readFile(
            path.join(
                process.cwd(),
                "src/services/public-audit-status/resolve-public-audit-deliverables.ts",
            ),
            "utf8",
        );
        const emailRoute = await readFile(
            path.join(
                process.cwd(),
                "app/api/public/audits/[statusToken]/email-report/route.ts",
            ),
            "utf8",
        );

        assert.match(statusRoute, /pdfReady/);
        assert.equal(/reportPath|secureUrl|Cloudinary/i.test(statusRoute), false);
        assert.match(resolveSource, /ONLY this audit/i);
        assert.match(emailRoute, /Destination is never client-supplied/);
        assert.match(emailRoute, /enforcePublicAuditReportEmailRateLimit/);
    });
});
