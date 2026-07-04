"use client";

import Link from "next/link";
import { KC_PATHS } from "./kinshipCapitalConfig";
import { KC_IMG } from "./kinshipCapitalImages";
import { KcBrandPill, KcContainer, KcIcon, KcImg } from "./KinshipCapitalShared";
import { useKcAnchorScroll, useKcSectionNav } from "./useKcEffects";

const CORPORATE_SERVICES = [
  {
    icon: "corporate_fare",
    title: "Corporate Tax Strategy",
    desc: "Advanced tax minimization strategies for established corporations and growing startups.",
    features: ["Optimized R&D Tax Credits", "Multi-State Compliance"],
    bestFor: "$5M+ Revenue Entities",
  },
  {
    icon: "insights",
    title: "Strategic Advisory",
    desc: "Fractional CFO services and data-driven guidance for high-stakes business decisions.",
    features: ["Cash Flow Forecasting", "M&A Readiness Audits"],
    bestFor: "High-Growth Founders",
  },
  {
    icon: "groups",
    title: "Payroll & Human Capital",
    desc: "Seamless execution of complex payroll structures and benefit administration.",
    features: ["Automated Compliance", "Exec Compensation Planning"],
    bestFor: "50+ Employee Organizations",
  },
];

const PERSONAL_SERVICES = [
  {
    icon: "account_balance_wallet",
    title: "Private Wealth Tax",
    desc: "Meticulous income tax preparation and sophisticated defense for high-net-worth individuals.",
    features: ["K-1 Aggregation & Management", "Audit Representation"],
    bestFor: "Active Investors",
  },
  {
    icon: "family_history",
    title: "Estate & Trust Services",
    desc: "Ensuring the seamless transfer of capital across generations while minimizing tax friction.",
    features: ["Trust Accounting (Form 1041)", "Legacy Philanthropy Planning"],
    bestFor: "Multi-Gen Families",
  },
];

export function KinshipCapitalServicesBody() {
  useKcAnchorScroll(160);
  useKcSectionNav(
    "section[id]",
    ".kc-glass-header a",
    "text-[var(--kc-primary)] border-b-2 border-[var(--kc-primary)]",
    "text-[var(--kc-on-surface-variant)]",
  );

  return (
    <main className="pt-20">
      <section className="relative overflow-hidden bg-[var(--kc-surface-container-lowest)] pb-32 pt-16">
        <KcContainer className="relative z-10">
          <div className="max-w-2xl">
            <KcBrandPill />
            <h1 className="kc-headline-xl mb-6 mt-6 text-[var(--kc-on-surface)]">
              Financial Curation for the <span className="text-[var(--kc-primary)]">Modern Family</span>.
            </h1>
            <p className="kc-body-lg mb-10 text-[var(--kc-on-surface-variant)]">
              Experience a concierge-driven approach to wealth management and tax strategy. Browse our curated collections
              of institutional-grade services designed with family legacy in mind.
            </p>
          </div>
        </KcContainer>
        <div className="kc-organic-curve-inverted absolute bottom-0 left-0 h-24 w-full bg-[var(--kc-background)]" />
      </section>

      <nav className="kc-glass-header sticky top-20 z-40 border-b border-[var(--kc-outline-variant)]">
        <KcContainer className="flex h-16 items-center gap-8 overflow-x-auto whitespace-nowrap">
          {[
            { href: "#corporate", label: "01. Corporate & Business" },
            { href: "#personal", label: "02. Personal Services" },
            { href: "#specialized", label: "03. Specialized" },
          ].map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`kc-label-sm py-4 uppercase tracking-wider transition-colors ${
                i === 0
                  ? "border-b-2 border-[var(--kc-primary)] text-[var(--kc-primary)]"
                  : "text-[var(--kc-on-surface-variant)] hover:text-[var(--kc-primary)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </KcContainer>
      </nav>

      <section className="py-[var(--kc-stack-lg)]" id="corporate">
        <KcContainer>
          <div className="mb-12">
            <h2 className="kc-headline-lg mb-4">The Corporate Collection</h2>
            <p className="kc-body-md max-w-xl text-[var(--kc-on-surface-variant)]">
              Comprehensive business solutions focused on scalability, compliance, and long-term institutional stability.
            </p>
          </div>
          <div className="kc-collection-grid">
            {CORPORATE_SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="overflow-hidden bg-[var(--kc-surface-container)] py-[var(--kc-stack-lg)]">
        <KcContainer className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="kc-headline-lg mb-6">The Boutique Standard</h2>
            <p className="kc-body-lg mb-8 text-[var(--kc-on-surface-variant)]">
              Unlike traditional marketplaces, Kinship &amp; Capital curates our professional network to match the specific
              risk profile and cultural values of your family office.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="kc-headline-md block text-[var(--kc-primary)]">1:12</span>
                <p className="kc-label-sm uppercase opacity-70">Client-Partner Ratio</p>
              </div>
              <div>
                <span className="kc-headline-md block text-[var(--kc-primary)]">24/7</span>
                <p className="kc-label-sm uppercase opacity-70">Concierge Support</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl">
            <KcImg src={KC_IMG.services.boardroom} alt="Private board room" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </KcContainer>
      </section>

      <section className="py-[var(--kc-stack-lg)]" id="personal">
        <KcContainer>
          <div className="mb-12">
            <h2 className="kc-headline-lg mb-4">The Personal Estate</h2>
            <p className="kc-body-md max-w-xl text-[var(--kc-on-surface-variant)]">
              Legacy-focused strategies that protect individual wealth and bridge the gap between generations.
            </p>
          </div>
          <div className="kc-collection-grid">
            {PERSONAL_SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="bg-[var(--kc-surface-container-low)] py-[var(--kc-stack-lg)]" id="specialized">
        <KcContainer>
          <div className="mb-12">
            <h2 className="kc-headline-lg mb-4">Specialized Ventures</h2>
            <p className="kc-body-md max-w-xl text-[var(--kc-on-surface-variant)]">
              Complex technical services for cross-border operations, valuations, and corporate structuring.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                icon: "analytics",
                title: "Business Valuation",
                desc: "Accurate, defensible reporting for gift tax, buy-sell agreements, or exit preparation.",
                items: ["Asset-based Valuation", "Market Comparable Analysis", "Discounted Cash Flow"],
                cta: "Request Valuation Scope",
              },
              {
                icon: "public",
                title: "Cross-Border Strategy",
                desc: "Navigating the complexities of international tax treaties, nexus, and global expansion.",
                items: ["Transfer Pricing Studies", "Expat Tax Management", "Foreign Subsidiary Setup"],
                cta: "Connect with Global Lead",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex h-full flex-col justify-between rounded-2xl border border-[var(--kc-outline-variant)] bg-white p-8 shadow-sm"
              >
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-lg bg-[color-mix(in_srgb,var(--kc-primary)_10%,transparent)] p-3">
                      <KcIcon name={card.icon} className="text-[var(--kc-primary)]" />
                    </div>
                    <h3 className="kc-headline-md">{card.title}</h3>
                  </div>
                  <p className="kc-body-md mb-8 text-[var(--kc-on-surface-variant)]">{card.desc}</p>
                  <ul className="mb-10 space-y-4">
                    {card.items.map((item) => (
                      <li key={item} className="kc-body-md flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--kc-primary)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="w-full rounded-lg border border-[var(--kc-primary)] py-4 kc-label-sm uppercase tracking-widest text-[var(--kc-primary)] transition-all hover:bg-[var(--kc-primary)] hover:text-white"
                >
                  {card.cta}
                </button>
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="border-y border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] py-[var(--kc-stack-lg)]">
        <KcContainer className="text-center">
          <h2 className="kc-headline-lg mb-6">Begin Your Curated Journey</h2>
          <p className="kc-body-lg mx-auto mb-10 max-w-2xl text-[var(--kc-on-surface-variant)]">
            Select a collection to see detailed pricing or schedule a discovery session with a dedicated heritage partner.
          </p>
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <Link
              href={KC_PATHS.contact}
              className="rounded-lg bg-[var(--kc-primary)] px-10 py-4 kc-headline-md text-white shadow-lg transition-all hover:-translate-y-0.5"
            >
              Book Consultation
            </Link>
            <button
              type="button"
              className="rounded-lg border-2 border-[var(--kc-primary)] px-10 py-4 kc-headline-md text-[var(--kc-primary)] transition-all hover:bg-[color-mix(in_srgb,var(--kc-primary)_5%,transparent)]"
            >
              Download Services PDF
            </button>
          </div>
        </KcContainer>
      </section>
    </main>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
  features,
  bestFor,
}: {
  icon: string;
  title: string;
  desc: string;
  features: string[];
  bestFor: string;
}) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] p-8 shadow-sm transition-all hover:shadow-lg">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[color-mix(in_srgb,var(--kc-primary)_5%,transparent)] transition-transform duration-500 group-hover:scale-150" />
      <KcIcon name={icon} className="relative mb-6 text-4xl text-[var(--kc-primary)]" />
      <h3 className="kc-headline-md relative mb-4">{title}</h3>
      <p className="kc-body-md relative mb-6 text-[var(--kc-on-surface-variant)]">{desc}</p>
      <div className="relative mb-8 space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <KcIcon name="check_circle" className="mt-1 text-sm text-[var(--kc-primary)]" />
            <span className="kc-body-md">{feature}</span>
          </div>
        ))}
      </div>
      <div className="relative border-t border-[var(--kc-outline-variant)] pt-6">
        <span className="kc-label-sm uppercase tracking-widest text-[var(--kc-primary)]">Best For: {bestFor}</span>
      </div>
    </div>
  );
}
