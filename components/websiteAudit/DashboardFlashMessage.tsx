type DashboardFlashMessageProps = {
    created?: string;
    updated?: string;
    deleted?: string;
};

export default function DashboardFlashMessage({
    created,
    updated,
    deleted,
}: DashboardFlashMessageProps) {
    let message: string | null = null;

    if (created === "1") {
        message = "Website created successfully.";
    } else if (updated === "1") {
        message = "Website updated successfully.";
    } else if (deleted === "1") {
        message = "Website archived successfully.";
    }

    if (!message) return null;

    return (
        <div
            className="mb-6 rounded-2xl bg-success/15 px-4 py-3 text-sm text-base-content shadow-sm"
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
}
