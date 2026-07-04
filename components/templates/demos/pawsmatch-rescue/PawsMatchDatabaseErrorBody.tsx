import Link from "next/link";
import { PMR_PATHS } from "./pawsMatchRescueConfig";
import { PmrButton, PmrContainer, PmrIcon, PmrSectionHeading } from "./PawsMatchShared";

export function PawsMatchDatabaseErrorBody() {
  return (
    <main className="py-24">
      <PmrContainer className="max-w-xl text-center">
        <PmrIcon name="cloud_off" className="mx-auto mb-4 text-5xl text-[var(--pmr-brown-light)]" />
        <PmrSectionHeading as="h1" className="text-3xl">
          Database unavailable
        </PmrSectionHeading>
        <p className="mt-4 text-sm leading-relaxed text-[var(--pmr-brown-muted)]">
          PawsMatch Rescue needs a database connection for accounts and adoption applications.
          Check that <code className="rounded bg-[var(--pmr-bg-warm)] px-1.5 py-0.5">MONGODB_URI</code>{" "}
          is set in <code className="rounded bg-[var(--pmr-bg-warm)] px-1.5 py-0.5">.env.local</code>{" "}
          and that MongoDB is reachable.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PmrButton href={PMR_PATHS.home}>Back to home</PmrButton>
          <Link
            href={PMR_PATHS.home}
            className="pmr-focus-ring inline-flex items-center justify-center rounded-full border border-[var(--pmr-line)] px-6 py-3 text-sm font-semibold text-[var(--pmr-brown)]"
          >
            Try again later
          </Link>
        </div>
      </PmrContainer>
    </main>
  );
}
