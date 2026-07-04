import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/templates/demos/neopets-nonprofit/neopetsConfig";

const PUPPIES =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGhgSCKyLRA4jDAU7WSBw-f1ne_9DtV84Xtxo8XVQRaQvED5tnGxG_RAmp034__TUsZ-DQ1y9Zxo_W-CAHPRd3KIk-Zxp_pdDCUNboiFScPhXEM8JHvBYUkKsKaRQUlQ55FTQlVMA1DsOUuJb2EtbgY20Xd6S70kuSWCK-HQZQmx1MCm0XKRwnInl1n7xFJTRUEK81s0maE5wpHMFn0up9x8hZUOKZToYfNQonWbIOaXZncTkHadrLrza96cBK33GMpJ6uzCex45cv";

const MISSIONS = [
  {
    title: "Shelter Sidekick",
    body: "Hands-on care, exercise, and companionship for resident pets while they wait for forever homes.",
    icon: "volunteer_activism",
    iconWrap: "bg-[#8fd3ff]/30",
    iconColor: "text-[#0d658c]",
    btn: "bg-[#0d658c] text-white shadow-[0_4px_0_0_#004c6b]",
    bgIcon: "volunteer_activism",
  },
  {
    title: "Sanctuary Guardian",
    body: "Open your home to a pet in transition — a safe, quiet space for recovery and socialization.",
    icon: "home_health",
    iconWrap: "bg-[#adf19e]/30",
    iconColor: "text-[#2e6b29]",
    btn: "bg-[#2e6b29] text-white shadow-[0_4px_0_0_#135212]",
    bgIcon: "home_health",
  },
  {
    title: "Resource Alchemist",
    body: "Convert generosity into medical care, food, and warm blankets for the shelter.",
    icon: "savings",
    iconWrap: "bg-[#eec750]/30",
    iconColor: "text-[#745b00]",
    btn: "bg-[#745b00] text-white shadow-[0_4px_0_0_#574400]",
    bgIcon: "savings",
  },
  {
    title: "Supply Scout",
    body: "Fulfill item requests from our needs list — toys, cleaning supplies, and more.",
    icon: "inventory_2",
    iconWrap: "bg-[#c6e7ff]/30",
    iconColor: "text-[#004c6b]",
    btn: "bg-[#004c6b] text-white shadow-[0_4px_0_0_#001e2d]",
    bgIcon: "inventory_2",
  },
  {
    title: "Reunion Tracker",
    body: "Spread the word about lost pets or help identify found animals for happy homecomings.",
    icon: "travel_explore",
    iconWrap: "bg-[#ffdad6]/30",
    iconColor: "text-[#ba1a1a]",
    btn: "bg-[#ba1a1a] text-white shadow-[0_4px_0_0_#93000a]",
    bgIcon: "travel_explore",
  },
  {
    title: "Compassion Bridge",
    body: "Support families in tough transitions with resources and a judgment-free path forward.",
    icon: "handshake",
    iconWrap: "bg-[#c0c7cf]/30",
    iconColor: "text-[#70787f]",
    btn: "bg-[#70787f] text-white shadow-[0_4px_0_0_#40484e]",
    bgIcon: "handshake",
  },
] as const;

export function NeopetsQuestsBody() {
  return (
    <main className="np-paper-texture-fine mx-auto max-w-[1200px] px-4 py-12 md:px-16">
      <header className="mb-12 text-center md:text-left">
        <div className="mb-4 inline-block rounded-full bg-[#eec750] px-4 py-1 text-sm font-semibold text-[#695300] shadow-sm">
          ACTIVE QUESTS
        </div>
        <h1
          className="mb-2 text-5xl font-bold text-[#0d658c]"
          style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
        >
          Community Support Missions
        </h1>
        <p className="max-w-2xl text-lg text-[#40484e]">
          Become a hero in the lives of our furry neighbors. Complete missions to earn badges, XP, and wagging tails.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((m) => (
          <div
            key={m.title}
            className="np-mission-card relative flex h-full flex-col overflow-hidden rounded-[24px] border-2 border-[#ebe1d5] bg-[#fff8f2] p-6 shadow-[4px_4px_0px_0px_rgba(235,225,213,1)]"
          >
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-8xl">{m.bgIcon}</span>
            </div>
            <div className={`relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${m.iconWrap}`}>
              <span className={`material-symbols-outlined text-3xl ${m.iconColor}`}>{m.icon}</span>
            </div>
            <h3
              className="relative z-10 mb-3 text-2xl font-semibold text-[#1f1b14]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              {m.title}
            </h3>
            <p className="relative z-10 mb-8 grow text-base text-[#40484e]">{m.body}</p>
            <div className="relative z-10 mb-6 flex flex-wrap gap-2">
              <span className="rounded bg-[#adf19e] px-2 py-0.5 text-[10px] font-bold uppercase italic tracking-wider text-[#326f2d]">
                REWARD: XP
              </span>
              <span className="rounded bg-[#ffe089] px-2 py-0.5 text-[10px] font-bold uppercase italic tracking-wider text-[#241a00]">
                RANK: ANY
              </span>
            </div>
            <button
              type="button"
              className={`relative z-10 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold transition-all active:translate-y-1 active:shadow-none ${m.btn}`}
            >
              Start Mission <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>

      <section className="mt-20 flex flex-col items-center gap-12 rounded-[32px] border-4 border-[#0d658c] bg-[#8fd3ff] p-8 shadow-xl md:flex-row md:p-12">
        <div className="relative w-full md:w-1/2">
          <Image
            src={PUPPIES}
            alt="Puppies playing"
            width={600}
            height={400}
            className="h-[400px] w-full -rotate-1 rounded-[24px] border-4 border-[#005c80] object-cover shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="mb-6 w-fit rounded-lg bg-[#ba1a1a] px-3 py-1 text-xs font-bold uppercase tracking-tighter text-white shadow-sm">
            EMERGENCY QUEST
          </div>
          <h2
            className="mb-6 text-5xl font-bold text-[#005c80]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            The Great Blanket Drive
          </h2>
          <p className="mb-8 text-lg text-[#005c80]">
            Winter is approaching! We need 500 clean, warm blankets. Triple XP and a limited-edition Winter Hero frame.
          </p>
          <div className="mb-8 h-4 w-full overflow-hidden rounded-full bg-[#005c80]/20">
            <div className="relative h-full w-[72%] rounded-full bg-[#2e6b29]">
              <div className="absolute right-0 top-0 h-full w-0.5 bg-white/30" />
            </div>
          </div>
          <div className="mb-10 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#005c80]">PROGRESS: 360 / 500</span>
            <span className="text-sm font-bold text-[#2e6b29]">72%</span>
          </div>
          <Link
            href={NEOPETS_PATHS.volunteers}
            className="inline-block rounded-2xl bg-[#005c80] px-10 py-5 text-sm font-semibold text-white shadow-[0_6px_0_0_#001e2d] transition-all hover:scale-105 active:translate-y-1 active:shadow-none"
          >
            JOIN THE DRIVE
          </Link>
        </div>
      </section>
    </main>
  );
}
