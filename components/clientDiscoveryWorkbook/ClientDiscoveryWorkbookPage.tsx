"use client";

import { useCallback, useEffect, useState } from "react";
import { WORKBOOK_CONTENT } from "@/lib/clientDiscoveryWorkbook/content";
import {
    clearWorkbookDraft,
    loadWorkbookDraft,
    saveWorkbookDraft,
} from "@/lib/clientDiscoveryWorkbook/storage";
import type { WorkbookAnswers } from "@/lib/clientDiscoveryWorkbook/types";
import {
    downloadWorkbookJson,
    validateWorkbook,
} from "@/lib/clientDiscoveryWorkbook/validation";
import { WorkbookStickyActions } from "./WorkbookActions";
import { WorkbookHero } from "./WorkbookHero";
import { WorkbookSection } from "./WorkbookSection";
import {
    workbookCardClass,
    workbookContentClass,
    workbookPrimaryBtnClass,
} from "./workbookLayoutConstants";
import { useWorkbookSectionScrollSpy } from "./useWorkbookSectionScrollSpy";
import { useWorkbookPdf } from "./useWorkbookPdf";
import { WorkbookPdfPreviewModal } from "./WorkbookPdfPreviewModal";

function emptyAnswers(): WorkbookAnswers {
    const answers: WorkbookAnswers = {};
    for (const section of WORKBOOK_CONTENT.sections) {
        for (const field of section.fields) {
            answers[field.name] = "";
        }
    }
    return answers;
}

export default function ClientDiscoveryWorkbookPage() {
    const [answers, setAnswers] = useState<WorkbookAnswers>(emptyAnswers);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saveMessage, setSaveMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submittedAt, setSubmittedAt] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const {
        pdfBusy,
        pdfError,
        pdfPreview,
        openPdfPreview,
        closePdfPreview,
        downloadPdfPreview,
        printPdfPreview,
    } = useWorkbookPdf(answers);
    const { activeSectionId, scrollToSection } = useWorkbookSectionScrollSpy(
        hydrated && submittedAt === null,
    );

    useEffect(() => {
        const draft = loadWorkbookDraft();
        if (draft) {
            setAnswers((prev) => ({ ...prev, ...draft }));
        }
        setHydrated(true);
    }, []);

    const handleChange = useCallback((name: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => {
            if (!prev[name]) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });
        setSaveMessage(null);
    }, []);

    const handleSaveProgress = useCallback(() => {
        saveWorkbookDraft(answers);
        setSaveMessage("Progress saved on this device.");
    }, [answers]);

    const handleClearAll = useCallback(() => {
        const confirmed = window.confirm(
            "Clear all answers and saved progress on this device? This cannot be undone.",
        );
        if (!confirmed) return;

        clearWorkbookDraft();
        setAnswers(emptyAnswers());
        setErrors({});
        setSaveMessage(null);
        setSubmitError(null);
    }, []);

    const scrollToForm = useCallback(() => {
        document.getElementById("workbook-form")?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleSubmit = useCallback(async () => {
        const validationErrors = validateWorkbook(answers);
        setErrors(validationErrors);
        setSubmitError(null);

        if (Object.keys(validationErrors).length > 0) {
            const firstKey = Object.keys(validationErrors)[0];
            const field = document.getElementById(`workbook-${firstKey}`);
            field?.scrollIntoView({ behavior: "smooth", block: "center" });
            field?.focus();
            return;
        }

        setSubmitting(true);
        const iso = new Date().toISOString();

        try {
            const res = await fetch("/api/client-discovery-workbook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, submittedAt: iso }),
            });
            const data = (await res.json()) as { error?: string };

            if (!res.ok) {
                setSubmitError(data.error ?? "Submission failed. Please try again.");
                return;
            }

            setSubmittedAt(iso);
            clearWorkbookDraft();
            downloadWorkbookJson(answers, iso, answers.businessName);
        } catch {
            setSubmitError("Network error. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    }, [answers]);

    if (!hydrated) {
        return (
            <div className="client-discovery-workbook min-h-[40vh] bg-(--pm-surface) font-pm-body text-(--pm-on-surface)" />
        );
    }

    if (submittedAt) {
        return (
            <div className="client-discovery-workbook bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
                <div className={`${workbookContentClass} flex flex-col gap-6 py-16 md:py-20`}>
                    <h1 className="font-pm-headline text-lg font-bold text-(--pm-on-surface)">
                        Thank you — workbook received
                    </h1>
                    <p className="text-base leading-relaxed text-(--pm-on-surface-variant)">
                        We received your Client Discovery Workbook and will review your answers
                        before our next conversation. A JSON copy should have downloaded to your
                        device for your records.
                    </p>
                    <p className="text-sm text-(--pm-on-surface-variant)">
                        Submitted {new Date(submittedAt).toLocaleString()}
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            downloadWorkbookJson(answers, submittedAt, answers.businessName)
                        }
                        className="btn btn-outline w-fit border-base-300 font-pm-body font-semibold normal-case hover:border-primary hover:text-primary"
                    >
                        Download JSON again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="client-discovery-workbook bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
            <WorkbookHero page={WORKBOOK_CONTENT.page} />

            <WorkbookStickyActions
                answers={answers}
                activeSectionId={activeSectionId}
                onSectionClick={scrollToSection}
                onCompleteOnline={scrollToForm}
                onDownloadPdf={() => void openPdfPreview(false)}
                onPrintBlank={() => void openPdfPreview(true)}
                onSaveProgress={handleSaveProgress}
                onClearAll={handleClearAll}
                onPrintFilled={() => void openPdfPreview(false)}
                onSubmit={handleSubmit}
                saveMessage={saveMessage}
                submitting={submitting}
                pdfBusy={pdfBusy}
                pdfError={pdfError}
            />

            <form
                id="workbook-form"
                className={`${workbookContentClass} flex flex-col gap-6 py-8 md:gap-8 md:py-10`}
                onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit();
                }}
                noValidate
            >
                {WORKBOOK_CONTENT.sections.map((section, index) => (
                    <WorkbookSection
                        key={section.id}
                        section={section}
                        sectionIndex={index}
                        isActive={section.id === activeSectionId}
                        values={answers}
                        errors={errors}
                        onChange={handleChange}
                    />
                ))}

                {submitError ? (
                    <p className="font-pm-body text-sm text-error" role="alert">
                        {submitError}
                    </p>
                ) : null}

                <div className={`flex flex-col gap-4 ${workbookCardClass}`}>
                    <p className="font-pm-body text-sm leading-relaxed text-(--pm-on-surface-variant)">
                        <strong className="text-(--pm-on-surface)">Privacy:</strong> Information
                        you share here is used only to understand your project, prepare a proposal,
                        and plan your website. It is not sold or used for unrelated marketing.
                    </p>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`${workbookPrimaryBtnClass} w-full md:w-fit`}
                    >
                        {submitting ? "Submitting…" : "Submit workbook"}
                    </button>
                </div>
            </form>

            <WorkbookPdfPreviewModal
                preview={pdfPreview}
                onClose={closePdfPreview}
                onDownload={() => void downloadPdfPreview()}
                onPrint={() => void printPdfPreview()}
            />
        </div>
    );
}
