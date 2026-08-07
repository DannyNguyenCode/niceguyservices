type RateLimitAlertProps = {
    message: string;
    resetLabel?: string | null;
    id?: string;
};

export default function RateLimitAlert({
    message,
    resetLabel = null,
    id = "rate-limit-alert",
}: RateLimitAlertProps) {
    return (
        <div
            id={id}
            role="alert"
            aria-live="assertive"
            className="alert alert-warning shadow-sm"
        >
            <div className="grid grid-cols-1 gap-1">
                <p className="text-sm font-medium">{message}</p>
                {resetLabel ? <p className="text-sm opacity-80">{resetLabel}</p> : null}
            </div>
        </div>
    );
}
