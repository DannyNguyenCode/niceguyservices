import Image from "next/image";
import Link from "next/link";
import type { NeopetsPet } from "./neopetsPets";
import { petDetailHref } from "./neopetsPets";

type NeopetsPetCardProps = {
  pet: NeopetsPet;
};

function badgeStyles(name: string): string {
  if (name === "Marty") return "border-[#695300] bg-[#eec750] text-[#695300]";
  if (name === "Ayla") return "border-[#326f2d] bg-[#adf19e] text-[#326f2d]";
  return "border-[#005c80] bg-[#8fd3ff] text-[#005c80]";
}

export function NeopetsPetCard({ pet }: NeopetsPetCardProps) {
  const detailHref = petDetailHref(pet.id);

  return (
    <article
      className={`group relative rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 ${pet.shadow} transition-all duration-300 hover:-translate-y-1 ${pet.mdOffset}`}
    >
      <div
        className={`absolute ${pet.badgePos} z-10 rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-sm ${badgeStyles(pet.name)}`}
        style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
      >
        {pet.badge}
      </div>

      <Link href={detailHref} className="np-focus-ring block rounded-lg">
        <div
          className={`np-scrapbook-border mb-6 rounded-lg bg-white p-3 pb-8 transition-transform duration-500 ${pet.polaroid}`}
        >
          <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-sm">
            <Image
              src={pet.img}
              alt={`${pet.name} the ${pet.breed}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 33vw"
            />
          </div>
          <p
            className="text-center text-2xl font-semibold leading-8 text-[#1f1b14]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            {pet.name}
          </p>
        </div>
      </Link>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-wider ${pet.breedColor}`}>
              {pet.breed}
            </p>
            <p className="text-base text-[#40484e]">{pet.age}</p>
          </div>
          <span className="material-symbols-outlined text-[#0d658c]">{pet.stickerIcon}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {pet.tags.map((t, i) => (
            <span key={t} className={`rounded-full px-3 py-1 text-sm font-semibold ${pet.tagColors[i]}`}>
              {t}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm font-semibold">
            <span>Energy Level</span>
            <span>{pet.energyLabel}</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full border border-[#c0c7cf] bg-[#ebe1d5]">
            <div
              className={`h-full rounded-full border-r-4 border-white ${pet.energyColor}`}
              style={{ width: `${pet.energy}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#135212]">
          <span className="material-symbols-outlined text-[#2e6b29]">{pet.perk.icon}</span>
          <span className="text-sm font-semibold">{pet.perk.text}</span>
        </div>
        <Link
          href={detailHref}
          className={`np-focus-ring block w-full rounded-xl py-4 text-center text-xl font-semibold transition-transform hover:scale-[0.98] ${pet.btnClass}`}
        >
          Adopt Me
        </Link>
      </div>
    </article>
  );
}
