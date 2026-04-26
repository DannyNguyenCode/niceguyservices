"use client";

import pricingContent from "./pricingContent.json";
import { pricingLayoutHeadline as headline } from "./pricingLayoutConstants";
import { packageIncludeIcons, type PackageIncludeIconKey } from "./pricingIconMaps";

type IncludeItem = (typeof pricingContent.packages)[number]["includes"][number];

type IncludeTone = "pricingCard" | "homeLight" | "homeDark";

function isIncludeIconKey(k: string): k is PackageIncludeIconKey {
    return k in packageIncludeIcons;
}

function IncludeRow({ item, tone }: { item: IncludeItem; tone: IncludeTone }) {
    const iconKey = isIncludeIconKey(item.icon) ? item.icon : "check";
    const Icon = packageIncludeIcons[iconKey];

    if ("callout" in item && item.callout) {
        return (
            <li
                className="flex items-start gap-3 rounded-lg p-3 text-sm italic leading-relaxed"
                style={{
                    backgroundColor: "var(--pm-surface-low)",
                    color: "var(--pm-on-surface-variant)",
                }}
            >
                <Icon
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: "var(--pm-on-surface-variant)" }}
                    aria-hidden
                />
                <span>{item.text}</span>
            </li>
        );
    }

    const iconStyle =
        tone === "homeDark"
            ? { color: "var(--color-secondary)" }
            : { color: "var(--pm-primary)" };

    const textClass = "semibold" in item && item.semibold ? "font-semibold" : undefined;

    const textStyle =
        tone === "homeDark"
            ? { color: "color-mix(in srgb, var(--color-neutral-content) 88%, transparent)" }
            : { color: "var(--pm-on-surface)" };

    return (
        <li className="flex items-start gap-3 text-base">
            <Icon
                className="mt-0.5 h-5 w-5 shrink-0"
                style={iconStyle}
                aria-hidden
            />
            <span className={textClass} style={textStyle}>
                {item.text}
            </span>
        </li>
    );
}

export function PackageIncludesList({
    items,
    tone,
    title,
    layout = "sequential",
    maxRegular,
}: {
    items: IncludeItem[];
    tone: IncludeTone;
    title: string;
    layout?: "sequential" | "home";
    maxRegular?: number;
}) {
    const titleColor =
        tone === "homeDark"
            ? "color-mix(in srgb, var(--color-neutral-content) 75%, transparent)"
            : "var(--pm-on-surface)";

    if (layout === "home" && maxRegular !== undefined) {
        const regular = items.filter((i) => !("callout" in i && i.callout));
        const callouts = items.filter((i) => "callout" in i && i.callout);
        const capped = regular.slice(0, maxRegular);

        return (
            <div>
                <p
                    className={`mb-4 text-xs font-bold tracking-widest uppercase ${headline}`}
                    style={{ color: titleColor }}
                >
                    {title}
                </p>
                <ul className="flex grow flex-col gap-4">
                    {capped.map((item) => (
                        <IncludeRow key={item.text} item={item} tone={tone} />
                    ))}
                </ul>
                {callouts[0] ? (
                    <ul className="mt-4 flex flex-col gap-4">
                        {callouts.map((item) => (
                            <IncludeRow key={item.text} item={item} tone={tone} />
                        ))}
                    </ul>
                ) : null}
            </div>
        );
    }

    return (
        <div className="mb-10">
            <p
                className={`mb-4 text-xs font-bold tracking-widest uppercase ${headline}`}
                style={{ color: titleColor }}
            >
                {title}
            </p>
            <ul className="flex grow flex-col gap-4">
                {items.map((item) => (
                    <IncludeRow key={item.text} item={item} tone={tone} />
                ))}
            </ul>
        </div>
    );
}
