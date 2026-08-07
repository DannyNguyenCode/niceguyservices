import {
    CheckIcon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";

const CHECKS = [
    { label: "Performance", tone: "ok" as const },
    { label: "Accessibility", tone: "ok" as const },
    { label: "Messaging", tone: "flag" as const },
    { label: "Mobile UX", tone: "ok" as const },
];

/**
 * Decorative browser-frame visual for the public audit hero.
 * Uses site theme tokens only.
 */
export default function AuditScanBrowserVisual() {
    return (
        <div className="relative">
            <div
                aria-hidden
                className="absolute -right-3 -top-3 hidden h-full w-full border border-base-300/70 bg-base-200/40 sm:block"
            />
            <div className="relative border border-base-300 bg-base-100 shadow-sm">
                <div className="flex items-center gap-3 border-b border-base-300 px-3 py-2.5">
                    <div className="flex gap-1.5" aria-hidden>
                        <span className="size-2 rounded-full bg-error/70" />
                        <span className="size-2 rounded-full bg-base-content/30" />
                        <span className="size-2 rounded-full bg-primary/70" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center gap-2 border border-base-300 bg-base-200/60 px-2 py-1">
                        <GlobeAltIcon className="size-3 shrink-0 text-primary" aria-hidden />
                        <span className="truncate text-[11px] text-base-content/60">
                            example.com
                        </span>
                    </div>
                    <span className="hidden shrink-0 text-[10px] uppercase tracking-wide text-base-content/50 sm:block">
                        scanning
                    </span>
                </div>

                <div className="relative overflow-hidden bg-base-200/40 px-5 py-6">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/80"
                    />
                    <div className="space-y-3" aria-hidden>
                        <div className="h-3 w-2/5 bg-base-content/20" />
                        <div className="h-2 w-4/5 bg-base-content/10" />
                        <div className="h-2 w-3/5 bg-base-content/10" />
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="space-y-2 border border-base-300 p-2">
                                    <div className="h-8 bg-base-content/8" />
                                    <div className="h-1.5 w-full bg-base-content/15" />
                                    <div className="h-1.5 w-2/3 bg-base-content/10" />
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="h-6 w-24 bg-primary/25" />
                            <div className="h-6 w-20 border border-primary/50" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-px border-t border-base-300 bg-base-300">
                    {CHECKS.map((check) => (
                        <div
                            key={check.label}
                            className="flex items-center gap-2 bg-base-100 px-3 py-2.5 text-xs"
                        >
                            {check.tone === "ok" ? (
                                <CheckIcon
                                    className="size-3.5 shrink-0 text-primary"
                                    aria-hidden
                                />
                            ) : (
                                <span
                                    className="grid size-3.5 shrink-0 place-items-center"
                                    aria-hidden
                                >
                                    <span className="size-2 bg-warning" />
                                </span>
                            )}
                            <span className="truncate text-base-content/65">{check.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
