import type { Metadata } from "next";
import { PawsomeWriteReviewBody } from "@/components/templates/demos/pawsome/PawsomeWriteReviewBody";

export const metadata: Metadata = {
  title: "Write a Review - Pawsome (demo)",
};

export default function PawsomeWriteReviewPage() {
  return <PawsomeWriteReviewBody />;
}
