import Link from "next/link";
import { NEOPETS_PATHS } from "../neopetsConfig";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;
const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

const QUEST_STEPS = [
  { step: 1, title: "Meet your match", icon: "favorite", description: "Browse profiles and fall for a furry friend." },
  { step: 2, title: "Submit application", icon: "edit_note", description: "Tell us about your home and lifestyle." },
  { step: 3, title: "Shelter review", icon: "verified_user", description: "Our team ensures a safe, happy match." },
  { step: 4, title: "Meet & greet", icon: "waving_hand", description: "Schedule a visit with foster families." },
  { step: 5, title: "Bring them home", icon: "cottage", description: "Welcome day — your new chapter begins!" },
] as const;

export function AdoptionQuest() {
  return (
    <section className="rounded-[24px] border-2 border-[#adf19e] bg-[#adf19e]/15 p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#2e6b29]" style={bodyFont}>
            Adoption Quest
          </p>
          <h2 className="text-2xl font-bold text-[#1f1b14] md:text-3xl" style={headlineFont}>
            Your journey to forever
          </h2>
        </div>
        <Link
          href={NEOPETS_PATHS.adoptionProcess}
          className="np-focus-ring text-sm font-semibold text-[#0d658c] underline-offset-2 hover:underline"
        >
          See full adventure map →
        </Link>
      </div>

      <ol className="relative space-y-0">
        {QUEST_STEPS.map((step, i) => (
          <li key={step.step} className="relative flex gap-4 pb-8 last:pb-0">
            {i < QUEST_STEPS.length - 1 ? (
              <span
                className="absolute left-5 top-12 h-[calc(100%-2rem)] w-0.5 bg-[#adf19e]"
                aria-hidden
              />
            ) : null}
            <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#2e6b29] bg-white text-sm font-bold text-[#2e6b29]">
              {step.step}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl border-2 border-[#ebe1d5] bg-white p-4 shadow-[4px_4px_0px_0px_#ebe1d5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2e6b29]">{step.icon}</span>
                <h3 className="font-bold text-[#1f1b14]" style={headlineFont}>
                  {step.title}
                </h3>
              </div>
              <p className="mt-1 text-sm text-[#40484e]" style={bodyFont}>
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
