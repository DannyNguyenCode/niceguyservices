import type { Metadata } from "next";
import { PawsomeOrderTrackBody } from "@/components/templates/demos/pawsome/PawsomeOrderTrackBody";

export const metadata: Metadata = {
  title: "Track Order - Pawsome (demo)",
};

export default function PawsomeOrderTrackPage() {
  return <PawsomeOrderTrackBody />;
}
