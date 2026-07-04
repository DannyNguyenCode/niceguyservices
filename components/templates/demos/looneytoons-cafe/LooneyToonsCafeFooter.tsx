import Link from "next/link";
import { LOONEYTOONS_CAFE_BASE } from "./looneytoonsCafeConfig";

const BASE = LOONEYTOONS_CAFE_BASE;

export function LooneyToonsCafeFooter() {
  return (
    <footer className="relative mt-20 w-full rounded-t-[100px] border-t-4 border-[#151c28] bg-[#dde2f4] md:rounded-t-[200px]">
      <div className="flex flex-col items-center gap-8 px-4 py-20 text-center md:px-16">
        <span className="font-black uppercase tracking-tighter text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-none md:text-6xl">
          Comet Cup Co.
        </span>
        <nav className="flex flex-wrap justify-center gap-8 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
          <Link
            href={`${BASE}/menu`}
            className="text-[#151c28] underline decoration-4 decoration-[#5d5f5f] underline-offset-4 transition-all hover:translate-x-2 hover:italic"
          >
            Menu
          </Link>
          <Link
            href={`${BASE}/about`}
            className="text-[#151c28] transition-all hover:translate-x-2 hover:italic"
          >
            Our story
          </Link>
          <Link
            href={`${BASE}/rewards`}
            className="text-[#151c28] transition-all hover:translate-x-2 hover:italic"
          >
            Rewards
          </Link>
          <span className="text-[#444748] opacity-70">Privacy (demo)</span>
        </nav>
        <div className="mt-4 flex gap-6">
          <span className="material-symbols-outlined cursor-default text-3xl text-[#151c28]" aria-hidden>
            social_leaderboard
          </span>
          <span className="material-symbols-outlined cursor-default text-3xl text-[#151c28]" aria-hidden>
            retweet
          </span>
          <span className="material-symbols-outlined cursor-default text-3xl text-[#151c28]" aria-hidden>
            share
          </span>
        </div>
        <p className="mt-8 text-sm font-bold text-[#444748] opacity-60 [font-family:var(--font-lt-space),system-ui,sans-serif]">
          © {new Date().getFullYear()} Comet Cup Co. (fictional demo) · 88 Inkwell Pier, Rubberhose, RH 00000
        </p>
      </div>
    </footer>
  );
}
