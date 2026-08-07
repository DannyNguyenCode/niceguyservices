import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { AUDIT_INLINE_LEAVE_GUIDANCE } from "@/components/websiteAudit/AuditInlineProgress";
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
    it("tells customers they may leave and that a PDF email will be sent", () => {
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.title, /don't need to wait/i);
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.body, /continue automatically/i);
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.body, /leave this page/i);
        assert.match(AUDIT_INLINE_LEAVE_GUIDANCE.body, /email you a PDF download link/i);
        assert.equal(/View in browser/i.test(AUDIT_INLINE_LEAVE_GUIDANCE.body), false);
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
        assert.equal(
            /PublicAuditSubmitStatusModal|progressModalVisible|<dialog/i.test(formSource),
            false,
        );
        assert.match(
            formSource,
            /forceAsync|Backend orchestration already started|displays persisted backend status/i,
        );
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

    it("builds a PDF-ready email with a Download PDF button", () => {
        const email = buildPublicAuditReportReadyEmail({
            domain: "example.com",
            pdfDownloadUrl: "https://niceguyweb.design/api/public/pdf-download/token",
        });
        assert.match(email.subject, /example.com/i);
        assert.match(email.text, /Download your PDF/i);
        assert.match(email.html, /Download PDF/i);
        assert.equal(/View in browser/i.test(email.html), false);
        assert.equal(/verification code/i.test(email.text), false);
    });
});

describe("inline audit UI source contracts", () => {
    it("keeps PDF-only completion actions and automatic email copy", async () => {
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
        const landingSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/WebsiteAuditLandingPage.tsx"),
            "utf8",
        );

        assert.match(formSource, /AuditInlineProgress/);
        assert.match(formSource, /AuditCompleteActions/);
        assert.equal(/PublicAuditSubmitStatusModal|progressModalVisible/i.test(formSource), false);

        assert.match(inlineSource, /email you a PDF download link/i);

        assert.match(completeSource, /Download PDF/);
        assert.equal(/View in browser/i.test(completeSource), false);
        assert.equal(/Send to email/i.test(completeSource), false);
        assert.match(completeSource, /emailed a PDF download link/i);
        assert.match(completeSource, /Audit another website/);

        assert.match(landingSource, /email a PDF download link/i);
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
        assert.match(listSource, /published reports/i);
    });

    it("wires signed PDF email download without exposing Cloudinary in status polls", async () => {
        const statusRoute = await readFile(
            path.join(
                process.cwd(),
                "app/api/public/audits/[statusToken]/status/route.ts",
            ),
            "utf8",
        );
        const downloadRoute = await readFile(
            path.join(process.cwd(), "app/api/public/pdf-download/[token]/route.ts"),
            "utf8",
        );
        const deliverableSource = await readFile(
            path.join(
                process.cwd(),
                "src/services/public-reports/complete-public-audit-deliverables.ts",
            ),
            "utf8",
        );

        assert.equal(/reportPath|secureUrl|Cloudinary/i.test(statusRoute), false);
        assert.match(downloadRoute, /verifyPublicPdfEmailDownloadToken/);
        assert.match(downloadRoute, /enforcePublicPdfDownloadRateLimit/);
        assert.match(deliverableSource, /sendPublicAuditPdfReadyEmail|sendReadyEmailIfPossible/);
    });
});
