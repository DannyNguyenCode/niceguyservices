import type { NeopetsPet } from "../neopetsPets";
import { getRelatedPets } from "../neopetsPets";
import { NeopetsPetCard } from "../NeopetsPetCard";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;

type RelatedPetsProps = {
  pet: NeopetsPet;
};

export function RelatedPets({ pet }: RelatedPetsProps) {
  const related = getRelatedPets(pet.id, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t-2 border-dashed border-[#ebe1d5] pt-12">
      <h2 className="mb-2 text-center text-3xl font-bold text-[#0d658c] md:text-left md:text-4xl" style={headlineFont}>
        More Pets You May Love
      </h2>
      <p className="mb-8 text-center text-[#40484e] md:text-left">
        Every card is a story waiting for a happy ending — maybe your next best friend is here.
      </p>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        {related.map((relatedPet) => (
          <NeopetsPetCard key={relatedPet.id} pet={relatedPet} />
        ))}
      </div>
    </section>
  );
}
