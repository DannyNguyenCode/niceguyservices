import type { PmrApplicationStatus } from "@/lib/templates/db/pawsmatch-rescue/types";
import { PMR_ADOPTION_STEPS } from "./pawsMatchRescueData";

export type PmrAdoptionProgress = {
  /** Active step (1–5), or null when the journey stopped */
  currentStep: number | null;
  /** Highest step fully completed */
  maxCompletedStep: number;
  closed: boolean;
  closedLabel?: string;
};

export function getPmrAdoptionProgress(status: PmrApplicationStatus): PmrAdoptionProgress {
  switch (status) {
    case "pending":
      return { currentStep: 2, maxCompletedStep: 1, closed: false };
    case "under_review":
      return { currentStep: 3, maxCompletedStep: 2, closed: false };
    case "approved":
      return { currentStep: 4, maxCompletedStep: 3, closed: false };
    case "denied":
      return { currentStep: null, maxCompletedStep: 2, closed: true, closedLabel: "Process ended" };
    case "withdrawn":
      return { currentStep: null, maxCompletedStep: 2, closed: true, closedLabel: "You withdrew" };
    case "pet_unavailable":
      return {
        currentStep: null,
        maxCompletedStep: 2,
        closed: true,
        closedLabel: "Pet placed elsewhere",
      };
  }
}

export function getPmrAdoptionStepTitle(step: number): string {
  return PMR_ADOPTION_STEPS.find((row) => row.step === step)?.title ?? `Step ${step}`;
}
