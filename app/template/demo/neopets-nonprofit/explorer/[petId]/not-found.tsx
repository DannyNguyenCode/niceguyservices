import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/templates/demos/neopets-nonprofit/neopetsConfig";

export default function NeopetsPetNotFound() {
  return (
    <main className="np-paper-texture-fine mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="material-symbols-outlined mb-4 text-6xl text-[#8fd3ff]">search_off</span>
      <h1
        className="text-3xl font-bold text-[#0d658c]"
        style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
      >
        Hmm, we couldn&apos;t find that pet
      </h1>
      <p
        className="mt-4 text-base text-[#40484e]"
        style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
      >
        They may have already found their forever home! Browse our adoptable friends and start a new
        adventure.
      </p>
      <Link
        href={NEOPETS_PATHS.explorer}
        className="np-focus-ring np-chunky-button mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0d658c] px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="material-symbols-outlined">explore</span>
        Back to Explorer
      </Link>
    </main>
  );
}
