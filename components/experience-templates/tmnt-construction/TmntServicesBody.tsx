import Image from "next/image";
import Link from "next/link";
import { TMNT_BASE, TMNT_IMAGES } from "./tmntConfig";

const h = { fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" };
const label = { fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" };

export function TmntServicesBody() {
  return (
    <main className="relative overflow-x-hidden pb-24 md:pb-8">
      <section className="px-5 py-12 md:px-20">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-4xl font-black uppercase text-[#181d19] md:text-6xl" style={h}>
            Elite exterior operations
          </h1>
          <p className="max-w-2xl text-lg text-[#404941]">
            Precision-engineered landscapes built for harsh Canadian climate. From Ontario freeze-thaw to Alberta
            winters — tactical craftsmanship that lasts.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 px-5 pb-24 md:grid-cols-12 md:px-20">
        {/* Interlocking — large */}
        <div className="group relative overflow-hidden border-t-2 border-[#bfc9be] bg-[#ecefe9] transition-colors hover:border-[#216b41] md:col-span-8">
          <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-20" aria-hidden />
          <div className="relative z-10 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 bg-[#216b41]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                Mission 01: Interlocking
              </span>
            </div>
            <h2 className="mb-6 text-3xl font-extrabold uppercase text-[#181d19] md:text-4xl" style={h}>
              Precision stone arrays
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-6 text-[#404941]">
                  High-density concrete paving systems engineered for load-bearing capacity and thermal expansion
                  resistance.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined mt-1 text-[#216b41]" aria-hidden>
                      terminal
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#181d19]" style={label}>
                        Tactical process
                      </h4>
                      <p className="text-sm text-[#404941]">Excavation, compaction base layers, and polymeric sand fusion.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined mt-1 text-[#225cb4]" aria-hidden>
                      ac_unit
                    </span>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#181d19]" style={label}>
                        Climate shield
                      </h4>
                      <p className="text-sm text-[#404941]">Frost-heave mitigation tuned for ON/AB grade shifts.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-6 h-64 overflow-hidden border-2 border-[#bfc9be] grayscale transition-all group-hover:grayscale-0 md:mt-0 md:h-auto md:min-h-[280px]">
              <Image
                src={TMNT_IMAGES.v2SvcInterlockMacro}
                alt="Herringbone interlocking pavers"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-[#216b41]" />
              <div className="pointer-events-none absolute right-2 bottom-2 h-4 w-4 border-r-2 border-b-2 border-[#216b41]" />
            </div>
          </div>
        </div>

        {/* Steel */}
        <div className="group relative overflow-hidden border-t-2 border-[#bfc9be] bg-[#ecefe9] transition-colors hover:border-[#f96a65] md:col-span-4">
          <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-20" aria-hidden />
          <div className="relative z-10 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 bg-[#f96a65]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#ac3231]" style={label}>
                Mission 02: Steel
              </span>
            </div>
            <h2 className="mb-4 text-2xl font-bold uppercase text-[#181d19]" style={h}>
              Structural reinforcement
            </h2>
            <p className="mb-6 text-[#404941]">
              Heavy-gauge steel beams and retaining systems for vertical grade management and industrial aesthetics.
            </p>
            <div className="relative mb-6 h-48 w-full overflow-hidden border border-[#bfc9be]">
              <Image
                src={TMNT_IMAGES.v2SvcSteel}
                alt="Structural steel beam detail"
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <button
              type="button"
              className="w-full border-2 border-[#bfc9be] py-3 text-xs font-bold uppercase tracking-widest text-[#181d19] transition-colors hover:bg-[#e6e9e3]"
              style={label}
            >
              Specifications
            </button>
          </div>
        </div>

        {/* Softscapes */}
        <div className="group relative overflow-hidden border-t-2 border-[#bfc9be] bg-[#ecefe9] transition-colors hover:border-[#225cb4] md:col-span-6">
          <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-20" aria-hidden />
          <div className="relative z-10 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 bg-[#225cb4]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#225cb4]" style={label}>
                Mission 03: Softscapes &amp; optics
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-extrabold uppercase text-[#181d19]" style={h}>
              Bio-tactical environments
            </h2>
            <p className="mb-8 text-[#404941]">
              Low-voltage LED lighting integrated with resilient planting for year-round perimeter presence.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-l-4 border-[#5fa777] bg-[#e6e9e3] p-4">
                <span className="material-symbols-outlined mb-2 block text-[#216b41]" aria-hidden>
                  highlight
                </span>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#181d19]" style={label}>
                  LED optics
                </h4>
                <p className="mt-1 text-xs uppercase text-[#404941]">Layered lighting design</p>
              </div>
              <div className="border-l-4 border-[#5fa777] bg-[#e6e9e3] p-4">
                <span className="material-symbols-outlined mb-2 block text-[#216b41]" aria-hidden>
                  eco
                </span>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#181d19]" style={label}>
                  Native biomass
                </h4>
                <p className="mt-1 text-xs uppercase text-[#404941]">Low-maintenance palette</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deck */}
        <div className="group relative overflow-hidden border-t-2 border-[#bfc9be] bg-[#ecefe9] transition-colors hover:border-[#216b41] md:col-span-6">
          <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-20" aria-hidden />
          <div className="relative z-10 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-6 w-1 bg-[#216b41]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                Mission 04: Timber &amp; composite
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-extrabold uppercase text-[#181d19]" style={h}>
              Command centers (decks)
            </h2>
            <p className="mb-6 text-[#404941]">
              Elevated outdoor living platforms using hardwood or composite systems for extreme durability.
            </p>
            <div className="relative overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={TMNT_IMAGES.v2SvcDeck}
                  alt="Cedar deck and pergola at dusk"
                  fill
                  className="object-cover brightness-90 grayscale transition-all duration-500 group-hover:brightness-100 group-hover:grayscale-0"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="border border-[#216b41] bg-[#f7faf4]/90 p-6 backdrop-blur-md">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                    Project alpha view
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-24 px-5 md:px-20">
        <div className="flex flex-col gap-1">
          <div className="h-1 w-full bg-[#bfc9be]" />
          <div className="h-1 w-full bg-[#bfc9be]/75" />
          <div className="h-1 w-full bg-[#bfc9be]/50" />
          <div className="h-1 w-full bg-[#bfc9be]/25" />
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#e6e9e3] px-5 py-24 tmnt-stone-texture md:px-20">
        <div className="pointer-events-none absolute top-0 left-0 h-32 w-32 border-t-4 border-l-4 border-[#216b41]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-extrabold uppercase text-[#181d19] md:text-4xl" style={h}>
            Climate-forged durability
          </h2>
          <div className="grid gap-6 text-left md:grid-cols-3">
            {[
              {
                t: "Ontario: humidity shield",
                d: "Drainage matrices to reduce moisture trap in humid summers.",
              },
              {
                t: "Alberta: frost defense",
                d: "Extra-deep sub-bases engineered for extreme freeze-thaw.",
              },
              {
                t: "UV resistance",
                d: "Sealants that protect color integrity against intense sun.",
              },
            ].map((c) => (
              <div key={c.t} className="border border-[#bfc9be] bg-[#ffffff] p-6 tmnt-comic-border">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                  {c.t}
                </h3>
                <p className="text-sm text-[#404941]">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="tmnt-diagonal-break-services bg-[#e0e3dd] py-20 text-center">
        <div className="px-5 md:px-20">
          <Link
            href={`${TMNT_BASE}/contact`}
            className="inline-block bg-[#216b41] px-10 py-5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:brightness-110"
            style={label}
          >
            Start consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
