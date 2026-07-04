import Image from "next/image";
import Link from "next/link";
import { TMNT_BASE, TMNT_IMAGES } from "./tmntConfig";

const h = { fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" };
const label = { fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" };

export function TmntTestimonialsBody() {
  return (
    <main className="min-h-screen overflow-x-hidden pb-28 md:pb-8">
      <section className="relative flex h-[min(530px,70dvh)] min-h-[400px] items-end justify-start overflow-hidden border-b-4 border-[#216b41] px-5 py-12 md:px-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={TMNT_IMAGES.v2TestimonialHero}
            alt="Luxury interlocked driveway at twilight"
            fill
            priority
            className="object-cover opacity-60 grayscale"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#f7faf4] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 inline-block bg-[#216b41] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white" style={label}>
            Reports from the streets
          </div>
          <h1 className="text-4xl font-black uppercase italic text-[#181d19] md:text-6xl" style={h}>
            Elite loyalty.
            <br />
            Battle-tested results.
          </h1>
          <div className="mt-6 h-1 w-24 bg-[#216b41]" />
        </div>
      </section>

      <div className="tmnt-sewer-grate-divider h-12 w-full border-y border-[#bfc9be]/60 opacity-60" />
      <div className="flex flex-wrap items-center justify-between gap-6 bg-[#f1f5ee] px-5 py-4 md:px-20">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#216b41]" aria-hidden>
            verified
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
            Trusted from harbor to fogbank
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-8 opacity-70">
          <span className="text-2xl font-black italic text-[#181d19]" style={h}>
            Mission unit 01
          </span>
          <span className="text-2xl font-black italic text-[#181d19]" style={h}>
            Unit 02
          </span>
          <span className="text-2xl font-black italic text-[#181d19]" style={h}>
            Unit 03
          </span>
        </div>
      </div>

      <section className="bg-[#f7faf4] px-5 py-24 md:px-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="relative flex flex-col justify-between border border-[#bfc9be] bg-[#e6e9e3] p-8 md:col-span-8 tmnt-comic-panel-shadow">
            <div className="pointer-events-none absolute top-0 right-4 opacity-10">
              <span className="material-symbols-outlined text-[120px] text-[#216b41]" aria-hidden>
                format_quote
              </span>
            </div>
            <div>
              <div className="mb-6 flex gap-1 text-[#216b41]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                    star
                  </span>
                ))}
              </div>
              <p className="mb-8 text-2xl font-bold italic text-[#181d19]" style={h}>
                &ldquo;The crew arrived like a tactical unit and transformed our patio in three days. It&apos;s not just
                landscaping — it&apos;s structural excellence.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden border-2 border-[#216b41]">
                <Image
                  src={TMNT_IMAGES.v2TestimonialMark}
                  alt="Mark Stephenson"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                  Mark Stephenson
                </p>
                <p className="text-[#404941]">East Harbor docks — mission wrapped 2023 (demo)</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center border-l-4 border-[#225cb4] bg-[#72a2ff] p-8 md:col-span-4">
            <div className="mb-4">
              <span className="material-symbols-outlined text-4xl text-[#00377a]" aria-hidden>
                location_on
              </span>
            </div>
            <h3 className="mb-4 text-2xl font-bold uppercase text-[#00377a]" style={h}>
              Deployment statistics
            </h3>
            <div className="space-y-4">
              {[
                ["Success rate", "100%"],
                ["Units deployed", "14,000 sq ft"],
                ["Client rating", "4.9 / 5.0"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#00377a]/30 pb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#00377a]/80" style={label}>
                    {k}
                  </span>
                  <span className="text-xs font-bold uppercase text-[#00377a]" style={label}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#bfc9be] bg-[#ecefe9] p-6 md:col-span-4 tmnt-comic-panel-shadow">
            <div className="relative mb-6 h-48 w-full overflow-hidden border-b border-[#216b41] bg-[#e0e3dd]">
              <Image
                src={TMNT_IMAGES.v2TestimonialStone}
                alt="Macro of interlocking pavers"
                fill
                className="object-cover opacity-80 grayscale transition-all hover:grayscale-0"
                sizes="400px"
              />
              <div className="absolute bottom-2 left-2 bg-[#d8dbd5]/90 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                Field intel: unit_042
              </div>
            </div>
            <div className="mb-4 flex gap-1 text-[#216b41]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                  star
                </span>
              ))}
            </div>
            <p className="mb-6 italic text-[#404941]">
              &ldquo;Their attention to drainage and base preparation was impressive. Solid as a rock.&rdquo;
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#181d19]" style={label}>
              — Linda V., West Fogbank
            </p>
          </div>

          <div className="grid grid-cols-1 overflow-hidden border-t-4 border-[#ac3231] bg-[#e0e3dd] md:col-span-8 md:grid-cols-2">
            <div className="p-8">
              <div className="mb-6 inline-block border border-[#ac3231] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#ac3231]" style={label}>
                Verified mission report
              </div>
              <h4 className="mb-4 text-2xl font-bold uppercase text-[#181d19]" style={h}>
                Secured the perimeter
              </h4>
              <p className="mb-6 text-[#404941]">
                &ldquo;From quote to cleanup, the professionalism was intense. They don&apos;t just lay stones — they
                build legacies.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ac3231]" aria-hidden>
                  verified_user
                </span>
                <span className="text-sm font-bold uppercase tracking-widest text-[#181d19]" style={label}>
                  Reid residence, East Harbor
                </span>
              </div>
            </div>
            <div className="relative min-h-[200px]">
              <Image
                src={TMNT_IMAGES.v2TestimonialDrone}
                alt="Overhead view of patio and fire pit"
                fill
                className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
                sizes="50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center bg-[#f1f5ee] px-5 py-24 text-center">
        <h3 className="mb-8 text-3xl font-black uppercase tracking-tighter text-[#181d19] md:text-4xl" style={h}>
          Ready for deployment?
        </h3>
        <div className="flex flex-col gap-6 md:flex-row">
          <Link
            href={`${TMNT_BASE}/contact`}
            className="bg-[#216b41] px-12 py-4 text-2xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={h}
          >
            Start your mission
          </Link>
          <Link
            href={`${TMNT_BASE}/projects`}
            className="border-2 border-[#707a70] px-12 py-4 text-2xl font-bold text-[#181d19] transition-all hover:bg-[#e6e9e3] active:scale-95"
            style={h}
          >
            View recent intel
          </Link>
        </div>
      </section>
    </main>
  );
}
