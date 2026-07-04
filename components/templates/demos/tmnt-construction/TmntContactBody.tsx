import Image from "next/image";
import Link from "next/link";
import { TMNT_BASE, TMNT_IMAGES } from "./tmntConfig";

const label = { fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" };
const h = { fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" };

export function TmntContactBody() {
  return (
    <main className="flex flex-col pb-28 md:pb-8">
      <section className="relative overflow-hidden bg-[#f1f5ee] px-5 py-16 md:px-20">
        <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-20" aria-hidden />
        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-0.5 w-12 bg-[#216b41]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#216b41]" style={label}>
              Operational status: ready
            </span>
          </div>
          <h1 className="mb-6 text-4xl font-black uppercase text-[#181d19] md:text-6xl" style={h}>
            Contact command
          </h1>
          <p className="max-w-2xl text-lg text-[#404941]">
            Demo dispatch desk — form is all hat and no cattle (non-functional). Phones and mailboxes below are
            placeholder fiction for this template preview.
          </p>
          <p className="mt-4 text-sm text-[#707a70]">
            Common questions? See the{" "}
            <Link href={`${TMNT_BASE}/faq`} className="text-[#216b41] underline underline-offset-4 hover:text-[#00522c]">
              tactical FAQ
            </Link>
            .
          </p>
        </div>
        <div className="tmnt-sewer-grate-divider relative z-10 mt-12 h-8 w-full opacity-40" />
      </section>

      <section className="grid grid-cols-1 gap-6 bg-[#f7faf4] px-5 py-12 lg:grid-cols-12 lg:items-start md:px-20">
        <div className="relative border border-[#bfc9be] bg-[#ecefe9] p-6 sm:p-8 lg:col-span-7">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold uppercase text-[#181d19]" style={h}>
            <span className="material-symbols-outlined text-[#216b41]" aria-hidden>
              description
            </span>
            Mission briefing
          </h2>
          <form className="space-y-4" action="#" method="get">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="tmnt-inner-glow-focus space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
                  Operative name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="FULL NAME"
                  autoComplete="name"
                  className="w-full border-0 border-b-2 border-[#bfc9be] bg-[#e6e9e3] px-2 py-2 text-sm text-[#181d19] placeholder:text-[#707a70] transition-all focus:border-[#216b41] focus:ring-0 focus:outline-none"
                />
              </div>
              <div className="tmnt-inner-glow-focus space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
                  Communication line
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="PHONE NUMBER"
                  autoComplete="tel"
                  className="w-full border-0 border-b-2 border-[#bfc9be] bg-[#e6e9e3] px-2 py-2 text-sm text-[#181d19] placeholder:text-[#707a70] transition-all focus:border-[#216b41] focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
            <div className="tmnt-inner-glow-focus space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
                Secure email
              </label>
              <input
                type="email"
                name="email"
                placeholder="EMAIL ADDRESS"
                autoComplete="email"
                className="w-full border-0 border-b-2 border-[#bfc9be] bg-[#e6e9e3] px-2 py-2 text-sm text-[#181d19] placeholder:text-[#707a70] transition-all focus:border-[#216b41] focus:ring-0 focus:outline-none"
              />
            </div>
            <div className="tmnt-inner-glow-focus space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
                Mission location
              </label>
              <input
                type="text"
                name="address"
                placeholder="PROJECT ADDRESS"
                autoComplete="street-address"
                className="w-full border-0 border-b-2 border-[#bfc9be] bg-[#e6e9e3] px-2 py-2 text-sm text-[#181d19] placeholder:text-[#707a70] transition-all focus:border-[#216b41] focus:ring-0 focus:outline-none"
              />
            </div>
            <div className="tmnt-inner-glow-focus space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
                Objective details
              </label>
              <textarea
                name="details"
                rows={3}
                placeholder="DESCRIBE THE SCOPE OF WORK..."
                className="min-h-0 w-full resize-y border-0 border-b-2 border-[#bfc9be] bg-[#e6e9e3] px-2 py-2 text-sm leading-snug text-[#181d19] placeholder:text-[#707a70] transition-all focus:border-[#216b41] focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-[#216b41] py-3 text-base font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_20px_rgba(33,107,65,0.2)] sm:text-lg"
              style={h}
            >
              Send dispatch <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="group relative overflow-hidden border-l-4 border-[#216b41] bg-[#e6e9e3] p-6">
            <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-0 transition-opacity group-hover:opacity-15" aria-hidden />
            <div className="relative z-10">
              <div className="mb-4 flex justify-between">
                <h3 className="text-2xl font-bold uppercase text-[#181d19]" style={h}>
                  East Harbor Annex
                </h3>
                <span className="bg-[#5fa777] px-2 py-1 text-[10px] font-bold uppercase text-[#00391d]" style={label}>
                  Active sector
                </span>
              </div>
              <div className="mb-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-1 text-[#216b41]" aria-hidden>
                    location_on
                  </span>
                  <p className="text-[#181d19]">
                    77 Cinder Pier,
                    <br />
                    East Harbor, EH 4K9 (fictional)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#216b41]" aria-hidden>
                    call
                  </span>
                  <a className="font-bold text-[#216b41] hover:underline" href="tel:+14165550199">
                    416-555-0199
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#216b41]" aria-hidden>
                    schedule
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
                    Hours: 0700 – 1900 EST
                  </p>
                </div>
              </div>
              <div className="relative mb-4 aspect-video w-full overflow-hidden bg-[#d8dbd5] grayscale">
                <Image
                  src={TMNT_IMAGES.v2ContactEastHarbor}
                  alt="Stylized city skyline (demo art)"
                  fill
                  className="object-cover opacity-70"
                  sizes="500px"
                />
                <div className="pointer-events-none absolute top-2 left-2 flex gap-1">
                  <div className="h-3 w-3 bg-[#216b41]" />
                  <div className="h-3 w-3 bg-[#225cb4]" />
                </div>
              </div>
              <button
                type="button"
                className="w-full border border-[#bfc9be] py-3 text-xs font-bold uppercase tracking-widest text-[#181d19] transition-colors hover:border-[#216b41]"
                style={label}
              >
                Emergency repair protocol
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden border-l-4 border-[#225cb4] bg-[#e6e9e3] p-6">
            <div className="pointer-events-none absolute inset-0 tmnt-stone-texture opacity-0 transition-opacity group-hover:opacity-15" aria-hidden />
            <div className="relative z-10">
              <div className="mb-4 flex justify-between">
                <h3 className="text-2xl font-bold uppercase text-[#181d19]" style={h}>
                  West Fogbank Yard
                </h3>
                <span className="bg-[#72a2ff] px-2 py-1 text-[10px] font-bold uppercase text-[#00377a]" style={label}>
                  Western sector
                </span>
              </div>
              <div className="mb-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-1 text-[#225cb4]" aria-hidden>
                    location_on
                  </span>
                  <p className="text-[#181d19]">
                    12 Quarry Switchback,
                    <br />
                    West Fogbank, WF 9Q2 (fictional)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#225cb4]" aria-hidden>
                    call
                  </span>
                  <a className="font-bold text-[#225cb4] hover:underline" href="tel:+17805550122">
                    780-555-0122
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#225cb4]" aria-hidden>
                    schedule
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#404941]" style={label}>
                    Hours: 0700 – 1900 MST
                  </p>
                </div>
              </div>
              <div className="relative mb-4 aspect-video w-full overflow-hidden bg-[#d8dbd5] grayscale">
                <Image
                  src={TMNT_IMAGES.v2ContactWestFogbank}
                  alt="Stylized western skyline (demo art)"
                  fill
                  className="object-cover opacity-70"
                  sizes="500px"
                />
                <div className="pointer-events-none absolute right-2 bottom-2 h-6 w-6 border-r-2 border-b-2 border-[#225cb4]" />
              </div>
              <button
                type="button"
                className="w-full border border-[#bfc9be] py-3 text-xs font-bold uppercase tracking-widest text-[#181d19] transition-colors hover:border-[#225cb4]"
                style={label}
              >
                Emergency repair protocol
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#216b41] px-5 py-20 text-white md:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-4 text-3xl font-extrabold uppercase md:text-4xl" style={h}>
            Ready for deployment?
          </h3>
          <p className="mb-8 text-lg opacity-90">
            Our fleet is on standby — book early for peak season. Fictional copy for this demo.
          </p>
          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <a
              href="tel:+14165550199"
              className="bg-white px-8 py-4 text-2xl font-bold uppercase tracking-tighter text-[#216b41] transition-all hover:brightness-110"
              style={h}
            >
              Call HQ now
            </a>
            <Link
              href={`${TMNT_BASE}/projects`}
              className="border-2 border-white px-8 py-4 text-2xl font-bold uppercase tracking-tighter text-white transition-all hover:bg-white hover:text-[#216b41]"
              style={h}
            >
              View portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
