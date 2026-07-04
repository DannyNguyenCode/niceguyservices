import Image from "next/image";
import Link from "next/link";
import { TMNT_BASE, TMNT_IMAGES } from "./tmntConfig";

const h = { fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" };
const label = { fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" };

export function TmntAboutBody() {
  return (
    <main className="overflow-x-hidden pb-24 md:pb-8">
      <section className="relative flex min-h-[480px] items-center overflow-hidden md:min-h-[618px]">
        <div className="absolute inset-0 z-0">
          <Image
            src={TMNT_IMAGES.v2AboutMissionHero}
            alt="Crew at a construction site at twilight"
            fill
            priority
            className="object-cover opacity-60 grayscale transition-all duration-700 hover:grayscale-0"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#f7faf4] via-[#f7faf4]/55 to-transparent" />
        </div>
        <div className="relative z-10 w-full px-5 md:px-20">
          <div className="max-w-4xl">
            <span
              className="mb-6 inline-block bg-[#216b41] px-2 py-1 text-xs font-bold uppercase tracking-widest text-white"
              style={label}
            >
              Established in the trenches
            </span>
            <h1 className="mb-6 text-4xl font-black uppercase text-[#181d19] md:text-6xl" style={h}>
              Built by blood.
              <br />
              Forged in stone.
            </h1>
            <p className="max-w-2xl text-lg text-[#404941]">
              Patchline Crew is not your garden-variety outfit — it is a tongue-in-cheek tactical trades demo where
              family loyalty meets stone-cold precision from harbor to fogbank (purely fictional yarn).
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden p-8 md:block">
          <div className="flex flex-col items-end border-r-4 border-[#216b41] pr-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#216b41]" style={label}>
              Operational areas
            </p>
            <p className="text-2xl font-bold text-[#181d19]" style={h}>
              Harbor + Fogbank
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-[#f1f5ee] py-24 px-5 md:px-20">
        <div className="tmnt-concrete-grain pointer-events-none absolute inset-0 opacity-25" aria-hidden />
        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="flex flex-col justify-center md:col-span-5">
            <h2 className="mb-8 text-3xl font-extrabold uppercase tracking-tight text-[#216b41] md:text-4xl" style={h}>
              The brotherhood
            </h2>
            <div className="space-y-6">
              <p className="text-[#181d19]">
                Started with a single shovel and a chip on our shoulder, this demo trades yarn is urban-ninja
                craftsmanship: every project treated like a high-stakes cartoon caper.
              </p>
              <p className="text-[#404941]">
                From sub-zero winters to dense urban sites, roots run deep and standards stay absolute.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-7">
            <div className="group relative overflow-hidden border-t-2 border-[#bfc9be] bg-[#e0e3dd] p-1">
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src={TMNT_IMAGES.v2AboutPrecision}
                  alt="Interlocking stones laid with precision"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="35vw"
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-[#216b41] px-4 py-3 text-white">
                <p className="text-xs font-bold uppercase tracking-widest" style={label}>
                  Mission 01: Precision
                </p>
              </div>
            </div>
            <div className="group relative mt-12 overflow-hidden border-t-2 border-[#bfc9be] bg-[#e0e3dd] p-1 md:mt-12">
              <div className="relative aspect-4/5 w-full overflow-hidden">
                <Image
                  src={TMNT_IMAGES.v2AboutLoyalty}
                  alt="Landscapers reviewing plans on site"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="35vw"
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-[#225cb4] px-4 py-3 text-white">
                <p className="text-xs font-bold uppercase tracking-widest" style={label}>
                  Mission 02: Loyalty
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7faf4] py-24">
        <div className="mb-16 px-5 text-center md:px-20">
          <h3 className="text-3xl font-extrabold uppercase text-[#181d19] md:text-4xl" style={h}>
            Operational excellence
          </h3>
          <div className="mx-auto mt-4 h-1 w-24 bg-[#216b41]" />
        </div>
        <div className="grid grid-cols-1 gap-6 px-5 md:grid-cols-3 md:px-20">
          {[
            {
              bg: "bg-[#ecefe9]",
              border: "border-l-4 border-[#ac3231]",
              icon: "eco",
              iconColor: "text-[#ac3231]",
              bar: "bg-[#ac3231]",
              title: "Eco-conscious",
              body: "Permeable pavers and sustainable excavation methods for long-term stewardship.",
              text: "text-[#404941]",
            },
            {
              bg: "bg-[#e6e9e3]",
              border: "border-l-4 border-[#216b41]",
              icon: "verified_user",
              iconColor: "text-[#216b41]",
              bar: "bg-[#216b41]",
              title: "Zero-incident safety",
              body: "Tactical awareness on every site — hazards mitigated, property protected.",
              text: "text-[#181d19]",
              scale: "md:scale-105 md:z-10 md:shadow-lg md:border md:border-[#bfc9be]/50",
            },
            {
              bg: "bg-[#d8e2ff]",
              border: "border-l-4 border-[#225cb4]",
              icon: "architecture",
              iconColor: "text-[#225cb4]",
              bar: "bg-[#225cb4]",
              title: "Elite groundwork",
              body: "Heavy-duty base preparation designed for extreme climate shifts.",
              text: "text-[#00377a]",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`flex flex-col items-start gap-4 p-8 ${card.bg} ${card.border} ${"scale" in card ? card.scale : ""}`}
            >
              <span className={`material-symbols-outlined text-4xl ${card.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                {card.icon}
              </span>
              <h4 className={`text-2xl font-bold ${card.iconColor}`} style={h}>
                {card.title}
              </h4>
              <p className={card.text}>{card.body}</p>
              <div className="mt-auto flex w-full gap-1 pt-4 opacity-30">
                <div className={`h-1 flex-1 ${card.bar}`} />
                <div className={`h-1 flex-1 ${card.bar}`} />
                <div className={`h-1 flex-1 ${card.bar}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-[#ecefe9] py-24 px-5 md:px-20">
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-1">
          {[
            { img: TMNT_IMAGES.v2AboutGalLeadership, label: "Leadership" },
            { img: TMNT_IMAGES.v2AboutGalPrecision, label: "Precision", offset: "md:translate-y-12" },
            { img: TMNT_IMAGES.v2AboutGalUnit, label: "The unit" },
            { img: TMNT_IMAGES.v2AboutGalCraft, label: "Craft", offset: "md:translate-y-12" },
          ].map((cell) => (
            <div key={cell.label} className={`group relative ${cell.offset ?? ""}`}>
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={cell.img}
                  alt=""
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  sizes="25vw"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-[#216b41]/25 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-black uppercase tracking-widest text-[#00391d]" style={label}>
                  {cell.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tmnt-diagonal-break-alt relative bg-[#e6e9e3] py-24">
        <div className="relative z-10 px-5 py-20 text-center md:px-20">
          <h3 className="mb-6 text-3xl font-extrabold uppercase text-[#216b41] md:text-4xl" style={h}>
            Ready to start the mission?
          </h3>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#404941]">
            Same elite standards on every square foot — connect for a quote or browse the gallery.
          </p>
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <Link
              href={`${TMNT_BASE}/contact`}
              className="bg-[#216b41] px-10 py-5 text-xs font-bold uppercase tracking-widest text-white transition-transform duration-300 hover:scale-105"
              style={label}
            >
              Request quote
            </Link>
            <Link
              href={`${TMNT_BASE}/projects`}
              className="border-2 border-[#216b41] px-10 py-5 text-xs font-bold uppercase tracking-widest text-[#216b41] transition-colors hover:bg-[#216b41]/10"
              style={label}
            >
              Our portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
