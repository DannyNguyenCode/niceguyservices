type EmptyStateProps = {
    title: string;
    description: string;
    action?: React.ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="rounded-2xl bg-base-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-base-content">{title}</p>
            <p className="mt-2 text-sm leading-relaxed text-base-content/75">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}
