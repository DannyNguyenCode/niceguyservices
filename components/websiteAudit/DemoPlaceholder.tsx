import { DEMO_DISCLAIMER_TEXT } from "@/src/services/demo/constants";

type DemoPlaceholderProps = {
    label: string;
    className?: string;
};

export default function DemoPlaceholder({ label, className = "" }: DemoPlaceholderProps) {
    return (
        <span
            className={`inline-flex rounded-md border border-dashed border-warning/60 bg-warning/10 px-2 py-1 text-sm font-medium text-warning ${className}`}
        >
            {label}
        </span>
    );
}

export function DemoDisclaimerFooter() {
    return (
        <footer className="rounded-xl bg-base-200 p-4 text-sm text-base-content/80">
            {DEMO_DISCLAIMER_TEXT}
        </footer>
    );
}
