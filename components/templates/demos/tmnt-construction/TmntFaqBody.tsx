import Image from "next/image";
import Link from "next/link";
import { TMNT_BASE, TMNT_IMAGES } from "./tmntConfig";

const h = { fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" };
const label = { fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" };

const FAQ_ACCENTS = [
  { num: "text-[#225cb4]", border: "border-[#225cb4]/30", hover: "group-hover:text-[#225cb4]" },
  { num: "text-[#ac3231]", border: "border-[#ac3231]/30", hover: "group-hover:text-[#ac3231]" },
  { num: "text-[#f96a65]", border: "border-[#f96a65]/30", hover: "group-hover:text-[#f96a65]" },
  { num: "text-[#6750a4]", border: "border-[#6750a4]/30", hover: "group-hover:text-[#6750a4]" },
] as const;

const FAQ_ITEMS: { num: string; q: string; a: string }[] = [
  {
    num: "01",
    q: "Winter ops: do you provide snow removal?",
    a: "Demo answer: winter operations can include commercial priority routes and equipment that protects finished stone. Real scope depends on your market and contract.",
  },
  {
    num: "02",
    q: "Mission duration: what is the design timeline?",
    a: "Design typically moves in phases over one to two weeks for residential work; build duration depends on scope, weather, and access. We will give you a written schedule at contract.",
  },
  {
    num: "03",
    q: "Tactical maintenance: how do I keep it looking elite?",
    a: "Periodic cleaning, joint sand checks, and sealing on a sensible cadence keep hardscapes sharp. We can recommend a maintenance rhythm for your specific materials.",
  },
  {
    num: "04",
    q: "Do you handle drainage and grading?",
    a: "Yes — proper grading and drainage are core to durable hardscapes. We plan water paths and integrate solutions like drains and swales where appropriate.",
  },
  {
    num: "05",
    q: "What materials do you specialize in?",
    a: "Concrete pavers, natural stone, and structural materials selected for freeze-thaw performance and the look you want — all demo narrative on this template.",
  },
  {
    num: "06",
    q: "Is there a lifetime warranty?",
    a: "Workmanship and manufacturer warranties vary by product line. A real contractor will document what is covered and for how long — this page is fictional.",
  },
  {
    num: "07",
    q: "How do you handle underground utilities?",
    a: "Locate requests and careful excavation practices reduce risk. On real jobs, licensed locates and documented clearance are mandatory before digging.",
  },
  {
    num: "08",
    q: "What is the typical cost per square foot?",
    a: "Costs depend on access, base depth, material, and pattern complexity. Expect a line-item quote after a site visit rather than a single number from a brochure.",
  },
  {
    num: "09",
    q: "Can you work with my existing landscape architect?",
    a: "Yes — we can coordinate with designers and engineers to execute plans faithfully and flag constructability issues early.",
  },
];

export function TmntFaqBody() {
  return (
    <main className="min-h-screen overflow-x-hidden pb-28 md:pb-8">
      <section className="relative overflow-hidden border-b-4 border-[#e0e3dd] bg-[#d8dbd5] py-20 px-5 md:px-20">
        <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-25" aria-hidden />
        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1 w-12 bg-[#216b41]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
              Mission intel
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-black uppercase leading-none text-[#181d19] md:text-6xl" style={h}>
            Frequently asked <span className="text-[#216b41]">operations</span>
          </h1>
          <p className="max-w-2xl text-lg text-[#404941]">
            Direct answers for homeowners who value precision — demo copy only; not legal or contractual advice.
          </p>
        </div>
        <div className="pointer-events-none absolute top-0 right-0 hidden w-1/3 opacity-15 md:block">
          <div className="relative min-h-[280px] w-full">
            <Image
              src={TMNT_IMAGES.v2FaqHero}
              alt=""
              fill
              className="object-cover grayscale mix-blend-multiply"
              sizes="33vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f7faf4] px-5 py-16 md:px-20">
        <div className="tmnt-sewer-grate-divider mb-16 h-1 w-full opacity-40" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="space-y-6 lg:col-span-4">
            <div className="group relative overflow-hidden border-l-4 border-[#216b41] bg-[#f1f5ee] p-8">
              <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-30" aria-hidden />
              <span className="relative z-10 mb-4 block text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
                Status: ready
              </span>
              <h2 className="relative z-10 mb-4 text-2xl font-bold uppercase text-[#181d19]" style={h}>
                Urgent inquiry?
              </h2>
              <p className="relative z-10 mb-6 text-[#404941]">
                Command center hours are a demo conceit — on a real site, call or email your contractor directly.
              </p>
              <a
                href="tel:+14165550199"
                className="relative z-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#216b41] hover:underline"
                style={label}
              >
                <span className="material-symbols-outlined text-sm">call</span>
                416-555-0199
              </a>
            </div>
            <div className="relative border-l-4 border-[#00522c] bg-[#5fa777] p-8">
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="h-2 w-2 bg-[#00391d]" />
                <div className="h-2 w-2 bg-[#00391d]/50" />
              </div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#00391d]" style={label}>
                Quick estimate
              </h3>
              <p className="text-[#00391d]/90">Most residential quotes finalize after a site walk — not from a chatbot.</p>
            </div>
          </aside>

          <div className="space-y-4 lg:col-span-8">
            {FAQ_ITEMS.map((item, index) => {
              const accent = FAQ_ACCENTS[index % FAQ_ACCENTS.length];
              return (
                <div key={item.num} className="overflow-hidden border-t border-[#bfc9be] bg-[#ecefe9]">
                  <details className="group" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between p-6 hover:bg-[#e6e9e3] [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-4">
                        <span className={`text-xs font-bold uppercase tracking-widest ${accent.num}`} style={label}>
                          {item.num}
                        </span>
                        <h3
                          className={`text-lg font-bold uppercase text-[#181d19] md:text-xl ${accent.hover}`}
                          style={h}
                        >
                          {item.q}
                        </h3>
                      </div>
                      <span className={`material-symbols-outlined shrink-0 transition-transform group-open:rotate-180 ${accent.num}`}>
                        expand_more
                      </span>
                    </summary>
                    <div className={`border-l-2 ${accent.border} px-6 pb-8 pl-14 text-[#404941] md:px-16 md:pl-24`}>{item.a}</div>
                  </details>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t-2 border-[#216b41] bg-[#e0e3dd] py-20 px-5 md:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-extrabold uppercase text-[#181d19] md:text-4xl" style={h}>
            Ready to deploy?
          </h2>
          <div className="flex flex-col justify-center gap-6 md:flex-row">
            <Link
              href={`${TMNT_BASE}/contact`}
              className="bg-[#216b41] px-10 py-5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_20px_rgba(33,107,65,0.2)]"
              style={label}
            >
              Start consultation
            </Link>
            <Link
              href={`${TMNT_BASE}/projects`}
              className="border-2 border-[#707a70] px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#181d19] transition-all hover:bg-[#ecefe9]"
              style={label}
            >
              View portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
