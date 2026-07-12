import { Anton, Manrope } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LasFooter } from "@/components/templates/demos/spark-frame/LasFooter";
import { LasHeader } from "@/components/templates/demos/spark-frame/LasHeader";
import { LAS_SITE_NAME, LAS_TAGLINE, lasDemoMetadataTitle } from "@/components/templates/demos/spark-frame/leaveASparkConfig";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-las-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-las-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: lasDemoMetadataTitle(`${LAS_SITE_NAME} | ${LAS_TAGLINE}`),
  description:
    "Fictional editorial electrician demo — bold comic-panel aesthetic, animated cutaway hero, services, projects, resources, and contact; all placeholder copy.",
  robots: { index: false, follow: true },
};

export default function LeaveASparkLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      className={`las-root ${anton.variable} ${manrope.variable} min-h-dvh overflow-x-clip antialiased selection:bg-[var(--las-red-deep)] selection:text-[var(--las-off-white)]`}
      style={{ fontFamily: "var(--font-las-body), ui-sans-serif, system-ui, sans-serif" }}
    >
      <LasHeader />
      <div className="min-w-0 overflow-x-clip">{children}</div>
      <LasFooter />
    </div>
  );
}
