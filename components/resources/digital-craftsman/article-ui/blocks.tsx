import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { DigitalCraftsmanAuditButton } from "../DigitalCraftsmanChrome";
import MaterialIcon from "../MaterialIcon";
import type { DcNextStep } from "../types";
import { formatArticleDate } from "../formatArticleDate";
import { DC_H2, DC_H2_DESKTOP, DC_H3_DISPLAY, DC_SECTION, DC_TINT } from "./styles";

function cn(...parts: (string | undefined | false)[]) {
    return parts.filter(Boolean).join(" ");
}

export function DcSection({
    children,
    tint,
    className,
    id,
}: {
    children: ReactNode;
    tint?: keyof typeof DC_TINT;
    className?: string;
    id?: string;
}) {
    return (
        <section id={id} className={cn(DC_SECTION, tint && DC_TINT[tint], className)}>
            {children}
        </section>
    );
}

export function DcDesktopSection({
    children,
    id,
    className = "mb-16",
}: {
    children: ReactNode;
    id?: string;
    className?: string;
}) {
    return (
        <section id={id} className={className}>
            {children}
        </section>
    );
}

export function DcH2({ children, className }: { children: ReactNode; className?: string }) {
    return <h2 className={cn(DC_H2, className)}>{children}</h2>;
}

export function DcH2Desktop({ children }: { children: ReactNode }) {
    return <h2 className={DC_H2_DESKTOP}>{children}</h2>;
}

export function DcMobileHero({
    badge,
    readTime,
    title,
    subtitle,
    dateModified,
}: {
    badge: string;
    readTime: string;
    title: string;
    subtitle: string;
    dateModified: string;
}) {
    return (
        <DcSection tint="hero">
            <div className="mb-6 flex flex-wrap gap-2">
                <span className="rounded bg-[rgb(107_142_131/0.1)] px-3 py-1 text-sm font-medium tracking-wide text-[#416359]">
                    {badge}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 text-sm text-[#414845]">
                    <MaterialIcon name="schedule" className="!text-base" />
                    {readTime}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 text-sm text-[#414845]">
                    <MaterialIcon name="update" className="!text-base" />
                    Updated {formatArticleDate(dateModified)}
                </span>
            </div>
            <h1 className="dc-display mb-4 text-[28px] leading-[1.2] font-semibold tracking-tight text-[#1b1c1c] md:text-[48px] md:leading-[1.1]">
                {title}
            </h1>
            <p className="text-lg italic text-[#414845]">{subtitle}</p>
        </DcSection>
    );
}

export function DcDesktopHero({
    category,
    title,
    readTime,
    dateModified,
}: {
    category: string;
    title: string;
    readTime: string;
    dateModified: string;
}) {
    return (
        <header className="mb-8 border-b border-[#c1c8c4] pb-8">
            <div className="mb-4 inline-block rounded bg-[#eae8e7] px-3 py-1">
                <span className="text-sm font-medium tracking-wide text-[#416359] uppercase">
                    {category}
                </span>
            </div>
            <h1 className="dc-display mb-4 text-[48px] leading-[1.1] font-semibold tracking-tight text-[#1b1c1c]">
                {title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-[#414845]">
                <div className="flex items-center gap-1">
                    <MaterialIcon name="schedule" className="!text-base" />
                    <span>{readTime}</span>
                </div>
                <span aria-hidden>•</span>
                <div className="flex items-center gap-1">
                    <MaterialIcon name="update" className="!text-base" />
                    <span>Updated {formatArticleDate(dateModified)}</span>
                </div>
            </div>
        </header>
    );
}

export function DcDropCap({ letter, children }: { letter: string; children: ReactNode }) {
    return (
        <p className="text-lg">
            <span className="dc-display float-left mr-3 text-5xl leading-none text-[#416359]">
                {letter}
            </span>
            {children}
        </p>
    );
}

export function DcProse({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("text-base leading-relaxed text-[#1b1c1c]", className)}>{children}</div>
    );
}

export function DcDottedLine() {
    return <span className="dc-dotted-line" aria-hidden />;
}

export function DcIconList({
    items,
    icon = "check_circle",
}: {
    items: readonly string[];
    icon?: string;
}) {
    return (
        <ul className="space-y-2">
            {items.map((text) => (
                <li key={text} className="flex items-start gap-2">
                    <MaterialIcon name={icon} className="mt-0.5 shrink-0 text-[#416359]" />
                    <span>{text}</span>
                </li>
            ))}
        </ul>
    );
}

export function DcCodeList({ items }: { items: readonly string[] }) {
    return (
        <ul className="space-y-1">
            {items.map((text) => (
                <li key={text} className="dc-code text-sm text-[#414845]">
                    &quot;{text}&quot;
                </li>
            ))}
        </ul>
    );
}

export function DcAvoidTry({ avoid, tryText }: { avoid: string; tryText: string }) {
    return (
        <div className="flex flex-col gap-4 rounded-lg bg-[#f0eded] p-4 md:flex-row">
            <div className="flex-1">
                <span className="mb-1 block text-sm font-medium tracking-wide text-[#ba1a1a]">
                    Avoid:
                </span>
                <div className="border-l-2 border-[#ba1a1a] pl-3 dc-code text-sm">{avoid}</div>
            </div>
            <div className="flex-1">
                <span className="mb-1 block text-sm font-medium tracking-wide text-[#416359]">
                    Try:
                </span>
                <div className="border-l-2 border-[#416359] pl-3 dc-code text-sm">{tryText}</div>
            </div>
        </div>
    );
}

export function DcComparisonCards({
    left,
    right,
}: {
    left: { title: string; labelLeft: string; labelRight: string; body: string };
    right: { title: string; labelLeft: string; labelRight: string; body: string; highlight?: boolean };
}) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-[#c1c8c4] bg-white p-6 shadow-sm">
                <h3 className={cn(DC_H3_DISPLAY, "mb-3")}>{left.title}</h3>
                <div className="mb-2 flex items-center text-sm text-[#414845]">
                    <span>{left.labelLeft}</span>
                    <DcDottedLine />
                    <span>{left.labelRight}</span>
                </div>
                <p className="text-[#414845]">{left.body}</p>
            </div>
            <div
                className={cn(
                    "rounded-lg p-6",
                    right.highlight
                        ? "border-2 border-[#416359] bg-[rgb(89_123_113/0.1)]"
                        : "border border-[#c1c8c4] bg-white shadow-sm"
                )}
            >
                <h3
                    className={cn(
                        DC_H3_DISPLAY,
                        "mb-3",
                        right.highlight && "text-[#416359]"
                    )}
                >
                    {right.title}
                </h3>
                <div
                    className={cn(
                        "mb-2 flex items-center text-sm",
                        right.highlight ? "text-[#416359]" : "text-[#414845]"
                    )}
                >
                    <span>{right.labelLeft}</span>
                    <DcDottedLine />
                    <span>{right.labelRight}</span>
                </div>
                <p className="text-[#414845]">{right.body}</p>
            </div>
        </div>
    );
}

export function DcExampleBox({
    label,
    title,
    children,
}: {
    label: string;
    title?: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-lg border border-[#c1c8c4] bg-[#f0eded] p-6">
            <div className="mb-3 flex items-center gap-2">
                <MaterialIcon name="lightbulb" className="text-[#406372]" />
                <span className="text-sm font-medium tracking-wider text-[#406372] uppercase">
                    {label}
                </span>
            </div>
            {title ? <h3 className="dc-display mb-2 text-xl font-medium text-[#416359]">{title}</h3> : null}
            {children}
        </div>
    );
}

export function DcFeatureRows({
    items,
    icon = "check_circle",
}: {
    items: readonly { icon?: string; title: string; body: string }[];
    icon?: string;
}) {
    return (
        <div className="space-y-6">
            {items.map(({ icon: itemIcon, title, body }) => (
                <div key={title} className="flex items-start gap-4">
                    <MaterialIcon
                        name={itemIcon ?? icon}
                        className="rounded bg-[rgb(89_123_113/0.2)] p-2 text-[#416359]"
                    />
                    <div>
                        <p className={DC_H3_DISPLAY}>{title}</p>
                        <p className="text-[#414845]">{body}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function DcQuote({ children }: { children: ReactNode }) {
    return (
        <DcSection tint="quote">
            <div className="relative mx-auto max-w-xl border-y-2 border-[#c1c8c4] py-8 text-center">
                <MaterialIcon
                    name="format_quote"
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fbf9f8] px-4 text-[#416359]"
                />
                <p className="dc-display text-2xl leading-[1.3] text-[#1b1c1c] italic">{children}</p>
            </div>
        </DcSection>
    );
}

export function DcBlockquoteDesktop({ children }: { children: ReactNode }) {
    return (
        <blockquote className="dc-display my-6 border-l-4 border-[#416359] py-2 pl-6 text-2xl leading-[1.3] font-medium text-[#414845] italic">
            {children}
        </blockquote>
    );
}

export function DcChecklist({ items }: { items: readonly string[] }) {
    return (
        <div className="space-y-2">
            {items.map((label) => (
                <label
                    key={label}
                    className="group flex cursor-pointer items-center gap-4 rounded border border-[#c1c8c4] p-4 transition-colors hover:bg-[#f6f3f2]"
                >
                    <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-[#c1c8c4] text-[#416359] focus:ring-[#416359]"
                    />
                    <span className="transition-colors group-hover:text-[#416359]">{label}</span>
                </label>
            ))}
        </div>
    );
}

export function DcMistakes({ items }: { items: readonly { title: string; body: string }[] }) {
    return (
        <div className="space-y-4">
            {items.map(({ title, body }) => (
                <div key={title} className="rounded-r-lg border-l-4 border-[#ba1a1a] bg-white p-6">
                    <h3 className="mb-2 text-sm font-medium tracking-wide text-[#ba1a1a] uppercase">
                        {title}
                    </h3>
                    <p className="text-[#414845]">{body}</p>
                </div>
            ))}
        </div>
    );
}

export function DcWarningBox({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-lg border border-[#ba1a1a] bg-[#ffdad6] p-6 text-[#93000a]">
            <h2 className="dc-display mb-2 flex items-center gap-2 text-2xl leading-[1.3] font-medium">
                <MaterialIcon name="warning" />
                {title}
            </h2>
            {children}
        </div>
    );
}

export function DcTakeaways({ items }: { items: readonly string[] }) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {items.map((text, i) => (
                <div key={text} className="rounded border border-[#c1c8c4] bg-white p-5">
                    <span className="mb-1 block dc-code text-sm text-[#416359]">
                        {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-medium">{text}</p>
                </div>
            ))}
        </div>
    );
}

export function DcTagPills({ tags }: { tags: readonly string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="rounded bg-[rgb(107_142_131/0.1)] px-3 py-1 text-sm text-[#416359]"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

export function DcCtaPills({ labels }: { labels: readonly string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
                <span
                    key={label}
                    className="rounded bg-[#416359] px-4 py-2 text-sm font-medium text-white"
                >
                    {label}
                </span>
            ))}
        </div>
    );
}

export function DcCoverImage({
    src,
    alt,
    heightClass = "h-64",
}: {
    src: string;
    alt: string;
    heightClass?: string;
}) {
    return (
        <div className={cn("relative w-full overflow-hidden rounded border border-[#c1c8c4]", heightClass)}>
            <Image src={src} alt={alt} fill className="object-cover" sizes="672px" />
        </div>
    );
}

export function DcDesktopCoverImage({
    src,
    alt,
    priority,
}: {
    src: string;
    alt: string;
    priority?: boolean;
}) {
    return (
        <Image
            src={src}
            alt={alt}
            width={800}
            height={320}
            className="mb-6 h-80 w-full rounded-xl border border-[#c1c8c4] object-cover"
            priority={priority}
        />
    );
}

export function DcFinalMobile({
    paragraphs,
    ctaLabel = "Get SEO Help",
    footer,
}: {
    paragraphs: readonly string[];
    ctaLabel?: string;
    footer?: ReactNode;
}) {
    return (
        <DcSection className="border-b border-[#c1c8c4] p-8 text-center md:p-12">
            <DcH2 className="mb-4">Final Thoughts</DcH2>
            {paragraphs.map((p) => (
                <p key={p} className="mx-auto mb-4 max-w-lg text-[#414845]">
                    {p}
                </p>
            ))}
            {footer}
            <DigitalCraftsmanAuditButton className="mt-4">{ctaLabel}</DigitalCraftsmanAuditButton>
        </DcSection>
    );
}

export function DcNextStepsMobile({ steps }: { steps: readonly DcNextStep[] }) {
    return (
        <DcSection tint="cta" className="border-t border-[#c1c8c4]">
            <DcH2 className="mb-8 text-center">Next Steps</DcH2>
            <div className="grid gap-6 md:grid-cols-3">
                {steps.map(({ href, icon = "arrow_forward", title, body }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group rounded-lg border border-[#c1c8c4] bg-white p-6 text-center transition-all duration-200 hover:border-[#416359]"
                    >
                        <MaterialIcon
                            name={icon}
                            className="mx-auto mb-3 block !text-4xl text-[#416359]"
                        />
                        <h3 className="dc-display mb-1 text-2xl leading-[1.3] font-medium text-[#1b1c1c] group-hover:text-[#416359]">
                            {title}
                        </h3>
                        <p className="text-[#414845]">{body}</p>
                    </Link>
                ))}
            </div>
        </DcSection>
    );
}

export function DcNextStepsDesktop({ steps }: { steps: readonly DcNextStep[] }) {
    return (
        <div className="mt-16 border-t border-[#c1c8c4] pt-16">
            <h3 className="dc-display mb-6 text-[32px] leading-[1.2] font-semibold text-[#1b1c1c]">
                Next Steps
            </h3>
            <div className="flex flex-col gap-2">
                {steps.map(({ href, title, body }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group flex items-center justify-between rounded-lg border border-[#c1c8c4] bg-white p-6 transition-all hover:border-[#416359]"
                    >
                        <div>
                            <h4 className="dc-display text-2xl leading-[1.3] font-medium text-[#416359]">
                                {title}
                            </h4>
                            <p className="text-[#414845]">{body}</p>
                        </div>
                        <MaterialIcon
                            name="arrow_forward"
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export const DEFAULT_NEXT_STEPS_MOBILE: DcNextStep[] = [
    {
        href: "/pricing",
        icon: "payments",
        title: "View Pricing",
        body: "Transparent rates for small business websites and SEO.",
    },
    {
        href: "/services",
        icon: "gallery_thumbnail",
        title: "View Projects",
        body: "See how we help local businesses online.",
    },
    {
        href: "/contact",
        icon: "mail",
        title: "Contact",
        body: "Reach out to discuss your goals.",
    },
];

export function DcQuestionList({ questions }: { questions: readonly string[] }) {
    return (
        <div className="space-y-2">
            {questions.map((q) => (
                <div
                    key={q}
                    className="flex items-start gap-3 rounded border border-[#c1c8c4] p-4"
                >
                    <MaterialIcon name="help" className="mt-0.5 shrink-0 text-[#416359]" />
                    <span>{q}</span>
                </div>
            ))}
        </div>
    );
}

export function DcInlineLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="font-medium text-[#416359] underline-offset-2 hover:underline">
            {children}
        </Link>
    );
}
