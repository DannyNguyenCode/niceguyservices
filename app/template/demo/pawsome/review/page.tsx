import type { Metadata } from "next";
import { PawsomeReviewBody } from "@/components/templates/demos/pawsome/PawsomeReviewBody";

export const metadata: Metadata = {
  title: "Rate Your Experience - Pawsome (demo)",
};

export default function PawsomeReviewPage() {
  return <PawsomeReviewBody />;
}
