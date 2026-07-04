import type { PmrApplicationStatus } from "@/lib/templates/db/pawsmatch-rescue/types";
import { PMR_ADMIN_SETTABLE_STATUSES } from "@/lib/templates/db/pawsmatch-rescue/types";

export type PmrStatusMeta = {
  label: string;
  headline: string;
  message: string;
  tone: "neutral" | "info" | "success" | "warning";
};

export const PMR_APPLICATION_STATUS: Record<PmrApplicationStatus, PmrStatusMeta> = {
  pending: {
    label: "Pending",
    headline: "Finish your application",
    message:
      "You started an application but haven't submitted it yet. Take your time — we're here when you're ready.",
    tone: "neutral",
  },
  under_review: {
    label: "Under Review",
    headline: "We're reviewing your application",
    message:
      "Our adoption team is carefully reading through your answers. We'll reach out within 2–3 business days.",
    tone: "info",
  },
  denied: {
    label: "Not Approved",
    headline: "We can't move forward right now",
    message:
      "We're sorry — we aren't able to approve this adoption at this time. You're welcome to apply for another pet or contact us with questions.",
    tone: "warning",
  },
  approved: {
    label: "Approved",
    headline: "You're approved!",
    message:
      "Congratulations! We'll contact you to schedule a meet-and-greet and walk you through welcome-home next steps.",
    tone: "success",
  },
  withdrawn: {
    label: "Withdrawn",
    headline: "You withdrew this application",
    message:
      "You let us know you're no longer interested in this pet. If your situation changes, you're welcome to apply again or browse other adoptable pets.",
    tone: "neutral",
  },
  pet_unavailable: {
    label: "Pet Unavailable",
    headline: "This pet was approved for another home",
    message:
      "Thank you for your interest — this pet has been approved for adoption to another applicant. We hope you'll find another great match in our listings.",
    tone: "warning",
  },
};

export { PMR_ADMIN_SETTABLE_STATUSES };

export function pmrStatusBadgeClass(tone: PmrStatusMeta["tone"]): string {
  switch (tone) {
    case "success":
      return "bg-emerald-100 text-emerald-800";
    case "warning":
      return "bg-rose-100 text-rose-800";
    case "info":
      return "bg-sky-100 text-sky-800";
    default:
      return "bg-amber-100 text-amber-800";
  }
}
