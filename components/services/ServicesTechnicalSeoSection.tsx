"use client";

import {
    CloudArrowUpIcon,
    CodeBracketSquareIcon,
    CpuChipIcon,
} from "@heroicons/react/24/solid";
import { pricingLayoutHeadline as headline } from "@/components/pricing/pricingLayoutConstants";

export default function ServicesTechnicalSeoSection() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-16 text-center">
                <span
                    className={`mb-4 block text-xs font-bold tracking-widest uppercase ${headline}`}
                    style={{ color: "var(--pm-secondary)" }}
                >
                    Performance architecture
                </span>
                <h2
                    className={`text-4xl font-bold ${headline}`}
                    style={{ color: "var(--pm-on-surface)" }}
                >
                    Performance &amp; technical SEO
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {(
                    [
                        {
                            Icon: CpuChipIcon,
                            title: "Core Web Vitals",
                            body: "LCP, INP, and CLS tuned for strong rankings and UX.",
                            border: "primary" as const,
                        },
                        {
                            Icon: CodeBracketSquareIcon,
                            title: "Semantic markup",
                            body: "Structured data and clean DOM for clearer crawling.",
                            border: "secondary" as const,
                        },
                        {
                            Icon: CloudArrowUpIcon,
                            title: "Edge caching",
                            body: "SSG and CDN patterns for fast loads globally.",
                            border: "primaryContainer" as const,
                        },
                    ] as const
                ).map((item) => {
                    const SeoIcon = item.Icon;
                    return (
                        <div
                            key={item.title}
                            className="rounded-xl border border-b-4 p-8"
                            style={{
                                backgroundColor: "var(--pm-bento-tile-light)",
                                borderColor: `color-mix(in srgb, var(--pm-outline-variant) 12%, transparent)`,
                                borderBottomColor:
                                    item.border === "primary"
                                        ? "var(--pm-primary)"
                                        : item.border === "secondary"
                                          ? "var(--pm-secondary)"
                                          : "var(--pm-primary-container)",
                            }}
                        >
                            <SeoIcon
                                className="mb-6 block h-10 w-10"
                                style={{
                                    color:
                                        item.border === "primary"
                                            ? "var(--pm-primary)"
                                            : item.border === "secondary"
                                              ? "var(--pm-secondary)"
                                              : "var(--pm-primary-container)",
                                }}
                                aria-hidden
                            />
                            <h4 className={`mb-4 text-xl font-bold ${headline}`}>{item.title}</h4>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: "var(--pm-on-surface-variant)" }}
                            >
                                {item.body}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
