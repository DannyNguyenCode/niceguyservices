"use client";

import { KC_IMG } from "./kinshipCapitalImages";
import { KcContainer, KcIcon, KcImg } from "./KinshipCapitalShared";
import { useKcReveal } from "./useKcEffects";

const VALUES = [
  {
    icon: "handshake",
    title: "Radical Transparency",
    desc: "No hidden fees, no complex jargon. We believe clarity is the foundation of trust, providing you with a clear window into every decision.",
  },
  {
    icon: "family_restroom",
    title: "Intergenerational Focus",
    desc: "We design strategies that bridge the gap between elders and heirs, ensuring a smooth transition of both capital and values.",
  },
  {
    icon: "verified_user",
    title: "Unwavering Integrity",
    desc: "As a fiduciary-first firm, your best interest isn't just a goal—it's our legal and moral mandate. We succeed only when you do.",
  },
];

const TEAM = [
  {
    name: "Sarah Jenkins, CPA",
    role: "Senior Tax Strategist",
    img: KC_IMG.about.sarah,
    hover: "Expert in Tax Efficiency & Wealth Preservation.",
  },
  {
    name: "Michael Chen, CFA",
    role: "Investment Director",
    img: KC_IMG.about.michael,
    hover: "Dedicated to Intergenerational Success Planning.",
  },
  {
    name: "Elena Rodriguez",
    role: "Client Relationship Partner",
    img: KC_IMG.about.elena,
    hover: "Focused on Philanthropic Strategy & Giving.",
  },
  {
    name: "David Brooks, JD",
    role: "Legacy Advisor",
    img: KC_IMG.about.david,
    hover: "Specializing in Estate Structuring & Law.",
  },
];

export function KinshipCapitalAboutBody() {
  useKcReveal("section.kc-reveal-section");

  return (
    <main>
      <section className="kc-reveal-section relative overflow-hidden pb-32 pt-24 kc-mesh-gradient">
        <KcContainer className="relative z-10 flex flex-col items-center gap-12 md:flex-row">
          <div className="flex-1 space-y-6">
            <span className="kc-label-sm uppercase tracking-[0.2em] text-[var(--kc-primary)]">The Kinship &amp; Capital Story</span>
            <h1 className="kc-headline-xl leading-tight text-[var(--kc-on-surface)]">
              Beyond Wealth, We Manage <span className="italic text-[var(--kc-primary)]">Heritage.</span>
            </h1>
            <p className="kc-body-lg max-w-xl text-[var(--kc-on-surface-variant)]">
              Kinship &amp; Capital wasn&apos;t born in a boardroom. It was founded around a kitchen table, built on the belief
              that family legacy is our most valuable asset.
            </p>
          </div>
          <div className="relative flex-1">
            <div className="kc-organic-shape absolute -left-10 -top-10 aspect-square w-full animate-pulse bg-[var(--kc-primary-fixed)] opacity-20" />
            <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
              <KcImg src={KC_IMG.about.family} alt="Multi-generational family" fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </KcContainer>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block h-[80px] w-[calc(100%+1.3px)] fill-[var(--kc-background)]" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,1.42,1200,46.29V0Z" opacity="0.5" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5V0Z" opacity="0.25" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
      </section>

      <section className="kc-reveal-section bg-[var(--kc-background)] py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="group relative">
                <div className="absolute -inset-4 rounded-xl bg-[var(--kc-primary)] opacity-5 transition-opacity group-hover:opacity-10" />
                <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-xl shadow-xl">
                  <KcImg src={KC_IMG.about.founder} alt="Arthur Vance, Founder" fill className="object-cover" sizes="(max-width: 768px) 100vw, 40vw" />
                </div>
                <div className="absolute -right-6 bottom-6 z-20 rounded-lg border border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] p-6 shadow-lg">
                  <p className="kc-headline-md m-0 text-[var(--kc-primary)]">Arthur Vance</p>
                  <p className="kc-label-sm mt-1 text-[var(--kc-on-surface-variant)]">Founder &amp; Managing Partner</p>
                </div>
              </div>
            </div>
            <div className="space-y-8 md:col-span-7">
              <h2 className="kc-headline-lg text-[var(--kc-on-surface)]">
                &ldquo;Financial services were missing the &apos;Family&apos; in Family Office.&rdquo;
              </h2>
              <div className="kc-body-md space-y-6 leading-relaxed text-[var(--kc-on-surface-variant)]">
                <p>
                  I spent twenty years at the world&apos;s largest institutional firms. While the spreadsheets were impeccable,
                  the connection to the human stories behind the numbers was missing.
                </p>
                <p>
                  In 2012, I founded Kinship &amp; Capital to change that. We started with a simple promise: to treat every
                  client&apos;s wealth with the same stewardship and care we would our own inheritance.
                </p>
                <div className="flex items-center gap-4 rounded-r-xl border-l-4 border-[var(--kc-primary)] bg-[var(--kc-surface-container-low)] py-4 pl-6">
                  <KcIcon name="format_quote" className="text-4xl text-[var(--kc-primary)]" fill />
                  <p className="font-medium italic">We don&apos;t just manage assets; we cultivate relationships that span decades.</p>
                </div>
              </div>
            </div>
          </div>
        </KcContainer>
      </section>

      <section className="kc-reveal-section bg-[var(--kc-surface-container)] py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="mb-16 space-y-4 text-center">
            <h2 className="kc-headline-lg text-[var(--kc-on-surface)]">The Pillars of Our Promise</h2>
            <p className="mx-auto max-w-2xl text-[var(--kc-on-surface-variant)]">Rooted in traditional values, powered by modern expertise.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="kc-card-float rounded-2xl border border-[color-mix(in_srgb,var(--kc-outline-variant)_30%,transparent)] bg-[var(--kc-surface-container-lowest)] p-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--kc-primary-fixed)]">
                  <KcIcon name={value.icon} className="text-[var(--kc-primary)]" fill />
                </div>
                <h3 className="kc-headline-md mb-4">{value.title}</h3>
                <p className="text-[var(--kc-on-surface-variant)]">{value.desc}</p>
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="kc-reveal-section overflow-hidden py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="flex flex-col items-stretch gap-16 md:flex-row">
            <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-3xl bg-[var(--kc-primary)] p-12 text-white">
              <div className="relative z-10 space-y-6">
                <h2 className="kc-headline-lg">Our Mission</h2>
                <p className="kc-body-lg text-white/90">
                  To provide families with the sophisticated financial infrastructure usually reserved for the ultra-wealthy,
                  delivered with the warmth and personalization of a family office.
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-center rounded-3xl border-2 border-[color-mix(in_srgb,var(--kc-primary)_10%,transparent)] p-12">
              <div className="space-y-6">
                <h2 className="kc-headline-lg text-[var(--kc-primary)]">Our Vision</h2>
                <p className="kc-body-lg text-[var(--kc-on-surface-variant)]">
                  A future where wealth is a tool for flourishing families, enabling purposeful lives and vibrant legacies
                  that extend beyond the balance sheet.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Legacy Planning", "Concierge Wealth", "Family Office"].map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--kc-surface-container)] px-4 py-2 kc-label-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </KcContainer>
      </section>

      <section className="kc-reveal-section bg-[var(--kc-background)] py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="mb-12 flex items-end justify-between">
            <div className="max-w-xl">
              <h2 className="kc-headline-lg text-[var(--kc-on-surface)]">The People Behind the Promise</h2>
              <p className="mt-4 text-[var(--kc-on-surface-variant)]">A collective of specialists dedicated to your family&apos;s future.</p>
            </div>
            <button type="button" className="hidden items-center gap-2 font-bold text-[var(--kc-primary)] hover:underline md:flex">
              Join our team <KcIcon name="arrow_forward" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="group cursor-pointer">
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl">
                  <KcImg
                    src={member.img}
                    alt={member.name}
                    fill
                    className="scale-105 object-cover grayscale transition-all duration-500 group-hover:scale-100 group-hover:grayscale-0"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[color-mix(in_srgb,var(--kc-primary)_80%,transparent)] to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="kc-body-md font-medium text-white">{member.hover}</p>
                  </div>
                </div>
                <h4 className="kc-headline-md">{member.name}</h4>
                <p className="kc-label-sm text-[var(--kc-on-surface-variant)]">{member.role}</p>
              </div>
            ))}
          </div>
        </KcContainer>
      </section>

      <section className="border-y border-[color-mix(in_srgb,var(--kc-outline-variant)_20%,transparent)] bg-[var(--kc-surface-container-low)] py-24">
        <KcContainer className="text-center">
          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-70 grayscale">
              {[
                { icon: "verified", label: "Certified Public Accountants" },
                { icon: "gavel", label: "Fiduciary Standard" },
                { icon: "award_star", label: "Est. 2012" },
              ].map((cred) => (
                <div key={cred.label} className="flex flex-col items-center">
                  <KcIcon name={cred.icon} className="mb-2 text-5xl" />
                  <span className="kc-label-sm uppercase tracking-widest">{cred.label}</span>
                </div>
              ))}
            </div>
            <p className="kc-body-md mt-4 max-w-3xl italic text-[var(--kc-on-surface-variant)]">
              &ldquo;The CPA designation isn&apos;t just about taxes; it&apos;s a lifelong commitment to the highest ethical and
              professional standards in the financial world.&rdquo;
            </p>
          </div>
        </KcContainer>
      </section>

      <section className="kc-reveal-section relative overflow-hidden bg-[var(--kc-background)] py-[var(--kc-stack-lg)]">
        <div className="absolute right-0 top-0 h-full w-1/3 -skew-x-12 translate-x-1/2 bg-[color-mix(in_srgb,var(--kc-primary)_5%,transparent)]" />
        <KcContainer className="relative z-10">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div className="space-y-8">
              <h2 className="kc-headline-lg text-[var(--kc-on-surface)]">Our Community Commitment</h2>
              <p className="kc-body-lg text-[var(--kc-on-surface-variant)]">
                A successful family is one that strengthens its surrounding community. We dedicate 5% of our firm&apos;s
                annual revenue to local family-support initiatives and literacy programs.
              </p>
              <ul className="space-y-4">
                {[
                  "Annual 'Young Entrepreneurs' Scholarship Fund",
                  "Pro-bono financial literacy workshops for local schools",
                  "Sustainable development partnerships in urban centers",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <KcIcon name="check_circle" className="text-[var(--kc-primary)]" fill />
                    <span className="text-[var(--kc-on-surface-variant)]">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="rounded-lg bg-[var(--kc-secondary)] px-8 py-3 font-bold text-white transition-all hover:bg-[var(--kc-secondary-container)] hover:text-[var(--kc-on-secondary-container)]"
              >
                See Our Impact Report
              </button>
            </div>
            <div className="relative">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--kc-primary-fixed)] opacity-30 blur-2xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
                  <KcImg src={KC_IMG.about.community1} alt="Community garden volunteers" fill className="object-cover" sizes="25vw" />
                </div>
                <div className="relative mt-8 aspect-square overflow-hidden rounded-2xl shadow-lg">
                  <KcImg src={KC_IMG.about.community2} alt="Community workshop" fill className="object-cover" sizes="25vw" />
                </div>
              </div>
            </div>
          </div>
        </KcContainer>
      </section>
    </main>
  );
}
