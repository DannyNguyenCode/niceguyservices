"use client";

import { useCallback, useState } from "react";
import { LoFooter, LoIcon, LoImg, LoNav } from "./LiquidOccasionsShared";
import { LiquidOccasionsThankYouModal } from "./LiquidOccasionsThankYouModal";
import { LO_IMAGES } from "./liquidOccasionsImages";

const TOTAL_STEPS = 4;

const CELEBRATIONS = [
  { type: "wedding", label: "Wedding", img: LO_IMAGES.journey.wedding },
  { type: "corporate", label: "Corporate", img: LO_IMAGES.journey.corporate },
  { type: "birthday", label: "Birthday", img: LO_IMAGES.journey.birthday },
  { type: "fundraiser", label: "Fundraiser", img: LO_IMAGES.journey.fundraiser },
  { type: "other", label: "Other", img: null },
] as const;

export function LiquidOccasionsJourneyBody() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setCelebration] = useState("");
  const [guests, setGuests] = useState(100);
  const [date, setDate] = useState("");
  const [vision, setVision] = useState("");
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [thankYouOpen, setThankYouOpen] = useState(false);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const selectCelebration = (type: string) => {
    setCelebration(type);
    setSelectedCircle(type);
    setTimeout(() => nextStep(), 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setThankYouOpen(true);
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const stepClass = (step: number) => {
    if (step === currentStep) return "lo-step-transition opacity-100 translate-y-0";
    if (step < currentStep) return "lo-step-transition hidden opacity-0 translate-y-10";
    return "lo-step-transition hidden opacity-0 translate-y-10";
  };

  return (
    <>
      <LoNav />
      <main className="relative min-h-screen overflow-x-hidden pb-20 pt-32">
        <div className="relative mx-auto mb-16 max-w-4xl px-[var(--lo-gutter)]">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--lo-surface-container-highest)]">
            <div
              className="lo-journey-path-active h-full bg-[var(--lo-secondary-container)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <span className="lo-label tracking-widest text-[var(--lo-primary)]">
              Step 0{currentStep}
            </span>
            <span className="lo-label tracking-widest text-[var(--lo-on-surface-variant)]">
              Vision Casting
            </span>
          </div>
        </div>

        <section className="relative z-10 mx-auto max-w-6xl px-[var(--lo-gutter)]">
          <form className="relative" onSubmit={handleSubmit}>
            <div className={stepClass(1)} id="step1">
              <div className="mb-12 text-center">
                <h1 className="lo-display mb-4 text-[var(--lo-on-surface)]">What are we celebrating?</h1>
                <p className="lo-body-lg mx-auto max-w-2xl text-[var(--lo-on-surface-variant)]">
                  Every great story begins with a reason. Choose the heart of your upcoming event.
                </p>
              </div>
              <div className="grid grid-cols-2 items-start justify-center gap-8 md:grid-cols-5">
                {CELEBRATIONS.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => selectCelebration(item.type)}
                    className="group flex cursor-pointer flex-col items-center gap-4 border-0 bg-transparent p-0"
                  >
                    <div
                      className={`lo-circular-selection relative h-32 w-32 overflow-hidden rounded-full border-4 border-transparent shadow-lg transition-all duration-500 hover:border-[var(--lo-secondary-container)] md:h-48 md:w-48 ${
                        selectedCircle === item.type ? "lo-selected-circle" : ""
                      }`}
                    >
                      {item.img ? (
                        <LoImg src={item.img} alt="" className="h-full w-full" width={192} height={192} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--lo-surface-container)]">
                          <LoIcon name="more_horiz" className="text-6xl text-[var(--lo-surface-variant)]" />
                        </div>
                      )}
                      <div className="lo-image-overlay absolute inset-0 bg-[color-mix(in_srgb,var(--lo-on-surface)_20%,transparent)] opacity-0 transition-opacity" />
                    </div>
                    <span className="lo-label tracking-widest transition-colors group-hover:text-[var(--lo-primary)]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className={stepClass(2)} id="step2">
              <div className="mb-12 text-center">
                <h1 className="lo-display mb-4 text-[var(--lo-on-surface)]">The Guest List</h1>
                <p className="lo-body-lg mx-auto max-w-2xl text-[var(--lo-on-surface-variant)]">
                  Scale is everything. Tell us roughly how many souls will share this experience.
                </p>
              </div>
              <div className="mx-auto max-w-2xl space-y-6">
                <input
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--lo-surface-container-highest)] accent-[var(--lo-primary)]"
                  id="guestSlider"
                  max={500}
                  min={10}
                  step={10}
                  type="range"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
                <div className="flex items-end justify-between">
                  <div className="lo-display text-[var(--lo-primary)]">{guests}+</div>
                  <div className="lo-label mb-4 tracking-widest text-[var(--lo-on-surface-variant)]">
                    Attendees
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-8">
                  {[50, 150, 300].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setGuests(val)}
                      className="rounded-full border border-[var(--lo-outline-variant)] py-4 font-bold transition-colors hover:bg-[var(--lo-surface-container)]"
                    >
                      {val === 300 ? "300+" : val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={stepClass(3)} id="step3">
              <div className="mb-12 text-center">
                <h1 className="lo-display mb-4 text-[var(--lo-on-surface)]">Mark the Calendar</h1>
                <p className="lo-body-lg mx-auto max-w-2xl text-[var(--lo-on-surface-variant)]">
                  Timing is the essence of flavor. When should the magic happen?
                </p>
              </div>
              <div className="mx-auto max-w-md">
                <label className="lo-label mb-2 block tracking-widest text-[var(--lo-on-surface-variant)]">
                  Event Date
                </label>
                <input
                  className="lo-body-md w-full rounded-full border border-[var(--lo-outline-variant)] bg-[var(--lo-surface-container-lowest)] p-6 transition-all focus:border-[var(--lo-primary)]"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div className="mt-8 flex items-center gap-4 text-[var(--lo-on-surface-variant)]">
                  <LoIcon name="info" />
                  <p className="text-sm italic">
                    Not sure yet? Choose an approximate date or leave it blank to discuss.
                  </p>
                </div>
              </div>
            </div>

            <div className={stepClass(4)} id="step4">
              <div className="mb-12 text-center">
                <h1 className="lo-display mb-4 text-[var(--lo-on-surface)]">Tell us your vision.</h1>
                <p className="lo-body-lg mx-auto max-w-2xl text-[var(--lo-on-surface-variant)]">
                  What does it feel like? What does it smell like? Let your imagination flow freely.
                </p>
              </div>
              <div className="mx-auto max-w-3xl">
                <textarea
                  className="lo-body-lg w-full resize-none rounded-xl border border-[var(--lo-outline-variant)] bg-[var(--lo-surface-container-lowest)] p-8 transition-all"
                  placeholder="Imagine a night where..."
                  rows={6}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                />
                <div className="mt-12 flex justify-center">
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--lo-primary)] px-12 py-6 text-lg font-bold text-[var(--lo-on-primary)] shadow-xl shadow-[color-mix(in_srgb,var(--lo-primary)_20%,transparent)] transition-all hover:scale-105 active:scale-95"
                  >
                    Finalize Journey Request
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-20 flex items-center justify-center gap-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 font-bold text-[var(--lo-on-surface-variant)] transition-colors hover:text-[var(--lo-primary)]"
                >
                  <LoIcon name="arrow_back" /> Back
                </button>
              ) : null}
              {currentStep < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-full bg-[var(--lo-secondary-container)] px-10 py-4 font-bold text-[var(--lo-on-secondary-container)] shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                >
                  Continue
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <div className="pointer-events-none absolute bottom-0 left-0 z-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block h-[150px] w-[calc(100%+1.3px)]" viewBox="0 0 1200 120" aria-hidden>
            <path
              className="fill-[var(--lo-surface-container-low)]"
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            />
          </svg>
        </div>
      </main>
      <LoFooter />
      <LiquidOccasionsThankYouModal open={thankYouOpen} onClose={() => setThankYouOpen(false)} />
    </>
  );
}
