type PixelBrowserProps = {
    className?: string;
};

export default function PixelBrowser({ className = "" }: PixelBrowserProps) {
    return (
        <svg
            viewBox="0 0 480 380"
            aria-hidden="true"
            focusable="false"
            className={`h-full w-full ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <rect
                x="8"
                y="8"
                width="464"
                height="364"
                rx="12"
                fill="var(--ng-card)"
                stroke="var(--ng-border)"
                strokeWidth="2"
            />
            <rect x="8" y="8" width="464" height="36" rx="12" fill="var(--pm-surface-high)" />
            <rect x="8" y="32" width="464" height="12" fill="var(--pm-surface-high)" />
            <circle cx="28" cy="26" r="5" fill="var(--brand-coral)" opacity="0.85" />
            <circle cx="46" cy="26" r="5" fill="var(--brand-secondary)" opacity="0.85" />
            <circle cx="64" cy="26" r="5" fill="var(--brand-green)" opacity="0.85" />
            <rect x="88" y="18" width="200" height="16" rx="4" fill="var(--pm-surface-container)" />
            <rect x="24" y="56" width="432" height="48" rx="4" fill="var(--pm-surface-low)" />

            <g className="max-sm:hidden">
                <rect x="24" y="120" width="180" height="120" fill="var(--brand-pixel-fill)" opacity="0.35" />
                {Array.from({ length: 8 }).map((_, row) =>
                    Array.from({ length: 10 }).map((__, col) => (
                        <rect
                            key={`${row}-${col}`}
                            x={28 + col * 18}
                            y={124 + row * 14}
                            width="6"
                            height="6"
                            fill="var(--brand-pixel-fill)"
                        />
                    )),
                )}
                <rect x="220" y="190" width="100" height="64" rx="4" fill="var(--brand-primary-bright)" opacity="0.2" />
                {Array.from({ length: 4 }).map((_, row) =>
                    Array.from({ length: 5 }).map((__, col) => (
                        <rect
                            key={`m-${row}-${col}`}
                            x={228 + col * 18}
                            y={198 + row * 14}
                            width="5"
                            height="5"
                            fill="var(--brand-primary)"
                            opacity="0.55"
                        />
                    )),
                )}
                <rect x="336" y="190" width="120" height="64" rx="4" fill="var(--pm-surface-container)" />
                <rect x="348" y="204" width="96" height="6" rx="1" fill="var(--ng-heading)" opacity="0.12" />
                <rect x="348" y="218" width="72" height="6" rx="1" fill="var(--ng-heading)" opacity="0.08" />
            </g>

            <g className="sm:hidden">
                <rect x="24" y="120" width="432" height="140" rx="4" fill="var(--pm-surface-container)" opacity="0.5" />
                <rect x="40" y="140" width="200" height="8" rx="2" fill="var(--brand-pixel-fill)" opacity="0.45" />
                <rect x="40" y="158" width="160" height="6" rx="2" fill="var(--ng-heading)" opacity="0.12" />
                <rect x="40" y="190" width="120" height="48" rx="4" fill="var(--brand-primary-bright)" opacity="0.2" />
            </g>

            <rect x="220" y="120" width="236" height="12" rx="2" fill="var(--ng-heading)" opacity="0.15" className="max-sm:hidden" />
            <rect x="220" y="142" width="200" height="8" rx="2" fill="var(--ng-heading)" opacity="0.1" className="max-sm:hidden" />
            <rect x="220" y="158" width="160" height="8" rx="2" fill="var(--ng-heading)" opacity="0.08" className="max-sm:hidden" />

            <rect x="24" y="280" width="432" height="72" rx="4" fill="var(--pm-surface-low)" />
            <rect x="40" y="300" width="120" height="8" rx="2" fill="var(--brand-pixel-fill)" opacity="0.5" />
            <rect x="40" y="316" width="90" height="6" rx="2" fill="var(--ng-heading)" opacity="0.1" />
        </svg>
    );
}
