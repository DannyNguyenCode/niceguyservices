"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { KC_PATHS } from "./kinshipCapitalConfig";
import { KC_IMG } from "./kinshipCapitalImages";
import { KcFaqAccordionItem } from "./KcFaqAccordion";
import { KcContainer, KcIcon, KcImg } from "./KinshipCapitalShared";
import { useKcAnchorScroll } from "./useKcEffects";

const SIDEBAR_CATEGORIES = [
  { id: "personal", icon: "person", label: "Personal Tax" },
  { id: "business", icon: "domain", label: "Business Tax" },
  { id: "bookkeeping", icon: "menu_book", label: "Bookkeeping" },
  { id: "payroll", icon: "payments", label: "Payroll" },
  { id: "audits", icon: "verified_user", label: "CRA Audits" },
  { id: "incorporation", icon: "account_balance", label: "Incorporation" },
  { id: "pricing", icon: "sell", label: "Pricing" },
];

export function KinshipCapitalFaqBody() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggleFaq = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);
  useKcAnchorScroll(100);

  return (
    <main className="pt-20">
      <section className="relative bg-[var(--kc-primary-container)] pb-32 pt-[var(--kc-stack-lg)] text-[var(--kc-on-primary-container)]">
        <KcContainer className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="kc-headline-xl mb-[var(--kc-stack-sm)]">How can we help your family?</h1>
            <p className="kc-body-lg mb-[var(--kc-stack-md)] opacity-90">
              Expert guidance for multi-generational wealth, complex tax structures, and business legacy planning.
            </p>
            <div className="relative max-w-lg">
              <input
                className="w-full rounded-xl border-none bg-[var(--kc-surface-container-lowest)] py-4 pl-12 pr-4 text-[var(--kc-on-surface)] shadow-lg focus:ring-2 focus:ring-[var(--kc-surface-tint)]"
                placeholder="Search for a topic..."
                type="search"
              />
              <KcIcon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--kc-outline)]" />
            </div>
          </div>
        </KcContainer>
        <div className="kc-shape-divider">
          <svg data-name="Layer 1" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path
              className="kc-shape-fill"
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            />
          </svg>
        </div>
      </section>

      <section className="relative z-20 -mt-16 pb-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="grid grid-cols-1 gap-[var(--kc-gutter)] lg:grid-cols-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28 space-y-2">
                <h3 className="kc-label-sm mb-4 px-4 text-[var(--kc-outline)]">CATEGORIES</h3>
                {SIDEBAR_CATEGORIES.map((cat, i) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                      i === 0
                        ? "bg-[var(--kc-surface-container-high)] font-medium text-[var(--kc-primary)]"
                        : "text-[var(--kc-on-surface-variant)] hover:bg-[var(--kc-surface-container)]"
                    }`}
                  >
                    <KcIcon name={cat.icon} className="text-[20px]" />
                    {cat.label}
                  </a>
                ))}
                <div className="mt-12 rounded-2xl border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--kc-primary)_10%,transparent)]">
                      <KcIcon name="workspace_premium" className="text-[var(--kc-primary)]" fill />
                    </div>
                    <div className="kc-label-sm text-[var(--kc-on-surface)]">CPA Certified</div>
                  </div>
                  <p className="kc-label-sm leading-relaxed text-[var(--kc-outline)]">
                    Heritage Financial partners with leading Certified Public Accountants to ensure every family and
                    business is compliant and optimized.
                  </p>
                </div>
              </div>
            </aside>

            <div className="space-y-[var(--kc-stack-lg)] lg:col-span-9">
              <FaqCategory
                id="personal"
                icon="person"
                title="Personal Tax"
                openId={openId}
                onToggle={toggleFaq}
                items={[
                  {
                    q: "When is the deadline for filing my personal tax return?",
                    a: "For most individuals, the filing deadline is April 30th. However, if you or your spouse/common-law partner are self-employed, the deadline is extended to June 15th. Please note that any taxes owed must still be paid by April 30th to avoid interest charges.",
                  },
                  {
                    q: "What documents do I need for my tax appointment?",
                    a: 'You should bring all relevant slips (T4, T5, T3), receipts for deductible expenses (medical, charitable donations, childcare), and your prior year\'s Notice of Assessment. For a full checklist, please download our "Family Tax Organizer" in the client portal.',
                  },
                ]}
              />

              <FaqCategory
                id="business"
                icon="domain"
                title="Business Tax"
                openId={openId}
                onToggle={toggleFaq}
                items={[
                  {
                    q: "Should I file a corporate tax return if my business didn't make money?",
                    a: "Yes. Even if your corporation was inactive or had no taxable income during the year, you are still required to file a T2 return within six months of the end of every taxation year. This is also important for maintaining tax losses that can be applied against future profits.",
                  },
                ]}
                imageBreak
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <FaqCategory
                  id="bookkeeping"
                  icon="menu_book"
                  title="Bookkeeping"
                  openId={openId}
                  onToggle={toggleFaq}
                  items={[
                    {
                      q: "How often should I update records?",
                      a: "We recommend monthly reconciliations to ensure financial transparency and audit-readiness.",
                    },
                  ]}
                />
                <FaqCategory
                  id="payroll"
                  icon="payments"
                  title="Payroll"
                  openId={openId}
                  onToggle={toggleFaq}
                  items={[
                    {
                      q: "Managing T4 slips?",
                      a: "Our team handles the generation and filing of T4 and T4A slips annually for all employees and contractors.",
                    },
                  ]}
                />
              </div>

              <div
                className="scroll-mt-28 rounded-3xl border-2 border-[color-mix(in_srgb,var(--kc-primary)_20%,transparent)] bg-[var(--kc-surface-container-low)] p-8"
                id="pricing"
              >
                <h2 className="kc-headline-lg mb-8 text-center text-[var(--kc-primary)]">Transparent Pricing Architecture</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {[
                    { tier: "PERSONAL", price: "From $150", features: ["T1 Return Filing", "Basic Tax Advice"] },
                    { tier: "FAMILY OFFICE", price: "Custom Quote", features: ["Multi-entity Strategy", "Wealth Succession"], featured: true },
                    { tier: "BUSINESS", price: "From $1,200", features: ["T2 Corporate Return", "Financial Statements"] },
                  ].map((plan) => (
                    <div
                      key={plan.tier}
                      className={`rounded-2xl p-6 text-center transition-transform hover:-translate-y-1 ${
                        plan.featured
                          ? "z-10 scale-105 bg-[var(--kc-primary)] text-[var(--kc-on-primary)] shadow-lg"
                          : "border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] shadow-sm"
                      }`}
                    >
                      <div className={`kc-label-sm mb-2 ${plan.featured ? "opacity-80" : "text-[var(--kc-primary)]"}`}>
                        {plan.tier}
                      </div>
                      <div className="kc-headline-lg mb-4">{plan.price}</div>
                      <ul className="space-y-2 text-left kc-label-sm text-[var(--kc-outline)]">
                        {plan.features.map((f) => (
                          <li key={f} className={`flex items-center gap-2 ${plan.featured ? "text-inherit" : ""}`}>
                            <KcIcon name="check" className={`text-sm ${plan.featured ? "" : "text-[var(--kc-primary)]"}`} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="kc-body-md mt-8 text-center text-[var(--kc-on-surface-variant)]">
                  Need a specific quote?{" "}
                  <Link href={KC_PATHS.contact} className="font-bold text-[var(--kc-primary)] hover:underline">
                    Contact our concierge team
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </KcContainer>
      </section>

      <section className="bg-[var(--kc-surface-container-highest)] py-[var(--kc-stack-lg)]">
        <KcContainer className="text-center">
          <h2 className="kc-headline-lg mb-[var(--kc-stack-sm)] text-[var(--kc-on-surface)]">Still have questions?</h2>
          <p className="kc-body-lg mx-auto mb-[var(--kc-stack-md)] max-w-xl text-[var(--kc-on-surface-variant)]">
            We provide specialized answers for complex situations. Our advisors are available for a complimentary discovery
            call.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={KC_PATHS.contact}
              className="rounded-xl bg-[var(--kc-primary)] px-10 py-4 kc-headline-md text-[var(--kc-on-primary)] transition-all hover:shadow-lg active:scale-95"
            >
              Book a Discovery Call
            </Link>
            <button
              type="button"
              className="rounded-xl border-2 border-[var(--kc-primary)] px-10 py-4 kc-headline-md text-[var(--kc-primary)] transition-all hover:bg-[color-mix(in_srgb,var(--kc-primary)_5%,transparent)]"
            >
              Visit Help Center
            </button>
          </div>
        </KcContainer>
      </section>
    </main>
  );
}

function FaqCategory({
  id,
  icon,
  title,
  items,
  imageBreak,
  openId,
  onToggle,
}: {
  id: string;
  icon: string;
  title: string;
  items: { q: string; a: string }[];
  imageBreak?: boolean;
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="scroll-mt-28" id={id}>
      <h2 className="kc-headline-lg mb-6 flex items-center gap-3 text-[var(--kc-primary)]">
        <KcIcon name={icon} className="text-3xl" />
        {title}
      </h2>
      <div className="space-y-4">
        {items.map((item, i) => {
          const itemId = `${id}-${i}`;
          return (
            <KcFaqAccordionItem
              key={itemId}
              id={itemId}
              question={item.q}
              answer={item.a}
              isOpen={openId === itemId}
              onToggle={onToggle}
            />
          );
        })}
        {imageBreak ? (
          <>
            <div className="relative my-[var(--kc-stack-md)] h-64 overflow-hidden rounded-3xl">
              <KcImg src={KC_IMG.faq.advisors} alt="Financial advisors in boardroom" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[color-mix(in_srgb,var(--kc-primary)_60%,transparent)] to-transparent p-8">
                <p className="kc-headline-md text-[var(--kc-on-primary)]">Concierge planning for family enterprises.</p>
              </div>
            </div>
            <KcFaqAccordionItem
              id={`${id}-holding`}
              question="What are the benefits of a holding company for my family business?"
              answer="Holding companies offer several advantages, including asset protection, tax deferral through inter-corporate dividends, and enhanced flexibility for succession planning."
              isOpen={openId === `${id}-holding`}
              onToggle={onToggle}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
