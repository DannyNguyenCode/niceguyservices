type MetricCardProps = {
    label: string;
    value: string;
    hint?: string | null;
};

export default function MetricCard({ label, value, hint }: MetricCardProps) {
    return (
        <div className="rounded-2xl bg-base-200 p-5 shadow-sm">
            <p className="text-sm text-base-content/60">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-base-content">{value}</p>
            {hint ? <p className="mt-2 text-sm text-base-content/65">{hint}</p> : null}
        </div>
    );
}
