import { LooneyToonsMenuOrderSection } from "./LooneyToonsMenuOrderSection";

export function LooneyToonsCafeMenuBody() {
  return (
    <main className="min-h-screen bg-[#f9f9ff] text-[#151c28] selection:bg-[#495E84] selection:text-white">
      <section className="relative overflow-hidden bg-[#e9edff] px-4 py-16 md:px-16">
        <div className="relative z-10 mx-auto max-w-[1280px] text-center md:text-left">
          <h1 className="mb-4 font-extrabold uppercase italic text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10 md:text-[84px] md:leading-[90px] md:tracking-[-0.04em]">
            Crafted &amp; Kinetic
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif] md:mx-0">
            Premium artisanal coffee meets mid-century kinetic energy. Explore our curated menu of high-contrast
            flavors.
          </p>
          <div className="relative inline-block">
            <div className="pointer-events-none absolute inset-0 translate-x-1 translate-y-1 rounded-full bg-black" aria-hidden />
            <a
              href="#order"
              className="relative inline-block rounded-full border-2 border-black bg-[#495E84] px-8 py-4 text-lg font-bold text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              View specials
            </a>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full border-[12px] border-[#151c28] opacity-10" aria-hidden />
      </section>

      <div className="relative h-20 bg-[#e9edff]">
        <div className="absolute inset-0 rounded-t-[100px] border-t-4 border-[#151c28] bg-[#f9f9ff]" />
      </div>

      <section id="order" className="scroll-mt-24 bg-[#f9f9ff] px-4 py-12 md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-16 flex flex-col items-end justify-between gap-4 md:flex-row">
            <div>
              <span className="mb-4 inline-block rounded-full border-2 border-black bg-[#495E84] px-3 py-1 text-xs font-bold text-white">
                The roasts
              </span>
              <h2 className="font-bold text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
                Signature brews
              </h2>
            </div>
            <div className="flex gap-2 opacity-50">
              <span className="material-symbols-outlined text-4xl text-[#444748]" aria-hidden>
                coffee
              </span>
              <span className="material-symbols-outlined text-4xl text-[#444748]" aria-hidden>
                bolt
              </span>
            </div>
          </div>

          <LooneyToonsMenuOrderSection />
        </div>
      </section>
    </main>
  );
}
