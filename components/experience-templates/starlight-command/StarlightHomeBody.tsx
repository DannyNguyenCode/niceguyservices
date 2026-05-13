import Image from "next/image";
import Link from "next/link";
import { STARLIGHT_PATHS } from "@/components/experience-templates/starlight-command/starlightConfig";
import { SC_IMG } from "@/components/experience-templates/starlight-command/starlightImages";

export function StarlightHomeBody() {
  return (
    <main className="relative overflow-x-hidden pb-28 md:pb-10">
      <section className="relative flex min-h-[min(100dvh,44rem)] items-center justify-center border-b-4 border-[#594238] px-4 pb-20 pt-16 sm:min-h-144 sm:pb-24 sm:pt-20 md:min-h-[720px] md:px-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={SC_IMG.homeHero}
            alt="Toronto skyline at dusk with industrial styling (demo)"
            fill
            className="object-cover opacity-30 grayscale"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-[#131313]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#131313_70%)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-block max-w-full border-2 border-[#ffb595] px-3 py-1 sm:mb-8 sm:px-4">
            <span className="font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ffb595] sm:text-sm sm:tracking-[0.3em]">
              TORONTO ELECTRICAL UNIT
            </span>
          </div>
          <h1 className="mb-6 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold leading-[1.05] tracking-tight text-[#e5e2e1] sm:text-5xl md:text-6xl lg:text-7xl">
            POWERING TORONTO <br className="hidden sm:block" /> WITH{" "}
            <span className="text-[#ee671c]">PRECISION</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl font-['var(--font-sc-body),ui-sans-serif] text-base leading-relaxed text-[#e0c0b2] sm:text-lg">
            High-voltage expertise for residential, commercial, and industrial sectors. Toronto&apos;s elite craftsmanship grounded in professional rigor and
            retro-industrial durability.
          </p>
          <div className="mx-auto flex w-full max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:items-center sm:gap-6 md:mx-auto">
            <Link
              href={STARLIGHT_PATHS.contact}
              className="inline-flex min-h-12 items-center justify-center bg-[#ee671c] px-8 py-3.5 font-['var(--font-sc-display),ui-sans-serif] text-base font-bold text-[#351000] transition-all hover:shadow-[0_0_30px_#ee671c] sm:min-h-14 sm:px-10 sm:py-4 sm:text-lg md:text-xl"
            >
              REQUEST QUOTE
            </Link>
            <Link
              href={STARLIGHT_PATHS.work}
              className="inline-flex min-h-12 items-center justify-center border-2 border-[#a88a7e] px-8 py-3.5 font-['var(--font-sc-display),ui-sans-serif] text-base font-bold text-[#e5e2e1] transition-all hover:bg-[#353535] sm:min-h-14 sm:px-10 sm:py-4 sm:text-lg md:text-xl"
            >
              VIEW MISSIONS
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-24 left-10 top-24 hidden w-8 flex-col justify-between opacity-20 xl:flex">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-1 w-full bg-[#ffb595]" />
          ))}
        </div>
      </section>

      <section className="bg-[#0e0e0e] px-4 py-16 sm:py-24 md:px-16">
        <div className="mb-16 text-center">
          <h2 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold uppercase tracking-tight text-[#e5e2e1] md:text-4xl">
            Active Operations
          </h2>
          <div className="mx-auto h-1 w-24 bg-[#ee671c]" />
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              n: "01 / DOMESTIC",
              title: "Residential",
              icon: "home",
              bullets: ["Smart Home Control", "Panel Modernization", "EV Station Unit"],
            },
            {
              n: "02 / CORPORATE",
              title: "Commercial",
              icon: "business",
              bullets: ["Grid Management", "Emergency Backup", "Lighting Retrofit"],
            },
            {
              n: "03 / HEAVY-DUTY",
              title: "Industrial",
              icon: "factory",
              bullets: ["Machine Powering", "Thermal Imaging", "3-Phase Circuits"],
            },
          ].map((card) => (
            <div
              key={card.title}
              className="sc-inner-glow-amber group relative overflow-hidden border-2 border-[#594238] bg-[#20201f] p-6 transition-all hover:border-[#ffb595] sm:p-8"
            >
              <div className="pointer-events-none absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-100">
                <span className="material-symbols-outlined text-[64px] text-[#ffb595]">{card.icon}</span>
              </div>
              <div className="relative z-10">
                <span className="mb-4 block font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#ffb595]">
                  {card.n}
                </span>
                <h3 className="mb-4 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold uppercase text-[#e5e2e1]">{card.title}</h3>
                <p className="mb-8 font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">
                  Precision-engineered electrical architecture for the {card.title.toLowerCase()} sector — demo copy only.
                </p>
                <div className="mb-6 h-1 w-full bg-[#594238] transition-colors group-hover:bg-[#ee671c]" />
                <ul className="mb-8 space-y-3 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-wide text-[#e5e2e1]">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-[#ffb595]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={STARLIGHT_PATHS.services}
                  className="inline-flex items-center gap-2 font-bold text-[#ffb595] transition-transform hover:translate-x-2"
                >
                  INITIATE MISSION <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y-4 border-[#594238] bg-[#131313] px-4 py-16 sm:py-24 md:px-16">
        <div className="pointer-events-none absolute inset-0 sc-hud-scan opacity-20" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <h2 className="mb-8 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold text-[#e5e2e1] md:text-4xl">COMMAND PARAMETERS</h2>
            <p className="mb-12 font-['var(--font-sc-body),ui-sans-serif] text-lg text-[#e0c0b2]">
              Our protocol is built on three pillars of electrical excellence. We engineer safety and reliability into the DNA of your building.
            </p>
            <div className="space-y-6">
              {[
                { icon: "bolt", t: "Fast Response", d: "Emergency units deployed across GTA 24/7." },
                { icon: "verified", t: "Licensed Elite", d: "Master electricians with zero tolerance for error." },
                { icon: "shield", t: "Reliable Tech", d: "Industrial-grade components and craftsmanship." },
              ].map((row) => (
                <div key={row.t} className="flex flex-col gap-4 border-l-8 border-[#ffb595] bg-[#353535] p-5 shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                  <span className="material-symbols-outlined shrink-0 text-4xl text-[#ffb595]">{row.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase text-[#e5e2e1]">{row.t}</h4>
                    <p className="font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">{row.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:w-1/2">
            <div className="relative aspect-square w-full border-4 border-[#594238] bg-[#20201f] p-3 sm:p-4">
              <Image
                src={SC_IMG.homeTech}
                alt="Electrician at industrial control panel (demo)"
                fill
                className="object-cover grayscale brightness-50"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 border-l-4 border-t-4 border-[#ffb595]" />
              <div className="pointer-events-none absolute -bottom-4 -right-4 h-12 w-12 border-b-4 border-r-4 border-[#ffb595]" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1c1b1b] px-4 py-16 sm:py-24 md:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-3 border-b-4 border-[#594238] pb-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <h2 className="font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold uppercase text-[#e5e2e1] md:text-4xl">Sector Feedback</h2>
            <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold text-[#ffb595]">LIVE_FEED.SYS</span>
          </div>
          <div className="space-y-1">
            {[
              { id: "01", q: "Complete factory rewiring finished ahead of schedule. Flawless execution.", a: "MARCUS V. / INDUSTRIAL MANAGER" },
              { id: "02", q: "Restored power to our retail hub in record time during the storm. Lifesavers.", a: "SARAH J. / QUEEN ST. RETAIL" },
              { id: "03", q: "The panel upgrade was clean, professional, and built like a tank.", a: "DAVE L. / RESIDENTIAL OWNER" },
            ].map((row) => (
              <div
                key={row.id}
                className="group grid grid-cols-12 items-start gap-3 border-b border-[#594238] bg-[#353535] p-4 transition-all hover:bg-[#ee671c] sm:items-center sm:gap-0 sm:p-6"
              >
                <div className="col-span-12 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-bold text-[#ffb595] group-hover:text-[#351000] md:col-span-2">
                  {row.id}
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="font-['var(--font-sc-body),ui-sans-serif] font-medium italic text-[#e5e2e1] group-hover:text-[#351000]">&quot;{row.q}&quot;</p>
                  <span className="mt-2 block font-['var(--font-sc-display),ui-sans-serif] text-xs font-semibold uppercase text-[#e0c0b2] group-hover:text-[#351000]/80">
                    {row.a}
                  </span>
                </div>
                <div className="col-span-12 mt-4 flex justify-start gap-0.5 text-[#ffb595] group-hover:text-[#351000] md:col-span-3 md:mt-0 md:justify-end">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined sc-material-fill text-sm">
                      star
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#ee671c] px-4 py-16 text-center text-[#351000] sm:py-24 md:px-16">
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="grid h-full w-full grid-cols-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-r border-[#351000]" />
            ))}
            <div />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-6 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold sm:text-4xl md:text-5xl">READY TO ENERGIZE?</h2>
          <p className="mx-auto mb-10 max-w-xl font-['var(--font-sc-body),ui-sans-serif] text-base text-[#351000]/80 sm:text-lg">
            Deployment units are standing by. Secure your electrical infrastructure with Toronto&apos;s precision-engineered power team (fictional demo).
          </p>
          <Link
            href={STARLIGHT_PATHS.contact}
            className="inline-flex min-h-12 items-center justify-center bg-[#351000] px-8 py-4 font-['var(--font-sc-display),ui-sans-serif] text-base font-bold text-[#ffb595] shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all hover:bg-[#131313] sm:min-h-14 sm:px-12 sm:py-5 sm:text-lg md:text-xl"
          >
            REQUEST QUOTE NOW
          </Link>
        </div>
      </section>
    </main>
  );
}
