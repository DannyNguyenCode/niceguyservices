import Image from "next/image";
import Link from "next/link";
import { STARLIGHT_PATHS, STARLIGHT_BRAND_SENTENCE } from "@/components/experience-templates/starlight-command/starlightConfig";
import { SC_IMG } from "@/components/experience-templates/starlight-command/starlightImages";

export function StarlightServicesBody() {
  return (
    <main className="mx-auto max-w-7xl space-y-16 px-4 py-10 pb-28 sm:space-y-20 sm:py-12 md:space-y-24 md:px-8 md:pb-16 lg:px-16">
      <section className="sc-inner-glow-amber relative grid grid-cols-1 items-center gap-6 overflow-hidden border-4 border-[#594238] bg-[#20201f] p-4 sm:gap-8 sm:p-6 md:p-8 lg:grid-cols-12">
        <div className="relative z-10 space-y-4 sm:space-y-6 lg:col-span-7">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#ffb595] shadow-[0_0_8px_#ee671c]" />
            <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#ffb595]">
              SYSTEMS STATUS: OPTIMAL
            </span>
          </div>
          <h1 className="font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold uppercase leading-[1.05] text-[#e5e2e1] sm:text-5xl md:text-6xl lg:text-7xl">
            Full-Spectrum <br />
            <span className="text-[#ffb595]">Electrical Command</span>
          </h1>
          <p className="max-w-xl font-['var(--font-sc-body),ui-sans-serif] text-lg text-[#e0c0b2]">
            From high-voltage industrial control systems to precision residential lighting — Toronto&apos;s reliable electrical architecture. Built to code. Built
            for power (demo).
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-4">
            <Link
              href={STARLIGHT_PATHS.contact}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#ee671c] px-6 py-3.5 font-['var(--font-sc-display),ui-sans-serif] text-xs font-bold uppercase tracking-widest text-[#4c1a00] sm:px-8 sm:py-4"
            >
              INITIALIZE SERVICE <span className="material-symbols-outlined text-xl">bolt</span>
            </Link>
            <Link
              href={STARLIGHT_PATHS.work}
              className="inline-flex min-h-12 items-center justify-center border-2 border-[#ffb595] px-6 py-3.5 font-['var(--font-sc-display),ui-sans-serif] text-xs font-bold uppercase tracking-widest text-[#ffb595] transition-colors hover:bg-[#ffb595]/10 sm:px-8 sm:py-4 sm:text-sm"
            >
              VIEW PROTOCOLS
            </Link>
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <div className="group relative aspect-square overflow-hidden border-4 border-[#594238] bg-[#353535]">
            <Image
              src={SC_IMG.servicesHeroPanel}
              alt="Industrial electrical control panel (demo)"
              fill
              className="object-cover opacity-60 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0"
              sizes="(max-width:1024px) 100vw, 40vw"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#20201f] via-transparent to-transparent" />
            <div className="absolute bottom-4 right-4 bg-[#ffb595] px-3 py-1 font-['var(--font-sc-display),ui-sans-serif] text-xs font-bold uppercase text-[#351000]">
              SECURE FEED 01
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12" id="residential">
        <div className="flex flex-col justify-between gap-4 border-b-4 border-[#594238] pb-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <h2 className="flex flex-col gap-3 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-bold uppercase text-[#e5e2e1] sm:flex-row sm:items-center sm:gap-4 sm:text-3xl md:text-4xl">
              <span className="material-symbols-outlined sc-material-fill shrink-0 text-3xl text-[#ffb595] sm:text-4xl">home</span>
              <span className="leading-tight">Residential Architecture</span>
            </h2>
            <p className="font-['var(--font-sc-display),ui-sans-serif] text-sm text-[#e0c0b2]">UNIT CLASSIFICATION: DOMESTIC POWER SYSTEMS</p>
          </div>
          <div className="relative hidden h-1 w-1/3 bg-[#594238] md:block">
            <div className="absolute -top-1 right-0 h-3 w-3 bg-[#ffb595]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: "lightbulb",
              title: "Lighting Design",
              body: "Precision illumination engineering including recessed arrays, smart automation integration, and architectural accentuation.",
              items: ["Smart Dimmers", "LED Retrofitting", "Security Lighting"],
            },
            {
              icon: "settings_input_component",
              title: "Panel Upgrades",
              body: "Evolutionary system upgrades to 200A service, ensuring your domestic grid handles modern demands safely.",
              items: ["Circuit Expansion", "Fuse-to-Breaker", "Surge Protection"],
            },
            {
              icon: "build",
              title: "Rapid Response",
              body: "Diagnostic and restorative interventions for faulty wiring, flickering circuits, and hazardous power failures.",
              items: ["Fault Diagnosis", "Outlet Replacement", "Hazard Mitigation"],
            },
          ].map((c) => (
            <div
              key={c.title}
              className="group border-b-4 border-[#ee671c] bg-[#2a2a2a] p-6 transition-colors hover:bg-[#353535]"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#ee671c]">
                <span className="material-symbols-outlined sc-material-fill text-2xl text-[#4c1a00]">{c.icon}</span>
              </div>
              <h3 className="mb-4 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold uppercase text-[#e5e2e1]">{c.title}</h3>
              <p className="mb-6 font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">{c.body}</p>
              <ul className="space-y-2 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase opacity-80">
                {c.items.map((li) => (
                  <li key={li} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#ffb595]" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-l-4 border-[#ee671c] bg-[#1c1b1b] p-4 sm:p-6 md:p-8" id="commercial">
        <div className="pointer-events-none absolute right-4 top-4 hidden text-[10px] font-bold uppercase tracking-[0.5em] text-[#ffb595]/30 lg:block [writing-mode:vertical-rl]">
          COMMERCIAL_DATA_MODULE_07
        </div>
        <div className="mb-12">
          <span className="mb-4 inline-block bg-[#ee671c] px-3 py-1 font-['var(--font-sc-display),ui-sans-serif] text-xs font-bold uppercase text-[#4c1a00]">
            SECTOR 02: COMMERCIAL
          </span>
          <h2 className="mb-4 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold uppercase text-[#e5e2e1] md:text-4xl">Commercial Infrastructure</h2>
          <p className="max-w-2xl font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">
            High-efficiency power solutions for office complexes, retail environments, and professional workspaces.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            {[
              {
                icon: "domain",
                t: "Office Illumination",
                d: "Lumen-optimized workspace lighting designed to maximize productivity and minimize energy consumption through automated sensor arrays.",
              },
              {
                icon: "verified",
                t: "Compliance Inspections",
                d: "Thorough code-adherence auditing and certification to ensure your commercial facility meets provincial electrical safety standards.",
              },
            ].map((b) => (
              <div key={b.t} className="flex flex-col gap-4 border border-[#594238] bg-[#131313]/50 p-4 transition-colors hover:border-[#ffb595] sm:flex-row sm:gap-6">
                <div className="text-[#ffb595]">
                  <span className="material-symbols-outlined text-4xl">{b.icon}</span>
                </div>
                <div>
                  <h4 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-xl font-semibold uppercase text-[#ffb595]">{b.t}</h4>
                  <p className="font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative border-4 border-[#594238] bg-[#131313] p-6">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#ffb595]">
                MODULE: TRUST_METRICS
              </span>
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-[#ffb595]" />
                <span className="h-2 w-2 bg-[#ffb595]" />
                <span className="h-2 w-2 bg-[#ffb595]/20" />
              </div>
            </div>
            <div className="space-y-6">
              {[
                ["Code Compliance Rate", "100%"],
                ["Emergency Uptime", "24/7/365"],
                ["Certified Engineers", "12+"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-end justify-between gap-2 gap-y-1 border-b border-[#594238] pb-2">
                  <span className="max-w-[65%] font-['var(--font-sc-display),ui-sans-serif] text-xs font-semibold uppercase leading-snug text-[#e0c0b2] sm:max-w-none sm:text-sm">
                    {k}
                  </span>
                  <span className="shrink-0 text-xl font-bold text-[#ffb595] sm:text-2xl">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Image
                src={SC_IMG.servicesOffice}
                alt="Modern office interior with lighting (demo)"
                width={800}
                height={200}
                className="h-32 w-full object-cover grayscale brightness-50 contrast-125"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-12" id="industrial">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="relative mb-6 inline-block">
              <div className="absolute -inset-1 bg-[#ee671c] opacity-25 blur" />
              <h2 className="relative bg-[#131313] px-2 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-bold uppercase leading-tight text-[#e5e2e1] sm:text-3xl md:text-4xl">
                Industrial Heavy Load
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  t: "Equipment Maintenance",
                  d: "Preventative and corrective service for heavy machinery, transformer vaults, and high-voltage distribution switchgear.",
                },
                {
                  t: "PLC & Control Systems",
                  d: "Advanced logic controller programming and integration — the brains behind industrial production lines.",
                },
                {
                  t: "Thermal Imaging Analysis",
                  d: "Non-invasive infrared diagnostics to identify thermal anomalies before catastrophic failures.",
                },
              ].map((b) => (
                <div key={b.t} className="sc-ladder-border-left py-4 pl-8">
                  <h4 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-xl font-semibold uppercase text-[#ffb595]">{b.t}</h4>
                  <p className="font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 border-4 border-[#594238] bg-[#353535] p-2 md:order-2">
            <Image
              src={SC_IMG.servicesIndustrial}
              alt="Heavy industrial electrical machinery (demo)"
              width={900}
              height={506}
              className="aspect-video w-full object-cover grayscale"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-8 border-t-4 border-[#594238] px-1 py-10 sm:space-y-12 sm:px-4 sm:py-12">
        <h2 className="px-2 text-center font-['var(--font-sc-display),ui-sans-serif] text-2xl font-bold uppercase leading-snug text-[#e5e2e1] sm:text-3xl md:text-4xl">
          Technical Inquiry Protocol (FAQ)
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Emergency Deployment Times?",
              a: "Standard emergency deployment within the Greater Toronto Area is 90 minutes or less. Priority is given to hazardous conditions and critical industrial failures (fictional demo).",
            },
            {
              q: "Certification & Licensing Status?",
              a: `${STARLIGHT_BRAND_SENTENCE} operates under a fictional ECRA-style license in this preview. All copy is placeholder — not a real contractor.`,
            },
            {
              q: "Smart Home Integration?",
              a: "We specialize in Lutron, Control4, and KNX systems in this narrative demo — wire your real stack when you ship.",
            },
          ].map((item) => (
            <details key={item.q} className="group border-2 border-[#594238] bg-[#20201f] transition-all hover:border-[#ffb595]">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 sm:items-center sm:p-6 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1 text-left font-['var(--font-sc-display),ui-sans-serif] text-base font-semibold uppercase leading-snug text-[#e5e2e1] sm:text-lg md:text-xl">
                  {item.q}
                </span>
                <span className="material-symbols-outlined shrink-0 transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="border-t border-[#594238] px-4 pb-4 pt-3 font-['var(--font-sc-body),ui-sans-serif] text-sm leading-relaxed text-[#e0c0b2] sm:px-6 sm:pb-6 sm:pt-4 sm:text-base">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-6 bg-[#ee671c] p-6 text-center shadow-[0_0_40px_rgba(238,103,28,0.4)] sm:space-y-8 sm:p-10 md:p-12">
        <h2 className="font-['var(--font-sc-display),ui-sans-serif] text-2xl font-bold uppercase leading-tight text-[#351000] sm:text-3xl md:text-4xl md:leading-tight lg:text-5xl">
          Authorize Your System Upgrade Today
        </h2>
        <p className="mx-auto max-w-2xl text-base font-medium text-[#351000] sm:text-lg md:text-xl">
          Our command center is standing by to dispatch elite electrical engineers to your location. Secure your grid now (demo).
        </p>
        <div className="flex justify-center">
          <Link
            href={STARLIGHT_PATHS.contact}
            className="inline-flex min-h-12 items-center justify-center bg-[#351000] px-6 py-3.5 font-['var(--font-sc-display),ui-sans-serif] text-base font-bold uppercase text-[#ffb595] shadow-xl transition-transform hover:scale-105 active:scale-95 sm:min-h-14 sm:px-10 sm:py-5 sm:text-lg md:text-xl"
          >
            REQUEST DISPATCH
          </Link>
        </div>
      </section>
    </main>
  );
}
