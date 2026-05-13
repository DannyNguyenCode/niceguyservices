import Image from "next/image";
import Link from "next/link";
import { LOONEYTOONS_CAFE_BASE } from "./looneytoonsCafeConfig";
import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";

const BASE = LOONEYTOONS_CAFE_BASE;

export function LooneyToonsCafeHomeBody() {
  return (
    <main className="overflow-x-hidden bg-[#f9f9ff] text-[#151c28] selection:bg-[#495E84] selection:text-white">
      <section className="relative flex min-h-[min(707px,90dvh)] items-center overflow-hidden px-4 py-20 md:px-16">
        <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h1 className="font-extrabold uppercase leading-tight [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10 md:text-[84px] md:leading-[90px] md:tracking-[-0.04em]">
              Premium Coffee. <br />
              <span className="text-[#495E84]">Cartoon Energy.</span>
            </h1>
            <p className="max-w-md text-base leading-6 text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              A tall-glass hospitality demo in Rubberhose Borough that blends artisanal roast yarns with the kinetic soul
              of mid-century animation.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href={`${BASE}/menu#order`}
                className="lt-squash-hover rounded-full border-2 border-black bg-[#495E84] px-8 py-4 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#000000] transition-all [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                Order Now
              </Link>
              <Link
                href={`${BASE}/menu`}
                className="lt-squash-hover rounded-full border-2 border-black bg-white px-8 py-4 text-sm font-bold text-black shadow-[4px_4px_0px_0px_#000000] transition-all [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                View Menu
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="lt-iris-out-frame absolute inset-0 scale-125 bg-[#495E84] opacity-20" aria-hidden />
            <div className="lt-retro-tv-mask relative z-10 aspect-4/3 w-full max-w-md bg-white">
              <Image
                src={LT_CAFE_IMAGES.heroCup}
                alt="Stylized ceramic coffee cup on a minimalist table"
                fill
                className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                sizes="(max-width: 768px) 100vw, 28rem"
                priority
              />
              <div className="lt-comic-halftone pointer-events-none absolute inset-0" aria-hidden />
              <div className="absolute top-4 right-4 -rotate-12 rounded-full border-2 border-black bg-[#495E84] p-4 text-sm font-bold text-white shadow-[2px_2px_0px_0px_#000000]">
                POW!
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-1/4 h-1 w-32 rounded-full bg-[#151c28] opacity-10" aria-hidden />
        <div className="absolute top-1/3 right-10 h-1 w-48 rounded-full bg-[#151c28] opacity-10" aria-hidden />
      </section>

      <div className="w-full overflow-hidden leading-[0]">
        <svg
          className="relative block h-[100px] w-[calc(100%+1.3px)]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          aria-hidden
        >
          <path className="fill-[#f9f9ff]" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" />
          <path
            className="fill-[#dde2f4] opacity-50"
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.94,10.74,105.77,21.07,52,15.45,105.2,29,159.47,24.11,54.56-4.88,101.14-30.16,151.29-49.44,55.5-21.3,115.14-41,176.62-23.7V0Z"
          />
        </svg>
      </div>

      <section className="bg-[#f9f9ff] px-4 py-20 md:px-16">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="mb-4 font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10 md:text-5xl md:leading-[52px] md:tracking-[-0.02em]">
            Daily Specials
          </h2>
          <div className="h-2 w-24 rounded-full border-2 border-black bg-[#495E84]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-6">
          <div className="group md:col-span-2 md:row-span-2">
            <div className="flex h-full flex-col justify-between rounded-[40px] border-2 border-[#151c28] bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <div className="lt-retro-tv-mask relative mb-6 aspect-video">
                <Image
                  src={LT_CAFE_IMAGES.bentoLarge}
                  alt="Latte with foam art"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <span className="mb-4 inline-block rounded-full border-2 border-black bg-[#495E84] px-3 py-1 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  SEASONAL
                </span>
                <h3 className="mb-2 font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10">
                  The Anvil Espresso
                </h3>
                <p className="text-base text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  Heavy-hitting roast with notes of dark chocolate and iron. Not for the faint of heart.
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-6 rounded-[40px] border-2 border-[#151c28] bg-[#e9edff] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1">
              <div className="lt-retro-tv-mask relative h-32 w-32 shrink-0">
                <Image src={LT_CAFE_IMAGES.coldBrew} alt="Cold brew" fill className="object-cover" sizes="128px" />
              </div>
              <div>
                <h3 className="mb-2 font-bold uppercase leading-none [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
                  Acme Cold Brew
                </h3>
                <p className="text-sm font-bold text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  Nitro-infused kinetic energy.
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-6 rounded-[40px] border-2 border-[#151c28] bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1">
              <div className="lt-retro-tv-mask relative h-32 w-32 shrink-0">
                <Image src={LT_CAFE_IMAGES.mocha} alt="Mocha" fill className="object-cover" sizes="128px" />
              </div>
              <div>
                <h3 className="mb-2 font-bold uppercase leading-none [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl">
                  Ink &amp; Cream Mocha
                </h3>
                <p className="text-sm font-bold text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  Smooth as a silk-screen print.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-[#dde2f4] px-4 py-20 md:px-16">
        <div className="lt-comic-halftone pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-10 grid gap-0 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:grid-cols-3">
          <div className="flex flex-col gap-4 border-b-4 border-black p-10 md:border-b-0 md:border-r-4">
            <span className="material-symbols-outlined text-5xl text-[#495E84]" aria-hidden>
              coffee_maker
            </span>
            <h3 className="font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10">
              Artisan Tech
            </h3>
            <p className="text-base [font-family:var(--font-lt-space),system-ui,sans-serif]">
              We use precision gear to dial in every shot, ensuring your morning rocket fuel is balanced to perfection.
            </p>
          </div>
          <div className="flex flex-col gap-4 border-black border-t-4 bg-[#f1f3ff] p-10 md:border-t-0 md:border-r-4">
            <span className="material-symbols-outlined text-5xl text-[#495E84]" aria-hidden>
              brush
            </span>
            <h3 className="font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10">
              Creative Soul
            </h3>
            <p className="text-base [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Designed as a playground for Rubberhose dreamers. Fast Wi-Fi, bold art, and even bolder flavors.
            </p>
          </div>
          <div className="flex flex-col gap-4 border-t-4 border-black p-10 md:border-t-0">
            <span className="material-symbols-outlined text-5xl text-[#495E84]" aria-hidden>
              bolt
            </span>
            <h3 className="font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl leading-10">
              Kinetic Flow
            </h3>
            <p className="text-base [font-family:var(--font-lt-space),system-ui,sans-serif]">
              The energy of a cartoon in every cup. We don&apos;t just serve coffee; we serve a vibe that moves you.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-4 py-20 md:px-16">
        <div className="relative rounded-[60px] border-4 border-[#151c28] bg-[#2a303e] p-12 text-[#edf0ff] shadow-[0px_10px_0px_0px_#495E84] md:p-20">
          <div className="absolute -top-10 -right-10 flex h-40 w-40 rotate-12 items-center justify-center rounded-full border-4 border-white bg-[#495E84]">
            <span className="material-symbols-outlined text-6xl text-white" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
              stars
            </span>
          </div>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-extrabold uppercase leading-none [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-6xl">
                Level Up Your Morning
              </h2>
              <p className="mb-8 text-xl opacity-80 [font-family:var(--font-lt-space),system-ui,sans-serif]">
                Join the Comet Streak rewards yarn. Earn stars, unlock secret menu tall tales, and snag faux free drops.
              </p>
              <Link
                href={`${BASE}/rewards`}
                className="inline-block rounded-full border-2 border-white bg-[#495E84] px-10 py-5 text-2xl font-bold uppercase transition-all hover:scale-105 [font-family:var(--font-lt-bricolage),system-ui,sans-serif]"
              >
                Sign Up Free
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:justify-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-white/20 bg-white/10">
                <span className="material-symbols-outlined text-4xl" aria-hidden>
                  coffee
                </span>
              </div>
              <div className="flex h-24 w-24 scale-110 items-center justify-center rounded-2xl border-4 border-white bg-[#495E84] shadow-[0px_0px_20px_rgba(73,94,132,0.5)]">
                <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                  stars
                </span>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-white/20 bg-white/10 opacity-50">
                <span className="material-symbols-outlined text-4xl" aria-hidden>
                  bakery_dining
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f9f9ff] px-4 py-20 md:px-16">
        <h2 className="mb-16 text-center font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
          The Buzz
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              quote:
                "Best flat white on the Inkwell Pier. The vibe is electric, like stepping into a premium animated short.",
              who: "@RubberhoseRoast",
              bg: "bg-white",
            },
            {
              quote:
                "Finally, a café that does not feel like a library. The music, the art, and that Acme cold brew... WOW.",
              who: "Sarah L.",
              bg: "bg-[#e2e8fa]",
              offset: "md:mt-8",
            },
            {
              quote:
                "Comet Cup Co. is my creative sanctuary. Every visit feels like a power-up. That mocha hits different!",
              who: "Artie M.",
              bg: "bg-white",
            },
          ].map((t) => (
            <div key={t.who} className={`relative group ${t.offset ?? ""}`}>
              <div
                className={`relative z-10 rounded-[40px] border-2 border-black p-8 shadow-[6px_6px_0px_0px_#000000] ${t.bg}`}
              >
                <p className="mb-4 text-lg italic [font-family:var(--font-lt-space),system-ui,sans-serif]">&ldquo;{t.quote}&rdquo;</p>
                <span className="text-sm font-bold uppercase text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
                  {t.who}
                </span>
              </div>
              <div
                className={`absolute -bottom-4 left-12 z-0 h-8 w-8 rotate-45 border-b-2 border-r-2 border-black ${t.bg}`}
                aria-hidden
              />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 md:px-16">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div className="lt-retro-tv-mask relative aspect-video w-full md:w-1/2">
            <Image
              src={LT_CAFE_IMAGES.location}
              alt="Cafe interior at Inkwell Pier (demo art)"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[#495E84]/10 mix-blend-multiply" aria-hidden />
          </div>
          <div className="flex w-full flex-col gap-6 md:w-1/2">
            <h2 className="font-extrabold uppercase leading-tight [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
              Located inside <br />
              <span className="text-[#495E84]">Inkwell Pier Arcade</span>
            </h2>
            <p className="text-lg [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Visit us where the sidewalk ends in Rubberhose Borough. We&apos;re easy to find but hard to leave.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold text-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              <span className="material-symbols-outlined" aria-hidden>
                location_on
              </span>
              <span>88 INKWELL PIER, RUBBERHOSE, RH</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
              <span className="material-symbols-outlined" aria-hidden>
                schedule
              </span>
              <span>DAILY: 7AM - 9PM</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f1f3ff] px-4 py-20 md:px-16">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-bold uppercase [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl">@CometCupDemo</h2>
          <span className="text-sm font-bold underline decoration-4 decoration-[#495E84] [font-family:var(--font-lt-space),system-ui,sans-serif]">
            Follow Us (demo)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[LT_CAFE_IMAGES.gallery1, LT_CAFE_IMAGES.gallery2, LT_CAFE_IMAGES.gallery3, LT_CAFE_IMAGES.gallery4].map(
            (src, i) => (
              <div key={src} className="lt-retro-tv-mask group relative aspect-square overflow-hidden">
                <Image
                  src={src}
                  alt={`Cafe gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
