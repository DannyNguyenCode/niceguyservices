"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { serviceCards, type Service } from "@/components/services/data";

import {
    pricingLayoutBodyFont as bodyFont,
    pricingLayoutHeadline as headline,
} from "@/components/pricing/pricingLayoutConstants";

function serviceModuleIndex(serviceId: string): number {
    const i = serviceCards.findIndex((s) => s.id === serviceId);
    return i >= 0 ? i + 1 : 1;
}

function highlightLines(service: Service): string[] {
    if (service.bullets.length > 0) return service.bullets;
    return service.details.includes;
}

interface ServiceDetailModalProps {
    service: Service | null;
    onClose: () => void;
}

export default function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const programmaticCloseRef = useRef(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleClose = () => {
            if (programmaticCloseRef.current) {
                programmaticCloseRef.current = false;
                return;
            }
            onClose();
        };
        dialog.addEventListener("close", handleClose);
        return () => {
            dialog.removeEventListener("close", handleClose);
            if (dialog.open) {
                programmaticCloseRef.current = true;
                dialog.close();
            }
        };
    }, [onClose]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (service) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else if (dialog.open) {
            programmaticCloseRef.current = true;
            dialog.close();
        }
    }, [service]);

    useEffect(() => {
        if (!service) return;
        const html = document.documentElement;
        const body = document.body;
        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
        };
    }, [service]);

    const titleId = service ? `service-modal-title-${service.id}` : undefined;
    const descId = service ? `service-modal-desc-${service.id}` : undefined;

    const outlineSoft = `color-mix(in srgb, var(--pm-outline-variant) 10%, transparent)`;
    const outlineBorder = `color-mix(in srgb, var(--pm-outline-variant) 20%, transparent)`;

    return (
        <dialog
            ref={dialogRef}
            className="modal modal-bottom sm:modal-middle service-detail-dialog"
            aria-labelledby={titleId}
            aria-describedby={descId}
        >
            <form method="dialog" className="modal-backdrop">
                <button type="submit" aria-label="Close dialog" />
            </form>

            {service ? (
                <div
                    className={`relative z-10 h-[80dvh] max-h-[80dvh] w-[80vw] max-w-[80vw] overflow-y-auto overflow-x-hidden rounded-t-4xl sm:rounded-xl ${bodyFont}`}
                    style={{
                        color: "var(--pm-on-surface)",
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: outlineSoft,
                        backgroundColor: "var(--pm-bento-tile-light)",
                        boxShadow: `0 25px 50px -12px color-mix(in srgb, var(--pm-on-surface) 18%, transparent), 0 0 24px color-mix(in srgb, var(--pm-primary) 8%, transparent)`,
                    }}
                >
                    <button
                        type="button"
                        className={[
                            "group absolute top-6 right-6 z-30 flex cursor-pointer rounded-full p-2",
                            "transition-[color,background-color,transform,box-shadow] duration-200 ease-out",
                            "hover:scale-105 hover:bg-(--pm-primary) hover:text-(--pm-white)",
                            "hover:shadow-[0_4px_18px_color-mix(in_srgb,var(--pm-primary)_35%,transparent)]",
                            "active:scale-95",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--pm-primary)",
                            "focus-visible:ring-offset-2 focus-visible:ring-offset-(--pm-bento-tile-light)",
                        ].join(" ")}
                        style={{ color: "var(--pm-outline-variant)" }}
                        aria-label="Close"
                        onClick={() => dialogRef.current?.close()}
                    >
                        <XMarkIcon
                            className="h-6 w-6 transition-transform duration-200 ease-out group-hover:rotate-90"
                            aria-hidden
                        />
                    </button>

                    <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
                        {/* Narrative */}
                        <div
                            className="relative flex flex-col justify-center p-10 md:p-14 lg:col-span-5 lg:p-16"
                            style={{
                                backgroundColor: `color-mix(in srgb, var(--pm-surface-low) 32%, transparent)`,
                            }}
                        >
                            <div className="space-y-8 pr-4 lg:pr-8">
                                <div>
                                    <span
                                        className={`mb-4 block text-xs font-bold tracking-[0.2em] uppercase ${headline}`}
                                        style={{ color: "var(--pm-primary)" }}
                                    >
                                        Service module{" "}
                                        {String(serviceModuleIndex(service.id)).padStart(2, "0")}
                                    </span>
                                    <h1
                                        id={titleId}
                                        className={`mb-6 text-4xl leading-[0.95] font-black tracking-tighter sm:text-5xl md:text-6xl ${headline}`}
                                    >
                                        {service.title}
                                    </h1>
                                    <p
                                        id={descId}
                                        className="max-w-md text-lg leading-relaxed"
                                        style={{ color: "var(--pm-on-surface-variant)" }}
                                    >
                                        {service.details.description}
                                    </p>
                                </div>

                                <div>
                                    <p
                                        className={`mb-4 text-xs font-bold tracking-widest uppercase ${headline}`}
                                        style={{ color: "var(--pm-modal-section-eyebrow)" }}
                                    >
                                        Highlights
                                    </p>
                                    <ul className="flex max-w-md flex-col gap-4" aria-label="Service highlights">
                                        {highlightLines(service).map((line, i) => {
                                            const primary = i % 2 === 0;
                                            return (
                                                <li key={`${line}-${i}`} className="flex items-start gap-4">
                                                    <span
                                                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                                        style={{
                                                            backgroundColor: primary
                                                                ? "var(--pm-primary)"
                                                                : "var(--pm-secondary)",
                                                            boxShadow: primary
                                                                ? `0 0 8px color-mix(in srgb, var(--pm-primary) 50%, transparent)`
                                                                : `0 0 8px color-mix(in srgb, var(--pm-secondary) 50%, transparent)`,
                                                        }}
                                                        aria-hidden
                                                    />
                                                    <span
                                                        className={`text-sm font-normal leading-relaxed ${bodyFont}`}
                                                        style={{ color: "var(--pm-on-surface-variant)" }}
                                                    >
                                                        {line}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/contact"
                                        className={`inline-flex items-center gap-3 bg-(--pm-on-surface) px-8 py-4 text-xs font-bold tracking-widest text-(--pm-bento-tile-light) uppercase transition-colors hover:bg-(--pm-primary) hover:text-(--pm-on-primary) active:scale-[0.98] ${headline}`}
                                        onClick={() => dialogRef.current?.close()}
                                    >
                                        Initialize briefing
                                        <ArrowRightIcon className="h-4 w-4 shrink-0" aria-hidden />
                                    </Link>
                                </div>
                            </div>

                            <div
                                className="absolute top-1/2 -right-10 z-20 hidden -translate-y-1/2 lg:flex xl:-right-12"
                                aria-hidden
                            >
                                <div
                                    className="rounded-full border p-5 shadow-lg"
                                    style={{
                                        borderColor: outlineSoft,
                                        backgroundColor: "var(--pm-bento-tile-light)",
                                    }}
                                >
                                    <ArrowLongRightIcon
                                        className="h-12 w-12"
                                        strokeWidth={1}
                                        style={{ color: "var(--pm-primary)" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Process */}
                        <div
                            className="p-10 md:p-14 lg:col-span-7 lg:p-16"
                            style={{ backgroundColor: "var(--pm-bento-tile-light)" }}
                        >
                            <div className="mb-10">
                                <h2 className={`text-2xl font-bold tracking-tight ${headline}`}>
                                    Development process
                                </h2>
                                <p
                                    className={`mt-2 text-xs tracking-widest uppercase ${headline}`}
                                    style={{ color: "var(--pm-modal-section-eyebrow)" }}
                                >
                                    Delivery workflow · {service.id}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {service.details.process.map((step, i) => {
                                    const stepAccent = i % 2 === 0 ? "primary" : "secondary";
                                    return (
                                        <div
                                            key={`process-${step.step}-${i}`}
                                            className="group relative z-10 flex flex-col md:block"
                                            style={
                                                {
                                                    ["--process-step-accent" as string]: `var(--pm-${stepAccent})`,
                                                } as CSSProperties
                                            }
                                        >
                                            <div
                                                className="rounded-lg border border-solid p-6 transition-[border-color] duration-200 ease-out group-hover:border-[color-mix(in_srgb,var(--process-step-accent)_52%,transparent)]"
                                                style={{
                                                    borderColor:
                                                        "color-mix(in srgb, var(--process-step-accent) 28%, transparent)",
                                                    backgroundColor: "var(--pm-bento-tile-light)",
                                                }}
                                            >
                                                <span
                                                    className={`mb-3 inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-[11px] font-bold tabular-nums tracking-tight ${headline}`}
                                                    style={{
                                                        color: `var(--pm-${stepAccent})`,
                                                        backgroundColor: `color-mix(in srgb, var(--pm-${stepAccent}) 10%, var(--pm-bento-tile-light))`,
                                                        borderWidth: 1,
                                                        borderStyle: "solid",
                                                        borderColor: `color-mix(in srgb, var(--pm-${stepAccent}) 22%, transparent)`,
                                                    }}
                                                >
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <h3
                                                    className={`mb-2 text-sm font-bold tracking-wider uppercase ${headline}`}
                                                >
                                                    {step.step}
                                                </h3>
                                                <p
                                                    className="text-xs leading-relaxed"
                                                    style={{ color: "var(--pm-on-surface-variant)" }}
                                                >
                                                    {step.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Supporting stack */}
                    <div
                        className="grid grid-cols-1 gap-6 border-t px-10 py-10 md:grid-cols-4 md:px-14 lg:px-16"
                        style={{ borderColor: outlineSoft }}
                    >
                        {service.details.includes.length > 0 ? (
                            <>
                                <div
                                    className="flex min-h-48 flex-col justify-between rounded-xl border p-8 md:col-span-2"
                                    style={{
                                        backgroundColor: "var(--pm-surface-low)",
                                        borderColor: `color-mix(in srgb, var(--pm-outline-variant) 8%, transparent)`,
                                    }}
                                >
                                    <p
                                        className={`text-xs uppercase tracking-wide ${headline}`}
                                        style={{ color: "var(--pm-modal-section-eyebrow)" }}
                                    >
                                        What you get
                                    </p>
                                    <h4 className={`text-xl font-bold sm:text-2xl ${headline}`}>
                                        {service.details.includes[0]}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {["Next.js", "TypeScript"].map((tag) => (
                                            <span
                                                key={tag}
                                                className={`rounded border px-2 py-1 text-[10px] font-bold uppercase ${headline}`}
                                                style={{
                                                    backgroundColor: "var(--pm-bento-tile-light)",
                                                    borderColor: outlineBorder,
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {service.details.includes.slice(1).map((line, idx) => {
                                    const primary = idx % 2 === 0;
                                    return (
                                        <div
                                            key={`${line}-${idx}`}
                                            className="flex min-h-48 flex-col justify-between rounded-xl border p-8"
                                            style={{
                                                backgroundColor: primary
                                                    ? `color-mix(in srgb, var(--pm-primary) 6%, transparent)`
                                                    : `color-mix(in srgb, var(--pm-secondary) 6%, transparent)`,
                                                borderColor: primary
                                                    ? `color-mix(in srgb, var(--pm-primary) 14%, transparent)`
                                                    : `color-mix(in srgb, var(--pm-secondary) 14%, transparent)`,
                                            }}
                                        >
                                            <CheckCircleIcon
                                                className="h-8 w-8 shrink-0"
                                                style={{
                                                    color: primary
                                                        ? "var(--pm-primary)"
                                                        : "var(--pm-secondary)",
                                                }}
                                                aria-hidden
                                            />
                                            <p
                                                className={`mt-4 text-sm leading-snug font-bold sm:text-base ${headline}`}
                                                style={{ color: "var(--pm-on-surface)" }}
                                            >
                                                {line}
                                            </p>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <div
                                className="flex min-h-40 flex-col justify-center rounded-xl border p-8 md:col-span-4"
                                style={{
                                    backgroundColor: "var(--pm-surface-low)",
                                    borderColor: `color-mix(in srgb, var(--pm-outline-variant) 8%, transparent)`,
                                }}
                            >
                                <p
                                    className={`text-xs uppercase tracking-wide ${headline}`}
                                    style={{ color: "var(--pm-modal-section-eyebrow)" }}
                                >
                                    What you get
                                </p>
                                <h4 className={`mt-2 text-xl font-bold ${headline}`}>
                                    {service.details.headline}
                                </h4>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </dialog>
    );
}
