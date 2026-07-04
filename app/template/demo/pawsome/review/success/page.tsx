import type { Metadata } from "next";
import { PawsomeReviewSuccessBody } from "@/components/templates/demos/pawsome/PawsomeReviewSuccessBody";

export const metadata: Metadata = {
  title: "Review Submitted - Pawsome (demo)",
};

export default function PawsomeReviewSuccessPage() {
  return <PawsomeReviewSuccessBody />;
}
