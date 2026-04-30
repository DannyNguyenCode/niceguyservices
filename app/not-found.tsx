import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-pm-headline text-4xl font-bold tracking-tight text-base-content md:text-5xl">
        Page not found
      </h1>
      <p className="text-base-content/80">
        That link may be outdated or the page was moved. You can start again from the
        homepage or get in touch if you were looking for something specific.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-3 font-pm-headline font-semibold text-primary-content transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-base-300 px-6 py-3 font-pm-headline font-semibold text-base-content transition-colors hover:border-primary hover:text-primary"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
