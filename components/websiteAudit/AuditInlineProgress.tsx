"use client";

import PublicAuditProgressStages from "@/components/websiteAudit/PublicAuditProgressStages";
import type { PublicAuditProgressStageView } from "@/components/websiteAudit/public-audit-submit-status";

export const AUDIT_INLINE_LEAVE_GUIDANCE = {
    title: "You don't need to wait here",
    body: "Your audit will continue automatically even if you leave this page. Come back anytime and enter your email to securely retrieve your audit when it is ready.",
} as const;

type AuditInlineProgressProps = {
    domain: string;
    message: string;
    stages: PublicAuditProgressStageView[];
    pollTransientError?: boolean;
    onRetrieveAudit?: () => void;
};

export default function AuditInlineProgress({
    domain,
    message,
    stages,
    pollTransientError = false,
    onRetrieveAudit,
}: AuditInlineProgressProps) {
    return (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
            <div role="status" aria-live="polite" aria-atomic="false">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    Audit in progress
                </p>
                <h3 className="mt-2 text-xl font-semibold text-base-content">
                    We&apos;re auditing your website
                </h3>
                <p className="mt-1 text-sm font-medium text-base-content/80">{domain}</p>
                <p className="mt-3 text-sm leading-relaxed text-base-content/70">{message}</p>

                <div className="mt-5">
                    <PublicAuditProgressStages stages={stages} />
                </div>
            </div>

            <div className="mt-6 border-t border-base-300 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/55">
                    {AUDIT_INLINE_LEAVE_GUIDANCE.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                    {AUDIT_INLINE_LEAVE_GUIDANCE.body}
                </p>
                {onRetrieveAudit ? (
                    <button
                        type="button"
                        className="btn btn-link btn-sm mt-3 px-0"
                        onClick={onRetrieveAudit}
                    >
                        Retrieve my audit
                    </button>
                ) : null}
            </div>

            {pollTransientError ? (
                <p className="mt-4 text-sm text-base-content/65" aria-live="polite">
                    We&apos;re still checking your audit progress. A temporary connection issue
                    occurred — retrying.
                </p>
            ) : null}
        </div>
    );
}
