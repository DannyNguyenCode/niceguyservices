import Image from "next/image";
import Link from "next/link";
import { StarlightContactForm } from "@/components/experience-templates/starlight-command/StarlightContactForm";
import { STARLIGHT_PATHS, STARLIGHT_OPS_EMAIL } from "@/components/experience-templates/starlight-command/starlightConfig";
import { SC_IMG } from "@/components/experience-templates/starlight-command/starlightImages";

export function StarlightContactBody() {
  return (
    <main className="min-h-screen overflow-x-hidden pb-28 pt-6 sm:pt-8 md:pb-20 md:pt-12">
      <section className="px-4 py-4 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end">
            <div className="w-full flex-1 md:min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 border border-[#594238] bg-[#353535] px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffb595]" aria-hidden />
                <span className="font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2]">
                  System Online
                </span>
              </div>
              <h1 className="mb-4 font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold leading-[1.05] tracking-tight text-[#ffdcc5] sm:text-4xl md:text-5xl lg:text-6xl">
                CONTACT CENTER
              </h1>
              <p className="max-w-2xl font-['var(--font-sc-body),ui-sans-serif] text-base leading-relaxed text-[#e0c0b2] sm:text-lg">
                Deploy expert electrical assistance across the Greater Toronto Sector. Our command interface is monitoring all frequencies 24/7.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-6">
            <div className="sc-glow-amber relative border-4 border-[#594238] bg-[#20201f] p-4 sm:p-6 md:col-span-7 md:p-8">
              <div className="pointer-events-none absolute right-2 top-2 opacity-20 md:right-4 md:top-4">
                <span className="material-symbols-outlined text-6xl text-[#e5e2e1]">terminal</span>
              </div>
              <h2 className="mb-6 flex flex-wrap items-center gap-2 pr-12 font-['var(--font-sc-display),ui-sans-serif] text-lg font-semibold text-[#ffb595] sm:mb-8 sm:pr-16 sm:text-xl md:text-2xl">
                <span className="material-symbols-outlined">settings_input_component</span>
                TRANSMISSION PROTOCOL
              </h2>
              <StarlightContactForm />
            </div>

            <div className="flex flex-col gap-6 md:col-span-5">
              <div className="relative overflow-hidden border-4 border-[#93000a] bg-[#93000a] p-6">
                <div className="pointer-events-none absolute -right-4 -top-4 opacity-10 transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-9xl text-[#ffdad6]">warning</span>
                </div>
                <h3 className="mb-2 font-['var(--font-sc-display),ui-sans-serif] text-2xl font-semibold text-[#ffdad6]">CRITICAL OVERRIDE</h3>
                <p className="mb-4 font-['var(--font-sc-body),ui-sans-serif] text-[#ffdad6]/90">
                  Immediate electrical hazard? Deploy emergency unit now.
                </p>
                <a
                  href="tel:+14165550199"
                  className="inline-flex min-h-12 w-full max-w-full flex-wrap items-center justify-center gap-2 bg-[#ffdad6] px-4 py-3 text-center text-sm font-bold text-[#93000a] transition-colors hover:bg-white sm:w-auto sm:gap-3 sm:px-6 sm:text-base"
                >
                  <span className="material-symbols-outlined">call</span>
                  +1 (416) 555-0199
                </a>
              </div>

              <div className="relative h-64 min-h-64 w-full overflow-hidden border-4 border-[#594238] bg-[#2a2a2a] md:h-auto md:min-h-80">
                <Image
                  src={SC_IMG.contactMap}
                  alt="Stylized night map of Toronto service sectors (demo art)"
                  fill
                  className="object-cover opacity-50 grayscale transition-all duration-700 hover:grayscale-0"
                  sizes="(max-width:768px) 100vw, 400px"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#131313] to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 border border-[#ee671c] bg-[#131313] px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-[#ffb595]" />
                    <span className="font-['var(--font-sc-display),ui-sans-serif] text-xs font-semibold uppercase tracking-widest text-[#ffb595]">
                      SECTOR: TORONTO_HQ
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-4 border-[#594238] bg-[#20201f] p-6 font-mono text-sm">
                <h4 className="mb-4 border-b border-[#594238] pb-2 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2]">
                  UPTIME_STATUS
                </h4>
                <div className="space-y-2 text-sm text-[#ffb595] sm:text-base">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <span>MON-FRI</span>
                    <span className="sm:text-right">08:00 - 20:00</span>
                  </div>
                  <div className="flex flex-col gap-1 opacity-80 sm:flex-row sm:justify-between sm:gap-4">
                    <span>SATURDAY</span>
                    <span className="sm:text-right">10:00 - 16:00</span>
                  </div>
                  <div className="flex flex-col gap-1 text-[#ffb4ab] sm:flex-row sm:justify-between sm:gap-4">
                    <span>SUNDAY</span>
                    <span className="break-all sm:break-normal sm:text-right">EMERGENCY_ONLY</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4 border-t border-[#594238] pt-4 text-[#e0c0b2]">
                  <div className="border border-[#594238] p-2">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-50">STATION_COMMS</p>
                    <p className="break-all font-['var(--font-sc-display),ui-sans-serif] text-xs font-semibold sm:text-sm">
                      {STARLIGHT_OPS_EMAIL}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto my-12 hidden max-w-7xl items-center justify-between px-16 opacity-20 md:flex">
        <div className="h-1 flex-1 bg-[#594238]" />
        <div className="flex gap-4 px-8">
          <div className="h-8 w-1 bg-[#594238]" />
          <div className="h-8 w-1 bg-[#594238]" />
          <div className="h-8 w-1 bg-[#594238]" />
        </div>
        <div className="h-1 flex-1 bg-[#594238]" />
      </div>

      <p className="px-4 pt-8 text-center font-['var(--font-sc-body),ui-sans-serif] text-sm text-[#e0c0b2] md:hidden">
        <Link href="/template" className="text-[#ee671c] underline-offset-4 hover:underline">
          Back to template gallery
        </Link>
        {" · "}
        <Link href={STARLIGHT_PATHS.home} className="text-[#ee671c] underline-offset-4 hover:underline">
          Command home
        </Link>
      </p>
    </main>
  );
}
