import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB61Ipjxgajm18AChxAE8IBK9a_Mh8HROSc2c5OlO8KU2p9Q2hil6Lm8EHnnlqb-A0-uxJoXsr7raOQd5Yj93yKRlhyIiJYfH5Jo4wT_RYzR4Q3UQs7QLRfXrL15VMA__IWshq-OdoUDNMoWRtsK1Edv0mk0MRCvPO6mrkB9eW7PcpLeCKLNhRXiqUSgRRMVEr3ompXuZQwGemjPqec1SoNf23_gQYUAu7PYkyby9Tu46OwnWpQKVWP2oyowqT9mQG3L8IaL4VuiBXm";

const BEAGLE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAzblqyUoqIZt7oh2DTCWVYaHGyXcneYx-PpkkuzLRDYKFkI6rnvSLkbw3W4zUGAc3TD29hOFWjmBE1WgD0Q96E-mqRJA5OdAhhZhSzilS8bf7rVDUHpt_UYL3Pe4suAfahnmwJSaukAF2TB8L3FORXWuDtef5ijSgdcFVNqAptlf-69Qd8sQTs23JGo4n_YRrj0ezTePrSgAHBllZsqnlSJJR71YJfC7HrFKCN1sjYExGS0QtiMBiWzLlKlrqgWCjg7zs4GCnbuev3";

const TABBY =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDqFsaDIbsfcvY0gvO4T8eQ-NXHR6SdQdQp3Wlg5V-geXiSuXSracYSjO-DR3qUbxPWg95VJ5L9UYi4v1Y91gIpCnvr9btgzmMInhL0dFT6bsgXc2Ve2HmS_tsswXcBeDR4nUFratnSZ-D0rsijlaDGvnYlysUifSAcHiU9t22KTCnxov29d1BkLQ1mmzRk5gj06qDvh1PI2vHkFV4S1LAa1_JN6F0s48adoK6NUtiGJ6WDF6xztmvySPHzswcZv9T_MUjZoykKA9vK";

export function NeopetsAdventureBody() {
  return (
    <main className="np-paper-texture mx-auto max-w-[1200px] px-4 py-12 pb-12 md:px-16">
      <div className="relative mb-16 text-center">
        <h2
          className="mb-4 text-5xl font-bold text-[#0d658c]"
          style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
        >
          Lost &amp; Found Pet Hub
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#40484e]">
          A digital sanctuary for reuniting families. Report a sighting or start a search — every paw counts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-6 lg:col-span-7">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="np-pressable-btn flex flex-col items-center justify-center gap-3 rounded-2xl border-b-4 border-[#ba1a1a] bg-[#ffdad6] p-6 text-[#93000a] hover:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                search
              </span>
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                I Lost a Pet
              </span>
            </button>
            <button
              type="button"
              className="np-pressable-btn flex flex-col items-center justify-center gap-3 rounded-2xl border-b-4 border-[#2e6b29] bg-[#adf19e] p-6 text-[#326f2d] hover:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                location_on
              </span>
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                I Found a Pet
              </span>
            </button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-[24px] border-2 border-[#c0c7cf] bg-[#f0e7db] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#c0c7cf] bg-white/50 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d658c]">map</span>
                <h3
                  className="text-2xl font-semibold text-[#1f1b14]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  Live Sighting Map
                </h3>
              </div>
              <span className="rounded-full bg-[#eec750] px-3 py-1 text-sm font-semibold text-[#695300]">
                12 Local Alerts
              </span>
            </div>
            <div className="relative h-[400px]">
              <Image src={MAP_IMG} alt="Stylized Toronto map" fill className="object-cover" sizes="800px" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <input
                  type="search"
                  placeholder="Search last seen location..."
                  className="min-w-0 grow rounded-xl border-2 border-[#c0c7cf] bg-[#fff8f2] px-4 py-3 text-base outline-none ring-[#8fd3ff] focus:ring-4"
                  aria-label="Search map"
                />
                <button type="button" className="np-pressable-btn shrink-0 rounded-xl border-b-4 border-[#004c6b] bg-[#0d658c] px-6 py-3 font-bold text-white">
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-end justify-between px-2">
              <h3
                className="text-3xl font-bold text-[#2e6b29]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Recent Sightings
              </h3>
              <Link href={NEOPETS_PATHS.alerts} className="font-bold text-[#0d658c] hover:underline">
                Rescue Alerts
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="-rotate-1 rounded-[24px] border-2 border-[#ebe1d5] bg-white p-4 shadow-sm transition-transform hover:rotate-0">
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                  <Image src={BEAGLE} alt="Buddy" fill className="object-cover" sizes="400px" />
                  <div className="absolute right-2 top-2 rotate-3 rounded bg-[#ba1a1a] px-2 py-1 text-xs font-bold text-white shadow-sm">
                    LOST: 2H AGO
                  </div>
                </div>
                <h4
                  className="mb-2 text-2xl font-semibold text-[#1f1b14]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  Buddy the Beagle
                </h4>
                <p className="mb-4 flex items-center gap-1 text-sm text-[#40484e]">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  Liberty Village
                </p>
                <button type="button" className="w-full rounded-lg border-b-4 border-[#004c6b] bg-[#8fd3ff] py-2 font-bold text-[#005c80] transition-all hover:scale-95">
                  I Saw This Pet
                </button>
              </div>
              <div className="rotate-[1.5deg] rounded-[24px] border-2 border-[#ebe1d5] bg-white p-4 shadow-sm transition-transform hover:rotate-0">
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                  <Image src={TABBY} alt="Tabby" fill className="object-cover" sizes="400px" />
                  <div className="absolute right-2 top-2 -rotate-3 rounded bg-[#2e6b29] px-2 py-1 text-xs font-bold text-white shadow-sm">
                    FOUND: 1D AGO
                  </div>
                </div>
                <h4
                  className="mb-2 text-2xl font-semibold text-[#1f1b14]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  Mystery Tabby
                </h4>
                <p className="mb-4 flex items-center gap-1 text-sm text-[#40484e]">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  High Park North
                </p>
                <button type="button" className="w-full rounded-lg border-b-4 border-[#135212] bg-[#adf19e] py-2 font-bold text-[#326f2d] transition-all hover:scale-95">
                  Claim Pet
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-6 lg:col-span-5">
          <div className="rounded-[32px] border-2 border-dashed border-[#0d658c] bg-[#fcf2e6] p-8 shadow-inner">
            <h3
              className="mb-2 text-center text-3xl font-bold text-[#0d658c]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Report a Sighting
            </h3>
            <p className="mb-6 text-center text-base text-[#40484e]">Upload a photo to alert neighbors immediately.</p>
            <div className="np-polaroid-frame mx-auto mb-8 max-w-[280px] cursor-pointer rounded-lg bg-white">
              <div className="flex aspect-square flex-col items-center justify-center gap-4 rounded border-2 border-[#c0c7cf] bg-[#f6ece1] text-[#70787f]">
                <span className="material-symbols-outlined text-5xl">add_a_photo</span>
                <span className="text-sm font-semibold">Snap or Upload</span>
              </div>
            </div>
            <label className="mb-1 ml-2 block text-sm font-semibold text-[#1f1b14]">Where did you see them?</label>
            <input
              type="text"
              placeholder="e.g. Queen St W & Ossington"
              className="mb-4 w-full rounded-xl border-2 border-[#c0c7cf] bg-white px-4 py-3 outline-none ring-[#8fd3ff] focus:ring-4"
            />
            <button type="button" className="np-pressable-btn w-full rounded-2xl border-b-4 border-[#004c6b] bg-[#0d658c] py-4 text-lg font-bold text-white">
              Blast Community Alert
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
