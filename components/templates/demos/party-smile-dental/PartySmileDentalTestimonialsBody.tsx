import { PSD_TESTIMONIALS } from "./partySmileDentalData";
import { PartySmileDentalTestimonialCard } from "./PartySmileDentalShared";

export function PartySmileDentalTestimonialsBody() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <p className="font-bold text-[#3b82f6]">Testimonials</p>
      <h1 className="mt-2 font-black text-[#1a1a1a] text-[2rem] md:text-[3rem]">
        Families who felt the difference
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[#525252]">
        Fictional reviews focused on trust, comfort, and kid-friendly care.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PSD_TESTIMONIALS.map((item) => (
          <PartySmileDentalTestimonialCard key={item.name} item={item} />
        ))}
      </div>
    </main>
  );
}
