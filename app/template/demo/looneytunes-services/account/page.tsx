import type { Metadata } from "next";
import { LooneyToonsCafeAccountBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeAccountBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | My account (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/account") },
};

export default function LooneyToonsCafeAccountPage() {
  return <LooneyToonsCafeAccountBody />;
}
