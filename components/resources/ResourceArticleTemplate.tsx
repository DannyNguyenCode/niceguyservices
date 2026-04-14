import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon, LightBulbIcon } from "@heroicons/react/24/outline";

export type ResourceComparisonBar = {
    label: string;
    valueLabel: string;
    fillPercent: number;
    variant?: "primary" | "secondary";
};

type ResourceArticleTemplateProps = {
    seriesBadge: string;
    title: ReactNode;
    updatedIso: string;
    updatedLabel: string;
    heroImage: { src: string; alt: string };
    executiveSummary?: string;
    children: ReactNode;
    comparisonBars?: ResourceComparisonBar[];
    expertTip?: { title: string; body: string };
    cta: {
        title: string;
        body: string;
        primary: { href: string; label: string };
        secondary?: { href: string; label: string };
    };
};

export default function ResourceArticleTemplate({
    seriesBadge,
    title,
    updatedIso,
    updatedLabel,
    heroImage,
    executiveSummary,
    children,
    comparisonBars,
    expertTip,
    cta,
}: ResourceArticleTemplateProps) {
    return (
        <div className="bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
            <main className="mx-auto max-w-5xl px-6 pt-28 pb-24 md:px-8">
                <div className="mb-12">
                    <Link
                        href="/resources"
                        className="group inline-flex items-center gap-2 font-pm-headline font-medium tracking-tight text-primary transition-opacity hover:opacity-70"
                    >
                        <ArrowLeftIcon className="h-4 w-4 shrink-0" aria-hidden />
                        Back to resources
                    </Link>
                </div>

                <header className="mb-20">
                    <div className="mb-6 inline-block rounded-full bg-secondary px-3 py-1 font-pm-headline text-[10px] tracking-widest text-secondary-content uppercase">
                        {seriesBadge}
                    </div>
                    <h1 className="font-pm-headline mb-8 text-5xl leading-tight font-bold tracking-tighter md:text-7xl">
                        {title}
                    </h1>
                    <div className="flex items-center gap-4 font-pm-headline text-sm tracking-widest text-(--pm-on-surface-variant) uppercase">
                        <span>Last updated</span>
                        <span
                            className="h-px w-8 bg-(--pm-outline-variant)/30"
                            aria-hidden
                        />
                        <time
                            dateTime={updatedIso}
                            className="text-(--pm-on-surface)"
                        >
                            {updatedLabel}
                        </time>
                    </div>
                </header>

                <div className="relative mb-20">
                    <div className="aspect-21/9 w-full overflow-hidden rounded-xl bg-(--pm-surface-container)">
                        <Image
                            src={heroImage.src}
                            alt={heroImage.alt}
                            width={1200}
                            height={514}
                            className="h-full w-full object-cover"
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            priority
                        />
                    </div>
                    {executiveSummary ? (
                        <div className="absolute -right-6 -bottom-6 hidden max-w-xs lg:block">
                            <div className="rounded-xl border border-(--pm-outline-variant)/15 bg-base-100/60 p-8 shadow-[0px_12px_32px_rgba(44,47,48,0.06)] backdrop-blur-xl dark:bg-base-100/70">
                                <p className="font-pm-headline mb-2 text-xs tracking-widest text-primary uppercase">
                                    Executive summary
                                </p>
                                <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                                    {executiveSummary}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>

                <article className="grid grid-cols-1 gap-12 md:grid-cols-12">
                    <div className="space-y-12 md:col-span-8">{children}</div>

                    <aside className="space-y-8 md:col-span-4">
                        {comparisonBars && comparisonBars.length > 0 ? (
                            <div className="rounded-xl bg-(--pm-white) p-8 shadow-[0px_12px_32px_rgba(44,47,48,0.06)] dark:bg-base-100">
                                <h2 className="font-pm-headline mb-6 text-lg font-bold">
                                    Quick comparison
                                </h2>
                                <div className="space-y-6">
                                    {comparisonBars.map((row) => (
                                        <div key={row.label}>
                                            <div className="mb-2 flex justify-between font-pm-headline text-xs tracking-widest uppercase">
                                                <span>{row.label}</span>
                                                <span
                                                    className={
                                                        row.variant ===
                                                        "secondary"
                                                            ? "text-secondary"
                                                            : "text-primary"
                                                    }
                                                >
                                                    {row.valueLabel}
                                                </span>
                                            </div>
                                            <div className="h-1 w-full overflow-hidden rounded-full bg-(--pm-surface-container)">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        row.variant ===
                                                        "secondary"
                                                            ? "bg-secondary"
                                                            : "bg-primary"
                                                    }`}
                                                    style={{
                                                        width: `${Math.min(100, Math.max(0, row.fillPercent))}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                        {expertTip ? (
                            <div className="rounded-xl border border-primary/10 bg-primary/5 p-8">
                                <LightBulbIcon
                                    className="mb-4 h-8 w-8 text-primary"
                                    aria-hidden
                                />
                                <h2 className="font-pm-headline mb-2 text-lg font-bold">
                                    {expertTip.title}
                                </h2>
                                <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                                    {expertTip.body}
                                </p>
                            </div>
                        ) : null}
                    </aside>
                </article>

                <section className="mt-32 border-t border-(--pm-outline-variant)/15 pt-20">
                    <div className="relative overflow-hidden rounded-3xl bg-neutral p-12 text-center">
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.12]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle at 2px 2px, var(--color-neutral-content) 1px, transparent 0)",
                                backgroundSize: "24px 24px",
                            }}
                            aria-hidden
                        />
                        <div className="relative z-10">
                            <h2 className="font-pm-headline mb-4 text-3xl font-bold tracking-tight text-neutral-content md:text-4xl">
                                {cta.title}
                            </h2>
                            <p className="mx-auto mb-8 max-w-xl text-neutral-content/75">
                                {cta.body}
                            </p>
                            <div className="flex flex-col justify-center gap-4 md:flex-row">
                                <Link
                                    href={cta.primary.href}
                                    className="rounded-full bg-primary px-8 py-3 font-pm-headline font-bold text-primary-content transition-opacity hover:opacity-90"
                                >
                                    {cta.primary.label}
                                </Link>
                                {cta.secondary ? (
                                    <Link
                                        href={cta.secondary.href}
                                        className="rounded-full border border-neutral-content/25 px-8 py-3 font-pm-headline font-bold text-neutral-content transition-colors hover:bg-neutral-content/10"
                                    >
                                        {cta.secondary.label}
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export function ResourceSection({
    index,
    accent = "primary",
    title,
    children,
}: {
    index: string;
    accent?: "primary" | "secondary";
    title: ReactNode;
    children: ReactNode;
}) {
    const idxColor =
        accent === "secondary" ? "text-secondary opacity-70" : "text-primary opacity-70";
    return (
        <section>
            <h2 className="font-pm-headline mb-6 flex items-center gap-3 text-3xl font-bold tracking-tight">
                <span className={idxColor}>{index}</span>
                {title}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-(--pm-on-surface-variant)">
                {children}
            </div>
        </section>
    );
}

export function ResourceQuoteCallout({
    title,
    quote,
    icon: Icon,
}: {
    title: string;
    quote: ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
}) {
    const Deco = Icon;
    return (
        <div className="relative overflow-hidden rounded-xl border border-(--pm-outline-variant)/15 bg-base-100/60 p-10 backdrop-blur-xl dark:bg-base-100/50">
            {Deco ? (
                <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden>
                    <Deco className="h-16 w-16 text-(--pm-on-surface)" />
                </div>
            ) : null}
            <h3 className="font-pm-headline mb-4 text-xl font-bold text-primary">
                {title}
            </h3>
            <div className="italic leading-relaxed text-(--pm-on-surface-variant)">
                {quote}
            </div>
        </div>
    );
}

export function ResourceLimitationList({
    items,
}: {
    items: Array<{
        title: string;
        description: string;
        icon: React.ComponentType<{ className?: string }>;
    }>;
}) {
    return (
        <ul className="space-y-4">
            {items.map((item) => {
                const ItemIcon = item.icon;
                return (
                    <li
                        key={item.title}
                        className="flex items-start gap-4 rounded-lg bg-(--pm-surface-low) p-4"
                    >
                        <ItemIcon
                            className="mt-1 h-6 w-6 shrink-0 text-error"
                            aria-hidden
                        />
                        <div>
                            <strong className="font-pm-headline block text-(--pm-on-surface)">
                                {item.title}
                            </strong>
                            <span className="text-sm text-(--pm-on-surface-variant)">
                                {item.description}
                            </span>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
