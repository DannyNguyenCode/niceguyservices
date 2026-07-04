"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ADOPTION_JOURNEY_STEPS,
  ADOPTION_STEP_CTAS,
  ADOPTION_WARM_PHRASES,
  type AdoptionStepId,
} from "./neopetsAdoptionData";
import { NEOPETS_PATHS } from "./neopetsConfig";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;
const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;
const handFont = { fontFamily: "var(--font-np-handwritten), cursive" } as const;

function PawPrint({ filled = false }: { filled?: boolean }) {
  return (
    <span
      className={`material-symbols-outlined text-xl ${filled ? "np-icon-filled text-[#2e6b29]" : "text-[#c0c7cf]"}`}
      aria-hidden
    >
      pets
    </span>
  );
}

function StepCtaBlock({ stepIndex }: { stepIndex: number }) {
  const label = ADOPTION_STEP_CTAS[stepIndex % ADOPTION_STEP_CTAS.length];
  const href =
    stepIndex % 2 === 0 ? NEOPETS_PATHS.explorer : NEOPETS_PATHS.adoptionProcess;

  return (
    <div className="mt-8 rounded-2xl border-2 border-dashed border-[#adf19e] bg-[#adf19e]/20 p-6 text-center">
      <p className="mb-3 text-sm font-semibold text-[#2e6b29]" style={bodyFont}>
        Ready for the next paw print?
      </p>
      <Link
        href={href}
        className="np-chunky-button inline-flex items-center gap-2 rounded-2xl bg-[#2e6b29] px-8 py-3 font-bold text-white shadow-[0_4px_0_0_#135212] transition-all active:translate-y-1 active:shadow-none"
      >
        <span className="material-symbols-outlined text-lg">favorite</span>
        {label}
      </Link>
    </div>
  );
}

export function NeopetsAdoptionProcessBody() {
  const [activeStep, setActiveStep] = useState<AdoptionStepId>("explore");
  const [completedSteps, setCompletedSteps] = useState<Set<AdoptionStepId>>(new Set());

  const activeIndex = ADOPTION_JOURNEY_STEPS.findIndex((s) => s.id === activeStep);
  const progressPercent = Math.round(
    ((completedSteps.size + (completedSteps.has(activeStep) ? 0 : 0.5)) /
      ADOPTION_JOURNEY_STEPS.length) *
      100,
  );

  const markComplete = useCallback(
    (id: AdoptionStepId) => {
      setCompletedSteps((prev) => new Set(prev).add(id));
      const idx = ADOPTION_JOURNEY_STEPS.findIndex((s) => s.id === id);
      const next = ADOPTION_JOURNEY_STEPS[idx + 1];
      if (next) setActiveStep(next.id);
    },
    [],
  );

  const activeStepData = ADOPTION_JOURNEY_STEPS[activeIndex];

  return (
    <main className="np-adventure-map np-scrapbook-bg min-h-screen pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-8 pt-12 md:px-16 md:pt-16">
        <div className="np-cloud-shape absolute -right-16 top-8 h-48 w-48 bg-[#8fd3ff]/25 blur-xl" aria-hidden />
        <div className="np-cloud-shape absolute -left-12 bottom-0 h-56 w-56 bg-[#adf19e]/20 blur-xl" aria-hidden />

        <div className="relative mx-auto max-w-[1200px] text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0d658c]/10 px-4 py-2 text-sm font-semibold text-[#0d658c]" style={bodyFont}>
            <span className="material-symbols-outlined text-base">map</span>
            Adoption Adventure Map
          </span>
          <h1
            className="mb-4 text-4xl font-bold leading-tight text-[#0d658c] md:text-5xl lg:text-[3.25rem]"
            style={headlineFont}
          >
            Your Journey To A Forever Friend
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-7 text-[#40484e]">
            Adopting a pet is a life-changing decision. We&apos;re here to guide you every step of
            the way and help you find the perfect companion.
          </p>
          <p className="mt-4 text-base text-[#2e6b29]" style={handFont}>
            No scary paperwork — just a welcoming quest!
          </p>
        </div>
      </section>

      {/* Progress tracker */}
      <section className="sticky top-[7.5rem] z-30 border-y border-[#ebe1d5] bg-[#fff8f2]/95 px-4 py-4 backdrop-blur-sm md:px-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-[#0d658c]" style={bodyFont}>
              Quest Progress
            </span>
            <span className="text-sm font-bold text-[#2e6b29]" style={bodyFont}>
              {completedSteps.size} / {ADOPTION_JOURNEY_STEPS.length} checkpoints
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#ebe1d5]">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#0d658c] to-[#2e6b29] transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 8)}%` }}
              role="progressbar"
              aria-valuenow={completedSteps.size}
              aria-valuemin={0}
              aria-valuemax={ADOPTION_JOURNEY_STEPS.length}
              aria-label="Adoption journey progress"
            />
          </div>
          <div className="np-paw-trail mt-4 flex justify-between overflow-x-auto pb-1">
            {ADOPTION_JOURNEY_STEPS.map((step) => {
              const done = completedSteps.has(step.id);
              const active = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`np-paw-checkpoint flex shrink-0 flex-col items-center gap-1 px-1 transition-transform ${active ? "scale-110" : "opacity-70 hover:opacity-100"}`}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Step ${step.step}: ${step.title}${done ? " (completed)" : ""}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      done
                        ? "border-[#2e6b29] bg-[#adf19e]"
                        : active
                          ? "border-[#0d658c] bg-[#8fd3ff]/40"
                          : "border-[#c0c7cf] bg-white"
                    }`}
                  >
                    <PawPrint filled={done || active} />
                  </div>
                  <span className="hidden text-[10px] font-bold uppercase tracking-wide text-[#40484e] sm:block" style={bodyFont}>
                    {step.step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quest map + detail panel */}
      <section className="px-4 py-12 md:px-16">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[280px_1fr]">
          {/* Map sidebar — checkpoint list */}
          <nav className="hidden lg:block" aria-label="Adoption journey checkpoints">
            <div className="relative space-y-2 pl-4 before:absolute before:bottom-2 before:left-[23px] before:top-2 before:w-0 before:border-l-4 before:border-dashed before:border-[#0d658c]/25 before:content-['']">
              {ADOPTION_JOURNEY_STEPS.map((step) => {
                const done = completedSteps.has(step.id);
                const active = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`np-checkpoint-card relative flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                      active
                        ? "np-sticker-shadow border-[#0d658c] bg-white"
                        : "border-transparent bg-[#fcf2e6]/80 hover:border-[#c0c7cf]"
                    }`}
                  >
                    <div
                      className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        done ? "bg-[#2e6b29] text-white" : "bg-[#0d658c] text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{step.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#745b00]" style={bodyFont}>
                        Step {step.step}
                      </span>
                      <p className="text-sm font-semibold leading-snug text-[#1f1b14]" style={headlineFont}>
                        {step.title}
                      </p>
                      {done ? (
                        <span className="np-achievement-badge mt-1 inline-flex items-center gap-1 rounded-full bg-[#eec750] px-2 py-0.5 text-[10px] font-bold text-[#574400]">
                          <span className="material-symbols-outlined text-xs">emoji_events</span>
                          {step.badge}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Active step detail */}
          {activeStepData ? (
            <article className="np-checkpoint-detail rounded-[28px] border-2 border-[#8fd3ff] bg-white p-6 shadow-[0_8px_0_0_rgba(13,101,140,0.08)] md:p-10">
              <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#0d658c] text-white shadow-lg">
                    <span className="material-symbols-outlined text-4xl">{activeStepData.icon}</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider text-[#745b00]" style={bodyFont}>
                      Checkpoint {activeStepData.step}
                    </span>
                    <h2 className="text-3xl font-bold text-[#1f1b14] md:text-4xl" style={headlineFont}>
                      {activeStepData.title}
                    </h2>
                  </div>
                </div>
                {completedSteps.has(activeStepData.id) ? (
                  <span className="np-achievement-badge inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#eec750] px-4 py-2 text-sm font-bold text-[#574400]">
                    <span className="material-symbols-outlined">emoji_events</span>
                    {activeStepData.badge} Unlocked!
                  </span>
                ) : null}
              </div>

              <p className="mb-8 text-lg leading-7 text-[#40484e]">{activeStepData.subtitle}</p>

              {/* Pet companion guide */}
              <aside className="mb-8 flex gap-4 rounded-2xl border-2 border-[#adf19e] bg-[#adf19e]/15 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2e6b29] text-white">
                  <span className="material-symbols-outlined text-3xl">{activeStepData.companionIcon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2e6b29]" style={bodyFont}>
                    {activeStepData.companionName} says:
                  </p>
                  <p className="mt-1 text-base italic text-[#40484e]">&quot;{activeStepData.companionTip}&quot;</p>
                </div>
              </aside>

              {activeStepData.highlight ? (
                <blockquote className="mb-8 border-l-4 border-[#eec750] bg-[#fcf2e6] px-6 py-4 text-lg font-semibold text-[#745b00]" style={headlineFont}>
                  {activeStepData.highlight}
                </blockquote>
              ) : null}

              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                {activeStepData.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-base text-[#40484e]">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-lg text-[#2e6b29]">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>

              {activeStepData.extra ? (
                <div className="mb-8 rounded-2xl border-2 border-dashed border-[#c0c7cf] bg-[#fcf2e6] p-6">
                  <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-[#0d658c]" style={headlineFont}>
                    <span className="material-symbols-outlined">quiz</span>
                    {activeStepData.extra.title}
                  </h3>
                  <p className="mb-4 text-base text-[#40484e]">{activeStepData.extra.description}</p>
                  {activeStepData.extra.items ? (
                    <div className="flex flex-wrap gap-2">
                      {activeStepData.extra.items.map((q) => (
                        <span
                          key={q}
                          className="rounded-full border border-[#0d658c]/30 bg-white px-3 py-1 text-sm font-semibold text-[#0d658c]"
                        >
                          {q}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {activeStepData.reviewStages ? (
                <div className="mb-8">
                  <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[#40484e]" style={bodyFont}>
                    {ADOPTION_WARM_PHRASES.preparingForeverHome}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {activeStepData.reviewStages.map((stage, i) => (
                      <div key={stage.label} className="flex flex-1 items-center gap-2">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            stage.done ? "bg-[#2e6b29] text-white" : "border-2 border-[#c0c7cf] bg-white text-[#70787f]"
                          }`}
                        >
                          {stage.done ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span className="text-sm font-semibold text-[#1f1b14]">{stage.label}</span>
                        {i < activeStepData.reviewStages!.length - 1 ? (
                          <span className="material-symbols-outlined hidden shrink-0 text-[#c0c7cf] sm:inline">arrow_forward</span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href={activeStepData.cta.href}
                  className="np-chunky-button inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0d658c] px-8 py-4 font-bold text-white shadow-[0_4px_0_0_#004c6b] transition-all active:translate-y-1 active:shadow-none"
                >
                  {activeStepData.cta.label}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                {!completedSteps.has(activeStepData.id) ? (
                  <button
                    type="button"
                    onClick={() => markComplete(activeStepData.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#2e6b29] bg-[#adf19e]/30 px-6 py-4 font-bold text-[#2e6b29] transition-all hover:bg-[#adf19e]/50"
                  >
                    <span className="material-symbols-outlined">emoji_events</span>
                    Mark Checkpoint Complete
                  </button>
                ) : null}
              </div>

              <StepCtaBlock stepIndex={activeIndex} />
            </article>
          ) : null}
        </div>
      </section>

      {/* Quick links */}
      <section className="border-t border-[#ebe1d5] px-4 py-12 md:px-16">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-[#1f1b14]" style={headlineFont}>
            More Resources For Your Quest
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={NEOPETS_PATHS.checklist}
              className="np-pressable-btn rounded-2xl border-2 border-[#745b00] bg-[#ffe089] px-6 py-3 font-bold text-[#574400]"
            >
              Adoption Checklist Hub
            </Link>
            <Link
              href={NEOPETS_PATHS.successStories}
              className="np-pressable-btn rounded-2xl border-2 border-[#2e6b29] bg-[#adf19e] px-6 py-3 font-bold text-[#135212]"
            >
              Happy Tails Stories
            </Link>
            <Link
              href={NEOPETS_PATHS.explorer}
              className="np-pressable-btn rounded-2xl border-2 border-[#0d658c] bg-[#8fd3ff] px-6 py-3 font-bold text-[#005c80]"
            >
              Meet Adoptable Pets
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
