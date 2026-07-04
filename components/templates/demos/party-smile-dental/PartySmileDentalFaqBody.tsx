import { PSD_FAQS } from "./partySmileDentalData";
import { FAQAccordion } from "./FAQAccordion";

export function PartySmileDentalFaqBody() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-bold text-[#3b82f6]">FAQ</p>
      <h1 className="mt-2 font-black text-[#1a1a1a] text-[2rem] md:text-[3rem]">
        Questions before your visit
      </h1>
      <p className="mt-4 text-sm leading-7 text-[#525252]">
        Clear answers about new patients, kids, emergencies, insurance, and nervous visits.
      </p>
      <div className="mt-10">
        <FAQAccordion items={PSD_FAQS} />
      </div>
    </main>
  );
}
