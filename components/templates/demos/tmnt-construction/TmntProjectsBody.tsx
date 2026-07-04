import Image from "next/image";
import Link from "next/link";
import { TMNT_BASE, TMNT_IMAGES } from "./tmntConfig";

const h = { fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" };
const label = { fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" };

const FILTERS = ["All_units", "Driveways", "Patios", "Commercial", "Lighting"] as const;

const FILTER_BTN = [
  "border-l-4 border-[#216b41] bg-[#216b41] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(33,107,65,0.2)]",
  "bg-[#225cb4] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:opacity-90",
  "bg-[#ac3231] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:opacity-90",
  "bg-[#ffb300] px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:opacity-90",
  "bg-[#9c27b0] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:opacity-90",
] as const;

export function TmntProjectsBody() {
  return (
    <main className="pb-28 md:pb-8">
      <section className="mb-16 px-5 md:px-20">
        <div className="relative flex min-h-[353px] items-end overflow-hidden border-2 border-[#bfc9be] bg-[#ecefe9] p-6 md:min-h-[530px] md:p-8">
          <div className="absolute inset-0 z-0">
            <Image
              src={TMNT_IMAGES.v2PortfolioHero}
              alt="Premium interlocking driveway at dusk"
              fill
              className="object-cover opacity-80 mix-blend-luminosity"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#ecefe9] via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-30" aria-hidden />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-0.5 w-12 bg-[#216b41]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                Field operations
              </span>
            </div>
            <h1 className="mb-4 text-4xl font-black uppercase text-[#181d19] md:text-6xl" style={h}>
              Mission logs
            </h1>
            <p className="max-w-xl text-lg text-[#404941]">
              A visual record of elite craftsmanship — demo imagery and fictional project codenames.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6 px-5 md:px-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#bfc9be] pb-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f, i) => (
              <button key={f} type="button" className={FILTER_BTN[i]} style={label}>
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-4 text-[#404941] lg:flex">
            <span className="text-xs font-bold uppercase tracking-widest" style={label}>
              Sort_by:
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
              Chronological
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 px-5 md:grid-cols-12 md:px-20">
        <div className="group relative aspect-video overflow-hidden border-2 border-[#bfc9be] bg-[#ecefe9] md:col-span-8">
          <Image
            src={TMNT_IMAGES.projectLarge}
            alt="Large interlocking installation"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 768px) 66vw, 100vw"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="mb-2 w-fit bg-[#216b41] px-3 py-1">
              <span className="text-[10px] font-bold uppercase text-white" style={label}>
                Mission: driveway_secured
              </span>
            </div>
            <h3 className="text-2xl font-bold uppercase text-white" style={h}>
              The Fogbank overhaul
            </h3>
            <p className="mt-2 max-w-md text-white/80">Reinforced sub-base and tactical-grade interlocking for heavy use.</p>
          </div>
          <div className="pointer-events-none absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-[#216b41]/50" />
          <div className="pointer-events-none absolute right-4 bottom-4 h-8 w-8 border-r-2 border-b-2 border-[#216b41]/50" />
        </div>

        <div className="group relative min-h-[280px] overflow-hidden border-2 border-[#bfc9be] bg-[#ecefe9] md:col-span-4">
          <Image
            src={TMNT_IMAGES.v2PortfolioPurplePatio}
            alt="Stone patio with accent lighting"
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            sizes="400px"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#216b41]/10 opacity-40 mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 p-6">
            <div className="mb-2 w-fit bg-[#9c27b0] px-2 py-1">
              <span className="text-[10px] font-bold uppercase text-white" style={label}>
                Ops: night_watch
              </span>
            </div>
            <h3 className="text-2xl font-bold uppercase text-white drop-shadow-md" style={h}>
              Purple reign patio
            </h3>
          </div>
        </div>

        <div className="group relative aspect-square overflow-hidden border-2 border-[#bfc9be] bg-[#ecefe9] md:col-span-4">
          <Image
            src={TMNT_IMAGES.v2PortfolioWall}
            alt="Retaining wall stone"
            fill
            className="object-cover brightness-90 transition-all group-hover:brightness-100"
            sizes="400px"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <span className="material-symbols-outlined text-6xl text-[#216b41]" aria-hidden>
              add_circle
            </span>
          </div>
          <div className="absolute top-0 right-0 bg-[#e0e3dd] p-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#181d19]" style={label}>
              Log #429
            </span>
          </div>
        </div>

        <div className="group relative h-64 overflow-hidden border-2 border-[#bfc9be] bg-[#ecefe9] md:col-span-8">
          <div className="grid h-full grid-cols-1 md:grid-cols-2">
            <div className="relative flex flex-col justify-center border-r-2 border-[#bfc9be] bg-[#e6e9e3] p-6">
              <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-25" aria-hidden />
              <span className="relative z-10 mb-2 text-xs font-bold uppercase tracking-widest text-[#ffb300]" style={label}>
                Commercial_sector
              </span>
              <h3 className="relative z-10 mb-4 text-2xl font-bold uppercase leading-none text-[#181d19]" style={h}>
                Logistics hub entrance
              </h3>
              <p className="relative z-10 text-[#404941]">Reinforced masonry for high-frequency industrial traffic.</p>
              <div className="relative z-10 mt-6 flex gap-2">
                <div className="h-1 flex-1 bg-[#ffb300]" />
                <div className="h-1 flex-1 bg-[#bfc9be]" />
                <div className="h-1 flex-1 bg-[#bfc9be]" />
              </div>
            </div>
            <div className="relative min-h-[200px] overflow-hidden">
              <Image
                src={TMNT_IMAGES.v2PortfolioCommercial}
                alt="Commercial plaza pavers"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="50vw"
              />
            </div>
          </div>
        </div>

        {[
          { img: TMNT_IMAGES.v2PortfolioKitchen, unit: "Outdoor_kitchen", status: "Operational", accent: "text-[#225cb4]" },
          { img: TMNT_IMAGES.v2PortfolioPool, unit: "Aquatic_perimeter", status: "Secured", accent: "text-[#216b41]" },
          { img: TMNT_IMAGES.v2PortfolioStairs, unit: "Terrain_gradient", status: "Deployment_complete", accent: "text-[#ac3231]" },
        ].map((row) => (
          <div key={row.unit} className="group overflow-hidden border-2 border-[#bfc9be] md:col-span-4">
            <div className="relative h-48 w-full">
              <Image src={row.img} alt="" fill className="object-cover" sizes="400px" />
            </div>
            <div className="border-t-2 border-[#bfc9be] bg-[#ecefe9] p-4">
              <h4 className={`text-xs font-bold uppercase tracking-widest ${row.accent}`} style={label}>
                Unit: {row.unit.replace("_", " ")}
              </h4>
              <p className="mt-1 text-[12px] uppercase text-[#404941]">Status: {row.status.replace("_", " ")}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 px-5 md:px-20">
        <div className="relative overflow-hidden border-2 border-[#216b41] bg-[#216b41]/5 p-12">
          <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-20" aria-hidden />
          <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="mb-2 text-3xl font-extrabold uppercase text-[#216b41] md:text-4xl" style={h}>
                Initiate your mission
              </h2>
              <p className="text-lg text-[#181d19]">Secure your property with a tactical site plan — demo template.</p>
            </div>
            <Link
              href={`${TMNT_BASE}/contact`}
              className="whitespace-nowrap bg-[#216b41] px-12 py-5 text-xl font-black uppercase tracking-widest text-white transition-all hover:shadow-[0_0_20px_rgba(33,107,65,0.3)]"
              style={h}
            >
              Deploy now
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 flex h-2 w-full gap-1 px-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-full flex-1 bg-[#216b41]/20" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
