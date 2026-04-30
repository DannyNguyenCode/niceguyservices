"use client";

import {
    AcademicCapIcon,
    ArrowLeftIcon,
    BriefcaseIcon,
    BuildingStorefrontIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    EnvelopeIcon,
    EnvelopeOpenIcon,
    MapPinIcon,
    PaintBrushIcon,
    PhotoIcon,
    PlusCircleIcon,
    PuzzlePieceIcon,
    ShieldCheckIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
    PORTFOLIO_DRAFT_KEY,
    defaultPortfolioIntakeData,
    emptyEducation,
    emptySkillCategory,
    emptyWorkEntry,
    type PortfolioIntakeData,
    type PortfolioIntakeStep,
    type WorkEntry,
} from "@/lib/portfolioIntake/types";

type StepIcon = ComponentType<SVGProps<SVGSVGElement>>;

const PREFILL_KEY = "ng-contact-prefill";

const SKILLS_FEATURE_IMG =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCOxs6ZKBCHb-tqZs0gKhl_yjBDXY3C2cDxIRVPFLtcYXmYAkcjyfhrcWMFECUZ4vfYQlVlsEGA5CWsgmOgsc0DcNJIigXq1W3ZzOog2u3QOfrOSWBFAsuyYLVGF0OXH3FZX9VbWo6S85rFaxXRi9e9LHhCrV8bGoGY9daJenWHTNjRu-BKgCU81ofZ6mNgDtQSRfznfV_StIDRBQ-HPvBtFr80HA3Zc7UN7UoccgmNoTVb_YoMtEwB30M786pDP-Pyy5f4KYPLexLX";

const REVIEW_IMGS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlwS4tLIcuFgNZ4A2LgZq7lHxmekp4XAsFLMjuFmfaxrYP1C55iAVH8N1zGV_J_6wYbCZlb7ouC9zoD8mzwBzrMSxE2hKyCeRwLjQ1qqVtWna4XpvjIBWWyDWyFjqPfCxbd6ifW2Cn3d2Mhr_k58szP5bjhwt9kqf_-PJ6OOhBug0qeWzTR_riuarX-BMArwvCDEYQ9cexvwdAtJOMaSnWfj6h7jyz_qxvqBBkvWfG7h5KYBh4VJ8AU3yrkB_fupzM2Lxl2sZaOdbz",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBBQvFUmJyn4YjncNDT72upkvohPVmJulGTHM0MWVDlKvM4ct19htt1yRczpL8gtkiJ2puEnjJq877n8wvDJQ2o3-3XInWAiHEEeHJoi4bqQyNGYWm-Gyq3_dBjATJE5YoYDZrK4Qe0ZgNaqirOAbGw9-wjqZdnmAoLgvd1EjANjMa40b06Kepq9nQLWlZzFcx3A8z63RP9IGGCSFe5vmR6slKQ6tYQyfm2RPT5ptYosqFJIQUOP2DSsy3NS4anEENfQxUHv1KHUikv",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDlhDyr-48qnyy-sM8nwVdkyjIJE7tFJ2-fOar-d_iEBqIs58zS58KPhS2x8poOryhqH362DWYALF5lIfgY34EOBInN4k0wNLbWuHvdRMvH_fx2Onk9FeYg8e64frgKCzVQWdqgZGzqjPk82BzAw0AuNc6Ib-TIff2OVRIWdqLQF3KcZzu7ZBDi2YB3_bthCACuweqPmbpGU9E88tm39AFYcoDoNtiL2taLBdn9qT-kQHsooeOZpuWt04OEKYo_VTw1Ebe9crFpuNw4",
] as const;

const stepNav: { n: PortfolioIntakeStep; label: string; Icon: StepIcon }[] = [
    { n: 1, label: "Experience", Icon: BriefcaseIcon },
    { n: 2, label: "Skills", Icon: PuzzlePieceIcon },
    { n: 3, label: "Education", Icon: AcademicCapIcon },
    { n: 4, label: "Contact & review", Icon: EnvelopeIcon },
];

const inputLg =
    "w-full rounded-lg border border-base-300 bg-base-100 px-3 py-2.5 font-pm-body text-base text-base-content intake-sunken intake-input-focus " +
    "placeholder:text-base-content/40 dark:border-base-content/15 dark:bg-base-200";

const caps =
    "mb-2 block font-pm-body text-xs font-bold tracking-[0.08em] text-(--pm-on-surface-variant) uppercase";

export default function PortfolioIntakeWizard() {
    const [step, setStep] = useState<PortfolioIntakeStep>(1);
    const [data, setData] = useState<PortfolioIntakeData>(() => defaultPortfolioIntakeData());
    const [roleDraft, setRoleDraft] = useState<WorkEntry>(() => emptyWorkEntry());
    const [newImpactLabel, setNewImpactLabel] = useState("");
    const [newImpactValue, setNewImpactValue] = useState("");
    const [skillDraft, setSkillDraft] = useState(() => ({
        ...emptySkillCategory(),
    }));
    const [toolInput, setToolInput] = useState("");

    const [hydrated, setHydrated] = useState(false);
    const [draftMessage, setDraftMessage] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contactHint, setContactHint] = useState<{
        name?: string;
        email?: string;
        businessName?: string;
        profession?: string;
    }>({});

    const [honorIn, setHonorIn] = useState<Record<string, string>>({});
    const [curriculumIn, setCurriculumIn] = useState<Record<string, string>>({});

    useEffect(() => {
        setHydrated(true);
        try {
            const pre = sessionStorage.getItem(PREFILL_KEY);
            if (pre) {
                const h = JSON.parse(pre) as {
                    name?: string;
                    email?: string;
                    businessName?: string;
                    profession?: string;
                };
                setContactHint(h);
                setData((d) => ({
                    ...d,
                    contactReview: {
                        ...d.contactReview,
                        fullName: d.contactReview.fullName || h.name || "",
                        email: d.contactReview.email || h.email || "",
                        professionalTitle:
                            d.contactReview.professionalTitle ||
                            h.profession ||
                            (h.businessName
                                ? `At ${h.businessName}`
                                : d.contactReview.professionalTitle),
                    },
                }));
            }
        } catch {
            /* ignore */
        }
        try {
            const raw = localStorage.getItem(PORTFOLIO_DRAFT_KEY);
            if (!raw) return;
            const p = JSON.parse(raw) as {
                step?: number;
                data?: PortfolioIntakeData;
            };
            if (p.data) {
                const loaded = p.data;
                setData({
                    ...loaded,
                    experience: {
                        ...loaded.experience,
                        entries: loaded.experience.entries.map((e) => ({
                            ...e,
                            impacts: Array.isArray(
                                (e as WorkEntry & { impacts?: unknown }).impacts
                            )
                                ? (e as WorkEntry).impacts
                                : [],
                        })),
                        impacts: loaded.experience.impacts ?? [],
                    },
                });
            }
            if (p.step === 1 || p.step === 2 || p.step === 3 || p.step === 4) {
                setStep(p.step);
            }
        } catch {
            /* ignore */
        }
    }, []);

    const saveDraft = useCallback(() => {
        try {
            localStorage.setItem(
                PORTFOLIO_DRAFT_KEY,
                JSON.stringify({ step, data })
            );
            setDraftMessage("Draft saved in this browser.");
            window.setTimeout(() => setDraftMessage(null), 3000);
        } catch {
            setDraftMessage("Could not save draft.");
            window.setTimeout(() => setDraftMessage(null), 5000);
        }
    }, [data, step]);

    const goNext = () => {
        setError(null);
        if (step === 1) {
            const ok = data.experience.entries.some(
                (e) => e.jobTitle.trim() && e.company.trim()
            );
            if (!ok) {
                setError("Add at least one role to your timeline (title and company).");
                return;
            }
        }
        if (step === 2) {
            const ok = data.skills.categories.some((c) => c.name.trim());
            if (!ok) {
                setError("Add at least one skills category with a name.");
                return;
            }
        }
        if (step === 3) {
            const ok = data.education.entries.some(
                (e) => e.institution.trim() || e.degree.trim()
            );
            if (!ok) {
                setError("Add at least one school or program (institution or degree).");
                return;
            }
        }
        if (step < 4) setStep((s) => (s + 1) as PortfolioIntakeStep);
    };

    const goBack = () => {
        if (step > 1) setStep((s) => (s - 1) as PortfolioIntakeStep);
    };

    const addWorkEntry = () => {
        if (!roleDraft.jobTitle.trim() || !roleDraft.company.trim()) {
            setError("Job title and company are required to add a role.");
            return;
        }
        setError(null);
        setData((d) => ({
            ...d,
            experience: {
                ...d.experience,
                entries: [
                    {
                        ...roleDraft,
                        impacts: d.experience.impacts.map((m) => ({ ...m })),
                    },
                    ...d.experience.entries,
                ],
                impacts: [],
            },
        }));
        setRoleDraft(emptyWorkEntry());
        setNewImpactValue("");
        setNewImpactLabel("");
    };

    const submit = async () => {
        setError(null);
        const c = data.contactReview;
        if (!c.fullName.trim() || !c.email.trim()) {
            setError("Your name and a valid email are required to submit.");
            return;
        }
        const emOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim());
        if (!emOk) {
            setError("Check your email address format.");
            return;
        }
        if (!c.summary.trim()) {
            setError("Add a short professional summary (how you want to be introduced).");
            return;
        }
        setSending(true);
        try {
            const res = await fetch("/api/portfolio-intake", {
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
            const j = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                throw new Error(j.error || "Could not submit. Try again.");
            }
            try {
                localStorage.removeItem(PORTFOLIO_DRAFT_KEY);
                sessionStorage.removeItem(PREFILL_KEY);
            } catch {
                /* ignore */
            }
            setDone(true);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Something went wrong. Try again or email us directly."
            );
        } finally {
            setSending(false);
        }
    };

    const progressPct = step * 25;

    if (done) {
        return (
            <div
                className="flex min-h-[min(100dvh,880px)] flex-col items-center justify-center gap-4 px-4 py-20 text-center"
                data-portfolio-intake="complete"
            >
                <EnvelopeOpenIcon
                    className="h-14 w-14 text-primary"
                    aria-hidden
                />
                <h1 className="max-w-md font-pm-headline text-2xl font-bold text-(--pm-on-surface)">
                    Thanks—your creative brief is in.
                </h1>
                <p className="max-w-md text-(--pm-on-surface-variant)">
                    I’ll follow up by email, usually within one business day, with next
                    steps for your portfolio site.
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <Link href="/contact" className="btn btn-primary">
                        Contact
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
            data-portfolio-intake="active"
        >
            <div className="sticky top-16 z-40 border-b border-base-300/70 bg-base-100/90 px-3 py-3 text-base-content shadow-sm backdrop-blur sm:px-6 md:px-8">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <PhotoIcon
                            className="h-6 w-6 shrink-0 text-primary"
                            aria-hidden
                        />
                        <h1 className="truncate font-pm-headline text-sm font-bold tracking-tight sm:text-base">
                            Portfolio &amp; showcase brief
                        </h1>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                        <button
                            type="button"
                            onClick={saveDraft}
                            className="btn btn-ghost btn-sm text-(--pm-on-surface-variant)"
                        >
                            Save draft
                        </button>
                        <Link
                            href="/contact"
                            className="btn btn-ghost btn-sm text-(--pm-on-surface-variant)"
                        >
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

            <div className="flex">
                <aside
                    className="fixed top-28 left-0 z-10 hidden h-[calc(100dvh-7rem)] w-64 flex-col border-r border-base-300/60 bg-base-100 p-3 dark:bg-base-200/40 lg:flex"
                >
                    <p className="px-2 pb-1 font-pm-body text-[0.6rem] font-bold tracking-[0.14em] text-(--pm-on-surface-variant) uppercase">
                        Steps
                    </p>
                    <p className="px-2 pb-1 text-xs text-primary">
                        {progressPct}% complete
                    </p>
                    <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-base-300/60">
                        <div
                            className="h-full transition-all duration-500 intake-progress-gradient"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <nav className="mt-1 flex flex-col gap-0.5 pt-4">
                        {stepNav.map((s) => {
                            const on = step === s.n;
                            const NavIcon = s.Icon;
                            return (
                                <button
                                    key={s.n}
                                    type="button"
                                    onClick={() => {
                                        setStep(s.n);
                                        setError(null);
                                    }}
                                    className={[
                                        "flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm",
                                        on
                                            ? "border-l-4 border-primary bg-primary/5 font-semibold text-primary"
                                            : "text-(--pm-on-surface-variant) hover:bg-base-200/80",
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
                    <div className="h-1 w-full bg-base-300/40">
                        <div
                            className="h-full transition-all duration-500 intake-progress-gradient"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-10">
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
                        ) : null}
                        {step === 1 && hydrated && (
                            <>
                                <p className="text-xs font-bold tracking-[0.12em] text-secondary uppercase">
                                    Step 1 of 4
                                </p>
                                <header className="mb-8 max-w-2xl">
                                    <h2 className="font-pm-headline text-2xl font-extrabold tracking-tight text-(--pm-on-surface) sm:text-3xl">
                                        Your experience
                                    </h2>
                                    <p className="mt-1 text-(--pm-on-surface-variant)">
                                        Highlight the roles and results that will shape your
                                        new portfolio site. Start with the work you are most
                                        proud of.
                                    </p>
                                </header>
                                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                                    <div className="space-y-6 lg:col-span-7">
                                        <section className="rounded-xl border border-base-300/70 bg-(--pm-surface-low) p-5 sm:p-7">
                                            <div className="mb-6 flex items-center gap-3">
                                                <div className="bg-primary/15 text-primary flex h-11 w-11 items-center justify-center rounded-lg">
                                                    <BuildingStorefrontIcon
                                                        className="h-6 w-6"
                                                        aria-hidden
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-pm-headline text-lg font-bold">
                                                        Add a role
                                                    </h3>
                                                    <p className="text-sm text-(--pm-on-surface-variant)">
                                                        Start with the most recent position.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <label className={caps} htmlFor="r-title">
                                                            Job title
                                                        </label>
                                                        <input
                                                            id="r-title"
                                                            className="intake-border-bottom w-full"
                                                            value={roleDraft.jobTitle}
                                                            onChange={(e) =>
                                                                setRoleDraft((r) => ({
                                                                    ...r,
                                                                    jobTitle: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className={caps} htmlFor="r-comp">
                                                            Company
                                                        </label>
                                                        <input
                                                            id="r-comp"
                                                            className="intake-border-bottom w-full"
                                                            value={roleDraft.company}
                                                            onChange={(e) =>
                                                                setRoleDraft((r) => ({
                                                                    ...r,
                                                                    company: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <div>
                                                        <label className={caps} htmlFor="r-s">
                                                            Start
                                                        </label>
                                                        <input
                                                            id="r-s"
                                                            className="intake-border-bottom w-full"
                                                            type="month"
                                                            value={roleDraft.startMonth}
                                                            onChange={(e) =>
                                                                setRoleDraft((r) => ({
                                                                    ...r,
                                                                    startMonth: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="mb-1 flex items-center justify-between">
                                                            <span className={caps}>End</span>
                                                        </div>
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                                            <input
                                                                className="intake-border-bottom w-full"
                                                                type="month"
                                                                disabled={roleDraft.present}
                                                                value={roleDraft.endMonth}
                                                                onChange={(e) =>
                                                                    setRoleDraft((r) => ({
                                                                        ...r,
                                                                        endMonth: e.target.value,
                                                                    }))
                                                                }
                                                            />
                                                            <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-(--pm-on-surface-variant)">
                                                                <input
                                                                    type="checkbox"
                                                                    className="checkbox checkbox-sm checkbox-primary"
                                                                    checked={roleDraft.present}
                                                                    onChange={(e) =>
                                                                        setRoleDraft((r) => ({
                                                                            ...r,
                                                                            present: e.target.checked,
                                                                        }))
                                                                    }
                                                                />
                                                                Now
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={caps} htmlFor="r-d">
                                                        Role description
                                                    </label>
                                                    <textarea
                                                        id="r-d"
                                                        className="intake-border-bottom w-full min-h-24 resize-none"
                                                        rows={4}
                                                        value={roleDraft.description}
                                                        onChange={(e) =>
                                                            setRoleDraft((r) => ({
                                                                ...r,
                                                                description: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addWorkEntry}
                                                    className="btn btn-primary"
                                                >
                                                    Add to timeline
                                                </button>
                                            </div>
                                        </section>
                                        {data.experience.entries.length > 0 && (
                                            <section>
                                                <h3 className="mb-3 font-pm-headline text-lg font-bold px-0.5">
                                                    Timeline
                                                </h3>
                                                <ul className="space-y-3">
                                                    {data.experience.entries.map((e) => (
                                                        <li
                                                            key={e.id}
                                                            className="intake-glass border-base-300/50 flex gap-3 rounded-xl border p-4"
                                                        >
                                                            <div className="bg-secondary/10 text-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                                                <BriefcaseIcon
                                                                    className="h-5 w-5"
                                                                    aria-hidden
                                                                />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="min-w-0 pr-1">
                                                                        <h4 className="font-pm-headline wrap-break-word text-base font-bold text-(--pm-on-surface)">
                                                                            {e.jobTitle}
                                                                        </h4>
                                                                        <p className="wrap-break-word text-sm font-semibold text-secondary">
                                                                            {e.company} —{" "}
                                                                            {e.present
                                                                                ? `${e.startMonth} to now`
                                                                                : `${e.startMonth} to ${e.endMonth || "?"}`}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setData((d) => ({
                                                                                ...d,
                                                                                experience: {
                                                                                    ...d.experience,
                                                                                    entries:
                                                                                        d.experience.entries.filter(
                                                                                            (x) => x.id !== e.id
                                                                                        ),
                                                                                },
                                                                            }))
                                                                        }
                                                                        className="text-(--pm-on-surface-variant) hover:text-error"
                                                                    >
                                                                        <TrashIcon
                                                                            className="h-5 w-5"
                                                                            aria-hidden
                                                                        />
                                                                    </button>
                                                                </div>
                                                                {e.description ? (
                                                                    <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-(--pm-on-surface-variant)">
                                                                        {e.description}
                                                                    </p>
                                                                ) : null}
                                                                {e.impacts.length > 0 && (
                                                                    <div className="mt-3">
                                                                        <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-(--pm-on-surface-variant)">
                                                                            Key impacts
                                                                        </p>
                                                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                                            {e.impacts.map((m) => (
                                                                                <div
                                                                                    key={m.id}
                                                                                    className="rounded-lg border border-secondary/20 bg-base-100/80 px-2 py-1.5 text-center dark:bg-base-200/40"
                                                                                >
                                                                                    <p className="text-base font-extrabold text-primary">
                                                                                        {m.value}
                                                                                    </p>
                                                                                    <p className="text-[0.6rem] font-bold uppercase tracking-wide text-(--pm-on-surface-variant)">
                                                                                        {m.label}
                                                                                    </p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </section>
                                        )}
                                    </div>
                                    <div className="space-y-5 lg:col-span-5">
                                        <div className="rounded-2xl border border-secondary/25 bg-secondary/5 p-5 sm:p-6">
                                            <h3 className="font-pm-headline mb-1 flex items-center gap-2 text-lg font-bold text-secondary">
                                                <ChartBarIcon
                                                    className="h-5 w-5"
                                                    aria-hidden
                                                />
                                                Key impacts
                                            </h3>
                                            <p className="mb-4 text-sm text-(--pm-on-surface-variant)">
                                                For the role in the form on the left, add
                                                quick stats or wins, then &quot;Add to
                                                timeline&quot; — they are saved on that
                                                card and the panel below starts fresh for
                                                the next role.
                                            </p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {data.experience.impacts.map((m) => (
                                                    <div
                                                        key={m.id}
                                                        className="intake-form-canvas flex flex-col items-center gap-0.5 rounded-lg border border-base-300/60 bg-base-100 p-3 text-center dark:bg-base-200/50"
                                                    >
                                                        <div className="w-full min-w-0">
                                                            <input
                                                                className="w-full text-center text-xl font-extrabold text-primary"
                                                                value={m.value}
                                                                onChange={(e) => {
                                                                    const v = e.target.value;
                                                                    setData((d) => ({
                                                                        ...d,
                                                                        experience: {
                                                                            ...d.experience,
                                                                            impacts:
                                                                                d.experience.impacts.map(
                                                                                    (x) =>
                                                                                        x.id === m.id
                                                                                            ? {
                                                                                                ...x,
                                                                                                value: v,
                                                                                            }
                                                                                            : x
                                                                                ),
                                                                        },
                                                                    }));
                                                                }}
                                                            />
                                                        </div>
                                                        <input
                                                            className="w-full min-w-0 text-center text-[0.6rem] font-bold uppercase tracking-wide text-(--pm-on-surface-variant)"
                                                            value={m.label}
                                                            onChange={(e) => {
                                                                const v = e.target.value;
                                                                setData((d) => ({
                                                                    ...d,
                                                                    experience: {
                                                                        ...d.experience,
                                                                        impacts: d.experience.impacts.map(
                                                                            (x) =>
                                                                                x.id === m.id
                                                                                    ? { ...x, label: v }
                                                                                    : x
                                                                        ),
                                                                    },
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-end">
                                                <input
                                                    className={inputLg + " sm:flex-1 text-sm"}
                                                    placeholder="Stat (e.g. 14+)"
                                                    value={newImpactValue}
                                                    onChange={(e) => setNewImpactValue(e.target.value)}
                                                />
                                                <input
                                                    className={inputLg + " sm:flex-1 text-sm"}
                                                    placeholder="Label (e.g. client launches)"
                                                    value={newImpactLabel}
                                                    onChange={(e) => setNewImpactLabel(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn border border-dashed border-secondary/30 text-secondary h-9 text-xs"
                                                    onClick={() => {
                                                        if (!newImpactValue.trim() && !newImpactLabel.trim()) {
                                                            return;
                                                        }
                                                        setData((d) => ({
                                                            ...d,
                                                            experience: {
                                                                ...d.experience,
                                                                impacts: [
                                                                    ...d.experience.impacts,
                                                                    {
                                                                        id: crypto.randomUUID(),
                                                                        value: newImpactValue || "—",
                                                                        label: newImpactLabel || "highlight",
                                                                    },
                                                                ],
                                                            },
                                                        }));
                                                        setNewImpactValue("");
                                                        setNewImpactLabel("");
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-col justify-end gap-2 border-t border-base-300/50 pt-6 sm:flex-row sm:items-center">
                                    <span />
                                    <div className="flex gap-2 sm:ml-auto">
                                        <button type="button" onClick={saveDraft} className="btn btn-ghost h-10">
                                            Save progress
                                        </button>
                                        <button type="button" onClick={goNext} className="btn btn-primary h-10">
                                            Next: Skills
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <p className="text-xs font-bold tracking-widest text-secondary uppercase">
                                    Step 2 of 4
                                </p>
                                <header className="mb-8 max-w-2xl">
                                    <h2 className="font-pm-headline text-2xl font-extrabold tracking-tight sm:text-3xl">
                                        Your skills
                                    </h2>
                                    <p className="text-(--pm-on-surface-variant)">
                                        Group your strengths into a few clear categories, add
                                        the tools you use, and a short “voice line” (optional) so
                                        the copy feels like you.
                                    </p>
                                </header>
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                                    <div className="space-y-5 lg:col-span-5">
                                        <section className="rounded-xl border border-base-300/70 bg-base-100 p-5 sm:p-6">
                                            <h3 className="font-pm-headline mb-4 text-lg font-bold text-primary">
                                                New category
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className={caps}>Name</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={skillDraft.name}
                                                        onChange={(e) =>
                                                            setSkillDraft((d) => ({
                                                                ...d,
                                                                name: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <span className={caps}>Description</span>
                                                    <textarea
                                                        className="intake-border-bottom w-full min-h-20 resize-none"
                                                        rows={3}
                                                        value={skillDraft.description}
                                                        onChange={(e) =>
                                                            setSkillDraft((d) => ({
                                                                ...d,
                                                                description: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <span className={caps}>Tools &amp; stack</span>
                                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                                        {skillDraft.tools.map((t) => (
                                                            <span
                                                                key={t}
                                                                className="inline-flex items-center gap-0.5 rounded-full border border-secondary/30 bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary"
                                                            >
                                                                {t}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSkillDraft((d) => ({
                                                                            ...d,
                                                                            tools: d.tools.filter(
                                                                                (x) => x !== t
                                                                            ),
                                                                        }))
                                                                    }
                                                                >
                                                                    <XMarkIcon
                                                                        className="h-3.5 w-3.5"
                                                                        aria-hidden
                                                                    />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2 flex gap-1">
                                                        <input
                                                            className={inputLg + " flex-1 text-sm h-8"}
                                                            placeholder="Add a tool, press enter"
                                                            value={toolInput}
                                                            onChange={(e) => setToolInput(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    const t = toolInput.trim();
                                                                    if (!t) return;
                                                                    if (!skillDraft.tools.includes(t)) {
                                                                        setSkillDraft((d) => ({
                                                                            ...d,
                                                                            tools: [...d.tools, t],
                                                                        }));
                                                                    }
                                                                    setToolInput("");
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="mb-0.5 flex items-center gap-1">
                                                        <span className={caps}>Line in your voice</span>
                                                    </div>
                                                    <input
                                                        className="intake-border-bottom w-full italic text-(--pm-on-surface) placeholder:italic"
                                                        placeholder='e.g. I live in Figma, ship in the browser'
                                                        value={skillDraft.idiom}
                                                        onChange={(e) =>
                                                            setSkillDraft((d) => ({
                                                                ...d,
                                                                idiom: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!skillDraft.name.trim()) {
                                                            setError("Name this category to add it.");
                                                            return;
                                                        }
                                                        setError(null);
                                                        setData((d) => ({
                                                            ...d,
                                                            skills: {
                                                                categories: [
                                                                    {
                                                                        id: skillDraft.id,
                                                                        name: skillDraft.name,
                                                                        description: skillDraft.description,
                                                                        tools: [...skillDraft.tools],
                                                                        idiom: skillDraft.idiom,
                                                                    },
                                                                    ...d.skills.categories,
                                                                ],
                                                            },
                                                        }));
                                                        setSkillDraft({ ...emptySkillCategory() });
                                                        setToolInput("");
                                                    }}
                                                    className="btn btn-primary w-full"
                                                >
                                                    Add to portfolio
                                                </button>
                                            </div>
                                        </section>
                                        <div className="relative overflow-hidden rounded-xl border border-(--pm-tertiary)/20 bg-(--pm-surface-low) p-5 text-(--pm-on-surface)">
                                            <h4 className="font-pm-headline mb-1 text-base font-bold">Tip</h4>
                                            <p className="text-sm text-(--pm-on-surface-variant)">
                                                Clients skim categories first—lead with 3–4 strong
                                                labels, not every tool you’ve ever touched.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-7">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {data.skills.categories.length === 0 && (
                                                <p className="md:col-span-2 text-sm text-(--pm-on-surface-variant)">
                                                    Categories you add appear here in a bento
                                                    layout.
                                                </p>
                                            )}
                                            {data.skills.categories.map((c) => (
                                                <div
                                                    key={c.id}
                                                    className="intake-form-canvas flex h-full min-h-0 flex-col rounded-xl border border-base-300/60 bg-base-100/90 p-4"
                                                >
                                                    <div className="mb-2 flex justify-between">
                                                        <div className="text-primary">
                                                            <PaintBrushIcon
                                                                className="h-5 w-5"
                                                                aria-hidden
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setData((d) => ({
                                                                    ...d,
                                                                    skills: {
                                                                        categories:
                                                                            d.skills.categories.filter(
                                                                                (x) => x.id !== c.id
                                                                            ),
                                                                    },
                                                                }))
                                                            }
                                                        >
                                                            <TrashIcon
                                                                className="h-5 w-5 text-(--pm-on-surface-variant) hover:text-error"
                                                                aria-hidden
                                                            />
                                                        </button>
                                                    </div>
                                                    <h4 className="font-pm-headline text-base font-bold">
                                                        {c.name}
                                                    </h4>
                                                    <p className="mb-2 grow text-sm text-(--pm-on-surface-variant)">
                                                        {c.description}
                                                    </p>
                                                    <div className="mb-2 flex flex-wrap gap-1">
                                                        {c.tools.map((t) => (
                                                            <span
                                                                key={t}
                                                                className="rounded bg-secondary/15 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-secondary uppercase"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {c.idiom ? (
                                                        <p className="border-t border-base-300/50 pt-2 text-sm italic text-primary/80">
                                                            “{c.idiom}”
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ))}
                                            {data.skills.categories.length > 0 && (
                                                <div className="relative overflow-hidden rounded-xl border-2 border-primary/25 bg-linear-to-br from-primary/5 to-secondary/5 p-4 md:col-span-2 md:p-5">
                                                    <div className="grid gap-4 md:grid-cols-2 md:items-center">
                                                        <p className="text-sm text-(--pm-on-surface-variant)">
                                                            Featured layout uses your first category as
                                                            the “hero” panel on the skills section of
                                                            the site. You can always reorder in a
                                                            follow-up.
                                                        </p>
                                                        <div className="relative h-40 w-full overflow-hidden rounded-2xl md:h-44">
                                                            <Image
                                                                src={SKILLS_FEATURE_IMG}
                                                                alt="Abstract 3D shapes"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex flex-col border-t border-base-300/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="text-(--pm-on-surface-variant) flex items-center gap-1 text-sm font-semibold hover:text-primary"
                                    >
                                        <ArrowLeftIcon
                                            className="h-4 w-4"
                                            aria-hidden
                                        />
                                        Back
                                    </button>
                                    <div className="mt-3 flex gap-2 sm:mt-0">
                                        <button type="button" onClick={goNext} className="btn btn-primary">
                                            Next: Education
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <p className="text-xs font-bold tracking-widest text-secondary uppercase">
                                    Step 3 of 4
                                </p>
                                <header className="mb-8 max-w-2xl">
                                    <h2 className="font-pm-headline text-2xl font-extrabold tracking-tight sm:text-3xl">
                                        Education
                                    </h2>
                                    <p className="text-(--pm-on-surface-variant)">
                                        Programs, honors, and coursework that back up the story
                                        on your about page.
                                    </p>
                                </header>
                                <div className="space-y-4">
                                    {data.education.entries.map((e) => (
                                        <div
                                            key={e.id}
                                            className="intake-form-canvas rounded-xl border border-base-300/60 bg-base-100/90 p-5"
                                        >
                                            <div className="mb-2 flex justify-end">
                                                {data.education.entries.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setData((d) => ({
                                                                ...d,
                                                                education: {
                                                                    entries: d.education.entries.filter(
                                                                        (x) => x.id !== e.id
                                                                    ),
                                                                },
                                                            }))
                                                        }
                                                    >
                                                        <span className="text-(--pm-on-surface-variant) hover:text-error">Remove</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                                                <div className="md:col-span-8">
                                                    <span className={caps}>Institution</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={e.institution}
                                                        onChange={(ev) => {
                                                            const v = ev.target.value;
                                                            setData((d) => ({
                                                                ...d,
                                                                education: {
                                                                    entries: d.education.entries.map(
                                                                        (x) =>
                                                                            x.id === e.id
                                                                                ? { ...x, institution: v }
                                                                                : x
                                                                    ),
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="md:col-span-4">
                                                    <span className={caps}>Year</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={e.graduationYear}
                                                        onChange={(ev) => {
                                                            const v = ev.target.value;
                                                            setData((d) => ({
                                                                ...d,
                                                                education: {
                                                                    entries: d.education.entries.map(
                                                                        (x) =>
                                                                            x.id === e.id
                                                                                ? {
                                                                                    ...x,
                                                                                    graduationYear: v,
                                                                                }
                                                                                : x
                                                                    ),
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="md:col-span-12">
                                                    <span className={caps}>Program / degree</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={e.degree}
                                                        onChange={(ev) => {
                                                            const v = ev.target.value;
                                                            setData((d) => ({
                                                                ...d,
                                                                education: {
                                                                    entries: d.education.entries.map(
                                                                        (x) =>
                                                                            x.id === e.id
                                                                                ? { ...x, degree: v }
                                                                                : x
                                                                    ),
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                                <div className="md:col-span-12 rounded-lg border-l-4 border-secondary/40 bg-base-200/30 p-3">
                                                    <span className="text-xs font-bold tracking-wide text-secondary">
                                                        THESIS / CAPSTONE / FOCUS
                                                    </span>
                                                    <input
                                                        className="intake-border-bottom mt-1 w-full"
                                                        value={e.thesis}
                                                        onChange={(ev) => {
                                                            const v = ev.target.value;
                                                            setData((d) => ({
                                                                ...d,
                                                                education: {
                                                                    entries: d.education.entries.map(
                                                                        (x) =>
                                                                            x.id === e.id
                                                                                ? { ...x, thesis: v }
                                                                                : x
                                                                    ),
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <span className={caps}>Honors &amp; awards</span>
                                                    <div className="mb-1 flex flex-wrap gap-1">
                                                        {e.honors.map((h) => (
                                                            <span
                                                                key={h}
                                                                className="inline-flex items-center gap-0.5 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-(--pm-on-surface)"
                                                            >
                                                                {h}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData((d) => ({
                                                                            ...d,
                                                                            education: {
                                                                                entries:
                                                                                    d.education.entries.map(
                                                                                        (x) =>
                                                                                            x.id ===
                                                                                                e.id
                                                                                                ? {
                                                                                                    ...x,
                                                                                                    honors: x.honors.filter(
                                                                                                        (o) => o !== h
                                                                                                    ),
                                                                                                }
                                                                                                : x
                                                                                    ),
                                                                            },
                                                                        }));
                                                                    }}
                                                                >
                                                                    <XMarkIcon
                                                                        className="h-3.5 w-3.5"
                                                                        aria-hidden
                                                                    />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <input
                                                        className={inputLg + " h-8 text-sm"}
                                                        placeholder="Add, enter"
                                                        value={honorIn[e.id] ?? ""}
                                                        onChange={(ev) =>
                                                            setHonorIn((h) => ({
                                                                ...h,
                                                                [e.id]: ev.target.value,
                                                            }))
                                                        }
                                                        onKeyDown={(ev) => {
                                                            if (ev.key !== "Enter") return;
                                                            ev.preventDefault();
                                                            const t = (honorIn[e.id] ?? "").trim();
                                                            if (!t) return;
                                                            setData((d) => ({
                                                                ...d,
                                                                education: {
                                                                    entries: d.education.entries.map(
                                                                        (x) =>
                                                                            x.id === e.id
                                                                                ? { ...x, honors: [...x.honors, t] }
                                                                                : x
                                                                    ),
                                                                },
                                                            }));
                                                            setHonorIn((h) => ({ ...h, [e.id]: "" }));
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <span className={caps}>Relevant study</span>
                                                    <div className="mb-1 flex flex-wrap gap-1">
                                                        {e.curriculum.map((h) => (
                                                            <span
                                                                key={h}
                                                                className="rounded border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs"
                                                            >
                                                                {h}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <input
                                                        className={inputLg + " h-8 text-sm"}
                                                        placeholder="e.g. typography, motion"
                                                        value={curriculumIn[e.id] ?? ""}
                                                        onChange={(ev) =>
                                                            setCurriculumIn((h) => ({
                                                                ...h,
                                                                [e.id]: ev.target.value,
                                                            }))
                                                        }
                                                        onKeyDown={(ev) => {
                                                            if (ev.key !== "Enter") return;
                                                            ev.preventDefault();
                                                            const t = (curriculumIn[e.id] ?? "").trim();
                                                            if (!t) return;
                                                            setData((d) => ({
                                                                ...d,
                                                                education: {
                                                                    entries: d.education.entries.map(
                                                                        (x) =>
                                                                            x.id === e.id
                                                                                ? {
                                                                                    ...x,
                                                                                    curriculum: [
                                                                                        ...x.curriculum,
                                                                                        t,
                                                                                    ],
                                                                                }
                                                                                : x
                                                                    ),
                                                                },
                                                            }));
                                                            setCurriculumIn((h) => ({ ...h, [e.id]: "" }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setData((d) => ({
                                            ...d,
                                            education: {
                                                entries: [...d.education.entries, emptyEducation()],
                                            },
                                        }))
                                    }
                                    className="mt-2 flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-base-300/60 py-6 text-(--pm-on-surface-variant) hover:border-primary/30 hover:text-primary"
                                >
                                    <PlusCircleIcon
                                        className="h-8 w-8"
                                        aria-hidden
                                    />
                                    <span className="text-sm font-semibold">Add another program</span>
                                </button>
                                <div className="mt-6 flex border-t border-base-300/50 pt-4 sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="text-(--pm-on-surface-variant) flex items-center gap-1 text-sm font-semibold"
                                    >
                                        <ArrowLeftIcon
                                            className="h-4 w-4"
                                            aria-hidden
                                        />
                                        Back
                                    </button>
                                    <button type="button" onClick={goNext} className="btn btn-primary sm:ml-auto">
                                        Next: contact &amp; review
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <p className="text-xs font-bold tracking-widest text-secondary uppercase">
                                    Step 4 of 4
                                </p>
                                <header className="mb-6 max-w-2xl">
                                    <h2 className="font-pm-headline text-2xl font-extrabold sm:text-3xl">
                                        Review &amp; contact
                                    </h2>
                                    <p className="text-(--pm-on-surface-variant)">
                                        How the hero on your new site can read, and where people
                                        can follow you. You can still tweak copy after this.
                                    </p>
                                </header>
                                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                                    <div className="intake-glass space-y-4 rounded-xl border border-base-300/50 p-5 sm:p-6 lg:col-span-8">
                                        <span className="text-[0.65rem] font-bold tracking-[0.12em] text-primary uppercase">
                                            Hero preview
                                        </span>
                                        <div>
                                            <span className={caps}>Name &amp; line</span>
                                            <h3 className="font-pm-headline text-2xl font-bold text-(--pm-on-surface)">
                                                {data.contactReview.fullName || "Your name"} —{" "}
                                                {data.contactReview.professionalTitle ||
                                                    "Your title or craft"}
                                            </h3>
                                        </div>
                                        <div>
                                            <span className={caps}>How you want to be introduced</span>
                                            <textarea
                                                className="intake-border-bottom w-full min-h-28"
                                                value={data.contactReview.summary}
                                                onChange={(e) =>
                                                    setData((d) => ({
                                                        ...d,
                                                        contactReview: {
                                                            ...d.contactReview,
                                                            summary: e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-primary">
                                            <span className="inline-flex items-center gap-1">
                                                <MapPinIcon
                                                    className="h-4 w-4"
                                                    aria-hidden
                                                />
                                                <input
                                                    className="intake-border-bottom w-40 min-w-0 sm:w-56"
                                                    value={data.contactReview.location}
                                                    onChange={(e) =>
                                                        setData((d) => ({
                                                            ...d,
                                                            contactReview: {
                                                                ...d.contactReview,
                                                                location: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-secondary">
                                                <ClockIcon
                                                    className="h-4 w-4"
                                                    aria-hidden
                                                />
                                                <input
                                                    className="intake-border-bottom w-32 min-w-0 sm:w-40"
                                                    value={data.contactReview.availability}
                                                    onChange={(e) =>
                                                        setData((d) => ({
                                                            ...d,
                                                            contactReview: {
                                                                ...d.contactReview,
                                                                availability: e.target.value,
                                                            },
                                                        }))
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4 lg:col-span-4">
                                        <div className="rounded-xl border border-base-300/60 bg-base-100/90 p-4">
                                            <h3 className="font-pm-headline mb-3 text-base font-bold">Links</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className={caps}>Name</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={data.contactReview.fullName}
                                                        onChange={(e) =>
                                                            setData((d) => ({
                                                                ...d,
                                                                contactReview: {
                                                                    ...d.contactReview,
                                                                    fullName: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <span className={caps}>Title or craft</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={data.contactReview.professionalTitle}
                                                        onChange={(e) =>
                                                            setData((d) => ({
                                                                ...d,
                                                                contactReview: {
                                                                    ...d.contactReview,
                                                                    professionalTitle: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <span className={caps}>Email *</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        type="email"
                                                        autoComplete="email"
                                                        value={data.contactReview.email}
                                                        onChange={(e) =>
                                                            setData((d) => ({
                                                                ...d,
                                                                contactReview: {
                                                                    ...d.contactReview,
                                                                    email: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <span className={caps}>LinkedIn</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={data.contactReview.linkedin}
                                                        onChange={(e) =>
                                                            setData((d) => ({
                                                                ...d,
                                                                contactReview: {
                                                                    ...d.contactReview,
                                                                    linkedin: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <span className={caps}>Other (Instagram, etc.)</span>
                                                    <input
                                                        className="intake-border-bottom w-full"
                                                        value={data.contactReview.social}
                                                        onChange={(e) =>
                                                            setData((d) => ({
                                                                ...d,
                                                                contactReview: {
                                                                    ...d.contactReview,
                                                                    social: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-secondary/25 bg-secondary/5 p-3 text-sm text-(--pm-on-surface)">
                                            <p className="mb-0.5 flex items-center gap-1 font-bold text-secondary">
                                                <ShieldCheckIcon
                                                    className="h-4 w-4"
                                                    aria-hidden
                                                />
                                                Privacy
                                            </p>
                                            <p className="text-xs text-(--pm-on-surface-variant)">
                                                Your brief is for project planning. I don’t resell
                                                your contact info.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-12">
                                        <div className="intake-form-canvas flex flex-col items-start justify-between gap-3 rounded-xl border border-base-300/60 p-4 sm:flex-row sm:items-center sm:p-5">
                                            <div className="text-primary">
                                                <CheckCircleIcon
                                                    className="h-8 w-8"
                                                    aria-hidden
                                                />
                                            </div>
                                            <p className="min-w-0 text-sm text-(--pm-on-surface-variant)">
                                                Take a last look at the left column, then send this
                                                brief. You can add more in email anytime.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-12">
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                                            {REVIEW_IMGS.map((u, i) => (
                                                <div
                                                    key={u + i}
                                                    className="relative aspect-video w-full overflow-hidden rounded-xl grayscale transition-all hover:grayscale-0"
                                                >
                                                    <Image
                                                        src={u}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col border-t border-base-300/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="text-(--pm-on-surface-variant) mb-2 flex items-center gap-1 text-sm font-semibold sm:mb-0"
                                    >
                                        <ArrowLeftIcon
                                            className="h-4 w-4"
                                            aria-hidden
                                        />
                                        Back
                                    </button>
                                    <div className="flex gap-2 sm:ml-auto">
                                        <button
                                            type="button"
                                            onClick={saveDraft}
                                            className="btn btn-ghost h-9 border border-base-300/80"
                                        >
                                            Save draft
                                        </button>
                                        <button
                                            type="button"
                                            disabled={sending}
                                            onClick={() => void submit()}
                                            className="btn btn-primary h-9"
                                        >
                                            {sending ? "Sending…" : "Send portfolio brief"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
