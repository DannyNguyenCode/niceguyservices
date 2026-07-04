import Link from "next/link";
import type { NeopetsPet } from "../neopetsPets";
import { NEOPETS_PATHS } from "../neopetsConfig";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;
const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

type ShelterContactCardProps = {
  pet: NeopetsPet;
};

export function ShelterContactCard({ pet }: ShelterContactCardProps) {
  const { contact } = pet;
  const mailto = `mailto:${contact.email}?subject=Question about ${pet.name}`;

  return (
    <section className="rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 shadow-[8px_8px_0px_0px_#ebe1d5] md:p-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#0d658c]" style={bodyFont}>
        Foster location
      </p>
      <h2 className="mt-1 text-2xl font-bold text-[#1f1b14]" style={headlineFont}>
        {contact.shelter}
      </h2>

      <ul className="mt-6 space-y-4">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[#0d658c]">call</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8a84]" style={bodyFont}>
              Phone
            </p>
            <a
              href={`tel:${contact.phone.replace(/\D/g, "")}`}
              className="np-focus-ring font-semibold text-[#1f1b14] hover:text-[#0d658c]"
            >
              {contact.phone}
            </a>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[#0d658c]">mail</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8a84]" style={bodyFont}>
              Email
            </p>
            <a href={mailto} className="np-focus-ring font-semibold text-[#1f1b14] hover:text-[#0d658c]">
              {contact.email}
            </a>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[#0d658c]">location_on</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8a84]" style={bodyFont}>
              Address
            </p>
            <p className="font-semibold text-[#1f1b14]" style={bodyFont}>
              {contact.address}
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-[#0d658c]">schedule</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8a84]" style={bodyFont}>
              Hours
            </p>
            <p className="font-semibold text-[#1f1b14]" style={bodyFont}>
              {contact.hours}
            </p>
          </div>
        </li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={mailto}
          className="np-focus-ring np-chunky-button inline-flex items-center gap-2 rounded-xl bg-[#0d658c] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-lg">chat</span>
          Ask About This Pet
        </a>
        <Link
          href={NEOPETS_PATHS.adoptionProcess}
          className="np-focus-ring inline-flex items-center gap-2 rounded-xl border-2 border-[#0d658c] bg-white px-6 py-3 text-sm font-bold text-[#0d658c] transition-colors hover:bg-[#8fd3ff]/20"
        >
          Adoption Journey
        </Link>
      </div>
    </section>
  );
}
