import Link from "next/link";
import { NeopetsExplorerSearch } from "@/components/templates/demos/neopets-nonprofit/NeopetsExplorerSearch";
import { NeopetsPetCard } from "@/components/templates/demos/neopets-nonprofit/NeopetsPetCard";
import { NEOPETS_PATHS } from "@/components/templates/demos/neopets-nonprofit/neopetsConfig";
import { NEOPETS_PETS } from "@/components/templates/demos/neopets-nonprofit/neopetsPets";

export function NeopetsExplorerBody() {
  return (
    <main className="np-paper-texture-fine relative mx-auto max-w-[1200px] overflow-hidden px-4 py-12 md:px-16">
      <NeopetsExplorerSearch />

      <div id="featured-pets" className="mb-12 scroll-mt-28 text-center md:text-left">
        <h2
          className="mb-2 text-5xl font-bold leading-[56px] text-[#0d658c]"
          style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
        >
          Meet Your New Best Friend
        </h2>
        <p className="max-w-2xl text-lg leading-7 text-[#40484e]">
          Collect your favorites and start a journey of a lifetime. Every card tells a story waiting for a happy
          ending.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        {NEOPETS_PETS.map((pet) => (
          <NeopetsPetCard key={pet.id} pet={pet} />
        ))}
      </div>

      <div className="pointer-events-none absolute right-0 top-10 hidden opacity-20 lg:block">
        <span className="material-symbols-outlined text-[120px] text-[#0d658c]">potted_plant</span>
      </div>
      <div className="pointer-events-none absolute bottom-20 left-0 hidden opacity-20 lg:block">
        <span className="material-symbols-outlined text-[100px] text-[#2e6b29]">nest_eco_leaf</span>
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-[#40484e]">
        New to adoption? Start with our{" "}
        <Link href={NEOPETS_PATHS.adoptionProcess} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Adoption Journey
        </Link>
        {" "}— or see{" "}
        <Link href={NEOPETS_PATHS.alerts} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Rescue Alerts
        </Link>{" "}
        and{" "}
        <Link href={NEOPETS_PATHS.successStories} className="font-semibold text-[#0d658c] underline-offset-2 hover:underline">
          Happy Tails
        </Link>
        .
      </p>
    </main>
  );
}
