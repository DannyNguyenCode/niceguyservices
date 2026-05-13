import Image from "next/image";
import Link from "next/link";

const BRUNO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDhlr0aNQefdOq4jcZgBpezxDVKScyApUkmZOTZd9TfxrKUvsBP5WQoTnSMMbMIKRtC4VPuRwAB5WwdKUp_i1ZcAO6L5G70Y3VI4C4Rz2kvBmFFrslE8YxHCVbF0FjMC1Tmr7mu5UZ8XuD_co8lPk8TeP9X1YNMI531Q_k44Tt0m7vr-2UVURPgT-60Sn_aPtbqjxF-CtMzTFzUiWEqEDiigkOSsTyiixI9kNVdWaageHzkP-yfvq9DuQRKlb2FHa4_SNKPJlUxHpIl";

const MISO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDB6SW_h2VQ3NoIZNnSsGqIzeoIQMaWwlABQHdZVvcbYTJZCjFI--FRINQjvW1sLUx5wRnM3jV2a7liK3PR4byIEtLqRv9XD6QrtP_NnZzyUTGj7RepwbmsxRK2vxFpRXu3KdFugqygGt16Pl8VHLbUYxBNcdzI6IbvoOfzHp9b-AZva7JXHmf3h9Lh9YhETKHhihCMsxKuKExsD-OkfB1dgMpJeaPMExLpw3ampjKmF3fqpFjtY_3qCcHXXH8dKCG7C_7N3at3y5SD";

export function NeopetsAlertsBody() {
  return (
    <main className="np-paper-texture mx-auto flex max-w-[1200px] flex-col gap-12 px-4 py-12 md:px-16">
      <div className="flex flex-col justify-between gap-6 border-b-4 border-dashed border-[#c0c7cf] pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#adf19e] px-3 py-1 text-sm font-semibold text-[#326f2d]">#RescueReady</span>
            <span className="rounded-full bg-[#8fd3ff] px-3 py-1 text-sm font-semibold text-[#005c80]">#CommunityHelp</span>
          </div>
          <h2
            className="text-5xl font-bold leading-[56px] text-[#0d658c]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Rescue Alerts
          </h2>
          <p className="max-w-2xl text-lg leading-7 text-[#40484e]">
            Help us give every tail a happy ending. Browse live alerts from our community and shelters needing immediate
            assistance.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border-2 border-[#ebe1d5] bg-[#f0e7db] p-4 shadow-inner">
          <div className="text-right">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#0d658c]">Live Ticker</p>
            <p className="text-base font-bold text-[#1f1b14]">14 Active Emergencies</p>
          </div>
          <span className="material-symbols-outlined animate-pulse text-4xl text-[#ba1a1a]">emergency_home</span>
        </div>
      </div>

      <section
        className="rounded-[24px] border-2 border-dashed border-[#0d658c]/50 bg-[#fff8f2] p-6 shadow-inner sm:p-8"
        aria-labelledby="np-alerts-x-placeholder-heading"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-[#1f1b14] bg-[#1f1b14] text-white"
              aria-hidden
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" className="h-6 w-6 fill-current">
                <path d="M714.163 519.284L1160.89 0H1057.7L671.303 450.887L393.196 0H0L468.49 727.515L0 1226.62H103.19L512.057 744.779L806.803 1226.62H1200L714.137 519.284H714.163ZM563.43 672.043L517.516 602.826L137.115 79.6012H341.8L620.757 511.028L666.671 580.244L1057.81 1180.19H853.128L563.43 672.043Z" />
              </svg>
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#745b00]">Coming soon</p>
              <h2
                id="np-alerts-x-placeholder-heading"
                className="text-2xl font-bold leading-8 text-[#0d658c] sm:text-3xl sm:leading-9"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Rescue alerts on X (Twitter)
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[#40484e]">
                Placeholder for a future integration: live posts, reposts, and hashtag rescues from our official shelter
                account—so the community can spot urgent needs right in the scroll. Not connected in this demo.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            <button
              type="button"
              disabled
              className="rounded-xl border-2 border-[#c0c7cf] bg-[#ebe1d5] px-5 py-3 text-sm font-semibold text-[#40484e] shadow-sm disabled:cursor-not-allowed disabled:opacity-75"
            >
              Connect @ shelter account
            </button>
            <button
              type="button"
              disabled
              className="rounded-xl border-2 border-dashed border-[#0d658c] bg-transparent px-5 py-3 text-sm font-semibold text-[#0d658c] disabled:cursor-not-allowed disabled:opacity-75"
            >
              Preview X feed (placeholder)
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <article className="np-chunky-shadow group relative overflow-hidden rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6">
            <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-[#ba1a1a] px-4 py-1 text-sm font-semibold text-white">
              <span className="material-symbols-outlined text-sm">warning</span> Urgent
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="shrink-0 md:w-1/3">
                <div className="np-polaroid-tilt-left rounded-lg border border-[#c0c7cf] bg-[#ffffff] p-2 shadow-md">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image src={BRUNO} alt="Bruno" fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                  </div>
                </div>
              </div>
              <div className="flex grow flex-col justify-between">
                <div>
                  <h3
                    className="mb-1 text-2xl font-semibold leading-8 text-[#1f1b14]"
                    style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                  >
                    Emergency foster needed: Bruno
                  </h3>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-sm font-semibold text-[#745b00]">#Etobicoke</span>
                    <span className="text-sm font-semibold text-[#745b00]">#DogFoster</span>
                  </div>
                  <p className="mb-6 text-base leading-6 text-[#40484e]">
                    Bruno&apos;s current foster family has an emergency travel situation. He needs a quiet, child-free
                    home for the next 2 weeks. He is a senior sweetheart who just loves napping by the radiator.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex -space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#8fd3ff] text-[10px] font-bold">
                      MK
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#adf19e] text-[10px] font-bold">
                      AS
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#eec750] text-[10px] font-bold">
                      +4
                    </div>
                  </div>
                  <button
                    type="button"
                    className="np-squish-btn np-pressed-shadow flex items-center gap-2 rounded-xl border-b-4 border-[#004c6b] bg-[#0d658c] px-6 py-3 text-sm font-semibold text-white transition-all"
                  >
                    <span className="material-symbols-outlined">favorite</span>
                    Help This Pet
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="np-chunky-shadow rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="shrink-0 md:w-1/3">
                <div className="np-polaroid-tilt-right rounded-lg border border-[#c0c7cf] bg-[#ffffff] p-2 shadow-md">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image src={MISO} alt="Kitten surgery" fill className="object-cover" sizes="33vw" />
                  </div>
                </div>
              </div>
              <div className="flex grow flex-col gap-4">
                <h3
                  className="text-2xl font-semibold leading-8 text-[#1f1b14]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  Urgent surgery fundraiser
                </h3>
                <p className="text-base leading-6 text-[#40484e]">
                  Little Miso was found with a fractured leg. We are raising $1,200 for her orthopedic surgery and
                  recovery care. Every dollar counts!
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-[#0d658c]">
                    <span>$840 raised</span>
                    <span>70%</span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full border-2 border-[#ebe1d5] bg-[#ebe1d5] p-0.5">
                    <div className="h-full w-[70%] rounded-full bg-[#2e6b29]" />
                  </div>
                  <p className="text-right text-xs font-medium italic text-[#40484e]">Goal: $1,200</p>
                </div>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    className="np-squish-btn np-pressed-shadow flex flex-1 items-center justify-center gap-2 rounded-xl border-b-4 border-[#135212] bg-[#2e6b29] py-3 text-sm font-semibold text-white transition-all"
                  >
                    <span className="material-symbols-outlined">volunteer_activism</span>
                    Donate Now
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border-2 border-[#c0c7cf] px-4 py-3 text-[#40484e] transition-colors hover:bg-[#fcf2e6]"
                  >
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                iconBg: "bg-[#eec750] text-[#695300]",
                icon: "location_on",
                time: "2h ago",
                title: "Dog found injured",
                body: "A Golden Retriever mix found limping near High Park. No collar. Currently at the 24h vet clinic on Bloor. Please share to find the owner!",
              },
              {
                iconBg: "bg-[#8fd3ff] text-[#005c80]",
                icon: "info",
                time: "5h ago",
                title: "Senior cat abandoned",
                body: "12-year-old Siamese cat left in a carrier at the shelter gates. Needs a calming foster home immediately as she is very stressed.",
                btn: "Apply to Foster",
              },
            ].map((c) => (
              <div key={c.title} className="np-chunky-shadow flex flex-col gap-4 rounded-[24px] border-2 border-[#ebe1d5] bg-[#fcf2e6] p-5">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${c.iconBg}`}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                  </div>
                  <span className="rounded border border-[#c0c7cf] bg-white px-2 py-1 text-xs font-bold text-[#40484e]">
                    {c.time}
                  </span>
                </div>
                <h4
                  className="text-2xl font-semibold leading-8 text-[#1f1b14]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  {c.title}
                </h4>
                <p className="line-clamp-3 text-base leading-6 text-[#40484e]">{c.body}</p>
                <div className="mt-auto">
                  <button
                    type="button"
                    className="w-full rounded-xl border-2 border-[#0d658c] py-2 text-sm font-semibold text-[#0d658c] transition-colors hover:bg-[#8fd3ff]/20"
                  >
                    {"btn" in c ? c.btn : "View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-8 lg:col-span-4">
          <div className="rounded-[24px] border-2 border-[#c0c7cf] bg-[#ebe1d5] p-6 shadow-inner">
            <h3
              className="mb-4 flex items-center gap-2 text-2xl font-semibold leading-8 text-[#1f1b14]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              <span className="material-symbols-outlined text-[#2e6b29]">groups</span>
              Help Wanted
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 rounded-xl border border-[#c0c7cf] bg-white p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#adf19e]">
                  <span className="material-symbols-outlined text-[#326f2d]">directions_car</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f1b14]">Pet Transport</p>
                  <p className="text-xs text-[#40484e]">Scarborough to Downtown</p>
                </div>
              </li>
              <li className="flex items-center gap-3 rounded-xl border border-[#c0c7cf] bg-white p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8fd3ff]">
                  <span className="material-symbols-outlined text-[#005c80]">inventory_2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f1b14]">Food Donation</p>
                  <p className="text-xs text-[#40484e]">Unopened cat kibble needed</p>
                </div>
              </li>
              <li className="flex items-center gap-3 rounded-xl border border-[#c0c7cf] bg-white p-3 opacity-75 grayscale">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eec750]">
                  <span className="material-symbols-outlined text-[#695300]">check_circle</span>
                </div>
                <div>
                  <p className="line-through text-sm font-semibold text-[#1f1b14]">Blanket Pickup</p>
                  <p className="text-xs italic text-[#40484e]">Filled by Sarah J.</p>
                </div>
              </li>
            </ul>
            <button
              type="button"
              className="mt-6 w-full rounded-xl border-2 border-[#70787f] bg-white py-3 text-sm font-semibold transition-colors hover:bg-[#f6ece1]"
            >
              Post a Request
            </button>
          </div>

          <div className="np-chunky-shadow overflow-hidden rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6">
            <h3
              className="mb-6 text-2xl font-semibold leading-8 text-[#1f1b14]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Recent Wins
            </h3>
            <div className="space-y-6">
              {[
                ["Buster Adopted!", "After 3 months in foster care, Buster has found his forever couch."],
                ["Medical Goal Met", "Luna\u2019s eye surgery is fully funded. Surgery scheduled for Monday!"],
                ["New Foster Signed Up", "Welcome to the team, Michael from North York!"],
              ].map(([t, d], i, arr) => (
                <div
                  key={t}
                  className={`relative ml-2 flex gap-4 border-l-2 border-[#2e6b29] pl-6 ${i < arr.length - 1 ? "pb-6" : ""}`}
                >
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-white bg-[#2e6b29]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f1b14]">{t}</p>
                    <p className="text-sm text-[#40484e]">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border-2 border-dashed border-[#745b00] bg-[#eec750]/30 p-6 text-center">
            <span className="material-symbols-outlined mb-2 text-6xl text-[#745b00]">stars</span>
            <p
              className="text-2xl font-semibold leading-8 text-[#695300]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Be a Hero
            </p>
            <p className="mt-2 text-base leading-6 text-[#695300]">Your small action makes a huge world for them.</p>
          </div>
        </aside>
      </div>

      <p className="text-center text-sm text-[#40484e] md:hidden">
        <Link href="/template" className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Back to template gallery
        </Link>
      </p>
    </main>
  );
}
