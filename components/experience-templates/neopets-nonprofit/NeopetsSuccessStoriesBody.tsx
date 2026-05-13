import Image from "next/image";
import Link from "next/link";
import { NEOPETS_PATHS } from "@/components/experience-templates/neopets-nonprofit/neopetsConfig";

const BUSTER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDEpD0JmZ412AL2UKN9gsZhnKmJ88CGxxuvvmm2xVR0lMz7BJJzZSg49tFN_AHAeDXGjtcBtmVnXB22PPljTUVnJpudIFcyGDP7bIdHpHJeD38_9ZWLJoPkxEaz1XYG_MkAeDchomdxKA6Z8LHEQ6QDUWWsh6_HfCPSoZqFoLDJHuLzDPP2OcxWmCyBjWHD4Bhof9i2CUpXs8xFVp2jkOo5TIzHTHZ9ayZrmcrGdSOsy0tGLtXt8Lyt3IvMuKojQIjE5eQ9KWHoEw-x";

export function NeopetsSuccessStoriesBody() {
  return (
    <main className="np-scrapbook-bg min-h-screen pb-20">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-16">
        <div className="relative mb-16 text-center">
          <span
            className="mb-2 block rotate-[-2deg] text-4xl text-[#2e6b29]"
            style={{ fontFamily: "var(--font-np-handwritten), cursive" }}
          >
            Tail-Wagging Tales
          </span>
          <h2
            className="mb-4 text-5xl font-bold leading-[56px] text-[#1f1b14]"
            style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
          >
            Our Forever Home Heroes
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-7 text-[#40484e]">
            Every animal that passes through our doors has a unique story. These are the ones that found their perfect
            match in the heart of Toronto.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="group relative">
            <div className="np-polaroid-rotate-left rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 shadow-lg transition-transform duration-300 group-hover:rotate-0">
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <div className="relative aspect-[4/5] w-full">
                  <Image src={BUSTER} alt="Buster before and after" fill className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0" sizes="400px" />
                </div>
                <div className="np-paper-edge absolute right-4 top-4 rounded-full bg-[#eec750] px-4 py-1 text-sm font-semibold text-[#695300] shadow-sm">
                  Adopted!
                </div>
              </div>
              <div className="space-y-4">
                <h3
                  className="text-2xl font-semibold text-[#0d658c]"
                  style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
                >
                  Buster&apos;s Big Leap
                </h3>
                <p className="text-base italic text-[#40484e]">
                  &quot;He went from hiding under the shelter cot to claiming the middle of our king-sized bed.&quot;
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#adf19e]">
                    <span className="material-symbols-outlined text-sm text-[#2e6b29]">favorite</span>
                  </div>
                  <span className="text-sm font-semibold text-[#1f1b14]">The Miller Family</span>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d658c] px-6 py-3 font-bold text-white shadow-[0_4px_0_0_#004c6b] transition-all active:translate-y-1 active:shadow-none"
                >
                  Read Their Story
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative mt-8 group md:mt-0">
            <div className="np-polaroid-rotate-right rounded-[24px] border-2 border-dashed border-[#c0c7cf] bg-[#fcf2e6] p-8 shadow-lg transition-transform duration-300 group-hover:rotate-0">
              <p className="mb-4 text-center text-base text-[#40484e]">
                Luna spent 400 days waiting for a home. Now she helps Sarah manage a small indie bookstore in Kensington
                Market.
              </p>
              <Link
                href={NEOPETS_PATHS.explorer}
                className="block w-full rounded-xl bg-[#2e6b29] py-3 text-center font-bold text-white shadow-[0_4px_0_0_#135212] transition-all active:translate-y-1 active:shadow-none"
              >
                Explore Luna&apos;s Tale
              </Link>
            </div>
          </div>

          <div className="relative lg:mt-16">
            <div className="relative z-20 rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 shadow-xl transition-all duration-300 group-hover:scale-105">
              <h3
                className="text-2xl font-semibold text-[#745b00]"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                Cooper &amp; The Crew
              </h3>
              <p className="mt-4 text-base italic text-[#40484e]">
                &quot;We didn&apos;t just get a pet; we found the missing piece of our family puzzle.&quot;
              </p>
              <Link
                href={NEOPETS_PATHS.community}
                className="mt-6 block w-full rounded-xl bg-[#745b00] py-3 text-center font-bold text-white shadow-[0_4px_0_0_#574400] transition-all active:translate-y-1 active:shadow-none"
              >
                See More Photos
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <button
            type="button"
            className="mx-auto inline-flex items-center gap-2 rounded-2xl border-2 border-[#0d658c] bg-[#ebe1d5] px-12 py-4 font-bold text-[#0d658c] transition-colors hover:bg-[#8fd3ff]"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            Load More Heartwarming Stories
          </button>
        </div>
      </div>
    </main>
  );
}
