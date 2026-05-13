import Link from "next/link";
import { LOONEYTOONS_CAFE_BASE } from "./looneytoonsCafeConfig";

export function LooneyToonsCafeFab() {
  return (
    <Link
      href={`${LOONEYTOONS_CAFE_BASE}/menu#order`}
      className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-[#495E84] text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-110 active:scale-95 md:bottom-12 md:right-12"
      aria-label="Order now (demo)"
    >
      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
        bolt
      </span>
    </Link>
  );
}
