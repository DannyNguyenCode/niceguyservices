import Image from "next/image";
import Link from "next/link";
import { HAPPY_TAILS_STORIES } from "./neopetsAdoptionData";
import { NEOPETS_PATHS } from "./neopetsConfig";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;
const handFont = { fontFamily: "var(--font-np-handwritten), cursive" } as const;

export function NeopetsSuccessStoriesBody() {
  return (
    <main className="np-scrapbook-bg min-h-screen pb-20">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-16">
        <div className="relative mb-16 text-center">
          <span className="mb-2 block -rotate-2 text-4xl text-[#2e6b29]" style={handFont}>
            Happy Tails
          </span>
          <h1
            className="mb-4 text-4xl font-bold leading-tight text-[#1f1b14] md:text-5xl"
            style={headlineFont}
          >
            Tail-Wagging Success Stories
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-7 text-[#40484e]">
            Real families, real transformations. Every adoption is a new chapter — see how our
            forever friends are thriving and get inspired to start your own journey.
          </p>
          <Link
            href={NEOPETS_PATHS.adoptionProcess}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl border-2 border-[#0d658c] bg-[#8fd3ff]/40 px-6 py-3 font-bold text-[#005c80] transition-all hover:bg-[#8fd3ff]"
          >
            <span className="material-symbols-outlined">map</span>
            Start Your Adoption Journey
          </Link>
        </div>

        <div className="space-y-16">
          {HAPPY_TAILS_STORIES.map((story, index) => (
            <article
              key={story.id}
              className={`np-sticker-shadow rounded-[28px] border-2 border-[#ebe1d5] bg-white p-6 md:p-8 ${
                index % 2 === 1 ? "md:ml-8" : "md:mr-8"
              }`}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-[#0d658c]" style={headlineFont}>
                    {story.petName}&apos;s Big Leap
                  </h2>
                  <p className="text-base text-[#40484e]">
                    {story.familyName} · {story.location}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-[#eec750] px-4 py-1 text-sm font-bold text-[#574400]">
                    {story.anniversary}
                  </span>
                  <span className="text-xs font-semibold text-[#70787f]">Adopted {story.adoptedDate}</span>
                </div>
              </div>

              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div className="group relative">
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-[#40484e] px-3 py-1 text-xs font-bold text-white">
                    Before
                  </span>
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl border-2 border-[#c0c7cf]">
                    <Image
                      src={story.beforeImage}
                      alt={story.beforeAlt}
                      fill
                      className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      sizes="400px"
                    />
                  </div>
                </div>
                <div className="group relative">
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-[#2e6b29] px-3 py-1 text-xs font-bold text-white">
                    After
                  </span>
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl border-2 border-[#adf19e]">
                    <Image
                      src={story.afterImage}
                      alt={story.afterAlt}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  </div>
                  <div className="np-paper-edge absolute -right-2 -top-2 rounded-full bg-[#eec750] px-4 py-1 text-sm font-semibold text-[#695300] shadow-sm">
                    Adopted!
                  </div>
                </div>
              </div>

              <blockquote className="mb-4 border-l-4 border-[#adf19e] pl-4 text-lg italic text-[#40484e]">
                &quot;{story.story}&quot;
              </blockquote>
              <p className="mb-6 rounded-xl bg-[#fcf2e6] p-4 text-base text-[#40484e]">
                <span className="font-bold text-[#2e6b29]">Update from the family: </span>
                {story.update}
              </p>

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#adf19e]">
                  <span className="material-symbols-outlined text-sm text-[#2e6b29]">favorite</span>
                </div>
                <span className="text-sm font-semibold text-[#1f1b14]">{story.familyName}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 rounded-[28px] border-2 border-dashed border-[#adf19e] bg-[#adf19e]/15 p-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#2e6b29]" style={headlineFont}>
            Your pet could be our next Happy Tail!
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-[#40484e]">
            Every story starts with one brave step. Browse adoptable pets or follow our guided
            adoption adventure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={NEOPETS_PATHS.explorer}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0d658c] px-8 py-4 font-bold text-white shadow-[0_4px_0_0_#004c6b] transition-all active:translate-y-1 active:shadow-none"
            >
              Meet Adoptable Pets
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link
              href={NEOPETS_PATHS.adoptionProcess}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#2e6b29] bg-white px-8 py-4 font-bold text-[#2e6b29]"
            >
              Find Your Perfect Match
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
