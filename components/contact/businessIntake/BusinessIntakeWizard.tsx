"use client";

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowDownTrayIcon,
    BanknotesIcon,
    BuildingOffice2Icon,
    BuildingStorefrontIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ClipboardDocumentCheckIcon,
    ClipboardDocumentListIcon,
    CubeIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    EnvelopeOpenIcon,
    InformationCircleIcon,
    LockClosedIcon,
    MapIcon,
    MapPinIcon,
    NewspaperIcon,
    PaintBrushIcon,
    PhoneIcon,
    PlusCircleIcon,
    PlusIcon,
    QuestionMarkCircleIcon,
    QueueListIcon,
    StarIcon,
    TagIcon,
    TrashIcon,
    ViewfinderCircleIcon,
    WrenchScrewdriverIcon,
    BoltIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
    DRAFT_KEY,
    type BusinessIntakeData,
    type IntakeStep,
    type VisualStyle,
    newScopeLine,
    defaultIntakeData,
} from "@/lib/businessIntake/types";

type StepNavIcon = ComponentType<SVGProps<SVGSVGElement>>;

const PREFILL_KEY = "ng-contact-prefill";

const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
    { value: "", label: "Select industry" },
    { value: "trades", label: "Trades & construction" },
    { value: "home", label: "Home & property services" },
    { value: "retail", label: "Retail & local shop" },
    { value: "hospitality", label: "Food & hospitality" },
    { value: "health", label: "Health, wellness & fitness" },
    { value: "professional", label: "Professional & consulting" },
    { value: "other", label: "Other" },
];

const stepNav: { n: IntakeStep; label: string; Icon: StepNavIcon }[] = [
    { n: 1, label: "Company Profile", Icon: BuildingOffice2Icon },
    { n: 2, label: "Pricing & Services", Icon: WrenchScrewdriverIcon },
    { n: 3, label: "Goals & Final Details", Icon: ClipboardDocumentCheckIcon },
];

const goalRows: {
    key: "seo" | "leads" | "brand" | "performance";
    Icon: StepNavIcon;
    title: string;
    sub: string;
}[] = [
        {
            key: "seo",
            Icon: MapIcon,
            title: "Local SEO and search",
            sub: "Get found in Google in your service area",
        },
        {
            key: "leads",
            Icon: PhoneIcon,
            title: "Leads and contact",
            sub: "Phone calls, forms, and conversions",
        },
        {
            key: "brand",
            Icon: StarIcon,
            title: "Trust and brand",
            sub: "Portfolio, testimonials, about",
        },
        {
            key: "performance",
            Icon: BoltIcon,
            title: "Performance and speed",
            sub: "Fast load times that improve conversions",
        }
    ];

const inputClass =
    "w-full h-11 rounded-lg border border-base-300 bg-base-100 px-3 font-pm-body text-base text-base-content transition-colors intake-sunken intake-input-focus " +
    "placeholder:text-base-content/40 dark:border-base-content/15 dark:bg-base-200";

const labelClass = "font-pm-body text-sm font-medium text-(--pm-on-surface)";
const labelCol = `${labelClass} flex items-center gap-1.5`;

export default function BusinessIntakeWizard() {
    const [step, setStep] = useState<IntakeStep>(1);
    const [data, setData] = useState<BusinessIntakeData>(() => defaultIntakeData());
    const [newPageInput, setNewPageInput] = useState("");
    const [hydrated, setHydrated] = useState(false);
    const [draftMessage, setDraftMessage] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contactHint, setContactHint] = useState<{
        name?: string;
        email?: string;
        profession?: string;
    }>({});

    useEffect(() => {
        setHydrated(true);
        try {
            const pre = sessionStorage.getItem(PREFILL_KEY);
            if (pre) {
                setContactHint(
                    JSON.parse(pre) as {
                        name?: string;
                        email?: string;
                        profession?: string;
                    }
                );
            }
        } catch {
            /* ignore */
        }
        try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (!raw) return;
            const p = JSON.parse(raw) as {
                step?: number;
                data?: BusinessIntakeData;
                newPageInput?: string;
            };
            if (p.data) setData(p.data);
            if (p.step === 1 || p.step === 2 || p.step === 3) setStep(p.step);
            if (typeof p.newPageInput === "string") setNewPageInput(p.newPageInput);
        } catch {
            /* ignore */
        }
    }, []);

    const saveDraft = useCallback(() => {
        try {
            localStorage.setItem(
                DRAFT_KEY,
                JSON.stringify({ step, data, newPageInput })
            );
            setDraftMessage("Draft saved in this browser.");
            window.setTimeout(() => setDraftMessage(null), 3000);
        } catch {
            setDraftMessage("Could not save draft (storage may be full).");
            window.setTimeout(() => setDraftMessage(null), 5000);
        }
    }, [data, newPageInput, step]);

    const goNext = () => {
        setError(null);
        if (step === 1) {
            const c = data.company;
            if (!c.businessName.trim() || !c.industry || !c.location.trim()) {
                setError("Add your business name, industry, and location to continue.");
                return;
            }
        }
        if (step === 2) {
            const any = data.scopeLines.some(
                (l) => l.name.trim() && l.description.trim()
            );
            if (!any) {
                setError("Add at least one line item with a name and a short description.");
                return;
            }
        }
        if (step < 3) setStep((s) => (s + 1) as IntakeStep);
    };

    const goBack = () => {
        if (step > 1) setStep((s) => (s - 1) as IntakeStep);
    };

    const setCompany = (patch: Partial<BusinessIntakeData["company"]>) => {
        setData((d) => ({ ...d, company: { ...d.company, ...patch } }));
    };

    const submitFinal = async () => {
        setError(null);
        if (!data.visualStyle) {
            setError("Choose a visual direction to finish.");
            return;
        }
        if (
            !data.goals.seo &&
            !data.goals.leads &&
            !data.goals.brand &&
            !data.goals.performance
        ) {
            setError("Select at least one project objective.");
            return;
        }
        setSending(true);
        try {
            const res = await fetch("/api/business-intake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data,
                    contact:
                        contactHint.name || contactHint.email
                            ? {
                                name: contactHint.name,
                                email: contactHint.email,
                            }
                            : undefined,
                }),
            });
            const json = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                throw new Error(
                    json.error || "We could not submit your brief. Please try again."
                );
            }
            try {
                localStorage.removeItem(DRAFT_KEY);
                sessionStorage.removeItem(PREFILL_KEY);
            } catch {
                /* ignore */
            }
            setDone(true);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Something went wrong. Please try again or email us directly."
            );
        } finally {
            setSending(false);
        }
    };

    const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

    if (done) {
        return (
            <div
                className="flex min-h-[min(100dvh,900px)] flex-col items-center justify-center gap-4 px-4 py-20 text-center font-pm-body"
                data-business-intake="complete"
            >
                <EnvelopeOpenIcon
                    className="h-14 w-14 text-primary"
                    aria-hidden
                />
                <h1 className="max-w-md font-pm-headline text-2xl font-bold text-(--pm-on-surface)">
                    Thank you. Your project brief is on the way.
                </h1>
                <p className="max-w-md text-(--pm-on-surface-variant)">
                    I&apos;ll review the details and reply over email within one business
                    day. If you need to add more, you can still reach me from the contact
                    page.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/contact" className="btn btn-primary">
                        Back to contact
                    </Link>
                    <Link href="/" className="btn btn-ghost">
                        Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-[max(880px,100dvh)] bg-(--pm-surface) font-pm-body text-(--pm-on-surface)"
            data-business-intake="active"
        >
            <div className="sticky top-16 z-40 border-b border-base-300/70 bg-base-100/90 px-4 py-3 text-base-content shadow-sm backdrop-blur md:px-8">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <ClipboardDocumentListIcon
                            className="h-6 w-6 shrink-0 text-primary"
                            aria-hidden
                        />
                        <h1 className="truncate font-pm-headline text-sm font-bold tracking-tight sm:text-base">
                            Business Website Intake Form
                        </h1>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            onClick={saveDraft}
                            className="btn btn-ghost btn-sm gap-1 text-(--pm-on-surface-variant) sm:px-2"
                        >
                            <ArrowDownTrayIcon className="h-4 w-4" aria-hidden />
                            Save draft
                        </button>
                        <Link
                            href="/contact"
                            className="btn btn-ghost btn-sm gap-1 text-(--pm-on-surface-variant) sm:px-2"
                        >
                            <XMarkIcon className="h-4 w-4" aria-hidden />
                            Exit
                        </Link>
                    </div>
                </div>
            </div>

            {draftMessage && (
                <p
                    className="border-b border-primary/20 bg-primary/5 px-4 py-1.5 text-center text-xs text-primary"
                    role="status"
                >
                    {draftMessage}
                </p>
            )}

            <div className="flex mt-8">
                <aside
                    className="fixed top-[112px] mt-8 left-0 z-10 hidden h-[calc(100dvh-7rem)] w-64 flex-col border-r border-base-300/70 bg-base-100 p-4 lg:flex dark:bg-base-200/50"
                >
                    <p className="mb-2 flex items-center gap-1.5 px-2 font-pm-body text-[0.65rem] font-bold tracking-[0.12em] text-(--pm-on-surface-variant) uppercase">
                        <QueueListIcon className="h-4 w-4 text-primary" aria-hidden />
                        Onboarding steps
                    </p>
                    <nav className="flex flex-col gap-1 pt-4">
                        {stepNav.map((s) => {
                            const active = step === s.n;
                            const NavIcon = s.Icon;
                            return (
                                <button
                                    key={s.n}
                                    type="button"
                                    onClick={() => setStep(s.n)}
                                    className={[
                                        "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-all",
                                        active
                                            ? "font-semibold text-primary ring-1 ring-primary/20 bg-primary/5"
                                            : "text-(--pm-on-surface-variant) hover:bg-base-200/80 dark:hover:bg-base-300/30",
                                    ].join(" ")}
                                >
                                    <NavIcon
                                        className="h-5 w-5 shrink-0"
                                        aria-hidden
                                    />
                                    {s.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                <div className="w-full min-w-0 flex-1 lg:pl-64">
                    <div className="h-1 w-full bg-base-300/50">
                        <div
                            className="h-full transition-all duration-500 intake-progress-gradient"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>

                    <main className="mx-auto max-w-[800px] px-4 py-6 md:px-6 md:py-8">
                        {error && (
                            <p
                                className="mb-4 rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        {step === 1 && !hydrated ? (
                            <p className="text-(--pm-on-surface-variant)">Loading…</p>
                        ) : step === 1 && hydrated ? (
                            <section className="w-full max-w-[800px]">
                                <div className="mb-6">
                                    <p className="mb-1 text-xs font-bold tracking-[0.08em] text-secondary uppercase">
                                        Step 1 of 3
                                    </p>
                                    <p className="text-right text-xs text-(--pm-on-surface-variant)">
                                        33% complete
                                    </p>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-300/50">
                                    <div className="h-full w-1/3 rounded-full intake-progress-gradient" />
                                </div>
                                <div className="intake-form-canvas mt-8 rounded-xl border border-base-300 bg-base-100 p-5 md:p-7 dark:border-base-content/10 dark:bg-base-200/60">
                                    <h2 className="mb-1 flex items-center gap-2 font-pm-headline text-2xl font-bold tracking-tight text-(--pm-on-surface)">
                                        <BuildingOffice2Icon
                                            className="h-7 w-7 shrink-0 text-primary"
                                            aria-hidden
                                        />
                                        Business profile
                                    </h2>
                                    <p className="mb-6 text-sm text-(--pm-on-surface-variant)">
                                        Tell us about your organization so we can tailor
                                        the project.
                                    </p>
                                    <div className="space-y-5">
                                        <div>
                                            <label className={labelCol} htmlFor="biz-name">
                                                <BuildingStorefrontIcon
                                                    className="h-4 w-4 text-primary"
                                                    aria-hidden
                                                />
                                                Business name
                                            </label>
                                            <input
                                                id="biz-name"
                                                className={inputClass}
                                                placeholder="e.g. your company name"
                                                value={data.company.businessName}
                                                onChange={(e) =>
                                                    setCompany({
                                                        businessName: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            <div>
                                                <label
                                                    className={labelCol}
                                                    htmlFor="industry"
                                                >
                                                    <TagIcon
                                                        className="h-4 w-4 text-primary"
                                                        aria-hidden
                                                    />
                                                    Industry
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        id="industry"
                                                        className={`${inputClass} appearance-none pr-10`}
                                                        value={data.company.industry}
                                                        onChange={(e) =>
                                                            setCompany({
                                                                industry: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        {INDUSTRY_OPTIONS.map((o) => (
                                                            <option
                                                                key={o.value}
                                                                value={o.value}
                                                            >
                                                                {o.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span
                                                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-(--pm-on-surface-variant)"
                                                        aria-hidden
                                                    >
                                                        <ChevronDownIcon
                                                            className="h-4 w-4"
                                                            aria-hidden
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    className={labelCol}
                                                    htmlFor="years"
                                                >
                                                    <CalendarDaysIcon
                                                        className="h-4 w-4 text-primary"
                                                        aria-hidden
                                                    />
                                                    Years in operation
                                                </label>
                                                <input
                                                    id="years"
                                                    className={inputClass}
                                                    type="number"
                                                    min={0}
                                                    placeholder="0"
                                                    value={data.company.yearsInOperation}
                                                    onChange={(e) =>
                                                        setCompany({
                                                            yearsInOperation: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                className={labelCol}
                                                htmlFor="location"
                                            >
                                                <MapPinIcon
                                                    className="h-4 w-4 text-primary"
                                                    aria-hidden
                                                />
                                                Service area or HQ
                                            </label>
                                            <div className="relative">
                                                <span
                                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--pm-on-surface-variant)"
                                                    aria-hidden
                                                >
                                                    <MapPinIcon
                                                        className="h-5 w-5"
                                                        aria-hidden
                                                    />
                                                </span>
                                                <input
                                                    id="location"
                                                    className={`${inputClass} pl-10`}
                                                    placeholder="e.g. Toronto, ON"
                                                    value={data.company.location}
                                                    onChange={(e) =>
                                                        setCompany({
                                                            location: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-base-300/60 bg-(--pm-surface-low) p-4 sm:flex-row sm:items-center dark:bg-base-300/20">

                                            <div>
                                                <p className="flex items-center gap-1.5 text-sm font-semibold text-(--pm-on-surface)">
                                                    <QuestionMarkCircleIcon
                                                        className="h-4 w-4 text-primary"
                                                        aria-hidden
                                                    />
                                                    Why we ask
                                                </p>
                                                <p className="text-xs text-(--pm-on-surface-variant)">
                                                    Industry and location help us line up
                                                    the right local SEO, lead forms, and
                                                    compliance-friendly patterns for your
                                                    business.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex flex-col gap-3 border-t border-base-300/50 pt-6 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={saveDraft}
                                            className="btn btn-ghost h-11 gap-1.5 border border-base-300 sm:order-1"
                                        >
                                            <ArrowDownTrayIcon
                                                className="h-5 w-5"
                                                aria-hidden
                                            />
                                            Save draft
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            className="btn btn-primary h-11 gap-1.5 px-8"
                                        >
                                            Continue
                                            <ArrowRightIcon
                                                className="h-5 w-5"
                                                aria-hidden
                                            />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-4 text-center text-xs text-(--pm-on-surface-variant)">
                                    Information is only used to guide your build and
                                    protect your data in transit. Not sold.
                                </p>
                            </section>
                        ) : null}

                        {step === 2 && (
                            <section>
                                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.08em] text-secondary uppercase">
                                            Step 2 of 3
                                        </p>
                                        <h2 className="mt-1 flex items-center gap-2 font-pm-headline text-2xl font-bold text-(--pm-on-surface)">
                                            <QueueListIcon
                                                className="h-7 w-7 shrink-0 text-primary"
                                                aria-hidden
                                            />
                                            {"Pricing & Services"}
                                        </h2>
                                    </div>
                                    <span className="text-sm text-(--pm-on-surface-variant)">
                                        66% complete
                                    </span>
                                </div>
                                <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-base-300/50">
                                    <div
                                        className="h-full w-2/3 rounded-full transition-all duration-500 intake-progress-gradient"
                                    />
                                </div>
                                <div className="space-y-5">
                                    {data.scopeLines.map((line) => (
                                        <div
                                            key={line.id}
                                            className="intake-form-canvas relative rounded-xl border border-base-300 bg-base-100 p-4 md:p-5 dark:border-base-content/10 dark:bg-base-200/60"
                                        >
                                            {data.scopeLines.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setData((d) => ({
                                                            ...d,
                                                            scopeLines:
                                                                d.scopeLines.filter(
                                                                    (x) => x.id !== line.id
                                                                ),
                                                        }))
                                                    }
                                                    className="absolute right-2 top-2 p-1 text-(--pm-on-surface-variant) hover:text-error"
                                                    aria-label="Remove line"
                                                >
                                                    <TrashIcon
                                                        className="h-5 w-5"
                                                        aria-hidden
                                                    />
                                                </button>
                                            )}
                                            <div className="space-y-3">
                                                <div>
                                                    <label
                                                        className="flex items-center gap-1.5 text-sm font-semibold text-(--pm-on-surface-variant)"
                                                        htmlFor={`sn-${line.id}`}
                                                    >
                                                        <CubeIcon
                                                            className="h-4 w-4 text-primary/90"
                                                            aria-hidden
                                                        />
                                                        Deliverable
                                                    </label>
                                                    <input
                                                        id={`sn-${line.id}`}
                                                        className={inputClass}
                                                        placeholder="e.g. service pages, booking, gallery"
                                                        value={line.name}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            setData((d) => ({
                                                                ...d,
                                                                scopeLines:
                                                                    d.scopeLines.map(
                                                                        (x) =>
                                                                            x.id ===
                                                                                line.id
                                                                                ? {
                                                                                    ...x,
                                                                                    name: v,
                                                                                }
                                                                                : x
                                                                    ),
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        className="flex items-center gap-1.5 text-sm font-semibold text-(--pm-on-surface-variant)"
                                                        htmlFor={`sd-${line.id}`}
                                                    >
                                                        <DocumentTextIcon
                                                            className="h-4 w-4 text-primary/90"
                                                            aria-hidden
                                                        />
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id={`sd-${line.id}`}
                                                        className={`${inputClass} h-auto min-h-24 py-2`}
                                                        rows={3}
                                                        placeholder="What should this part of the site do?"
                                                        value={line.description}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            setData((d) => ({
                                                                ...d,
                                                                scopeLines:
                                                                    d.scopeLines.map(
                                                                        (x) =>
                                                                            x.id ===
                                                                                line.id
                                                                                ? {
                                                                                    ...x,
                                                                                    description: v,
                                                                                }
                                                                                : x
                                                                    ),
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                    <div>
                                                        <label
                                                            className="flex items-center gap-1.5 text-sm font-semibold text-(--pm-on-surface-variant)"
                                                            htmlFor={`pm-${line.id}`}
                                                        >
                                                            <BanknotesIcon
                                                                className="h-4 w-4 text-primary/90"
                                                                aria-hidden
                                                            />
                                                            Cost of Service
                                                        </label>
                                                        <select
                                                            id={`pm-${line.id}`}
                                                            className={inputClass}
                                                            value={line.pricingModel}
                                                            onChange={(e) => {
                                                                const v = e
                                                                    .target
                                                                    .value as
                                                                    | "flat"
                                                                    | "hourly"
                                                                    | "range"
                                                                    | "square-footage";
                                                                setData((d) => ({
                                                                    ...d,
                                                                    scopeLines:
                                                                        d.scopeLines.map(
                                                                            (x) =>
                                                                                x.id ===
                                                                                    line.id
                                                                                    ? {
                                                                                        ...x,
                                                                                        pricingModel: v,
                                                                                    }
                                                                                    : x
                                                                        ),
                                                                }));
                                                            }}
                                                        >
                                                            <option value="flat">
                                                                One-time project
                                                            </option>
                                                            <option value="hourly">
                                                                Ongoing (hourly / retainer)
                                                            </option>
                                                            <option value="range">
                                                                Phase-based range
                                                            </option>
                                                            <option value="square-footage">
                                                                Square Footage
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label
                                                            className="flex items-center gap-1.5 text-sm font-semibold text-(--pm-on-surface-variant)"
                                                            htmlFor={`rt-${line.id}`}
                                                        >
                                                            <CurrencyDollarIcon
                                                                className="h-4 w-4 text-primary/90"
                                                                aria-hidden
                                                            />
                                                            Approximate $ range (ballpark)
                                                        </label>
                                                        <div className="relative">
                                                            <span
                                                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--pm-on-surface-variant)"
                                                                aria-hidden
                                                            >
                                                                <CurrencyDollarIcon
                                                                    className="h-4 w-4"
                                                                    aria-hidden
                                                                />
                                                            </span>
                                                            <input
                                                                id={`rt-${line.id}`}
                                                                className={`${inputClass} pl-7`}
                                                                inputMode="decimal"
                                                                placeholder="0"
                                                                value={line.rate}
                                                                onChange={(e) => {
                                                                    const v =
                                                                        e.target.value;
                                                                    setData((d) => ({
                                                                        ...d,
                                                                        scopeLines:
                                                                            d.scopeLines.map(
                                                                                (x) =>
                                                                                    x.id ===
                                                                                        line.id
                                                                                        ? {
                                                                                            ...x,
                                                                                            rate: v,
                                                                                        }
                                                                                        : x
                                                                            ),
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData((d) => ({
                                                ...d,
                                                scopeLines: [
                                                    ...d.scopeLines,
                                                    newScopeLine(),
                                                ],
                                            }))
                                        }
                                        className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-base-300/80 py-8 text-(--pm-on-surface-variant) transition-colors hover:border-primary/50 hover:bg-primary/5"
                                    >
                                        <PlusCircleIcon
                                            className="h-8 w-8"
                                            aria-hidden
                                        />
                                        <span className="text-sm font-semibold">
                                            Add another line item
                                        </span>
                                    </button>
                                    <div className="flex items-start gap-2 rounded-lg border border-secondary/25 bg-secondary/5 p-3 text-sm text-(--pm-on-surface)">
                                        <InformationCircleIcon
                                            className="mt-0.5 h-5 w-5 text-secondary"
                                            aria-hidden
                                        />
                                        <p>
                                            The more specific you are here, the more
                                            accurate your scope and quote will be. You
                                            can refine this later before launch.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-col gap-3 border-t border-base-300/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="btn btn-ghost h-11 gap-1"
                                    >
                                        <ArrowLeftIcon
                                            className="h-5 w-5"
                                            aria-hidden
                                        />
                                        Back
                                    </button>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <button
                                            type="button"
                                            onClick={saveDraft}
                                            className="inline-flex h-11 items-center gap-1.5 px-3 text-sm font-medium text-(--pm-on-surface-variant) hover:underline"
                                        >
                                            <ArrowDownTrayIcon
                                                className="h-4 w-4"
                                                aria-hidden
                                            />
                                            Save as draft
                                        </button>
                                        <button
                                            type="button"
                                            onClick={goNext}
                                            className="btn btn-primary h-11 gap-1.5"
                                        >
                                            Continue to step 3
                                            <ArrowRightIcon
                                                className="h-5 w-5"
                                                aria-hidden
                                            />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {step === 3 && (
                            <section>
                                <div className="mb-6">
                                    <p className="text-xs font-bold tracking-[0.1em] text-secondary uppercase">
                                        Step 3 of 3
                                    </p>
                                    <h2 className="mb-1 flex items-center gap-2 font-pm-headline text-2xl font-bold text-(--pm-on-surface)">
                                        <NewspaperIcon
                                            className="h-7 w-7 shrink-0 text-primary"
                                            aria-hidden
                                        />
                                        {"Website Goals & Style"}
                                    </h2>
                                    <p className="text-sm text-(--pm-on-surface-variant)">
                                        Set priorities for what the site should achieve and
                                        how it should feel.
                                    </p>
                                </div>
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        void submitFinal();
                                    }}
                                >
                                    <div className="intake-form-canvas rounded-xl border border-base-300 bg-base-100 p-5 md:p-6 dark:border-base-content/10 dark:bg-base-200/60">
                                        <h3 className="mb-0.5 flex items-center gap-2 font-pm-headline text-lg font-bold">
                                            <ViewfinderCircleIcon
                                                className="h-6 w-6 text-primary"
                                                aria-hidden
                                            />
                                            Project objectives
                                        </h3>
                                        <p className="mb-4 text-sm text-(--pm-on-surface-variant)">
                                            What matters most? Select all that apply.
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                            {goalRows.map(({ key, Icon: GoalIcon, title, sub }) => (
                                                <label
                                                    key={key}
                                                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-base-300/80 p-3 transition-colors has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5 hover:border-primary/40 dark:border-base-content/10"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm checkbox-primary mt-0.5"
                                                        checked={data.goals[key]}
                                                        onChange={() =>
                                                            setData((d) => ({
                                                                ...d,
                                                                goals: {
                                                                    ...d.goals,
                                                                    [key]: !d.goals[key],
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <div>
                                                        <p className="flex items-center gap-1.5 text-sm font-medium text-(--pm-on-surface)">
                                                            <GoalIcon
                                                                className="h-5 w-5 shrink-0 text-primary/90"
                                                                aria-hidden
                                                            />
                                                            {title}
                                                        </p>
                                                        <p className="text-xs text-(--pm-on-surface-variant)">
                                                            {sub}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="intake-form-canvas rounded-xl border border-base-300 bg-base-100 p-5 md:p-6 dark:border-base-content/10 dark:bg-base-200/60">
                                        <h3 className="mb-0.5 flex items-center gap-2 font-pm-headline text-lg font-bold">
                                            <PaintBrushIcon
                                                className="h-6 w-6 text-primary"
                                                aria-hidden
                                            />
                                            Visual direction
                                        </h3>
                                        <p className="mb-4 text-sm text-(--pm-on-surface-variant)">
                                            One direction for the first design pass (we can
                                            adjust in revisions).
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                            {(
                                                [
                                                    [
                                                        "modern",
                                                        "MODERN",
                                                        "Minimal, spacious, lots of clear space",
                                                    ],
                                                    [
                                                        "professional",
                                                        "PRO",
                                                        "Confident, structured, business-first",
                                                    ],
                                                    [
                                                        "creative",
                                                        "CREATIVE",
                                                        "Bolder type, more expressive layout",
                                                    ],
                                                ] as const
                                            ).map(([key, tag, sub]) => (
                                                <label
                                                    key={key}
                                                    className="group block cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        className="peer sr-only"
                                                        name="vstyle"
                                                        value={key}
                                                        checked={
                                                            data.visualStyle === key
                                                        }
                                                        onChange={() =>
                                                            setData((d) => ({
                                                                ...d,
                                                                visualStyle:
                                                                    key as VisualStyle,
                                                            }))
                                                        }
                                                    />
                                                    <div
                                                        className="flex flex-col overflow-hidden rounded-xl border-2 border-transparent peer-checked:border-primary/60 peer-checked:ring-1 peer-checked:ring-primary/15"
                                                    >
                                                        <div className="relative h-32 w-full overflow-hidden">
                                                            {key === "modern" && (
                                                                <div className="absolute inset-0 bg-linear-to-tr from-base-200 to-base-100" />
                                                            )}
                                                            {key === "professional" && (
                                                                <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-(--pm-surface-low)" />
                                                            )}
                                                            {key === "creative" && (
                                                                <div className="absolute inset-0 bg-linear-to-tr from-secondary/50 to-primary/20" />
                                                            )}
                                                            <span className="absolute bottom-2 left-2 bg-base-100 px-2 py-0.5 font-mono text-[0.6rem] font-bold tracking-wide">
                                                                {tag}
                                                            </span>
                                                        </div>
                                                        <p className="p-2 text-sm font-medium capitalize text-(--pm-on-surface)">
                                                            {key}
                                                        </p>
                                                        <p className="px-2 pb-2 text-xs text-(--pm-on-surface-variant)">
                                                            {sub}
                                                        </p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="intake-form-canvas rounded-xl border border-base-300 bg-base-100 p-5 md:p-6 dark:border-base-content/10 dark:bg-base-200/60">
                                        <h3 className="mb-0.5 flex items-center gap-2 font-pm-headline text-lg font-bold">
                                            <MapIcon
                                                className="h-6 w-6 text-primary"
                                                aria-hidden
                                            />
                                            Main navigation
                                        </h3>
                                        <p className="mb-4 text-sm text-(--pm-on-surface-variant)">
                                            Home, Services, Pricing, About, and Contact are standard. <br />
                                            Add other pages you may need (Fee applies for pages extra to standard).
                                        </p>
                                        <div>
                                            <p className="mb-2 text-xs font-bold tracking-wide text-(--pm-on-surface-variant) uppercase">
                                                Standard pages
                                            </p>
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {["Home", "Services", "Pricing", "About", "Contact"].map((p) => (
                                                    <span
                                                        key={p}
                                                        className="inline-flex items-center gap-1 rounded-full border border-base-300/80 bg-base-200/50 px-3 py-1 text-sm dark:bg-base-300/30"
                                                    >
                                                        {p}
                                                        <LockClosedIcon
                                                            className="h-4 w-4 text-error/80"
                                                            title="Core pages"
                                                            aria-hidden
                                                        />
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="mb-2 text-xs font-bold tracking-wide text-(--pm-on-surface-variant) uppercase">
                                                Add pages
                                            </p>
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                                                <input
                                                    className={inputClass}
                                                    value={newPageInput}
                                                    placeholder="e.g. Resource, Blog, Payment"
                                                    onChange={(e) =>
                                                        setNewPageInput(e.target.value)
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            const t =
                                                                newPageInput.trim();
                                                            if (!t) return;
                                                            setData((d) => ({
                                                                ...d,
                                                                additionalPages: [
                                                                    ...d.additionalPages,
                                                                    t,
                                                                ],
                                                            }));
                                                            setNewPageInput("");
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const t = newPageInput.trim();
                                                        if (!t) return;
                                                        setData((d) => ({
                                                            ...d,
                                                            additionalPages: [
                                                                ...d.additionalPages,
                                                                t,
                                                            ],
                                                        }));
                                                        setNewPageInput("");
                                                    }}
                                                    className="btn h-11 shrink-0"
                                                >
                                                    <PlusIcon
                                                        className="h-4 w-4"
                                                        aria-hidden
                                                    />
                                                    Add
                                                </button>
                                            </div>
                                            {data.additionalPages.length > 0 && (
                                                <ul className="mt-2 flex flex-wrap gap-1">
                                                    {data.additionalPages.map(
                                                        (p, i) => (
                                                            <li
                                                                key={p + i}
                                                                className="group inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-sm"
                                                            >
                                                                {p}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setData(
                                                                            (d) => ({
                                                                                ...d,
                                                                                additionalPages:
                                                                                    d.additionalPages.filter(
                                                                                        (
                                                                                            _,
                                                                                            j
                                                                                        ) =>
                                                                                            j !==
                                                                                            i
                                                                                    ),
                                                                            })
                                                                        )
                                                                    }
                                                                    className="ml-0.5 opacity-50 hover:opacity-100"
                                                                >
                                                                    ×
                                                                </button>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                            <p className="mt-1 text-xs text-(--pm-on-surface-variant)">
                                                Press enter or add to list extra nav items.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <button
                                            type="button"
                                            onClick={goBack}
                                            className="btn btn-ghost h-11 gap-1"
                                        >
                                            <ArrowLeftIcon
                                                className="h-4 w-4"
                                                aria-hidden
                                            />
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary h-11 gap-2"
                                            disabled={sending}
                                        >
                                            {sending ? "Sending…" : "Submit project brief"}
                                            <CheckCircleIcon
                                                className="h-4 w-4"
                                                aria-hidden
                                            />
                                        </button>
                                    </div>
                                </form>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
