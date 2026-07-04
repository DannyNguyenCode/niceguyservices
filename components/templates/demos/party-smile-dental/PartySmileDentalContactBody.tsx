import Link from "next/link";
import { PSD_PATHS } from "./partySmileDentalConfig";
import { PartySmileDentalContactSection } from "./PartySmileDentalShared";

export function PartySmileDentalContactBody() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-bold text-[#3b82f6]">Contact</p>
      <h1 className="mt-2 font-black text-[#1a1a1a] text-[2rem] md:text-[3rem]">Visit or call our clinic</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#525252]">
        Demo contact details for Smile Board Family Dental in Toronto.
      </p>
      <div className="mt-10">
        <PartySmileDentalContactSection />
      </div>
      <div className="mt-12 rounded-3xl border-2 border-[#1a1a1a] bg-[#3b82f6] p-8 text-center text-white psd-tile-shadow">
        <p className="font-black text-lg">Book Your Visit</p>
        <p className="mt-2 text-sm text-white/90">Start the board-game booking flow in under two minutes.</p>
        <Link
          href={PSD_PATHS.book}
          className="mt-6 inline-block rounded-2xl border-2 border-[#1a1a1a] bg-[#eab308] px-8 py-4 font-black text-[#1a1a1a]"
        >
          Book Your Visit
        </Link>
      </div>
    </main>
  );
}
