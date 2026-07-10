import type { Metadata } from "next";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import {
    pixelPageHeading,
    pricingLayoutHeadline as headline,
} from "@/components/pricing/pricingLayoutConstants";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-25" aria-hidden />
      <h1 className={`relative z-10 ${headline} text-4xl font-extrabold tracking-tight md:text-5xl ${pixelPageHeading}`}>
        Page <PixelKeyword>not found</PixelKeyword>
      </h1>
      <p className="relative z-10 text-base-content/80">
        That link may be outdated or the page was moved. You can start again from the
        homepage or get in touch if you were looking for something specific.
      </p>
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
        <PixelCtaLink
          href="/"
          color="var(--ng-btn-coral)"
          filled
          pill
        >
          Back to home
        </PixelCtaLink>
        <PixelCtaLink
          href="/contact"
          color="var(--ng-btn-sky)"
          pill
        >
          Contact
        </PixelCtaLink>
      </div>
    </div>
  );
}
