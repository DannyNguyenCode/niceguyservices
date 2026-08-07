"use client";

type AuditFailureStateProps = {
    domain: string | null;
    onTryAgain: () => void;
};

export default function AuditFailureState({ domain, onTryAgain }: AuditFailureStateProps) {
    return (
        <div className="rounded-2xl border border-error/25 bg-error/5 p-5 sm:p-6" role="alert">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-error">
                We couldn&apos;t complete your audit
            </p>
            <h3 className="mt-2 text-xl font-semibold text-base-content">
                Something interrupted the audit
            </h3>
            {domain ? (
                <p className="mt-1 text-sm font-medium text-base-content/80">{domain}</p>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-base-content/75">
                Something interrupted the audit while we were analyzing your website. Please try
                again later, or contact us if you need help.
            </p>
            <div className="mt-5">
                <button type="button" className="btn btn-primary" onClick={onTryAgain}>
                    Try again
                </button>
            </div>
        </div>
    );
}
