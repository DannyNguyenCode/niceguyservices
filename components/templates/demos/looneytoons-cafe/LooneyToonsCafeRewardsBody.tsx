import Image from "next/image";
import Link from "next/link";
import { LT_PATHS } from "./looneytoonsCafeConfig";
import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";
import { LT_STAR_TIERS } from "./looneytoonsCafeRewardsData";
import { LooneyToonsRewardsProgress } from "./LooneyToonsRewardsProgress";

export function LooneyToonsCafeRewardsBody() {
  return (
    <main className="relative bg-[#f9f9ff] text-[#151c28] selection:bg-[#dde2f4] selection:text-[#151c28]">
      <section className="relative overflow-hidden px-4 py-20 md:px-16">
        <div className="lt-halftone-light pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <span className="material-symbols-outlined animate-bounce text-[64px] text-[#d4daec]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
              stars
            </span>
            <span
              className="material-symbols-outlined absolute -top-4 -right-8 text-[32px] text-[#d4daec] opacity-50"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              stars
            </span>
          </div>
          <h1 className="mb-6 font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-[84px] md:leading-[90px]">
            Earn stars. <br />
            Unlock rewards.
          </h1>
          <LooneyToonsRewardsProgress />
        </div>
      </section>

      <div
        className="h-20 rotate-180 border-t-4 border-[#151c28] bg-[#e2e8fa]"
        style={{
          clipPath: "ellipse(60% 100% at 50% 0%)",
        }}
        aria-hidden
      />

      <section className="bg-[#e2e8fa] px-4 py-20 md:px-16">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <div className="mb-4 inline-block rounded-full bg-[#151c28] px-4 py-2 text-sm font-bold text-[#f9f9ff] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Join the club
            </div>
            <h2 className="font-bold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-5xl">
              Unlock the <br />
              full arcade mode.
            </h2>
            <p className="max-w-md text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Sign up to track your coffee journey, earn exclusive badges, and claim your free birthday handcrafted drink.
              Guest checkout works without an account — rewards require sign in.
            </p>
            <div className="max-w-sm space-y-3">
              <Link
                href={`${LT_PATHS.login}#register`}
                className="block w-full rounded-full border-4 border-[#151c28] bg-[#151c28] py-4 text-center text-base font-bold text-[#f9f9ff] shadow-[4px_4px_0px_0px_rgba(212,218,236,1)] transition-all hover:scale-[0.98] active:translate-y-1 [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                Create account
              </Link>
              <Link
                href={LT_PATHS.login}
                className="block w-full rounded-full border-4 border-[#151c28] bg-[#f9f9ff] py-4 text-center text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:scale-[0.98] [font-family:var(--font-lt-space),system-ui,sans-serif]"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="lt-retro-tv-rewards relative aspect-4/3 overflow-hidden bg-[#151c28] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-transform duration-500 group-hover:-translate-y-2">
              <Image
                src={LT_CAFE_IMAGES.rewardsLatte}
                alt="Latte art macro"
                fill
                className="object-cover opacity-80 mix-blend-screen grayscale"
                sizes="50vw"
              />
              <div className="lt-halftone-light pointer-events-none absolute inset-0 mix-blend-overlay" aria-hidden />
            </div>
            <div className="absolute -top-8 -right-4 rotate-6 rounded-2xl border-4 border-[#151c28] bg-[#f9f9ff] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-sm font-bold text-[#ba1a1a] [font-family:var(--font-lt-space),system-ui,sans-serif]">Free drink!</p>
              <div className="lt-speech-bubble-tail absolute -bottom-3 right-8 h-6 w-6 bg-[#f9f9ff] border-r-4 border-b-4 border-[#151c28]" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f9f9ff] px-4 py-24 md:px-16">
        <h2 className="mb-16 text-center font-bold underline decoration-[#d4daec] decoration-4 underline-offset-8 [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl">
          The reward tiers
        </h2>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {LT_STAR_TIERS.map((tier) => (
            <div
              key={tier.stars}
              className={`group rounded-2xl border-4 border-[#151c28] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 hover:-translate-y-2 ${tier.dark && tier.elite ? "bg-[#d4daec]" : "bg-[#f9f9ff]"}`}
            >
              <div className="mb-6 flex items-start justify-between">
                <div className={`rounded-full border-2 border-[#151c28] px-3 py-1 text-xs font-bold [font-family:var(--font-lt-space),system-ui,sans-serif] ${tier.chip}`}>
                  {tier.label}
                </div>
                <span className="material-symbols-outlined text-[#d4daec]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden>
                  stars
                </span>
              </div>
              <div className="lt-retro-tv-rewards relative mb-6 h-40 bg-[#e9edff]">
                <Image
                  src={tier.img}
                  alt={tier.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="200px"
                />
              </div>
              <ul className={`space-y-3 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif] ${tier.elite ? "text-[#151c28]" : "text-[#444748]"}`}>
                {tier.items.map((li) => (
                  <li key={li} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm" aria-hidden>
                      check_circle
                    </span>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t-4 border-[#151c28] bg-[#2a303e] px-4 py-20 text-center text-[#edf0ff] md:px-16">
        <div className="lt-halftone-light pointer-events-none absolute inset-0 -z-10 opacity-20" aria-hidden />
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-4xl md:text-6xl">Ready to play?</h2>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <Link
              href={LT_PATHS.menu}
              className="rounded-full border-4 border-[#151c28] bg-[#f9f9ff] px-12 py-5 text-base font-bold text-[#151c28] shadow-[6px_6px_0px_0px_rgba(212,218,236,1)] transition-transform hover:scale-95 [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              Start earning
            </Link>
            <p className="max-w-xs text-base text-[#edf0ff]/70 [font-family:var(--font-lt-space),system-ui,sans-serif]">
              Or scan your imaginary punch card at the Inkwell Pier kiosk — demo smoke and mirrors only.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
