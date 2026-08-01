import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import AuditSectionCard from "@/components/websiteAudit/AuditSectionCard";
import MethodologySection from "@/components/websiteAudit/MethodologySection";
import WebsiteAuditForm from "@/components/websiteAudit/WebsiteAuditForm";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";

const measures = [
    {
        title: "Performance",
        description:
            "Page speed, loading behaviour, and technical issues that may make the site feel slower than it should.",
    },
    {
        title: "Accessibility",
        description:
            "Basic usability signals such as labels, contrast, semantics, and mobile readability.",
    },
    {
        title: "Messaging and trust",
        description:
            "How clearly the site explains the offer, supports credibility, and reduces hesitation for new visitors.",
    },
    {
        title: "Mobile and conversion clarity",
        description:
            "How well the website guides people on smaller screens toward contacting, booking, or requesting a quote.",
    },
];

const methodologyItems = [
    "Automated technical checks provide a baseline view of visible page issues and opportunities.",
    "Google PageSpeed data helps surface real-world performance patterns and loading constraints.",
    "Visual review looks at trust signals, messaging clarity, mobile UX, and conversion friction.",
    "Nice Guy Web Design criteria prioritize practical improvements for small-business websites.",
];

export default function WebsiteAuditLandingPage() {
    return (
        <div className="bg-(--pm-surface) pb-20 text-(--pm-on-surface)">
            <PageHero
                eyebrow="Work"
                title="Find opportunities to improve your website"
                description="Enter your website address to receive a practical review of its performance, accessibility, messaging, trust signals, mobile experience, and conversion clarity."
                primaryHref="#website-audit-form"
                primaryLabel="Start the audit"
                secondaryHref="/contact"
                secondaryLabel="Talk about your website"
            />

            <div className={`${sitePageContentClass} grid grid-cols-1 gap-8`}>
                <div id="website-audit-form">
                    <WebsiteAuditForm />
                </div>

                <AuditSectionCard
                    title="What the audit measures"
                    description="The audit is designed to highlight issues that affect visibility, trust, usability, and lead generation for small-business websites."
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {measures.map((item) => (
                            <article key={item.title} className="rounded-2xl bg-base-200 p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-base-content">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-base-content/75">
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </AuditSectionCard>

                <MethodologySection items={methodologyItems} />

                <AuditSectionCard
                    title="Already requested an audit?"
                    description="If you submitted a request recently, our team is reviewing it in the audit dashboard."
                >
                    <form className="grid grid-cols-1 gap-5 md:grid-cols-2" noValidate>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-base-content" htmlFor="lookup-reference">
                                Report token or business email
                            </label>
                            <input
                                id="lookup-reference"
                                type="text"
                                placeholder="Enter your token or email"
                                className="input input-bordered w-full bg-base-100"
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="button" className="btn btn-outline w-full md:w-auto" disabled>
                                Lookup report
                            </button>
                        </div>
                        <div className="md:col-span-2">
                            <p className="rounded-xl bg-base-200 p-4 text-sm leading-relaxed text-base-content/80">
                                Report lookup is not wired up yet. This placeholder will be connected to report retrieval in a later implementation step.
                            </p>
                        </div>
                    </form>
                </AuditSectionCard>

                <AuditSectionCard
                    title="Need a hands-on review?"
                    description="If you want help prioritizing the next improvements for your website, get in touch directly."
                    actions={
                        <Link href="/contact" className="btn btn-primary">
                            Contact Nice Guy Web Design
                        </Link>
                    }
                >
                    <p className="max-w-3xl text-sm leading-relaxed text-base-content/75">
                        Public audit requests are saved to the administrator dashboard. Sign in to review new submissions and start the audit pipeline from there.
                    </p>
                </AuditSectionCard>
            </div>
        </div>
    );
}
