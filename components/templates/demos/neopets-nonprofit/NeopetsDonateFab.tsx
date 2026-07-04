import Link from "next/link";
import type { CSSProperties } from "react";
import { NEOPETS_PATHS } from "./neopetsConfig";

/** Same Material icon as the home “Help Save Lives” CTA (`NeopetsHomeBody`). */
const FAB_ICON = "volunteer_activism" as const;

const FAB_HEARTS: ReadonlyArray<{ dx: number; delay: number; symbol: string; color: string }> = [
  { dx: -44, delay: 0, symbol: "❤", color: "#e91e63" },
  { dx: -30, delay: 0.03, symbol: "♥", color: "#c2185b" },
  { dx: -16, delay: 0.06, symbol: "💕", color: "#ad1457" },
  { dx: -6, delay: 0.09, symbol: "❤", color: "#e53935" },
  { dx: 6, delay: 0.05, symbol: "♥", color: "#d81b60" },
  { dx: 18, delay: 0.11, symbol: "💖", color: "#ec407a" },
  { dx: 32, delay: 0.08, symbol: "❤", color: "#f06292" },
  { dx: 46, delay: 0.14, symbol: "♥", color: "#e91e63" },
  { dx: -22, delay: 0.12, symbol: "💗", color: "#f48fb1" },
  { dx: 10, delay: 0.16, symbol: "❤", color: "#c62828" },
];

type NeopetsDonateFabProps = {
  /** Desktop FAB corner offset (default `md:bottom-12 md:right-12`). */
  positionClassName?: string;
};

export function NeopetsDonateFab({ positionClassName }: NeopetsDonateFabProps) {
  const mdFabOffset = positionClassName ?? "md:bottom-12 md:right-12";

  return (
    <Link
      href={NEOPETS_PATHS.volunteers}
      className={`np-donate-fab group fixed bottom-24 right-6 z-40 flex h-16 max-w-16 min-h-16 min-w-16 cursor-pointer items-center justify-center overflow-visible rounded-full border-b-4 border-[#135212] bg-[#2e6b29] text-white shadow-xl transition-[max-width,min-width,padding,transform,box-shadow] duration-300 ease-out hover:max-w-60 hover:min-w-44 hover:scale-[1.03] hover:px-4 hover:shadow-2xl active:translate-y-0.5 active:scale-[0.98] ${mdFabOffset}`}
      aria-label="Donate to support rescue — opens the volunteers page (demo)"
    >
      <span
        className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-0 h-0 w-0 -translate-x-1/2"
        aria-hidden
      >
        {FAB_HEARTS.map((h, i) => (
          <span
            key={i}
            className="np-donate-fab__heart absolute left-1/2 top-0 text-lg leading-none"
            style={
              {
                "--np-dx": `${h.dx}px`,
                color: h.color,
                animationDelay: `${h.delay}s`,
              } as CSSProperties
            }
          >
            {h.symbol}
          </span>
        ))}
      </span>

      <span className="relative flex h-full w-full min-w-0 items-center justify-center gap-0 overflow-visible rounded-inherit group-hover:gap-2">
        <span className="material-symbols-outlined flex shrink-0 items-center justify-center text-3xl leading-none">
          {FAB_ICON}
        </span>
        <span className="max-w-0 overflow-hidden opacity-0 transition-[max-width,opacity] duration-300 ease-out group-hover:max-w-26 group-hover:opacity-100">
          <span className="block whitespace-nowrap text-sm font-bold tracking-wide">Donate</span>
        </span>
      </span>
    </Link>
  );
}
