import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countSupportedFindings } from "@/src/services/outreach/count-supported-findings";
import { scanOutreachClaims } from "@/src/services/outreach/scan-outreach-claims";
import { validateOutreachOutput, OutreachValidationError } from "@/src/services/outreach/validate-outreach-output";
import { DEFAULT_OUTREACH_STRATEGY, OUTREACH_EMAIL_VERSION } from "@/src/services/outreach/constants";
import type { OutreachGenerationInput } from "@/src/services/outreach/types";
import { validateRecipientEmail } from "@/src/services/outreach/recipient-validation";

function sampleInput(overrides: Partial<OutreachGenerationInput> = {}): OutreachGenerationInput {
    return {
        schemaVersion: "outreach-input-v1",
        business: {
            name: "Acme Plumbing",
            domain: "acmeplumbing.example",
            industry: "Plumbing",
            location: "Toronto",
        },
        recipient: { name: null, role: null },
        sender: {
            name: "Alex",
            businessName: "Nice Guy Web Design",
            websiteUrl: "https://niceguyweb.design",
            phone: null,
            signatureText: null,
        },
        report: {
            revision: 1,
            title: "Website Audit",
            generatedAt: "2026-07-28T00:00:00.000Z",
            publicStatus: "draft",
            publicUrlAvailable: false,
            publicUrl: null,
            pdfAvailable: true,
            pdfFilename: "acme-plumbing-website-audit-r1.pdf",
        },
        audit: {
            overallScore: null,
            scoreLabel: null,
            strengths: [
                {
                    id: "strength-0",
                    title: "Clear services navigation",
                    description: "Services are easy to find.",
                    evidenceCheckIds: ["nav-services"],
                },
            ],
            weaknesses: [
                {
                    id: "weakness-0",
                    title: "Homepage CTA is subtle",
                    description: "The main next step is not prominent.",
                    priority: "high",
                    evidenceCheckIds: ["cta-home"],
                },
            ],
            quickWins: [
                {
                    id: "quick-win-0",
                    title: "Strengthen homepage CTA",
                    description: "Make the contact action more visible.",
                    expectedImpact: "medium",
                    estimatedEffort: "low",
                    evidenceCheckIds: ["cta-home"],
                },
            ],
            pageSpeed: null,
        },
        strategy: DEFAULT_OUTREACH_STRATEGY,
        constraints: {
            doNotInventFacts: true,
            doNotClaimPriorRelationship: true,
            doNotPromiseResults: true,
            doNotShameBusiness: true,
            doNotIncludeUnsupportedNumbers: true,
            requireEvidenceForCriticism: true,
        },
        ...overrides,
    } as OutreachGenerationInput;
}

describe("outreach claim scanner", () => {
    it("hard rejects prior contact and attachment claims", () => {
        const result = scanOutreachClaims({
            subject: "Following up",
            bodyText: "As discussed, I have attached the audit.",
        });
        assert.ok(result.hardRejections.some((item) => item.code === "PRIOR_CONTACT"));
        assert.ok(result.hardRejections.some((item) => item.code === "FAKE_ATTACHMENT"));
    });

    it("warns on competitor and urgency language", () => {
        const result = scanOutreachClaims({
            subject: "Website review",
            bodyText: "Your competitors are ahead. Act now.",
        });
        assert.ok(result.warnings.some((item) => item.code === "COMPETITOR_CLAIM"));
        assert.ok(result.warnings.some((item) => item.code === "URGENCY"));
    });
});

describe("outreach output validation", () => {
    it("accepts valid evidence-backed drafts", () => {
        const input = sampleInput();
        const validated = validateOutreachOutput({
            generationInput: input,
            output: {
                subject: "A quick note about your website",
                bodyText:
                    "Hi there,\n\nI reviewed Acme Plumbing's website and noticed the services are presented clearly, but the main next step for visitors is not especially prominent on the homepage.\n\nA stronger contact action could make it easier for potential customers to know what to do next.\n\nI prepared a short website audit with a few practical recommendations. Would it be useful if I sent it over?\n\nBest,\nAlex",
                evidenceUsed: [
                    { type: "strength", sourceId: "strength-0", label: "Clear services navigation" },
                    { type: "weakness", sourceId: "weakness-0", label: "Homepage CTA is subtle" },
                ],
                rationale: {
                    primaryObservation: "Services are clear.",
                    primaryOpportunity: "CTA visibility.",
                    callToAction: "Offer to send audit.",
                },
                warnings: [],
            },
        });

        assert.equal(validated.evidence.length, 2);
    });

    it("rejects invalid evidence IDs", () => {
        assert.throws(
            () =>
                validateOutreachOutput({
                    generationInput: sampleInput(),
                    output: {
                        subject: "Website review",
                        bodyText:
                            "Hi there,\n\nI reviewed the website and noticed the services are presented clearly, but the homepage could make the next step clearer for visitors.\n\nI prepared a short website audit and can send it over if useful.\n\nBest,\nAlex",
                        evidenceUsed: [{ type: "strength", sourceId: "missing-id", label: "Fake" }],
                        rationale: {
                            primaryObservation: "x",
                            primaryOpportunity: "y",
                            callToAction: "z",
                        },
                        warnings: [],
                    },
                }),
            (error: unknown) => {
                assert.ok(error instanceof OutreachValidationError);
                assert.equal(error.code, "OUTREACH_INVALID_EVIDENCE");
                return true;
            },
        );
    });
});

describe("outreach recipient safety", () => {
    it("allows blank recipient email", () => {
        assert.equal(validateRecipientEmail(""), true);
        assert.equal(validateRecipientEmail(null), true);
    });

    it("flags invalid email addresses", () => {
        assert.equal(validateRecipientEmail("not-an-email"), false);
        assert.equal(validateRecipientEmail("person@example.com"), true);
    });
});

describe("outreach constants", () => {
    it("uses the expected outreach version", () => {
        assert.equal(OUTREACH_EMAIL_VERSION, "outreach-email-v1");
    });
});

describe("supported findings", () => {
    it("counts strengths, weaknesses, quick wins, and score", () => {
        const count = countSupportedFindings({
            sourceSnapshot: {
                ai: {
                    strengths: [{ title: "a" }],
                    weaknesses: [{ title: "b" }],
                    quickWins: [{ title: "c" }],
                },
                niceGuy: { overallScore: 70 },
            },
        } as never);
        assert.equal(count, 4);
    });
});
