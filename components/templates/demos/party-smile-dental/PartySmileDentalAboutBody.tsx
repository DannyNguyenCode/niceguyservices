import { PSD_DENTISTS } from "./partySmileDentalData";
import { PartySmileDentalDentistCard } from "./PartySmileDentalShared";

export function PartySmileDentalAboutBody() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-bold text-[#3b82f6]">About us</p>
      <h1 className="mt-2 font-black text-[#1a1a1a] text-[2rem] md:text-[3rem]">
        Meet the dental team behind every team win
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[#525252]">
        Smile Board Family Dental is a fictional demo clinic built around board-game teamwork — colorful
        tiles, clear steps, and dentists who explain care in plain English for kids and adults alike.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PSD_DENTISTS.map((dentist) => (
          <PartySmileDentalDentistCard key={dentist.name} dentist={dentist} />
        ))}
      </div>
    </main>
  );
}
