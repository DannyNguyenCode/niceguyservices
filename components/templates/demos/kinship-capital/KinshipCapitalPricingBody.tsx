"use client";

import Link from "next/link";
import { KC_PATHS } from "./kinshipCapitalConfig";
import { KC_IMG } from "./kinshipCapitalImages";
import { KcContainer, KcIcon, KcImg } from "./KinshipCapitalShared";
import { useKcReveal } from "./useKcEffects";

const PLANS = [
  {
    name: "Personal Tax",
    desc: "For individuals & families seeking precision.",
    price: "499",
    period: "/annual",
    note: "Save $100 on early filing",
    features: ["Federal & State Filing", "Investment Income Audit", "Year-round Support"],
    cta: "Get Started",
    featured: false,
    dark: false,
  },
  {
    name: "Small Business",
    desc: "Optimized for LLPs, LLCs and Sole Proprietors.",
    price: "1,250",
    period: "/quarter",
    note: "15% Savings on Annual Commit",
    features: ["Quarterly P&L Analysis", "Strategic Tax Planning", "Payroll Management Integration", "Dedicated Account Lead"],
    cta: "Scale My Business",
    featured: true,
    dark: false,
  },
  {
    name: "Growing Business",
    desc: "Comprehensive CFO-level insights.",
    price: "2,800",
    period: "/month",
    note: "Scaleable resource planning",
    features: ["Monthly Strategic CFO Meetings", "Expansion Capital Advisory", "Tax Credit Optimization", "Risk Assessment & Audit prep"],
    cta: "Connect with Expert",
    featured: false,
    dark: false,
  },
  {
    name: "Enterprise Advisory",
    desc: "Multi-generational wealth & large firms.",
    price: "Custom",
    period: "",
    note: "Bespoke Concierge Structure",
    features: ["Family Office Management", "Global Compliance & Trust", "M&A Support & Valuation", "24/7 Priority Concierge"],
    cta: "Request Proposal",
    featured: false,
    dark: true,
  },
];

export function KinshipCapitalPricingBody() {
  useKcReveal(".kc-hover-lift");

  return (
    <main className="pt-20">
      <section className="relative overflow-hidden bg-[var(--kc-surface-container-lowest)] py-24 md:py-32">
        <KcContainer className="relative z-10 text-center">
          <span className="kc-label-sm mb-6 inline-block rounded-full bg-[var(--kc-primary-fixed)] px-4 py-1.5 text-[var(--kc-on-primary-fixed)]">
            TRANSPARENT PRICING
          </span>
          <h1 className="kc-headline-xl mx-auto mb-6 max-w-3xl text-[var(--kc-primary)]">
            Investment in Legacy,
            <br />
            Simplified for Growth.
          </h1>
          <p className="kc-body-lg mx-auto mb-10 max-w-2xl text-[var(--kc-on-surface-variant)]">
            Choose a partnership level designed to protect your assets and accelerate your family&apos;s financial future.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            {[
              { icon: "verified", label: "No Hidden Maintenance Fees" },
              { icon: "security", label: "SEC Compliant & Insured" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 rounded-full border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container)] px-4 py-2"
              >
                <KcIcon name={badge.icon} className="text-[var(--kc-primary)]" fill />
                <span className="kc-label-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </KcContainer>
        <div className="kc-organic-curve absolute bottom-0 left-0 h-24 w-full bg-[var(--kc-background)]" />
      </section>

      <section className="py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="grid grid-cols-1 gap-[var(--kc-gutter)] md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`kc-reveal kc-hover-lift relative flex flex-col overflow-hidden rounded-xl p-8 ${
                  plan.dark
                    ? "bg-[var(--kc-inverse-surface)] text-[var(--kc-inverse-on-surface)]"
                    : "border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)]"
                } ${plan.featured ? "z-20 scale-105 border-2 border-[var(--kc-primary-container)] shadow-xl" : ""}`}
              >
                {plan.featured ? (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-[var(--kc-primary-container)] px-4 py-1 kc-label-sm text-[var(--kc-on-primary-container)]">
                    POPULAR
                  </div>
                ) : null}
                <div className="mb-8">
                  <h3 className={`kc-headline-md mb-2 ${plan.dark ? "text-[var(--kc-inverse-primary)]" : "text-[var(--kc-on-surface)]"}`}>
                    {plan.name}
                  </h3>
                  <p className={`kc-body-md text-sm ${plan.dark ? "text-[var(--kc-surface-variant)]" : "text-[var(--kc-on-surface-variant)]"}`}>
                    {plan.desc}
                  </p>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" ? <span className="kc-headline-lg font-bold">$</span> : null}
                    <span className="kc-headline-xl font-bold">{plan.price}</span>
                    {plan.period ? <span className="kc-label-sm text-[var(--kc-on-surface-variant)]">{plan.period}</span> : null}
                  </div>
                  <p className={`kc-label-sm mt-2 ${plan.dark ? "text-[var(--kc-inverse-primary)]" : "text-[var(--kc-primary)]"}`}>
                    {plan.note}
                  </p>
                </div>
                <ul className="mb-10 flex-grow space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <KcIcon
                        name={plan.dark ? "stars" : "check_circle"}
                        className={`text-xl ${plan.dark ? "text-[var(--kc-inverse-primary)]" : "text-[var(--kc-primary)]"}`}
                      />
                      <span className="kc-body-md text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`w-full rounded-lg py-4 font-bold transition-all ${
                    plan.featured
                      ? "bg-[var(--kc-primary)] text-[var(--kc-on-primary)] shadow-lg hover:bg-[var(--kc-primary-container)]"
                      : plan.dark
                        ? "bg-[var(--kc-inverse-primary)] text-[var(--kc-on-primary-fixed)] hover:bg-[var(--kc-primary-fixed)]"
                        : "border-2 border-[var(--kc-primary)] text-[var(--kc-primary)] hover:bg-[var(--kc-primary)] hover:text-[var(--kc-on-primary)]"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="bg-[var(--kc-surface-container-low)] py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="mb-16 text-center">
            <h2 className="kc-headline-lg mb-4 text-[var(--kc-primary)]">Compare Concierge Levels</h2>
            <p className="kc-body-md text-[var(--kc-on-surface-variant)]">The depth of service you deserve, categorized for clarity.</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="bg-[var(--kc-surface-container)]">
                    <th className="kc-headline-md p-6 text-[var(--kc-on-surface)]">Core Capabilities</th>
                    <th className="kc-label-sm p-6 text-center">PERSONAL</th>
                    <th className="kc-label-sm p-6 text-center font-bold text-[var(--kc-primary)]">BUSINESS</th>
                    <th className="kc-label-sm p-6 text-center">ENTERPRISE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--kc-outline-variant)]">
                  {[
                    { label: "Annual Tax Preparation", personal: "check", business: "check", enterprise: "check" },
                    { label: "Quarterly Financial Health Checks", personal: "remove", business: "check", enterprise: "check" },
                    { label: "Wealth Transfer & Succession", personal: "remove", business: "remove", enterprise: "check" },
                    { label: "Internal Audit Defense", personal: "Basic", business: "Standard", enterprise: "Full Defense" },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="kc-body-md p-6">{row.label}</td>
                      {(["personal", "business", "enterprise"] as const).map((col) => (
                        <td key={col} className="p-6 text-center">
                          {row[col] === "check" || row[col] === "remove" ? (
                            <KcIcon
                              name={row[col]}
                              className={row[col] === "check" ? "text-[var(--kc-primary)]" : "text-[var(--kc-outline)]"}
                            />
                          ) : (
                            <span className={`kc-label-sm ${col === "enterprise" ? "font-bold text-[var(--kc-primary)]" : ""}`}>
                              {row[col]}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </KcContainer>
      </section>

      <section className="py-[var(--kc-stack-lg)]">
        <KcContainer>
          <h2 className="kc-headline-lg mb-16 text-center text-[var(--kc-primary)]">Why Heritage Marketplace?</h2>
          <div className="kc-bento-grid">
            <div className="col-span-12 flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] shadow-sm md:flex-row lg:col-span-8">
              <div className="flex flex-1 flex-col justify-center p-10">
                <span className="kc-label-sm mb-4 text-[var(--kc-primary)]">REAL-TIME VISIBILITY</span>
                <h3 className="kc-headline-lg mb-4">Modern Portal for Modern Families.</h3>
                <p className="kc-body-md mb-8 text-[var(--kc-on-surface-variant)]">
                  Access your consolidated financial dashboard from anywhere in the world. Secure, encrypted, and designed for
                  intuitive navigation.
                </p>
                <button type="button" className="w-fit rounded-lg bg-[var(--kc-primary)] px-6 py-2 kc-label-sm text-[var(--kc-on-primary)]">
                  Live Demo
                </button>
              </div>
              <div className="relative min-h-[300px] flex-1 bg-[var(--kc-primary-container)]">
                <KcImg src={KC_IMG.pricing.dashboard} alt="Financial dashboard on tablet" fill className="object-cover" sizes="50vw" />
              </div>
            </div>
            <div className="kc-hover-lift col-span-12 flex flex-col justify-between rounded-2xl border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-high)] p-10 md:col-span-6 lg:col-span-4">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--kc-primary)] text-[var(--kc-on-primary)]">
                <KcIcon name="verified_user" />
              </div>
              <div>
                <h4 className="kc-headline-md mb-2 text-[var(--kc-on-surface)]">CPA Certified</h4>
                <p className="kc-body-md text-[var(--kc-on-surface-variant)]">
                  Every advisor in our marketplace is a board-certified public accountant with 10+ years experience.
                </p>
              </div>
            </div>
            <div className="kc-hover-lift col-span-12 flex flex-col rounded-2xl border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] p-10 md:col-span-6 lg:col-span-4">
              <KcIcon name="groups" className="mb-4 text-4xl text-[var(--kc-primary)]" fill />
              <h4 className="kc-headline-md mb-2 text-[var(--kc-on-surface)]">Familial Context</h4>
              <p className="kc-body-md text-[var(--kc-on-surface-variant)]">
                We don&apos;t just look at numbers; we look at family trees, legacies, and your unique household goals.
              </p>
            </div>
            <div className="relative col-span-12 flex flex-col items-center gap-8 overflow-hidden rounded-2xl bg-[var(--kc-primary)] p-10 text-[var(--kc-on-primary)] md:flex-row lg:col-span-8">
              <div className="relative z-10 flex-1">
                <h3 className="kc-headline-lg mb-4">Start with a Free Consultation</h3>
                <p className="kc-body-md mb-6 opacity-90">
                  Unsure which package fits your current growth trajectory? Speak with a Senior Partner for a 20-minute
                  portfolio review.
                </p>
                <Link
                  href={KC_PATHS.contact}
                  className="inline-block rounded-lg bg-[var(--kc-on-primary)] px-8 py-3 font-bold text-[var(--kc-primary)] transition-all hover:bg-[var(--kc-primary-fixed)]"
                >
                  Book Discovery Call
                </Link>
              </div>
              <div className="relative z-10 hidden md:block">
                <div className="kc-animate-float flex h-48 w-48 items-center justify-center rounded-full border-4 border-[color-mix(in_srgb,var(--kc-on-primary)_20%,transparent)]">
                  <KcIcon name="calendar_month" className="text-6xl" />
                </div>
              </div>
            </div>
          </div>
        </KcContainer>
      </section>

      <section className="bg-[var(--kc-surface-container-lowest)] py-[var(--kc-stack-lg)] text-center">
        <KcContainer>
          <p className="kc-label-sm mb-10 text-[var(--kc-outline)]">TRUSTED BY GENERATIONS OF AMERICAN FAMILIES</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale transition-all hover:grayscale-0 md:gap-24">
            {[
              { icon: "account_balance", label: "FORBES ADVISOR" },
              { icon: "security", label: "BARRONS" },
              { icon: "analytics", label: "WSJ" },
              { icon: "finance", label: "BLOOMBERG" },
            ].map((brand) => (
              <div key={brand.label} className="kc-headline-md flex items-center gap-2 font-bold">
                <KcIcon name={brand.icon} />
                {brand.label}
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <div className="fixed bottom-8 right-8 z-50">
        <Link
          href={KC_PATHS.contact}
          className="group flex items-center gap-3 rounded-full bg-[var(--kc-primary)] px-6 py-4 text-[var(--kc-on-primary)] shadow-2xl transition-all hover:bg-[var(--kc-primary-container)] active:scale-95"
        >
          <KcIcon name="chat" className="transition-transform group-hover:rotate-12" />
          <span className="kc-label-sm">Talk to a Partner</span>
        </Link>
      </div>
    </main>
  );
}
