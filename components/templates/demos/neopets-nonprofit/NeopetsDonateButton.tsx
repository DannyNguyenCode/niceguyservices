import Link from "next/link";
import { NEOPETS_PATHS } from "./neopetsConfig";

const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

type NeopetsDonateButtonProps = {
  variant: "header-desktop" | "header-mobile";
  className?: string;
};

export function NeopetsDonateButton({ variant, className = "" }: NeopetsDonateButtonProps) {
  const base =
    "np-focus-ring np-squish-click inline-flex min-h-10 items-center gap-1 rounded-lg border-b-2 border-[#135212] bg-[#2e6b29] px-2.5 py-1 text-sm font-bold text-white transition-all hover:bg-[#326f2d]";

  if (variant === "header-desktop") {
    return (
      <Link href={NEOPETS_PATHS.volunteers} className={`${base} hidden lg:inline-flex ${className}`} style={bodyFont}>
        <span className="material-symbols-outlined text-base leading-none" aria-hidden>
          volunteer_activism
        </span>
        Donate
      </Link>
    );
  }

  return (
    <Link href={NEOPETS_PATHS.volunteers} className={`${base} ${className}`} style={bodyFont}>
      <span className="material-symbols-outlined text-base leading-none" aria-hidden>
        volunteer_activism
      </span>
      Donate
    </Link>
  );
}
