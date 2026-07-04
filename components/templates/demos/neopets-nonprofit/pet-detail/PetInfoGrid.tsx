import type { NeopetsPet } from "../neopetsPets";

const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

type InfoItem = {
  icon: string;
  label: string;
  value: string;
};

type PetInfoGridProps = {
  pet: NeopetsPet;
};

export function PetInfoGrid({ pet }: PetInfoGridProps) {
  const items: InfoItem[] = [
    { icon: "pets", label: "Species", value: pet.species },
    { icon: "category", label: "Breed", value: pet.breed },
    { icon: "cake", label: "Age", value: pet.age },
    { icon: "straighten", label: "Size / Weight", value: `${pet.size} · ${pet.weight}` },
    { icon: "bolt", label: "Energy Level", value: pet.energyLevel },
    { icon: "location_on", label: "Location", value: pet.location },
    {
      icon: "child_care",
      label: "Good with kids",
      value: pet.goodWithKids ? "Yes" : "Ask us first",
    },
    {
      icon: "diversity_1",
      label: "Good with other pets",
      value: pet.goodWithPets ? "Yes" : "Prefers solo home",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border-2 border-[#ebe1d5] bg-white p-4 shadow-[4px_4px_0px_0px_#ebe1d5] transition-transform hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined mb-2 block text-2xl text-[#0d658c]">
            {item.icon}
          </span>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9a8a84]" style={bodyFont}>
            {item.label}
          </p>
          <p className="mt-1 text-sm font-bold text-[#1f1b14]" style={bodyFont}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
