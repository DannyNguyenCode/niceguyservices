import Image from "next/image";
import Link from "next/link";
import {
  STARLIGHT_BRAND_SENTENCE,
  STARLIGHT_PATHS,
} from "@/components/templates/demos/starlight-command/starlightConfig";
import { SC_IMG } from "@/components/templates/demos/starlight-command/starlightImages";

export function StarlightAboutBody() {
  return (
    <main className="overflow-x-hidden pb-32 pt-4 sm:pt-6 md:pb-16 md:pt-8">
      <section className="relative mx-3 mb-10 flex min-h-[420px] items-center overflow-hidden border-b-4 border-[#594238] bg-[#1c1b1b] sm:mx-4 sm:min-h-[480px] md:mx-8 md:min-h-[560px] lg:mx-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={SC_IMG.aboutWorkshop}
            alt="Industrial electrical workshop interior (demo)"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#131313] via-[#131313]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl px-4 py-10 sm:px-8 sm:py-12 md:px-16 lg:px-20">
          <div className="mb-4 inline-block max-w-full bg-[#ee671c] px-2 py-1 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-wider text-[#351000] sm:mb-6 sm:px-3 sm:text-sm sm:tracking-widest">
            Sector: Toronto Headquarters
          </div>
          <h1 className="mb-4 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold leading-[1.05] text-[#ffb595] sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            BUILT TO LAST.
            <br />
            POWERED BY CODE.
          </h1>
          <p className="max-w-2xl font-['var(--font-sc-body),ui-sans-serif] text-lg text-[#e0c0b2]">
            From the historic streets of Old Toronto to the high-voltage demands of the modern skyline, we maintain the electrical pulse of the city with
            indestructible precision (fictional demo narrative).
          </p>
          <div className="mt-8">
            <Link
              href={STARLIGHT_PATHS.contact}
              className="inline-flex items-center gap-2 bg-[#ee671c] px-8 py-4 font-['var(--font-sc-display),ui-sans-serif] text-sm font-bold uppercase tracking-widest text-[#351000] transition-transform hover:scale-[0.98]"
            >
              <span className="material-symbols-outlined">shield</span>
              INITIALIZE AUDIT
            </Link>
          </div>
        </div>
      </section>

      <div className="flex justify-center py-12">
        <div className="relative h-24 w-1 bg-[#594238]">
          <div className="absolute -left-2 top-0 h-1 w-5 bg-[#ee671c]" />
          <div className="absolute -left-2 top-8 h-1 w-5 bg-[#ee671c]" />
          <div className="absolute -left-2 top-16 h-1 w-5 bg-[#ee671c]" />
          <div className="absolute -left-2 top-24 h-1 w-5 bg-[#ee671c] shadow-[0_0_10px_#ee671c]" />
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-6 px-4 md:grid-cols-12 md:px-16">
        <div className="relative flex flex-col justify-center border-4 border-[#594238] bg-[#20201f] p-5 sm:p-8 md:col-span-5">
          <div className="pointer-events-none absolute -right-1 -top-1 h-16 w-16 border-r-4 border-t-4 border-[#ee671c]" />
          <span className="mb-4 block font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#ffb595]">
            01 / OUR ROOTS
          </span>
          <h2 className="mb-6 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold text-[#e5e2e1] md:text-4xl">TORONTO BORN. INDUSTRIAL STRENGTH.</h2>
          <p className="mb-6 font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">
            Founded in the heart of Toronto, {STARLIGHT_BRAND_SENTENCE} was built on the philosophy that electrical infrastructure should be as robust as a steel beam.
            We engineer stability for homes and commercial assets — all placeholder copy for this template preview.
          </p>
          <div className="border-l-4 border-[#ee671c] bg-[#2a2a2a] p-4">
            <p className="font-['var(--font-sc-body),ui-sans-serif] italic text-[#ffb595]">
              &quot;In a city that never sleeps, the grid is everything. We treat every junction box like a vital organ.&quot;
            </p>
          </div>
        </div>
        <div className="relative min-h-[320px] md:col-span-7 md:min-h-[400px]">
          <Image
            src={SC_IMG.aboutSkyline}
            alt="Toronto skyline at dusk (demo)"
            fill
            className="border-4 border-[#594238] object-cover grayscale transition-all duration-700 hover:grayscale-0"
            sizes="(max-width:768px) 100vw, 58vw"
          />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 md:px-16">
        <div className="mb-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="h-1 grow bg-[#594238]" />
          <h2 className="text-center font-['var(--font-sc-display),ui-sans-serif] text-base font-semibold leading-snug text-[#ffb595] sm:whitespace-nowrap sm:text-lg md:text-2xl">
            MISSION LOG: THE TIMELINE
          </h2>
          <div className="h-1 grow bg-[#594238]" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="group border-4 border-[#594238] bg-[#20201f] p-6 transition-colors hover:border-[#ee671c] md:col-span-2">
            <div className="mb-4 flex items-start justify-between">
              <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold text-[#ee671c]">2012 [ESTABLISH]</span>
              <span className="material-symbols-outlined text-[#a88a7e] transition-colors group-hover:text-[#ee671c]">precision_manufacturing</span>
            </div>
            <h3 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold text-[#e5e2e1]">FOUNDATION LAID</h3>
            <p className="font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">
              Command established in a small Leslieville workshop with a single service van and a commitment to zero-fail electrical standards (story beat,
              not history).
            </p>
          </div>
          <div className="border-4 border-[#ee671c] bg-[#ee671c] p-6 text-[#351000]">
            <h3 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold">10k+</h3>
            <p className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-bold uppercase">CIRCUITS SECURED</p>
            <div className="mt-8 border-t-2 border-[#351000]/30 pt-4">
              <span className="material-symbols-outlined text-4xl">bolt</span>
            </div>
          </div>
          <div className="flex flex-col justify-between border-4 border-[#594238] bg-[#20201f] p-6">
            <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold text-[#ee671c]">2018 [EXPAND]</span>
            <h3 className="font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold text-[#e5e2e1]">HIGH-VOLTAGE DIVISION</h3>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="group relative min-h-56 overflow-hidden border-4 border-[#594238] bg-[#20201f] p-6 md:min-h-44">
            <Image
              src={SC_IMG.aboutTimelineBg}
              alt="Technician hands on circuit wiring (demo)"
              fill
              className="object-cover opacity-20 transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width:768px) 100vw, 25vw"
            />
            <div className="relative z-10">
              <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold text-[#ee671c]">CURRENT [NOW]</span>
              <h3 className="mt-2 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold text-[#e5e2e1]">THE GOLD STANDARD</h3>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 border-4 border-[#594238] bg-[#2a2a2a] p-8 md:col-span-3 md:flex-row">
            <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-[#ee671c] bg-[#131313] md:flex">
              <span className="material-symbols-outlined text-5xl text-[#ffb595]">verified</span>
            </div>
            <div>
              <h3 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold text-[#ffb595]">SAFETY OVERRIDE PROTOCOL</h3>
              <p className="font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">
                Every technician is trained in our 50-point safety checklist. We don&apos;t leave the site until the diagnostic terminal reads 100% stability
                (demo metaphor).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 text-center md:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold text-[#ffb595] underline decoration-4 underline-offset-8 decoration-[#594238] md:text-4xl">
            THE COMMAND UNIT
          </h2>
          <p className="mb-12 font-['var(--font-sc-body),ui-sans-serif] text-lg text-[#e0c0b2]">
            Expert craftsmanship isn&apos;t just a promise; it&apos;s our technical requirement. Certified electricians and fictional characters below — not
            real staff.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { name: "ELIAS VANCE", role: "Lead Systems Engineer", img: SC_IMG.aboutTeam1, lead: true },
            { name: "SARAH CHEN", role: "Diagnostic Specialist", img: SC_IMG.aboutTeam2, lead: false },
            { name: "MARCUS REED", role: "Field Operations", img: SC_IMG.aboutTeam3, lead: false },
          ].map((m) => (
            <div
              key={m.name}
              className={`border-b-8 bg-[#1c1b1b] p-4 pb-8 ${m.lead ? "border-[#ee671c]" : "border-[#594238]"}`}
            >
              <div className="relative mb-6 aspect-square overflow-hidden border-2 border-[#594238] bg-[#353535]">
                <Image
                  src={m.img}
                  alt={`Portrait of ${m.name}, fictional team member (demo)`}
                  fill
                  className="object-cover contrast-125 grayscale"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <h4 className="font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold text-[#ffb595]">{m.name}</h4>
              <p className="mt-1 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2]">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
