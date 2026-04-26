"use client";

import {
    BoltIcon,
    ChartBarIcon,
    DevicePhoneMobileIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import {
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

export default function ServicesFeaturedSection() {
    return (
        <section
            className="relative mt-20 overflow-hidden py-24"
            style={{ backgroundColor: "var(--pm-trust-section-bg)" }}
        >
            <div className={`relative z-10 ${sitePageContentClass}`}>
                <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
                    <div className="space-y-8">
                        <div>
                            <h2
                                className={`mb-6 text-4xl font-bold ${headline}`}
                                style={{ color: "var(--pm-on-surface)" }}
                            >
                                Featured: custom website builds
                            </h2>
                            <p
                                className="mb-8 text-lg leading-relaxed"
                                style={{ color: "var(--pm-on-surface-variant)" }}
                            >
                                We don&apos;t just build websites; we engineer digital destinations —
                                semantic code, fast load times, and design that differentiates you from
                                the noise.
                            </p>
                        </div>
                        <div>
                            <h4
                                className={`mb-6 text-xs font-bold tracking-widest uppercase ${headline}`}
                                style={{ color: "var(--pm-primary)" }}
                            >
                                Service includes
                            </h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {(
                                    [
                                        { Icon: BoltIcon, label: "Headless CMS" },
                                        { Icon: DevicePhoneMobileIcon, label: "Responsive focus" },
                                        { Icon: ShieldCheckIcon, label: "SSL & security" },
                                        { Icon: ChartBarIcon, label: "Custom analytics" },
                                    ] as const
                                ).map(({ Icon: IncIcon, label }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-3 rounded-lg border p-4 shadow-sm"
                                        style={{
                                            backgroundColor: "var(--pm-surface-low)",
                                            borderColor: `color-mix(in srgb, var(--pm-outline-variant) 10%, transparent)`,
                                        }}
                                    >
                                        <IncIcon
                                            className="h-5 w-5 shrink-0"
                                            style={{ color: "var(--pm-secondary)" }}
                                            aria-hidden
                                        />
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: "var(--pm-on-surface)" }}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className="relative rounded-2xl border p-8 shadow-xl md:p-12"
                        style={{
                            backgroundColor: "var(--pm-bento-tile-light)",
                            borderColor: `color-mix(in srgb, var(--pm-outline-variant) 12%, transparent)`,
                        }}
                    >
                        <h4
                            className={`mb-10 text-xs font-bold tracking-widest uppercase ${headline}`}
                            style={{ color: "var(--pm-on-surface)" }}
                        >
                            Development process
                        </h4>
                        <div className="relative space-y-10">
                            <div
                                className="absolute top-2 bottom-2 left-4 w-px"
                                style={{
                                    backgroundColor: `color-mix(in srgb, var(--pm-outline-variant) 30%, transparent)`,
                                }}
                                aria-hidden
                            />
                            {(
                                [
                                    ["01", "Discovery", "Goals, audit, and technical scope."],
                                    ["02", "Blueprint", "Architecture, wireframes, design system."],
                                    ["03", "Execution", "Engineering, CMS integration, performance."],
                                    ["04", "Deployment", "Staging, QA, and launch."],
                                ] as const
                            ).map(([num, title, desc]) => (
                                <div key={num} className="relative pl-12">
                                    <div
                                        className={`absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${headline}`}
                                        style={{
                                            backgroundColor: "var(--pm-primary)",
                                            color: "var(--pm-on-primary)",
                                            boxShadow: `0 0 0 8px var(--pm-bento-tile-light)`,
                                        }}
                                    >
                                        {num}
                                    </div>
                                    <h5 className={`mb-1 text-lg font-bold ${headline}`}>{title}</h5>
                                    <p className="text-sm" style={{ color: "var(--pm-on-surface-variant)" }}>
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
