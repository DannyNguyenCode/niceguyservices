"use client";

import Link from "next/link";
import { KC_PATHS } from "./kinshipCapitalConfig";
import { KC_IMG } from "./kinshipCapitalImages";
import { KcBrandPill, KcContainer, KcIcon, KcImg } from "./KinshipCapitalShared";
import { useKcFaqAccordion, useKcNavShadow } from "./useKcEffects";

export function KinshipCapitalHomeBody() {
  useKcFaqAccordion();
  useKcNavShadow();

  return (
    <main>
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-24 md:pb-40">
        <KcContainer className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative z-10">
            <KcBrandPill />
            <h1 className="kc-headline-xl mb-6 mt-6 text-[var(--kc-on-background)]">
              Financial Confidence for Your Family&apos;s Future.
            </h1>
            <p className="kc-body-lg mb-10 max-w-lg text-[var(--kc-on-surface-variant)]">
              We bridge the gap between institutional precision and the warmth of family values. Expert accounting and
              strategic wealth management for those who build for generations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={KC_PATHS.contact}
                className="rounded-lg bg-[var(--kc-primary)] px-8 py-4 kc-body-md font-semibold text-[var(--kc-on-primary)] transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href={KC_PATHS.services}
                className="rounded-lg border-2 border-[var(--kc-primary)] px-8 py-4 kc-body-md font-semibold text-[var(--kc-primary)] transition-all hover:bg-[color-mix(in_srgb,var(--kc-primary)_5%,transparent)]"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-[32px] shadow-2xl">
              <KcImg
                src={KC_IMG.home.hero}
                alt="Professional financial advisors meeting with clients in a modern office"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -right-12 -top-12 -z-0 h-64 w-64 rounded-full bg-[var(--kc-primary-fixed-dim)] opacity-20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 -z-0 h-80 w-80 rounded-full bg-[var(--kc-tertiary-fixed)] opacity-30 blur-3xl" />
          </div>
        </KcContainer>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block h-[100px] w-full fill-[var(--kc-surface-container)]" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      <section className="bg-[var(--kc-surface-container)] py-12">
        <KcContainer>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 md:gap-16">
            {[
              { icon: "verified_user", label: "Certified CPA" },
              { icon: "history_edu", label: "Ethics Certified" },
              { icon: "groups", label: "Family Office" },
              { icon: "location_away", label: "Nationwide Access" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--kc-outline-variant)] bg-white shadow-sm">
                  <KcIcon name={item.icon} className="text-[var(--kc-primary)]" fill />
                </div>
                <span className="kc-label-sm uppercase tracking-widest text-[var(--kc-on-surface)]">{item.label}</span>
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="overflow-hidden bg-[var(--kc-surface-container)] py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="mb-16 text-center">
            <h2 className="kc-headline-lg mb-4 text-[var(--kc-on-surface)]">Concierge Financial Care</h2>
            <p className="kc-body-md mx-auto max-w-2xl text-[var(--kc-on-surface-variant)]">
              From complex corporate tax structures to the intimate details of family bookkeeping, we provide professional
              clarity for every aspect of your financial world.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: "account_balance", title: "Corporate Tax", href: KC_PATHS.services },
              { icon: "menu_book", title: "Family Bookkeeping", href: KC_PATHS.services },
              { icon: "insights", title: "Strategic Advisory", href: KC_PATHS.services },
            ].map((card) => (
              <div
                key={card.title}
                className="kc-service-card-lift group rounded-[24px] border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] p-10 shadow-sm"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--kc-primary)_10%,transparent)] text-[var(--kc-primary)] transition-colors group-hover:bg-[var(--kc-primary)] group-hover:text-white">
                  <KcIcon name={card.icon} className="text-[32px]" />
                </div>
                <h3 className="kc-headline-md mb-4">{card.title}</h3>
                <p className="kc-body-md mb-8 text-[var(--kc-on-surface-variant)]">
                  Optimized strategies ensuring maximum efficiency, compliance, and concierge-level discretion.
                </p>
                <Link href={card.href} className="inline-flex items-center gap-2 kc-label-sm text-[var(--kc-primary)]">
                  Learn More <KcIcon name="arrow_forward" className="text-sm" />
                </Link>
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="relative bg-[var(--kc-surface-container-lowest)] py-[var(--kc-stack-lg)]">
        <KcContainer className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="relative z-10 rounded-[40px] bg-[var(--kc-surface-container-low)] p-2 shadow-lg">
              <div className="relative h-[500px] overflow-hidden rounded-[38px]">
                <KcImg src={KC_IMG.home.office} alt="Heritage office entrance" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
              </div>
            </div>
            <div className="kc-glass-card absolute -right-8 bottom-10 z-20 max-w-[200px] rounded-2xl p-8 shadow-xl">
              <div className="kc-headline-lg mb-1 text-[var(--kc-primary)]">40+</div>
              <div className="kc-label-sm uppercase leading-tight tracking-widest text-[var(--kc-on-surface)]">
                Years of Family Stewardship
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="kc-headline-lg mb-6 text-[var(--kc-on-surface)]">Built on Heritage, Driven by Results.</h2>
            <p className="kc-body-lg mb-8 text-[var(--kc-on-surface-variant)]">
              At Heritage Financial, we understand that money is more than just math—it&apos;s the fuel for your family&apos;s
              dreams and the foundation of your legacy.
            </p>
            <div className="mb-10 space-y-6">
              {[
                { title: "Integrated Planning", desc: "We align your business tax strategy with your personal wealth goals." },
                { title: "Generational Continuity", desc: "Specialized services for ensuring a smooth transition of assets to the next generation." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--kc-primary)_10%,transparent)]">
                    <KcIcon name="check" className="text-lg text-[var(--kc-primary)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--kc-on-surface)]">{item.title}</h4>
                    <p className="text-sm text-[var(--kc-on-surface-variant)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={KC_PATHS.about} className="font-bold text-[var(--kc-primary)] underline decoration-2 underline-offset-8 transition-all hover:opacity-70">
              Read Our Story
            </Link>
          </div>
        </KcContainer>
      </section>

      <section className="relative overflow-hidden bg-[var(--kc-surface-container-low)] py-[var(--kc-stack-lg)]">
        <div className="pointer-events-none absolute left-0 top-0 w-full rotate-180 overflow-hidden leading-[0]">
          <svg className="relative block h-[80px] w-full fill-[var(--kc-surface-container-lowest)]" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
        <KcContainer className="relative z-10">
          <div className="mb-16 text-center">
            <h2 className="kc-headline-lg mb-4 text-[var(--kc-on-surface)]">Investment in Clarity</h2>
            <p className="kc-body-md mx-auto max-w-2xl text-[var(--kc-on-surface-variant)]">
              Transparent, value-driven pricing structures designed for the evolving needs of families and businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Foundation", price: "$499", period: "/month", featured: false },
              { name: "Heritage Choice", price: "$1,250", period: "/month", featured: true },
              { name: "Legacy", price: "Custom", period: "", featured: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col overflow-hidden rounded-3xl border ${
                  plan.featured
                    ? "relative z-10 scale-105 border-2 border-[var(--kc-primary)] bg-white shadow-2xl"
                    : "border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] shadow-sm"
                }`}
              >
                {plan.featured ? (
                  <span className="absolute right-4 top-4 rounded-full bg-[var(--kc-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--kc-on-primary)]">
                    Most Preferred
                  </span>
                ) : null}
                <div className={`border-b border-[var(--kc-outline-variant)] p-10 ${plan.featured ? "bg-[color-mix(in_srgb,var(--kc-primary-fixed)_30%,transparent)]" : ""}`}>
                  <h3 className="kc-headline-md mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period ? <span className="text-[var(--kc-on-surface-variant)]">{plan.period}</span> : null}
                  </div>
                </div>
                <div className="flex-grow p-10">
                  <Link
                    href={KC_PATHS.pricing}
                    className={`block w-full rounded-lg py-3 text-center font-bold transition-all ${
                      plan.featured
                        ? "bg-[var(--kc-primary)] py-4 text-[var(--kc-on-primary)] shadow-lg hover:bg-[var(--kc-primary-container)]"
                        : "border-2 border-[var(--kc-primary)] text-[var(--kc-primary)] hover:bg-[var(--kc-primary)] hover:text-white"
                    }`}
                  >
                    {plan.featured ? "Start Heritage Journey" : "View Details"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="bg-[var(--kc-surface-container-lowest)] py-[var(--kc-stack-lg)]">
        <KcContainer className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="kc-headline-lg mb-8 text-[var(--kc-on-surface)]">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Do you only work with wealthy families?",
                  a: "While we specialize in high-net-worth family needs, we provide tiered services to accommodate growing businesses and individuals who value professional excellence.",
                },
                {
                  q: "How do you protect family privacy?",
                  a: "Confidentiality is our cornerstone. We utilize bank-grade encryption, secure client portals, and strict internal protocols.",
                },
                {
                  q: "Are you accepting new clients nationwide?",
                  a: "Yes, our digital concierge platform allows us to serve families across the United States with the same level of care.",
                },
              ].map((faq, i) => (
                <details key={faq.q} className="kc-faq-accordion group border-b border-[var(--kc-outline-variant)] pb-4" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-[var(--kc-on-surface)] transition-colors hover:text-[var(--kc-primary)]">
                    <span>{faq.q}</span>
                    <KcIcon name="expand_more" className="kc-faq-chevron transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--kc-on-surface-variant)]">{faq.a}</p>
                </details>
              ))}
            </div>
            <Link href={KC_PATHS.faq} className="mt-6 inline-block kc-label-sm text-[var(--kc-primary)] hover:underline">
              View all FAQs
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-[32px] bg-[var(--kc-surface-container-low)] p-10 shadow-sm md:p-12">
            <h3 className="kc-headline-md mb-2">Ready to Start?</h3>
            <p className="kc-body-md mb-8 text-[var(--kc-on-surface-variant)]">
              Schedule a complimentary legacy review with our lead partner.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input className="kc-input-underline w-full bg-white placeholder:text-[var(--kc-outline)]" placeholder="Your Name" type="text" />
              <input className="kc-input-underline w-full bg-white placeholder:text-[var(--kc-outline)]" placeholder="Email Address" type="email" />
              <textarea className="kc-input-underline w-full resize-none bg-white placeholder:text-[var(--kc-outline)]" placeholder="How can we help your family?" rows={3} />
              <button type="submit" className="w-full rounded-lg bg-[var(--kc-primary)] py-4 font-bold text-[var(--kc-on-primary)] shadow-lg transition-all hover:shadow-xl">
                Send Message
              </button>
            </form>
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--kc-primary)_5%,transparent)]" />
          </div>
        </KcContainer>
      </section>
    </main>
  );
}
