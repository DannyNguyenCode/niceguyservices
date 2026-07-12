import Link from "next/link";
import { lasPath } from "./leaveASparkConfig";
import { LAS_SITE } from "./leaveASparkSiteContent";

export function SparkLogo({ className = "" }: { className?: string }) {
  return (
    <Link href={lasPath("/")} className={`las-focus-ring group inline-flex items-center gap-3 ${className}`}>
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden>
        <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 32 L20 8 L24 20 L32 16 L20 32 Z"
            fill="#D71920"
            stroke="#F1222A"
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
          <path d="M20 8 L20 20 M20 20 L14 26" stroke="#F2EDE4" strokeWidth="1" strokeLinecap="square" opacity="0.5" />
          <circle cx="20" cy="20" r="2" fill="#F1222A" className="las-panel-led-breathe" />
        </svg>
      </span>
      <span className="leading-none min-w-0">
        <span className="las-display block text-[0.72rem] text-[var(--las-off-white)] sm:text-[0.85rem]">
          {LAS_SITE.shortName.toUpperCase()}
        </span>
        <span className="las-label mt-0.5 block text-[0.6rem] text-[var(--las-muted)] sm:text-[0.6875rem]">ELECTRIC</span>
      </span>
    </Link>
  );
}
