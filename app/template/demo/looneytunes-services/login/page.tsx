import type { Metadata } from "next";
import { LooneyToonsCafeLoginBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeLoginBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Sign in (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/login") },
};

export default function LooneyToonsCafeLoginPage() {
  return <LooneyToonsCafeLoginBody />;
}
