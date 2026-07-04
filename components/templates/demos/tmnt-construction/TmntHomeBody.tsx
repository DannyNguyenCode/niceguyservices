import Image from "next/image";
import Link from "next/link";
import { TMNT_BASE, TMNT_IMAGES } from "./tmntConfig";

const h = { fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" };
const label = { fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" };

export function TmntHomeBody() {
  return (
    <main>
      {/* Cinematic hero — Built Like Family */}
      <section className="relative flex h-[min(795px,90dvh)] min-h-[520px] items-center justify-start overflow-hidden md:h-[795px]">
        <div className="absolute inset-0 z-0">
          <Image
            src={TMNT_IMAGES.v2HomeHero}
            alt="Luxury stone interlocking driveway at dusk with dramatic lighting"
            fill
            priority
            className="object-cover brightness-[0.65] contrast-110"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#f7faf4] via-[#f7faf4]/45 to-transparent" />
        </div>
        <div className="relative z-10 max-w-5xl px-5 md:px-20">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="bg-[#216b41] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
              style={label}
            >
              Mission ready
            </span>
            <div className="h-0.5 w-12 bg-[#216b41]" />
          </div>
          <h1
            className="mb-6 text-4xl font-black uppercase leading-none text-[#181d19] md:text-6xl lg:text-7xl"
            style={h}
          >
            Built Like <span className="text-[#216b41]">Family.</span>
            <br />
            Crafted Like <span className="text-[#216b41]">Artists.</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-[#404941]">
            When the going gets tough, the tough get paving — a cinematic trades demo with interlock swagger, stone
            muscle, and yarn spun thicker than pea soup fog (no real job sites here).
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href={`${TMNT_BASE}/contact`}
              className="border-2 border-[#216b41] bg-[#216b41] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_20px_rgba(33,107,65,0.25)]"
              style={label}
            >
              Commence project
            </Link>
            <Link
              href={`${TMNT_BASE}/projects`}
              className="border-2 border-[#216b41] bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#216b41] transition-all hover:bg-[#a8f3bd]/30"
              style={label}
            >
              View operations
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 right-5 hidden gap-12 border-l-2 border-[#216b41] pl-8 lg:flex md:right-20">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
              Sector 01
            </p>
            <p className="text-2xl font-bold text-[#181d19]" style={h}>
              East Harbor
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
              Sector 02
            </p>
            <p className="text-2xl font-bold text-[#181d19]" style={h}>
              West Fogbank
            </p>
          </div>
        </div>
      </section>

      {/* Core capabilities bento */}
      <section className="relative overflow-hidden bg-[#ffffff] py-24 px-5 md:px-20">
        <div className="pointer-events-none absolute inset-0 tmnt-stone-texture-v2 opacity-30" aria-hidden />
        <div className="relative z-10 mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-3xl font-extrabold uppercase text-[#181d19] md:text-4xl" style={h}>
              Core capabilities
            </h2>
            <p className="mt-2 text-[#404941]">Elite specialized services for high-impact properties.</p>
          </div>
          <div className="flex gap-2">
            <span className="h-1 w-12 bg-[#216b41]" />
            <span className="h-1 w-4 bg-[#225cb4]/50" />
            <span className="h-1 w-4 bg-[#ac3231]/50" />
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="group relative h-[400px] overflow-hidden border border-[#bfc9be] bg-[#ecefe9] md:col-span-8">
            <Image
              src={TMNT_IMAGES.v2HomeBentoLarge}
              alt="Aligned granite pavers with uniform joints"
              fill
              className="object-cover opacity-75 grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              sizes="(min-width: 768px) 66vw, 100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#ecefe9] via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex gap-1 text-[#216b41]">
              <span className="material-symbols-outlined text-sm" aria-hidden>
                add
              </span>
              <span className="material-symbols-outlined text-sm text-[#225cb4]" aria-hidden>
                add
              </span>
            </div>
            <div className="absolute bottom-0 left-0 p-8">
              <div className="mb-2 flex items-center gap-4">
                <span className="h-8 w-1 bg-[#225cb4]" />
                <h3 className="text-2xl font-bold uppercase text-[#181d19]" style={h}>
                  Driveway reinforcement
                </h3>
              </div>
              <p className="max-w-md text-[#404941]">
                Our interlock shield approach targets no shifting or weeds for years. Built for heavy-duty vehicular
                traffic.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between border border-[#216b41] bg-[#a8f3bd] p-8 md:col-span-4">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-5xl text-[#216b41]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                construction
              </span>
              <h3 className="text-2xl font-bold uppercase text-[#00391d]" style={h}>
                Excavation force
              </h3>
              <p className="text-[#404941]">
                We engineer sub-base foundations that survive harsh freeze-thaw cycles in Alberta and Ontario.
              </p>
            </div>
            <Link
              href={`${TMNT_BASE}/contact`}
              className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#216b41] transition-transform hover:translate-x-2"
              style={label}
            >
              Deploy team <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="group border border-[#bfc9be] bg-[#e6e9e3] p-6 transition-colors hover:bg-[#e0e3dd] md:col-span-4">
            <div className="mb-6 flex justify-between">
              <span className="material-symbols-outlined text-3xl text-[#225cb4]" aria-hidden>
                layers
              </span>
              <span className="border border-[#225cb4] px-2 py-1 text-xs font-bold uppercase tracking-widest text-[#225cb4]" style={label}>
                Masonry
              </span>
            </div>
            <h4 className="mb-2 text-2xl font-bold uppercase text-[#181d19]" style={h}>
              Retaining walls
            </h4>
            <p className="text-[#404941]">Structural verticality designed for aesthetics and drainage.</p>
          </div>
          <div className="group border border-[#bfc9be] bg-[#e6e9e3] p-6 transition-colors hover:bg-[#e0e3dd] md:col-span-4">
            <div className="mb-6 flex justify-between">
              <span className="material-symbols-outlined text-3xl text-[#a05000]" aria-hidden>
                light_mode
              </span>
              <span className="border border-[#a05000] px-2 py-1 text-xs font-bold uppercase tracking-widest text-[#a05000]" style={label}>
                Systems
              </span>
            </div>
            <h4 className="mb-2 text-2xl font-bold uppercase text-[#181d19]" style={h}>
              Tactical lighting
            </h4>
            <p className="text-[#404941]">Integrated low-voltage systems that define your perimeter with style.</p>
          </div>
          <div className="group border border-[#bfc9be] bg-[#e6e9e3] p-6 transition-colors hover:bg-[#e0e3dd] md:col-span-4">
            <div className="mb-6 flex justify-between">
              <span className="material-symbols-outlined text-3xl text-[#ac3231]" aria-hidden>
                water_damage
              </span>
              <span className="border border-[#ac3231] px-2 py-1 text-xs font-bold uppercase tracking-widest text-[#ac3231]" style={label}>
                Protect
              </span>
            </div>
            <h4 className="mb-2 text-2xl font-bold uppercase text-[#181d19]" style={h}>
              Aqua management
            </h4>
            <p className="text-[#404941]">Advanced grading and drainage to eliminate pooling.</p>
          </div>
        </div>
      </section>

      {/* Brotherhood */}
      <section className="grid grid-cols-1 items-center gap-20 bg-[#f7faf4] py-24 px-5 lg:grid-cols-2 md:px-20">
        <div className="relative">
          <div className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 border-t-4 border-l-4 border-[#216b41]/30" aria-hidden />
          <Image
            src={TMNT_IMAGES.v2HomeBrotherhood}
            alt="Landscaping craftsmen standing together on a finished patio"
            width={720}
            height={720}
            className="aspect-square w-full border-4 border-[#bfc9be] object-cover grayscale brightness-90 contrast-110"
          />
          <div className="absolute -bottom-5 -right-5 max-w-xs border-2 border-[#216b41] bg-[#a8f3bd] p-8 md:bottom-[-20px] md:right-[-20px]">
            <p className="mb-2 text-2xl font-bold text-[#00391d]" style={h}>
              15+ years
            </p>
            <p className="text-[#404941]">Of elite field operations in harsh Canadian winters.</p>
          </div>
        </div>
        <div>
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
            The brotherhood oath
          </span>
          <h2 className="mb-8 text-3xl font-extrabold uppercase leading-tight text-[#181d19] md:text-4xl" style={h}>
            Loyalty to the <span className="text-[#216b41]">stone</span>, integrity to the{" "}
            <span className="text-[#216b41]">client.</span>
          </h2>
          <p className="mb-10 text-lg text-[#404941]">
            We aren&apos;t a revolving door of subcontractors. We are a brotherhood of craftsmen who treat your
            property like our own mission HQ. Our reputation is built on precision and pride in the work.
          </p>
          <div className="space-y-6">
            {[
              {
                icon: "verified_user",
                border: "border-[#216b41]",
                title: "Elite specialists",
                body: "Every lead has deep hours in hardscaping and site leadership.",
              },
              {
                icon: "handyman",
                border: "border-[#225cb4]",
                title: "Tactical gear",
                body: "Industrial-grade compaction and diamond-blade precision on every deployment.",
              },
              {
                icon: "family_restroom",
                border: "border-[#6750a4]",
                title: "Family owned",
                body: "No corporate fluff. Direct, honest communication from quote to closeout.",
              },
            ].map((row) => (
              <div key={row.title} className="flex items-start gap-4">
                <div className={`rounded-full border bg-[#ecefe9] p-2 ${row.border}`}>
                  <span className="material-symbols-outlined text-[#216b41]" aria-hidden>
                    {row.icon}
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-xs font-bold uppercase tracking-widest text-[#181d19]" style={label}>
                    {row.title}
                  </h4>
                  <p className="text-[#404941]">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative mx-5 my-24 overflow-hidden border border-[#216b41] bg-[#216b41] p-12 text-white md:mx-20 md:p-20">
        <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 skew-x-12 translate-x-20 bg-white/10" aria-hidden />
        <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="mb-4 text-4xl font-black uppercase leading-none md:text-5xl" style={h}>
              Ready to secure
              <br />
              your perimeter?
            </h2>
            <p className="max-w-xl text-lg font-medium text-white/90">
              Strike while the iron is hot — ping the demo desk for a faux quote. Every digit below is smoke and
              mirrors for this preview.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 md:w-auto">
            <Link
              href={`${TMNT_BASE}/contact`}
              className="flex items-center justify-center gap-3 bg-white px-12 py-6 text-2xl font-bold uppercase tracking-wider text-[#216b41] transition-all hover:bg-[#a8f3bd] hover:text-[#00391d] hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
              style={h}
            >
              Get a quote <span className="material-symbols-outlined font-black">arrow_forward</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 md:justify-start">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white" style={label}>
                <span className="material-symbols-outlined text-sm">call</span>
                East Harbor: 416-555-0199
              </span>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white" style={label}>
                <span className="material-symbols-outlined text-sm">call</span>
                West Fogbank: 780-555-0122
              </span>
            </div>
          </div>
        </div>
      </section>

      <Link
        href={`${TMNT_BASE}/contact`}
        className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#f7faf4] bg-[#216b41] text-white shadow-2xl transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(33,107,65,0.35)] active:scale-95 md:bottom-12 md:right-12"
        aria-label="Start a quote"
      >
        <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
          add_task
        </span>
      </Link>
    </main>
  );
}
