import Link from "next/link";
import { Phone } from "lucide-react";
import { PSD_PATHS, PSD_PHONE, PSD_PHONE_HREF } from "./partySmileDentalConfig";

export function TopUtilityNav() {
  return (
    <div
      className="border-b-2 border-[#1a1a1a] bg-[#f5f5f5]"
      aria-label="Clinic utility navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-4 py-2 sm:gap-3 md:px-8">
        <a
          href={PSD_PHONE_HREF}
          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-transparent px-2 py-1 text-xs font-bold text-[#1a1a1a] transition-colors hover:border-[#1a1a1a] hover:bg-white md:text-sm"
        >
          <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
          <span className="whitespace-nowrap">{PSD_PHONE}</span>
        </a>
        <Link
          href={PSD_PATHS.book}
          className="rounded-lg border-2 border-[#1a1a1a] bg-[#ef4444] px-3 py-1.5 text-xs font-black text-white psd-tile-shadow transition-colors hover:bg-[#dc2626] md:px-4 md:text-sm"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
