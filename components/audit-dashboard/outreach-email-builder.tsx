"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DEFAULT_OUTREACH_STRATEGY } from "@/src/services/outreach/constants";
import type { OutreachStrategy, SerializableOutreachEmailDraft } from "@/src/services/outreach/types";

type OutreachEmailBuilderProps = {
    publicReportId: string;
    availablePdfReports: Array<{ id: string; filename: string; revision: number }>;
    canGenerate: boolean;
    initialDraft?: SerializableOutreachEmailDraft | null;
};

export default function OutreachEmailBuilder({
    publicReportId,
    availablePdfReports,
    canGenerate,
    initialDraft,
}: OutreachEmailBuilderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [draft, setDraft] = useState<SerializableOutreachEmailDraft | null>(initialDraft ?? null);
    const [recipientName, setRecipientName] = useState(initialDraft?.recipient.name ?? "");
    const [recipientRole, setRecipientRole] = useState(initialDraft?.recipient.role ?? "");
    const [recipientEmail, setRecipientEmail] = useState(initialDraft?.recipient.email ?? "");
    const [pdfReportId, setPdfReportId] = useState(initialDraft?.pdfReportId ?? "");
    const [strategy, setStrategy] = useState<OutreachStrategy>(
        initialDraft?.strategy ?? DEFAULT_OUTREACH_STRATEGY,
    );
    const [subject, setSubject] = useState(initialDraft?.subject ?? "");
    const [bodyText, setBodyText] = useState(initialDraft?.bodyText ?? "");

    function updateStrategy<K extends keyof OutreachStrategy>(key: K, value: OutreachStrategy[K]) {
        setStrategy((current) => ({ ...current, [key]: value }));
    }

    function generate() {
        setMessage("Generating email draft…");
        startTransition(async () => {
            const response = await fetch(`/api/admin/reports/${publicReportId}/outreach`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pdfReportId: pdfReportId || null,
                    recipient: {
                        name: recipientName || null,
                        role: recipientRole || null,
                        email: recipientEmail || null,
                    },
                    strategy,
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Draft generation failed.");
                return;
            }
            if (result.draft) {
                setDraft(result.draft);
                setSubject(result.draft.subject);
                setBodyText(result.draft.bodyText);
            } else {
                setSubject(result.subject);
                setBodyText(result.bodyText);
            }
            setMessage("Email draft generated.");
            router.refresh();
        });
    }

    function saveDraft() {
        if (!draft?.id) return;
        setMessage("Saving draft…");
        startTransition(async () => {
            const response = await fetch(`/api/admin/outreach/${draft.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject,
                    bodyText,
                    recipient: {
                        name: recipientName || null,
                        role: recipientRole || null,
                        email: recipientEmail || null,
                    },
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Save failed.");
                return;
            }
            setDraft(result.draft);
            setMessage("Draft saved.");
            router.refresh();
        });
    }

    async function runAction(action: "approve" | "reject" | "archive" | "regenerate") {
        if (!draft?.id) return;
        setMessage(
            action === "approve"
                ? "Approving draft…"
                : action === "reject"
                  ? "Rejecting draft…"
                  : action === "archive"
                    ? "Archiving draft…"
                    : "Regenerating draft…",
        );
        startTransition(async () => {
            const response = await fetch(`/api/admin/outreach/${draft.id}/${action}`, {
                method: "POST",
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                setMessage(result.error?.message ?? "Action failed.");
                return;
            }
            if (result.draft) {
                setDraft(result.draft);
                setSubject(result.draft.subject);
                setBodyText(result.draft.bodyText);
            }
            setMessage(
                action === "approve"
                    ? "Draft approved."
                    : action === "reject"
                      ? "Draft rejected."
                      : action === "archive"
                        ? "Draft archived."
                        : "New draft generated.",
            );
            router.refresh();
        });
    }

    async function copyText(label: string, text: string) {
        try {
            await navigator.clipboard.writeText(text);
            setMessage(`${label} copied.`);
        } catch {
            setMessage(`Unable to copy ${label.toLowerCase()}.`);
        }
    }

    const activeDraft = draft ?? initialDraft ?? null;

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium text-base-content">Recipient name</span>
                    <input
                        className="input input-bordered input-sm w-full"
                        value={recipientName}
                        onChange={(event) => setRecipientName(event.target.value)}
                        placeholder="Optional"
                    />
                </label>
                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium text-base-content">Recipient role</span>
                    <input
                        className="input input-bordered input-sm w-full"
                        value={recipientRole}
                        onChange={(event) => setRecipientRole(event.target.value)}
                        placeholder="Optional"
                    />
                </label>
                <label className="grid grid-cols-1 gap-2 text-sm md:col-span-2">
                    <span className="font-medium text-base-content">Recipient email</span>
                    <input
                        className="input input-bordered input-sm w-full"
                        value={recipientEmail}
                        onChange={(event) => setRecipientEmail(event.target.value)}
                        placeholder="Optional — not used for sending in this phase"
                    />
                </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium text-base-content">Tone</span>
                    <select
                        className="select select-bordered select-sm w-full"
                        value={strategy.tone}
                        onChange={(event) =>
                            updateStrategy("tone", event.target.value as OutreachStrategy["tone"])
                        }
                    >
                        <option value="friendly">Friendly</option>
                        <option value="professional">Professional</option>
                        <option value="concise">Concise</option>
                        <option value="consultative">Consultative</option>
                    </select>
                </label>
                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium text-base-content">Length</span>
                    <select
                        className="select select-bordered select-sm w-full"
                        value={strategy.length}
                        onChange={(event) =>
                            updateStrategy("length", event.target.value as OutreachStrategy["length"])
                        }
                    >
                        <option value="short">Short</option>
                        <option value="standard">Standard</option>
                        <option value="detailed">Detailed</option>
                    </select>
                </label>
                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium text-base-content">Goal</span>
                    <select
                        className="select select-bordered select-sm w-full"
                        value={strategy.primaryGoal}
                        onChange={(event) =>
                            updateStrategy(
                                "primaryGoal",
                                event.target.value as OutreachStrategy["primaryGoal"],
                            )
                        }
                    >
                        <option value="start-conversation">Start a conversation</option>
                        <option value="share-audit">Share the audit</option>
                        <option value="offer-improvement">Offer an improvement</option>
                        <option value="request-meeting">Request a meeting</option>
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={strategy.includeBusinessCompliment}
                        onChange={(event) =>
                            updateStrategy("includeBusinessCompliment", event.target.checked)
                        }
                    />
                    Include a genuine strength
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={strategy.includeQuickWin}
                        onChange={(event) => updateStrategy("includeQuickWin", event.target.checked)}
                    />
                    Include one quick win
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={strategy.includeScore}
                        onChange={(event) => updateStrategy("includeScore", event.target.checked)}
                    />
                    Include overall score
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={strategy.includePageSpeed}
                        onChange={(event) => updateStrategy("includePageSpeed", event.target.checked)}
                    />
                    Include PageSpeed results
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={strategy.includePdfReference}
                        onChange={(event) =>
                            updateStrategy("includePdfReference", event.target.checked)
                        }
                    />
                    Reference the PDF
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={strategy.includePublicReport}
                        onChange={(event) =>
                            updateStrategy("includePublicReport", event.target.checked)
                        }
                    />
                    Reference the public report
                </label>
            </div>

            {availablePdfReports.length > 0 ? (
                <label className="grid grid-cols-1 gap-2 text-sm">
                    <span className="font-medium text-base-content">PDF version</span>
                    <select
                        className="select select-bordered select-sm w-full"
                        value={pdfReportId}
                        onChange={(event) => setPdfReportId(event.target.value)}
                    >
                        <option value="">No PDF selected</option>
                        {availablePdfReports.map((pdf) => (
                            <option key={pdf.id} value={pdf.id}>
                                {pdf.filename} (revision {pdf.revision})
                            </option>
                        ))}
                    </select>
                </label>
            ) : null}

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={!canGenerate || isPending}
                    onClick={generate}
                >
                    {isPending ? "Generating…" : "Generate email draft"}
                </button>
                {activeDraft?.id ? (
                    <>
                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            disabled={isPending || activeDraft.status !== "draft"}
                            onClick={saveDraft}
                        >
                            Save draft
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            disabled={isPending}
                            onClick={() => copyText("Subject", subject)}
                        >
                            Copy subject
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            disabled={isPending}
                            onClick={() => copyText("Email body", bodyText)}
                        >
                            Copy body
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            disabled={isPending}
                            onClick={() => copyText("Complete email", `Subject: ${subject}\n\n${bodyText}`)}
                        >
                            Copy complete email
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={isPending}
                            onClick={() => runAction("regenerate")}
                        >
                            Regenerate
                        </button>
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            disabled={isPending || activeDraft.status !== "draft"}
                            onClick={() => runAction("approve")}
                        >
                            Approve
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            disabled={isPending || activeDraft.status !== "draft"}
                            onClick={() => runAction("reject")}
                        >
                            Reject
                        </button>
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={isPending || activeDraft.status === "archived"}
                            onClick={() => runAction("archive")}
                        >
                            Archive
                        </button>
                    </>
                ) : null}
            </div>

            {message ? (
                <p className="text-sm text-base-content/75" role="status">
                    {message}
                </p>
            ) : null}

            <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-base-content">Email preview</h3>
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-base-content/80">
                    <p>
                        <span className="font-medium text-base-content">To:</span>{" "}
                        {recipientEmail || "Not selected"}
                    </p>
                    <label className="grid grid-cols-1 gap-2">
                        <span className="font-medium text-base-content">Subject</span>
                        <input
                            className="input input-bordered input-sm w-full"
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                        />
                    </label>
                    <label className="grid grid-cols-1 gap-2">
                        <span className="font-medium text-base-content">Body</span>
                        <textarea
                            className="textarea textarea-bordered min-h-48 w-full"
                            value={bodyText}
                            onChange={(event) => setBodyText(event.target.value)}
                        />
                    </label>
                </div>
            </div>

            {activeDraft?.evidence?.length ? (
                <div className="rounded-xl bg-base-200 p-4 shadow-sm">
                    <h3 className="text-sm font-medium text-base-content">Evidence used</h3>
                    <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-base-content/80">
                        {activeDraft.evidence.map((item) => (
                            <li key={`${item.type}-${item.label}`}>
                                <span className="font-medium text-base-content">✓ {item.label}</span>
                                {item.sourcePath ? (
                                    <span className="text-base-content/65"> · Source: {item.sourcePath}</span>
                                ) : null}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {activeDraft?.claimWarnings?.length ? (
                <div className="alert alert-warning">
                    <div className="grid grid-cols-1 gap-1 text-sm">
                        <p className="font-medium">Claim warnings</p>
                        {activeDraft.claimWarnings.map((warning) => (
                            <p key={`${warning.code}-${warning.message}`}>{warning.message}</p>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
