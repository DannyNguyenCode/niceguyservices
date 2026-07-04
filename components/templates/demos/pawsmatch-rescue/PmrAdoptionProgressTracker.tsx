import type { PmrApplicationStatus } from "@/lib/templates/db/pawsmatch-rescue/types";
import { PMR_ADOPTION_STEPS } from "./pawsMatchRescueData";
import { getPmrAdoptionProgress, getPmrAdoptionStepTitle } from "./pmrAdoptionProgress";

type PmrAdoptionProgressTrackerProps = {
  status: PmrApplicationStatus;
  className?: string;
};

export function PmrAdoptionProgressTracker({ status, className = "" }: PmrAdoptionProgressTrackerProps) {
  const progress = getPmrAdoptionProgress(status);

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <p className="font-semibold text-[var(--pmr-brown)]">
          {progress.closed ? (
            <>Journey paused · {progress.closedLabel}</>
          ) : (
            <>
              Step {progress.currentStep} of {PMR_ADOPTION_STEPS.length} ·{" "}
              {getPmrAdoptionStepTitle(progress.currentStep!)}
            </>
          )}
        </p>
        {!progress.closed && progress.currentStep ? (
          <span className="shrink-0 text-[var(--pmr-brown-light)]">
            {progress.maxCompletedStep} completed
          </span>
        ) : null}
      </div>

      <ol
        className="mt-3 flex items-center gap-1"
        aria-label={
          progress.closed
            ? `Adoption progress paused after ${getPmrAdoptionStepTitle(progress.maxCompletedStep)}`
            : `Adoption progress: currently on ${getPmrAdoptionStepTitle(progress.currentStep!)}`
        }
      >
        {PMR_ADOPTION_STEPS.map((step) => {
          const done = step.step <= progress.maxCompletedStep;
          const active = !progress.closed && step.step === progress.currentStep;

          return (
            <li key={step.step} className="flex min-w-0 flex-1 items-center gap-1">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold ${
                  active
                    ? "bg-[var(--pmr-terracotta)] text-white ring-2 ring-[rgba(198,123,92,0.25)]"
                    : done
                      ? "bg-[var(--pmr-sage-light)] text-[var(--pmr-sage-muted)]"
                      : progress.closed
                        ? "bg-[var(--pmr-bg-warm)] text-[var(--pmr-brown-light)]"
                        : "bg-[var(--pmr-bg-warm)] text-[var(--pmr-brown-light)]"
                }`}
                title={step.title}
                aria-current={active ? "step" : undefined}
              >
                {step.step}
              </span>
              {step.step < PMR_ADOPTION_STEPS.length ? (
                <span
                  className={`hidden h-0.5 min-w-2 flex-1 sm:block ${
                    done ? "bg-[var(--pmr-sage-muted)]" : "bg-[var(--pmr-line)]"
                  } ${progress.closed && !done ? "opacity-50" : ""}`}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="mt-2 hidden text-xs text-[var(--pmr-brown-muted)] sm:block">
        {PMR_ADOPTION_STEPS.map((step) => step.title).join(" → ")}
      </p>
    </div>
  );
}
