import Image from "next/image";
import Link from "next/link";
import { STARLIGHT_PATHS, STARLIGHT_BRAND_SENTENCE } from "@/components/experience-templates/starlight-command/starlightConfig";
import { SC_IMG } from "@/components/experience-templates/starlight-command/starlightImages";

function Stars() {
  return (
    <div className="flex flex-wrap items-center gap-0.5 text-[#ffdd74]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="material-symbols-outlined sc-material-fill text-lg">
          star
        </span>
      ))}
    </div>
  );
}

export function StarlightTestimonialsBody() {
  const brand = STARLIGHT_BRAND_SENTENCE;
  const secondaryCards = [
    {
      title: '"Elite Residential Diagnostics"',
      quote: `"When three other electricians failed to find the short circuit in our vintage Annex home, ${brand} located it within 30 minutes."`,
      meta: [
        ["person", "ELENA CHENG"],
        ["home", "VINTAGE RESTORATION"],
        ["location_on", "THE ANNEX"],
      ],
    },
    {
      title: '"High-Voltage Professionalism"',
      quote: `"Safety is our top priority at the warehouse, and ${brand} delivered an impeccable panel upgrade. The conduit work is a piece of art."`,
      meta: [
        ["person", "DAVID ROSSI"],
        ["factory", "INDUSTRIAL UPGRADE"],
        ["location_on", "SCARBOROUGH"],
      ],
    },
  ];

  return (
    <main className="flex min-h-screen grow flex-col overflow-x-hidden pb-28 sm:pb-32 md:pb-16">
      <section className="relative overflow-hidden border-b-4 border-[#594238] px-4 py-12 sm:py-16 md:px-12 md:py-20 lg:px-16">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={SC_IMG.testimonialsHero}
            alt="Industrial electrical conduits on ceiling (demo)"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-block bg-[#ee671c] px-3 py-1 font-['var(--font-sc-display),ui-sans-serif] text-sm font-bold uppercase tracking-widest text-[#351000] shadow-[0_0_15px_#ee671c]">
            Top Rated Operators
          </div>
          <h1 className="sc-glowing-text mb-4 px-1 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold leading-[1.05] text-[#e5e2e1] sm:text-5xl md:text-6xl md:leading-none lg:text-7xl xl:text-8xl">
            REPUTATION BUILT ACROSS TORONTO
          </h1>
          <p className="mx-auto max-w-2xl font-['var(--font-sc-body),ui-sans-serif] text-base text-[#e0c0b2] sm:text-lg">
            Elite electrical craftsmanship verified by the city&apos;s most demanding stakeholders. Current Leaderboard Status:{" "}
            <span className="font-bold text-[#ffb595]">LEGENDARY</span>.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 border-b-4 border-[#594238] bg-[#2a2a2a] px-3 py-6 sm:flex sm:flex-wrap sm:justify-around sm:gap-8 sm:px-4 md:px-8">
        {[
          ["COMPLETED TASKS", "1,248+"],
          ["STREET CRED", "MAX LEVEL"],
          ["UPTIME", "99.99%"],
          ["POWER RATING", "HIGH VOLTAGE"],
        ].map(([l, v]) => (
          <div key={l} className="flex flex-col items-center text-center sm:min-w-32">
            <span className="mb-1 max-w-44 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-semibold uppercase leading-tight tracking-wider text-[#ffb595]/70 sm:max-w-none sm:text-sm sm:tracking-widest">
              {l}
            </span>
            <span className="font-['var(--font-sc-display),ui-sans-serif] text-lg font-bold text-[#e5e2e1] sm:text-2xl">{v}</span>
          </div>
        ))}
      </div>

      <section className="bg-[#131313] px-4 py-12 sm:px-6 md:px-12 md:py-16 lg:px-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="hidden flex-col items-center py-10 lg:col-span-1 lg:flex">
            <div className="sc-ladder-connector min-h-[320px]" />
          </div>
          <div className="space-y-12 lg:col-span-11">
            <div className="group relative border-l-8 border-[#ee671c] bg-[#20201f] p-4 shadow-[10px_10px_0_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1 sm:p-6 md:p-8">
              <div className="relative mb-4 md:absolute md:right-0 md:top-0 md:mb-0 md:p-4">
                <span className="inline-block bg-[#ffdd74] px-2 py-1 font-['var(--font-sc-display),ui-sans-serif] text-xs font-bold uppercase text-[#3c2f00] sm:px-3 sm:text-sm">
                  MVP CUSTOMER
                </span>
              </div>
              <div className="flex flex-col items-start gap-6 pt-2 md:flex-row md:gap-8 md:pt-0">
                <div className="relative h-20 w-20 shrink-0 border-4 border-[#594238] bg-[#353535]">
                  <div className="absolute inset-0 bg-[#ffb595] opacity-10" />
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-[#ffb595]">person</span>
                </div>
                <div className="min-w-0 grow md:max-w-[calc(100%-9rem)] lg:max-w-none">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Stars />
                    <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold text-[#ee671c]">SCORE: 50,000 pts</span>
                  </div>
                  <h2 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-lg font-semibold leading-snug text-[#e5e2e1] sm:text-xl md:text-2xl">
                    &quot;Total Power Grid Transformation&quot;
                  </h2>
                  <p className="mb-6 font-['var(--font-sc-body),ui-sans-serif] italic leading-relaxed text-[#e0c0b2]">
                    &quot;{STARLIGHT_BRAND_SENTENCE} handled our full commercial retrofit in Liberty Village with surgical precision. They didn&apos;t just wire the
                    building; they engineered a masterpiece of industrial infrastructure.&quot;
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-[#e0c0b2]">
                    <span className="flex items-center gap-1 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase">
                      <span className="material-symbols-outlined text-sm">person</span> MARCUS VANE
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-[#594238] sm:inline" />
                    <span className="flex items-center gap-1 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase">
                      <span className="material-symbols-outlined text-sm">construction</span> COMMERCIAL RETROFIT
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-[#594238] sm:inline" />
                    <span className="flex items-center gap-1 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase">
                      <span className="material-symbols-outlined text-sm">location_on</span> LIBERTY VILLAGE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {secondaryCards.map((card) => (
              <div
                key={card.title}
                className="group relative border-l-8 border-[#594238] bg-[#20201f] p-4 shadow-[10px_10px_0_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-1 sm:p-6 md:p-8"
              >
                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="relative h-20 w-20 shrink-0 border-4 border-[#594238] bg-[#353535]">
                    <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-[#e0c0b2]">
                      person
                    </span>
                  </div>
                  <div className="min-w-0 grow">
                    <div className="mb-2">
                      <Stars />
                    </div>
                    <h2 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-lg font-semibold leading-snug text-[#e5e2e1] sm:text-xl md:text-2xl">{card.title}</h2>
                    <p className="mb-6 font-['var(--font-sc-body),ui-sans-serif] italic leading-relaxed text-[#e0c0b2]">{card.quote}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[#e0c0b2]">
                      {card.meta.map(([icon, label]) => (
                        <span key={label} className="flex items-center gap-1 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase">
                          <span className="material-symbols-outlined text-sm">{icon}</span>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t-4 border-[#594238] bg-[#2a2a2a] px-4 py-12 sm:px-6 md:px-12 md:py-20 lg:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#ee671c] via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="sc-glowing-text mb-8 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold uppercase tracking-tighter text-[#e5e2e1] md:text-4xl">
            JOIN THE HIGH SCORES
          </h2>
          <p className="mx-auto mb-10 max-w-2xl font-['var(--font-sc-body),ui-sans-serif] text-lg text-[#e5e2e1]">
            Ready to experience the gold standard of electrical service? Secure your spot on our next operation (demo).
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Link
              href={STARLIGHT_PATHS.contact}
              className="inline-flex min-h-12 w-full items-center justify-center border-b-8 border-[#4c1a00] bg-[#ee671c] px-6 py-4 font-['var(--font-sc-display),ui-sans-serif] text-base font-bold uppercase tracking-wider text-[#351000] shadow-[0_0_30px_rgba(238,103,28,0.5)] transition-transform hover:scale-105 active:translate-y-1 active:border-b-4 sm:w-auto sm:px-10 sm:py-5 sm:text-lg sm:tracking-widest"
            >
              CONTACT US
            </Link>
            <Link
              href={STARLIGHT_PATHS.work}
              className="inline-flex min-h-12 w-full items-center justify-center border-4 border-[#ffb595] px-6 py-4 font-['var(--font-sc-display),ui-sans-serif] text-base font-bold uppercase tracking-wider text-[#ffb595] transition-colors hover:bg-[#ffb595]/10 sm:w-auto sm:px-10 sm:py-5 sm:text-lg sm:tracking-widest"
            >
              VIEW MISSION LOGS
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
