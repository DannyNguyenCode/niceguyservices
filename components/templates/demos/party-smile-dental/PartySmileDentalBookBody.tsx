import { PartySmileDentalAppointmentFlow } from "./PartySmileDentalAppointmentFlow";

export function PartySmileDentalBookBody() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-bold text-[#3b82f6]">Book appointment</p>
      <h1 className="mt-2 font-black text-[#1a1a1a] text-[2rem] md:text-[3rem]">
        Roll through the smile board
      </h1>
      <p className="mt-4 text-sm leading-7 text-[#525252]">
        Six tiles. One appointment request. Demo only — nothing is sent to a real clinic.
      </p>
      <div className="mt-10">
        <PartySmileDentalAppointmentFlow />
      </div>
    </main>
  );
}
