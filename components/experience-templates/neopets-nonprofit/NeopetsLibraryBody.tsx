import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const ARTICLE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAqyezjJ12FamwNxIMcu8tC_ssmKEmY8n57maxV79R77EWFNE2xaP4W6I-eGCi6mdQjEB6k0TEs6iN1J91hmtjErARSwmgZudW8b0-mA7doAwYWSepvwC2kxTykd24oWO5vKRRwWRxxtjo82TflnQtAz8Yp9alLfxtLOvsufDaITLXoARoiBv5bBwmlYZLUaOwvIxLVJdwYCUHU45ul-RcoY8JQtyn2czTXE1vq44DYImZaYDP7Ol-Mj0Vb0bmxZWJDih1KEXuwmNIN";

const CATEGORIES = [
  { label: "Pet 101", icon: "star", className: "bg-[#adf19e] border-[#2e6b29] text-[#326f2d]" },
  { label: "Meds", icon: "medication", className: "bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]" },
  { label: "Illness", icon: "coronavirus", className: "bg-[#f0e7db] border-[#c0c7cf] text-[#40484e]" },
  { label: "Training", icon: "sports_soccer", className: "bg-[#8fd3ff] border-[#0d658c] text-[#005c80]" },
  { label: "Diet", icon: "restaurant", className: "bg-[#ffe089] border-[#745b00] text-[#574400]" },
  { label: "Remedies", icon: "healing", className: "bg-[#b0f4a1] border-[#2e6b29] text-[#135212]" },
  { label: "Safety", icon: "health_and_safety", className: "bg-[#ba1a1a] border-[#ba1a1a] text-white" },
] as const;

export function NeopetsLibraryBody() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-12 md:px-16">
      <section className="relative mb-16 text-center md:text-left">
        <div className="mb-6 inline-flex items-center rounded-full bg-[#8fd3ff] px-4 py-2 text-sm font-semibold text-[#005c80] shadow-sm">
          <span className="material-symbols-outlined mr-2 text-sm">auto_stories</span>
          PetCare Encyclopedia v2.0
        </div>
        <h2
          className="mb-4 text-5xl font-bold leading-tight text-[#0d658c]"
          style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
        >
          Toronto Pet Resource Hub
        </h2>
        <p className="max-w-2xl text-lg text-[#40484e]">
          The ultimate handbook for every guardian. Browse our guide to keep companions happy, healthy, and thriving.
        </p>
      </section>

      <section className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            type="button"
            className={`np-pressable-btn flex flex-col items-center gap-2 rounded-2xl border-2 p-4 ${c.className}`}
          >
            <span className="material-symbols-outlined text-3xl transition-transform group-hover:scale-110">
              {c.icon}
            </span>
            <span className="text-sm font-semibold">{c.label}</span>
          </button>
        ))}
      </section>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="flex w-full flex-col gap-6 lg:w-1/3">
          <div className="rounded-[24px] border-2 border-[#ebe1d5] bg-[#fcf2e6] p-6 shadow-sm">
            <h3
              className="mb-4 text-2xl font-semibold text-[#745b00]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Quick Search
            </h3>
            <div className="relative mb-6">
              <input
                type="search"
                placeholder="Search the archives..."
                className="w-full rounded-full border-2 border-[#c0c7cf] bg-white py-3 pl-12 pr-4 text-base shadow-inner outline-none transition-all focus:border-[#0d658c]"
                aria-label="Search resources"
              />
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-3.5 text-[#70787f]">
                search
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center rounded-[24px] bg-[#ba1a1a] p-6 text-center text-white shadow-[0_4px_0_0_#93000a]">
            <span className="material-symbols-outlined mb-3 text-5xl">emergency_share</span>
            <h3 className="mb-2 text-2xl font-semibold uppercase">24/7 Helpline</h3>
            <p className="mb-4 text-base opacity-90">For toxic ingestion or severe injury, contact emergency vets.</p>
            <button type="button" className="np-pressable-btn rounded-full border border-[#ffdad6] bg-white px-6 py-2 font-bold text-[#ba1a1a] shadow-md">
              Call (416) 555-0199
            </button>
          </div>
        </aside>

        <div className="grid w-full grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:w-2/3">
          <div className="np-pokedex-card flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_8px_0_0_rgba(13,101,140,0.05)]">
            <div className="relative h-48 w-full">
                <Image src={ARTICLE} alt="Golden retriever puppy in a bright living room" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
              <div className="absolute left-4 top-4">
                <span className="flex items-center gap-1 rounded-lg bg-[#adf19e] px-3 py-1 text-xs font-bold text-[#326f2d] shadow-sm">
                  <span className="material-symbols-outlined text-sm">verified</span> NEW
                </span>
              </div>
            </div>
            <div className="flex flex-grow flex-col p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#745b00]">restaurant</span>
                <span className="text-sm font-semibold uppercase tracking-widest text-[#745b00]">Diet</span>
              </div>
              <h4
                className="mb-2 text-2xl font-semibold text-[#1f1b14]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                The Golden Guide to Treats
              </h4>
              <p className="mb-6 flex-grow text-base text-[#40484e]">
                Which kitchen scraps are safe — and which to keep away from curious noses.
              </p>
              <div className="flex items-center justify-between border-t border-[#ebe1d5] pt-4">
                <span className="text-sm font-semibold text-[#2e6b29]">Beginner · 5 min</span>
                <span className="material-symbols-outlined text-2xl text-[#0d658c]">arrow_forward</span>
              </div>
            </div>
          </div>

          <div className="np-pokedex-card flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#c0c7cf] bg-[#f6ece1] p-12 text-center opacity-75">
            <span className="material-symbols-outlined mb-4 text-6xl text-[#70787f]">lock</span>
            <h4 className="mb-2 text-2xl font-semibold text-[#40484e]">Seasonal Safety Guide</h4>
            <p className="text-base text-[#70787f]">Unlocking this winter resource in December.</p>
            <button type="button" className="mt-4 rounded-full bg-[#c0c7cf] px-6 py-2 font-bold text-[#40484e]">
              Notify Me
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[#40484e]">
        Lost a pet? Head to{" "}
        <Link href={NEOPETS_PATHS.adventure} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Lost &amp; Found
        </Link>
        .
      </p>
    </main>
  );
}
