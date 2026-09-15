import {
    ArrowRightIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import AuditScanBrowserVisual from "@/components/websiteAudit/AuditScanBrowserVisual";
import AuditSectionLabel from "@/components/websiteAudit/AuditSectionLabel";
import {
    AUDIT_LANDING_MEASURES,
    AUDIT_LANDING_METHOD_ROWS,
    AUDIT_LANDING_METHOD_STRIP,
    AUDIT_LANDING_STEPS,
} from "@/components/websiteAudit/audit-landing-content";
import ReportLookupForm from "@/components/websiteAudit/ReportLookupForm";
import WebsiteAuditForm from "@/components/websiteAudit/WebsiteAuditForm";
import {
    pixelPageEyebrow,
    pixelPageHeading,
    pricingLayoutHeroHeadline as heroHeadline,
    pricingLayoutPixelLabel as pixelLabel,
    responsivePageHeroTitleClass,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";

/** Public `/work/website-audit` landing page. */
export default function WebsiteAuditLandingPage() {
    return (
        <div className="bg-(--pm-surface) text-(--pm-on-surface)">
            {/* Hero — two-column copy + visual */}
            <section className="relative overflow-hidden border-b border-base-300">
                <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-30" aria-hidden />
                <div
                    className={`relative grid items-center gap-14 py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:py-24 ${sitePageContentClass}`}
                >
                    <div className="min-w-0">
                        <span
                            className={`mb-4 block text-sm font-bold ${pixelLabel} ${pixelPageEyebrow}`}
                        >
                            Website audit
                        </span>
                        <h1
                            className={`w-full min-w-0 text-balance font-extrabold ${heroHeadline} ${responsivePageHeroTitleClass} ${pixelPageHeading}`}
                        >
                            Find <PixelKeyword>Opportunities</PixelKeyword> To Improve Your{" "}
                            <PixelKeyword>Website</PixelKeyword>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-base-content/75 sm:text-lg">
                            Enter your website address to receive a practical review of its
                            performance, accessibility, messaging, trust signals, mobile
                            experience and conversion clarity.
                        </p>
                        <div className="mt-9 flex flex-wrap items-center gap-4 sm:gap-5">
                            <PixelCtaLink
                                href="#website-audit-form"
                                color="var(--ng-btn-coral)"
                                pill={false}
                                hoverFill={false}
                                className="group"
                            >
                                Start the audit
                                <ArrowRightIcon
                                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                    aria-hidden
                                />
                            </PixelCtaLink>
                            <PixelCtaLink
                                href="/contact"
                                color="var(--ng-btn-sky)"
                                pill={false}
                                hoverFill={false}
                                className="group"
                            >
                                Talk about your website
                                <ArrowRightIcon
                                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                    aria-hidden
                                />
                            </PixelCtaLink>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <AuditScanBrowserVisual />
                    </div>
                </div>
            </section>

            {/* Submission — form + what happens next */}
            <section className="border-b border-base-300 bg-base-100">
                <div className={`py-16 lg:py-24 ${sitePageContentClass}`}>
                    <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
                        <div id="website-audit-form" className="min-w-0 scroll-mt-24">
                            <WebsiteAuditForm
                                embedded
                                showPrivacyNote={false}
                                showSectionHeader
                            />

                            <div className="mt-12 border-t border-base-300 pt-6">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    {AUDIT_LANDING_METHOD_STRIP.map((item, index) => (
                                        <span key={item} className="flex items-center gap-3">
                                            {index > 0 ? (
                                                <span className="text-primary" aria-hidden>
                                                    +
                                                </span>
                                            ) : null}
                                            <span className="text-xs font-medium uppercase tracking-[0.12em] text-base-content/80">
                                                {item}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-4 flex max-w-xl gap-3 text-sm text-base-content/65">
                                    <ShieldCheckIcon
                                        className="mt-0.5 size-4 shrink-0 text-primary"
                                        aria-hidden
                                    />
                                    Your audit uses publicly available website data and does not
                                    access private analytics, sales data or customer information.
                                </p>
                            </div>
                        </div>

                        <div className="min-w-0 lg:border-l lg:border-base-300 lg:pl-12">
                            <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-base-content/55">
                                What happens next?
                            </h3>
                            <ol className="mt-7 space-y-8">
                                {AUDIT_LANDING_STEPS.map((step, index) => (
                                    <li key={step.n} className="relative flex gap-5">
                                        <div className="flex shrink-0 flex-col items-center">
                                            <span className="grid size-9 place-items-center border border-primary/40 text-xs font-semibold text-primary">
                                                {step.n}
                                            </span>
                                            {index < AUDIT_LANDING_STEPS.length - 1 ? (
                                                <span
                                                    aria-hidden
                                                    className="mt-2 flex flex-col items-center gap-1"
                                                >
                                                    <span className="h-5 w-px bg-base-300" />
                                                    <span className="size-1.5 bg-primary/70" />
                                                    <span className="h-5 w-px bg-base-300" />
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="min-w-0 pb-1">
                                            <p className="font-semibold text-base-content">
                                                {step.title}
                                            </p>
                                            <p className="mt-1.5 text-sm text-base-content/65">
                                                {step.body}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* What we measure */}
            <section className="border-b border-base-300 bg-base-200/40">
                <div className={`py-16 lg:py-24 ${sitePageContentClass}`}>
                    <AuditSectionLabel index="02">What we measure</AuditSectionLabel>
                    <div className="mt-6 max-w-3xl">
                        <h2 className="text-2xl font-semibold text-base-content sm:text-3xl">
                            What your audit looks for
                        </h2>
                        <p className="mt-4 text-base-content/70">
                            We look beyond page speed to find issues that can affect usability,
                            trust and conversions.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-px bg-base-300 sm:grid-cols-2 lg:grid-cols-4">
                        {AUDIT_LANDING_MEASURES.map(({ n, icon: Icon, title, body }) => (
                            <div
                                key={n}
                                className="group relative bg-base-100 px-6 py-8 transition-colors hover:bg-base-200/80"
                            >
                                <span
                                    aria-hidden
                                    className="absolute left-0 top-0 h-px w-8 bg-primary opacity-40 transition-opacity group-hover:opacity-100"
                                />
                                <div className="flex items-center justify-between">
                                    <Icon className="size-5 text-primary" aria-hidden />
                                    <span className="text-xs font-semibold text-base-content/40">
                                        {n}
                                    </span>
                                </div>
                                <h3 className="mt-6 text-sm font-semibold text-base-content">
                                    {title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-base-content/65">
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Methodology */}
            <section className="border-b border-base-300 bg-base-100">
                <div className={`py-16 lg:py-24 ${sitePageContentClass}`}>
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                        <div className="min-w-0">
                            <AuditSectionLabel index="03">How it works</AuditSectionLabel>
                            <h2 className="mt-6 text-2xl font-semibold text-base-content sm:text-3xl">
                                A practical review, backed by real signals.
                            </h2>
                            <p className="mt-6 max-w-lg text-base-content/70">
                                Every audit blends automated measurement with a human pass over
                                the pages your customers actually see. The goal isn&apos;t a longer
                                report — it&apos;s a short list of changes worth making, in the
                                order they&apos;re worth making them.
                            </p>
                        </div>

                        <div className="min-w-0">
                            {AUDIT_LANDING_METHOD_ROWS.map((row, index) => (
                                <div
                                    key={row.n}
                                    className={`flex gap-6 py-6 ${index === 0 ? "" : "border-t border-base-300"
                                        }`}
                                >
                                    <span className="shrink-0 text-xs font-semibold text-primary">
                                        {row.n}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-base-content">
                                            {row.title}
                                        </p>
                                        <p className="mt-1.5 text-sm text-base-content/65">
                                            {row.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Report lookup — completed audit retrieval via email OTP */}
            <section
                id="retrieve-audit"
                className="scroll-mt-24 border-b border-base-300 bg-base-200/50"
            >
                <div className={`py-12 lg:py-16 ${sitePageContentClass}`}>
                    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                        <div className="min-w-0">
                            <div className="flex items-center gap-3">
                                <MagnifyingGlassIcon
                                    className="size-4 text-base-content/55"
                                    aria-hidden
                                />
                                <h2 className="text-lg font-semibold text-base-content">
                                    Already requested an audit?
                                </h2>
                            </div>
                            <p className="mt-3 text-sm text-base-content/65">
                                When your audit is ready, we email a PDF download link to the
                                business address you submitted. You can also retrieve a published
                                report here with email verification.
                            </p>
                        </div>
                        <div className="min-w-0">
                            <ReportLookupForm />
                        </div>
                    </div>
                </div>
            </section>

            <ServicesModernCTA className="scroll-mt-24" />
        </div>
    );
}
