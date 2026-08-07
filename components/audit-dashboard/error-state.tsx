type ErrorStateProps = {
    stage: string;
    errorCode?: string | null;
    errorMessage?: string | null;
    failedAt?: string | null;
    retryAction?: React.ReactNode;
};

export default function ErrorState({
    stage,
    errorCode,
    errorMessage,
    failedAt,
    retryAction,
}: ErrorStateProps) {
    return (
        <div className="rounded-2xl border border-error/30 bg-error/5 p-5 shadow-sm" role="alert">
            <p className="text-sm font-medium text-error">{stage} failed</p>
            {errorCode ? (
                <p className="mt-2 text-sm text-base-content/70">
                    Code: <span className="font-mono">{errorCode}</span>
                </p>
            ) : null}
            {errorMessage ? (
                <p className="mt-2 text-sm text-base-content/80">{errorMessage}</p>
            ) : null}
            {failedAt ? (
                <p className="mt-2 text-sm text-base-content/60">Failed at {failedAt}</p>
            ) : null}
            {retryAction ? <div className="mt-4">{retryAction}</div> : null}
        </div>
    );
}
