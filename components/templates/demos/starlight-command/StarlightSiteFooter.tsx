import Link from "next/link";
import { STARLIGHT_PATHS, STARLIGHT_COPYRIGHT_LINE, STARLIGHT_SITE } from "@/components/templates/demos/starlight-command/starlightConfig";

export function StarlightSiteFooter() {
  return (
    <footer className="border-t-4 border-[#594238] bg-[#20201f] px-4 py-10 sm:py-12 md:px-8 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 md:grid-cols-4 md:gap-12">
        <div className="space-y-4 sm:col-span-2 md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined sc-material-fill text-3xl text-[#ffb595]">electric_bolt</span>
            <span className="font-['var(--font-sc-display),ui-sans-serif] text-xl font-bold text-[#ffb595]">{STARLIGHT_SITE}</span>
          </div>
          <p className="max-w-sm font-['var(--font-sc-body),ui-sans-serif] text-[#e0c0b2]">
            Premium retro-industrial electrical services for Toronto&apos;s most demanding residential and commercial clients. Precision. Power.
            Protection.
          </p>
        </div>
        <div>
          <h4 className="mb-6 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#ffb595]">
            Operations
          </h4>
          <ul className="space-y-2 font-['var(--font-sc-display),ui-sans-serif] text-sm text-[#e0c0b2]">
            <li>
              <Link href={`${STARLIGHT_PATHS.services}#residential`} className="hover:text-[#ee671c]">
                RESIDENTIAL
              </Link>
            </li>
            <li>
              <Link href={`${STARLIGHT_PATHS.services}#commercial`} className="hover:text-[#ee671c]">
                COMMERCIAL
              </Link>
            </li>
            <li>
              <Link href={`${STARLIGHT_PATHS.services}#industrial`} className="hover:text-[#ee671c]">
                INDUSTRIAL
              </Link>
            </li>
            <li>
              <Link href={STARLIGHT_PATHS.contact} className="hover:text-[#ee671c]">
                EMERGENCY
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 font-['var(--font-sc-display),ui-sans-serif] text-sm font-semibold uppercase tracking-widest text-[#ffb595]">
            HQ Link
          </h4>
          <p className="font-['var(--font-sc-body),ui-sans-serif] leading-loose text-[#e0c0b2]">
            1200 Industrial Way
            <br />
            Toronto, ON M5V 2L7
            <br />
            (416) 555-0199
          </p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-start justify-between gap-4 border-t border-[#594238] pt-8 font-['var(--font-sc-display),ui-sans-serif] text-[10px] uppercase tracking-widest text-[#a88a7e] md:flex-row md:items-center">
        <span>{STARLIGHT_COPYRIGHT_LINE}</span>
        <span>SYSTEM_TIME: STATIC_PREVIEW</span>
      </div>
    </footer>
  );
}
