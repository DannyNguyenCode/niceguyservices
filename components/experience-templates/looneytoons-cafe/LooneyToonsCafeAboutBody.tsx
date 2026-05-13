import Image from "next/image";
import Link from "next/link";
import { LOONEYTOONS_CAFE_BASE } from "./looneytoonsCafeConfig";
import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";

const BASE = LOONEYTOONS_CAFE_BASE;

export function LooneyToonsCafeAboutBody() {
  return (
    <main className="overflow-x-hidden bg-[#f9f9ff] text-[#151c28] selection:bg-[#495E84] selection:text-white">
      <section className="relative overflow-hidden bg-[#dde2f4] px-4 pb-40 pt-20 md:px-16">
        <div className="lt-halftone-bg pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <div className="lt-speech-bubble mb-6 inline-block px-4 py-1 shadow-[6px_6px_0px_0px_#000000]">
              <span className="text-sm font-bold uppercase [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Since 2024
              </span>
            </div>
            <h1 className="mb-8 font-extrabold leading-[0.9] text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-5xl md:text-[84px] md:leading-[90px]">
              The art of <span className="italic text-[#495E84]">crafted</span> calm.
            </h1>
            <p className="max-w-md text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              At Comet Cup Co., our mission is simple yet powerful: to provide a refined haven where artisanal coffee meets
              tall tales and tall stacks of pancakes (demo fiction).
            </p>
          </div>
          <div className="relative">
            <div className="lt-retro-tv-mask relative aspect-4/3 bg-[#f9f9ff] shadow-[6px_6px_0px_0px_#000000]">
              <Image
                src={LT_CAFE_IMAGES.aboutHero}
                alt="Cafe interior"
                fill
                className="object-cover grayscale contrast-125"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 flex h-32 w-32 rotate-12 items-center justify-center rounded-full border-4 border-[#151c28] bg-[#495E84] shadow-[6px_6px_0px_0px_#000000]">
              <span className="material-symbols-outlined text-5xl text-white" aria-hidden>
                coffee
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block h-[100px] w-full" preserveAspectRatio="none" viewBox="0 0 1200 120" aria-hidden>
            <path
              fill="#f9f9ff"
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.32,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            />
          </svg>
        </div>
      </section>

      <section className="bg-[#f9f9ff] px-4 py-24 md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <h2 className="mb-16 text-center font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
            Our <span className="italic text-[#495E84]">timeline</span>
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "The Spark",
                body: "Founded on the belief that coffee is more than a drink—it is a shared ritual of pause and connection.",
                bg: "bg-[#f1f3ff]",
              },
              {
                n: "02",
                title: "The Roast",
                body: "Sourcing only the finest Arabica beans, we perfected our signature roast that balances bold and smooth.",
                bg: "bg-[#495E84] text-white",
                dim: "text-[#dde2f4]",
              },
              {
                n: "03",
                title: "The Local",
                body: "Opening our doors on Inkwell Pier, creating a sanctuary for Rubberhose coffee daydreamers.",
                bg: "bg-[#f1f3ff]",
              },
            ].map((c) => (
              <div
                key={c.n}
                className={`lt-comic-panel border-4 border-[#151c28] p-8 shadow-[6px_6px_0px_0px_#000000] transition-transform hover:scale-95 ${c.bg}`}
              >
                <div className={`mb-4 text-5xl font-extrabold ${c.dim ?? "text-[#495E84]"}`}>{c.n}</div>
                <h3 className="mb-4 font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-3xl">
                  {c.title}
                </h3>
                <p className={`text-base [font-family:var(--font-lt-space),system-ui,sans-serif] ${c.bg.includes("495") ? "opacity-90" : "text-[#444748]"}`}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f1f3ff] px-4 py-24 md:px-16">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 md:grid-cols-4">
          <div className="flex flex-col justify-center border-4 border-[#151c28] bg-white p-12 shadow-[6px_6px_0px_0px_#000000] md:col-span-2">
            <h2 className="mb-6 font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
              Unwind, connect, <br />
              and <span className="italic text-[#495E84]">savor.</span>
            </h2>
            <p className="text-lg text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Every cup we serve is a testament to our dedication to quality. We invite you to linger over the aroma of
              freshly ground beans and find your moment of peace in our bustling rubberhose borough.
            </p>
          </div>
          <div className="lt-retro-tv-mask relative h-[400px] border-4 border-[#151c28] shadow-[6px_6px_0px_0px_#000000] md:col-span-2">
            <Image src={LT_CAFE_IMAGES.aboutLattes} alt="Two lattes" fill className="object-cover" sizes="50vw" />
          </div>
          <div className="flex aspect-square flex-col items-center justify-center rounded-full border-4 border-[#151c28] bg-[#495E84] p-6 text-center text-white shadow-[6px_6px_0px_0px_#000000] md:col-span-1">
            <span className="material-symbols-outlined mb-2 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
              eco
            </span>
            <span className="text-sm font-bold uppercase tracking-widest [font-family:var(--font-lt-space),system-ui,sans-serif]">
              100% Sustainable
            </span>
          </div>
          <div className="flex items-center gap-8 rounded-[40px] border-4 border-[#151c28] bg-[#151c28] p-12 text-[#f9f9ff] shadow-[6px_6px_0px_0px_#000000] md:col-span-3">
            <div className="hidden h-32 w-32 shrink-0 rounded-full border-4 border-[#495E84] bg-[#2a303e] md:flex md:items-center md:justify-center">
              <span className="material-symbols-outlined text-4xl text-[#495E84]" aria-hidden>
                public
              </span>
            </div>
            <div>
              <h4 className="mb-2 font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-3xl">Arabica sourcing</h4>
              <p className="text-base opacity-80 [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Our exclusive beans are hand-selected from micro-lots to ensure every sip tells a story of honest origin
                and simple perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f9f9ff] px-4 py-24 md:px-16">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="lt-retro-tv-mask relative aspect-square border-4 border-[#151c28] shadow-[6px_6px_0px_0px_#000000]">
              <Image src={LT_CAFE_IMAGES.location} alt="Storefront" fill className="object-cover grayscale" sizes="50vw" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="mb-8 font-bold leading-tight [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
              Situated in the middle of{" "}
              <span className="italic text-[#495E84] underline decoration-4">Inkwell Pier Arcade.</span>
            </h2>
            <p className="mb-8 text-lg text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              We chose Inkwell Pier for its kinetic energy and architectural charm — the perfect backdrop for our artisanal
              sanctuary (all smoke and mirrors in this demo).
            </p>
            <div className="flex gap-4">
              <Link
                href={`${BASE}/menu`}
                className="rounded-full border-2 border-[#151c28] bg-[#495E84] px-8 py-4 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                View menu
              </Link>
              <button
                type="button"
                className="rounded-full border-2 border-[#151c28] bg-[#f9f9ff] px-8 py-4 text-sm font-bold text-[#151c28] shadow-[4px_4px_0px_0px_#000000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                View map (demo)
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-10 right-10 h-1 w-40 rotate-12 bg-[#151c28] opacity-10" aria-hidden />
        <div className="absolute top-14 right-8 h-1 w-60 rotate-12 bg-[#151c28] opacity-10" aria-hidden />
      </section>

      <section className="border-y-4 border-[#151c28] bg-[#dde2f4] py-20">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-12 px-4 md:grid-cols-4 md:px-16">
          {[
            { icon: "public", label: "Direct trade" },
            { icon: "water_drop", label: "Pure filtration" },
            { icon: "recycling", label: "Zero waste path" },
            { icon: "handshake", label: "Community first" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#151c28] bg-white shadow-[6px_6px_0px_0px_#000000]">
                <span className="material-symbols-outlined text-3xl text-[#495E84]" aria-hidden>
                  {s.icon}
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest [font-family:var(--font-lt-space),system-ui,sans-serif]">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-[#f9f9ff] px-4 py-24 md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-16 text-center">
            <h2 className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
              Simple &amp; <span className="italic text-[#495E84]">honest.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Witness the kinetic energy of our space—a blend of high-end design and vibrant life.
            </p>
          </div>
          <div className="relative mx-auto max-w-4xl">
            <div className="lt-retro-tv-mask relative border-[6px] border-[#151c28] bg-[#e9edff] shadow-[6px_6px_0px_0px_#000000]">
              <Image
                src={LT_CAFE_IMAGES.aboutWideInterior}
                alt="Wide cafe interior"
                width={1200}
                height={675}
                className="aspect-video w-full object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
              <div className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-[#151c28]/20 transition-colors hover:bg-transparent">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#151c28] bg-[#495E84] shadow-[6px_6px_0px_0px_#000000] transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-6xl text-white" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                    play_arrow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
