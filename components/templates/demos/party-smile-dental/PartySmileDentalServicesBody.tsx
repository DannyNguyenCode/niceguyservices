import Link from "next/link";
import { PSD_PATHS } from "./partySmileDentalConfig";
import { ServicesSection } from "./ServicesSection";

export function PartySmileDentalServicesBody() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-bold text-[#3b82f6]">Services</p>
      <h1 className="mt-2 font-black text-[#1a1a1a] text-[2rem] md:text-[3rem]">
        Complete family dental care
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#525252]">
        From cleanings to emergencies — every service is explained in plain English with a playful tile
        for easy scanning.
      </p>
      <div className="mt-12">
        <ServicesSection />
      </div>
      <div className="mt-12 rounded-3xl border-2 border-[#1a1a1a] bg-[#ef4444] p-8 text-center text-white psd-tile-shadow">
        <p className="font-black text-lg">Ready to pick your next tile?</p>
        <Link
          href={PSD_PATHS.book}
          className="mt-4 inline-block rounded-2xl border-2 border-[#1a1a1a] bg-white px-6 py-3 font-black text-[#ef4444]"
        >
          Book Appointment
        </Link>
      </div>
    </main>
  );
}
